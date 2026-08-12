import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

function finite(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function GET() {
  try {
    const { error, session } = await requireRole('insurer')
    if (error) return error
    const userId = getUserId(session)!
    const activePolicies = await db.insurancePolicy.count({ where: { userId, status: 'active' } })
    const totalClaims = await db.insuranceClaim.count({ where: { userId } })
    const costResult = await db.insuranceClaim.aggregate({ _sum: { estimatedCost: true }, where: { userId, status: { in: ['approved', 'paid'] } } })
    const totalClaimCost = finite(costResult._sum.estimatedCost)
    const fraudAlerts = await db.fraudAlert.count({ where: { userId, status: 'pending' } })
    const premiumResult = await db.insurancePolicy.aggregate({ _avg: { premium: true }, where: { userId, status: 'active', premium: { not: null } } })
    const averagePremium = finite(premiumResult._avg.premium)
    const latestTrust = await db.trustScore.findFirst({ where: { userId }, orderBy: { lastCalculated: 'desc' } })
    const averageRisk = finite(latestTrust?.overallScore, 50)
    return NextResponse.json({ kpis: { policesActives: activePolicies, totalReclamations: totalClaims, coutTotalReclamations: Number(totalClaimCost.toFixed(2)), alertesFraudeEnAttente: fraudAlerts, primeMoyenne: Number(averagePremium.toFixed(2)), risqueMoyen: Number(averageRisk.toFixed(2)) } })
  } catch (error) {
    console.error('[Dashboard GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
