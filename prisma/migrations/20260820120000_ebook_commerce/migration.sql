-- ADSO eBook commerce
-- Files are stored outside GitHub in a private Vercel Blob store.

CREATE TABLE IF NOT EXISTS "Ebook" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "coverUrl" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'XOF',
  "isPublished" BOOLEAN NOT NULL DEFAULT FALSE,
  "contentPath" TEXT,
  "contentUrl" TEXT,
  "contentType" TEXT DEFAULT 'application/pdf',
  "contentDisposition" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Ebook_published_idx" ON "Ebook"("isPublished");

CREATE TABLE IF NOT EXISTS "EbookEntitlement" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'purchase',
  "orderId" TEXT,
  "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3)
);

CREATE UNIQUE INDEX IF NOT EXISTS "EbookEntitlement_ebook_user_unique" ON "EbookEntitlement"("ebookId", "userId");
CREATE INDEX IF NOT EXISTS "EbookEntitlement_user_idx" ON "EbookEntitlement"("userId");
CREATE INDEX IF NOT EXISTS "EbookEntitlement_ebook_idx" ON "EbookEntitlement"("ebookId");

CREATE TABLE IF NOT EXISTS "EbookOrder" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "amountMinor" INTEGER NOT NULL,
  "provider" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "idempotencyKey" TEXT NOT NULL UNIQUE,
  "providerReference" TEXT UNIQUE,
  "checkoutUrl" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS "EbookOrder_user_idx" ON "EbookOrder"("userId");
CREATE INDEX IF NOT EXISTS "EbookOrder_ebook_idx" ON "EbookOrder"("ebookId");
CREATE INDEX IF NOT EXISTS "EbookOrder_status_idx" ON "EbookOrder"("status");

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

CREATE UNIQUE INDEX IF NOT EXISTS "EbookPaymentEvent_provider_event_unique" ON "EbookPaymentEvent"("provider", "eventId");

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

CREATE INDEX IF NOT EXISTS "EbookAsset_status_idx" ON "EbookAsset"("status");
