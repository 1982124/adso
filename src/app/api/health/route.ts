import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      service: 'adso',
      database: 'ok',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
    });
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        service: 'adso',
        database: 'error',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
