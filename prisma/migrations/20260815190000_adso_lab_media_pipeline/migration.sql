-- ADSO LAB real media pipeline
-- Persistent media jobs/assets for course and module video delivery.
CREATE TABLE IF NOT EXISTS "LabMediaAsset" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL,
  "courseId" TEXT,
  "moduleId" TEXT,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "pathname" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" BIGINT NOT NULL DEFAULT 0,
  "durationSeconds" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "provider" TEXT NOT NULL DEFAULT 'vercel-blob',
  "copyrightConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
  "failureReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "LabMediaAsset_ownerId_idx" ON "LabMediaAsset"("ownerId");
CREATE INDEX IF NOT EXISTS "LabMediaAsset_courseId_idx" ON "LabMediaAsset"("courseId");
CREATE INDEX IF NOT EXISTS "LabMediaAsset_moduleId_idx" ON "LabMediaAsset"("moduleId");
CREATE INDEX IF NOT EXISTS "LabMediaAsset_status_idx" ON "LabMediaAsset"("status");
