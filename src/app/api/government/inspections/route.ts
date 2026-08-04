import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const result = searchParams.get('result')

    const where: Record<string, unknown> = {}
    if (result) where.status = result

    const inspections = await db.fleetVehicle.findMany({
      where: {
        ...where,
        lastInspection: { not: null },
      },
      select: {
        id: true,
        make: true,
        model: true,
        licensePlate: true,
        lastInspection: true,
        status: true,
        fleet: { select: { name: true } },
      },
      orderBy: { lastInspection: 'desc' },
    })

    return NextResponse.json({ success: true, data: inspections })
  } catch (error) {
    console.error('[GET /api/government/inspections] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des inspections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, result, nextDue } = body

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'vehicleId est requis' },
        { status: 400 }
      )
    }

    const vehicle = await db.fleetVehicle.update({
      where: { id: vehicleId },
      data: {
        lastInspection: new Date(),
        status: result === 'pass' ? 'active' : 'out_of_service',
      },
    })

    return NextResponse.json({ success: true, data: vehicle })
  } catch (error) {
    console.error('[POST /api/government/inspections] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la planification de l\'inspection' },
      { status: 500 }
    )
  }
}
