import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const PROVIDERS = new Set(['chariow', 'maketou', 'orange_money', 'wave', 'mtn_momo', 'moov_money', 'card', 'paypal', 'manual']);

function amountMinor(price: number, currency: string) {
  return currency === 'XOF' || currency === 'XAF' ? Math.round(price) : Math.round(price * 100);
}

export async function POST(request: NextRequest) {
  const { error: authError, session } = await requireAuth();
  if (authError) return authError;
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });

  try {
    const body = await request.json();
    const slug = String(body?.slug ?? '').trim();
    const provider = String(body?.provider ?? '').trim().toLowerCase();
    const idempotencyKey = String(body?.idempotencyKey ?? '').trim();
    if (!slug || !provider || !idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 200) {
      return NextResponse.json({ error: 'slug, provider et idempotencyKey valides sont requis' }, { status: 400 });
    }
    if (!PROVIDERS.has(provider)) return NextResponse.json({ error: 'Moyen de paiement non pris en charge' }, { status: 400 });

    const books = await db.$queryRaw<Array<{ id: string; price: number; currency: string; checkoutUrl: string | null; isPublished: boolean }>>(Prisma.sql`
      SELECT "id","price","currency","checkoutUrl","isPublished" FROM "Ebook" WHERE "slug"=${slug} LIMIT 1
    `);
    const ebook = books[0];
    if (!ebook || !ebook.isPublished) return NextResponse.json({ error: 'eBook indisponible' }, { status: 404 });

    const owned = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT "id" FROM "EbookEntitlement" WHERE "ebookId"=${ebook.id} AND "userId"=${userId} LIMIT 1
    `);
    if (owned[0]) return NextResponse.json({ error: 'eBook déjà acquis', owned: true }, { status: 409 });

    const existing = await db.$queryRaw<Array<{ id: string; status: string; checkoutUrl: string | null }>>(Prisma.sql`
      SELECT "id","status","checkoutUrl" FROM "EbookOrder" WHERE "idempotencyKey"=${idempotencyKey} LIMIT 1
    `);
    if (existing[0]) return NextResponse.json({ order: existing[0] }, { status: 200 });

    if (!ebook.checkoutUrl) {
      return NextResponse.json({ error: 'Le lien de paiement de cet eBook n’est pas encore configuré.' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await db.$executeRaw(Prisma.sql`
      INSERT INTO "EbookOrder" ("id","ebookId","userId","currency","amountMinor","provider","status","idempotencyKey","checkoutUrl","expiresAt")
      VALUES (${id},${ebook.id},${userId},${ebook.currency},${amountMinor(ebook.price, ebook.currency)},${provider},'PENDING',${idempotencyKey},${ebook.checkoutUrl},${expiresAt})
    `);

    return NextResponse.json({
      order: {
        id,
        status: 'PENDING',
        amountMinor: amountMinor(ebook.price, ebook.currency),
        currency: ebook.currency,
        provider,
        checkoutUrl: ebook.checkoutUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/ebooks/checkout]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur de checkout eBook' }, { status: 400 });
  }
}
