import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── POST: Submit an exam ──
interface ExamAnswer {
  questionId: string;
  selectedOption: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, answers, type, duration, countryCode, licenseCode } =
      body as {
        userId?: string;
        answers: ExamAnswer[];
        type?: string;
        duration?: number;
        countryCode?: string;
        licenseCode?: string;
      };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Réponses requises' },
        { status: 400 }
      );
    }

    // Resolve user by email or id
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { email: userId } });
      if (!user) {
        user = await db.user.findUnique({ where: { id: userId } });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Fetch all referenced questions
    const questionIds = answers.map((a) => a.questionId);
    const questions = await db.question.findMany({
      where: { id: { in: questionIds } },
    });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let correctAnswers = 0;
    const wrongAnswerIds: string[] = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question && answer.selectedOption === question.correctIndex) {
        correctAnswers++;
      } else {
        wrongAnswerIds.push(answer.questionId);
      }
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;

    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        totalQuestions,
        correctAnswers,
        score,
        duration: duration ?? 0,
        passed,
        type: type ?? 'mock_exam',
        country: countryCode ?? 'FR',
        licenseCode: licenseCode ?? null,
        wrongAnswers: JSON.stringify(wrongAnswerIds),
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      wrongAnswers: wrongAnswerIds,
    });
  } catch (error) {
    console.error('[POST /api/exam] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission de l\'examen' },
      { status: 500 }
    );
  }
}

// ── GET: Exam history for a user ──
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limitParam = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    // Resolve user by email or id
    let user;
    user = await db.user.findUnique({ where: { email: userId } });
    if (!user) {
      user = await db.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const where: Record<string, unknown> = { userId: user.id };
    if (type) {
      where.type = type;
    }

    const attempts = await db.quizAttempt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Compute aggregate stats
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
          )
        : 0;
    const passRate =
      totalAttempts > 0
        ? Math.round((passedAttempts / totalAttempts) * 100)
        : 0;
    const bestScore =
      totalAttempts > 0
        ? Math.max(...attempts.map((a) => a.score))
        : 0;

    const history = attempts.map((a) => ({
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
    }));

    return NextResponse.json({
      history,
      stats: {
        totalAttempts,
        passedAttempts,
        failedAttempts: totalAttempts - passedAttempts,
        avgScore,
        passRate,
        bestScore,
      },
    });
  } catch (error) {
    console.error('[GET /api/exam] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'historique' },
      { status: 500 }
    );
  }
}

function safeParse(str: string | null): unknown {
  if (!str) return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
