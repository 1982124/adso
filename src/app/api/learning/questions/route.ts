import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const countParam = searchParams.get('count');
    const licenseCode = searchParams.get('licenseCode');
    const excludeParam = searchParams.get('exclude');

    const count = countParam ? parseInt(countParam, 10) : 10;
    const excludeIds = excludeParam
      ? excludeParam.split(',').map((id) => id.trim()).filter(Boolean)
      : [];

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

    if (excludeIds.length > 0) {
      where.id = { notIn: excludeIds };
    }

    const questions = await db.question.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    // Shuffle with Fisher-Yates and take the requested count
    const shuffled = shuffleArray(questions);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Parse options from JSON string
    const parsed = selected.map((q) => {
      let parsedOptions: string[];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [q.options];
      }

      return {
        id: q.id,
        countryCode: q.countryCode,
        licenseCode: q.licenseCode,
        question: q.question,
        options: parsedOptions,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        theme: q.theme,
        tags: safeParse(q.tags),
        reference: q.reference,
        hasImage: q.hasImage,
      };
    });

    return NextResponse.json({
      questions: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error('[GET /api/learning/questions] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des questions' },
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
