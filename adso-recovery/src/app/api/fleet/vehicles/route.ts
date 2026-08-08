import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const fleetId = searchParams.get('fleetId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (fleetId) where.fleetId = fleetId
    if (status) where.status = status

    const vehicles = await db.fleetVehicle.findMany({
      where,
      include: {
        fleet: { select: { name: true } },
        _count: { select: { maintenanceRecords: true, fuelRecords: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: vehicles })
  } catch (error) {
    console.error('[GET /api/fleet/vehicles] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des véhicules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const body = await request.json()
    const { fleetId, make, model, year, type, fuelType, licensePlate, vin, mileage } = body

    if (!fleetId || !make || !model || !year) {
      return NextResponse.json(
        { error: 'fleetId, make, model et year sont requis' },
        { status: 400 }
      )
    }

    const vehicle = await db.fleetVehicle.create({
      data: {
        fleetId,
        make,
        model,
        year,
        type: type ?? 'car',
        fuelType: fuelType ?? 'diesel',
        licensePlate: licensePlate ?? '',
        vin: vin ?? null,
        mileage: mileage ?? 0,
      },
    })

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/fleet/vehicles] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du véhicule' },
      { status: 500 }
    )
  }
}
