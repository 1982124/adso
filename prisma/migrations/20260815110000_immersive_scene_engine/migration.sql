-- ADSO Immersive Scene Engine
-- Idempotent SQL so it can be safely applied to existing Neon databases.

CREATE TABLE IF NOT EXISTS "ImmersiveScene" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "videoUrl" TEXT NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "courseId" TEXT,
  "moduleId" TEXT,
  "competency" TEXT NOT NULL,
  "level" TEXT NOT NULL DEFAULT 'beginner',
  "language" TEXT NOT NULL DEFAULT 'fr',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ImmersiveScene_courseId_idx" ON "ImmersiveScene"("courseId");
CREATE INDEX IF NOT EXISTS "ImmersiveScene_moduleId_idx" ON "ImmersiveScene"("moduleId");
CREATE INDEX IF NOT EXISTS "ImmersiveScene_status_idx" ON "ImmersiveScene"("status");

CREATE TABLE IF NOT EXISTS "ImmersiveInteraction" (
  "id" TEXT PRIMARY KEY,
  "sceneId" TEXT NOT NULL REFERENCES "ImmersiveScene"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "atSecond" DOUBLE PRECISION NOT NULL,
  "prompt" TEXT NOT NULL,
  "explanation" TEXT,
  "ttsText" TEXT,
  "points" INTEGER NOT NULL DEFAULT 10,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ImmersiveInteraction_sceneId_idx" ON "ImmersiveInteraction"("sceneId");

CREATE TABLE IF NOT EXISTS "ImmersiveChoice" (
  "id" TEXT PRIMARY KEY,
  "interactionId" TEXT NOT NULL REFERENCES "ImmersiveInteraction"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  "scoreDelta" INTEGER NOT NULL DEFAULT 0,
  "consequence" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "competency" TEXT,
  "nextInteractionId" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "ImmersiveChoice_interactionId_idx" ON "ImmersiveChoice"("interactionId");

CREATE TABLE IF NOT EXISTS "ImmersiveAttempt" (
  "id" TEXT PRIMARY KEY,
  "sceneId" TEXT NOT NULL REFERENCES "ImmersiveScene"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "competencyGain" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "answersJson" TEXT NOT NULL DEFAULT '[]',
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ImmersiveAttempt_userId_idx" ON "ImmersiveAttempt"("userId");
CREATE INDEX IF NOT EXISTS "ImmersiveAttempt_sceneId_idx" ON "ImmersiveAttempt"("sceneId");

CREATE TABLE IF NOT EXISTS "ImmersiveCompetency" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "competency" TEXT NOT NULL,
  "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "strengths" TEXT,
  "weaknesses" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "competency")
);
CREATE INDEX IF NOT EXISTS "ImmersiveCompetency_userId_idx" ON "ImmersiveCompetency"("userId");

CREATE TABLE IF NOT EXISTS "ImmersiveVideoAsset" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" BIGINT NOT NULL DEFAULT 0,
  "durationSeconds" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ImmersiveVideoAsset_ownerId_idx" ON "ImmersiveVideoAsset"("ownerId");
