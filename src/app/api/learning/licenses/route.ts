import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries as staticCountries } from '@/data/countries';

const CATEGORY_ALIASES: Record<string, string[]> = {
  moto: ['motorcycle', 'moto', 'cyclomoteur'],
  auto: ['automobile', 'auto', 'voiture'],
  'poids lourds': ['heavy', 'poids lourds', 'poids-lourds'],
  spécial: ['special', 'spécial'],
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
    const countryCode = (searchParams.get('countryCode') || 'ZZ').trim().toUpperCase();
    const aliases = category ? CATEGORY_ALIASES[category] : undefined;
    const where: Record<string, unknown> = {};
    if (category) where.category = aliases?.length ? { in: aliases } : category;

    const licenses = await db.licenseCategory.findMany({ where, orderBy: { code: 'asc' } });
    let parsed: LicenseRecord[] = licenses.map((l) => ({
      id: l.id, code: l.code, name: l.name, description: l.description, category: l.category,
      minAge: l.minAge, minAgeHeld: l.minAgeHeld, vehicles: safeParse(l.vehicles),
      prerequisites: safeParse(l.prerequisites), duration: l.duration, theoryExam: l.theoryExam,
      practicalExam: l.practicalExam, evaluationCriteria: safeParse(l.evaluationCriteria), icon: l.icon,
    }));
    let source = 'database';

    if (parsed.length === 0) {
      const country = staticCountries.find((c) => c.code === countryCode);
      const types = country?.licenseTypes ?? [];
      const filtered = category
        ? types.filter((type) => aliases?.some((alias) => type.toLowerCase().includes(alias)))
        : types;
      parsed = filtered.map((type, index): LicenseRecord => ({
        id: `${countryCode || 'ZZ'}-${type}-${index}`,
        code: type,
        name: type,
        description: `Catégorie de permis disponible dans le catalogue ADSO pour ${country?.name ?? 'le pays sélectionné'}. Les conditions officielles doivent être vérifiées auprès de l'autorité compétente.`,
        category: category || 'general', minAge: null, minAgeHeld: null, vehicles: [], prerequisites: [],
        duration: null, theoryExam: true, practicalExam: true, evaluationCriteria: [], icon: 'Car',
      }));
      source = 'catalogue';
    }

    return NextResponse.json({ licenses: parsed, total: parsed.length, source, requestedCountry: countryCode });
  } catch (error) {
    console.error('[GET /api/learning/licenses] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des catégories de permis' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
