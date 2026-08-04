import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET() {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const organizations = await db.fleetOrganization.findMany({
      include: {
        _count: { select: { vehicles: true, drivers: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: organizations })
  } catch (error) {
    console.error('[GET /api/fleet] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des flottes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole('fleet_manager')
  if (error) return error
  try {
    const body = await request.json()
    const { name, description, country, plan, maxVehicles, maxDrivers } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      )
    }

    const organization = await db.fleetOrganization.create({
      data: {
        name,
        description: description ?? null,
        country: country ?? 'FR',
        plan: plan ?? 'starter',
        maxVehicles: maxVehicles ?? 10,
        maxDrivers: maxDrivers ?? 10,
      },
    })

    return NextResponse.json({ success: true, data: organization }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/fleet] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la flotte' },
      { status: 500 }
    )
  }
}
