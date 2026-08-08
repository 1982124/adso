import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

const BASE_PREMIUMS: Record<string, number> = {
  third_party: 500,
  comprehensive: 900,
  collision: 700,
  theft: 600,
  gap: 400,
}

// ─── GET: Calculate premium for all user policies ─────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const policies = await db.insurancePolicy.findMany({
      where: { userId },
    })

    const trustScore = await db.trustScore.findFirst({
      where: { userId },
      orderBy: { lastCalculated: 'desc' },
    })

    const sessions = await db.drivingSession.findMany({
      where: { userId, status: 'completed' },
    })

    const totalHarshBrakes = sessions.reduce((sum, s) => sum + s.harshBrakes, 0)
    const totalSpeedViolations = sessions.reduce((sum, s) => sum + s.speedViolations, 0)
    const totalFatigueEvents = sessions.reduce((sum, s) => sum + s.fatigueEvents, 0)
    const totalSessions = sessions.length || 1

    const behaviorPenalty = Math.min(
      (totalHarshBrakes * 0.02 + totalSpeedViolations * 0.05 + totalFatigueEvents * 0.08) / totalSessions,
      0.5
    )

    const vehicles = await db.vehicleProfile.findMany({
      where: { userId },
    })
    const currentYear = new Date().getFullYear()
    const avgVehicleAge = vehicles.length
      ? vehicles.reduce((sum, v) => sum + (currentYear - v.year), 0) / vehicles.length
      : 5
    const avgMileage = vehicles.length
      ? vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length
      : 50000

    const claimsCount = await db.insuranceClaim.count({
      where: { userId },
    })

    const maintenanceQuality = trustScore?.maintenanceQuality ?? 50

    const riskFactor = Math.min(
      (avgVehicleAge * 0.005) +
      (avgMileage / 200000 * 0.1) +
      (claimsCount * 0.05) +
      ((100 - maintenanceQuality) / 100 * 0.1),
      0.8
    )

    const overallTrustScore = trustScore?.overallScore ?? 50

    const results = policies.map((policy) => {
      const basePremium = BASE_PREMIUMS[policy.type] ?? 500
      const trustAdjustment = 1 - overallTrustScore / 200
      const finalPremium = parseFloat(
      (basePremium * trustAdjustment * (1 + behaviorPenalty) * (1 + riskFactor)).toFixed(2)
      )

      return {
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        type: policy.type,
        basePremium,
        trustScore: overallTrustScore,
        trustAdjustment: parseFloat(trustAdjustment.toFixed(4)),
        behaviorPenalty: parseFloat(behaviorPenalty.toFixed(4)),
        riskFactor: parseFloat(riskFactor.toFixed(4)),
        calculatedPremium: finalPremium,
        currentPremium: policy.premium,
        factors: {
          avgVehicleAge: parseFloat(avgVehicleAge.toFixed(1)),
          avgMileage: Math.round(avgMileage),
          claimsCount,
          maintenanceQuality,
          totalHarshBrakes,
          totalSpeedViolations,
          totalFatigueEvents,
          totalSessions: sessions.length,
        },
      }
    })

    return NextResponse.json({
      utilisateur: userId,
      formule: 'basePremium * (1 - trustScore/200) * (1 + behaviorPenalty) * (1 + riskFactor)',
      primes: results,
    })
  } catch (error) {
    console.error('[Premium GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Recalculate premium for a specific policy ──────────
export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const body = await req.json()
    const { policyId } = body

    if (!policyId) {
      return NextResponse.json({ error: 'policyId requis' }, { status: 400 })
    }

    const policy = await db.insurancePolicy.findFirst({
      where: { id: policyId, userId },
    })
    if (!policy) {
      return NextResponse.json({ error: 'Police non trouvée' }, { status: 404 })
    }

    const trustScore = await db.trustScore.findFirst({
      where: { userId },
      orderBy: { lastCalculated: 'desc' },
    })

    const sessions = await db.drivingSession.findMany({
      where: { userId, status: 'completed' },
    })

    const totalHarshBrakes = sessions.reduce((sum, s) => sum + s.harshBrakes, 0)
    const totalSpeedViolations = sessions.reduce((sum, s) => sum + s.speedViolations, 0)
    const totalFatigueEvents = sessions.reduce((sum, s) => sum + s.fatigueEvents, 0)
    const totalSessions = sessions.length || 1

    const behaviorPenalty = Math.min(
      (totalHarshBrakes * 0.02 + totalSpeedViolations * 0.05 + totalFatigueEvents * 0.08) / totalSessions,
      0.5
    )

    const vehicles = await db.vehicleProfile.findMany({
      where: { userId },
    })
    const currentYear = new Date().getFullYear()
    const avgVehicleAge = vehicles.length
      ? vehicles.reduce((sum, v) => sum + (currentYear - v.year), 0) / vehicles.length
      : 5
    const avgMileage = vehicles.length
      ? vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length
      : 50000

    const claimsCount = await db.insuranceClaim.count({
      where: { userId },
    })

    const maintenanceQuality = trustScore?.maintenanceQuality ?? 50

    const riskFactor = Math.min(
      (avgVehicleAge * 0.005) +
      (avgMileage / 200000 * 0.1) +
      (claimsCount * 0.05) +
      ((100 - maintenanceQuality) / 100 * 0.1),
      0.8
    )

    const overallTrustScore = trustScore?.overallScore ?? 50
    const basePremium = BASE_PREMIUMS[policy.type] ?? 500
    const trustAdjustment = 1 - overallTrustScore / 200
    const finalPremium = parseFloat(
      (basePremium * trustAdjustment * (1 + behaviorPenalty) * (1 + riskFactor)).toFixed(2)
    )

    const calculation = await db.premiumCalculation.create({
      data: {
        policyId: policy.id,
        basePremium,
        riskAdjustment: parseFloat((trustAdjustment * (1 + riskFactor)).toFixed(4)),
        behaviourAdjustment: parseFloat(behaviorPenalty.toFixed(4)),
        finalPremium,
        factors: JSON.stringify({
          trustScore: overallTrustScore,
          behaviorPenalty,
          riskFactor,
          avgVehicleAge,
          avgMileage,
          claimsCount,
          maintenanceQuality,
          totalHarshBrakes,
          totalSpeedViolations,
          totalFatigueEvents,
          totalSessions: sessions.length,
        }),
      },
    })

    const updatedPolicy = await db.insurancePolicy.update({
      where: { id: policy.id },
      data: { premium: finalPremium },
    })

    return NextResponse.json({
      calcul: calculation,
      police: updatedPolicy,
      message: 'Prime recalculée avec succès',
    })
  } catch (error) {
    console.error('[Premium POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
