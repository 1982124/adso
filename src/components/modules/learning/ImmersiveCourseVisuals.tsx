'use client';

import Link from 'next/link';

const scenes = [
  ['🚸', 'Piéton & traversée', 'Observer, anticiper, décider.', 'crossing'],
  ['🌧️', 'Conduite sous la pluie', 'Adhérence, distance et visibilité.', 'rain'],
  ['🚦', 'Intersection & priorité', 'Lire la situation avant d’agir.', 'junction'],
  ['🌙', 'Conduite de nuit', 'Voir, être vu, adapter sa vitesse.', 'night'],
] as const;

export default function ImmersiveCourseVisuals() {
  return <section aria-labelledby="immersive-course-visuals" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Apprendre par la situation</p><h3 id="immersive-course-visuals" className="mt-1 text-lg font-bold text-white">Scènes visuelles intégrées aux cours</h3><p className="mt-1 text-xs text-slate-400">Observer une situation avant de mémoriser la règle.</p></div><span className="hidden rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 sm:inline-flex">IMMERSION</span></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{scenes.map(([icon,title,text,scene]) => <Link key={scene} href="/formation/immersive" className="group rounded-xl border border-slate-800 bg-slate-950/70 p-2 transition hover:-translate-y-0.5 hover:border-emerald-700/50"><div className={`relative h-28 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${scene==='night'?'from-slate-900 via-indigo-950 to-slate-950':scene==='rain'?'from-slate-700 via-slate-800 to-emerald-950':'from-sky-950 via-emerald-950 to-slate-950'}`} aria-hidden="true"><div className="absolute inset-x-0 bottom-0 h-8 bg-slate-950/80"/><div className="absolute bottom-3 left-1/2 h-1 w-[70%] -translate-x-1/2 rounded bg-white/40"/><div className="absolute bottom-1 left-[22%] h-12 w-7 rounded-md bg-emerald-400"/><div className="absolute bottom-1 right-[24%] h-10 w-6 rounded-md bg-amber-300/90"/><div className="absolute left-5 top-4 text-2xl">{icon}</div>{scene==='rain'&&<div className="absolute inset-0 bg-[repeating-linear-gradient(110deg,transparent,transparent_9px,rgba(147,197,253,.18)_10px,transparent_11px)]"/>}</div><div className="px-2 pb-1 pt-3"><h4 className="text-sm font-semibold text-white">{title}</h4><p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p><span className="mt-2 inline-flex text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">Voir la scène →</span></div></Link>)}</div>
  </section>;
}
