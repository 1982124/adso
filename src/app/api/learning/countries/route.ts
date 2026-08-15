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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const continent = searchParams.get('continent');
    const search = searchParams.get('search')?.trim() ?? '';
    const normalizedSearch = normalize(search);

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

    const staticFiltered = staticCountries
      .filter((country) => !continent || country.region === continent)
      .filter((country) => {
        if (!normalizedSearch) return true;
        const haystack = [country.name, country.code, country.region, ...country.languages].map(normalize);
        return haystack.some((value) => value.includes(normalizedSearch));
      })
      .map(fromStaticCountry);

    let parsed: CountryResponse[] = normalizedSearch
      ? dbParsed.filter((country) => {
          const haystack = [country.name, country.code, country.capital]
            .filter(Boolean)
            .map((value) => normalize(String(value)));
          return haystack.some((value) => value.includes(normalizedSearch));
        })
      : dbParsed;

    // The database is the authoritative source when populated, but the bundled
    // catalogue is a mandatory resilience fallback. This prevents the country
    // selector from disappearing during a cold start, migration, empty DB, or
    // transient database failure.
    if (parsed.length === 0) {
      parsed = staticFiltered;
    }

    return NextResponse.json({
      countries: parsed,
      total: parsed.length,
      searched: search || null,
      source: dbParsed.length > 0 && parsed === dbParsed ? 'database' : 'catalogue',
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[GET /api/learning/countries] Error:', error);

    // Never let a transient DB failure blank the country selector.
    const { searchParams } = new URL(request.url);
    const continent = searchParams.get('continent');
    const search = searchParams.get('search')?.trim() ?? '';
    const normalizedSearch = normalize(search);
    const fallback = staticCountries
      .filter((country) => !continent || country.region === continent)
      .filter((country) => {
        if (!normalizedSearch) return true;
        return [country.name, country.code, country.region, ...country.languages]
          .map(normalize)
          .some((value) => value.includes(normalizedSearch));
      })
      .map(fromStaticCountry);

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
