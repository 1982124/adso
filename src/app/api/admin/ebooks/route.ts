import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canManage((session?.user as Record<string, unknown> | undefined)?.role)) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });

  try {
    const body = await request.json();
    const slug = String(body?.slug ?? '').trim().toLowerCase();
    const title = String(body?.title ?? '').trim();
    const description = String(body?.description ?? '').trim();
    const author = String(body?.author ?? '').trim();
    const price = Number(body?.price);
    const currency = String(body?.currency ?? 'XOF').trim().toUpperCase();
    const checkoutUrl = body?.checkoutUrl ? String(body.checkoutUrl).trim() : null;
    const chariowCheckoutUrl = body?.chariowCheckoutUrl ? String(body.chariowCheckoutUrl).trim() : null;
    const maketouCheckoutUrl = body?.maketouCheckoutUrl ? String(body.maketouCheckoutUrl).trim() : null;
    const coverUrl = body?.coverUrl ? String(body.coverUrl).trim() : null;
    const isPublished = Boolean(body?.isPublished ?? false);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return NextResponse.json({ error: 'slug invalide' }, { status: 400 });
    if (!title || !description || !author || !Number.isFinite(price) || price < 0) return NextResponse.json({ error: 'Métadonnées eBook invalides' }, { status: 400 });
    if (!/^[A-Z]{3}$/.test(currency)) return NextResponse.json({ error: 'Devise invalide' }, { status: 400 });

    const id = crypto.randomUUID();
    const storageKey = `ebooks/${id}`;
    await db.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "Ebook" ("id","slug","title","description","author","coverUrl","storageKey","price","currency","checkoutUrl","chariowCheckoutUrl","maketouCheckoutUrl","isPublished")
        VALUES (${id},${slug},${title},${description},${author},${coverUrl},${storageKey},${price},${currency},${checkoutUrl},${chariowCheckoutUrl},${maketouCheckoutUrl},${isPublished})
      `);
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "EbookProduct" ("id","ebookId","kind","price","currency","isPublished")
        VALUES (${crypto.randomUUID()},${id},'ebook',${price},${currency},${isPublished})
        ON CONFLICT ("ebookId","kind") DO UPDATE SET "price"=EXCLUDED."price","currency"=EXCLUDED."currency","isPublished"=EXCLUDED."isPublished","updatedAt"=CURRENT_TIMESTAMP
      `);
    });

    return NextResponse.json({ id, slug, createdBy: getUserId(session) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/ebooks]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Création eBook impossible' }, { status: 400 });
  }
}
