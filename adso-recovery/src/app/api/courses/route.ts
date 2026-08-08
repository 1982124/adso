import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // If userId is provided, attach student progress
    if (userId) {
      const user = await db.user.findUnique({ where: { email: userId } });
      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
      }

      const progressRecords = await db.studentProgress.findMany({
        where: { userId: user.id },
      });

      const progressMap = new Map(
        progressRecords.map((p) => [p.courseId, p])
      );

      const coursesWithProgress = courses.map((course) => ({
        ...course,
        studentProgress: progressMap.get(course.id) ?? null,
      }));

      return NextResponse.json(coursesWithProgress);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('[GET /api/courses] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des cours' },
      { status: 500 }
    );
  }
}
