import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseContent } from '../../../../seed-data/course-content';

const DEFAULT_CATALOG_COUNTRY = 'FR';

function normalizeCountryCode(value: string | null) {
  const normalized = value?.trim().toUpperCase();
  return normalized && /^[A-Z]{2}$/.test(normalized) ? normalized : DEFAULT_CATALOG_COUNTRY;
}

function catalogFallback(countryCode = DEFAULT_CATALOG_COUNTRY) {
  return courseContent.map((course, index) => ({
    ...course,
    order: index,
    countryCode,
    licenseCode: null,
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
  const fallbackById = new Map(catalogFallback(DEFAULT_CATALOG_COUNTRY).map((course) => [course.id, course]));

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

export async function GET(request: NextRequest) {
  const requestedCountry = normalizeCountryCode(request.nextUrl.searchParams.get('countryCode'));

  try {
    const coursesForRequestedCountry = await db.course.findMany({
      where: { countryCode: requestedCountry },
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // If a country has no localized catalogue yet, use the maintained FR catalogue
    // as an explicit reference fallback rather than returning an empty learning page.
    const courses = coursesForRequestedCountry.length > 0
      ? coursesForRequestedCountry
      : await db.course.findMany({
          where: { countryCode: DEFAULT_CATALOG_COUNTRY },
          orderBy: { order: 'asc' },
          include: {
            modules: {
              orderBy: { order: 'asc' },
            },
          },
        });

    const coursesCatalog = courses.length > 0
      ? hydrateCoursesFromCatalogue(courses)
      : catalogFallback(DEFAULT_CATALOG_COUNTRY);

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
    return NextResponse.json(catalogFallback(DEFAULT_CATALOG_COUNTRY));
  }
}
