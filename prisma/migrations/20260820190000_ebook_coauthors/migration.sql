-- ADSO eBook coauthors
-- A coauthor may view sales analytics for an assigned eBook but can never access, change, or withdraw payment funds.
CREATE TABLE IF NOT EXISTS "EbookCoauthor" (
  "id" TEXT PRIMARY KEY,
  "ebookId" TEXT NOT NULL,
  "userId" TEXT,
  "email" TEXT,
  "displayName" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'coauthor',
  "canViewSales" BOOLEAN NOT NULL DEFAULT TRUE,
  "canViewOrders" BOOLEAN NOT NULL DEFAULT TRUE,
  "canViewCustomerData" BOOLEAN NOT NULL DEFAULT FALSE,
  "canManageProduct" BOOLEAN NOT NULL DEFAULT FALSE,
  "canAccessFunds" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EbookCoauthor_ebook_fk" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE,
  CONSTRAINT "EbookCoauthor_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL,
  CONSTRAINT "EbookCoauthor_email_check" CHECK ("email" IS NULL OR length(trim("email")) > 3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EbookCoauthor_ebook_user_unique" ON "EbookCoauthor"("ebookId","userId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "EbookCoauthor_ebook_email_unique" ON "EbookCoauthor"("ebookId","email") WHERE "email" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "EbookCoauthor_user_idx" ON "EbookCoauthor"("userId");
CREATE INDEX IF NOT EXISTS "EbookCoauthor_email_idx" ON "EbookCoauthor"("email");

-- Sales-only access is intentionally immutable at the database level for the financial permission.
CREATE OR REPLACE FUNCTION "prevent_ebook_coauthor_fund_access"() RETURNS trigger AS $$
BEGIN
  NEW."canAccessFunds" := FALSE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS "EbookCoauthor_no_funds" ON "EbookCoauthor";
CREATE TRIGGER "EbookCoauthor_no_funds" BEFORE INSERT OR UPDATE ON "EbookCoauthor" FOR EACH ROW EXECUTE FUNCTION "prevent_ebook_coauthor_fund_access"();
