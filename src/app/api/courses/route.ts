import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseContent } from '../../../../seed-data/course-content';

function catalogFallback() {
  return courseContent.map((course, index) => ({
    ...course,
    order: index,
    countryCode: 'FR',
    modules: course.modules.map((module, moduleIndex) => ({
      ...module,
      order: moduleIndex,
      courseId: course.id,
      objectives: null,
      tips: null,
      commonMistakes: null,
    })),
    studentProgress: null,
  }));
}

export async function GET(request: NextRequest) {
  const catalog = catalogFallback();

  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');

    const courses = await db.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Database content wins when available. The versioned catalogue remains
    // the production-safe source of truth when the database is empty.
    const coursesCatalog = courses.length > 0 ? courses : catalog;

    if (!userId) {
      return NextResponse.json(coursesCatalog);
    }

    const user = await db.user.findUnique({ where: { email: userId } });
    if (!user) {
      return NextResponse.json(coursesCatalog);
    }

    const progressRecords = await db.studentProgress.findMany({
      where: { userId: user.id },
    });
    const progressMap = new Map(progressRecords.map((progress) => [progress.courseId, progress]));

    return NextResponse.json(
      coursesCatalog.map((course) => ({
        ...course,
        studentProgress: progressMap.get(course.id) ?? null,
      }))
    );
  } catch (error) {
    // Never let a missing/unavailable Prisma database blank the learner's
    // course catalogue. The pedagogical catalogue is bundled with the app.
    console.error('[GET /api/courses] Database unavailable; serving catalogue fallback:', error);
    return NextResponse.json(catalog);
  }
}
