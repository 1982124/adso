import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── GET: Analyze all claims for fraud patterns ──────────────
export async function GET() {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!user) {
      return NextResponse.json({ error: 'Aucun utilisateur trouvé' }, { status: 404 })
    }

    const claims = await db.insuranceClaim.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const newAlerts: Array<{ type: string; description: string; probability: number; claimId: string | null; evidence: string }> = []

    // 1. Duplicate claims: same description, same location within 30 days
    for (let i = 0; i < claims.length; i++) {
      for (let j = i + 1; j < claims.length; j++) {
        const a = claims[i]
        const b = claims[j]
        if (a.description === b.description && a.latitude !== null && b.latitude !== null) {
          const timeDiff = Math.abs(a.createdAt.getTime() - b.createdAt.getTime())
          const thirtyDays = 30 * 24 * 60 * 60 * 1000
          if (timeDiff <= thirtyDays) {
            const latDiff = Math.abs((a.latitude ?? 0) - (b.latitude ?? 0))
            const lngDiff = Math.abs((a.longitude ?? 0) - (b.longitude ?? 0))
            if (latDiff < 0.01 && lngDiff < 0.01) {
              newAlerts.push({
                type: 'doublon',
                description: `Réclamation en doublon détectée : description identique et localisation similaire (dans les 30 jours). Réclamations: ${a.id} et ${b.id}`,
                probability: 85,
                claimId: b.id,
                evidence: JSON.stringify({ claimA: a.id, claimB: b.id, description: a.description }),
              })
            }
          }
        }
      }
    }

    // 2. Repeated accidents: 3+ claims in 6 months
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    const recentClaims = claims.filter((c) => c.createdAt >= sixMonthsAgo)
    if (recentClaims.length >= 3) {
      newAlerts.push({
        type: 'repetition',
        description: `Nombre anormal de réclamations: ${recentClaims.length} réclamations en 6 mois`,
        probability: 70,
        claimId: null,
        evidence: JSON.stringify({ count: recentClaims.length, claimIds: recentClaims.map((c) => c.id) }),
      })
    }

    // 3. Abnormal declarations: claim cost way above average
    const claimsWithCost = claims.filter((c) => c.estimatedCost !== null)
    if (claimsWithCost.length >= 2) {
      const avgCost = claimsWithCost.reduce((s, c) => s + (c.estimatedCost ?? 0), 0) / claimsWithCost.length
      for (const claim of claimsWithCost) {
        if (claim.estimatedCost !== null && claim.estimatedCost > avgCost * 3 && claim.estimatedCost > 5000) {
          newAlerts.push({
            type: 'montant_anormal',
            description: `Montant de réclamation anormalement élevé: ${claim.estimatedCost}€ (moyenne: ${avgCost.toFixed(2)}€)`,
            probability: 60,
            claimId: claim.id,
            evidence: JSON.stringify({ claimCost: claim.estimatedCost, averageCost: avgCost, ratio: claim.estimatedCost / avgCost }),
          })
        }
      }
    }

    // Create new FraudAlert records (avoid duplicates by type+claimId combo)
    const createdAlerts = []
    for (const alert of newAlerts) {
      const existing = alert.claimId
        ? await db.fraudAlert.findFirst({ where: { userId: user.id, type: alert.type, claimId: alert.claimId } })
        : await db.fraudAlert.findFirst({ where: { userId: user.id, type: alert.type } })

      if (!existing) {
        const created = await db.fraudAlert.create({
          data: {
            userId: user.id,
            claimId: alert.claimId,
            type: alert.type,
            probability: alert.probability,
            description: alert.description,
            evidence: alert.evidence,
            status: 'pending',
          },
        })
        createdAlerts.push(created)
      }
    }

    // Return all fraud alerts for the user
    const allAlerts = await db.fraudAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      alertes: allAlerts,
      nouvellesAlertes: createdAlerts.length,
      patternsDetectes: newAlerts.length,
      message: newAlerts.length > 0
        ? `${newAlerts.length} pattern(s) de fraude détecté(s), ${createdAlerts.length} nouvelle(s) alerte(s) créée(s)`
        : 'Aucun pattern de fraude détecté',
    })
  } catch (error) {
    console.error('[Fraud GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Create a manual fraud alert ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!user) {
      return NextResponse.json({ error: 'Aucun utilisateur trouvé' }, { status: 404 })
    }

    const body = await req.json()
    const { claimId, type, description } = body

    if (!type || !description) {
      return NextResponse.json({ error: 'Type et description requis' }, { status: 400 })
    }

    const alert = await db.fraudAlert.create({
      data: {
        userId: user.id,
        claimId: claimId || null,
        type,
        probability: 75,
        description,
        status: 'pending',
      },
    })

    return NextResponse.json({ alerte: alert, message: 'Alerte de fraude créée avec succès' }, { status: 201 })
  } catch (error) {
    console.error('[Fraud POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
