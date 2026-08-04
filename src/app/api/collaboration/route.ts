import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Récupérer les événements de collaboration inter-modules
export async function GET(request: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const unresolvedOnly = searchParams.get('unresolved') === 'true';

    const where = {
      userId: user.id,
      ...(unresolvedOnly ? { resolved: false } : {}),
    };

    const events = await db.collaborationEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      événements: events,
      total: events.length,
    });
  } catch (error) {
    console.error('[GET /api/collaboration] Erreur :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST — Créer un événement de collaboration (bus central)
export async function POST(request: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const body = await request.json();
    const { triggerModule, eventType, severity, description, affectedModules } = body;

    if (!triggerModule || !eventType || !description) {
      return NextResponse.json(
        { error: 'triggerModule, eventType et description sont requis' },
        { status: 400 },
      );
    }

    const event = await db.collaborationEvent.create({
      data: {
        userId: user.id,
        triggerModule,
        eventType,
        severity: severity || 'info',
        description,
        affectedModules: typeof affectedModules === 'string' ? affectedModules : JSON.stringify(affectedModules || []),
      },
    });

    return NextResponse.json({
      message: 'Événement de collaboration créé',
      événement: event,
    });
  } catch (error) {
    console.error('[POST /api/collaboration] Erreur :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH — Résoudre un événement de collaboration
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, actions } = body;

    if (!id) {
      return NextResponse.json({ error: 'Identifiant requis' }, { status: 400 });
    }

    const event = await db.collaborationEvent.update({
      where: { id },
      data: {
        resolved: true,
        actions: actions ? (typeof actions === 'string' ? actions : JSON.stringify(actions)) : undefined,
      },
    });

    return NextResponse.json({
      message: 'Événement de collaboration résolu',
      événement: event,
    });
  } catch (error) {
    console.error('[PATCH /api/collaboration] Erreur :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
