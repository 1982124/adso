import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaLog = process.env.NODE_ENV === 'production'
  ? ['error']
  : ['query']

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLog,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
