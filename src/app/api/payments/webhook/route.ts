import { NextRequest, NextResponse } from 'next/server';
import { processPaymentWebhook, verifyWebhookSignature } from '@/lib/payment-core';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const provider = request.headers.get('x-adso-provider')?.trim().toLowerCase() || '';
  const signature = request.headers.get('x-adso-signature');
  const eventId = request.headers.get('x-adso-event-id') || '';

  try {
    if (!provider || !eventId) return NextResponse.json({ error: 'Webhook headers requis' }, { status: 400 });
    const secret = process.env[`PAYMENT_WEBHOOK_SECRET_${provider.toUpperCase()}`];
    const signatureValid = verifyWebhookSignature(rawBody, signature, secret);
    if (!signatureValid) return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });

    const body = JSON.parse(rawBody) as {
      eventType?: string;
      paymentOrderId?: string;
      providerReference?: string;
      status?: 'PAID' | 'FAILED' | 'REFUNDED';
    };
    if (!body.eventType || !body.paymentOrderId || !body.status) {
      return NextResponse.json({ error: 'Payload webhook incomplet' }, { status: 400 });
    }

    const result = await processPaymentWebhook({
      provider,
      eventId,
      eventType: body.eventType,
      paymentOrderId: body.paymentOrderId,
      providerReference: body.providerReference,
      status: body.status,
      rawPayload: rawBody,
      signatureValid,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[POST /api/payments/webhook]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
