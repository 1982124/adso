-- ADSO eBook marketing media
-- Public promotional assets only. Source eBook files remain in private storage.
CREATE TABLE IF NOT EXISTS "EbookMarketingAsset" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "kind" TEXT NOT NULL DEFAULT 'video_teaser',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "pathname" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" BIGINT NOT NULL DEFAULT 0,
  "durationSeconds" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EbookMarketingAsset_ebook_fk" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "EbookMarketingAsset_ebook_idx" ON "EbookMarketingAsset"("ebookId");
CREATE INDEX IF NOT EXISTS "EbookMarketingAsset_status_idx" ON "EbookMarketingAsset"("status");
