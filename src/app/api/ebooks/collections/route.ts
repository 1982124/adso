import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverUrl: string | null;
  targetAudience: string | null;
  language: string;
  items?: unknown;
  contributors?: unknown;
  bookCount?: number;
};

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')?.trim() || null;
    if (slug) {
      const rows = await db.$queryRaw<CollectionRow[]>(Prisma.sql`
        SELECT c."id", c."slug", c."title", c."description", c."coverUrl", c."targetAudience", c."language",
          COALESCE(json_agg(json_build_object('id',e."id",'slug',e."slug",'title',e."title",'description',e."description",'author',e."author",'coverUrl',e."coverUrl",'price',e."price",'currency',e."currency") ORDER BY i."position") FILTER (WHERE e."id" IS NOT NULL), '[]') AS "items",
          COALESCE(json_agg(DISTINCT jsonb_build_object('name',cc."name",'email',cc."email",'role',cc."role")) FILTER (WHERE cc."id" IS NOT NULL), '[]') AS "contributors"
        FROM "EbookCollection" c
        LEFT JOIN "EbookCollectionItem" i ON i."collectionId"=c."id"
        LEFT JOIN "Ebook" e ON e."id"=i."ebookId" AND e."isPublished"=TRUE
        LEFT JOIN "EbookCollectionContributor" cc ON cc."collectionId"=c."id"
        WHERE c."slug"=${slug} AND c."status"='published'
        GROUP BY c."id"
        LIMIT 1
      `;
      if (!rows[0]) return NextResponse.json({ error: 'Collection introuvable' }, { status: 404 });
      return NextResponse.json({ collection: rows[0] });
    }

    const rows = await db.$queryRaw<CollectionRow[]>(Prisma.sql`
      SELECT c."id", c."slug", c."title", c."description", c."coverUrl", c."targetAudience", c."language",
        COUNT(i."id") FILTER (WHERE e."id" IS NOT NULL)::int AS "bookCount"
      FROM "EbookCollection" c
      LEFT JOIN "EbookCollectionItem" i ON i."collectionId"=c."id"
      LEFT JOIN "Ebook" e ON e."id"=i."ebookId" AND e."isPublished"=TRUE
      WHERE c."status"='published'
      GROUP BY c."id"
      ORDER BY c."createdAt" DESC
    `);
    return NextResponse.json({ collections: rows });
  } catch (error) {
    console.error('[GET /api/ebooks/collections]', error);
    return NextResponse.json({ error: 'Impossible de charger les collections' }, { status: 500 });
  }
}
