import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession, getUserRole } from '@/lib/auth';
import { hasMinRole } from '@/lib/rbac';
import { db } from '@/lib/db';

type Lead = { leadId?: string; name?: string; email?: string; phone?: string; company?: string; country?: string; source?: string; offer?: string; status?: string; stage?: string; score?: number; priority?: 'high' | 'medium' | 'low'; consent?: boolean; consentAt?: string };

function parseLead(metadata: string): Lead {
  try { return JSON.parse(metadata) as Lead; } catch { return {}; }
}

function priorityClass(priority?: Lead['priority']) {
  if (priority === 'high') return 'border-rose-400/20 bg-rose-400/10 text-rose-300';
  if (priority === 'medium') return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
  return 'border-slate-400/20 bg-slate-400/10 text-slate-300';
}

export default async function AdminLeadsPage() {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user || !hasMinRole(role, 'admin')) redirect('/');

  const events = await db.analyticsEvent.findMany({ where: { eventType: 'lead_created' }, orderBy: { createdAt: 'desc' }, take: 200 });
  const leads = events.map((event) => ({ ...parseLead(event.metadata), createdAt: event.createdAt }));
  const high = leads.filter((lead) => lead.priority === 'high').length;
  const qualified = leads.filter((lead) => (lead.score ?? 0) >= 45).length;
  const countries = new Set(leads.map((lead) => lead.country).filter(Boolean)).size;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/admin" className="text-sm text-emerald-300">← Cockpit Direction</Link><p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">ADSO Lead Tracker</p><h1 className="mt-2 text-3xl font-semibold">Prospects & opportunités</h1><p className="mt-2 max-w-3xl text-sm text-slate-400">Qualification déterministe à partir des informations volontairement fournies. Le score aide à prioriser ; il ne prédit pas un achat.</p></div>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Prospects', leads.length], ['Priorité haute', high], ['Qualifiés', qualified], ['Pays représentés', countries]].map(([label, value]) => <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}
        </section>
        <section className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[1100px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Prospect</th><th className="px-5 py-4">Pays</th><th className="px-5 py-4">Source / offre</th><th className="px-5 py-4">Score</th><th className="px-5 py-4">Priorité</th><th className="px-5 py-4">Étape</th><th className="px-5 py-4">Date</th></tr></thead><tbody className="divide-y divide-white/5">{leads.map((lead, index) => <tr key={lead.leadId || index} className="hover:bg-white/[0.03]"><td className="px-5 py-4"><div className="font-medium">{lead.name || '—'}</div><div className="text-xs text-slate-500">{lead.email || '—'}{lead.phone ? ` · ${lead.phone}` : ''}</div>{lead.company && <div className="text-xs text-slate-500">{lead.company}</div>}</td><td className="px-5 py-4 text-slate-300">{lead.country || '—'}</td><td className="px-5 py-4"><div className="text-slate-300">{lead.source || 'website'}</div><div className="text-xs text-slate-500">{lead.offer || '—'}</div></td><td className="px-5 py-4 font-semibold">{typeof lead.score === 'number' ? `${lead.score}/100` : '—'}</td><td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs ${priorityClass(lead.priority)}`}>{lead.priority || 'low'}</span></td><td className="px-5 py-4 text-slate-300">{lead.stage || lead.status || 'new'}</td><td className="px-5 py-4 text-slate-500">{new Date(lead.createdAt).toLocaleString('fr-FR')}</td></tr>)}</tbody></table>
          {leads.length === 0 && <p className="p-8 text-center text-slate-500">Aucun prospect capturé pour le moment.</p>}
        </section>
      </div>
    </main>
  );
}
