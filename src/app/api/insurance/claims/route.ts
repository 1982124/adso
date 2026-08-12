import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

function finiteNumber(value: unknown): number | null {
  if (value == null || value === '') return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export async function GET() {
  try {
    const { error, session } = await requireRole('insurer')
    if (error) return error
    const userId = getUserId(session)!
    const claims = await db.insuranceClaim.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({
      claims: claims.map((claim) => ({
        ...claim,
        estimatedCost: finiteNumber(claim.estimatedCost),
        approvedAmount: finiteNumber(claim.approvedAmount),
      })),
    })
  } catch (error) {
    console.error('[Claims GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer')
    if (error) return error
    const userId = getUserId(session)!
    const body = await req.json()
    const { type, description, date, location, policyId, photos } = body
    if (!description) return NextResponse.json({ error: 'Description requise' }, { status: 400 })

    const claim = await db.insuranceClaim.create({
      data: {
        userId,
        policyId: policyId || null,
        type: type || 'collision',
        status: 'submitted',
        description: String(description).trim(),
        location: location ? String(location).trim() : null,
        incidentDate: date ? new Date(date) : new Date(),
        photos: Array.isArray(photos) ? JSON.stringify(photos.slice(0, 10)) : null,
      },
    })
    return NextResponse.json({ claim: { ...claim, estimatedCost: finiteNumber(claim.estimatedCost), approvedAmount: finiteNumber(claim.approvedAmount) } }, { status: 201 })
  } catch (error) {
    console.error('[Claims POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
