import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { countries } from '@/data/countries';
import { licenseTypes } from '@/data/licenses';
import { seedRoadSigns } from '../../../../../seed-data/seed-signs';
import { seedQuestions } from '../../../../../seed-data/seed-questions';
import { seedPracticalExercises } from '../../../../../seed-data/seed-practical';
import { courseContent } from '../../../../../seed-data/course-content';

export async function GET() {
  const fallback = {
    countries: countries.length,
    licenses: licenseTypes.length,
    signs: seedRoadSigns.length,
    questions: seedQuestions.length,
    practical: seedPracticalExercises.length,
    courses: courseContent.length,
    source: 'bundled-catalogue' as const,
  };

  try {
    const [countriesCount, licensesCount, signsCount, questionsCount, practicalCount, coursesCount] = await Promise.all([
      db.country.count(), db.licenseCategory.count(), db.roadSign.count(),
      db.question.count(), db.practicalExercise.count(), db.course.count(),
    ]);

    return NextResponse.json({
      countries: Math.max(countriesCount, fallback.countries),
      licenses: Math.max(licensesCount, fallback.licenses),
      signs: Math.max(signsCount, fallback.signs),
      questions: Math.max(questionsCount, fallback.questions),
      practical: Math.max(practicalCount, fallback.practical),
      courses: Math.max(coursesCount, fallback.courses),
      source: 'database+catalogue',
    });
  } catch (error) {
    console.error('[GET /api/learning/catalog-stats] Database unavailable; using bundled catalogue counts:', error);
    return NextResponse.json(fallback, { headers: { 'X-ADSO-Data-Source': 'bundled-catalogue' } });
  }
}
