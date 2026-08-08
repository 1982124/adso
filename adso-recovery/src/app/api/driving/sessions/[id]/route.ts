import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET: Get session by ID with events
// PATCH: Update session (pause, complete, add events)
// DELETE: Cancel session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const session = await db.drivingSession.findUnique({
      where: { id },
      include: {
        drivingEvents: { orderBy: { timestamp: 'desc' } },
        vehicle: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('[GET /api/driving/sessions/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const {
      status,
      duration,
      distance,
      score,
      maxSpeed,
      avgSpeed,
      harshBrakes,
      harshAccel,
      harshTurns,
      speedViolations,
      fatigueEvents,
      distractionEvents,
      feedback,
      aiEvaluation,
    } = body as {
      status?: string;
      duration?: number;
      distance?: number;
      score?: number;
      maxSpeed?: number;
      avgSpeed?: number;
      harshBrakes?: number;
      harshAccel?: number;
      harshTurns?: number;
      speedViolations?: number;
      fatigueEvents?: number;
      distractionEvents?: number;
      feedback?: string;
      aiEvaluation?: string;
    };

    // Check if session exists
    const existing = await db.drivingSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (duration !== undefined) updateData.duration = duration;
    if (distance !== undefined) updateData.distance = distance;
    if (score !== undefined) updateData.score = score;
    if (maxSpeed !== undefined) updateData.maxSpeed = maxSpeed;
    if (avgSpeed !== undefined) updateData.avgSpeed = avgSpeed;
    if (harshBrakes !== undefined) updateData.harshBrakes = harshBrakes;
    if (harshAccel !== undefined) updateData.harshAccel = harshAccel;
    if (harshTurns !== undefined) updateData.harshTurns = harshTurns;
    if (speedViolations !== undefined) updateData.speedViolations = speedViolations;
    if (fatigueEvents !== undefined) updateData.fatigueEvents = fatigueEvents;
    if (distractionEvents !== undefined) updateData.distractionEvents = distractionEvents;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (aiEvaluation !== undefined) updateData.aiEvaluation = aiEvaluation;

    // If completing session, set endTime
    if (status === 'completed' || status === 'cancelled') {
      updateData.endTime = new Date();
    }

    const updated = await db.drivingSession.update({
      where: { id },
      data: updateData,
      include: {
        drivingEvents: { orderBy: { timestamp: 'desc' }, take: 50 },
        vehicle: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/driving/sessions/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const existing = await db.drivingSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    await db.drivingSession.delete({ where: { id } });

    return NextResponse.json({ message: 'Session supprimée avec succès' });
  } catch (error) {
    console.error('[DELETE /api/driving/sessions/:id] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la session' },
      { status: 500 }
    );
  }
}
