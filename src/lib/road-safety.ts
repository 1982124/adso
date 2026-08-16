export type RoadSafetyYear = {
  countryCode: string;
  countryName: string;
  year: number;
  ratePer100k: number;
};

export type RoadSafetySummary = {
  countryCode: string;
  countryName: string;
  lowest: RoadSafetyYear | null;
  highest: RoadSafetyYear | null;
  source: string;
  youth: {
    available: boolean;
    percentage: number | null;
    ageFrom: number | null;
    ageTo: number | null;
    year: number | null;
    source: string;
  };
};

type WorldBankRow = {
  value?: unknown;
  date?: unknown;
  countryiso3code?: unknown;
  country?: { value?: unknown };
};

const WORLD_BANK_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SH.STA.TRAF.P5?format=json&per_page=20000";

export async function getRoadSafetySummaries(): Promise<RoadSafetySummary[]> {
  const response = await fetch(WORLD_BANK_URL, {
    next: { revalidate: 86400 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Road safety data provider returned ${response.status}`);
  }

  const payload = (await response.json()) as [unknown, WorldBankRow[] | undefined];
  const rows = Array.isArray(payload?.[1]) ? payload[1] : [];
  const grouped = new Map<string, RoadSafetyYear[]>();

  for (const row of rows) {
    const value = typeof row.value === "number" ? row.value : Number(row.value);
    const year = Number(row.date);
    const countryCode = typeof row.countryiso3code === "string" ? row.countryiso3code : "";
    const countryName = typeof row.country?.value === "string" ? row.country.value : "";
    if (!countryCode || !countryName || !Number.isFinite(value) || !Number.isFinite(year)) continue;
    const item = { countryCode, countryName, year, ratePer100k: value };
    const list = grouped.get(countryCode) ?? [];
    list.push(item);
    grouped.set(countryCode, list);
  }

  return [...grouped.values()].map((history) => {
    history.sort((a, b) => a.year - b.year);
    const lowest = history.reduce((a, b) => (b.ratePer100k < a.ratePer100k ? b : a));
    const highest = history.reduce((a, b) => (b.ratePer100k > a.ratePer100k ? b : a));
    return {
      countryCode: history[0].countryCode,
      countryName: history[0].countryName,
      lowest,
      highest,
      source: "World Bank WDI / WHO Global Health Observatory (SH.STA.TRAF.P5)",
      youth: {
        available: false,
        percentage: null,
        ageFrom: null,
        ageTo: null,
        year: null,
        source: "WHO Mortality Database — country/year age-specific extraction required before publication",
      },
    };
  });
}
