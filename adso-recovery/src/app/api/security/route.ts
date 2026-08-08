import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserId } from '@/lib/auth'

// ─── Event type to French label mapping ────────────────────
const EVENT_LABELS: Record<string, string> = {
  movement: 'Mouvement détecté',
  impact: 'Impact détecté',
  tow: 'Tentative de remorquage',
  door: 'Ouverture de porte',
  glass_break: 'Bris de vitre',
  engine_start: 'Démarrage du moteur',
  geofence_exit: 'Sortie de zone',
  geofence_enter: 'Entrée en zone',
  sos: 'Alerte SOS',
  theft_alert: 'Alerte de vol',
  recovery: 'Véhicule récupéré',
  speed_alert: 'Vitesse excessive',
  alarm: 'Alarme déclenchée',
  motion: 'Mouvement détecté',
  geofence: 'Événement géo-barrière',
  towing: 'Tentative de remorquage',
  system: 'Événement système',
  immobilize: 'Immobilisation',
}

const SEVERITY_COLORS: Record<string, string> = {
  info: 'text-emerald-400',
  warning: 'text-orange-400',
  critical: 'text-red-400',
  emergency: 'text-red-500',
}

// ─── GET: list security events ─────────────────────────────
export async function GET() {
  try {
    const { error: authError, session } = await requireAuth()
    if (authError) return authError
    const userId = getUserId(session)!

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: true, data: [], message: 'Aucun utilisateur' })
    }

    const events = await db.securityEvent.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
      take: 100,
    })

    const formatted = events.map(e => ({
      id: e.id,
      type: e.type,
      event: EVENT_LABELS[e.type] || e.type,
      time: e.timestamp.toISOString().replace('T', ' ').slice(0, 16),
      location: e.address || '—',
      status: e.resolved ? 'resolved' : 'confirmed',
      severity: e.severity,
      color: SEVERITY_COLORS[e.severity] || 'text-slate-400',
      latitude: e.latitude,
      longitude: e.longitude,
      speed: e.speed,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('[GET /api/security] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: create a security event ─────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth()
    if (authError) return authError
    const userId = getUserId(session)!

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    const body = await request.json()

    const event = await db.securityEvent.create({
      data: {
        userId: user.id,
        type: body.type || 'system',
        severity: body.severity || 'info',
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        address: body.address || null,
        speed: body.speed ?? null,
      },
    })

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Erreur création événement:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de l\'événement' }, { status: 500 })
  }
}

// ─── DELETE: delete an unresolved event ─────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 })
    }

    const event = await db.securityEvent.findUnique({ where: { id } })

    if (!event) {
      return NextResponse.json({ success: false, error: 'Événement non trouvé' }, { status: 404 })
    }

    if (event.resolved) {
      return NextResponse.json({ success: false, error: 'Impossible de supprimer un événement résolu' }, { status: 400 })
    }

    await db.securityEvent.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Événement supprimé' })
  } catch (error) {
    console.error('[DELETE /api/security] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}
