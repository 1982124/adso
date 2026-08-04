import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── Helper: get demo user ───────────────────────────────
async function getDemoUser() {
  return db.user.findFirst({ orderBy: { createdAt: 'asc' } })
}

// ─── GET: list reviews for a listing ─────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const listingId = searchParams.get('listingId')

  if (!listingId) {
    return NextResponse.json({ success: false, error: 'listingId requis' }, { status: 400 })
  }

  const reviews = await db.listingReview.findMany({
    where: { listingId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true } } },
  })

  return NextResponse.json({ success: true, data: reviews })
}

// ─── POST: create a review ──────────────────────────────
export async function POST(request: NextRequest) {
  const user = await getDemoUser()
  if (!user) {
    return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  try {
    const body = await request.json()

    if (!body.listingId || !body.rating) {
      return NextResponse.json({ success: false, error: 'listingId et rating requis' }, { status: 400 })
    }

    const rating = Math.min(5, Math.max(1, Number(body.rating)))

    const review = await db.listingReview.create({
      data: {
        userId: user.id,
        listingId: body.listingId,
        rating,
        title: body.title || null,
        comment: body.comment || null,
      },
    })

    // Update listing rating average
    const allReviews = await db.listingReview.findMany({
      where: { listingId: body.listingId },
      select: { rating: true },
    })
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    await db.marketplaceListing.update({
      where: { id: body.listingId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    })

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error('Erreur création avis:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de l\'avis' }, { status: 500 })
  }
}
