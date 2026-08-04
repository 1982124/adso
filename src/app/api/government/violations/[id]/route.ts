import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const violation = await db.trafficViolation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    if (!violation) {
      return NextResponse.json(
        { error: 'Infraction non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: violation })
  } catch (error) {
    console.error('[GET /api/government/violations/:id] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'infraction' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, fineAmount, points, description } = body

    const existing = await db.trafficViolation.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Infraction non trouvée' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (fineAmount !== undefined) updateData.fineAmount = fineAmount
    if (points !== undefined) updateData.points = points
    if (description) updateData.description = description

    const violation = await db.trafficViolation.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: violation })
  } catch (error) {
    console.error('[PATCH /api/government/violations/:id] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'infraction' },
      { status: 500 }
    )
  }
}
