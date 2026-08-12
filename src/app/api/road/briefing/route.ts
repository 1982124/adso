import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

function parseMetadata(value: string) {
  try { return JSON.parse(value) as Record<string, unknown>; } catch { return {}; }
}

type RoadEvent = {
  id: string;
  eventType?: string;
  createdAt: Date;
  metadata: string;
};

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAuth();
    if (authError) return authError;
    const url = new URL(request.url);
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    const country = url.searchParams.get('country') ?? 'FR';
    const destination = url.searchParams.get('destination') ?? null;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: 'Latitude et longitude requises' }, { status: 400 });
    }

    const events = await db.analyticsEvent.findMany({
      where: { eventType: { in: ['road_hazard', 'official_road_update', 'official_regulation_update'] } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const radiusKm = Number(url.searchParams.get('radiusKm') ?? 25);
    const items = (events as unknown as RoadEvent[]).map((event) => ({ event, metadata: parseMetadata(event.metadata) }))
      .filter(({ event, metadata }) => {
        if (metadata.country && metadata.country !== country) return false;
        if (typeof metadata.latitude !== 'number' || typeof metadata.longitude !== 'number') return event.eventType !== 'road_hazard';
        const dLat = (metadata.latitude - lat) * 111;
        const dLon = (metadata.longitude - lon) * 111 * Math.cos(lat * Math.PI / 180);
        return Math.sqrt(dLat * dLat + dLon * dLon) <= radiusKm;
      })
      .slice(0, 50)
      .map(({ event, metadata }) => ({
        id: event.id,
        type: event.eventType ?? 'road_hazard',
        title: metadata.title ?? 'Information routière',
        description: metadata.description ?? metadata.summary ?? '',
        severity: metadata.severity ?? 'info',
        source: metadata.source ?? 'ADSO',
        latitude: metadata.latitude ?? null,
        longitude: metadata.longitude ?? null,
        publishedAt: metadata.publishedAt ?? event.createdAt.toISOString(),
      }));

    return NextResponse.json({
      country,
      origin: { latitude: lat, longitude: lon },
      destination,
      generatedAt: new Date().toISOString(),
      warnings: items,
      guidance: items.length
        ? 'Consultez les alertes avant de partir et adaptez votre conduite aux conditions réelles.'
        : 'Aucune alerte ADSO connue dans le périmètre demandé. Restez attentif aux conditions locales.',
      privacy: 'La localisation n’est utilisée pour ce briefing que lorsque l’utilisateur active volontairement la fonction.',
    });
  } catch (error) {
    console.error('[GET /api/road/briefing] Error:', error);
    return NextResponse.json({ error: 'Impossible de générer le briefing routier' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const body = await request.json();
    const { type, title, description, severity, latitude, longitude, country } = body as Record<string, unknown>;
    if (type !== 'road_hazard' || typeof title !== 'string' || typeof description !== 'string') {
      return NextResponse.json({ error: 'Signalement routier invalide' }, { status: 400 });
    }
    await db.analyticsEvent.create({
      data: {
        eventType: 'road_hazard',
        userId: session!.user.id,
        metadata: JSON.stringify({ title, description, severity: severity ?? 'warning', latitude, longitude, country: country ?? 'FR', source: 'user_report' }),
      },
    });
    return NextResponse.json({ ok: true, message: 'Signalement enregistré pour vérification.' }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/road/briefing] Error:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer le signalement' }, { status: 500 });
  }
}
