import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

interface ExamAnswer {
  questionId: string;
  selectedOption: number;
}

function randomChars(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) result += chars[bytes[i] % chars.length];
  return result;
}

async function issueExamCertificate(userId: string, score: number, countryCode: string, licenseCode: string | null) {
  const existing = await db.certification.findFirst({
    where: { userId, type: 'exam_passed', licenseCode },
    orderBy: { issuedAt: 'desc' },
  });
  if (existing && existing.score != null && existing.score >= score) return existing;

  return db.certification.create({
    data: {
      userId,
      type: 'exam_passed',
      title: 'Certification ADSO — Maîtrise du Code de la circulation',
      description: 'Certification ADSO délivrée automatiquement après réussite d’un examen blanc supervisé par la plateforme.',
      countryCode,
      licenseCode,
      score,
      qrCode: `https://adso.verify/${randomChars(16)}`,
      certificateId: `ADSO-${randomChars(4)}-${randomChars(4)}`,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const body = await request.json();
    const { answers, type, duration, countryCode, licenseCode } = body as {
      answers: ExamAnswer[];
      type?: string;
      duration?: number;
      countryCode?: string;
      licenseCode?: string;
    };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Réponses requises' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const questionIds = answers.map((a) => a.questionId);
    const questions = await db.question.findMany({ where: { id: { in: questionIds } } });
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    let correctAnswers = 0;
    const wrongAnswerIds: string[] = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question && answer.selectedOption === question.correctIndex) correctAnswers++;
      else wrongAnswerIds.push(answer.questionId);
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;
    const examType = type ?? 'mock_exam';

    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        totalQuestions,
        correctAnswers,
        score,
        duration: duration ?? 0,
        passed,
        type: examType,
        country: countryCode ?? 'FR',
        licenseCode: licenseCode ?? null,
        wrongAnswers: JSON.stringify(wrongAnswerIds),
      },
    });

    let certification: Awaited<ReturnType<typeof issueExamCertificate>> | null = null;
    if (passed && examType === 'mock_exam') {
      certification = await issueExamCertificate(user.id, score, countryCode ?? 'FR', licenseCode ?? null);
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      wrongAnswers: wrongAnswerIds,
      certification,
    });
  } catch (error) {
    console.error('[POST /api/exam] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la soumission de l\'examen' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit');
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 50;
    const where: { userId: string; type?: string } = { userId: user.id };
    if (type) where.type = type;
    const attempts = await db.quizAttempt.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit });
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const avgScore = totalAttempts ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) : 0;
    const passRate = totalAttempts ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
    const bestScore = totalAttempts ? Math.max(...attempts.map((a) => a.score)) : 0;

    return NextResponse.json({
      history: attempts.map((a) => ({
        id: a.id,
        totalQuestions: a.totalQuestions,
        correctAnswers: a.correctAnswers,
        score: a.score,
        duration: a.duration,
        passed: a.passed,
        type: a.type,
        country: a.country,
        licenseCode: a.licenseCode,
        wrongAnswers: safeParse(a.wrongAnswers),
        createdAt: a.createdAt,
      })),
      stats: { totalAttempts, passedAttempts, failedAttempts: totalAttempts - passedAttempts, avgScore, passRate, bestScore },
    });
  } catch (error) {
    console.error('[GET /api/exam] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de l\'historique' }, { status: 500 });
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try { return JSON.parse(str); } catch { return str; }
}
