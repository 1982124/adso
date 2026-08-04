import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    // Default to FR if no countryCode provided
    if (countryCode) {
      where.countryCode = countryCode;
    } else {
      where.countryCode = 'FR';
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const signs = await db.roadSign.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Parse JSON fields
    const parsed = signs.map((s) => ({
      id: s.id,
      countryCode: s.countryCode,
      category: s.category,
      subcategory: s.subcategory,
      name: s.name,
      description: s.description,
      meaning: s.meaning,
      useCase: s.useCase,
      shape: s.shape,
      colors: safeParse(s.colors),
      questions: safeParse(s.questions),
    }));

    return NextResponse.json({
      signs: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error('[GET /api/learning/signs] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des panneaux' },
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
