import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')

    const where: Record<string, unknown> = {}
    if (vehicleId) where.fleetVehicleId = vehicleId

    const records = await db.fuelRecord.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            licensePlate: true,
          },
        },
      },
      orderBy: { fuelingDate: 'desc' },
    })

    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('[GET /api/fleet/fuel] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des enregistrements de carburant' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fleetVehicleId,
      userId,
      fuelType,
      quantity,
      costPerLiter,
      totalCost,
      odometer,
      fuelingDate,
      stationName,
      location,
    } = body

    if (!fleetVehicleId || !quantity) {
      return NextResponse.json(
        { error: 'fleetVehicleId et quantity sont requis' },
        { status: 400 }
      )
    }

    const record = await db.fuelRecord.create({
      data: {
        fleetVehicleId,
        userId: userId ?? null,
        fuelType: fuelType ?? 'diesel',
        quantity: Number(quantity),
        costPerLiter: costPerLiter ?? null,
        totalCost: totalCost ?? null,
        odometer: odometer ?? null,
        fuelingDate: fuelingDate ? new Date(fuelingDate) : new Date(),
        stationName: stationName ?? null,
        location: location ?? null,
      },
    })

    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/fleet/fuel] Error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'enregistrement de carburant" },
      { status: 500 }
    )
  }
}
