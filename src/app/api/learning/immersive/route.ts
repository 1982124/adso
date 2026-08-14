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
    const module = await db.module.findUnique({ where: { id: body.moduleId }, select: { id: true, courseId: true } });
    if (!course || !module || module.courseId !== course.id) return NextResponse.json({ error: 'Cours ou module introuvable' }, { status: 404 });

    const totalQuestions = body.totalQuestions === 1 ? 1 : 1;
    const correctAnswers = body.totalQuestions === 1 && body.correct === true ? 1 : 0;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const attempt = await db.quizAttempt.create({
      data: { userId, totalQuestions, correctAnswers, score, duration: 0, passed: score >= 70 },
    });

    return NextResponse.json({ ok: true, attemptId: attempt.id, score, countryCode: course.countryCode });
  } catch (error) {
    console.error('[POST /api/learning/immersive] Error:', error);
    return NextResponse.json({ error: 'Impossible d enregistrer le résultat' }, { status: 500 });
  }
}
