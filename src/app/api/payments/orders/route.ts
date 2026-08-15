import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getUserId } from '@/lib/auth';
import { createPaymentOrder } from '@/lib/payment-core';

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });

    const body = await request.json();
    const { plan, countryCode, billingPeriod = 'monthly', provider, idempotencyKey } = body ?? {};
    if (!plan || !countryCode || !provider || !idempotencyKey) {
      return NextResponse.json({ error: 'plan, countryCode, provider et idempotencyKey sont requis' }, { status: 400 });
    }
    if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
      return NextResponse.json({ error: 'billingPeriod invalide' }, { status: 400 });
    }

    const order = await createPaymentOrder({
      userId,
      plan,
      countryCode,
      billingPeriod,
      provider,
      idempotencyKey,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur de paiement';
    console.error('[POST /api/payments/orders]', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
