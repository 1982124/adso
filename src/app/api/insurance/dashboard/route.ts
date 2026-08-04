import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── GET: Insurance Dashboard KPIs ──────────────────────────
export async function GET() {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!user) {
      return NextResponse.json({ error: 'Aucun utilisateur trouvé' }, { status: 404 })
    }

    // Active policies count
    const activePolicies = await db.insurancePolicy.count({
      where: { userId: user.id, status: 'active' },
    })

    // Total claims count
    const totalClaims = await db.insuranceClaim.count({
      where: { userId: user.id },
    })

    // Total claim cost (approved + paid)
    const costResult = await db.insuranceClaim.aggregate({
      _sum: { estimatedCost: true },
      where: { userId: user.id, status: { in: ['approved', 'paid'] } },
    })
    const totalClaimCost = costResult._sum.estimatedCost ?? 0

    // Pending fraud alerts
    const fraudAlerts = await db.fraudAlert.count({
      where: { userId: user.id, status: 'pending' },
    })

    // Average premium (active policies)
    const premiumResult = await db.insurancePolicy.aggregate({
      _avg: { premium: true },
      where: { userId: user.id, status: 'active', premium: { not: null } },
    })
    const averagePremium = premiumResult._avg.premium ?? 0

    // Average risk from TrustScore
    const latestTrust = await db.trustScore.findFirst({
      where: { userId: user.id },
      orderBy: { lastCalculated: 'desc' },
    })
    const averageRisk = latestTrust ? latestTrust.overallScore : 50

    // Claims by month
    const allClaims = await db.insuranceClaim.findMany({
      where: { userId: user.id, incidentDate: { not: null } },
      select: { incidentDate: true, id: true },
    })
    const claimsByMonthMap = new Map<string, number>()
    for (const claim of allClaims) {
      if (claim.incidentDate) {
        const key = `${claim.incidentDate.getFullYear()}-${String(claim.incidentDate.getMonth() + 1).padStart(2, '0')}`
        claimsByMonthMap.set(key, (claimsByMonthMap.get(key) ?? 0) + 1)
      }
    }
    const claimsByMonth = Array.from(claimsByMonthMap.entries())
      .map(([mois, nombre]) => ({ mois, nombre }))
      .sort((a, b) => a.mois.localeCompare(b.mois))

    // Policies by type
    const policies = await db.insurancePolicy.findMany({
      where: { userId: user.id },
      select: { type: true },
    })
    const policiesByTypeMap = new Map<string, number>()
    for (const p of policies) {
      policiesByTypeMap.set(p.type, (policiesByTypeMap.get(p.type) ?? 0) + 1)
    }
    const policiesByType = Array.from(policiesByTypeMap.entries()).map(([type, nombre]) => ({ type, nombre }))

    // Claims by status
    const claimsAll = await db.insuranceClaim.findMany({
      where: { userId: user.id },
      select: { status: true },
    })
    const claimsByStatusMap = new Map<string, number>()
    for (const c of claimsAll) {
      claimsByStatusMap.set(c.status, (claimsByStatusMap.get(c.status) ?? 0) + 1)
    }
    const claimsByStatus = Array.from(claimsByStatusMap.entries()).map(([statut, nombre]) => ({ statut, nombre }))

    return NextResponse.json({
      kpis: {
        policesActives: activePolicies,
        totalReclamations: totalClaims,
        coutTotalReclamations: parseFloat(totalClaimCost.toFixed(2)),
        alertesFraudeEnAttente: fraudAlerts,
        primeMoyenne: parseFloat((averagePremium ?? 0).toFixed(2)),
        risqueMoyen: parseFloat(averageRisk.toFixed(2)),
      },
      reclamationsParMois: claimsByMonth,
      policesParType: policiesByType,
      reclamationsParStatut: claimsByStatus,
    })
  } catch (error) {
    console.error('[Dashboard GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
