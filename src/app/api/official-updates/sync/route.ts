import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

interface OfficialFeed { name: string; url: string; country?: string; }

function configuredFeeds(): OfficialFeed[] {
  try {
    const feeds = JSON.parse(process.env.ADSO_OFFICIAL_FEEDS_JSON ?? '[]') as OfficialFeed[];
    return feeds.filter((f) => f && typeof f.name === 'string' && typeof f.url === 'string');
  } catch { return []; }
}

function parseFeed(text: string) {
  const trimmed = text.trim();
  try {
    const json = JSON.parse(trimmed) as Record<string, unknown>;
    return { format: 'json', summary: JSON.stringify(json).slice(0, 12000) };
  } catch {
    const items = [...trimmed.matchAll(/<(?:item|entry)[^>]*>[\s\S]*?<\/(?:item|entry)>/gi)].slice(0, 25);
    const summaries = items.map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join('\n');
    return { format: 'xml', summary: (summaries || trimmed).slice(0, 12000) };
  }
}

export async function GET(request: NextRequest) {
  const expected = process.env.ADSO_CRON_SECRET ?? process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');
  if (!expected || auth !== `Bearer ${expected}`) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const feeds = configuredFeeds();
  const results: Array<Record<string, unknown>> = [];
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, { headers: { 'User-Agent': 'ADSO-Official-Updates/1.0' }, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const parsed = parseFeed(text);
      const hash = crypto.createHash('sha256').update(text).digest('hex');
      const previous = await db.analyticsEvent.findFirst({
        where: { eventType: 'official_feed_snapshot', metadata: { contains: `\"feedName\":\"${feed.name.replace(/\"/g, '')}\"` } },
        orderBy: { createdAt: 'desc' },
      });
      const previousMeta = previous ? (() => { try { return JSON.parse(previous.metadata) as Record<string, unknown>; } catch { return {}; } })() : {};
      const changed = previousMeta.hash !== hash;

      if (changed) {
        await db.analyticsEvent.create({
          data: { eventType: 'official_road_update', metadata: JSON.stringify({ feedName: feed.name, source: feed.url, country: feed.country ?? null, title: `Mise à jour officielle — ${feed.name}`, summary: parsed.summary, format: parsed.format, hash, publishedAt: new Date().toISOString() }) },
        });
      }
      await db.analyticsEvent.create({
        data: { eventType: 'official_feed_snapshot', metadata: JSON.stringify({ feedName: feed.name, source: feed.url, country: feed.country ?? null, hash, changed }) },
      });
      results.push({ feed: feed.name, ok: true, changed, hash });
    } catch (error) {
      results.push({ feed: feed.name, ok: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }
  return NextResponse.json({ syncedAt: new Date().toISOString(), feeds: results, configured: feeds.length });
}
