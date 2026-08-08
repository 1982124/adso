import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

// POST: Create new driving session
// GET: List all sessions with filters
export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;

    const body = await request.json();
    const {
      vehicleId,
      type = 'lesson',
      weather,
      roadType,
    } = body as {
      vehicleId?: string;
      type?: string;
      weather?: string;
      roadType?: string;
    };

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const drivingSession = await db.drivingSession.create({
      data: {
        userId: user.id,
        vehicleId: vehicleId || null,
        type,
        status: 'active',
        weather: weather || null,
        roadType: roadType || null,
      },
      include: {
        drivingEvents: true,
        vehicle: true,
      },
    });

    return NextResponse.json(drivingSession, { status: 201 });
  } catch (error) {
    console.error('[POST /api/driving] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const where: Record<string, unknown> = { userId: user.id };

    if (type) where.type = type;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.startTime = {};
      if (dateFrom) (where.startTime as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.startTime as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [sessions, total] = await Promise.all([
      db.drivingSession.findMany({
        where,
        orderBy: { startTime: 'desc' },
        take: limit,
        skip: offset,
        include: {
          drivingEvents: { orderBy: { timestamp: 'desc' }, take: 50 },
          vehicle: true,
        },
      }),
      db.drivingSession.count({ where }),
    ]);

    return NextResponse.json({ sessions, total, limit, offset });
  } catch (error) {
    console.error('[GET /api/driving] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sessions' },
      { status: 500 }
    );
  }
}
