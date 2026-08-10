import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CATEGORY_ALIASES: Record<string, string[]> = {
  moto: ['motorcycle', 'moto', 'cyclomoteur'],
  auto: ['automobile', 'auto', 'voiture'],
  'poids lourds': ['heavy', 'poids lourds', 'poids-lourds'],
  spécial: ['special', 'spécial'],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')?.trim().toLowerCase() || null;

    const where: Record<string, unknown> = {};

    if (category) {
      const aliases = CATEGORY_ALIASES[category];
      where.category = aliases?.length === 1 ? aliases[0] : { in: aliases ?? [category] };
    }

    const licenses = await db.licenseCategory.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    const parsed = licenses.map((l) => ({
      id: l.id,
      code: l.code,
      name: l.name,
      description: l.description,
      category: l.category,
      minAge: l.minAge,
      minAgeHeld: l.minAgeHeld,
      vehicles: safeParse(l.vehicles),
      prerequisites: safeParse(l.prerequisites),
      duration: l.duration,
      theoryExam: l.theoryExam,
      practicalExam: l.practicalExam,
      evaluationCriteria: safeParse(l.evaluationCriteria),
      icon: l.icon,
    }));

    return NextResponse.json({
      licenses: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error('[GET /api/learning/licenses] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des catégories de permis' },
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
