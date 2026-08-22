import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession, getUserRole } from '@/lib/auth';
import { hasMinRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

type Row = { ebookId: string; title: string; eventType: string; count: bigint };

type Sales = { ebookId: string; title: string; orders: bigint; paid: bigint; revenue: number };

export default async function EbookAnalyticsPage() {
  const session = await getSession();
  if (!session?.user) redirect('/admin/login');
  if (!hasMinRole(getUserRole(session), 'admin')) redirect('/');

  const events = await db.$queryRaw<Row[]>(Prisma.sql`
    SELECT e."id" AS "ebookId", e."title", t."eventType", COUNT(*)::bigint AS "count"
    FROM "EbookTrackingEvent" t
    JOIN "Ebook" e ON e."id" = t."ebookId"
    WHERE t."createdAt" >= CURRENT_TIMESTAMP - INTERVAL '30 days'
    GROUP BY e."id", e."title", t."eventType"
    ORDER BY COUNT(*) DESC
    LIMIT 100
  `);
  const sales = await db.$queryRaw<Sales[]>(Prisma.sql`
    SELECT e."id" AS "ebookId", e."title",
      COUNT(o."id")::bigint AS "orders",
      COUNT(*) FILTER (WHERE o."status" = 'PAID')::bigint AS "paid",
      COALESCE(SUM(CASE WHEN o."status" = 'PAID' THEN o."amountMinor" ELSE 0 END), 0)::double precision AS "revenue"
    FROM "Ebook" e
    LEFT JOIN "EbookOrder" o ON o."ebookId" = e."id"
    GROUP BY e."id", e."title"
    ORDER BY "revenue" DESC, "paid" DESC
    LIMIT 50
  `);

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <header>
          <Link href="/admin/ebooks" className="text-sm text-emerald-300 hover:underline">← Gestion des E-books</Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · E-books · Tracking</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Performance commerciale</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Événements de funnel des 30 derniers jours et commandes réelles enregistrées côté serveur. Aucun statut de paiement n'est déduit d'un simple clic.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="font-semibold">Funnel observé</h2>
            <div className="mt-4 space-y-2">
              {events.length === 0 ? <p className="text-sm text-slate-500">Aucun événement enregistré pour le moment.</p> : events.map((row) => <div key={`${row.ebookId}-${row.eventType}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3"><div><p className="text-sm font-medium">{row.title}</p><p className="text-xs text-slate-500">{row.eventType}</p></div><strong>{Number(row.count).toLocaleString('fr-FR')}</strong></div>)}
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
            <h2 className="font-semibold">Ventes vérifiées</h2>
            <div className="mt-4 space-y-2">
              {sales.length === 0 ? <p className="text-sm text-slate-500">Aucune commande enregistrée.</p> : sales.map((row) => <div key={row.ebookId} className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3"><div className="flex items-center justify-between gap-4"><p className="text-sm font-medium">{row.title}</p><strong>{Number(row.paid).toLocaleString('fr-FR')} payées</strong></div><p className="mt-1 text-xs text-slate-500">{Number(row.orders).toLocaleString('fr-FR')} commandes · {Number(row.revenue).toLocaleString('fr-FR')} unités monétaires mineures</p></div>)}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
