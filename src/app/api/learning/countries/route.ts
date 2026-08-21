import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as staticCountries } from '@/data/countries';
import { africaCountryDirectory } from '@/data/africa-country-directory';
import { africaRoadSafetyStats } from '@/data/africa-road-safety-stats';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr-FR').replace(/[’']/g, '').trim();
}

type CountryResponse = Record<string, unknown>;

function roadSafetyFor(code: string) {
  return africaRoadSafetyStats[code] ?? null;
}

function withRoadSafety(country: CountryResponse): CountryResponse {
  const code = String(country.code ?? '');
  return { ...country, roadSafety: roadSafetyFor(code) };
}

function fromStaticCountry(country: (typeof staticCountries)[number]): CountryResponse {
  return withRoadSafety({ id: country.code, code: country.code, name: country.name, flag: country.flag, continent: country.region, capital: '', languages: country.languages, currency: country.currency, drivingSide: country.drivingSide, authority: '', emergencyPhone: '', minAge: 18, speedUrban: null, speedRural: null, speedHighway: null, bloodAlcohol: null, requiredDocuments: [], requiredEquipment: [], specialFeatures: [], licenseCategories: country.licenseTypes, commonInfractions: [], sanctions: [] });
}

function fromDirectoryCountry(country: (typeof africaCountryDirectory)[number]): CountryResponse {
  return withRoadSafety({ id: country.code, code: country.code, name: country.name, flag: country.flag, continent: 'Afrique', capital: '', languages: [], currency: null, drivingSide: country.drivingSide, authority: '', emergencyPhone: '', minAge: null, speedUrban: null, speedRural: null, speedHighway: null, bloodAlcohol: null, requiredDocuments: [], requiredEquipment: [], specialFeatures: ['Profil pays disponible pour le parcours ADSO ; les détails réglementaires peuvent être enrichis progressivement.'], licenseCategories: [], commonInfractions: [], sanctions: [] });
}

function filterCatalogue(search: string, continent: string | null): CountryResponse[] {
  const normalizedSearch = normalize(search);
  const entries = continent === 'Afrique' ? africaCountryDirectory.map(fromDirectoryCountry) : staticCountries.map(fromStaticCountry);
  return entries.filter((country) => {
    if (!normalizedSearch) return true;
    return [country.name, country.code, country.continent].filter(Boolean).map((value) => normalize(String(value))).some((value) => value.includes(normalizedSearch));
  });
}

function isUnverifiedCountryRecord(country: CountryResponse): boolean {
  const specialFeatures = country.specialFeatures;
  return typeof specialFeatures === 'string' && specialFeatures.includes('Country Pack créé — données réglementaires à vérifier');
}

function mergeAfricanDirectory(databaseResults: CountryResponse[]): CountryResponse[] {
  const databaseByCode = new Map(databaseResults.map((country) => [String(country.code), country]));
  const merged = africaCountryDirectory.map((entry) => {
    const databaseCountry = databaseByCode.get(entry.code);
    // An incomplete database record must never surface zero/placeholder regulatory values.
    // Keep the country visible, but use the neutral directory profile until its pack is verified.
    return withRoadSafety(databaseCountry && !isUnverifiedCountryRecord(databaseCountry) ? databaseCountry : fromDirectoryCountry(entry));
  });
  const extraDatabaseCountries = databaseResults.filter((country) => !africaCountryDirectory.some((entry) => entry.code === country.code)).map(withRoadSafety);
  return [...merged, ...extraDatabaseCountries].sort((a, b) => String(a.name).localeCompare(String(b.name), 'fr'));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const continent = searchParams.get('continent');
  const search = searchParams.get('search')?.trim() ?? '';
  const normalizedSearch = normalize(search);

  try {
    const where: Record<string, unknown> = {};
    if (continent) where.continent = continent;
    const dbCountries = await db.country.findMany({ where, orderBy: [{ continent: 'asc' }, { name: 'asc' }] });
    const dbParsed: CountryResponse[] = dbCountries.map((c) => withRoadSafety({ id: c.id, code: c.code, name: c.name, flag: c.flag, continent: c.continent, capital: c.capital, languages: safeParse(c.languages), currency: safeParse(c.currency), drivingSide: c.drivingSide, authority: c.authority, emergencyPhone: c.emergencyPhone, minAge: c.minAge, speedUrban: c.speedUrban, speedRural: c.speedRural, speedHighway: c.speedHighway, bloodAlcohol: c.bloodAlcohol, requiredDocuments: safeParse(c.requiredDocuments), requiredEquipment: safeParse(c.requiredEquipment), specialFeatures: safeParse(c.specialFeatures), licenseCategories: safeParse(c.licenseCategories), commonInfractions: safeParse(c.commonInfractions), sanctions: safeParse(c.sanctions) }));

    let results: CountryResponse[];
    let source: string;
    if (continent === 'Afrique') {
      // The complete African directory is always the presentation baseline.
      // Database content enriches a country when available; it never removes it.
      results = mergeAfricanDirectory(dbParsed);
      source = 'database+africa-directory+road-safety-stats';
    } else if (dbParsed.length > 0) {
      results = dbParsed;
      source = 'database+road-safety-stats';
    } else {
      results = filterCatalogue(search, continent);
      source = 'catalogue-fallback+road-safety-stats';
    }

    if (normalizedSearch) {
      results = results.filter((country) => [country.name, country.code, country.capital].filter(Boolean).map((value) => normalize(String(value))).some((value) => value.includes(normalizedSearch)));
    }

    return NextResponse.json({ countries: results, total: results.length, africaTotal: africaCountryDirectory.length, roadSafetyStatsTotal: Object.keys(africaRoadSafetyStats).length, searched: search || null, source }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[GET /api/learning/countries] Error:', error);
    const fallback = filterCatalogue(search, continent);
    return NextResponse.json({ countries: fallback, total: fallback.length, africaTotal: africaCountryDirectory.length, roadSafetyStatsTotal: Object.keys(africaRoadSafetyStats).length, searched: search || null, source: 'catalogue-fallback+road-safety-stats' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
