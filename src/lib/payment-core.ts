import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getPricingForCountry, getAvailablePaymentMethods, canonicalizeProvider, type PlanId, type BillingPeriod } from '@/lib/pricing-engine';
import { getCommercialOffer } from '@/lib/commercial-offers';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

export interface CreatePaymentInput {
  userId: string;
  plan: Exclude<PlanId, 'free'>;
  countryCode: string;
  billingPeriod: BillingPeriod;
  provider: string;
  idempotencyKey: string;
}

const PROVIDERS = new Set([
  'orange_money', 'wave', 'mtn_momo', 'moov_money', 'free_money', 'mpesa',
  'airtel_money', 'express_union_mobile', 'kcb_mpesa', 'chariow', 'maketou',
  'card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'bancontact',
  'twint', 'klarna', 'bizum', 'satispay', 'sofort', 'cash_plus', 'flouci',
  'baridimob', 'cib', 'manual',
]);

function normalizeCountry(value: string): string {
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === 'ZZ') throw new Error('Invalid countryCode');
  return code;
}

function normalizeProvider(value: string): string {
  const provider = canonicalizeProvider(value);
  if (!PROVIDERS.has(provider)) throw new Error('Unsupported payment provider');
  return provider;
}

function normalizeIdempotencyKey(value: string): string {
  const key = value.trim();
  if (key.length < 16 || key.length > 200) throw new Error('Invalid idempotency key');
  return key;
}

function amountMinor(price: number, currency: string): number {
  return currency === 'XOF' || currency === 'XAF' ? Math.round(price) : Math.round(price * 100);
}

function periodEnd(start: Date, billingPeriod: BillingPeriod): Date {
  const end = new Date(start);
  if (billingPeriod === 'yearly') end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  return end;
}

export async function createPaymentOrder(input: CreatePaymentInput) {
  const countryCode = normalizeCountry(input.countryCode);
  const provider = normalizeProvider(input.provider);
  const idempotencyKey = normalizeIdempotencyKey(input.idempotencyKey);
  const offer = getCommercialOffer(input.plan);
  if (!offer || !offer.checkoutEnabled || getPricingForCountry(countryCode, input.plan, input.billingPeriod).price <= 0) {
    throw new Error('Offer is not available for checkout');
  }

  const pricing = getPricingForCountry(countryCode, input.plan, input.billingPeriod);
  const methods = getAvailablePaymentMethods(countryCode);
  if (!methods.includes(provider) && provider !== 'manual') throw new Error('Provider is not enabled for this country');

  const existing = await db.$queryRaw<{ id: string; status: PaymentStatus; amountMinor: number; currency: string; provider: string }[]>(Prisma.sql`
    SELECT "id", "status", "amountMinor", "currency", "provider" FROM "PaymentOrder"
    WHERE "idempotencyKey" = ${idempotencyKey} LIMIT 1
  `);
  if (existing[0]) return existing[0];

  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const metadata = JSON.stringify({ billingPeriod: input.billingPeriod, originalPrice: pricing.originalPrice, discount: pricing.discount });
  const amount = amountMinor(pricing.price, pricing.currency);

  await db.$executeRaw(Prisma.sql`
    INSERT INTO "PaymentOrder" ("id","userId","plan","countryCode","currency","amountMinor","provider","status","idempotencyKey","metadata","expiresAt")
    VALUES (${id},${input.userId},${input.plan},${countryCode},${pricing.currency},${amount},${provider},'PENDING',${idempotencyKey},${metadata},${expiresAt})
  `);

  return { id, status: 'PENDING' as const, amountMinor: amount, currency: pricing.currency, provider, checkoutUrl: null };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); } catch { return false; }
}

export async function processPaymentWebhook(params: {
  provider: string;
  eventId: string;
  eventType: string;
  paymentOrderId: string;
  providerReference?: string | null;
  status: Extract<PaymentStatus, 'PAID' | 'FAILED' | 'REFUNDED'>;
  rawPayload: string;
  signatureValid: boolean;
  billingPeriod?: BillingPeriod;
}) {
  if (!params.signatureValid) throw new Error('Invalid webhook signature');
  const provider = normalizeProvider(params.provider);

  return db.$transaction(async (tx) => {
    const event = await tx.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "PaymentEvent" WHERE "provider"=${provider} AND "eventId"=${params.eventId} LIMIT 1
    `);
    if (event[0]) return { duplicate: true };

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "PaymentEvent" ("id","paymentOrderId","provider","eventId","eventType","signatureValid","payload")
      VALUES (${crypto.randomUUID()},${params.paymentOrderId},${provider},${params.eventId},${params.eventType},TRUE,${params.rawPayload})
    `);

    const orders = await tx.$queryRaw<{ userId: string; plan: string; countryCode: string; currency: string; amountMinor: number; status: PaymentStatus; metadata: string | null }[]>(Prisma.sql`
      SELECT "userId","plan","countryCode","currency","amountMinor","status","metadata" FROM "PaymentOrder" WHERE "id"=${params.paymentOrderId} FOR UPDATE
    `);
    const order = orders[0];
    if (!order) throw new Error('Payment order not found');
    if (order.status === 'PAID' && params.status === 'PAID') return { duplicate: false, alreadyPaid: true };

    await tx.$executeRaw(Prisma.sql`
      UPDATE "PaymentOrder" SET "status"=${params.status}, "providerReference"=${params.providerReference ?? null}, "paidAt"=${params.status === 'PAID' ? new Date() : null}, "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${params.paymentOrderId}
    `);

    if (params.status === 'PAID') {
      const start = new Date();
      let billingPeriod: BillingPeriod = params.billingPeriod ?? 'monthly';
      if (!params.billingPeriod && order.metadata) {
        try {
          const parsed = JSON.parse(order.metadata) as { billingPeriod?: BillingPeriod };
          if (parsed.billingPeriod === 'yearly') billingPeriod = 'yearly';
        } catch { /* keep monthly fallback */ }
      }
      const end = periodEnd(start, billingPeriod);
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "Subscription" ("id","userId","plan","status","countryCode","currency","provider","currentPeriodStart","currentPeriodEnd")
        VALUES (${crypto.randomUUID()},${order.userId},${order.plan},'ACTIVE',${order.countryCode},${order.currency},${provider},${start},${end})
      `);
      await tx.$executeRaw(Prisma.sql`UPDATE "User" SET "subscription"=${order.plan}, "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${order.userId}`);
    }

    await tx.$executeRaw(Prisma.sql`UPDATE "PaymentEvent" SET "processedAt"=CURRENT_TIMESTAMP WHERE "provider"=${provider} AND "eventId"=${params.eventId}`);
    return { duplicate: false, status: params.status };
  });
}
