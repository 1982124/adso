import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';
import { clampVideoDuration, normalizePause } from '@/lib/engines/immersive-scene-engine';

async function ensureTables() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ImmersiveScene" (
      "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
      "videoUrl" TEXT NOT NULL, "durationSeconds" INTEGER NOT NULL, "courseId" TEXT,
      "moduleId" TEXT, "competency" TEXT NOT NULL, "level" TEXT NOT NULL DEFAULT 'beginner',
      "language" TEXT NOT NULL DEFAULT 'fr', "status" TEXT NOT NULL DEFAULT 'draft',
      "order" INTEGER NOT NULL DEFAULT 0, "createdById" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS "ImmersiveInteraction" (
      "id" TEXT PRIMARY KEY, "sceneId" TEXT NOT NULL REFERENCES "ImmersiveScene"("id") ON DELETE CASCADE,
      "type" TEXT NOT NULL, "atSecond" DOUBLE PRECISION NOT NULL, "prompt" TEXT NOT NULL,
      "explanation" TEXT, "ttsText" TEXT, "points" INTEGER NOT NULL DEFAULT 10,
      "order" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS "ImmersiveChoice" (
      "id" TEXT PRIMARY KEY, "interactionId" TEXT NOT NULL REFERENCES "ImmersiveInteraction"("id") ON DELETE CASCADE,
      "label" TEXT NOT NULL, "isCorrect" BOOLEAN NOT NULL DEFAULT false, "scoreDelta" INTEGER NOT NULL DEFAULT 0,
      "consequence" TEXT NOT NULL, "explanation" TEXT NOT NULL, "competency" TEXT,
      "nextInteractionId" TEXT, "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS "ImmersiveInteraction_sceneId_idx" ON "ImmersiveInteraction"("sceneId");
    CREATE INDEX IF NOT EXISTS "ImmersiveChoice_interactionId_idx" ON "ImmersiveChoice"("interactionId");
  `);
}

export async function GET() {
  // Published scenes are intentionally public so the immersive library does not
  // appear empty to a visitor. Drafts remain visible only to their creator.
  const session = await getSession();
  try {
    const userId = session?.user ? getUserId(session) : null;
    const scenes = await db.$queryRawUnsafe(`
      SELECT s.*, COALESCE(json_agg(json_build_object(
        'id', i.id, 'type', i.type, 'atSecond', i."atSecond", 'prompt', i.prompt,
        'explanation', i.explanation, 'ttsText', i."ttsText", 'points', i.points,
        'choices', (SELECT COALESCE(json_agg(json_build_object(
          'id', c.id, 'label', c.label, 'isCorrect', c."isCorrect", 'scoreDelta', c."scoreDelta",
          'consequence', c.consequence, 'explanation', c.explanation, 'competency', c.competency,
          'nextInteractionId', c."nextInteractionId"
        ) ORDER BY c."order"), '[]'::json) FROM "ImmersiveChoice" c WHERE c."interactionId" = i.id)
      ) ORDER BY i."order") FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS interactions
      FROM "ImmersiveScene" s LEFT JOIN "ImmersiveInteraction" i ON i."sceneId" = s.id
      WHERE s.status = 'published' OR s."createdById" = $1
      GROUP BY s.id ORDER BY s."order", s."createdAt" DESC
    `, userId);
    return NextResponse.json({ scenes }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('[immersive/scenes GET]', error);
    return NextResponse.json({ error: 'Impossible de charger les scènes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  const role = String((session.user as Record<string, unknown>).role ?? 'student');
  if (!['instructor', 'admin', 'super_admin'].includes(role)) {
    return NextResponse.json({ error: 'Droits instructeur requis' }, { status: 403 });
  }

  try {
    await ensureTables();
    const body = await request.json();
    const durationSeconds = clampVideoDuration(Number(body.durationSeconds));
    const sceneId = randomUUID();
    const interactions = Array.isArray(body.interactions) ? body.interactions : [];

    await db.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`INSERT INTO "ImmersiveScene"
        ("id","title","description","videoUrl","durationSeconds","courseId","moduleId","competency","level","language","status","order","createdById")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        sceneId, String(body.title ?? 'Scène immersive'), String(body.description ?? ''), String(body.videoUrl ?? ''),
        durationSeconds, body.courseId ?? null, body.moduleId ?? null, String(body.competency ?? 'Conduite sûre'),
        String(body.level ?? 'beginner'), String(body.language ?? 'fr'), String(body.status ?? 'draft'), Number(body.order ?? 0), getUserId(session));

      for (let index = 0; index < interactions.length; index += 1) {
        const interaction = interactions[index] ?? {};
        const interactionId = randomUUID();
        await tx.$executeRawUnsafe(`INSERT INTO "ImmersiveInteraction"
          ("id","sceneId","type","atSecond","prompt","explanation","ttsText","points","order")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          interactionId, sceneId, String(interaction.type ?? 'decision'), normalizePause(Number(interaction.atSecond ?? 0), durationSeconds),
          String(interaction.prompt ?? ''), interaction.explanation ?? null, interaction.ttsText ?? null,
          Number(interaction.points ?? 10), index);

        const choices = Array.isArray(interaction.choices) ? interaction.choices : [];
        for (let choiceIndex = 0; choiceIndex < choices.length; choiceIndex += 1) {
          const choice = choices[choiceIndex] ?? {};
          await tx.$executeRawUnsafe(`INSERT INTO "ImmersiveChoice"
            ("id","interactionId","label","isCorrect","scoreDelta","consequence","explanation","competency","nextInteractionId","order")
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            randomUUID(), interactionId, String(choice.label ?? ''), Boolean(choice.isCorrect), Number(choice.scoreDelta ?? 0),
            String(choice.consequence ?? ''), String(choice.explanation ?? ''), choice.competency ?? null, choice.nextInteractionId ?? null, choiceIndex);
        }
      }
    });

    return NextResponse.json({ id: sceneId, status: body.status ?? 'draft' }, { status: 201 });
  } catch (error) {
    console.error('[immersive/scenes POST]', error);
    return NextResponse.json({ error: 'Création de scène impossible' }, { status: 500 });
  }
}
