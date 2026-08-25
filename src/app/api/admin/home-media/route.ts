import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const MAX_BYTES = 12 * 1024 * 1024;
// SVG is supported because the ADSO Home master artwork is SVG.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const isAdmin = (role: unknown) => ['admin', 'super_admin'].includes(String(role ?? ''));

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!isAdmin((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  const [published, draft] = await Promise.all([
    db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`SELECT * FROM "HomeMediaAsset" WHERE "status"='published' ORDER BY "publishedAt" DESC NULLS LAST LIMIT 1`),
    db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`SELECT * FROM "HomeMediaAsset" WHERE "status"='draft' ORDER BY "createdAt" DESC LIMIT 1`),
  ]);
  return NextResponse.json({ published: published[0] ?? null, draft: draft[0] ?? null });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!isAdmin((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[POST /api/admin/home-media] BLOB_READ_WRITE_TOKEN is not configured');
    return NextResponse.json({ error: 'Le service d’import d’images est temporairement indisponible. Veuillez réessayer plus tard.' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let payload: { mimeType?: string; sizeBytes?: number; filename?: string; alt?: string } = {};
        try { payload = JSON.parse(clientPayload ?? '{}'); } catch { throw new Error('Payload image invalide'); }
        const mimeType = String(payload.mimeType ?? '');
        const sizeBytes = Number(payload.sizeBytes ?? 0);
        if (!ALLOWED_TYPES.includes(mimeType)) throw new Error('Format image non autorisé');
        if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_BYTES) throw new Error('Image trop volumineuse (12 Mo maximum)');
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ userId, mimeType, sizeBytes, alt: String(payload.alt ?? '').slice(0, 300) }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload ?? '{}') as { userId?: string; mimeType?: string; sizeBytes?: number; alt?: string };
        if (!payload.userId || payload.userId !== userId) throw new Error('Upload non autorisé');
        await db.$executeRaw(Prisma.sql`INSERT INTO "HomeMediaAsset" ("id","pathname","url","contentType","sizeBytes","alt","status","uploadedBy") VALUES (${crypto.randomUUID()},${blob.pathname},${blob.url},${payload.mimeType ?? blob.contentType},${payload.sizeBytes ?? 0},${payload.alt ?? ''},'draft',${userId})`);
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/admin/home-media]', error);
    return NextResponse.json({ error: 'Impossible d’importer cette image pour le moment. Veuillez réessayer.' }, { status: 503 });
  }
}
