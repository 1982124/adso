import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { get } from '@vercel/blob';
import { requireAuth, getUserId } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });

  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 });

  try {
    const rows = await db.$queryRaw<Array<{ contentPath: string | null; contentType: string | null; contentDisposition: string | null }>>(Prisma.sql`
      SELECT e."contentPath", e."contentType", e."contentDisposition"
      FROM "Ebook" e
      INNER JOIN "EbookEntitlement" ee ON ee."ebookId"=e."id" AND ee."userId"=${userId}
      WHERE e."slug"=${slug} AND e."isPublished"=TRUE LIMIT 1
    `);
    const ebook = rows[0];
    if (!ebook) return NextResponse.json({ error: 'Accès à cet eBook non autorisé' }, { status: 403 });
    if (!ebook.contentPath) return NextResponse.json({ error: 'Fichier eBook non disponible' }, { status: 404 });

    const result = await get(ebook.contentPath, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return NextResponse.json({ error: 'Fichier eBook introuvable' }, { status: 404 });

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        'Content-Type': ebook.contentType || result.blob.contentType || 'application/pdf',
        'Content-Disposition': ebook.contentDisposition || result.blob.contentDisposition || 'inline',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('GET /api/ebooks/[slug]/download failed', error);
    return NextResponse.json({ error: 'Impossible de délivrer cet eBook' }, { status: 500 });
  }
}
