import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.$queryRaw<Array<{ url: string; alt: string | null; publishedAt: Date | null }>>(Prisma.sql`SELECT "url","alt","publishedAt" FROM "HomeMediaAsset" WHERE "status"='published' ORDER BY "publishedAt" DESC NULLS LAST LIMIT 1`);
  return NextResponse.json({ media: rows[0] ?? null }, { headers: { 'Cache-Control': 'no-store' } });
}
