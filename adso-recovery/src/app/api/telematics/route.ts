import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserId } from '@/lib/auth'

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

// ─── GET ───────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth()
    if (authError) return authError
    const userId = getUserId(session)!

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: true, data: [], message: 'Aucun utilisateur' })
    }

    // ── type=trips: return real trip records ──
    if (type === 'trips') {
    const trips = await db.telematicsTrip.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
      take: 50,
    })

    const formatted = trips.map(t => ({
      id: t.id,
      date: t.startTime.toISOString().split('T')[0],
      depart: t.startAddress || '—',
      arrivee: t.endAddress || '—',
      distance: Number(t.distance),
      duree: formatDuration(t.duration),
      vitesseMoy: t.avgSpeed ? Math.round(t.avgSpeed) : 0,
      conso: t.fuelConsumption ? Number(t.fuelConsumption) : 0,
    }))

    return NextResponse.json({ success: true, data: formatted })
  }

  // ── type=stats: compute real stats ──
  if (type === 'stats') {
    const trips = await db.telematicsTrip.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
    })

    if (trips.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          scoreConduite: 0,
          freinagesUrgence: 0,
          accelerationsBrusques: 0,
          vitesseExcessive: 0,
          tempsRalenti: 0,
          weeklyData: DAY_NAMES.map(d => ({ day: d, speed: 0, braking: 0, acceleration: 0 })),
          monthlyFuel: [],
          carburant: { niveau: 0, autonomie: 0, consoMoyenne: 0, coutMoisEnCours: 0 },
          resumeMois: { totalKm: 0, totalTrajets: 0, consoMoyenne: 0, vitesseMoyenne: 0 },
          message: 'Aucune donnée',
        },
      })
    }

    const totalKm = trips.reduce((s, t) => s + Number(t.distance), 0)
    const totalTrips = trips.length
    const avgConsumption = avg(trips.map(t => t.fuelConsumption).filter((c): c is number => c !== null))
    const avgSpeed = avg(trips.map(t => t.avgSpeed).filter((s): s is number => s !== null))
    const harshBrakes = trips.reduce((s, t) => s + t.harshBrakes, 0)
    const harshAccel = trips.reduce((s, t) => s + t.harshAccel, 0)
    const speedViolations = trips.reduce((s, t) => s + t.speedViolations, 0)
    const drivingScore = avg(trips.map(t => t.drivingScore).filter((s): s is number => s !== null))
    const totalFuelCost = trips.reduce((s, t) => s + (t.fuelCost || 0), 0)

    // weeklyData: group by day of week (last 7 days)
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentTrips = trips.filter(t => t.startTime >= sevenDaysAgo)
    const weeklyMap: Record<string, { speed: number; braking: number; acceleration: number }> = {}
    DAY_NAMES.forEach(d => { weeklyMap[d] = { speed: 0, braking: 0, acceleration: 0 } })

    for (const t of recentTrips) {
      const dayName = DAY_NAMES[t.startTime.getDay()]
      weeklyMap[dayName].speed += t.speedViolations
      weeklyMap[dayName].braking += t.harshBrakes
      weeklyMap[dayName].acceleration += t.harshAccel
    }
    const weeklyData = DAY_NAMES.map(d => ({ day: d, ...weeklyMap[d] }))

    // monthlyFuel: group fuelCost by month (last 6 months)
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const monthMap: Record<string, number> = {}
    for (const t of trips) {
      if (t.startTime >= sixMonthsAgo && t.fuelConsumption) {
        const key = `${t.startTime.getFullYear()}-${String(t.startTime.getMonth() + 1).padStart(2, '0')}`
        monthMap[key] = (monthMap[key] || 0) + Number(t.fuelConsumption) * (Number(t.distance) / 100)
      }
    }
    const monthlyFuel = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, litres]) => {
        const [y, m] = key.split('-').map(Number)
        return { month: MONTH_NAMES[m - 1], litres: Math.round(litres * 10) / 10 }
      })

    return NextResponse.json({
      success: true,
      data: {
        scoreConduite: Math.round(drivingScore),
        freinagesUrgence: harshBrakes,
        accelerationsBrusques: harshAccel,
        vitesseExcessive: speedViolations,
        tempsRalenti: 0,
        weeklyData,
        monthlyFuel,
        carburant: {
          niveau: 65,
          autonomie: avgConsumption > 0 ? Math.round((65 * 50) / avgConsumption * 10) / 10 : 0,
          consoMoyenne: Math.round(avgConsumption * 10) / 10,
          coutMoisEnCours: Math.round(totalFuelCost),
        },
        resumeMois: {
          totalKm: Math.round(totalKm * 10) / 10,
          totalTrajets: totalTrips,
          consoMoyenne: Math.round(avgConsumption * 100) / 100,
          vitesseMoyenne: Math.round(avgSpeed * 10) / 10,
        },
      },
    })
  }

    // Default: return both
    const trips = await db.telematicsTrip.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, data: { trips } })
  } catch (error) {
    console.error('[GET /api/telematics] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: create a new trip ────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth()
    if (authError) return authError
    const userId = getUserId(session)!

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    const body = await request.json()

    const trip = await db.telematicsTrip.create({
      data: {
        userId: user.id,
        vehicleId: body.vehicleId || null,
        startAddress: body.startAddress || null,
        endAddress: body.endAddress || null,
        startLatitude: body.startLatitude ?? null,
        startLongitude: body.startLongitude ?? null,
        endLatitude: body.endLatitude ?? null,
        endLongitude: body.endLongitude ?? null,
        distance: body.distance ?? 0,
        duration: body.duration ?? 0,
        avgSpeed: body.avgSpeed ?? null,
        maxSpeed: body.maxSpeed ?? null,
        fuelConsumption: body.fuelConsumption ?? null,
        fuelCost: body.fuelCost ?? null,
        harshBrakes: body.harshBrakes ?? 0,
        harshAccel: body.harshAccel ?? 0,
        speedViolations: body.speedViolations ?? 0,
        nightDriving: body.nightDriving ?? 0,
        cityDriving: body.cityDriving ?? 0,
        highwayDriving: body.highwayDriving ?? 0,
        drivingScore: body.drivingScore ?? null,
        ecoScore: body.ecoScore ?? null,
        weather: body.weather || null,
        roadType: body.roadType || null,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : null,
      },
    })

    return NextResponse.json({ success: true, data: trip })
  } catch (error) {
    console.error('Erreur création trajet:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création du trajet' }, { status: 500 })
  }
}

// ─── Helpers ───────────────────────────────────────────────
function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
