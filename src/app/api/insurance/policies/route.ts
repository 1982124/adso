import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, getUserId } from '@/lib/auth'

function finiteNumber(value: unknown): number | null {
  if (value == null || value === '') return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export async function GET() {
  try {
    const { error, session } = await requireRole('insurer')
    if (error) return error
    const userId = getUserId(session)!
    const policies = await db.insurancePolicy.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    const normalized = policies.map((policy) => ({
      ...policy,
      premium: finiteNumber(policy.premium),
      deductible: finiteNumber(policy.deductible),
    }))
    return NextResponse.json({ policies: normalized })
  } catch (error) {
    console.error('[Policies GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireRole('insurer')
    if (error) return error
    const userId = getUserId(session)!
    const body = await req.json()
    const { provider, type, vehicleType, premium, deductible, startDate, endDate, paydEnabled, phydEnabled } = body
    if (!type || !vehicleType) return NextResponse.json({ error: 'Type et véhicule requis' }, { status: 400 })

    const parsedPremium = finiteNumber(premium)
    const parsedDeductible = finiteNumber(deductible)
    if (premium !== '' && premium != null && parsedPremium == null) return NextResponse.json({ error: 'Prime invalide' }, { status: 400 })
    if (deductible !== '' && deductible != null && parsedDeductible == null) return NextResponse.json({ error: 'Franchise invalide' }, { status: 400 })

    const policyNumber = `ADS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
    const policy = await db.insurancePolicy.create({
      data: {
        userId,
        provider: provider || 'ADSO Assurances',
        policyNumber,
        type,
        vehicleType,
        premium: parsedPremium,
        deductible: parsedDeductible,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: 'pending',
        paydEnabled: Boolean(paydEnabled),
        phydEnabled: Boolean(phydEnabled),
      },
    })
    return NextResponse.json({ policy: { ...policy, premium: finiteNumber(policy.premium), deductible: finiteNumber(policy.deductible) } }, { status: 201 })
  } catch (error) {
    console.error('[Policies POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
