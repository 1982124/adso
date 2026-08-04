import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── Helper: get demo user ───────────────────────────────
async function getDemoUser() {
  return db.user.findFirst({ orderBy: { createdAt: 'asc' } })
}

// ─── GET: list bookings ──────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')

    const where: Record<string, unknown> = {}

    if (listingId) {
      where.listingId = listingId
    } else {
      // Default to demo user
      const user = await getDemoUser()
      if (user) where.userId = user.id
    }

    const bookings = await db.bookingRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: { select: { id: true, title: true, category: true, location: true } },
      },
      take: 50,
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error('[GET /api/marketplace/bookings] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: create a booking ─────────────────────────────
export async function POST(request: NextRequest) {
  const user = await getDemoUser()
  if (!user) {
    return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  try {
    const body = await request.json()

    if (!body.listingId || !body.serviceDate) {
      return NextResponse.json({ success: false, error: 'listingId et serviceDate requis' }, { status: 400 })
    }

    const booking = await db.bookingRecord.create({
      data: {
        userId: user.id,
        listingId: body.listingId,
        serviceDate: new Date(body.serviceDate),
        serviceTime: body.serviceTime || null,
        duration: body.duration ?? null,
        totalAmount: body.totalAmount ?? null,
        notes: body.notes || null,
      },
    })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error('Erreur création réservation:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de la réservation' }, { status: 500 })
  }
}
