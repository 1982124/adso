import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── GET: List policies ───────────────────────────────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const policies = await db.insurancePolicy.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ policies })
  } catch (error) {
    console.error('[Policies GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Create policy ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await req.json()
    const { provider, type, vehicleType, premium, deductible, startDate, endDate, paydEnabled, phydEnabled } = body

    if (!type || !vehicleType) {
      return NextResponse.json({ error: 'Type et véhicule requis' }, { status: 400 })
    }

    const policyNumber = `ADS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`

    const policy = await db.insurancePolicy.create({
      data: {
        userId,
        provider: provider || 'ADSO Assurances',
        policyNumber,
        type: type || 'third_party',
        vehicleType: vehicleType || 'car',
        premium: premium ? parseFloat(premium) : null,
        deductible: deductible ? parseFloat(deductible) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: 'pending',
        paydEnabled: paydEnabled || false,
        phydEnabled: phydEnabled || false,
      },
    })

    return NextResponse.json({ policy }, { status: 201 })
  } catch (error) {
    console.error('[Policies POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
