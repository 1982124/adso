-- ADSO production hardening: move credential storage out of runtime schema mutation.
CREATE TABLE IF NOT EXISTS "UserCredential" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserCredential_userId_key" UNIQUE ("userId"),
  CONSTRAINT "UserCredential_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
