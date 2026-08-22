import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

const isAdmin = (role: unknown) => ['admin', 'super_admin'].includes(String(role ?? ''));

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!isAdmin((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });
  try {
    const body = (await request.json()) as { id?: string; alt?: string };
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'Image à publier requise' }, { status: 400 });
    const result = await db.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<Array<{ id: string; url: string }>>(Prisma.sql`SELECT "id","url" FROM "HomeMediaAsset" WHERE "id"=${id} LIMIT 1`);
      if (!rows[0]) throw new Error('Image introuvable');
      await tx.$executeRaw(Prisma.sql`UPDATE "HomeMediaAsset" SET "status"='archived', "updatedAt"=CURRENT_TIMESTAMP WHERE "status"='published'`);
      await tx.$executeRaw(Prisma.sql`UPDATE "HomeMediaAsset" SET "status"='published', "alt"=${String(body.alt ?? '').slice(0,300)}, "publishedAt"=CURRENT_TIMESTAMP, "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${id}`);
      await tx.$executeRaw(Prisma.sql`INSERT INTO "AnalyticsEvent" ("id","eventType","userId","metadata","createdAt") VALUES (${crypto.randomUUID()},'home_media_published',${userId},${JSON.stringify({ mediaId: id })},CURRENT_TIMESTAMP)`);
      return rows[0];
    });
    return NextResponse.json({ ok: true, published: result });
  } catch (error) {
    console.error('[POST /api/admin/home-media/publish]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Publication impossible' }, { status: 400 });
  }
}
