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
      include: { fleet: { select: { name: true } }, _count: { select: { maintenanceRecords: true, fuelRecords: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: vehicles })
  } catch (error) {
    console.error('[GET /api/fleet/vehicles] Error:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement des véhicules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const body = await request.json()
    const make = String(body.make || '').trim()
    const model = String(body.model || '').trim()
    const year = Number(body.year)
    const mileage = body.mileage == null || body.mileage === '' ? 0 : Number(body.mileage)
    let fleetId = body.fleetId ? String(body.fleetId) : ''

    if (!make || !model || !Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      return NextResponse.json({ error: 'Marque, modèle et année valide sont requis' }, { status: 400 })
    }
    if (!Number.isFinite(mileage) || mileage < 0) return NextResponse.json({ error: 'Kilométrage invalide' }, { status: 400 })

    // A first vehicle should not be blocked by an empty fleet catalogue. Create
    // one safe default organization and let the manager rename it afterwards.
    if (!fleetId) {
      const defaultFleet = await db.fleetOrganization.create({ data: { name: 'Ma flotte ADSO', country: String(body.country || 'ML') } })
      fleetId = defaultFleet.id
    } else {
      const fleet = await db.fleetOrganization.findUnique({ where: { id: fleetId } })
      if (!fleet) return NextResponse.json({ error: 'Flotte introuvable' }, { status: 404 })
      const count = await db.fleetVehicle.count({ where: { fleetId } })
      if (count >= fleet.maxVehicles) return NextResponse.json({ error: 'Limite de véhicules atteinte pour cette flotte' }, { status: 409 })
    }

    const vehicle = await db.fleetVehicle.create({
      data: {
        fleetId,
        make,
        model,
        year,
        type: body.type ?? 'car',
        fuelType: body.fuelType ?? 'diesel',
        licensePlate: String(body.licensePlate || '').trim(),
        vin: body.vin ? String(body.vin).trim().toUpperCase() : null,
        mileage: Math.round(mileage),
      },
    })
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/fleet/vehicles] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de l’ajout du véhicule' }, { status: 500 })
  }
}
