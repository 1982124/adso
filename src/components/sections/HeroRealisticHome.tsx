'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CarFront, ShieldCheck, Users } from 'lucide-react';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée', icon: BookOpen },
  { label: 'Étudiants', text: 'Université · permis · Code', icon: Users },
  { label: 'Apprentis', text: 'Tous secteurs d’activité', icon: ShieldCheck },
  { label: 'Conducteurs', text: 'Prévention · perfectionnement', icon: CarFront },
];

export default function HeroRealisticHome() {
  return <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
    <div className="mx-auto max-w-7xl px-4 pb-9 pt-20 sm:px-6 lg:px-8 lg:pb-11">
      <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-9">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-[11px]">Une ambition africaine · un impact humain</p>
          <h1 className="mt-3 max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.035em] sm:text-[2.35rem] lg:text-[2.75rem]">Construire une mobilité plus sûre, tout au long de la vie.</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-200 sm:text-base">ADSO AFRICA construit en Afrique une infrastructure numérique dédiée à l’éducation, à la prévention, à la simulation et au développement des compétences de mobilité sûre.</p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link href="/education" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir ADSO <ArrowRight className="ml-2 size-4" /></Link>
            <Link href="/formation/immersive" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10"><span className="mr-2 text-[#D7B45A]">▶</span> ADSO Immersif</Link>
          </div>
          <div id="parcours" className="mt-5 grid max-w-xl gap-2 sm:grid-cols-2">{audiences.map(({ label, text, icon: Icon }) => <Link key={label} href="/student" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 hover:bg-white/[0.08]"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon className="size-4" /></span><div><p className="text-sm font-extrabold text-white">{label}</p><p className="text-[11px] text-slate-300">{text}</p><p className="mt-1 text-[10px] font-bold text-[#D7B45A]">Ouvrir le parcours →</p></div></Link>)}</div>
        </div>
        <figure className="min-w-0"><div className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#081724] shadow-2xl shadow-black/40"><img src="https://anaser.sn/storage/2023/01/sensibilisation-par-les-enfants-sur-la-1024x852.jpg" alt="Scène documentaire de sensibilisation à la sécurité routière d'enfants sur une route en Afrique." className="block aspect-[4/3] w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" referrerPolicy="no-referrer" /></div><figcaption className="mt-2 text-[10px] leading-4 text-slate-400">Illustration documentaire · sensibilisation à la sécurité routière en Afrique.</figcaption></figure>
      </div>
    </div>
  </section>;
}
