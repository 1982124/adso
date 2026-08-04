import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const violationType = searchParams.get('type')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (violationType) where.violationType = violationType
    if (severity) where.severity = severity
    if (status) where.status = status

    const violations = await db.trafficViolation.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: violations })
  } catch (error) {
    console.error('[GET /api/government/violations] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des infractions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      violationType,
      description,
      severity,
      points,
      fineAmount,
      location,
      latitude,
      longitude,
      vehicleType,
      licensePlate,
      officerId,
      incidentDate,
    } = body

    if (!userId || !violationType || !description) {
      return NextResponse.json(
        { error: 'userId, violationType et description sont requis' },
        { status: 400 }
      )
    }

    const violation = await db.trafficViolation.create({
      data: {
        userId,
        violationType,
        description,
        severity: severity ?? 'minor',
        points: points ?? 0,
        fineAmount: fineAmount ?? null,
        location: location ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        vehicleType: vehicleType ?? 'car',
        licensePlate: licensePlate ?? null,
        officerId: officerId ?? null,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
      },
    })

    return NextResponse.json({ success: true, data: violation }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/government/violations] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'infraction' },
      { status: 500 }
    )
  }
}
