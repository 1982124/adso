import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';
import { evaluateScene, type ImmersiveAnswer, type ImmersiveInteraction } from '@/lib/engines/immersive-scene-engine';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  try {
    const body = await request.json();
    const sceneId = typeof body.sceneId === 'string' ? body.sceneId.trim() : '';
    if (!sceneId) return NextResponse.json({ error: 'sceneId requis' }, { status: 400 });
    if (!Array.isArray(body.answers)) return NextResponse.json({ error: 'answers doit être un tableau' }, { status: 400 });

    // Never trust scoring data supplied by the browser. Load the canonical
    // published scene and its choices from Neon, then evaluate server-side.
    const rows = await db.$queryRawUnsafe<Array<{
      id: string;
      competency: string;
      courseId: string | null;
      moduleId: string | null;
      interactions: ImmersiveInteraction[];
    }>>(`
      SELECT s.id, s.competency, s."courseId", s."moduleId",
        COALESCE(json_agg(json_build_object(
          'id', i.id, 'type', i.type, 'atSecond', i."atSecond", 'prompt', i.prompt,
          'explanation', i.explanation, 'ttsText', i."ttsText", 'points', i.points,
          'choices', (SELECT COALESCE(json_agg(json_build_object(
            'id', c.id, 'label', c.label, 'isCorrect', c."isCorrect", 'scoreDelta', c."scoreDelta",
            'consequence', c.consequence, 'explanation', c.explanation, 'competency', c.competency,
            'nextInteractionId', c."nextInteractionId"
          ) ORDER BY c."order"), '[]'::json)
          FROM "ImmersiveChoice" c WHERE c."interactionId" = i.id)
        ) ORDER BY i."order") FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS interactions
      FROM "ImmersiveScene" s
      LEFT JOIN "ImmersiveInteraction" i ON i."sceneId" = s.id
      WHERE s.id = $1 AND s.status = 'published'
      GROUP BY s.id`, sceneId);

    const scene = rows[0];
    if (!scene) return NextResponse.json({ error: 'Scène publiée introuvable' }, { status: 404 });

    const canonicalInteractions = scene.interactions ?? [];
    if (canonicalInteractions.length === 0) {
      return NextResponse.json({ error: 'Cette scène ne contient aucune interaction pédagogique.' }, { status: 409 });
    }

    const canonicalChoices = new Map<string, { scoreDelta: number; correct: boolean }>();
    for (const interaction of canonicalInteractions) {
      for (const choice of interaction.choices ?? []) {
        canonicalChoices.set(`${interaction.id}:${choice.id}`, {
          scoreDelta: Number(choice.scoreDelta ?? 0),
          correct: Boolean(choice.isCorrect),
        });
      }
    }

    const seenInteractions = new Set<string>();
    const answers: ImmersiveAnswer[] = [];
    for (const rawAnswer of body.answers) {
      if (!rawAnswer || typeof rawAnswer !== 'object') continue;
      const item = rawAnswer as Record<string, unknown>;
      const interactionId = typeof item.interactionId === 'string' ? item.interactionId : '';
      const choiceId = typeof item.choiceId === 'string' ? item.choiceId : '';
      if (!interactionId || !choiceId || seenInteractions.has(interactionId)) continue;
      const canonical = canonicalChoices.get(`${interactionId}:${choiceId}`);
      if (!canonical) continue;
      seenInteractions.add(interactionId);
      answers.push({ interactionId, choiceId, scoreDelta: canonical.scoreDelta, correct: canonical.correct });
    }

    // A completed scene must contain exactly one valid decision for every
    // canonical interaction. This prevents forged partial attempts and keeps
    // progression semantics deterministic.
    if (answers.length !== canonicalInteractions.length) {
      return NextResponse.json({
        error: 'Toutes les décisions de la scène doivent être complétées avant l’enregistrement.',
        answered: answers.length,
        required: canonicalInteractions.length,
      }, { status: 400 });
    }

    const result = evaluateScene(canonicalInteractions, answers);
    const competency = String(scene.competency || 'Conduite sûre');

    let persistedCourseProgress: number | null = null;
    let persistedCourseStatus: string | null = null;

    if (scene.courseId && scene.moduleId) {
      const [course, courseModule] = await Promise.all([
        db.course.findUnique({ where: { id: scene.courseId }, select: { id: true } }),
        db.module.findUnique({ where: { id: scene.moduleId }, select: { id: true, courseId: true } }),
      ]);
      if (!course || !courseModule || courseModule.courseId !== course.id) {
        return NextResponse.json({ error: 'Lien scène → cours/module invalide' }, { status: 409 });
      }

      const moduleCount = await db.module.count({ where: { courseId: course.id } });
      const previous = await db.studentProgress.findUnique({
        where: { courseId_userId: { courseId: course.id, userId } },
        select: { completedModules: true },
      });
      let completed: string[] = [];
      try {
        const parsed = previous?.completedModules ? JSON.parse(previous.completedModules) : [];
        completed = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
      } catch {
        completed = [];
      }
      if (!completed.includes(courseModule.id)) completed.push(courseModule.id);

      persistedCourseProgress = Math.min(100, Math.round((completed.length / Math.max(1, moduleCount)) * 100));
      persistedCourseStatus = persistedCourseProgress >= 100 ? 'completed' : 'in_progress';

      await db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`INSERT INTO "ImmersiveAttempt"
          ("id","sceneId","userId","score","maxScore","accuracy","competencyGain","answersJson","completedAt")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          randomUUID(), sceneId, userId, result.score, result.maxScore, result.accuracy, result.competencyGain,
          JSON.stringify(result.answers), new Date());

        await tx.$executeRawUnsafe(`
          INSERT INTO "ImmersiveCompetency" ("id","userId","competency","level","attempts","lastScore")
          VALUES ($1,$2,$3,$4,1,$5)
          ON CONFLICT ("userId","competency") DO UPDATE SET
            "level" = LEAST(100, ("ImmersiveCompetency"."level" * 0.7) + (EXCLUDED."level" * 0.3)),
            "attempts" = "ImmersiveCompetency"."attempts" + 1,
            "lastScore" = EXCLUDED."lastScore",
            "updatedAt" = CURRENT_TIMESTAMP`,
          randomUUID(), userId, competency, result.competencyGain, result.score);

        await tx.enrollment.upsert({
          where: { courseId_userId: { courseId: course.id, userId } },
          create: { courseId: course.id, userId, status: 'active' },
          update: { status: 'active' },
        });
        await tx.studentProgress.upsert({
          where: { courseId_userId: { courseId: course.id, userId } },
          create: {
            userId,
            courseId: course.id,
            progress: persistedCourseProgress ?? 0,
            status: persistedCourseStatus ?? 'in_progress',
            completedModules: JSON.stringify(completed),
            lastAccess: new Date(),
          },
          update: {
            progress: persistedCourseProgress ?? 0,
            status: persistedCourseStatus ?? 'in_progress',
            completedModules: JSON.stringify(completed),
            lastAccess: new Date(),
          },
        });
      });
    } else {
      await db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`INSERT INTO "ImmersiveAttempt"
          ("id","sceneId","userId","score","maxScore","accuracy","competencyGain","answersJson","completedAt")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          randomUUID(), sceneId, userId, result.score, result.maxScore, result.accuracy, result.competencyGain,
          JSON.stringify(result.answers), new Date());

        await tx.$executeRawUnsafe(`
          INSERT INTO "ImmersiveCompetency" ("id","userId","competency","level","attempts","lastScore")
          VALUES ($1,$2,$3,$4,1,$5)
          ON CONFLICT ("userId","competency") DO UPDATE SET
            "level" = LEAST(100, ("ImmersiveCompetency"."level" * 0.7) + (EXCLUDED."level" * 0.3)),
            "attempts" = "ImmersiveCompetency"."attempts" + 1,
            "lastScore" = EXCLUDED."lastScore",
            "updatedAt" = CURRENT_TIMESTAMP`,
          randomUUID(), userId, competency, result.competencyGain, result.score);
      });
    }

    return NextResponse.json({
      ...result,
      progress: persistedCourseProgress,
      progressStatus: persistedCourseStatus,
    });
  } catch (error) {
    console.error('[immersive/attempts POST]', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer la progression' }, { status: 500 });
  }
}
