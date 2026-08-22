import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_EVENTS = new Set([
  'ebook_viewed', 'teaser_viewed', 'checkout_started', 'checkout_abandoned',
  'payment_pending', 'payment_failed', 'payment_confirmed', 'ebook_opened',
  'ebook_progressed', 'ebook_completed',
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ebookId = String(body?.ebookId ?? '').trim();
    const eventType = String(body?.eventType ?? '').trim();
    if (!ebookId || !ALLOWED_EVENTS.has(eventType)) return NextResponse.json({ error: 'Événement de tracking invalide' }, { status: 400 });
    const session = await getSession();
    const userId = getUserId(session) || null;
    const sessionId = String(body?.sessionId ?? '').slice(0, 128) || null;
    const source = String(body?.source ?? '').slice(0, 120) || null;
    const campaign = String(body?.campaign ?? '').slice(0, 180) || null;
    const rawMetadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {};
    const metadata = JSON.stringify(rawMetadata).slice(0, 4000);
    await db.$executeRaw(Prisma.sql`INSERT INTO "EbookTrackingEvent" ("id","ebookId","eventType","sessionId","userId","source","campaign","metadata") VALUES (${crypto.randomUUID()},${ebookId},${eventType},${sessionId},${userId},${source},${campaign},${metadata})`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[POST /api/ebooks/track]', error);
    return NextResponse.json({ error: 'Tracking indisponible' }, { status: 500 });
  }
}
