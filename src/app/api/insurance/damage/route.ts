import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const PART_CATALOG: Record<string, string> = {
  bumperScore: 'Pare-chocs',
  doorsScore: 'Portes',
  hoodScore: 'Capot',
  windshieldScore: 'Pare-brise',
  lightsScore: 'Éclairage',
  wheelsScore: 'Roues/Pneus',
  chassisScore: 'Châssis',
}

const REPAIR_DURATION: Record<string, string> = {
  total_loss: '30-45 jours',
  severe: '15-25 jours',
  moderate: '5-10 jours',
  minor: '1-3 jours',
}

const REPAIR_COST: Record<string, number> = {
  total_loss: 15000,
  severe: 8000,
  moderate: 3000,
  minor: 800,
}

function computeSeverity(avg: number): string {
  if (avg > 80) return 'minor'
  if (avg > 60) return 'moderate'
  if (avg > 40) return 'severe'
  return 'total_loss'
}

// ─── GET: Get damage assessment for a claim ──────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!user) {
      return NextResponse.json({ error: 'Aucun utilisateur trouvé' }, { status: 404 })
    }

    const claimId = req.nextUrl.searchParams.get('claimId')
    if (!claimId) {
      return NextResponse.json({ error: 'claimId requis en paramètre de requête' }, { status: 400 })
    }

    const claim = await db.insuranceClaim.findFirst({
      where: { id: claimId, userId: user.id },
    })
    if (!claim) {
      return NextResponse.json({ error: 'Réclamation non trouvée' }, { status: 404 })
    }

    const assessment = await db.damageAssessment.findFirst({
      where: { claimId },
    })

    if (!assessment) {
      return NextResponse.json({
        message: 'Aucune évaluation de dommages trouvée pour cette réclamation',
        evaluation: null,
      })
    }

    return NextResponse.json({ evaluation: assessment })
  } catch (error) {
    console.error('[Damage GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Create DamageAssessment for a claim ───────────────
export async function POST(req: NextRequest) {
  try {
    const user = await db.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!user) {
      return NextResponse.json({ error: 'Aucun utilisateur trouvé' }, { status: 404 })
    }

    const body = await req.json()
    const {
      claimId,
      bumperScore,
      doorsScore,
      hoodScore,
      windshieldScore,
      lightsScore,
      wheelsScore,
      chassisScore,
      photos,
    } = body

    if (!claimId) {
      return NextResponse.json({ error: 'claimId requis' }, { status: 400 })
    }

    const claim = await db.insuranceClaim.findFirst({
      where: { id: claimId, userId: user.id },
    })
    if (!claim) {
      return NextResponse.json({ error: 'Réclamation non trouvée' }, { status: 404 })
    }

    const scores: Record<string, number> = {}
    const fields = ['bumperScore', 'doorsScore', 'hoodScore', 'windshieldScore', 'lightsScore', 'wheelsScore', 'chassisScore'] as const
    let scoreCount = 0
    let scoreSum = 0

    for (const field of fields) {
      const val = body[field]
      if (val !== undefined && val !== null) {
        const num = parseFloat(val)
        if (!isNaN(num) && num >= 0 && num <= 100) {
          scores[field] = num
          scoreCount++
          scoreSum += num
        }
      }
    }

    if (scoreCount === 0) {
      return NextResponse.json({ error: 'Au moins un score de dommage requis (0-100)' }, { status: 400 })
    }

    const avg = scoreSum / scoreCount
    const overallSeverity = computeSeverity(avg)
    const estimatedRepairCost = REPAIR_COST[overallSeverity]
    const estimatedRepairDuration = REPAIR_DURATION[overallSeverity]

    // Build replacement parts list from scores below 50
    const replacementParts: string[] = []
    for (const [key, value] of Object.entries(scores)) {
      if (value < 50) {
        replacementParts.push(PART_CATALOG[key] || key)
      }
    }

    const assessment = await db.damageAssessment.create({
      data: {
        claimId,
        bumperScore: scores.bumperScore ?? null,
        doorsScore: scores.doorsScore ?? null,
        hoodScore: scores.hoodScore ?? null,
        windshieldScore: scores.windshieldScore ?? null,
        lightsScore: scores.lightsScore ?? null,
        wheelsScore: scores.wheelsScore ?? null,
        chassisScore: scores.chassisScore ?? null,
        overallSeverity,
        estimatedRepairCost,
        estimatedRepairDuration,
        replacementParts: JSON.stringify(replacementParts),
        photos: photos ? JSON.stringify(photos) : null,
      },
    })

    return NextResponse.json({
      evaluation: assessment,
      piecesDeRemplacement: replacementParts,
      message: 'Évaluation des dommages créée avec succès',
    }, { status: 201 })
  } catch (error) {
    console.error('[Damage POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
