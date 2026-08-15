import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseContent } from '../../../../seed-data/course-content';

const DEFAULT_CATALOG_COUNTRY = 'BJ';

const COUNTRY_CODES = new Set([
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER',
  'SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ',
  'NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW',
  'AR','BR','CA','CL','CO','MX','PE','US','CN','KR','IN','JP','MY','PH','SG','TH','TR','VN',
  'HT','JM','DO','DE','AT','BE','ES','FI','FR','IT','LU','NO','NL','PL','PT','GB','RU','CH','SE','CZ',
  'SA','AE','AU','ID','NZ'
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

function containsForeignLegalSpecifics(text: string | null | undefined) {
  return !!text && FOREIGN_LEGAL_MARKERS.some((marker) => marker.test(text));
}

function commonModuleContent(title: string) {
  return `## ${title}\n\nCette séquence appartient au **socle commun ADSO d'éducation à la mobilité et à la sécurité routière**.\n\n### À apprendre\n- Observer la signalisation, le marquage et l'environnement avant d'agir.\n- Adapter l'allure, la distance et le positionnement aux conditions réelles.\n- Protéger les piétons, cyclistes, motocyclistes et autres usagers vulnérables.\n- Anticiper les trajectoires, les dangers et les changements de situation.\n- Comprendre qu'une règle juridique précise dépend du pays, et parfois d'une région, d'un État ou d'une municipalité.\n\n### Couche nationale\nLe pays choisi par l'apprenant définit les réglementations et réalités locales lorsqu'une source nationale validée est disponible. Une traduction change la langue, **jamais le pays ni son contexte**.`;
}

function sanitizeCommonContent(text: string | null | undefined, title: string) {
  if (!text || containsForeignLegalSpecifics(text)) return commonModuleContent(title);
  return text;
}

function sanitizeCommonDescription(text: string | null | undefined) {
  if (!text || containsForeignLegalSpecifics(text)) return 'Socle commun ADSO : mobilité, sécurité, observation, anticipation et responsabilité citoyenne. Les règles nationales sont traitées dans la couche réglementaire du pays sélectionné.';
  return text.replace(/code de la route français/gi, 'socle commun de conduite et de mobilité');
}

function catalogFallback(countryCode: string) {
  return courseContent.map((course, index) => ({
    ...course,
    description: sanitizeCommonDescription(course.description),
    order: index,
    countryCode,
    licenseCode: null,
    contentScope: 'global-common-theory',
    localImmersiveRequired: true,
    modules: course.modules.map((module, moduleIndex) => ({
      ...module,
      content: sanitizeCommonContent(module.content, module.title),
      order: moduleIndex,
      courseId: course.id,
      objectives: null,
      tips: null,
      commonMistakes: null,
      contentScope: 'global-common-theory',
      immersiveLocalisation: module.type === 'interactive',
    })),
    studentProgress: null,
  }));
}

type CourseWithModules = Prisma.CourseGetPayload<{ include: { modules: true } }>;

function hydrateCoursesFromCatalogue(courses: CourseWithModules[], requestedCountry: string) {
  const fallbackById = new Map(catalogFallback(requestedCountry).map((course) => [course.id, course]));
  return courses.map((course) => {
    const fallback = fallbackById.get(course.id);
    if (!fallback) return { ...course, countryCode: requestedCountry };
    const modules = course.modules.length > 0
      ? course.modules.map((module) => {
          const fallbackModule = fallback.modules.find((item) => item.id === module.id);
          const content = sanitizeCommonContent(module.content || fallbackModule?.content, module.title);
          return fallbackModule ? { ...fallbackModule, ...module, content } : { ...module, content };
        })
      : fallback.modules;
    return { ...fallback, ...course, description: sanitizeCommonDescription(course.description), countryCode: requestedCountry, modules };
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

    const coursesCatalog = courses.length > 0
      ? hydrateCoursesFromCatalogue(courses, requestedCountry)
      : catalogFallback(requestedCountry);

    const session = await getSession();
    const sessionUserId = session?.user?.id;
    if (!sessionUserId) return NextResponse.json(coursesCatalog);
    const progressRecords = await db.studentProgress.findMany({ where: { userId: sessionUserId } });
    const progressMap = new Map(progressRecords.map((progress) => [progress.courseId, progress]));
    return NextResponse.json(coursesCatalog.map((course) => ({ ...course, studentProgress: progressMap.get(course.id) ?? null })));
  } catch (error) {
    console.error('[GET /api/courses] Database unavailable; serving validated global common curriculum:', error);
    return NextResponse.json(catalogFallback(requestedCountry), { status: 200 });
  }
}
