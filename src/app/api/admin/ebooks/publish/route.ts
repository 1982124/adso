import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canManage((session?.user as Record<string, unknown> | undefined)?.role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  try {
    const { ebookId } = await request.json();
    if (!ebookId) return NextResponse.json({ error: 'ebookId requis' }, { status: 400 });
    const rows = await db.$queryRaw<Array<{ id: string; title: string; contentPath: string | null; checkoutUrl: string | null; chariowCheckoutUrl: string | null; maketouCheckoutUrl: string | null }>>(Prisma.sql`SELECT "id","title","contentPath","checkoutUrl","chariowCheckoutUrl","maketouCheckoutUrl" FROM "Ebook" WHERE "id"=${String(ebookId)} LIMIT 1`);
    const ebook = rows[0];
    if (!ebook) return NextResponse.json({ error: 'eBook introuvable' }, { status: 404 });
    if (!ebook.contentPath) return NextResponse.json({ error: 'Le fichier privé doit être envoyé avant publication.' }, { status: 409 });
    if (!ebook.checkoutUrl && !ebook.chariowCheckoutUrl && !ebook.maketouCheckoutUrl) return NextResponse.json({ error: 'Un lien de paiement doit être configuré avant publication.' }, { status: 409 });
    await db.$executeRaw(Prisma.sql`UPDATE "Ebook" SET "isPublished"=TRUE,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${ebook.id}`);
    return NextResponse.json({ ok: true, published: true, title: ebook.title });
  } catch (error) {
    console.error('[POST /api/admin/ebooks/publish]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Publication impossible' }, { status: 400 });
  }
}
