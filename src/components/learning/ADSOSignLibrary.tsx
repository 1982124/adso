'use client';

import { useMemo, useState } from 'react';

type Sign = {
  id: string;
  category: string;
  subcategory?: string | null;
  name: string;
  description: string;
  meaning: string;
  useCase: string;
  shape?: string | null;
  colors?: unknown;
  applicability?: string;
};

const FILES: Record<string, string> = {
  'STOP': 'Stop sign.svg',
  'Cédez le passage': 'Yield sign.svg',
  'Sens interdit': 'No entry sign.svg',
  'Limitation de vitesse': 'Speed limit 50 km-h.svg',
  'Stationnement interdit': 'No parking sign.svg',
  'Arrêt et stationnement interdits': 'No stopping sign.svg',
  'Interdiction de dépasser': 'No overtaking sign.svg',
  'Carrefour à sens giratoire': 'Roundabout.svg',
  'Passage de piétons': 'Pedestrian crossing.svg',
  'Enfants': 'Children crossing.svg',
  'Travaux': 'Road works.svg',
  'Chaussée glissante': 'Slippery road sign.svg',
  'Animaux sauvages': 'Wild animals sign.svg',
  'Feux de circulation': 'Traffic lights.svg',
  'Sens unique': 'One way traffic sign.svg',
  'Hôpital': 'Hospital sign.svg',
  'Parking': 'Parking sign.svg',
  'Piste cyclable': 'Cycle lane sign.svg',
  'Chaussée rétrécie': 'Road narrows sign.svg',
  'Chutes de pierres': 'Falling rocks sign.svg',
  'Croisement de routes': 'Crossroads sign.svg',
  'Danger général': 'Warning sign.svg',
};

function sourceUrl(name: string) {
  const file = FILES[name];
  return file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}` : null;
}

function colors(sign: Sign): string[] {
  if (Array.isArray(sign.colors)) return sign.colors.map(String).map((c) => c.toLowerCase());
  return [];
}

function SignVisual({ sign }: { sign: Sign }) {
  const [failed, setFailed] = useState(false);
  const src = sourceUrl(sign.name);
  const cs = colors(sign);
  const isBlue = cs.includes('blue') || sign.category.toLowerCase().includes('obligation');
  const isRed = cs.includes('red') || sign.category.toLowerCase().includes('interdiction') || sign.category.toLowerCase().includes('danger');
  const shape = sign.shape || '';

  if (src && !failed) {
    return <img src={src} alt={`Panneau ${sign.name}`} className="max-h-full max-w-full object-contain" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
  }

  // Universal local fallback: every catalog entry remains visual even when a remote SVG is unavailable.
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full max-h-[260px]" role="img" aria-label={`Illustration du panneau ${sign.name}`}>
      <defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="6" floodOpacity=".28" /></filter></defs>
      <g filter="url(#shadow)">
        {shape === 'triangle-inverse' ? <polygon points="150,265 28,45 272,45" fill="#fff" stroke={isRed ? '#dc2626' : '#334155'} strokeWidth="14" strokeLinejoin="round" /> : shape === 'triangle' ? <polygon points="150,25 278,260 22,260" fill="#fff" stroke={isRed ? '#dc2626' : '#334155'} strokeWidth="14" strokeLinejoin="round" /> : shape === 'octagon' ? <polygon points="95,20 205,20 280,95 280,205 205,280 95,280 20,205 20,95" fill={isRed ? '#dc2626' : '#fff'} stroke="#fff" strokeWidth="10" /> : shape === 'circle' ? <circle cx="150" cy="150" r="120" fill={isBlue ? '#2563eb' : '#fff'} stroke={isRed ? '#dc2626' : '#334155'} strokeWidth="14" /> : <rect x="35" y="35" width="230" height="230" rx="12" fill={isBlue ? '#2563eb' : '#fff'} stroke={isRed ? '#dc2626' : '#334155'} strokeWidth="12" />}
        <text x="150" y="145" textAnchor="middle" fontSize="22" fontWeight="800" fill={isBlue ? '#fff' : '#111827'}>{sign.name.length > 18 ? sign.name.slice(0, 18) + '…' : sign.name}</text>
        <text x="150" y="175" textAnchor="middle" fontSize="12" fill={isBlue ? '#dbeafe' : '#475569'}>ADSO · signalisation</text>
      </g>
    </svg>
  );
}

export default function ADSOSignLibrary({ signs }: { signs: Sign[] }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Sign | null>(null);
  const categories = useMemo(() => ['all', ...Array.from(new Set(signs.map((s) => s.category).filter(Boolean)))], [signs]);
  const filtered = useMemo(() => signs.filter((s) => (category === 'all' || s.category === category) && `${s.name} ${s.description} ${s.subcategory || ''}`.toLowerCase().includes(query.toLowerCase())), [category, query, signs]);

  return (
    <section aria-label="Bibliothèque complète de panneaux ADSO" className="space-y-6">
      <div className="rounded-3xl border border-emerald-300/10 bg-emerald-400/[0.04] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-300">ADSO · bibliothèque signalisation</p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Tous les panneaux du corpus disponible</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">Un catalogue visuel unique, filtrable par famille et recherche. Les visuels ouverts de référence sont utilisés lorsqu’ils sont disponibles ; sinon ADSO conserve une représentation locale de secours afin qu’aucun panneau ne disparaisse de l’expérience.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un panneau…" aria-label="Rechercher un panneau" className="min-h-11 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500" />
          <span className="flex min-h-11 items-center justify-center rounded-xl bg-white/[0.05] px-4 text-sm font-bold text-emerald-200">{filtered.length} panneaux</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${category === item ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-400'}`}>{item === 'all' ? 'Tous' : item}</button>)}</div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((sign) => (
          <button key={sign.id} type="button" onClick={() => setSelected(sign)} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-white p-4"><SignVisual sign={sign} /></div>
            <div className="mt-4"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">{sign.category}</p><h3 className="mt-1 line-clamp-2 font-bold text-white">{sign.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{sign.description}</p></div>
          </button>
        ))}
      </div>

      {selected && <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label={selected.name} onClick={() => setSelected(null)}><div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-6" onClick={(e) => e.stopPropagation()}><div className="grid gap-6 md:grid-cols-[280px_1fr]"><div className="flex aspect-square items-center justify-center rounded-2xl bg-white p-5"><SignVisual sign={selected} /></div><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">{selected.category} · {selected.subcategory || 'socle commun'}</p><h3 className="mt-2 text-3xl font-black text-white">{selected.name}</h3><p className="mt-4 text-slate-300">{selected.description}</p><div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="font-bold text-emerald-200">Signification</p><p className="mt-2 text-sm leading-6 text-slate-400">{selected.meaning}</p></div><div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="font-bold text-amber-200">Action conducteur</p><p className="mt-2 text-sm leading-6 text-slate-400">{selected.useCase}</p></div><button type="button" onClick={() => setSelected(null)} className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Fermer</button></div></div></div></div>}
    </section>
  );
}
