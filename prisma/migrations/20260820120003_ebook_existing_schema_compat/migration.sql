-- Existing ADSO deployments already contain Ebook/EbookOrder tables.
-- This migration extends them without replacing existing data.
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "contentPath" TEXT;
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "contentUrl" TEXT;
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "contentType" TEXT DEFAULT 'application/pdf';
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "contentDisposition" TEXT;
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "checkoutUrl" TEXT;
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "chariowCheckoutUrl" TEXT;
ALTER TABLE "Ebook" ADD COLUMN IF NOT EXISTS "maketouCheckoutUrl" TEXT;

ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "amountMinor" INTEGER;
ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;
ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "checkoutUrl" TEXT;
ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "metadata" TEXT;
ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);
ALTER TABLE "EbookOrder" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "EbookOrder_idempotencyKey_unique" ON "EbookOrder"("idempotencyKey") WHERE "idempotencyKey" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "EbookPaymentEvent" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "signatureValid" BOOLEAN NOT NULL DEFAULT FALSE,
  "payload" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EbookPaymentEvent_provider_event_unique" ON "EbookPaymentEvent"("provider","eventId");

CREATE TABLE IF NOT EXISTS "EbookAsset" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL UNIQUE,
  "pathname" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "contentType" TEXT NOT NULL DEFAULT 'application/pdf',
  "sizeBytes" BIGINT NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ready',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
