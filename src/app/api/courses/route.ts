import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseContent } from '../../../../seed-data/course-content';

const DEFAULT_CATALOG_COUNTRY = 'FR';

// The African common catalogue is a pedagogical baseline, not a copy of one
// country's legislation. Country-specific legal and administrative rules are
// kept out of this baseline and belong in the national regulations layer.
const AFRICAN_COMMON_CATALOG = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
]);

const FOREIGN_LEGAL_MARKERS = [
  /\bfrance\b/i, /\bfrançais\b/i, /\bfrançaise\b/i, /\beuros?\b/i,
  /\bpermis à points\b/i, /\b12 points\b/i, /\bcontravention\b/i,
  /\bpréfet\b/i, /\bETG\b/i, /\bSAMU\b/i, /\b112\b/i,
  /\b15\s*:\s*SAMU/i, /\b17\s*:\s*Police/i, /\b18\s*:\s*Pompiers/i,
  /\bpermis probatoire\b/i, /\bzone 30\b/i, /\bzone de rencontre\b/i,
  /\b130\s*km\/h\b/i, /\b110\s*km\/h\b/i, /\b80\s*km\/h\b/i,
  /\b50\s*km\/h\b/i, /\b68\s*€\b/i, /\b135\s*€\b/i, /\b375\s*€\b/i,
  /\b750\s*€\b/i, /\b4\s*ans\b/i
];

function normalizeCountryCode(value: string | null) {
  const normalized = value?.trim().toUpperCase();
  return normalized && /^[A-Z]{2}$/.test(normalized) ? normalized : DEFAULT_CATALOG_COUNTRY;
}

function usesCommonAfricanBaseline(countryCode: string) {
  return AFRICAN_COMMON_CATALOG.has(countryCode);
}

function containsForeignLegalSpecifics(text: string | null | undefined) {
  return !!text && FOREIGN_LEGAL_MARKERS.some((marker) => marker.test(text));
}

function commonModuleContent(title: string) {
  return `## ${title}\n\nCette séquence appartient au **socle commun de conduite et de mobilité ADSO**.\n\n### À apprendre\n- Observer la signalisation, le marquage et l’environnement avant d’agir.\n- Adapter l’allure, la distance et le positionnement aux conditions réelles.\n- Protéger les piétons, cyclistes, motocyclistes et autres usagers vulnérables.\n- Anticiper les trajectoires, les dangers et les changements de situation.\n\n### Important\nLes limitations chiffrées, sanctions, documents, numéros d’urgence, catégories de permis et autres obligations juridiques sont **nationales**. Consultez l’onglet Réglementations pour la couche du pays sélectionné.`;
}

function sanitizeCommonContent(text: string | null | undefined, title: string) {
  if (!text) return commonModuleContent(title);
  return containsForeignLegalSpecifics(text) ? commonModuleContent(title) : text;
}

function sanitizeCommonDescription(text: string | null | undefined) {
  if (!text) return 'Séquence du socle commun de conduite et de mobilité.';
  return containsForeignLegalSpecifics(text)
    ? 'Séquence du socle commun de conduite et de mobilité. Les règles nationales sont traitées séparément.'
    : text.replace(/code de la route français/gi, 'socle commun de conduite et de mobilité');
}

function catalogFallback(countryCode = DEFAULT_CATALOG_COUNTRY) {
  const commonAfrican = usesCommonAfricanBaseline(countryCode);
  return courseContent.map((course, index) => ({
    ...course,
    description: commonAfrican ? sanitizeCommonDescription(course.description) : course.description,
    order: index,
    countryCode,
    licenseCode: null,
    contentScope: commonAfrican ? 'africa-common-theory' : 'reference-theory',
    localImmersiveRequired: commonAfrican,
    modules: course.modules.map((module, moduleIndex) => ({
      ...module,
      content: commonAfrican ? sanitizeCommonContent(module.content, module.title) : module.content,
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
  const commonAfrican = usesCommonAfricanBaseline(requestedCountry);
  const fallbackById = new Map(catalogFallback(requestedCountry).map((course) => [course.id, course]));
  return courses.map((course) => {
    const fallback = fallbackById.get(course.id);
    if (!fallback) return course;
    const modules = course.modules.length > 0
      ? course.modules.map((module) => {
          const fallbackModule = fallback.modules.find((item) => item.id === module.id);
          const content = commonAfrican ? sanitizeCommonContent(module.content || fallbackModule?.content, module.title) : (module.content || fallbackModule?.content || commonModuleContent(module.title));
          return fallbackModule ? { ...fallbackModule, ...module, content } : { ...module, content };
        })
      : fallback.modules;
    return { ...fallback, ...course, description: commonAfrican ? sanitizeCommonDescription(course.description) : course.description, countryCode: requestedCountry, modules };
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

    // African markets always get a usable common theory baseline. A missing
    // national catalogue is not an empty-learning state anymore.
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
