import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function canManage(role: unknown) {
  return ['admin', 'super_admin', 'instructor'].includes(String(role ?? 'student'));
}

async function guard() {
  const { error, session } = await requireAuth();
  if (error) return { error };
  if (!canManage((session?.user as Record<string, unknown> | undefined)?.role)) {
    return { error: NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const gate = await guard();
  if (gate.error) return gate.error;
  try {
    const rows = await db.$queryRaw(Prisma.sql`
      SELECT c."id", c."slug", c."title", c."description", c."coverUrl", c."status",
             c."targetAudience", c."language", c."createdAt", c."updatedAt",
             COALESCE(json_agg(json_build_object(
               'id', i."id", 'ebookId', i."ebookId", 'position', i."position",
               'title', e."title", 'slug', e."slug", 'author', e."author", 'isPublished', e."isPublished"
             ) ORDER BY i."position") FILTER (WHERE i."id" IS NOT NULL), '[]') AS "items",
             COALESCE(json_agg(json_build_object(
               'id', cc."id", 'name', cc."name", 'email', cc."email", 'role', cc."role", 'position', cc."position"
             ) ORDER BY cc."position") FILTER (WHERE cc."id" IS NOT NULL), '[]') AS "contributors"
      FROM "EbookCollection" c
      LEFT JOIN "EbookCollectionItem" i ON i."collectionId" = c."id"
      LEFT JOIN "Ebook" e ON e."id" = i."ebookId"
      LEFT JOIN "EbookCollectionContributor" cc ON cc."collectionId" = c."id"
      GROUP BY c."id"
      ORDER BY c."createdAt" DESC
    `);
    return NextResponse.json({ collections: rows });
  } catch (error) {
    console.error('[GET /api/admin/ebooks/collections]', error);
    return NextResponse.json({ error: 'Impossible de charger les collections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await guard();
  if (gate.error) return gate.error;
  try {
    const body = await request.json();
    const title = String(body?.title ?? '').trim();
    const description = String(body?.description ?? '').trim();
    const slug = String(body?.slug ?? title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const coverUrl = body?.coverUrl ? String(body.coverUrl).trim() : null;
    const targetAudience = body?.targetAudience ? String(body.targetAudience).trim() : null;
    const language = String(body?.language ?? 'fr').trim().toLowerCase();
    const status = ['draft', 'published', 'archived'].includes(String(body?.status)) ? String(body.status) : 'draft';
    const ebookIds = Array.isArray(body?.ebookIds) ? body.ebookIds.map((id: unknown) => String(id)).filter(Boolean) : [];
    const contributors = Array.isArray(body?.contributors) ? body.contributors : [];

    if (!title || !description || !slug) return NextResponse.json({ error: 'Titre, description et slug sont requis' }, { status: 400 });
    if (ebookIds.length > 0) {
      const count = await db.$queryRaw<{ count: bigint }[]>(Prisma.sql`SELECT COUNT(*)::bigint AS count FROM "Ebook" WHERE "id" IN (${Prisma.join(ebookIds)})`);
      if (Number(count[0]?.count ?? 0) !== ebookIds.length) return NextResponse.json({ error: 'Un ou plusieurs eBooks sont introuvables' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await db.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`INSERT INTO "EbookCollection" ("id","slug","title","description","coverUrl","status","targetAudience","language") VALUES (${id},${slug},${title},${description},${coverUrl},${status},${targetAudience},${language})`);
      for (let position = 0; position < ebookIds.length; position++) {
        await tx.$executeRaw(Prisma.sql`INSERT INTO "EbookCollectionItem" ("id","collectionId","ebookId","position") VALUES (${crypto.randomUUID()},${id},${ebookIds[position]},${position}) ON CONFLICT ("collectionId","ebookId") DO UPDATE SET "position"=EXCLUDED."position"`);
      }
      for (let position = 0; position < contributors.length; position++) {
        const contributor = contributors[position] ?? {};
        const name = String(contributor.name ?? '').trim();
        if (!name) continue;
        await tx.$executeRaw(Prisma.sql`INSERT INTO "EbookCollectionContributor" ("id","collectionId","name","email","role","position") VALUES (${crypto.randomUUID()},${id},${name},${contributor.email ? String(contributor.email).trim() : null},${contributor.role ? String(contributor.role).trim() : 'author'},${position})`);
      }
    });
    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/ebooks/collections]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Création de la collection impossible' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const gate = await guard();
  if (gate.error) return gate.error;
  try {
    const body = await request.json();
    const id = String(body?.id ?? '').trim();
    if (!id) return NextResponse.json({ error: 'Collection id requis' }, { status: 400 });
    const title = body?.title !== undefined ? String(body.title).trim() : undefined;
    const description = body?.description !== undefined ? String(body.description).trim() : undefined;
    const status = body?.status !== undefined && ['draft', 'published', 'archived'].includes(String(body.status)) ? String(body.status) : undefined;
    const ebookIds = Array.isArray(body?.ebookIds) ? body.ebookIds.map((x: unknown) => String(x)).filter(Boolean) : undefined;
    const contributors = Array.isArray(body?.contributors) ? body.contributors : undefined;

    await db.$transaction(async (tx) => {
      if (title !== undefined || description !== undefined || status !== undefined) {
        await tx.$executeRaw(Prisma.sql`UPDATE "EbookCollection" SET "title"=COALESCE(${title ?? null},"title"), "description"=COALESCE(${description ?? null},"description"), "status"=COALESCE(${status ?? null},"status"), "updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${id}`);
      }
      if (ebookIds !== undefined) {
        await tx.$executeRaw(Prisma.sql`DELETE FROM "EbookCollectionItem" WHERE "collectionId"=${id}`);
        for (let position = 0; position < ebookIds.length; position++) {
          await tx.$executeRaw(Prisma.sql`INSERT INTO "EbookCollectionItem" ("id","collectionId","ebookId","position") VALUES (${crypto.randomUUID()},${id},${ebookIds[position]},${position})`);
        }
      }
      if (contributors !== undefined) {
        await tx.$executeRaw(Prisma.sql`DELETE FROM "EbookCollectionContributor" WHERE "collectionId"=${id}`);
        for (let position = 0; position < contributors.length; position++) {
          const contributor = contributors[position] ?? {};
          const name = String(contributor.name ?? '').trim();
          if (!name) continue;
          await tx.$executeRaw(Prisma.sql`INSERT INTO "EbookCollectionContributor" ("id","collectionId","name","email","role","position") VALUES (${crypto.randomUUID()},${id},${name},${contributor.email ? String(contributor.email).trim() : null},${contributor.role ? String(contributor.role).trim() : 'author'},${position})`);
        }
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[PATCH /api/admin/ebooks/collections]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Mise à jour impossible' }, { status: 400 });
  }
}
