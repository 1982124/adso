import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

// ─── GET: List all insurance partners ───────────────────────
export async function GET() {
  try {
    const { error } = await requireRole('insurer');
    if (error) return error;

    const partners = await db.insurancePartner.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ partenaires: partners })
  } catch (error) {
    console.error('[Partners GET]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: Create a new partner ─────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireRole('admin');
    if (error) return error;

    const body = await req.json()
    const { name, code, country, contactEmail, contactPhone, commissionRate } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'Nom et code requis' }, { status: 400 })
    }

    // Check unique code
    const existing = await db.insurancePartner.findFirst({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'Un partenaire avec ce code existe déjà' }, { status: 409 })
    }

    const partner = await db.insurancePartner.create({
      data: {
        name,
        code,
        country: country || 'FR',
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        commissionRate: commissionRate !== undefined ? parseFloat(commissionRate) : 0,
      },
    })

    return NextResponse.json({ partenaire: partner, message: 'Partenaire créé avec succès' }, { status: 201 })
  } catch (error) {
    console.error('[Partners POST]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
