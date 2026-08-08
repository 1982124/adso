import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const licenseCode = searchParams.get('licenseCode');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (licenseCode) {
      where.licenseCode = licenseCode;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const exercises = await db.practicalExercise.findMany({
      where,
      orderBy: [{ category: 'asc' }, { difficulty: 'asc' }, { title: 'asc' }],
    });

    const parsed = exercises.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      difficulty: e.difficulty,
      objectives: safeParse(e.objectives),
      steps: safeParse(e.steps),
      criteria: safeParse(e.criteria),
      tips: safeParse(e.tips),
      scoring: safeParse(e.scoring),
      countryCode: e.countryCode,
      licenseCode: e.licenseCode,
    }));

    return NextResponse.json({
      exercises: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error('[GET /api/learning/practical] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des exercices pratiques' },
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
