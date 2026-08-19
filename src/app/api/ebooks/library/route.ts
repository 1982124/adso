import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = getUserId(session as { user: Record<string, unknown> });
  if (!userId) return NextResponse.json({ error: 'Session utilisateur invalide' }, { status: 401 });

  try {
    const books = await db.$queryRaw<Array<{
      id: string; slug: string; title: string; description: string; author: string;
      coverUrl: string | null; price: number; currency: string; grantedAt: Date;
    }>>(Prisma.sql`
      SELECT e."id", e."slug", e."title", e."description", e."author",
             e."coverUrl", e."price", e."currency", ee."grantedAt"
      FROM "EbookEntitlement" ee
      INNER JOIN "Ebook" e ON e."id" = ee."ebookId"
      WHERE ee."userId" = ${userId}
      ORDER BY ee."grantedAt" DESC
    `);

    return NextResponse.json({ ebooks: books });
  } catch (error) {
    console.error('GET /api/ebooks/library failed', error);
    return NextResponse.json({ error: 'Impossible de charger votre bibliothèque' }, { status: 500 });
  }
}
