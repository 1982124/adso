import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserId } from '@/lib/auth'

const CATEGORY_LABELS: Record<string, string> = {
  garage: 'Garages', mechanic: 'Mécaniciens', parts: 'Pièces détachées', accessories: 'Accessoires',
  fuel: 'Carburant', charging: 'Bornes de recharge', towing: 'Dépannage', inspection: 'Contrôle technique',
  insurance: 'Assurances', driving_school: 'Auto-école', rental: 'Location', vehicle_sales: 'Vente de véhicules',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  garage: 'from-emerald-600/20 to-emerald-800/20', mechanic: 'from-blue-600/20 to-blue-800/20', parts: 'from-orange-600/20 to-orange-800/20',
  accessories: 'from-pink-600/20 to-pink-800/20', fuel: 'from-amber-600/20 to-amber-800/20', charging: 'from-cyan-600/20 to-cyan-800/20',
  towing: 'from-red-600/20 to-red-800/20', inspection: 'from-yellow-600/20 to-yellow-800/20', insurance: 'from-purple-600/20 to-purple-800/20',
  driving_school: 'from-teal-600/20 to-teal-800/20', rental: 'from-teal-600/20 to-teal-800/20', vehicle_sales: 'from-indigo-600/20 to-indigo-800/20',
}

function formatPrice(price: unknown, unit: unknown): string {
  const numeric = typeof price === 'number' ? price : Number(price)
  if (!Number.isFinite(numeric)) return 'Sur devis'
  const suffix = unit === 'hourly' ? 'FCFA/h' : unit === 'daily' ? 'FCFA/jour' : unit === 'monthly' ? 'FCFA/mois' : unit === 'per_service' ? 'FCFA/service' : 'FCFA'
  return `${Math.round(numeric).toLocaleString('fr-FR')} ${suffix}`
}

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
      const dbCategory = Object.entries(CATEGORY_LABELS).find(([, v]) => v === category)?.[0] || category
      where.category = dbCategory
    }

    const listings = await db.marketplaceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { reviews: true, bookings: true } } },
      take: 100,
    })

    const formatted = listings.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      category: CATEGORY_LABELS[l.category] || l.category,
      categoryKey: l.category,
      rating: Number.isFinite(Number(l.rating)) ? Number(l.rating) : 0,
      reviews: l._count.reviews,
      price: formatPrice(l.price, l.priceUnit),
      location: l.location,
      city: l.city,
      country: l.country,
      contactPhone: l.contactPhone,
      contactEmail: l.contactEmail,
      contactWebsite: l.contactWebsite,
      images: safeJsonArray(l.images),
      gradient: CATEGORY_GRADIENTS[l.category] || 'from-emerald-600/20 to-emerald-800/20',
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('[GET /api/marketplace] Error', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth()
    if (authError) return authError
    const userId = getUserId(session)!
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })

    const body = await request.json()
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const category = String(body.category || 'garage').trim()
    if (!title || !description) return NextResponse.json({ success: false, error: 'Titre et description sont requis' }, { status: 400 })
    if (!Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, category)) return NextResponse.json({ success: false, error: 'Catégorie marketplace invalide' }, { status: 400 })

    const numericPrice = body.price === '' || body.price == null ? null : Number(body.price)
    if (numericPrice != null && !Number.isFinite(numericPrice)) return NextResponse.json({ success: false, error: 'Prix invalide' }, { status: 400 })

    const imageUrls = Array.isArray(body.images)
      ? body.images.filter((url: unknown): url is string => typeof url === 'string' && /^https?:\/\//i.test(url)).slice(0, 6)
      : []

    const listing = await db.marketplaceListing.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        subcategory: body.subcategory ? String(body.subcategory) : null,
        price: numericPrice,
        priceUnit: body.priceUnit || 'fixed',
        location: String(body.location || ''),
        city: body.city ? String(body.city) : null,
        country: body.country ? String(body.country) : 'ML',
        contactPhone: body.contactPhone ? String(body.contactPhone) : null,
        contactEmail: body.contactEmail ? String(body.contactEmail) : null,
        contactWebsite: body.contactWebsite ? String(body.contactWebsite) : null,
        services: Array.isArray(body.services) ? JSON.stringify(body.services.slice(0, 20)) : null,
        images: imageUrls.length ? JSON.stringify(imageUrls) : null,
        status: 'active',
      },
    })

    return NextResponse.json({ success: true, data: listing }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/marketplace] Error', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de l’annonce' }, { status: 500 })
  }
}

function safeJsonArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}
