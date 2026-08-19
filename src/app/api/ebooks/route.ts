import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    const userId = getUserId(session as { user: Record<string, unknown> } | null);

    const books = await db.$queryRaw<Array<{
      id: string; slug: string; title: string; description: string; author: string;
      coverUrl: string | null; price: number; currency: string; isPublished: boolean;
      owned: boolean;
    }>>(Prisma.sql`
      SELECT e."id", e."slug", e."title", e."description", e."author",
             e."coverUrl", e."price", e."currency", e."isPublished",
             CASE WHEN ${userId ?? null} IS NOT NULL AND EXISTS (
               SELECT 1 FROM "EbookEntitlement" ee
               WHERE ee."ebookId" = e."id" AND ee."userId" = ${userId ?? null}
             ) THEN TRUE ELSE FALSE END AS "owned"
      FROM "Ebook" e
      WHERE e."isPublished" = TRUE
      ORDER BY e."createdAt" DESC
    `);

    return NextResponse.json({ ebooks: books });
  } catch (error) {
    console.error('GET /api/ebooks failed', error);
    return NextResponse.json({ error: 'Impossible de charger les eBooks' }, { status: 500 });
  }
}
