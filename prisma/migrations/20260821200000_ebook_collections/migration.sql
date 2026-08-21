-- ADSO eBook collections / book packs
-- A collection groups published eBooks without changing individual product ownership or checkout.
-- Authors/coauthors remain attached to each eBook; collection-level attribution is stored separately.

CREATE TABLE IF NOT EXISTS "EbookCollection" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "coverUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "targetAudience" TEXT,
  "language" TEXT NOT NULL DEFAULT 'fr',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EbookCollection_status_idx" ON "EbookCollection"("status");

CREATE TABLE IF NOT EXISTS "EbookCollectionItem" (
  "id" TEXT PRIMARY KEY,
  "collectionId" TEXT NOT NULL,
  "ebookId" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EbookCollectionItem_collection_fk" FOREIGN KEY ("collectionId") REFERENCES "EbookCollection"("id") ON DELETE CASCADE,
  CONSTRAINT "EbookCollectionItem_ebook_fk" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "EbookCollectionItem_collection_ebook_unique" ON "EbookCollectionItem"("collectionId","ebookId");
CREATE INDEX IF NOT EXISTS "EbookCollectionItem_collection_position_idx" ON "EbookCollectionItem"("collectionId","position");
CREATE INDEX IF NOT EXISTS "EbookCollectionItem_ebook_idx" ON "EbookCollectionItem"("ebookId");

CREATE TABLE IF NOT EXISTS "EbookCollectionContributor" (
  "id" TEXT PRIMARY KEY,
  "collectionId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "role" TEXT NOT NULL DEFAULT 'author',
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EbookCollectionContributor_collection_fk" FOREIGN KEY ("collectionId") REFERENCES "EbookCollection"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "EbookCollectionContributor_collection_idx" ON "EbookCollectionContributor"("collectionId");
