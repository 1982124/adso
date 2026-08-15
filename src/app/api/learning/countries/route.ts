import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as staticCountries } from '@/data/countries';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/[’']/g, '')
    .trim();
}

type CountryResponse = Record<string, unknown>;

function fromStaticCountry(country: (typeof staticCountries)[number]): CountryResponse {
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

function filterCatalogue(search: string, continent: string | null): CountryResponse[] {
  const normalizedSearch = normalize(search);
  return staticCountries
    .filter((country) => !continent || country.region === continent)
    .filter((country) => {
      if (!normalizedSearch) return true;
      return [country.name, country.code, country.region, ...country.languages]
        .map(normalize)
        .some((value) => value.includes(normalizedSearch));
    })
    .map(fromStaticCountry);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const continent = searchParams.get('continent');
  const search = searchParams.get('search')?.trim() ?? '';
  const normalizedSearch = normalize(search);

  try {
    const where: Record<string, unknown> = {};
    if (continent) where.continent = continent;

    const dbCountries = await db.country.findMany({
      where,
      orderBy: [{ continent: 'asc' }, { name: 'asc' }],
    });

    const dbParsed: CountryResponse[] = dbCountries.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      flag: c.flag,
      continent: c.continent,
      capital: c.capital,
      languages: safeParse(c.languages),
      currency: safeParse(c.currency),
      drivingSide: c.drivingSide,
      authority: c.authority,
      emergencyPhone: c.emergencyPhone,
      minAge: c.minAge,
      speedUrban: c.speedUrban,
      speedRural: c.speedRural,
      speedHighway: c.speedHighway,
      bloodAlcohol: c.bloodAlcohol,
      requiredDocuments: safeParse(c.requiredDocuments),
      requiredEquipment: safeParse(c.requiredEquipment),
      specialFeatures: safeParse(c.specialFeatures),
      licenseCategories: safeParse(c.licenseCategories),
      commonInfractions: safeParse(c.commonInfractions),
      sanctions: safeParse(c.sanctions),
    }));

    const databaseResults = normalizedSearch
      ? dbParsed.filter((country) => {
          const haystack = [country.name, country.code, country.capital]
            .filter(Boolean)
            .map((value) => normalize(String(value)));
          return haystack.some((value) => value.includes(normalizedSearch));
        })
      : dbParsed;

    // Database is authoritative only when it actually contains usable results.
    // Never allow an empty/mis-seeded DB to make the country selector disappear.
    if (databaseResults.length > 0) {
      return NextResponse.json({
        countries: databaseResults,
        total: databaseResults.length,
        searched: search || null,
        source: 'database',
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const catalogue = filterCatalogue(search, continent);
    return NextResponse.json({
      countries: catalogue,
      total: catalogue.length,
      searched: search || null,
      source: 'catalogue',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[GET /api/learning/countries] Error:', error);

    // Country selection is a critical UX path. A transient DB failure must never
    // turn into an empty selector or a 5xx response.
    const fallback = filterCatalogue(search, continent);
    return NextResponse.json({
      countries: fallback,
      total: fallback.length,
      searched: search || null,
      source: 'catalogue-fallback',
    }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
