import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

// ─── GET: Get single policy ──────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireRole('insurer');
    if (error) return error;

    const { id } = await params
    const policy = await db.insurancePolicy.findUnique({ where: { id } })

    if (!policy) {
      return NextResponse.json({ error: 'Police non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ policy })
  } catch (error) {
    console.error('[Policy GET by ID]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── PATCH: Update policy ────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireRole('insurer');
    if (error) return error;

    const { id } = await params
    const body = await req.json()

    const existing = await db.insurancePolicy.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Police non trouvée' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (body.status) updateData.status = body.status
    if (body.provider) updateData.provider = body.provider
    if (body.type) updateData.type = body.type
    if (body.vehicleType) updateData.vehicleType = body.vehicleType
    if (body.premium !== undefined) updateData.premium = parseFloat(body.premium)
    if (body.deductible !== undefined) updateData.deductible = parseFloat(body.deductible)
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.paydEnabled !== undefined) updateData.paydEnabled = body.paydEnabled
    if (body.phydEnabled !== undefined) updateData.phydEnabled = body.phydEnabled

    const policy = await db.insurancePolicy.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ policy })
  } catch (error) {
    console.error('[Policy PATCH]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── DELETE: Cancel policy ───────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireRole('insurer');
    if (error) return error;

    const { id } = await params
    const existing = await db.insurancePolicy.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Police non trouvée' }, { status: 404 })
    }

    const policy = await db.insurancePolicy.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    return NextResponse.json({ policy, message: 'Police annulée' })
  } catch (error) {
    console.error('[Policy DELETE]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
