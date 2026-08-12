import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseContent } from '../../../../../seed-data/course-content';

function fallbackCourse(id: string) {
  const course = courseContent.find((item) => item.id === id);
  if (!course) return null;

  return {
    ...course,
    order: courseContent.findIndex((item) => item.id === id),
    countryCode: 'FR',
    modules: course.modules.map((module, moduleIndex) => ({
      ...module,
      order: moduleIndex,
      courseId: course.id,
      objectives: null,
      tips: null,
      commonMistakes: null,
    })),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (course) return NextResponse.json(course);

    const fallback = fallbackCourse(id);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
  } catch (error) {
    const fallback = fallbackCourse(id);
    if (fallback) {
      console.error(`[GET /api/courses/${id}] Database unavailable; serving catalogue fallback:`, error);
      return NextResponse.json(fallback);
    }

    console.error(`[GET /api/courses/${id}] Error:`, error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du cours' },
      { status: 500 }
    );
  }
}
