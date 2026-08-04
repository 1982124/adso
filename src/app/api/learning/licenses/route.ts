import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    const licenses = await db.licenseCategory.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    // Parse JSON fields
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
