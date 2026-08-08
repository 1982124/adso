import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

// ─── Trust Score Computation ─────────────────────────────────
async function computeTrustScore(userId: string) {
  // 1. Exam Performance: avg score from quiz attempts
  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId },
    select: { score: true, passed: true },
  })
  const examPerformance = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((s, a) => s + (a.score || 0), 0) / quizAttempts.length)
    : 50

  // 2. Learning Progress: based on certifications and skill records
  const [certifications, skillRecords] = await Promise.all([
    db.certification.findMany({ where: { userId }, select: { score: true } }),
    db.skillRecord.findMany({ where: { userId }, select: { level: true } }),
  ])
  const learningProgress = certifications.length > 0
    ? Math.min(100, Math.round(certifications.reduce((s, c) => s + (c.score || 70), 0) / certifications.length))
    : skillRecords.length > 0
      ? Math.min(100, Math.round(skillRecords.reduce((s, r) => s + r.level, 0) / skillRecords.length * 10))
      : 50

  // 3. Compliance: based on certifications obtained
  const compliance = Math.min(100, certifications.length * 15 + 40)

  // 4. Telematics Score: from driving sessions
  const drivingSessions = await db.drivingSession.findMany({
    where: { userId },
    select: { score: true },
  })
  const telematicsScore = drivingSessions.length > 0
    ? Math.round(drivingSessions.reduce((s, d) => s + (d.score || 50), 0) / drivingSessions.length)
    : 50

  // 5. Driving Quality: derived from telematics + exam performance
  const drivingQuality = Math.round(telematicsScore * 0.6 + examPerformance * 0.4)

  // 6. Mechanical Health: from diagnostic records (compute from severity)
  const diagnostics = await db.diagnosticRecord.findMany({
    where: { userId },
    select: { severity: true },
  })
  const mechanicalHealth = diagnostics.length > 0
    ? Math.round(diagnostics.reduce((s, d) => {
        const sev = d.severity === 'low' ? 90 : d.severity === 'medium' ? 60 : d.severity === 'high' ? 30 : 10
        return s + sev
      }, 0) / diagnostics.length)
    : 50

  // 7. Maintenance: based on vehicle profiles with recent service
  const vehicles = await db.vehicleProfile.findMany({
    where: { userId },
    select: { lastService: true },
  })
  let maintenanceQuality = 50
  if (vehicles.length > 0) {
    const servicedCount = vehicles.filter(v => {
      if (!v.lastService) return false
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return new Date(v.lastService) > sixMonthsAgo
    }).length
    maintenanceQuality = Math.round((servicedCount / vehicles.length) * 100)
  }

  // 8. Accident History: from claims
  const accidentClaims = await db.insuranceClaim.findMany({
    where: { userId, type: { in: ['collision', 'weather', 'fire', 'flood'] } },
    select: { id: true },
  })
  const accidentHistory = Math.max(0, 100 - accidentClaims.length * 15)

  // 9. Fraud Risk: from denied claims
  const deniedClaims = await db.insuranceClaim.findMany({
    where: { userId, status: 'denied' },
    select: { id: true },
  })
  const fraudRisk = Math.min(100, deniedClaims.length * 20)

  // 10. Overall Score: weighted average (excluding fraudRisk which is separate)
  const weights = {
    drivingQuality: 0.20,
    mechanicalHealth: 0.10,
    maintenanceQuality: 0.10,
    learningProgress: 0.15,
    examPerformance: 0.15,
    telematicsScore: 0.15,
    accidentHistory: 0.10,
    compliance: 0.05,
  }
  const overallScore = Math.round(
    drivingQuality * weights.drivingQuality +
    mechanicalHealth * weights.mechanicalHealth +
    maintenanceQuality * weights.maintenanceQuality +
    learningProgress * weights.learningProgress +
    examPerformance * weights.examPerformance +
    telematicsScore * weights.telematicsScore +
    accidentHistory * weights.accidentHistory +
    compliance * weights.compliance
  )

  return {
    overallScore,
    drivingQuality,
    mechanicalHealth,
    maintenanceQuality,
    learningProgress,
    examPerformance,
    telematicsScore,
    accidentHistory,
    fraudRisk,
    compliance,
  }
}

// ─── GET: Retrieve trust score ────────────────────────────────
export async function GET() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    let trustScore = await db.trustScore.findFirst({
      where: { userId },
      orderBy: { lastCalculated: 'desc' },
    })

    if (!trustScore) {
      // Compute initial score
      const scores = await computeTrustScore(userId)
      trustScore = await db.trustScore.create({
        data: {
          userId,
          ...scores,
        },
      })
    }

    return NextResponse.json({ trustScore })
  } catch (error) {
    console.error('[TrustScore GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Recalculate trust score ────────────────────────────
export async function POST() {
  try {
    const { error, session } = await requireRole('insurer');
    if (error) return error;
    const userId = getUserId(session)!;

    const scores = await computeTrustScore(userId)

    // Upsert: update existing or create new
    const existing = await db.trustScore.findFirst({ where: { userId } })

    if (existing) {
      const updated = await db.trustScore.update({
        where: { id: existing.id },
        data: scores,
      })
      return NextResponse.json({ trustScore: updated, recalculated: true })
    } else {
      const created = await db.trustScore.create({
        data: { userId, ...scores },
      })
      return NextResponse.json({ trustScore: created, recalculated: true })
    }
  } catch (error) {
    console.error('[TrustScore POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
