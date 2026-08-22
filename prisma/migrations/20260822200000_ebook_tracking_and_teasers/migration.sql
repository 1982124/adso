-- ADSO eBook tracking + promotional media
-- Tracking stores product-funnel events without collecting payment secrets.

CREATE TABLE IF NOT EXISTS "EbookTrackingEvent" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "sessionId" TEXT,
  "userId" TEXT,
  "source" TEXT,
  "campaign" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EbookTrackingEvent_ebook_idx" ON "EbookTrackingEvent"("ebookId");
CREATE INDEX IF NOT EXISTS "EbookTrackingEvent_type_idx" ON "EbookTrackingEvent"("eventType");
CREATE INDEX IF NOT EXISTS "EbookTrackingEvent_created_idx" ON "EbookTrackingEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "EbookTrackingEvent_source_idx" ON "EbookTrackingEvent"("source");

CREATE TABLE IF NOT EXISTS "EbookPromoAsset" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "kind" TEXT NOT NULL DEFAULT 'image',
  "title" TEXT,
  "url" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "contentType" TEXT,
  "sizeBytes" BIGINT NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EbookPromoAsset_ebook_idx" ON "EbookPromoAsset"("ebookId");
CREATE INDEX IF NOT EXISTS "EbookPromoAsset_status_idx" ON "EbookPromoAsset"("status");
