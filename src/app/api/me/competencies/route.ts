import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

function recognitionLevel(level: number, attempts: number) {
  if (level >= 80 && attempts >= 2) return 'Reconnaissance ADSO';
  if (level >= 60 && attempts >= 2) return 'Consolidée';
  if (level >= 35) return 'Acquise';
  return 'En développement';
}

function recognitionReason(level: number, attempts: number, status: string) {
  if (status === 'Reconnaissance ADSO') return 'Niveau démontré ≥ 80 % sur au moins 2 évaluations.';
  if (status === 'Consolidée') return 'Niveau démontré ≥ 60 % sur au moins 2 évaluations.';
  if (status === 'Acquise') return 'Niveau démontré ≥ 35 %.';
  if (attempts === 0) return 'Aucune évaluation enregistrée pour le moment.';
  return 'Le niveau démontré reste inférieur au seuil d’acquisition.';
}

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  try {
    const competencies = await db.$queryRawUnsafe<Array<{
      competency: string; level: number; attempts: number; lastScore: number;
      strengths: string | null; weaknesses: string | null; updatedAt: Date;
    }>>(`SELECT "competency", "level", "attempts", "lastScore", "strengths", "weaknesses", "updatedAt"
      FROM "ImmersiveCompetency" WHERE "userId" = $1 ORDER BY "level" DESC, "updatedAt" DESC`, userId);

    // Keep the five most recent pieces of evidence per competency. Partitioning
    // in SQL prevents a busy competency from starving the others of evidence.
    const evidence = await db.$queryRawUnsafe<Array<{
      competency: string; sceneId: string; sceneTitle: string; score: number;
      maxScore: number; accuracy: number; completedAt: Date | null;
    }>>(`
      WITH ranked AS (
        SELECT c."competency", a."sceneId", s."title" AS "sceneTitle", a."score", a."maxScore", a."accuracy", a."completedAt",
          ROW_NUMBER() OVER (
            PARTITION BY c."competency"
            ORDER BY a."completedAt" DESC NULLS LAST, a."createdAt" DESC
          ) AS rn
        FROM "ImmersiveCompetency" c
        JOIN "ImmersiveAttempt" a ON a."userId" = c."userId"
        JOIN "ImmersiveScene" s ON s."id" = a."sceneId"
        WHERE c."userId" = $1 AND s."competency" = c."competency"
      )
      SELECT "competency", "sceneId", "sceneTitle", "score", "maxScore", "accuracy", "completedAt"
      FROM ranked WHERE rn <= 5
      ORDER BY "competency", "completedAt" DESC NULLS LAST`, userId);

    const evidenceByCompetency = new Map<string, typeof evidence>();
    for (const item of evidence) {
      const list = evidenceByCompetency.get(item.competency) ?? [];
      list.push(item);
      evidenceByCompetency.set(item.competency, list);
    }

    const items = competencies.map((row) => {
      const level = Math.max(0, Math.min(100, Number(row.level) || 0));
      const attempts = Math.max(0, Number(row.attempts) || 0);
      const status = recognitionLevel(level, attempts);
      const proofs = evidenceByCompetency.get(row.competency) ?? [];
      const avgAccuracy = proofs.length
        ? Math.round((proofs.reduce((sum, proof) => sum + Number(proof.accuracy || 0), 0) / proofs.length) * 100)
        : 0;
      return {
        competency: row.competency,
        level: Math.round(level),
        attempts,
        lastScore: Math.round(Math.max(0, Math.min(100, Number(row.lastScore) || 0))),
        status,
        recognitionReason: recognitionReason(level, attempts, status),
        evidenceCount: proofs.length,
        recentEvidenceAverageAccuracy: avgAccuracy,
        strengths: row.strengths,
        weaknesses: row.weaknesses,
        updatedAt: row.updatedAt,
        evidence: proofs,
      };
    });

    const recognized = items.filter((item) => item.status === 'Reconnaissance ADSO');
    const acquired = items.filter((item) => item.status === 'Acquise' || item.status === 'Consolidée');
    const averageLevel = items.length ? Math.round(items.reduce((sum, item) => sum + item.level, 0) / items.length) : 0;

    return NextResponse.json({
      framework: 'Référentiel ADSO des compétences de mobilité sûre — V1',
      competencies: items,
      summary: { total: items.length, acquired: acquired.length, recognized: recognized.length, averageLevel },
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