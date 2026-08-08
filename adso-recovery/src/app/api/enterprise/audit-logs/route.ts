import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { error } = await requireRole('admin')
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const userId = searchParams.get('userId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where: Record<string, unknown> = {}
    if (action) where.action = action
    if (resource) where.resource = resource
    if (userId) where.userId = userId
    if (from || to) {
      const dateFilter: Record<string, unknown> = {}
      if (from) dateFilter.gte = new Date(from)
      if (to) dateFilter.lte = new Date(to)
      where.createdAt = dateFilter
    }

    const logs = await db.auditLogEntry.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error('[GET /api/enterprise/audit-logs] Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des journaux d\'audit' },
      { status: 500 }
    )
  }
}
