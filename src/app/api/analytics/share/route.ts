import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getUserId } from '@/lib/auth';

const ALLOWED_PLATFORMS = new Set([
  'whatsapp',
  'facebook',
  'messenger',
  'instagram',
  'tiktok',
  'x',
  'linkedin',
  'telegram',
  'copy_link',
  'native',
  'other',
]);

function normalizePlatform(value: unknown): string {
  const platform = typeof value === 'string' ? value.toLowerCase().trim() : 'other';
  return ALLOWED_PLATFORMS.has(platform) ? platform : 'other';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const session = await getSession();
    const userId = getUserId(session);
    const platform = normalizePlatform(body.platform);
    const contentType = typeof body.contentType === 'string' ? body.contentType.slice(0, 80) : 'unknown';
    const contentId = typeof body.contentId === 'string' ? body.contentId.slice(0, 120) : null;
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : null;
    const countryFromClient = typeof body.country === 'string' ? body.country.slice(0, 8).toUpperCase() : null;

    let country = countryFromClient;
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId }, select: { country: true } });
      country = user?.country || country;
    }

    await db.analyticsEvent.create({
      data: {
        eventType: 'share',
        userId,
        metadata: JSON.stringify({
          platform,
          country: country || 'unknown',
          contentType,
          contentId,
          path,
          source: 'adso',
        }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[POST /api/analytics/share] Error:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer le partage' }, { status: 500 });
  }
}
