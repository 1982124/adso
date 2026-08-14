import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedCountries } from '../../../../seed-data/seed-countries';
import { seedLicenseCategories } from '../../../../seed-data/seed-licenses';
import { seedRoadSigns } from '../../../../seed-data/seed-signs';
import { seedQuestions } from '../../../../seed-data/seed-questions';
import { seedPracticalExercises } from '../../../../seed-data/seed-practical';
import { courseContent } from '../../../../seed-data/course-content';

export const dynamic = 'force-dynamic';

/**
 * One-time operational bootstrap for an empty production database.
 * It is intentionally self-disabling once the public learning catalogue exists.
 * It never deletes data and never changes the schema.
 */
export async function GET() {
  try {
    const existing = await db.country.count();
    if (existing > 0) {
      return NextResponse.json({ status: 'already_initialized' }, { status: 409 });
    }

    const result = await db.$transaction(async (tx) => {
      const countries = await tx.country.createMany({ data: seedCountries, skipDuplicates: true });
      const licenses = await tx.licenseCategory.createMany({ data: seedLicenseCategories, skipDuplicates: true });
      const signs = await tx.roadSign.createMany({
        data: seedRoadSigns.map((sign) => ({
          ...sign,
          description: sign.description ?? sign.meaning,
        })),
        skipDuplicates: true,
      });
      const questions = await tx.question.createMany({ data: seedQuestions, skipDuplicates: true });
      const practical = await tx.practicalExercise.createMany({ data: seedPracticalExercises, skipDuplicates: true });

      for (const course of courseContent) {
        await tx.course.create({
          data: {
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            duration: course.duration,
            order: 0,
            icon: course.icon,
            isPremium: course.isPremium,
            countryCode: 'FR',
            modules: {
              create: course.modules.map((module, index) => ({
                id: module.id,
                title: module.title,
                content: module.content,
                type: module.type,
                order: index,
                duration: module.duration,
              })),
            },
          },
        });
      }

      return {
        countries: countries.count,
        licenses: licenses.count,
        signs: signs.count,
        questions: questions.count,
        practical: practical.count,
        courses: courseContent.length,
        modules: courseContent.reduce((sum, course) => sum + course.modules.length, 0),
      };
    });

    return NextResponse.json({ status: 'initialized', result }, { status: 201 });
  } catch (error) {
    console.error('[bootstrap-content] failed', error);
    return NextResponse.json({ error: 'Content bootstrap failed' }, { status: 500 });
  }
}
