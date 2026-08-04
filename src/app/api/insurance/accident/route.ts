import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── GET: List accident incidents (latest first) ─────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const incidents = await db.accidentIncident.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error('[Accident GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Create AccidentIncident from telemetry data ────────
export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await req.json()
    const { type, severity, latitude, longitude, speed, deceleration, vehicleId } = body

    if (!type || !severity) {
      return NextResponse.json({ error: 'Type et sévérité requis' }, { status: 400 })
    }

    // Create the AccidentIncident
    const incident = await db.accidentIncident.create({
      data: {
        userId,
        vehicleId: vehicleId || null,
        type,
        severity,
        latitude: latitude !== undefined ? parseFloat(latitude) : null,
        longitude: longitude !== undefined ? parseFloat(longitude) : null,
        speed: speed !== undefined ? parseFloat(speed) : null,
        deceleration: deceleration !== undefined ? parseFloat(deceleration) : null,
      },
    })

    // Auto-create InsuranceClaim for high/critical severity
    let claimDraft: { id: string } | null = null
    if (severity === 'high' || severity === 'critical') {
      const description = `Accident ${severity} détecté par télématique le ${incident.timestamp.toISOString()}. Type: ${type}, Vitesse: ${speed ?? 'N/A'} km/h, Décélération: ${deceleration ?? 'N/A'} m/s². Incident ID: ${incident.id}.`

      const claim = await db.insuranceClaim.create({
        data: {
          userId,
          policyId: null,
          type: 'collision',
          status: 'draft',
          description,
          latitude: latitude !== undefined ? parseFloat(latitude) : null,
          longitude: longitude !== undefined ? parseFloat(longitude) : null,
          incidentDate: incident.timestamp,
        },
      })
      claimDraft = claim;

      await db.accidentIncident.update({
        where: { id: incident.id },
        data: { claimId: claim.id },
      })
    }

    // Create CollaborationEvent
    await db.collaborationEvent.create({
      data: {
        userId,
        triggerModule: 'telematics',
        eventType: 'accident',
        severity: severity === 'critical' ? 'critical' : severity === 'high' ? 'warning' : 'info',
        description: `Accident ${severity} détecté — Type: ${type}, Vitesse: ${speed ?? 'N/A'} km/h`,
        affectedModules: JSON.stringify(['insurance', 'telematics', 'safety']),
      },
    })

    return NextResponse.json({
      incident,
      brouillonReclamation: claimDraft,
      message: claimDraft
        ? 'Incident créé avec brouillon de réclamation automatique'
        : 'Incident créé avec succès',
    }, { status: 201 })
  } catch (error) {
    console.error('[Accident POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
