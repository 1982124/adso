import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 });

  try {
    let userId: string | null = null;
    try { userId = getUserId(await getSession()); } catch { userId = null; }

    const rows = await db.$queryRaw<Array<{
      id: string; slug: string; title: string; description: string; author: string;
      coverUrl: string | null; price: number; currency: string; isPublished: boolean;
      owned: boolean; hasFile: boolean;
    }>>(userId ? Prisma.sql`
      SELECT e."id", e."slug", e."title", e."description", e."author", e."coverUrl",
             e."price", e."currency", e."isPublished",
             EXISTS (SELECT 1 FROM "EbookEntitlement" ee WHERE ee."ebookId"=e."id" AND ee."userId"=${userId}) AS "owned",
             (e."contentPath" IS NOT NULL) AS "hasFile"
      FROM "Ebook" e WHERE e."slug"=${slug} AND e."isPublished"=TRUE LIMIT 1
    ` : Prisma.sql`
      SELECT e."id", e."slug", e."title", e."description", e."author", e."coverUrl",
             e."price", e."currency", e."isPublished", FALSE AS "owned",
             (e."contentPath" IS NOT NULL) AS "hasFile"
      FROM "Ebook" e WHERE e."slug"=${slug} AND e."isPublished"=TRUE LIMIT 1
    `);

    if (!rows[0]) return NextResponse.json({ error: 'eBook introuvable' }, { status: 404 });
    return NextResponse.json({ ebook: rows[0] });
  } catch (error) {
    console.error('GET /api/ebooks/[slug] failed', error);
    return NextResponse.json({ error: 'Impossible de charger cet eBook' }, { status: 500 });
  }
}
