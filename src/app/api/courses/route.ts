import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseContent } from '../../../../seed-data/course-content';

const DEFAULT_CATALOG_COUNTRY = 'FR';

// ADSO separates the pedagogical driving-code baseline from country-specific
// legal/administrative overlays. African countries without a separately
// curated course table receive the common theory baseline. Immersive scenarios
// and legal specifics must still be localized and verified before publication.
const AFRICAN_COMMON_CATALOG = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
]);

function normalizeCountryCode(value: string | null) {
  const normalized = value?.trim().toUpperCase();
  return normalized && /^[A-Z]{2}$/.test(normalized) ? normalized : DEFAULT_CATALOG_COUNTRY;
}

function usesCommonAfricanBaseline(countryCode: string) {
  return AFRICAN_COMMON_CATALOG.has(countryCode);
}

function catalogFallback(countryCode = DEFAULT_CATALOG_COUNTRY) {
  const commonAfrican = usesCommonAfricanBaseline(countryCode);
  return courseContent.map((course, index) => ({
    ...course,
    order: index,
    countryCode,
    licenseCode: null,
    contentScope: commonAfrican ? 'africa-common-theory' : 'reference-theory',
    localImmersiveRequired: commonAfrican,
    modules: course.modules.map((module, moduleIndex) => ({
      ...module,
      order: moduleIndex,
      courseId: course.id,
      objectives: null,
      tips: null,
      commonMistakes: null,
      contentScope: commonAfrican ? 'africa-common-theory' : 'reference-theory',
      immersiveLocalisation: commonAfrican && module.type === 'interactive',
    })),
    studentProgress: null,
  }));
}

type CourseWithModules = Prisma.CourseGetPayload<{ include: { modules: true } }>;

function hydrateCoursesFromCatalogue(courses: CourseWithModules[], requestedCountry: string) {
  const fallbackById = new Map(catalogFallback(requestedCountry).map((course) => [course.id, course]));
  return courses.map((course) => {
    const fallback = fallbackById.get(course.id);
    if (!fallback) return course;
    const modules = course.modules.length > 0
      ? course.modules.map((module) => {
          const fallbackModule = fallback.modules.find((item) => item.id === module.id);
          return fallbackModule && !module.content?.trim() ? { ...fallbackModule, ...module, content: fallbackModule.content } : module;
        })
      : fallback.modules;
    return { ...fallback, ...course, countryCode: requestedCountry, modules };
  });
}

export async function GET(request: NextRequest) {
  const requestedCountry = normalizeCountryCode(request.nextUrl.searchParams.get('countryCode'));
  try {
    const courses = await db.course.findMany({
      where: { countryCode: requestedCountry },
      orderBy: { order: 'asc' },
      include: { modules: { orderBy: { order: 'asc' } } },
    });

    // If a country has no separate course table, African markets use the
    // validated common theory baseline instead of showing an empty catalogue.
    // This does not authorize copying local laws or immersive situations.
    const coursesCatalog = courses.length > 0
      ? hydrateCoursesFromCatalogue(courses, requestedCountry)
      : usesCommonAfricanBaseline(requestedCountry)
        ? catalogFallback(requestedCountry)
        : requestedCountry === DEFAULT_CATALOG_COUNTRY
          ? catalogFallback(DEFAULT_CATALOG_COUNTRY)
          : [];

    const session = await getSession();
    const sessionUserId = session?.user?.id;
    if (!sessionUserId || coursesCatalog.length === 0) return NextResponse.json(coursesCatalog);
    const progressRecords = await db.studentProgress.findMany({ where: { userId: sessionUserId } });
    const progressMap = new Map(progressRecords.map((progress) => [progress.courseId, progress]));
    return NextResponse.json(coursesCatalog.map((course) => ({ ...course, studentProgress: progressMap.get(course.id) ?? null })));
  } catch (error) {
    console.error('[GET /api/courses] Database unavailable; serving validated common/reference curriculum:', error);
    const fallback = usesCommonAfricanBaseline(requestedCountry) || requestedCountry === DEFAULT_CATALOG_COUNTRY
      ? catalogFallback(requestedCountry)
      : [];
    return NextResponse.json(fallback, { status: 200 });
  }
}
