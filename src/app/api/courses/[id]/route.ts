import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(`[GET /api/courses/:id] Error:`, error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du cours' },
      { status: 500 }
    );
  }
}
