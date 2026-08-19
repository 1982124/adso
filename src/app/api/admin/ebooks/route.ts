import { del, put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, getUserRole } from '@/lib/auth';
import { hasMinRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return { error: NextResponse.json({ error: 'Authentification requise' }, { status: 401 }) };
  const role = getUserRole(session);
  if (!hasMinRole(role, 'admin')) return { error: NextResponse.json({ error: 'Droits administrateur requis' }, { status: 403 }) };
  return { session, role };
}

function isAllowedEbook(file: File) {
  return file.type === 'application/pdf' || file.type === 'application/epub+zip';
}

async function hasValidSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const pdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
  const zip = bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07);
  return (file.type === 'application/pdf' && pdf) || (file.type === 'application/epub+zip' && zip);
}

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;
  try {
    const [books, sales] = await Promise.all([
      db.$queryRaw<Array<Record<string, unknown>>>(`
        SELECT e."id", e."slug", e."title", e."author", e."coverUrl", e."price", e."currency",
               e."isPublished", e."createdAt",
               COALESCE((SELECT COUNT(*) FROM "EbookOrder" o WHERE o."ebookId" = e."id" AND o."status" = 'paid'), 0) AS "sales",
               COALESCE((SELECT SUM(o."amount") FROM "EbookOrder" o WHERE o."ebookId" = e."id" AND o."status" = 'paid'), 0) AS "revenue"
        FROM "Ebook" e ORDER BY e."createdAt" DESC LIMIT 200
      `),
      db.$queryRaw<Array<{ orders: bigint; revenue: number | null }>>(`
        SELECT COUNT(*) AS orders, COALESCE(SUM("amount"), 0) AS revenue
        FROM "EbookOrder" WHERE "status" = 'paid'
      `),
    ]);
    return NextResponse.json({ books, sales: { orders: Number(sales[0]?.orders ?? 0), revenue: Number(sales[0]?.revenue ?? 0) } });
  } catch (error) {
    console.error('[admin/ebooks GET]', error);
    return NextResponse.json({ error: 'Impossible de charger le dashboard eBooks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  let ebookBlobUrl: string | null = null;
  let coverBlobUrl: string | null = null;

  try {
    const form = await request.formData();
    const file = form.get('file');
    const cover = form.get('cover');
    const title = String(form.get('title') ?? '').trim();
    const author = String(form.get('author') ?? '').trim();
    const description = String(form.get('description') ?? '').trim();
    const slug = String(form.get('slug') ?? '').trim().toLowerCase();
    const price = Number(form.get('price') ?? 0);
    const currency = String(form.get('currency') ?? 'XOF').trim().toUpperCase();
    const isPublished = String(form.get('isPublished') ?? 'false') === 'true';

    if (!title || !author || !description || !slug || !file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Titre, auteur, description, slug et fichier eBook sont requis' }, { status: 400 });
    }
    if (!/^[-a-z0-9]+$/.test(slug)) return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
    if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
    if (!isAllowedEbook(file)) return NextResponse.json({ error: 'Format eBook accepté : PDF ou EPUB' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'Fichier eBook trop volumineux (50 Mo maximum)' }, { status: 400 });
    if (!(await hasValidSignature(file))) return NextResponse.json({ error: 'Le contenu du fichier ne correspond pas à son format déclaré' }, { status: 400 });

    if (cover instanceof File && cover.size > 0) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(cover.type)) return NextResponse.json({ error: 'Couverture : JPG, PNG ou WebP uniquement' }, { status: 400 });
      if (cover.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Couverture trop volumineuse (5 Mo maximum)' }, { status: 400 });
    }

    const existing = await db.$queryRaw<Array<{ id: string }>>('SELECT "id" FROM "Ebook" WHERE "slug"=$1 LIMIT 1', slug);
    if (existing[0]) return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 409 });

    const ebookId = crypto.randomUUID();
    const productId = crypto.randomUUID();
    const ebookBlob = await put(`ebooks/${ebookId}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file, { access: 'private', addRandomSuffix: true });
    ebookBlobUrl = ebookBlob.url;

    let coverUrl: string | null = null;
    if (cover instanceof File && cover.size > 0) {
      const coverBlob = await put(`ebook-covers/${ebookId}/${cover.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, cover, { access: 'public', addRandomSuffix: true });
      coverBlobUrl = coverBlob.url;
      coverUrl = coverBlob.url;
    }

    await db.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `INSERT INTO "Ebook" ("id","slug","title","description","author","coverUrl","storageKey","price","currency","isPublished") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        ebookId, slug, title, description, author, coverUrl, ebookBlob.pathname, price, currency, isPublished,
      );
      await tx.$executeRawUnsafe(
        `INSERT INTO "EbookProduct" ("id","ebookId","kind","price","currency","isPublished") VALUES ($1,$2,'ebook',$3,$4,$5)`,
        productId, ebookId, price, currency, isPublished,
      );
    });

    return NextResponse.json({ ok: true, id: ebookId, slug, url: `/ebooks/${slug}` }, { status: 201 });
  } catch (error) {
    if (coverBlobUrl) await del(coverBlobUrl).catch(() => undefined);
    if (ebookBlobUrl) await del(ebookBlobUrl).catch(() => undefined);
    console.error('[admin/ebooks POST]', error);
    return NextResponse.json({ error: 'Publication impossible' }, { status: 500 });
  }
}
