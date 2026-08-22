import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const ALLOWED_EVENTS = new Set(['ebook_viewed', 'teaser_viewed', 'checkout_started', 'checkout_abandoned', 'ebook_opened', 'ebook_progressed', 'ebook_completed']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = String(body?.eventType ?? '');
    if (!ALLOWED_EVENTS.has(eventType)) return NextResponse.json({ error: 'Événement non autorisé' }, { status: 400 });
    const ebookId = body?.ebookId ? String(body.ebookId).slice(0, 100) : null;
    const session = await getSession();
    const userId = session?.user ? String((session.user as Record<string, unknown>).id ?? '').slice(0, 100) || null : null;
    const metadata = JSON.stringify({ ebookId, source: body?.source ? String(body.source).slice(0, 100) : null, campaign: body?.campaign ? String(body.campaign).slice(0, 100) : null, teaserId: body?.teaserId ? String(body.teaserId).slice(0, 100) : null, path: body?.path ? String(body.path).slice(0, 300) : null });
    await db.$executeRaw(Prisma.sql`INSERT INTO "AnalyticsEvent" ("id","eventType","userId","metadata","createdAt") VALUES (${crypto.randomUUID()},${eventType},${userId},${metadata},CURRENT_TIMESTAMP)`);
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Tracking impossible' }, { status: 400 }); }
}
