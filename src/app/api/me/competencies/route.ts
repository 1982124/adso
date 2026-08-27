import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  try {
    const rows = await db.$queryRawUnsafe<Array<{
      competency: string;
      level: number;
      attempts: number;
      lastScore: number;
      strengths: string | null;
      weaknesses: string | null;
      updatedAt: Date;
    }>>(`
      SELECT "competency", "level", "attempts", "lastScore", "strengths", "weaknesses", "updatedAt"
      FROM "ImmersiveCompetency"
      WHERE "userId" = $1
      ORDER BY "level" DESC, "updatedAt" DESC
    `, userId);

    const competencies = rows.map((row) => {
      const level = Math.max(0, Math.min(100, Number(row.level) || 0));
      const attempts = Math.max(0, Number(row.attempts) || 0);
      let status: 'en_developpement' | 'acquise' | 'consolidee' | 'reconnue' = 'en_developpement';
      if (level >= 80 && attempts >= 2) status = 'reconnue';
      else if (level >= 60 && attempts >= 2) status = 'consolidee';
      else if (level >= 35) status = 'acquise';

      return {
        competency: row.competency,
        level: Math.round(level),
        attempts,
        lastScore: Math.round(Math.max(0, Math.min(100, Number(row.lastScore) || 0))),
        status,
        strengths: row.strengths,
        weaknesses: row.weaknesses,
        updatedAt: row.updatedAt,
      };
    });

    const recognized = competencies.filter((item) => item.status === 'reconnue');
    const acquired = competencies.filter((item) => item.status === 'acquise' || item.status === 'consolidee');
    const averageLevel = competencies.length
      ? Math.round(competencies.reduce((sum, item) => sum + item.level, 0) / competencies.length)
      : 0;

    return NextResponse.json({
      competencies,
      summary: {
        total: competencies.length,
        acquired: acquired.length,
        recognized: recognized.length,
        averageLevel,
      },
      recognitionPolicy: {
        acquired: 'Au moins 35 % de niveau démontré.',
        consolidated: 'Au moins 60 % et au moins 2 évaluations.',
        recognized: 'Au moins 80 % et au moins 2 évaluations.',
        legalScope: 'Reconnaissance pédagogique ADSO uniquement ; ne constitue ni permis, ni certification officielle, ni autorisation administrative de conduire.',
      },
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('[me/competencies GET]', error);
    return NextResponse.json({ error: 'Impossible de charger le dossier de compétences' }, { status: 500 });
  }
}
