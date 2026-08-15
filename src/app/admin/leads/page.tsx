import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession, getUserRole } from '@/lib/auth';
import { hasMinRole } from '@/lib/rbac';
import { db } from '@/lib/db';

type Lead = { leadId?: string; name?: string; email?: string; phone?: string; company?: string; country?: string; source?: string; offer?: string; status?: string; consent?: boolean; consentAt?: string };

function parseLead(metadata: string): Lead {
  try { return JSON.parse(metadata) as Lead; } catch { return {}; }
}

export default async function AdminLeadsPage() {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user || !hasMinRole(role, 'admin')) redirect('/');

  const events = await db.analyticsEvent.findMany({ where: { eventType: 'lead_created' }, orderBy: { createdAt: 'desc' }, take: 100 });
  const leads = events.map((event) => ({ ...parseLead(event.metadata), createdAt: event.createdAt }));

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/admin" className="text-sm text-emerald-300">← Cockpit Direction</Link><p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">ADSO Lead Tracker</p><h1 className="mt-2 text-3xl font-semibold">Prospects & opportunités</h1><p className="mt-2 text-sm text-slate-400">Les prospects sont enregistrés uniquement après consentement explicite. Données limitées au suivi commercial.</p></div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4"><span className="text-2xl font-semibold">{leads.length}</span><span className="ml-2 text-sm text-slate-300">prospects récents</span></div>
        </header>
        <section className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Prospect</th><th className="px-5 py-4">Pays</th><th className="px-5 py-4">Source</th><th className="px-5 py-4">Offre</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Date</th></tr></thead><tbody className="divide-y divide-white/5">{leads.map((lead, index) => <tr key={lead.leadId || index} className="hover:bg-white/[0.03]"><td className="px-5 py-4"><div className="font-medium">{lead.name || '—'}</div><div className="text-xs text-slate-500">{lead.email || '—'}{lead.phone ? ` · ${lead.phone}` : ''}</div>{lead.company && <div className="text-xs text-slate-500">{lead.company}</div>}</td><td className="px-5 py-4 text-slate-300">{lead.country || '—'}</td><td className="px-5 py-4 text-slate-300">{lead.source || 'website'}</td><td className="px-5 py-4 text-slate-300">{lead.offer || '—'}</td><td className="px-5 py-4"><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">{lead.status || 'new'}</span></td><td className="px-5 py-4 text-slate-500">{new Date(lead.createdAt).toLocaleString('fr-FR')}</td></tr>)}</tbody></table>
          {leads.length === 0 && <p className="p-8 text-center text-slate-500">Aucun prospect capturé pour le moment.</p>}
        </section>
      </div>
    </main>
  );
}
