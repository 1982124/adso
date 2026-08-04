import { NextRequest, NextResponse } from 'next/server'
// ─── Mock Trip Data ───────────────────────────────────────────
const trips = [
  { id: 1, date: '2026-08-04', depart: 'Bamako, Kalaban-Coura', arrivee: 'Bamako, ACI 2000', distance: 8.4, duree: '00:18', vitesseMoy: 28, conso: 7.1 },
  { id: 2, date: '2026-08-03', depart: 'Bamako, ACI 2000', arrivee: 'Kati', distance: 15.2, duree: '00:25', vitesseMoy: 36, conso: 6.8 },
  { id: 3, date: '2026-08-03', depart: 'Kati', arrivee: 'Bamako, Badalabougou', distance: 14.8, duree: '00:22', vitesseMoy: 40, conso: 6.5 },
  { id: 4, date: '2026-08-02', depart: 'Bamako, Badalabougou', arrivee: 'Bamako, Hamdallaye', distance: 5.1, duree: '00:12', vitesseMoy: 25, conso: 7.4 },
  { id: 5, date: '2026-08-01', depart: 'Bamako, Hamdallaye', arrivee: 'Bamako, Lafiabougou', distance: 3.2, duree: '00:08', vitesseMoy: 24, conso: 7.8 },
  { id: 6, date: '2026-07-31', depart: 'Bamako, Lafiabougou', arrivee: 'Koulikoro', distance: 59.0, duree: '01:05', vitesseMoy: 54, conso: 6.2 },
  { id: 7, date: '2026-07-30', depart: 'Koulikoro', arrivee: 'Bamako, Kalaban-Coura', distance: 57.5, duree: '01:02', vitesseMoy: 55, conso: 6.1 },
  { id: 8, date: '2026-07-29', depart: 'Bamako, Kalaban-Coura', arrivee: 'Bamako, Baco Djicoroni', distance: 6.7, duree: '00:15', vitesseMoy: 27, conso: 7.3 },
  { id: 9, date: '2026-07-28', depart: 'Bamako, Baco Djicoroni', arrivee: 'Bamako, Sébenikoro', distance: 4.3, duree: '00:10', vitesseMoy: 26, conso: 7.6 },
  { id: 10, date: '2026-07-27', depart: 'Bamako, Sébenikoro', arrivee: 'Bamako, ACI 2000', distance: 9.1, duree: '00:20', vitesseMoy: 27, conso: 7.0 },
]

// ─── Mock Driving Stats ───────────────────────────────────────
const stats = {
  scoreConduite: 85,
  freinagesUrgence: 3,
  accelerationsBrusques: 7,
  vitesseExcessive: 2,
  tempsRalenti: 15,
  weeklyData: [
    { day: 'Lun', speed: 2, braking: 1, acceleration: 3 },
    { day: 'Mar', speed: 0, braking: 2, acceleration: 1 },
    { day: 'Mer', speed: 1, braking: 0, acceleration: 2 },
    { day: 'Jeu', speed: 3, braking: 3, acceleration: 4 },
    { day: 'Ven', speed: 0, braking: 1, acceleration: 1 },
    { day: 'Sam', speed: 1, braking: 2, acceleration: 2 },
    { day: 'Dim', speed: 0, braking: 0, acceleration: 0 },
  ],
  monthlyFuel: [
    { month: 'Mars', litres: 52 },
    { month: 'Avril', litres: 48 },
    { month: 'Mai', litres: 61 },
    { month: 'Juin', litres: 55 },
    { month: 'Juillet', litres: 58 },
    { month: 'Août', litres: 34 },
  ],
  carburant: {
    niveau: 65,
    autonomie: 450,
    consoMoyenne: 6.8,
    coutMoisEnCours: 28500,
  },
  resumeMois: {
    totalKm: 183.3,
    totalTrajets: 10,
    consoMoyenne: 6.88,
    vitesseMoyenne: 33.2,
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (type === 'trips') {
    return NextResponse.json({ success: true, data: trips })
  }

  if (type === 'stats') {
    return NextResponse.json({ success: true, data: stats })
  }

  // Default: return everything
  return NextResponse.json({ success: true, data: { trips, stats } })
}
