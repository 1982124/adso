import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManage((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let payload: { ebookId?: string; mimeType?: string; sizeBytes?: number; filename?: string; title?: string; description?: string } = {};
        try { payload = JSON.parse(clientPayload ?? '{}'); } catch { throw new Error('Payload marketing invalide'); }
        const ebookId = String(payload.ebookId ?? '');
        const mimeType = String(payload.mimeType ?? '');
        const sizeBytes = Number(payload.sizeBytes ?? 0);
        const title = String(payload.title ?? '').trim();
        if (!ebookId || !title) throw new Error('eBook et titre requis');
        if (!ALLOWED_TYPES.includes(mimeType)) throw new Error('Format teaser non autorisé');
        if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_BYTES) throw new Error('Teaser trop volumineux');
        const exists = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "Ebook" WHERE "id"=${ebookId} LIMIT 1`);
        if (!exists[0]) throw new Error('eBook introuvable');
        const pathname = `ebooks/${ebookId}/marketing/${crypto.randomUUID()}-${String(payload.filename ?? 'teaser').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: false, tokenPayload: JSON.stringify({ ebookId, mimeType, sizeBytes, title, description: String(payload.description ?? ''), pathname }) };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload ?? '{}') as { ebookId?: string; mimeType?: string; sizeBytes?: number; title?: string; description?: string };
        if (!payload.ebookId || !payload.title) throw new Error('Upload teaser incomplet');
        await db.$executeRaw(Prisma.sql`
          INSERT INTO "EbookMarketingAsset" ("id","ebookId","kind","title","description","pathname","url","contentType","sizeBytes","status")
          VALUES (${crypto.randomUUID()},${payload.ebookId},${payload.mimeType?.startsWith('video/') ? 'video_teaser' : 'image_promo'},${payload.title},${payload.description ?? null},${blob.pathname},${blob.url},${payload.mimeType ?? blob.contentType},${payload.sizeBytes ?? 0},'draft')
        `);
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/admin/ebooks/marketing-upload]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload marketing impossible' }, { status: 400 });
  }
}
