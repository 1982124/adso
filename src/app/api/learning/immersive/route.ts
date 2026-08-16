import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserId, requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Session invalide' }, { status: 401 });

    const body = await request.json() as { courseId?: string; moduleId?: string; correct?: boolean; totalQuestions?: number };
    if (!body.courseId || !body.moduleId) return NextResponse.json({ error: 'courseId et moduleId requis' }, { status: 400 });

    const course = await db.course.findUnique({ where: { id: body.courseId }, select: { id: true, countryCode: true } });
    const courseModule = await db.module.findUnique({ where: { id: body.moduleId }, select: { id: true, courseId: true, order: true } });
    if (!course || !courseModule || courseModule.courseId !== course.id) return NextResponse.json({ error: 'Cours ou module introuvable' }, { status: 404 });

    const totalQuestions = 1;
    const correctAnswers = body.totalQuestions === 1 && body.correct === true ? 1 : 0;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const attempt = await db.quizAttempt.create({
      data: { userId, totalQuestions, correctAnswers, score, duration: 0, passed: score >= 70, type: 'learning' },
    });

    const moduleCount = await db.module.count({ where: { courseId: course.id } });
    const previous = await db.studentProgress.findUnique({ where: { courseId_userId: { courseId: course.id, userId } } });
    const completed = new Set<string>(previous?.completedModules ? JSON.parse(previous.completedModules) : []);
    completed.add(courseModule.id);
    const progress = Math.min(100, Math.round((completed.size / Math.max(1, moduleCount)) * 100));
    const status = progress >= 100 ? 'completed' : 'in_progress';

    await db.enrollment.upsert({
      where: { courseId_userId: { courseId: course.id, userId } },
      create: { courseId: course.id, userId, status: 'active' },
      update: { status: 'active' },
    });
    await db.studentProgress.upsert({
      where: { courseId_userId: { courseId: course.id, userId } },
      create: { userId, courseId: course.id, progress, status, completedModules: JSON.stringify([...completed]), lastAccess: new Date() },
      update: { progress, status, completedModules: JSON.stringify([...completed]), lastAccess: new Date() },
    });

    return NextResponse.json({ ok: true, attemptId: attempt.id, score, progress, status, countryCode: course.countryCode });
  } catch (error) {
    console.error('[POST /api/learning/immersive] Error:', error);
    return NextResponse.json({ error: 'Impossible d enregistrer le résultat' }, { status: 500 });
  }
}
