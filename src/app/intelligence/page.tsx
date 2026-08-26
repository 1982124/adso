'use client';

import { useEffect, useState } from 'react';

interface Edition { title?: string; intro?: string; highlights?: string[]; opportunities?: string[]; disclaimer?: string }

export default function IntelligencePage() {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/intelligence/latest').then(async (r) => r.ok ? r.json() : null).then((data) => setEdition(data?.content ?? null)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">ADSO Africa Intelligence</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Comprendre. Anticiper. Contribuer.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Une page vivante alimentée par des informations officielles vérifiées, puis contextualisées par l’intelligence artificielle d’ADSO Africa. L’objectif est d’apporter de la valeur au débat public, jamais de s’approprier les programmes des institutions.</p>
        {loading ? <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-slate-300">Actualisation de l’intelligence africaine…</div> : edition ? <section className="mt-12 space-y-6">
          <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-8"><h2 className="text-2xl font-black">{edition.title}</h2><p className="mt-4 leading-7 text-slate-300">{edition.intro}</p></article>
          {!!edition.highlights?.length && <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"><h2 className="text-xl font-black">Ce qui mérite l’attention</h2><ul className="mt-4 space-y-3 text-slate-300">{edition.highlights.map((x, i) => <li key={i} className="rounded-2xl bg-slate-900/70 p-4">{x}</li>)}</ul></article>}
          {!!edition.opportunities?.length && <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.05] p-8"><h2 className="text-xl font-black">Questions ouvertes pour le dialogue</h2><ul className="mt-4 space-y-3 text-slate-300">{edition.opportunities.map((x, i) => <li key={i} className="rounded-2xl bg-slate-900/50 p-4">{x}</li>)}</ul></article>}
          <p className="text-xs leading-5 text-slate-500">{edition.disclaimer}</p>
        </section> : <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8"><h2 className="text-xl font-black">La prochaine édition se prépare</h2><p className="mt-3 text-slate-300">ADSO publiera une édition lorsqu’une information officielle vérifiée sera disponible.</p></section>}
      </div>
    </main>
  );
}
