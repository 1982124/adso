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
    })),
    studentProgress: null,
  }));
}

export async function GET(request: NextRequest) {
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

    // Production must remain useful even before the private seed job has run.
    // The versioned pedagogical catalogue is the read-only fallback; database
    // data still wins whenever it exists.
    const catalog = courses.length > 0 ? courses : catalogFallback();

    if (userId) {
      const user = await db.user.findUnique({ where: { email: userId } });

      // A demo/first-visit learner should still see the real course catalogue.
      // We deliberately attach no progress until an authenticated learner exists.
      if (!user) {
        return NextResponse.json(catalog);
      }

      const progressRecords = await db.studentProgress.findMany({
        where: { userId: user.id },
      });

      const progressMap = new Map(
        progressRecords.map((p) => [p.courseId, p])
      );

      return NextResponse.json(
        catalog.map((course) => ({
          ...course,
          studentProgress: progressMap.get(course.id) ?? null,
        }))
      );
    }

    return NextResponse.json(catalog);
  } catch (error) {
    console.error('[GET /api/courses] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des cours' },
      { status: 500 }
    );
  }
}
