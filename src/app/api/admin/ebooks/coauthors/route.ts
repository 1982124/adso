import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth, getUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const canManage = (role: string) => ['admin', 'super_admin'].includes(role);

export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canManage(getUserRole(session as any))) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  const ebookId = request.nextUrl.searchParams.get('ebookId');
  if (!ebookId) return NextResponse.json({ error: 'ebookId requis' }, { status: 400 });
  const rows = await db.$queryRaw(Prisma.sql`
    SELECT c."id", c."ebookId", c."userId", c."email", c."displayName", c."role", c."canViewSales", c."canViewOrders", c."canViewCustomerData", c."canManageProduct", c."canAccessFunds", c."status", u."name" AS "accountName"
    FROM "EbookCoauthor" c LEFT JOIN "User" u ON u."id" = c."userId"
    WHERE c."ebookId" = ${ebookId} ORDER BY c."createdAt" ASC
  `);
  return NextResponse.json({ coauthors: rows });
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canManage(getUserRole(session as any))) return NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 });
  try {
    const body = await request.json();
    const ebookId = String(body?.ebookId ?? '').trim();
    const displayName = String(body?.displayName ?? '').trim();
    const email = body?.email ? String(body.email).trim().toLowerCase() : null;
    if (!ebookId || !displayName) return NextResponse.json({ error: 'ebookId et nom du coauteur requis' }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    const count = await db.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`SELECT COUNT(*)::bigint AS count FROM "EbookCoauthor" WHERE "ebookId"=${ebookId}`);
    if (Number(count[0]?.count ?? 0) >= 2) return NextResponse.json({ error: 'Maximum de 2 coauteurs atteint. ADSO accepte 1 auteur principal + 2 coauteurs.' }, { status: 409 });
    const user = email ? await db.user.findUnique({ where: { email }, select: { id: true, name: true } }) : null;
    const id = crypto.randomUUID();
    await db.$executeRaw(Prisma.sql`
      INSERT INTO "EbookCoauthor" ("id","ebookId","userId","email","displayName","role","canViewSales","canViewOrders","canViewCustomerData","canManageProduct","canAccessFunds","status")
      VALUES (${id},${ebookId},${user?.id ?? null},${email},${displayName},'coauthor',TRUE,TRUE,FALSE,FALSE,FALSE,${user ? 'active' : 'pending'})
    `);
    return NextResponse.json({ id, status: user ? 'active' : 'pending', canAccessFunds: false }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Ajout du coauteur impossible' }, { status: 400 });
  }
}
