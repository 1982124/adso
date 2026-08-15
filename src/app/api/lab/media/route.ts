import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

function canManageMedia(role: unknown) {
  return ['instructor', 'admin', 'super_admin'].includes(String(role ?? 'student'));
}

async function ensureTable() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LabMediaAsset" (
      "id" TEXT PRIMARY KEY, "ownerId" TEXT NOT NULL, "courseId" TEXT, "moduleId" TEXT,
      "name" TEXT NOT NULL, "url" TEXT NOT NULL, "pathname" TEXT NOT NULL, "mimeType" TEXT NOT NULL,
      "sizeBytes" BIGINT NOT NULL DEFAULT 0, "durationSeconds" INTEGER,
      "status" TEXT NOT NULL DEFAULT 'queued', "provider" TEXT NOT NULL DEFAULT 'vercel-blob',
      "copyrightConfirmed" BOOLEAN NOT NULL DEFAULT false, "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
      "failureReason" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "LabMediaAsset_ownerId_idx" ON "LabMediaAsset"("ownerId");
    CREATE INDEX IF NOT EXISTS "LabMediaAsset_moduleId_idx" ON "LabMediaAsset"("moduleId");
    CREATE INDEX IF NOT EXISTS "LabMediaAsset_status_idx" ON "LabMediaAsset"("status");
  `);
}

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  try {
    await ensureTable();
    const assets = await db.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT "id","ownerId","courseId","moduleId","name","url","pathname","mimeType","sizeBytes","durationSeconds","status","provider","copyrightConfirmed","moderationStatus","failureReason","createdAt","updatedAt" FROM "LabMediaAsset" WHERE "ownerId"=$1 OR $2 IN ('admin','super_admin') ORDER BY "createdAt" DESC LIMIT 100`,
      getUserId(session),
      String((session.user as Record<string, unknown>).role ?? 'student'),
    );
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('[lab/media GET]', error);
    return NextResponse.json({ error: 'Impossible de charger les médias' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManageMedia((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits instructeur requis' }, { status: 403 });
  try {
    await ensureTable();
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'Identifiant requis' }, { status: 400 });
    const existing = await db.$queryRawUnsafe<Array<{ ownerId: string; moderationStatus: string }>>(
      `SELECT "ownerId","moderationStatus" FROM "LabMediaAsset" WHERE "id"=$1 LIMIT 1`, id,
    );
    if (!existing[0]) return NextResponse.json({ error: 'Média introuvable' }, { status: 404 });
    const role = String((session.user as Record<string, unknown>).role ?? 'student');
    if (existing[0].ownerId !== getUserId(session) && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    }

    const moderationStatus = body.moderationStatus ? String(body.moderationStatus) : undefined;
    const status = body.status ? String(body.status) : undefined;
    const allowedModeration = ['pending', 'approved', 'rejected'];
    const allowedStatus = ['queued', 'processing', 'ready', 'failed'];
    if (moderationStatus && !allowedModeration.includes(moderationStatus)) return NextResponse.json({ error: 'Statut de modération invalide' }, { status: 400 });
    if (status && !allowedStatus.includes(status)) return NextResponse.json({ error: 'Statut média invalide' }, { status: 400 });
    if (status === 'ready' && (moderationStatus ?? existing[0].moderationStatus) !== 'approved') {
      return NextResponse.json({ error: 'Un média doit être modéré avant publication' }, { status: 409 });
    }

    await db.$executeRawUnsafe(
      `UPDATE "LabMediaAsset" SET "status"=COALESCE($1,"status"),"moderationStatus"=COALESCE($2,"moderationStatus"),"failureReason"=CASE WHEN $1='failed' THEN $3 ELSE NULL END,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=$4`,
      status ?? null,
      moderationStatus ?? null,
      body.failureReason ? String(body.failureReason) : null,
      id,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[lab/media PATCH]', error);
    return NextResponse.json({ error: 'Mise à jour impossible' }, { status: 500 });
  }
}
