import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/payment-core';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const provider = request.headers.get('x-adso-provider')?.trim().toLowerCase() || '';
  const signature = request.headers.get('x-adso-signature');
  const eventId = request.headers.get('x-adso-event-id') || '';
  const secret = provider ? process.env[`PAYMENT_WEBHOOK_SECRET_${provider.toUpperCase()}`] : undefined;

  try {
    if (!provider || !eventId) return NextResponse.json({ error: 'Webhook headers requis' }, { status: 400 });
    const signatureValid = verifyWebhookSignature(rawBody, signature, secret);
    if (!signatureValid) return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });

    const body = JSON.parse(rawBody) as {
      eventType?: string;
      orderId?: string;
      providerReference?: string;
      status?: 'PAID' | 'FAILED' | 'REFUNDED';
    };
    if (!body.eventType || !body.orderId || !body.status) return NextResponse.json({ error: 'Payload webhook incomplet' }, { status: 400 });

    const result = await db.$transaction(async (tx) => {
      const duplicate = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
        SELECT "id" FROM "EbookPaymentEvent" WHERE "provider"=${provider} AND "eventId"=${eventId} LIMIT 1
      `);
      if (duplicate[0]) return { duplicate: true };

      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "EbookPaymentEvent" ("id","orderId","provider","eventId","eventType","signatureValid","payload")
        VALUES (${crypto.randomUUID()},${body.orderId},${provider},${eventId},${body.eventType},TRUE,${rawBody})
      `);

      const orders = await tx.$queryRaw<Array<{ id: string; ebookId: string; userId: string; status: string }>>(Prisma.sql`
        SELECT "id","ebookId","userId","status" FROM "EbookOrder" WHERE "id"=${body.orderId} FOR UPDATE
      `);
      const order = orders[0];
      if (!order) throw new Error('Commande eBook introuvable');

      if (body.status === 'PAID') {
        await tx.$executeRaw(Prisma.sql`
          UPDATE "EbookOrder" SET "status"='PAID',"providerReference"=${body.providerReference ?? null},"paidAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${body.orderId}
        `);
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO "EbookEntitlement" ("id","ebookId","userId","source","orderId")
          VALUES (${crypto.randomUUID()},${order.ebookId},${order.userId},'purchase',${order.id})
          ON CONFLICT ("ebookId","userId") DO NOTHING
        `);
      } else {
        await tx.$executeRaw(Prisma.sql`
          UPDATE "EbookOrder" SET "status"=${body.status},"providerReference"=${body.providerReference ?? null},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${body.orderId}
        `);
      }

      await tx.$executeRaw(Prisma.sql`
        UPDATE "EbookPaymentEvent" SET "processedAt"=CURRENT_TIMESTAMP WHERE "provider"=${provider} AND "eventId"=${eventId}
      `);
      return { duplicate: false, status: body.status };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/ebooks/webhook]', error);
    return NextResponse.json({ error: 'Webhook eBook processing failed' }, { status: 500 });
  }
}
