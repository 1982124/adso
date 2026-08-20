import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 250 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'application/epub+zip'];

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManage((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });

  try {
    const result = await handleUpload({
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let payload: { ebookId?: string; mimeType?: string; sizeBytes?: number; filename?: string } = {};
        try { payload = JSON.parse(clientPayload ?? '{}'); } catch { throw new Error('Payload eBook invalide'); }
        const ebookId = String(payload.ebookId ?? '');
        const mimeType = String(payload.mimeType ?? '');
        const sizeBytes = Number(payload.sizeBytes ?? 0);
        if (!ebookId) throw new Error('ebookId requis');
        if (!ALLOWED_TYPES.includes(mimeType)) throw new Error('Format eBook non autorisé');
        if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_BYTES) throw new Error('Fichier eBook trop volumineux');

        const exists = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "Ebook" WHERE "id"=${ebookId} LIMIT 1`);
        if (!exists[0]) throw new Error('eBook introuvable');

        const pathname = `ebooks/${ebookId}/${crypto.randomUUID()}-${String(payload.filename ?? 'book').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ ebookId, pathname, userId: getUserId(session), mimeType, sizeBytes }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload ?? '{}') as { ebookId?: string; mimeType?: string; sizeBytes?: number };
        if (!payload.ebookId) throw new Error('Upload eBook sans ebookId');
        await db.$executeRaw(Prisma.sql`
          INSERT INTO "EbookAsset" ("id","ebookId","pathname","url","contentType","sizeBytes","status")
          VALUES (${crypto.randomUUID()},${payload.ebookId},${blob.pathname},${blob.url},${payload.mimeType ?? blob.contentType},${payload.sizeBytes ?? 0},'ready')
          ON CONFLICT ("ebookId") DO UPDATE SET "pathname"=EXCLUDED."pathname","url"=EXCLUDED."url","contentType"=EXCLUDED."contentType","sizeBytes"=EXCLUDED."sizeBytes","status"='ready',"updatedAt"=CURRENT_TIMESTAMP
        `);
        await db.$executeRaw(Prisma.sql`
          UPDATE "Ebook" SET "contentPath"=${blob.pathname},"contentUrl"=${blob.url},"contentType"=${payload.mimeType ?? blob.contentType},"contentDisposition"=${blob.contentDisposition},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${payload.ebookId}
        `);
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/admin/ebooks/upload]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload eBook impossible' }, { status: 400 });
  }
}
