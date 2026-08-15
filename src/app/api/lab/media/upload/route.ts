import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_BYTES = 500 * 1024 * 1024;

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

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManageMedia((session.user as Record<string, unknown>).role)) {
    return NextResponse.json({ error: 'Droits instructeur requis' }, { status: 403 });
  }

  try {
    await ensureTable();
    const body = await request.json();
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payload: Record<string, unknown> = {};
        try { payload = JSON.parse(clientPayload ?? '{}') as Record<string, unknown>; } catch { throw new Error('Payload vidéo invalide'); }
        const mimeType = String(payload.mimeType ?? '');
        const sizeBytes = Number(payload.sizeBytes ?? 0);
        if (!ALLOWED_TYPES.includes(mimeType)) throw new Error('Type vidéo non autorisé');
        if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_BYTES) throw new Error('Fichier vidéo trop volumineux');
        if (!Boolean(payload.copyrightConfirmed)) throw new Error('Les droits de diffusion doivent être confirmés');

        const assetId = randomUUID();
        await db.$executeRawUnsafe(
          `INSERT INTO "LabMediaAsset" ("id","ownerId","courseId","moduleId","name","url","pathname","mimeType","sizeBytes","status","copyrightConfirmed","moderationStatus") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'processing',$10,'pending')`,
          assetId,
          getUserId(session),
          payload.courseId ?? null,
          payload.moduleId ?? null,
          String(payload.name ?? pathname.split('/').pop() ?? 'video'),
          '',
          pathname,
          mimeType,
          sizeBytes,
          true,
        );
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ assetId, userId: getUserId(session) }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload ?? '{}') as { assetId?: string };
        if (!payload.assetId) return;
        await db.$executeRawUnsafe(
          `UPDATE "LabMediaAsset" SET "url"=$1,"pathname"=$2,"status"='ready',"moderationStatus"='pending',"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=$3`,
          blob.url,
          blob.pathname,
          payload.assetId,
        );
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[lab/media/upload]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload impossible' }, { status: 400 });
  }
}
