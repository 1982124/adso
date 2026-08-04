import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── Category label mapping (DB values → French) ──────────
const CATEGORY_LABELS: Record<string, string> = {
  garage: 'Garages',
  mechanic: 'Mécaniciens',
  parts: 'Pièces détachées',
  accessories: 'Accessoires',
  fuel: 'Carburant',
  charging: 'Bornes de recharge',
  towing: 'Dépannage',
  inspection: 'Contrôle technique',
  insurance: 'Assurances',
  driving_school: 'Auto-école',
  rental: 'Location',
  vehicle_sales: 'Vente de véhicules',
}

// ─── Gradient mapping by category ────────────────────────
const CATEGORY_GRADIENTS: Record<string, string> = {
  garage: 'from-emerald-600/20 to-emerald-800/20',
  mechanic: 'from-blue-600/20 to-blue-800/20',
  parts: 'from-orange-600/20 to-orange-800/20',
  accessories: 'from-pink-600/20 to-pink-800/20',
  fuel: 'from-amber-600/20 to-amber-800/20',
  charging: 'from-cyan-600/20 to-cyan-800/20',
  towing: 'from-red-600/20 to-red-800/20',
  inspection: 'from-yellow-600/20 to-yellow-800/20',
  insurance: 'from-purple-600/20 to-purple-800/20',
  driving_school: 'from-teal-600/20 to-teal-800/20',
  rental: 'from-teal-600/20 to-teal-800/20',
  vehicle_sales: 'from-indigo-600/20 to-indigo-800/20',
}

// ─── Helper: get demo user ───────────────────────────────
async function getDemoUser() {
  return db.user.findFirst({ orderBy: { createdAt: 'asc' } })
}

// ─── GET: list marketplace listings ──────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: Record<string, unknown> = { status: 'active' }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ]
    }

    if (category && category !== 'Tous') {
      // Reverse map French label → DB key
      const dbCategory = Object.entries(CATEGORY_LABELS).find(([, v]) => v === category)?.[0] || category
      where.category = dbCategory
    }

    const listings = await db.marketplaceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { reviews: true, bookings: true } },
      },
      take: 100,
    })

    const formatted = listings.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      category: CATEGORY_LABELS[l.category] || l.category,
      categoryKey: l.category,
      rating: Number(l.rating),
      reviews: l._count.reviews,
      price: l.price ? `${Math.round(l.price).toLocaleString('fr-FR')} ${l.priceUnit === 'hourly' ? 'FCFA/h' : l.priceUnit === 'daily' ? 'FCFA/jour' : l.priceUnit === 'monthly' ? 'FCFA/mois' : l.priceUnit === 'per_service' ? 'FCFA/service' : 'FCFA'}` : 'Sur devis',
      location: l.location,
      city: l.city,
      contactPhone: l.contactPhone,
      contactEmail: l.contactEmail,
      contactWebsite: l.contactWebsite,
      gradient: CATEGORY_GRADIENTS[l.category] || 'from-emerald-600/20 to-emerald-800/20',
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('[GET /api/marketplace] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}

// ─── POST: create a new listing ──────────────────────────
export async function POST(request: NextRequest) {
  const user = await getDemoUser()
  if (!user) {
    return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  try {
    const body = await request.json()

    const listing = await db.marketplaceListing.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        category: body.category || 'garage',
        subcategory: body.subcategory || null,
        price: body.price ?? null,
        priceUnit: body.priceUnit || 'fixed',
        location: body.location || '',
        city: body.city || null,
        contactPhone: body.contactPhone || null,
        contactEmail: body.contactEmail || null,
        contactWebsite: body.contactWebsite || null,
        services: body.services ? JSON.stringify(body.services) : null,
      },
    })

    return NextResponse.json({ success: true, data: listing })
  } catch (error) {
    console.error('Erreur création annonce:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de l\'annonce' }, { status: 500 })
  }
}
