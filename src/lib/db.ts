import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Do not log SQL/query payloads: they may contain user data and add
    // unnecessary overhead in production.
    log: ['warn', 'error'],
  })

// Reuse the client during warm runtime reuse to reduce connection churn.
globalForPrisma.prisma = db
