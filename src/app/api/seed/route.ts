import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Seed route — returns current DB counts (data already seeded)
export async function POST() {
  try {
    const [countries, licenses, signs, questions] = await Promise.all([
      db.country.count(),
      db.licenseCategory.count(),
      db.roadSign.count(),
      db.question.count(),
    ]);

    return NextResponse.json({
      seeded: true,
      counts: { countries, licenses, signs, questions },
    });
  } catch (error) {
    console.error('[POST /api/seed] Error:', error);
    return NextResponse.json({ error: 'Seed error' }, { status: 500 });
  }
}
