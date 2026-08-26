import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function meta(value: string) { try { return JSON.parse(value) as Record<string, unknown>; } catch { return {}; } }

export async function GET() {
  const latest = await db.analyticsEvent.findFirst({ where: { eventType: 'institutional_intelligence_edition' }, orderBy: { createdAt: 'desc' } });
  if (!latest) return NextResponse.json({ content: null });
  const m = meta(latest.metadata);
  return NextResponse.json({ generatedAt: m.generatedAt ?? latest.createdAt.toISOString(), evidenceCount: m.evidenceCount ?? 0, content: m.content ?? null });
}
