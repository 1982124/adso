import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: Create new driving session
// GET: List all sessions with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      vehicleId,
      type = 'lesson',
      weather,
      roadType,
    } = body as {
      userId?: string;
      vehicleId?: string;
      type?: string;
      weather?: string;
      roadType?: string;
    };

    // Find user
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { email: userId } });
      if (!user) user = await db.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      // Fallback: use first user for dev
      user = await db.user.findFirst();
    }
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const session = await db.drivingSession.create({
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

    return NextResponse.json(session, { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Find user
    let user;
    if (userId) {
      user = await db.user.findUnique({ where: { email: userId } });
      if (!user) user = await db.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await db.user.findFirst();
    }
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
