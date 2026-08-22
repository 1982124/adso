import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const isAdmin = (role: unknown) => ['admin', 'super_admin'].includes(String(role ?? ''));

export async function POST() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  if (!isAdmin((session.user as Record<string, unknown>).role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  try {
    await db.$transaction(async (tx) => {
      const previous = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "HomeMediaAsset" WHERE "status"='archived' ORDER BY "publishedAt" DESC NULLS LAST, "updatedAt" DESC LIMIT 1`);
      if (!previous[0]) throw new Error('Aucune ancienne image disponible');
      await tx.$executeRaw(Prisma.sql`UPDATE "HomeMediaAsset" SET "status"='archived', "updatedAt"=CURRENT_TIMESTAMP WHERE "status"='published'`);
      await tx.$executeRaw(Prisma.sql`UPDATE "HomeMediaAsset" SET "status"='published', "publishedAt"=CURRENT_TIMESTAMP, "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${previous[0].id}`);
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Restauration impossible' }, { status: 400 });
  }
}
