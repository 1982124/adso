import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;
  try {
    // Run all aggregation queries in parallel
    const [
      totalUsers,
      totalCourses,
      totalQuizAttempts,
      avgScoreResult,
      passRateResult,
      totalQuestions,
      totalEnrollments,
      completedCourses,
      recentAttempts,
    ] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.quizAttempt.count(),
      db.quizAttempt.aggregate({ _avg: { score: true } }),
      db.quizAttempt.aggregate({
        _avg: { score: true },
        _count: true,
        where: { passed: true },
      }),
      db.question.count(),
      db.enrollment.count(),
      db.studentProgress.count({ where: { status: 'completed' } }),
      db.quizAttempt.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    const averageScore = avgScoreResult._avg.score ?? 0;
    const passedAttempts = passRateResult._count;
    const passRate =
      totalQuizAttempts > 0
        ? Math.round((passedAttempts / totalQuizAttempts) * 100)
        : 0;

    // Difficulty distribution
    const difficultyDist = await db.question.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    // Category distribution
    const categoryDist = await db.question.groupBy({
      by: ['category'],
      _count: true,
    });

    // Course category distribution
    const courseCategoryDist = await db.course.groupBy({
      by: ['category'],
      _count: true,
    });

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalQuizAttempts,
      totalQuestions,
      totalEnrollments,
      completedCourses,
      averageScore: Math.round(averageScore * 10) / 10,
      passRate,
      difficultyDistribution: difficultyDist.map((d) => ({
        difficulty: d.difficulty,
        count: d._count,
      })),
      questionCategories: categoryDist.map((c) => ({
        category: c.category,
        count: c._count,
      })),
      courseCategories: courseCategoryDist.map((c) => ({
        category: c.category,
        count: c._count,
      })),
      recentAttempts: recentAttempts.map((a) => ({
        id: a.id,
        userName: a.user.name,
        score: a.score,
        passed: a.passed,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('[GET /api/analytics] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    );
  }
}
