import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedCountries } from '../../../../seed-data/seed-countries';
import { seedLicenseCategories } from '../../../../seed-data/seed-licenses';
import { seedRoadSigns } from '../../../../seed-data/seed-signs';
import { seedQuestions } from '../../../../seed-data/seed-questions';
import { seedPracticalExercises } from '../../../../seed-data/seed-practical';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = (body as { action?: string }).action;

    if (action === 'practical') {
      // Seed practical exercises only
      const existing = await db.practicalExercise.count();
      if (existing > 0) {
        return NextResponse.json({
          seeded: true,
          message: `Exercices pratiques déjà présents (${existing})`,
          count: existing,
        });
      }

      for (const exercise of seedPracticalExercises) {
        await db.practicalExercise.create({ data: exercise });
      }

      const count = await db.practicalExercise.count();
      return NextResponse.json({
        seeded: true,
        action: 'practical',
        count,
      });
    }

    // Default: seed everything
    const [existingCountries, existingLicenses, existingSigns, existingQuestions] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
    ]);

    // Seed countries
    if (existingCountries === 0) {
      for (const country of seedCountries) {
        await db.country.create({ data: country });
      }
    }

    // Seed licenses
    if (existingLicenses === 0) {
      for (const license of seedLicenseCategories) {
        await db.licenseCategory.create({ data: license });
      }
    }

    // Seed signs
    if (existingSigns === 0) {
      for (const sign of seedRoadSigns) {
        await db.roadSign.create({ data: sign });
      }
    }

    // Seed questions
    if (existingQuestions === 0) {
      for (const question of seedQuestions) {
        await db.question.create({ data: question });
      }
    }

    // Seed practical exercises
    const existingPractical = await db.practicalExercise.count();
    if (existingPractical === 0) {
      for (const exercise of seedPracticalExercises) {
        await db.practicalExercise.create({ data: exercise });
      }
    }

    const [countries, licenses, signs, questions, practical] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
      db.practicalExercise.count(),
    ]);

    return NextResponse.json({
      seeded: true,
      counts: { countries, licenses, signs, questions, practical },
    });
  } catch (error) {
    console.error('[POST /api/seed] Error:', error);
    return NextResponse.json({ error: 'Seed error' }, { status: 500 });
  }
}

// GET — Return current DB counts
export async function GET() {
  try {
    const [countries, licenses, signs, questions, practical] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
      db.practicalExercise.count(),
    ]);

    return NextResponse.json({
      counts: { countries, licenses, signs, questions, practical },
    });
  } catch (error) {
    console.error('[GET /api/seed] Error:', error);
    return NextResponse.json({ error: 'Seed error' }, { status: 500 });
  }
}
