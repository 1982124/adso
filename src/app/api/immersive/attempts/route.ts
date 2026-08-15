import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';
import { evaluateScene, type ImmersiveAnswer, type ImmersiveInteraction } from '@/lib/engines/immersive-scene-engine';

async function ensureAttemptTables() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ImmersiveAttempt" (
      "id" TEXT PRIMARY KEY, "sceneId" TEXT NOT NULL REFERENCES "ImmersiveScene"("id") ON DELETE CASCADE,
      "userId" TEXT NOT NULL, "score" DOUBLE PRECISION NOT NULL DEFAULT 0, "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0, "competencyGain" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "answersJson" TEXT NOT NULL DEFAULT '[]', "completedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS "ImmersiveCompetency" (
      "id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "competency" TEXT NOT NULL,
      "level" DOUBLE PRECISION NOT NULL DEFAULT 0, "attempts" INTEGER NOT NULL DEFAULT 0,
      "lastScore" DOUBLE PRECISION NOT NULL DEFAULT 0, "strengths" TEXT, "weaknesses" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE("userId", "competency")
    );
  `);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  try {
    await ensureAttemptTables();
    const body = await request.json();
    const sceneId = String(body.sceneId ?? '');
    if (!sceneId) return NextResponse.json({ error: 'sceneId requis' }, { status: 400 });

    const interactions = (body.interactions ?? []) as ImmersiveInteraction[];
    const answers = (body.answers ?? []) as ImmersiveAnswer[];
    const result = evaluateScene(interactions, answers);
    const competency = String(body.competency ?? 'Conduite sûre');

    await db.$executeRawUnsafe(`INSERT INTO "ImmersiveAttempt"
      ("id","sceneId","userId","score","maxScore","accuracy","competencyGain","answersJson","completedAt")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      randomUUID(), sceneId, userId, result.score, result.maxScore, result.accuracy, result.competencyGain,
      JSON.stringify(result.answers), result.completed ? new Date() : null);

    await db.$executeRawUnsafe(`
      INSERT INTO "ImmersiveCompetency" ("id","userId","competency","level","attempts","lastScore")
      VALUES ($1,$2,$3,$4,1,$5)
      ON CONFLICT ("userId","competency") DO UPDATE SET
        "level" = LEAST(100, ("ImmersiveCompetency"."level" * 0.7) + (EXCLUDED."level" * 0.3)),
        "attempts" = "ImmersiveCompetency"."attempts" + 1,
        "lastScore" = EXCLUDED."lastScore",
        "updatedAt" = CURRENT_TIMESTAMP`,
      randomUUID(), userId, competency, result.competencyGain, result.score);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[immersive/attempts POST]', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer la progression' }, { status: 500 });
  }
}
