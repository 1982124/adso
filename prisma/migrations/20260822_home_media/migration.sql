CREATE TABLE IF NOT EXISTS "HomeMediaAsset" (
  "id" TEXT NOT NULL,
  "pathname" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "alt" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "uploadedBy" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HomeMediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "HomeMediaAsset_status_idx" ON "HomeMediaAsset"("status");
CREATE INDEX IF NOT EXISTS "HomeMediaAsset_uploadedBy_idx" ON "HomeMediaAsset"("uploadedBy");
