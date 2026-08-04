import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── GET: Get claim with details ────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const claim = await db.insuranceClaim.findUnique({ where: { id } })

    if (!claim) {
      return NextResponse.json({ error: 'Sinistre non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('[Claim GET by ID]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── PATCH: Update claim status/assessment ──────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const existing = await db.insuranceClaim.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Sinistre non trouvé' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (body.status) updateData.status = body.status
    if (body.damageAssessment) updateData.damageAssessment = typeof body.damageAssessment === 'string' ? body.damageAssessment : JSON.stringify(body.damageAssessment)
    if (body.estimatedCost !== undefined) updateData.estimatedCost = parseFloat(body.estimatedCost)
    if (body.approvedAmount !== undefined) updateData.approvedAmount = parseFloat(body.approvedAmount)
    if (body.faultDetermination) updateData.faultDetermination = typeof body.faultDetermination === 'string' ? body.faultDetermination : JSON.stringify(body.faultDetermination)
    if (body.policeReport) updateData.policeReport = body.policeReport
    if (body.witnessInfo) updateData.witnessInfo = typeof body.witnessInfo === 'string' ? body.witnessInfo : JSON.stringify(body.witnessInfo)
    if (body.photos) updateData.photos = JSON.stringify(body.photos)

    const claim = await db.insuranceClaim.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('[Claim PATCH]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
