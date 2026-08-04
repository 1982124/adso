// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Country Engine
// Country management, filtering, comparison, and regulation lookup.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import type {
  CountryData,
  SpeedLimits,
  CountryComparison,
  ContinentInfo,
  SortDirection,
} from './types';

/**
 * Parse a JSON string field from country data into a typed array.
 * Falls back to an empty array if the value is invalid.
 */
function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Filter countries by continent.
 * @param countries - Array of country data
 * @param continent - Continent name to filter by (e.g., "Europe", "Africa")
 * @returns Filtered array of countries matching the continent
 */
export function getCountriesByContinent(countries: CountryData[], continent: string): CountryData[] {
  const normalized = continent.trim().toLowerCase();
  return countries.filter((c) => c.continent.toLowerCase() === normalized);
}

/**
 * Search countries by name, capital, or ISO code.
 * Case-insensitive partial match on all three fields.
 * @param countries - Array of country data
 * @param query - Search query string
 * @returns Matching countries sorted by relevance (name first, then capital)
 */
export function searchCountries(countries: CountryData[], query: string): CountryData[] {
  const q = query.trim().toLowerCase();
  if (!q) return countries;

  return countries.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const capitalMatch = c.capital.toLowerCase().includes(q);
    const codeMatch = c.code.toLowerCase().includes(q);
    return nameMatch || capitalMatch || codeMatch;
  });
}

/**
 * Compare two countries side-by-side on key driving regulations.
 * Returns an array of comparison items showing values from both countries.
 * @param codeA - ISO code of the first country
 * @param codeB - ISO code of the second country
 * @param countries - Array of all country data
 * @returns Array of comparison items (empty if either country not found)
 */
export function compareCountries(
  codeA: string,
  codeB: string,
  countries: CountryData[]
): CountryComparison[] {
  const a = countries.find((c) => c.code.toUpperCase() === codeA.toUpperCase());
  const b = countries.find((c) => c.code.toUpperCase() === codeB.toUpperCase());

  if (!a || !b) return [];

  return [
    { field: 'Name', countryA: a.name, countryB: b.name },
    { field: 'Continent', countryA: a.continent, countryB: b.continent },
    { field: 'Driving Side', countryA: a.drivingSide, countryB: b.drivingSide },
    { field: 'Min Age', countryA: a.minAge, countryB: b.minAge },
    { field: 'Speed Urban (km/h)', countryA: a.speedUrban, countryB: b.speedUrban },
    { field: 'Speed Rural (km/h)', countryA: a.speedRural, countryB: b.speedRural },
    { field: 'Speed Highway (km/h)', countryA: a.speedHighway, countryB: b.speedHighway },
    { field: 'Blood Alcohol (g/L)', countryA: a.bloodAlcohol, countryB: b.bloodAlcohol },
    { field: 'Emergency Phone', countryA: a.emergencyPhone, countryB: b.emergencyPhone },
    { field: 'Authority', countryA: a.authority, countryB: b.authority },
  ];
}

/**
 * Get structured speed limits for a country.
 * @param country - Country data
 * @returns Object with urban, rural, and highway speed limits
 */
export function getSpeedLimits(country: CountryData): SpeedLimits {
  return {
    urban: country.speedUrban,
    rural: country.speedRural,
    highway: country.speedHighway,
  };
}

/**
 * Get the list of required documents for driving in a country.
 * Parses the JSON string field into an array of strings.
 * @param country - Country data
 * @returns Array of required document descriptions
 */
export function getRequiredDocuments(country: CountryData): string[] {
  return parseJsonArray(country.requiredDocuments);
}

/**
 * Get the list of required equipment in a vehicle.
 * Parses the JSON string field into an array of strings.
 * @param country - Country data
 * @returns Array of required equipment descriptions
 */
export function getRequiredEquipment(country: CountryData): string[] {
  return parseJsonArray(country.requiredEquipment);
}

/**
 * Get the list of sanctions / penalties for driving infractions.
 * Parses the JSON string field into an array of strings.
 * @param country - Country data
 * @returns Array of sanction descriptions
 */
export function getSanctions(country: CountryData): string[] {
  return parseJsonArray(country.sanctions);
}

/**
 * Get the list of common driving infractions for a country.
 * Parses the JSON string field into an array of strings.
 * @param country - Country data
 * @returns Array of common infraction descriptions
 */
export function getCommonInfractions(country: CountryData): string[] {
  return parseJsonArray(country.commonInfractions);
}

/**
 * Format a blood alcohol concentration value with unit.
 * @param value - BAC value in g/L
 * @returns Formatted string, e.g., "0.5 g/L" or "0.00 g/L"
 */
export function formatBloodAlcohol(value: number): string {
  return `${value.toFixed(2)} g/L`;
}

/**
 * Get a list of unique continents with the number of countries in each.
 * @param countries - Array of country data
 * @returns Array of continent info objects sorted alphabetically
 */
export function getContinentList(countries: CountryData[]): ContinentInfo[] {
  const map = new Map<string, number>();

  for (const c of countries) {
    const name = c.continent;
    map.set(name, (map.get(name) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort countries by a given field in ascending or descending order.
 * Supports string and numeric fields.
 * @param countries - Array of country data
 * @param field - Field name to sort by
 * @param direction - 'asc' or 'desc' (default: 'asc')
 * @returns New sorted array
 */
export function sortByField<T extends CountryData>(
  countries: T[],
  field: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  const sorted = [...countries];
  sorted.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    if (typeof valA === 'string' && typeof valB === 'string') {
      const cmp = valA.localeCompare(valB);
      return direction === 'asc' ? cmp : -cmp;
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    return 0;
  });
  return sorted;
}
