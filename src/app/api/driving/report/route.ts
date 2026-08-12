import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

const PERIOD_DAYS: Record<string, number> = {
  daily: 1,
  monthly: 30,
  quarterly: 90,
  annual: 365,
};

function periodStart(period: string) {
  const now = new Date();
  if (period === 'daily') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  const days = PERIOD_DAYS[period] ?? PERIOD_DAYS.daily;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const period = new URL(request.url).searchParams.get('period') ?? 'daily';
    if (!PERIOD_DAYS[period]) {
      return NextResponse.json({ error: 'Période invalide', allowed: Object.keys(PERIOD_DAYS) }, { status: 400 });
    }

    const trips = await db.telematicsTrip.findMany({
      where: { userId, startTime: { gte: periodStart(period) } },
      orderBy: { startTime: 'desc' },
    });

    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
    const totalDuration = trips.reduce((sum, t) => sum + t.duration, 0);
    const harshBrakes = trips.reduce((sum, t) => sum + t.harshBrakes, 0);
    const harshAccel = trips.reduce((sum, t) => sum + t.harshAccel, 0);
    const speedViolations = trips.reduce((sum, t) => sum + t.speedViolations, 0);
    const scores = trips.flatMap((t) => (t.drivingScore == null ? [] : [t.drivingScore]));
    const ecoScores = trips.flatMap((t) => (t.ecoScore == null ? [] : [t.ecoScore]));

    const weaknesses: string[] = [];
    if (speedViolations > 0) weaknesses.push('respect des limitations de vitesse');
    if (harshBrakes > 0) weaknesses.push('anticipation et freinage progressif');
    if (harshAccel > 0) weaknesses.push('accélérations souples');
    if (!weaknesses.length) weaknesses.push('continuer la conduite préventive et l\'anticipation');

    return NextResponse.json({
      period,
      from: periodStart(period).toISOString(),
      to: new Date().toISOString(),
      performance: {
        trips: trips.length,
        distanceKm: Math.round(totalDistance * 10) / 10,
        durationMinutes: Math.round(totalDuration / 60),
        averageDrivingScore: average(scores),
        averageEcoScore: average(ecoScores),
        harshBrakes,
        harshAccel,
        speedViolations,
      },
      improvements: weaknesses,
      trips: trips.map((t) => ({
        id: t.id,
        startTime: t.startTime,
        endTime: t.endTime,
        startAddress: t.startAddress,
        endAddress: t.endAddress,
        distance: t.distance,
        duration: t.duration,
        avgSpeed: t.avgSpeed,
        maxSpeed: t.maxSpeed,
        drivingScore: t.drivingScore,
        ecoScore: t.ecoScore,
        harshBrakes: t.harshBrakes,
        harshAccel: t.harshAccel,
        speedViolations: t.speedViolations,
        weather: t.weather,
        roadType: t.roadType,
      })),
    });
  } catch (error) {
    console.error('[GET /api/driving/report] Error:', error);
    return NextResponse.json({ error: 'Impossible de générer le bilan de conduite' }, { status: 500 });
  }
}
