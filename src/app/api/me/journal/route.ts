import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

const MAX_TITLE = 120;
const MAX_BODY = 4000;
const MAX_MOOD = 40;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  const entries = await db.analyticsEvent.findMany({
    where: { userId, eventType: 'journal_entry' },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, metadata: true, createdAt: true },
  });

  return NextResponse.json({ entries: entries.map((entry) => {
    try {
      const data = JSON.parse(entry.metadata) as Record<string, unknown>;
      return { id: entry.id, title: data.title ?? 'Note', body: data.body ?? '', mood: data.mood ?? null, createdAt: entry.createdAt };
    } catch {
      return { id: entry.id, title: 'Note', body: entry.metadata, mood: null, createdAt: entry.createdAt };
    }
  }) });
}

export async function POST(request: Request) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = clean(body.title, MAX_TITLE);
    const text = clean(body.body, MAX_BODY);
    const mood = clean(body.mood, MAX_MOOD);

    if (!text) return NextResponse.json({ error: 'Le contenu du journal est requis' }, { status: 400 });

    const entry = await db.analyticsEvent.create({
      data: {
        eventType: 'journal_entry',
        userId,
        metadata: JSON.stringify({ title: title || 'Note personnelle', body: text, mood: mood || null, source: 'user-journal' }),
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/me/journal] Error:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer la note' }, { status: 500 });
  }
}
