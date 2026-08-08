import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── GET: List claims ─────────────────────────────────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const claims = await db.insuranceClaim.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ claims })
  } catch (error) {
    console.error('[Claims GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: File new claim ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await req.json()
    const { type, description, date, location, policyId, photos } = body

    if (!description) {
      return NextResponse.json({ error: 'Description requise' }, { status: 400 })
    }

    const claim = await db.insuranceClaim.create({
      data: {
        userId,
        policyId: policyId || null,
        type: type || 'collision',
        status: 'submitted',
        description,
        location: location || null,
        incidentDate: date ? new Date(date) : new Date(),
        photos: photos ? JSON.stringify(photos) : null,
      },
    })

    return NextResponse.json({ claim }, { status: 201 })
  } catch (error) {
    console.error('[Claims POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
