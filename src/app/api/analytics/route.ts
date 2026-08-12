import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date: Date) {
  const value = startOfDay(date);
  value.setDate(1);
  return value;
}

function startOfYear(date: Date) {
  const value = startOfDay(date);
  value.setMonth(0, 1);
  return value;
}

function parseShareMetadata(metadata: string): {
  platform: string;
  country: string;
  contentType: string;
} {
  try {
    const value = JSON.parse(metadata) as Record<string, unknown>;
    return {
      platform: typeof value.platform === 'string' ? value.platform : 'other',
      country: typeof value.country === 'string' ? value.country : 'unknown',
      contentType: typeof value.contentType === 'string' ? value.contentType : 'unknown',
    };
  } catch {
    return { platform: 'other', country: 'unknown', contentType: 'unknown' };
  }
}

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;
  try {
    const now = new Date();
    const today = startOfDay(now);
    const month = startOfMonth(now);
    const year = startOfYear(now);

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
      shareEvents,
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
      db.analyticsEvent.findMany({
        where: { eventType: 'share' },
        orderBy: { createdAt: 'desc' },
        take: 10000,
        select: { id: true, userId: true, metadata: true, createdAt: true },
      }),
    ]);

    const averageScore = avgScoreResult._avg.score ?? 0;
    const passedAttempts = passRateResult._count;
    const passRate =
      totalQuizAttempts > 0
        ? Math.round((passedAttempts / totalQuizAttempts) * 100)
        : 0;

    const shares = shareEvents.map((event) => ({
      ...event,
      ...parseShareMetadata(event.metadata),
    }));

    const sharesToday = shares.filter((event) => event.createdAt >= today).length;
    const sharesThisMonth = shares.filter((event) => event.createdAt >= month).length;
    const sharesThisYear = shares.filter((event) => event.createdAt >= year).length;

    const platformCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const countryPlatformCounts = new Map<string, Map<string, number>>();
    const uniqueSharers = new Set<string>();

    for (const share of shares) {
      platformCounts.set(share.platform, (platformCounts.get(share.platform) ?? 0) + 1);
      countryCounts.set(share.country, (countryCounts.get(share.country) ?? 0) + 1);
      if (share.userId) uniqueSharers.add(share.userId);

      const countryPlatforms = countryPlatformCounts.get(share.country) ?? new Map<string, number>();
      countryPlatforms.set(share.platform, (countryPlatforms.get(share.platform) ?? 0) + 1);
      countryPlatformCounts.set(share.country, countryPlatforms);
    }

    const sharePlatforms = [...platformCounts.entries()]
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);

    const shareCountries = [...countryCounts.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const shareByCountryAndPlatform = [...countryPlatformCounts.entries()]
      .map(([country, platforms]) => ({
        country,
        total: [...platforms.values()].reduce((sum, count) => sum + count, 0),
        platforms: [...platforms.entries()]
          .map(([platform, count]) => ({ platform, count }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.total - a.total);

    const recentShares = shares.slice(0, 10).map((share) => ({
      id: share.id,
      platform: share.platform,
      country: share.country,
      contentType: share.contentType,
      createdAt: share.createdAt,
    }));

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
      shares: {
        today: sharesToday,
        month: sharesThisMonth,
        year: sharesThisYear,
        total: shares.length,
        uniqueSharers: uniqueSharers.size,
        platforms: sharePlatforms,
        countries: shareCountries,
        byCountryAndPlatform: shareByCountryAndPlatform,
        recent: recentShares,
      },
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
