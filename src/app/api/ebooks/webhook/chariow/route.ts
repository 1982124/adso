import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function verifyChariowSignature(rawBody: string, header: string | null, secret: string | undefined) {
  if (!header || !secret) return false;
  const signature = header.startsWith('sha256=') ? header.slice(7) : header;
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function slugFromUrl(value: unknown) {
  if (typeof value !== 'string') return '';
  const clean = value.split('?')[0].replace(/\/+$/, '');
  return clean.split('/').pop() || '';
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-chariow-signature');
  const deliveryId = request.headers.get('x-pulse-delivery-id') || crypto.createHash('sha256').update(rawBody).digest('hex');
  const secret = process.env.CHARIOW_WEBHOOK_SECRET;

  if (!verifyChariowSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Signature Chariow invalide' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event?: string;
      sale?: { id?: string; custom_metadata?: Record<string, unknown> | null };
      product?: { url?: string };
      customer?: { email?: string };
    };
    const event = String(payload.event ?? '');
    if (!['successful.sale', 'failed.sale', 'abandoned.sale'].includes(event)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const provider = 'chariow';
    const orderRef = String(payload.sale?.custom_metadata?.order_ref ?? '').trim();
    const customerEmail = String(payload.customer?.email ?? '').trim().toLowerCase();
    const productSlug = slugFromUrl(payload.product?.url);
    const saleId = String(payload.sale?.id ?? '').trim();
    if (!saleId) return NextResponse.json({ error: 'Vente Chariow sans identifiant' }, { status: 400 });

    const result = await db.$transaction(async (tx) => {
      const duplicate = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
        SELECT "id" FROM "EbookPaymentEvent" WHERE "provider"=${provider} AND "eventId"=${deliveryId} LIMIT 1
      `);
      if (duplicate[0]) return { duplicate: true };

      let orderId = orderRef;
      if (!orderId && customerEmail) {
        const candidates = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
          SELECT o."id"
          FROM "EbookOrder" o
          JOIN "User" u ON u."id"=o."userId"
          JOIN "Ebook" e ON e."id"=o."ebookId"
          WHERE lower(u."email")=${customerEmail}
            AND o."provider"=${provider}
            AND o."status" IN ('PENDING','PROCESSING')
            AND (${productSlug}='' OR e."slug"=${productSlug})
          ORDER BY o."createdAt" DESC
          LIMIT 1
        `);
        orderId = candidates[0]?.id ?? '';
      }
      if (!orderId) throw new Error('Aucune commande ADSO correspondante à la vente Chariow');

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "EbookPaymentEvent" ("id","orderId","provider","eventId","eventType","signatureValid","payload")
        VALUES (${crypto.randomUUID()},${orderId},${provider},${deliveryId},${event},TRUE,${rawBody})
      `);

      const orders = await tx.$queryRaw<Array<{ id: string; ebookId: string; userId: string }>>(Prisma.sql`
        SELECT "id","ebookId","userId" FROM "EbookOrder" WHERE "id"=${orderId} FOR UPDATE
      `);
      const order = orders[0];
      if (!order) throw new Error('Commande eBook introuvable');

      if (event === 'successful.sale') {
        await tx.$executeRaw(Prisma.sql`
          UPDATE "EbookOrder" SET "status"='PAID',"providerReference"=${saleId},"paidAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${order.id}
        `);
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO "EbookEntitlement" ("id","ebookId","userId","source","orderId")
          VALUES (${crypto.randomUUID()},${order.ebookId},${order.userId},'purchase',${order.id})
          ON CONFLICT ("ebookId","userId") DO NOTHING
        `);
      } else {
        await tx.$executeRaw(Prisma.sql`
          UPDATE "EbookOrder" SET "status"='FAILED',"providerReference"=${saleId},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${order.id}
        `);
      }

      await tx.$executeRaw(Prisma.sql`
        UPDATE "EbookPaymentEvent" SET "processedAt"=CURRENT_TIMESTAMP WHERE "provider"=${provider} AND "eventId"=${deliveryId}
      `);
      return { duplicate: false, status: event === 'successful.sale' ? 'PAID' : 'FAILED' };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/ebooks/webhook/chariow]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook Chariow impossible' }, { status: 500 });
  }
}
