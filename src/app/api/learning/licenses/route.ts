import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { licenseTypes } from '@/data/licenses';

const CATEGORY_ALIASES: Record<string, string[]> = {
  moto: ['motorcycle', 'moto', 'cyclomoteur'],
  auto: ['automobile', 'auto', 'voiture'],
  'poids lourds': ['heavy', 'poids lourds', 'poids-lourds'],
  spécial: ['special', 'spécial'],
};

function categoryFromStatic(category: string) {
  if (category === 'motorcycle') return 'moto';
  if (category === 'automobile') return 'auto';
  if (category === 'heavy') return 'poids lourds';
  return 'spécial';
}

function staticCatalogue(category: string | null) {
  return licenseTypes
    .filter((license) => !category || categoryFromStatic(license.category) === category)
    .map((license) => ({
      id: license.id,
      code: license.shortName,
      name: license.name,
      description: license.description,
      category: categoryFromStatic(license.category),
      minAge: license.minimumAge,
      minAgeHeld: null,
      vehicles: [],
      prerequisites: license.requirements,
      duration: '',
      theoryExam: true,
      practicalExam: true,
      evaluationCriteria: [],
      icon: license.icon,
    }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.trim().toLowerCase() || null;
  const where: Record<string, unknown> = {};
  if (category) where.category = { in: CATEGORY_ALIASES[category] ?? [category] };

  try {
    const licenses = await db.licenseCategory.findMany({ where, orderBy: { code: 'asc' } });
    const dbParsed = licenses.map((l) => ({
      id: l.id, code: l.code, name: l.name, description: l.description, category: l.category,
      minAge: l.minAge, minAgeHeld: l.minAgeHeld, vehicles: safeParse(l.vehicles), prerequisites: safeParse(l.prerequisites),
      duration: l.duration, theoryExam: l.theoryExam, practicalExam: l.practicalExam,
      evaluationCriteria: safeParse(l.evaluationCriteria), icon: l.icon,
    }));
    const byCode = new Map(dbParsed.map((license) => [license.code, license]));
    for (const license of staticCatalogue(category)) if (!byCode.has(license.code)) byCode.set(license.code, license);
    const parsed = Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code, 'fr-FR'));
    return NextResponse.json({ licenses: parsed, total: parsed.length, source: dbParsed.length > 0 ? 'database+catalogue' : 'catalogue' });
  } catch (error) {
    console.error('[GET /api/learning/licenses] Database unavailable; using license catalogue:', error);
    const licenses = staticCatalogue(category);
    return NextResponse.json({ licenses, total: licenses.length, source: 'catalogue' }, { headers: { 'X-ADSO-Data-Source': 'bundled-catalogue' } });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
