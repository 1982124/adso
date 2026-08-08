import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── GET: Calculate PHYD metrics ──────────────────────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const trips = await db.telematicsTrip.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    })

    if (trips.length === 0) {
      return NextResponse.json({
        message: 'Aucune donnée de télématique',
        totalKm: 0,
        dureeTotale: 0,
        pourcentageConduiteNuit: 0,
        pourcentageVille: 0,
        pourcentageAutoroute: 0,
        scoreConduiteMoyen: 0,
        scoreEcoMoyen: 0,
        nombreTrajets: 0,
        ventilationMensuelle: [],
      })
    }

    const totalKm = trips.reduce((sum, t) => sum + t.distance, 0)
    const dureeTotale = trips.reduce((sum, t) => sum + t.duration, 0)

    const avgNightDriving = trips.reduce((sum, t) => sum + t.nightDriving, 0) / trips.length
    const avgCityDriving = trips.reduce((sum, t) => sum + t.cityDriving, 0) / trips.length
    const avgHighwayDriving = trips.reduce((sum, t) => sum + t.highwayDriving, 0) / trips.length

    const scoredTrips = trips.filter((t) => t.drivingScore !== null)
    const ecoScoredTrips = trips.filter((t) => t.ecoScore !== null)

    const avgDrivingScore = scoredTrips.length
      ? scoredTrips.reduce((sum, t) => sum + (t.drivingScore ?? 0), 0) / scoredTrips.length
      : 0
    const avgEcoScore = ecoScoredTrips.length
      ? ecoScoredTrips.reduce((sum, t) => sum + (t.ecoScore ?? 0), 0) / ecoScoredTrips.length
      : 0

    // Monthly breakdown
    const monthlyMap = new Map<string, typeof trips>()
    for (const trip of trips) {
      const key = `${trip.startTime.getFullYear()}-${String(trip.startTime.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyMap.has(key)) monthlyMap.set(key, [])
      monthlyMap.get(key)!.push(trip)
    }

    const ventilationMensuelle = Array.from(monthlyMap.entries()).map(([month, monthTrips]) => {
      const scored = monthTrips.filter((t) => t.drivingScore !== null)
      const ecoScored = monthTrips.filter((t) => t.ecoScore !== null)
      return {
        mois: month,
        nombreTrajets: monthTrips.length,
        kilometrageTotal: parseFloat(monthTrips.reduce((s, t) => s + t.distance, 0).toFixed(2)),
        dureeTotaleSecondes: monthTrips.reduce((s, t) => s + t.duration, 0),
        scoreConduiteMoyen: scored.length
          ? parseFloat((scored.reduce((s, t) => s + (t.drivingScore ?? 0), 0) / scored.length).toFixed(2))
          : 0,
        scoreEcoMoyen: ecoScored.length
          ? parseFloat((ecoScored.reduce((s, t) => s + (t.ecoScore ?? 0), 0) / ecoScored.length).toFixed(2))
          : 0,
        freinagesBrusques: monthTrips.reduce((s, t) => s + t.harshBrakes, 0),
        accelerationsBrusques: monthTrips.reduce((s, t) => s + t.harshAccel, 0),
      }
    }).sort((a, b) => a.mois.localeCompare(b.mois))

    return NextResponse.json({
      utilisateur: userId,
      totalKm: parseFloat(totalKm.toFixed(2)),
      dureeTotale,
      dureeTotaleFormatee: `${Math.floor(dureeTotale / 3600)}h ${Math.floor((dureeTotale % 3600) / 60)}min`,
      pourcentageConduiteNuit: parseFloat(avgNightDriving.toFixed(2)),
      pourcentageVille: parseFloat(avgCityDriving.toFixed(2)),
      pourcentageAutoroute: parseFloat(avgHighwayDriving.toFixed(2)),
      scoreConduiteMoyen: parseFloat(avgDrivingScore.toFixed(2)),
      scoreEcoMoyen: parseFloat(avgEcoScore.toFixed(2)),
      nombreTrajets: trips.length,
      ventilationMensuelle,
    })
  } catch (error) {
    console.error('[PHYD GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Generate monthly PHYD report ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await req.json()
    const { mois, annee } = body

    if (!mois || !annee) {
      return NextResponse.json({ error: 'Mois et année requis' }, { status: 400 })
    }

    const startDate = new Date(annee, mois - 1, 1)
    const endDate = new Date(annee, mois, 1)

    const trips = await db.telematicsTrip.findMany({
      where: {
        userId,
        startTime: { gte: startDate, lt: endDate },
      },
      orderBy: { startTime: 'asc' },
    })

    if (trips.length === 0) {
      return NextResponse.json({
        message: `Aucun trajet trouvé pour ${String(mois).padStart(2, '0')}/${annee}`,
        rapport: null,
      })
    }

    const totalKm = trips.reduce((s, t) => s + t.distance, 0)
    const dureeTotale = trips.reduce((s, t) => s + t.duration, 0)
    const avgNightDriving = trips.reduce((s, t) => s + t.nightDriving, 0) / trips.length
    const avgCityDriving = trips.reduce((s, t) => s + t.cityDriving, 0) / trips.length
    const avgHighwayDriving = trips.reduce((s, t) => s + t.highwayDriving, 0) / trips.length
    const scored = trips.filter((t) => t.drivingScore !== null)
    const ecoScored = trips.filter((t) => t.ecoScore !== null)
    const avgDrivingScore = scored.length
      ? scored.reduce((s, t) => s + (t.drivingScore ?? 0), 0) / scored.length
      : 0
    const avgEcoScore = ecoScored.length
      ? ecoScored.reduce((s, t) => s + (t.ecoScore ?? 0), 0) / ecoScored.length
      : 0

    const rapport = {
      periode: `${String(mois).padStart(2, '0')}/${annee}`,
      genereLe: new Date().toISOString(),
      utilisateur: userId,
      resume: {
        nombreTrajets: trips.length,
        kilometrageTotal: parseFloat(totalKm.toFixed(2)),
        dureeTotaleSecondes: dureeTotale,
        dureeFormatee: `${Math.floor(dureeTotale / 3600)}h ${Math.floor((dureeTotale % 3600) / 60)}min`,
      },
      comportement: {
        scoreConduiteMoyen: parseFloat(avgDrivingScore.toFixed(2)),
        scoreEcoMoyen: parseFloat(avgEcoScore.toFixed(2)),
        pourcentageConduiteNuit: parseFloat(avgNightDriving.toFixed(2)),
        pourcentageVille: parseFloat(avgCityDriving.toFixed(2)),
        pourcentageAutoroute: parseFloat(avgHighwayDriving.toFixed(2)),
        freinagesBrusquesTotal: trips.reduce((s, t) => s + t.harshBrakes, 0),
        accelerationsBrusquesTotal: trips.reduce((s, t) => s + t.harshAccel, 0),
        violationsVitesseTotal: trips.reduce((s, t) => s + t.speedViolations, 0),
      },
      trajets: trips.map((t) => ({
        id: t.id,
        dateDebut: t.startTime.toISOString(),
        distance: t.distance,
        duree: t.duration,
        scoreConduite: t.drivingScore,
        scoreEco: t.ecoScore,
      })),
    }

    return NextResponse.json({ rapport })
  } catch (error) {
    console.error('[PHYD POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
