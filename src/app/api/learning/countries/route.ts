import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as staticCountries } from '@/data/countries';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr-FR').replace(/[’']/g, '').trim();
}

function mapStaticCountry(country: (typeof staticCountries)[number]) {
  return {
    id: country.code,
    code: country.code,
    name: country.name,
    flag: country.flag,
    continent: country.region,
    capital: '',
    languages: country.languages,
    currency: country.currency,
    drivingSide: country.drivingSide,
    authority: '',
    emergencyPhone: '',
    minAge: 18,
    speedUrban: 50,
    speedRural: 90,
    speedHighway: 120,
    bloodAlcohol: '',
    requiredDocuments: [],
    requiredEquipment: [],
    specialFeatures: [],
    licenseCategories: country.licenseTypes,
    commonInfractions: [],
    sanctions: [],
  };
}

function filterStatic(continent: string, normalizedSearch: string) {
  return staticCountries
    .filter((country) => !continent || country.region === continent)
    .filter((country) => !normalizedSearch || [country.name, country.code, country.region, ...country.languages].map(normalize).some((value) => value.includes(normalizedSearch)))
    .map(mapStaticCountry);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const continent = searchParams.get('continent')?.trim() || '';
  const search = searchParams.get('search')?.trim() ?? '';
  const normalizedSearch = normalize(search);

  try {
    const dbCountries = await db.country.findMany({
      where: continent ? { continent } : {},
      orderBy: [{ continent: 'asc' }, { name: 'asc' }],
    });

    const dbParsed = dbCountries.map((c) => ({
      id: c.id, code: c.code, name: c.name, flag: c.flag, continent: c.continent,
      capital: c.capital, languages: safeParse(c.languages), currency: safeParse(c.currency),
      drivingSide: c.drivingSide, authority: c.authority, emergencyPhone: c.emergencyPhone,
      minAge: c.minAge, speedUrban: c.speedUrban, speedRural: c.speedRural, speedHighway: c.speedHighway,
      bloodAlcohol: c.bloodAlcohol, requiredDocuments: safeParse(c.requiredDocuments),
      requiredEquipment: safeParse(c.requiredEquipment), specialFeatures: safeParse(c.specialFeatures),
      licenseCategories: safeParse(c.licenseCategories), commonInfractions: safeParse(c.commonInfractions), sanctions: safeParse(c.sanctions),
    }));

    const byCode = new Map(dbParsed.filter((country) => !normalizedSearch || [country.name, country.code, country.capital].filter(Boolean).map((value) => normalize(String(value))).some((value) => value.includes(normalizedSearch))).map((country) => [country.code, country]));
    for (const country of filterStatic(continent, normalizedSearch)) if (!byCode.has(country.code)) byCode.set(country.code, country);

    const parsed = Array.from(byCode.values()).sort((a, b) => `${a.continent}:${a.name}`.localeCompare(`${b.continent}:${b.name}`, 'fr-FR'));
    return NextResponse.json({ countries: parsed, total: parsed.length, searched: search || null, source: dbParsed.length > 0 ? 'database+catalogue' : 'catalogue' });
  } catch (error) {
    console.error('[GET /api/learning/countries] Database unavailable; using country catalogue:', error);
    const countries = filterStatic(continent, normalizedSearch);
    return NextResponse.json({ countries, total: countries.length, searched: search || null, source: 'catalogue' }, { headers: { 'X-ADSO-Data-Source': 'bundled-catalogue' } });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
