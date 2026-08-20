import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });

  const email = String((session?.user as Record<string, unknown> | undefined)?.email ?? '').trim().toLowerCase();
  if (email) {
    await db.$executeRaw(Prisma.sql`
      UPDATE "EbookCoauthor"
      SET "userId"=${userId},"status"='active',"updatedAt"=CURRENT_TIMESTAMP
      WHERE "userId" IS NULL AND lower("email")=${email} AND "status"='pending'
    `);
  }

  const rows = await db.$queryRaw<Array<any>>(Prisma.sql`
    SELECT c."ebookId", e."title", e."slug", c."displayName", c."status",
      COALESCE(SUM(CASE WHEN o."status"='PAID' THEN 1 ELSE 0 END),0)::int AS "paidSales",
      COALESCE(SUM(CASE WHEN o."status"='PAID' THEN o."amountMinor" ELSE 0 END),0)::bigint AS "grossAmountMinor",
      e."currency"
    FROM "EbookCoauthor" c
    JOIN "Ebook" e ON e."id"=c."ebookId"
    LEFT JOIN "EbookOrder" o ON o."ebookId"=e."id"
    WHERE c."userId"=${userId} AND c."status"='active' AND c."canViewSales"=TRUE
    GROUP BY c."ebookId", e."title", e."slug", c."displayName", c."status", e."currency"
    ORDER BY e."title" ASC
  `);
  return NextResponse.json({
    books: rows.map((r) => ({ ...r, grossAmountMinor: Number(r.grossAmountMinor ?? 0), canAccessFunds: false, canWithdraw: false })),
    permissions: { viewSales: true, viewOrders: true, viewCustomerData: false, manageProduct: false, accessFunds: false, withdraw: false }
  });
}
