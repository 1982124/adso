import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── GET: Risk assessment ──────────────────────────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const user = await db.user.findUnique({ where: { id: userId } })

    // 1. Vehicle risk: based on vehicle profiles
    const vehicles = await db.vehicleProfile.findMany({
      where: { userId },
      select: { year: true, mileage: true, lastService: true, type: true },
    })

    let vehicleRiskScore = 35
    if (vehicles.length > 0) {
      const avgYear = vehicles.reduce((s, v) => s + v.year, 0) / vehicles.length
      const avgMileage = vehicles.reduce((s, v) => s + v.mileage, 0) / vehicles.length
      const servicedRecently = vehicles.filter(v => {
        if (!v.lastService) return false
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        return new Date(v.lastService) > sixMonthsAgo
      }).length

      // Newer vehicles = lower risk, lower mileage = lower risk
      const yearFactor = Math.max(0, Math.min(50, (new Date().getFullYear() - avgYear) * 3))
      const mileageFactor = Math.min(30, avgMileage / 5000)
      const serviceFactor = (1 - servicedRecently / vehicles.length) * 20

      vehicleRiskScore = Math.round(Math.min(100, yearFactor + mileageFactor + serviceFactor))
    }

    // 2. Driver risk: based on quiz attempts, certifications, claims
    const [quizAttempts, certifications, claims] = await Promise.all([
      db.quizAttempt.findMany({
        where: { userId },
        select: { score: true, passed: true },
      }),
      db.certification.findMany({
        where: { userId },
        select: { score: true },
      }),
      db.insuranceClaim.findMany({
        where: { userId },
        select: { status: true, type: true },
      }),
    ])

    const avgQuizScore = quizAttempts.length > 0
      ? quizAttempts.reduce((s, a) => s + (a.score || 0), 0) / quizAttempts.length
      : 50
    const deniedClaims = claims.filter(c => c.status === 'denied').length
    const accidentClaims = claims.filter(c => ['collision', 'weather', 'fire', 'flood'].includes(c.type)).length

    const driverRiskRaw = (100 - avgQuizScore) * 0.3 + deniedClaims * 10 + accidentClaims * 5 - certifications.length * 5
    const driverRiskScore = Math.max(0, Math.min(100, Math.round(driverRiskRaw)))
    const driverRiskLevel = driverRiskScore <= 25 ? 'Faible'
      : driverRiskScore <= 50 ? 'Moyen'
        : driverRiskScore <= 75 ? 'Élevé' : 'Très élevé'

    // 3. Location risk (simulated based on user country)
    const locationRisk = user?.country === 'FR' ? 42 : 55

    // 4. Risk factors
    const riskFactors = [
      { name: 'Âge du conducteur', value: 15, description: 'Conducteur expérimenté (30-45 ans)' },
      { name: 'Historique accidents', value: Math.min(100, accidentClaims * 25), description: `${accidentClaims} sinistre(s) enregistré(s)` },
      { name: 'Kilométrage annuel', value: vehicles.length > 0 ? Math.min(80, Math.round(vehicles[0].mileage / 200)) : 40, description: vehicles.length > 0 ? `Environ ${Math.round(vehicles[0].mileage * 1.5).toLocaleString('fr-FR')} km/an estimés` : 'Non disponible' },
      { name: 'Zone géographique', value: locationRisk, description: `Zone ${user?.country ?? 'FR'} — risque ${locationRisk <= 30 ? 'faible' : locationRisk <= 60 ? 'moyen' : 'élevé'}` },
      { name: 'Type de véhicule', value: vehicles.length > 0 ? (vehicles[0].type === 'car' ? 20 : 40) : 30, description: vehicles.length > 0 ? `Type : ${vehicles[0].type}` : 'Non défini' },
      { name: 'Score de conduite', value: Math.max(0, 100 - driverRiskScore), description: `Score global : ${Math.max(0, 100 - driverRiskScore)}/100` },
      { name: 'Fréquence d\'utilisation', value: 30, description: 'Usage quotidien modéré' },
      { name: 'Stationnement', value: 50, description: 'Stationnement principalement en rue' },
    ]

    // 5. Premium recommendation (simplified formula)
    const basePremium = 800
    const riskAdjustment = (vehicleRiskScore + driverRiskScore) / 200
    const premiumRecommendation = Math.round(basePremium * (0.7 + riskAdjustment * 0.6))

    return NextResponse.json({
      vehicleRiskScore,
      driverRiskLevel,
      driverRiskScore,
      locationRisk,
      riskFactors,
      premiumRecommendation,
    })
  } catch (error) {
    console.error('[Risk GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
