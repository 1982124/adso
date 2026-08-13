import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseContent } from '../../../../seed-data/course-content';

function catalogFallback(countryCode: string | null, licenseCode: string | null) {
  // The bundled catalogue is authoritative application content, but it is
  // currently France-specific. Never present French regulatory content as if
  // it were valid for another country.
  if (countryCode && countryCode !== 'FR') return [];

  return courseContent
    .filter((course) => !licenseCode || !licenseCode.trim())
    .map((course, index) => ({
      ...course,
      order: index,
      countryCode: 'FR',
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const countryCode = searchParams.get('countryCode')?.trim().toUpperCase() || null;
  const licenseCode = searchParams.get('licenseCode')?.trim() || null;
  const category = searchParams.get('category')?.trim() || null;
  const level = searchParams.get('level')?.trim() || null;
  const userId = searchParams.get('userId')?.trim() || null;

  try {
    const courses = await db.course.findMany({
      where: {
        ...(countryCode ? { countryCode } : {}),
        ...(licenseCode ? { licenseCode } : {}),
        ...(category ? { category } : {}),
        ...(level ? { level } : {}),
      },
      orderBy: { order: 'asc' },
      include: { modules: { orderBy: { order: 'asc' } } },
    });

    const catalog = courses.length > 0
      ? courses
      : catalogFallback(countryCode, licenseCode);

    if (!userId) return NextResponse.json(catalog);

    const user = await db.user.findUnique({ where: { email: userId } });
    if (!user) return NextResponse.json(catalog);

    const progressRecords = await db.studentProgress.findMany({ where: { userId: user.id } });
    const progressMap = new Map(progressRecords.map((p) => [p.courseId, p]));

    return NextResponse.json(
      catalog.map((course) => ({
        ...course,
        studentProgress: progressMap.get(course.id) ?? null,
      })),
    );
  } catch (error) {
    console.error('[GET /api/courses] Database unavailable; using bundled catalogue where valid:', error);
    const catalog = catalogFallback(countryCode, licenseCode)
      .filter((course) => !category || course.category === category)
      .filter((course) => !level || course.level === level);

    return NextResponse.json(catalog, {
      headers: { 'X-ADSO-Data-Source': catalog.length > 0 ? 'bundled-catalogue' : 'unavailable' },
    });
  }
}
