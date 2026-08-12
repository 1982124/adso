import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
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

type CourseWithModules = Prisma.CourseGetPayload<{ include: { modules: true } }>;

function hydrateCoursesFromCatalogue(courses: CourseWithModules[]) {
  const fallbackById = new Map(catalogFallback().map((course) => [course.id, course]));

  return courses.map((course) => {
    const fallback = fallbackById.get(course.id);
    if (!fallback) return course;

    const modules = course.modules.length > 0
      ? course.modules.map((module) => {
          const fallbackModule = fallback.modules.find((item) => item.id === module.id);
          return fallbackModule && !module.content?.trim()
            ? { ...fallbackModule, ...module, content: fallbackModule.content }
            : module;
        })
      : fallback.modules;

    return {
      ...fallback,
      ...course,
      modules,
    };
  });
}

export async function GET(_request: NextRequest) {
  const catalog = catalogFallback();

  try {
    const courses = await db.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const coursesCatalog = courses.length > 0
      ? hydrateCoursesFromCatalogue(courses)
      : catalog;

    const session = await getSession();
    const sessionUserId = session?.user?.id;
    if (!sessionUserId) return NextResponse.json(coursesCatalog);

    const progressRecords = await db.studentProgress.findMany({
      where: { userId: sessionUserId },
    });
    const progressMap = new Map(progressRecords.map((progress) => [progress.courseId, progress]));

    return NextResponse.json(
      coursesCatalog.map((course) => ({
        ...course,
        studentProgress: progressMap.get(course.id) ?? null,
      }))
    );
  } catch (error) {
    console.error('[GET /api/courses] Database unavailable; serving catalogue fallback:', error);
    return NextResponse.json(catalog);
  }
}
