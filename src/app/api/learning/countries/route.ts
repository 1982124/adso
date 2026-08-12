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

    let parsed: CountryResponse[] = normalizedSearch
      ? dbParsed.filter((country) => {
          const haystack = [country.name, country.code, country.capital]
            .filter(Boolean)
            .map((value) => normalize(String(value)));
          return haystack.some((value) => value.includes(normalizedSearch));
        })
      : dbParsed;

    if (normalizedSearch && parsed.length === 0) {
      parsed = staticCountries
        .filter((country) => {
          const haystack = [country.name, country.code, country.region, ...country.languages]
            .map(normalize);
          return haystack.some((value) => value.includes(normalizedSearch));
        })
        .map((country): CountryResponse => ({
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
        }));
    }

    return NextResponse.json({
      countries: parsed,
      total: parsed.length,
      searched: search || null,
      source: dbParsed.length > 0 ? 'database' : 'catalogue',
    });
  } catch (error) {
    console.error('[GET /api/learning/countries] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des pays' },
      { status: 500 }
    );
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
