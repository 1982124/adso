import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 50);

    // Get the best attempt per user (highest score)
    const bestAttempts = await db.quizAttempt.groupBy({
      by: ['userId'],
      _max: { score: true },
      _count: true,
      orderBy: { _max: { score: 'desc' } },
      take: limit,
    });

    // Fetch user details for each best attempt
    const userIds = bestAttempts.map((a) => a.userId);
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatar: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const leaderboard = bestAttempts.map((attempt, index) => {
      const user = userMap.get(attempt.userId);
      return {
        rank: index + 1,
        userId: attempt.userId,
        userName: user?.name ?? 'Inconnu',
        avatar: user?.avatar ?? null,
        bestScore: attempt._max.score ?? 0,
        totalAttempts: attempt._count,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('[GET /api/leaderboard] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du classement' },
      { status: 500 }
    );
  }
}
