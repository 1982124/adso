import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getPricingForCountry, getAvailablePaymentMethods, type PlanId, type BillingPeriod } from '@/lib/pricing-engine';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

export interface CreatePaymentInput {
  userId: string;
  plan: Exclude<PlanId, 'free'>;
  countryCode: string;
  billingPeriod: BillingPeriod;
  provider: string;
  idempotencyKey: string;
}

const PROVIDERS = new Set(['orange_money', 'wave', 'mtn_momo', 'moov_money', 'chariow', 'maketou', 'stripe', 'manual']);

function normalizeCountry(value: string): string {
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === 'ZZ') throw new Error('Invalid countryCode');
  return code;
}

function normalizeProvider(value: string): string {
  const provider = value.trim().toLowerCase();
  if (!PROVIDERS.has(provider)) throw new Error('Unsupported payment provider');
  return provider;
}

function normalizeIdempotencyKey(value: string): string {
  const key = value.trim();
  if (key.length < 16 || key.length > 200) throw new Error('Invalid idempotency key');
  return key;
}

async function ensurePaymentTables() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PaymentOrder" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "plan" TEXT NOT NULL,
      "countryCode" TEXT NOT NULL,
      "currency" TEXT NOT NULL,
      "amountMinor" INTEGER NOT NULL,
      "provider" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "idempotencyKey" TEXT NOT NULL UNIQUE,
      "providerReference" TEXT UNIQUE,
      "checkoutUrl" TEXT,
      "metadata" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "paidAt" TIMESTAMP,
      "expiresAt" TIMESTAMP
    )
  `);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PaymentEvent" (
      "id" TEXT PRIMARY KEY,
      "paymentOrderId" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "eventId" TEXT NOT NULL,
      "eventType" TEXT NOT NULL,
      "signatureValid" BOOLEAN NOT NULL DEFAULT FALSE,
      "payload" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "processedAt" TIMESTAMP,
      UNIQUE("provider", "eventId")
    )
  `);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Subscription" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "plan" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "countryCode" TEXT NOT NULL,
      "currency" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "providerCustomerId" TEXT,
      "providerSubscriptionId" TEXT UNIQUE,
      "currentPeriodStart" TIMESTAMP NOT NULL,
      "currentPeriodEnd" TIMESTAMP NOT NULL,
      "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
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
  await ensurePaymentTables();
  const countryCode = normalizeCountry(input.countryCode);
  const provider = normalizeProvider(input.provider);
  const idempotencyKey = normalizeIdempotencyKey(input.idempotencyKey);
  const pricing = getPricingForCountry(countryCode, input.plan);
  const yearlyDiscount = input.billingPeriod === 'yearly' ? 20 : 0;
  const price = Math.round(pricing.price * (1 - yearlyDiscount / 100) * 100) / 100;
  const methods = getAvailablePaymentMethods(countryCode);
  if (!methods.includes(provider) && provider !== 'manual') throw new Error('Provider is not enabled for this country');

  const existing = await db.$queryRaw<{ id: string; status: PaymentStatus; amountMinor: number; currency: string; provider: string }[]>(Prisma.sql`
    SELECT "id", "status", "amountMinor", "currency", "provider" FROM "PaymentOrder"
    WHERE "idempotencyKey" = ${idempotencyKey} LIMIT 1
  `);
  if (existing[0]) return existing[0];

  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const metadata = JSON.stringify({ billingPeriod: input.billingPeriod, originalPrice: pricing.originalPrice, discount: yearlyDiscount + pricing.discount });
  await db.$executeRaw(Prisma.sql`
    INSERT INTO "PaymentOrder" ("id","userId","plan","countryCode","currency","amountMinor","provider","status","idempotencyKey","metadata","expiresAt")
    VALUES (${id},${input.userId},${input.plan},${countryCode},${pricing.currency},${amountMinor(price, pricing.currency)},${provider},'PENDING',${idempotencyKey},${metadata},${expiresAt})
  `);

  return { id, status: 'PENDING' as const, amountMinor: amountMinor(price, pricing.currency), currency: pricing.currency, provider, checkoutUrl: null };
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
}) {
  await ensurePaymentTables();
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

    const orders = await tx.$queryRaw<{ userId: string; plan: string; countryCode: string; currency: string; amountMinor: number; status: PaymentStatus }[]>(Prisma.sql`
      SELECT "userId","plan","countryCode","currency","amountMinor","status" FROM "PaymentOrder" WHERE "id"=${params.paymentOrderId} FOR UPDATE
    `);
    const order = orders[0];
    if (!order) throw new Error('Payment order not found');
    if (order.status === 'PAID' && params.status === 'PAID') return { duplicate: false, alreadyPaid: true };

    await tx.$executeRaw(Prisma.sql`
      UPDATE "PaymentOrder" SET "status"=${params.status}, "providerReference"=${params.providerReference ?? null}, "paidAt"=${params.status === 'PAID' ? new Date() : null}, "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${params.paymentOrderId}
    `);

    if (params.status === 'PAID') {
      const start = new Date();
      const end = new Date(start); end.setMonth(end.getMonth() + 1);
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
