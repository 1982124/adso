import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

const PLATFORMS = new Set(['facebook', 'linkedin', 'x', 'whatsapp', 'copy', 'native'])
const COUNTRY_RE = /^[A-Z]{2}$/

async function ensureTable() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ShareEvent" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "platform" TEXT NOT NULL,
      "country" TEXT,
      "path" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ShareEvent_createdAt_idx" ON "ShareEvent"("createdAt")')
  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ShareEvent_platform_idx" ON "ShareEvent"("platform")')
  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ShareEvent_country_idx" ON "ShareEvent"("country")')
}

function isoCountry(request: NextRequest, supplied: unknown) {
  const value = String(supplied || request.headers.get('x-vercel-ip-country') || request.headers.get('x-country') || '').trim().toUpperCase()
  return COUNTRY_RE.test(value) ? value : null
}

function id() {
  return `${Date.now()}-${crypto.randomUUID()}`
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable()
    const body = await request.json().catch(() => ({}))
    const platform = String(body.platform || '').trim().toLowerCase()
    if (!PLATFORMS.has(platform)) return NextResponse.json({ error: 'Plateforme de partage invalide' }, { status: 400 })

    const path = String(body.path || '/').trim().slice(0, 500)
    const country = isoCountry(request, body.country)
    await db.$executeRawUnsafe(
      'INSERT INTO "ShareEvent" ("id", "platform", "country", "path", "createdAt") VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      id(), platform, country, path,
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/analytics/shares]', error)
    return NextResponse.json({ error: 'Impossible d’enregistrer le partage' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { error } = await requireRole('admin')
  if (error) return error

  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')?.trim().toUpperCase()
    const platform = searchParams.get('platform')?.trim().toLowerCase()
    const filters: string[] = []
    const filterParams: string[] = []
    if (country && COUNTRY_RE.test(country)) { filters.push('"country" = ?'); filterParams.push(country) }
    if (platform && PLATFORMS.has(platform)) { filters.push('"platform" = ?'); filterParams.push(platform) }
    const clause = filters.length ? ` AND ${filters.join(' AND ')}` : ''

    const [rows, totals, daily, monthly, annual] = await Promise.all([
      db.$queryRawUnsafe<Array<{ platform: string; country: string | null; total: number }>>(
        `SELECT "platform", "country", COUNT(*) AS "total" FROM "ShareEvent" WHERE 1=1${clause} GROUP BY "platform", "country" ORDER BY "total" DESC`,
        ...filterParams,
      ),
      db.$queryRawUnsafe<Array<{ total: number }>>(`SELECT COUNT(*) AS "total" FROM "ShareEvent" WHERE 1=1${clause}`, ...filterParams),
      db.$queryRawUnsafe<Array<{ total: number }>>(`SELECT COUNT(*) AS "total" FROM "ShareEvent" WHERE "createdAt" >= datetime('now','start of day')${clause}`, ...filterParams),
      db.$queryRawUnsafe<Array<{ total: number }>>(`SELECT COUNT(*) AS "total" FROM "ShareEvent" WHERE "createdAt" >= datetime('now','start of month')${clause}`, ...filterParams),
      db.$queryRawUnsafe<Array<{ total: number }>>(`SELECT COUNT(*) AS "total" FROM "ShareEvent" WHERE "createdAt" >= datetime('now','start of year')${clause}`, ...filterParams),
    ])

    return NextResponse.json({
      periods: {
        daily: Number(daily[0]?.total || 0),
        monthly: Number(monthly[0]?.total || 0),
        annual: Number(annual[0]?.total || 0),
        total: Number(totals[0]?.total || 0),
      },
      byPlatform: rows.reduce<Record<string, number>>((acc, row) => { acc[row.platform] = (acc[row.platform] || 0) + Number(row.total); return acc }, {}),
      byCountry: rows.reduce<Record<string, number>>((acc, row) => { if (row.country) acc[row.country] = (acc[row.country] || 0) + Number(row.total); return acc }, {}),
      byPlatformAndCountry: rows.map((row) => ({ platform: row.platform, country: row.country, total: Number(row.total) })),
    })
  } catch (error) {
    console.error('[GET /api/analytics/shares]', error)
    return NextResponse.json({ error: 'Erreur lors du chargement des partages' }, { status: 500 })
  }
}
