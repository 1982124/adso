'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Brain, Car, CheckCircle2, FileText, Gauge, ShieldCheck, Share2, Sparkles, Target, Trophy, Wrench } from 'lucide-react';

interface CockpitData {
  user: { name: string; country: string; subscription: string; role: string };
  cockpit: { label: string; objective: string; modules: string[] };
  metrics: Record<string, number>;
  journal: Array<{ id: string; title: string; body: string; mood: string | null; createdAt: string }>;
}

const metricLabels: Record<string, string> = {
  activeCourses: 'Parcours actifs', completedCourses: 'Parcours terminés', quizzes: 'Quiz réalisés', averageScore: 'Score moyen', certifications: 'Certifications',
  drivingSessions: 'Sessions de conduite', distanceKm: 'Distance (km)', diagnostics: 'Diagnostics', fleetDrivers: 'Conducteurs', maintenanceRecords: 'Interventions', policies: 'Polices', claims: 'Sinistres',
};

function iconFor(module: string) {
  const value = module.toLowerCase();
  if (value.includes('journal') || value.includes('note')) return FileText;
  if (value.includes('conduite') || value.includes('véhicule')) return Car;
  if (value.includes('diagnostic') || value.includes('maintenance')) return Wrench;
  if (value.includes('sécurité') || value.includes('risque')) return ShieldCheck;
  if (value.includes('ia') || value.includes('coach')) return Brain;
  if (value.includes('progression') || value.includes('performance')) return Gauge;
  if (value.includes('examen') || value.includes('évaluation')) return Target;
  if (value.includes('certification')) return Trophy;
  return BookOpen;
}

export default function CockpitPage() {
  const [data, setData] = useState<CockpitData | null>(null);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function load() {
    const response = await fetch('/api/me/cockpit', { cache: 'no-store' });
    if (!response.ok) throw new Error('Connexion requise');
    setData(await response.json());
  }

  useEffect(() => { load().catch((e) => setError(e.message)); }, []);

  async function addJournalEntry(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    try {
      const response = await fetch('/api/me/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, body }) });
      if (!response.ok) throw new Error('Enregistrement impossible');
      setTitle(''); setBody(''); await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur'); }
    finally { setSaving(false); }
  }

  async function shareProgress() {
    if (!data || sharing) return;
    setSharing(true);
    const text = `Je progresse sur ADSO — ${data.cockpit.label}. ${data.metrics.averageScore ? `Score moyen : ${data.metrics.averageScore}%.` : ''}`;
    try {
      const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
      const platform = canNativeShare ? 'native' : 'copy_link';
      if (canNativeShare) await navigator.share({ title: 'Ma progression ADSO', text, url: window.location.origin + '/cockpit' });
      else await navigator.clipboard.writeText(`${text} ${window.location.origin}/cockpit`);
      await fetch('/api/analytics/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, country: data.user.country, contentType: 'progress', path: '/cockpit' }) });
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError('Partage impossible');
    } finally { setSharing(false); }
  }

  if (error && !data) return <main className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="text-2xl font-bold">Cockpit ADSO</h1><p className="mt-3 text-gray-500">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-7xl px-6 py-24"><div className="animate-pulse text-gray-500">Chargement du cockpit…</div></main>;

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="bg-slate-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Sparkles className="h-4 w-4" /> ADSO · Excellence</div><h1 className="text-3xl font-bold tracking-tight">{data.cockpit.label}</h1><p className="mt-2 max-w-2xl text-slate-300">Bonjour {data.user.name}. {data.cockpit.objective}</p></div>
            <div className="flex items-center gap-3"><button onClick={shareProgress} disabled={sharing} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 disabled:opacity-50"><Share2 className="h-4 w-4" />{sharing ? 'Partage…' : 'Partager ma progression'}</button><div className="rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur"><div className="text-slate-300">Plan</div><div className="font-semibold capitalize">{data.user.subscription}</div></div></div>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(data.metrics).map(([key, value]) => <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-900">{value}{key === 'averageScore' ? '%' : ''}</div><div className="mt-1 text-xs font-medium text-slate-500">{metricLabels[key] ?? key}</div></div>)}</div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data.cockpit.modules.map((module) => { const Icon = iconFor(module); return <div key={module} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"><Icon className="h-6 w-6 text-emerald-600" /><h2 className="mt-4 font-semibold text-slate-900">{module}</h2><p className="mt-1 text-sm text-slate-500">Module personnalisé selon votre rôle et vos besoins.</p></div>; })}</section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-5 flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold">Mon journal ADSO</h2></div><form onSubmit={addJournalEntry} className="space-y-3"><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Titre de la note" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" /><textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} required rows={5} placeholder="Notez votre objectif, une difficulté, une réussite ou ce que vous voulez retenir…" className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" /><button disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Enregistrement…' : 'Ajouter au journal'}</button></form></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-5 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold">Dernières entrées</h2></div><div className="space-y-4">{data.journal.length === 0 && <p className="text-sm text-slate-500">Votre journal est prêt. Commencez par enregistrer votre première note.</p>}{data.journal.map((entry) => <article key={entry.id} className="border-b border-slate-100 pb-4 last:border-0"><h3 className="font-medium text-slate-900">{entry.title}</h3><p className="mt-1 line-clamp-3 text-sm text-slate-500">{entry.body}</p><time className="mt-2 block text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString('fr-FR')}</time></article>)}</div></div>
      </section>
    </div>
  </main>;
}
