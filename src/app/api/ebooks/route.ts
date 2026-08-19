import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type EbookCatalogRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string | null;
  price: number;
  currency: string;
  isPublished: boolean;
  owned: boolean;
};

export async function GET() {
  try {
    // The public catalog must work for visitors. Only resolve a session when
    // one exists; never bind a NULL parameter to a typed SQL comparison.
    let userId: string | null = null;
    try {
      const session = await getSession();
      userId = getUserId(session as { user: Record<string, unknown> } | null);
    } catch {
      // A public catalog must remain available even if optional auth config is
      // temporarily unavailable. Protected purchase/download routes still
      // enforce authentication separately.
      userId = null;
    }

    let books: EbookCatalogRow[];

    if (!userId) {
      books = await db.$queryRaw<EbookCatalogRow[]>(Prisma.sql`
        SELECT e."id", e."slug", e."title", e."description", e."author",
               e."coverUrl", e."price", e."currency", e."isPublished",
               FALSE AS "owned"
        FROM "Ebook" e
        WHERE e."isPublished" = TRUE
        ORDER BY e."createdAt" DESC
      `);
    } else {
      books = await db.$queryRaw<EbookCatalogRow[]>(Prisma.sql`
        SELECT e."id", e."slug", e."title", e."description", e."author",
               e."coverUrl", e."price", e."currency", e."isPublished",
               EXISTS (
                 SELECT 1
                 FROM "EbookEntitlement" ee
                 WHERE ee."ebookId" = e."id" AND ee."userId" = ${userId}
               ) AS "owned"
        FROM "Ebook" e
        WHERE e."isPublished" = TRUE
        ORDER BY e."createdAt" DESC
      `);
    }

    return NextResponse.json({ ebooks: books, total: books.length });
  } catch (error) {
    console.error('GET /api/ebooks failed', error);
    return NextResponse.json({ error: 'Impossible de charger les eBooks' }, { status: 500 });
  }
}
