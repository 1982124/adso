import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function canManage(role: unknown) { return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student')); }

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManage((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  const ebookId = new URL(request.url).searchParams.get('ebookId');
  if (!ebookId) return NextResponse.json({ error: 'ebookId requis' }, { status: 400 });
  const assets = await db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`SELECT "id","ebookId","kind","title","description","pathname","url","contentType","sizeBytes","durationSeconds","status","createdAt","updatedAt" FROM "EbookMarketingAsset" WHERE "ebookId"=${ebookId} ORDER BY "createdAt" DESC`);
  return NextResponse.json({ assets });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!canManage((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  try {
    const body = await request.json();
    const id = String(body?.id ?? '');
    const status = String(body?.status ?? 'draft');
    if (!id || !['draft', 'published', 'archived'].includes(status)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    await db.$executeRaw(Prisma.sql`UPDATE "EbookMarketingAsset" SET "status"=${status},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${id}`);
    return NextResponse.json({ ok: true, id, status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Mise à jour impossible' }, { status: 400 });
  }
}
