import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (vehicleId) where.fleetVehicleId = vehicleId
    if (status) where.status = status
    if (type) where.type = type

    const records = await db.maintenanceRecord.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            licensePlate: true,
            fleet: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('[GET /api/fleet/maintenance] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des maintenances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const body = await request.json()
    const {
      fleetVehicleId,
      userId,
      type,
      description,
      cost,
      performedBy,
      performedAt,
      nextDueDate,
      nextDueMileage,
      status,
      parts,
      notes,
    } = body

    if (!fleetVehicleId || !description) {
      return NextResponse.json(
        { error: 'fleetVehicleId et description sont requis' },
        { status: 400 }
      )
    }

    const record = await db.maintenanceRecord.create({
      data: {
        fleetVehicleId,
        userId: userId ?? null,
        type: type ?? 'routine',
        description,
        cost: cost ?? null,
        performedBy: performedBy ?? null,
        performedAt: performedAt ? new Date(performedAt) : null,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        nextDueMileage: nextDueMileage ?? null,
        status: status ?? 'scheduled',
        parts: parts ? JSON.stringify(parts) : null,
        notes: notes ?? null,
      },
    })

    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/fleet/maintenance] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la planification de la maintenance' },
      { status: 500 }
    )
  }
}
