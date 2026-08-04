import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // ── Student Progress ──
    const progressRecords = await db.studentProgress.findMany({
      where: { userId: user.id },
    });
    const coursesStarted = progressRecords.filter(
      (p) => p.status === 'in_progress' || p.status === 'completed'
    ).length;
    const coursesCompleted = progressRecords.filter(
      (p) => p.status === 'completed'
    ).length;

    // ── Quiz Attempts ──
    const attempts = await db.quizAttempt.findMany({
      where: { userId: user.id },
    });

    const totalQuestionsAnswered = attempts.reduce(
      (sum, a) => sum + a.totalQuestions,
      0
    );

    const avgScore =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
          )
        : 0;

    const bestScore =
      attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

    const passedAttempts = attempts.filter((a) => a.passed).length;
    const passRate =
      attempts.length > 0
        ? Math.round((passedAttempts / attempts.length) * 100)
        : 0;

    // ── Category breakdown ──
    // Collect all wrong answer IDs across all attempts
    const allWrongIds: string[] = [];
    for (const attempt of attempts) {
      try {
        const parsed = JSON.parse(attempt.wrongAnswers ?? '[]');
        if (Array.isArray(parsed)) {
          allWrongIds.push(...parsed);
        }
      } catch {
        /* skip */
      }
    }

    // Get all unique question IDs that were answered
    const allAttemptQuestions = await db.question.findMany({
      where: { id: { in: [...new Set(allWrongIds)] } },
      select: { id: true, category: true },
    });
    const wrongByCategory = new Map<string, number>();
    for (const q of allAttemptQuestions) {
      const count = wrongByCategory.get(q.category) ?? 0;
      wrongByCategory.set(q.category, count + 1);
    }

    // Total questions per category (from all questions in the bank)
    const allQuestions = await db.question.findMany({
      select: { category: true },
    });
    const totalByCategory = new Map<string, number>();
    for (const q of allQuestions) {
      const count = totalByCategory.get(q.category) ?? 0;
      totalByCategory.set(q.category, count + 1);
    }

    // Build category breakdown
    const allCategories = new Set([
      ...totalByCategory.keys(),
      ...wrongByCategory.keys(),
    ]);
    const categoryBreakdown: {
      category: string;
      totalQuestions: number;
      wrongAttempts: number;
      passRate: number;
    }[] = [];

    for (const cat of allCategories) {
      const total = totalByCategory.get(cat) ?? 0;
      const wrong = wrongByCategory.get(cat) ?? 0;
      // Pass rate per category: percentage of times questions in this category were answered correctly
      // We approximate: (total_category_questions - wrong_in_category) / total_category_questions
      const catPassRate =
        total > 0 ? Math.round(((total - wrong) / total) * 100) : 100;
      categoryBreakdown.push({
        category: cat,
        totalQuestions: total,
        wrongAttempts: wrong,
        passRate: catPassRate,
      });
    }

    categoryBreakdown.sort((a, b) => a.passRate - b.passRate);

    // ── Weak areas: categories with < 70% pass rate ──
    const weakAreas = categoryBreakdown
      .filter((c) => c.passRate < 70)
      .map((c) => ({
        category: c.category,
        passRate: c.passRate,
        wrongAttempts: c.wrongAttempts,
      }));

    return NextResponse.json({
      userId: user.id,
      courses: {
        started: coursesStarted,
        completed: coursesCompleted,
      },
      quiz: {
        totalAttempts: attempts.length,
        totalQuestionsAnswered,
        avgScore,
        bestScore,
        passRate,
      },
      categoryBreakdown,
      weakAreas,
    });
  } catch (error) {
    console.error('[GET /api/learning/stats] Error:', error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques" },
      { status: 500 }
    );
  }
}
