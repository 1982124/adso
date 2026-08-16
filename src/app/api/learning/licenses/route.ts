import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as staticCountries } from '@/data/countries';

const CATEGORY_ALIASES: Record<string, string[]> = {
  moto: ['motorcycle', 'moto', 'cyclomoteur'],
  auto: ['automobile', 'auto', 'voiture'],
  'poids lourds': ['heavy', 'poids lourds', 'poids-lourds'],
  spécial: ['special', 'spécial'],
};

const LICENSE_LABELS: Record<string, string> = {
  auto: 'Automobile', moto: 'Motocyclette', 'moto-lourde': 'Motocyclette lourde',
  'poids-lourds': 'Poids lourds', 'poids-lourds-remorque': 'Poids lourds avec remorque',
  'transport-personnes': 'Transport de personnes', 'transport-marchandises': 'Transport de marchandises',
};

type LicenseRecord = {
  id: string; code: string; name: string; description: string; category: string;
  minAge: number | null; minAgeHeld: number | null; vehicles: unknown; prerequisites: unknown;
  duration: number | null; theoryExam: boolean; practicalExam: boolean; evaluationCriteria: unknown; icon: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')?.trim().toLowerCase() || null;
    const countryCode = (searchParams.get('countryCode') || '').trim().toUpperCase();
    const country = countryCode ? staticCountries.find((c) => c.code === countryCode) : undefined;
    const aliases = category ? CATEGORY_ALIASES[category] : undefined;

    // A selected country must never be served generic/global license records as if they were national law.
    if (country) {
      const types = category
        ? country.licenseTypes.filter((type) => aliases?.some((alias) => type.toLowerCase().includes(alias)))
        : country.licenseTypes;
      const licenses: LicenseRecord[] = types.map((type, index) => ({
        id: `${country.code}-${type}-${index}`,
        code: type,
        name: LICENSE_LABELS[type] || type,
        description: `Catégorie de permis référencée pour ${country.name} dans le catalogue ADSO. Les conditions d'âge, d'examen, de validité et les catégories exactes doivent être vérifiées auprès de l'autorité nationale compétente.`,
        category: type, minAge: null, minAgeHeld: null, vehicles: [], prerequisites: [],
        duration: null, theoryExam: true, practicalExam: true, evaluationCriteria: [],
        icon: type.includes('moto') ? 'Bike' : type.includes('poids') ? 'Truck' : type.includes('transport') ? 'Bus' : 'Car',
      }));
      return NextResponse.json({ licenses, total: licenses.length, source: 'catalogue-national', requestedCountry: countryCode });
    }

    // Without a country, global reference records are acceptable.
    const where: Record<string, unknown> = {};
    if (category) where.category = aliases?.length ? { in: aliases } : category;
    const records = await db.licenseCategory.findMany({ where, orderBy: { code: 'asc' } });
    const licenses: LicenseRecord[] = records.map((l) => ({
      id: l.id, code: l.code, name: l.name, description: l.description, category: l.category,
      minAge: l.minAge, minAgeHeld: l.minAgeHeld, vehicles: safeParse(l.vehicles), prerequisites: safeParse(l.prerequisites),
      duration: l.duration, theoryExam: l.theoryExam, practicalExam: l.practicalExam,
      evaluationCriteria: safeParse(l.evaluationCriteria), icon: l.icon,
    }));
    return NextResponse.json({ licenses, total: licenses.length, source: 'database-global', requestedCountry: null });
  } catch (error) {
    console.error('[GET /api/learning/licenses] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des catégories de permis' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
