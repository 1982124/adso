// ADSO — Africa road-safety burden snapshot.
// Source: WHO Global Health Estimates 2021, published/updated by WHO in 2024
// and distributed through Our World in Data. Values are estimates, not police-reported counts.
// Accidents and non-fatal injuries are intentionally nullable because there is no single
// comparable, country-complete international dataset for those two measures in this source.
// Never invent missing figures; the UI labels them as unavailable and keeps the country visible.

export interface AfricaRoadSafetyStats {
  year: number;
  estimatedDeaths: number;
  accidents: number | null;
  injuries: number | null;
  deathsType: 'estimated';
  source: string;
  sourceUrl: string;
  availabilityNote?: string;
}

const WHO_GHE_SOURCE = 'OMS — Global Health Estimates 2021 (mise à jour 2024), via Our World in Data';
const WHO_GHE_URL = 'https://ourworldindata.org/grapher/deaths-from-road-injuries';
const UNAVAILABLE_NOTE = 'Chiffre comparable non disponible dans cette source internationale ; à enrichir avec une source nationale fiable.';

export const africaRoadSafetyStats: Record<string, AfricaRoadSafetyStats> = {
  DZ: { year: 2021, estimatedDeaths: 8110, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  AO: { year: 2021, estimatedDeaths: 5190, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  BJ: { year: 2021, estimatedDeaths: 3230, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  BW: { year: 2021, estimatedDeaths: 426, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  BF: { year: 2021, estimatedDeaths: 6140, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  BI: { year: 2021, estimatedDeaths: 1550, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CV: { year: 2021, estimatedDeaths: 97, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CM: { year: 2021, estimatedDeaths: 2870, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CF: { year: 2021, estimatedDeaths: 1430, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  TD: { year: 2021, estimatedDeaths: 4530, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  KM: { year: 2021, estimatedDeaths: 238, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CG: { year: 2021, estimatedDeaths: 562, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CD: { year: 2021, estimatedDeaths: 15620, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  DJ: { year: 2021, estimatedDeaths: 258, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  EG: { year: 2021, estimatedDeaths: 10260, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GQ: { year: 2021, estimatedDeaths: 227, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ER: { year: 2021, estimatedDeaths: 640, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SZ: { year: 2021, estimatedDeaths: 295, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ET: { year: 2021, estimatedDeaths: 21260, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GA: { year: 2021, estimatedDeaths: 395, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GM: { year: 2021, estimatedDeaths: 582, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GH: { year: 2021, estimatedDeaths: 8490, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GN: { year: 2021, estimatedDeaths: 5060, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  GW: { year: 2021, estimatedDeaths: 629, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  CI: { year: 2021, estimatedDeaths: 5670, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  KE: { year: 2021, estimatedDeaths: 14930, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  LS: { year: 2021, estimatedDeaths: 492, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  LR: { year: 2021, estimatedDeaths: 792, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  LY: { year: 2021, estimatedDeaths: 2290, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MG: { year: 2021, estimatedDeaths: 6510, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MW: { year: 2021, estimatedDeaths: 4020, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ML: { year: 2021, estimatedDeaths: 4430, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MR: { year: 2021, estimatedDeaths: 457, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MU: { year: 2021, estimatedDeaths: 124, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MA: { year: 2021, estimatedDeaths: 6900, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  MZ: { year: 2021, estimatedDeaths: 6450, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  NA: { year: 2021, estimatedDeaths: 557, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  NE: { year: 2021, estimatedDeaths: 6280, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  NG: { year: 2021, estimatedDeaths: 36700, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  RW: { year: 2021, estimatedDeaths: 1560, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ST: { year: 2021, estimatedDeaths: 26, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SN: { year: 2021, estimatedDeaths: 3500, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SC: { year: 2021, estimatedDeaths: 7, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SL: { year: 2021, estimatedDeaths: 1170, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SO: { year: 2021, estimatedDeaths: 3440, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ZA: { year: 2021, estimatedDeaths: 14530, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SS: { year: 2021, estimatedDeaths: 2500, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  SD: { year: 2021, estimatedDeaths: 8970, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  TZ: { year: 2021, estimatedDeaths: 10050, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  TG: { year: 2021, estimatedDeaths: 1960, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  TN: { year: 2021, estimatedDeaths: 2000, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  UG: { year: 2021, estimatedDeaths: 7320, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ZM: { year: 2021, estimatedDeaths: 3340, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
  ZW: { year: 2021, estimatedDeaths: 4780, accidents: null, injuries: null, deathsType: 'estimated', source: WHO_GHE_SOURCE, sourceUrl: WHO_GHE_URL, availabilityNote: UNAVAILABLE_NOTE },
};

export const AFRICA_ROAD_SAFETY_STATS_COUNT = Object.keys(africaRoadSafetyStats).length;
