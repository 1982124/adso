'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CarFront, Menu, PlayCircle, ShieldCheck, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const ADSO_HOME_SCENE = 'https://anaser.sn/storage/2023/01/sensibilisation-par-les-enfants-sur-la-1024x852.jpg';
const ADSO_HOME_SCENE_FALLBACK = 'https://www.transports.gouv.ci/sites/default/files/styles/actu_detail_1030x730/public/actualites/1_95.jpg?itok=uFxxP3D3';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée', icon: BookOpen },
  { label: 'Étudiants', text: 'Université · permis · Code', icon: Users },
  { label: 'Apprentis', text: 'Tous secteurs d’activité', icon: ShieldCheck },
  { label: 'Conducteurs', text: 'Prévention · perfectionnement', icon: CarFront },
];

const navigation = [
  { label: 'Parcours', view: 'learning' as const },
  { label: 'ADSO Immersif', view: 'learning' as const },
  { label: 'Sécurité', view: 'security' as const },
];

export default function HeroRealisticHome() {
  const setView = useViewStore((state) => state.setView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(ADSO_HOME_SCENE);

  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <header className="relative z-30 border-b border-white/10 bg-[#0B1F33]">
        <div className="mx-auto flex min-h-[62px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO AFRICA — Accueil" className="shrink-0 text-[1.3rem] font-black tracking-[-0.045em] text-white">ADSO <span className="text-[#D7B45A]">AFRICA</span></Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {navigation.map(({ label, view }) => <button key={label} type="button" onClick={() => navigate(view)} className="min-h-9 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">{label}</button>)}
            <Link href="/institutions" className="min-h-9 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white">Institutions</Link>
            <Link href="#parcours" className="ml-2 inline-flex min-h-9 items-center rounded-xl bg-[#D7B45A] px-4 py-2 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir la plateforme</Link>
          </nav>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
        {menuOpen && <nav id="adso-mobile-menu" aria-label="Navigation mobile ADSO AFRICA" className="border-t border-white/10 bg-[#0B1F33] px-4 py-3 lg:hidden"><div className="grid gap-1.5">{navigation.map(({ label, view }) => <button key={label} type="button" onClick={() => navigate(view)} className="min-h-11 rounded-xl px-4 py-2.5 text-left font-bold text-white hover:bg-white/10">{label}</button>)}<Link href="/institutions" onClick={() => setMenuOpen(false)} className="min-h-11 rounded-xl px-4 py-2.5 font-bold text-white hover:bg-white/10">Institutions</Link><Link href="#parcours" onClick={() => setMenuOpen(false)} className="min-h-11 rounded-xl bg-[#D7B45A] px-4 py-2.5 font-extrabold text-[#0B1F33]">Découvrir la plateforme</Link></div></nav>}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-9 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-11">
        <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-9">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-[11px]">Une ambition africaine · un impact humain</p>
            <h1 className="mt-3 max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.035em] sm:text-[2.35rem] lg:text-[2.75rem]">Construire une mobilité plus sûre, tout au long de la vie.</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-200 sm:text-base">ADSO AFRICA construit en Afrique une infrastructure numérique dédiée à l’éducation, à la prévention, à la simulation et au développement des compétences de mobilité sûre.</p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"><Button type="button" size="lg" onClick={() => navigate('learning')} className="min-h-11 rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir mon parcours <ArrowRight className="ml-2 size-4" /></Button><Button type="button" variant="outline" size="lg" onClick={() => navigate('learning')} className="min-h-11 rounded-xl border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10 hover:text-white"><PlayCircle className="mr-2 size-4 text-[#D7B45A]" /> ADSO Immersif</Button></div>
            <div id="parcours" className="mt-5 grid max-w-xl gap-2 sm:grid-cols-2">{audiences.map(({ label, text, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-extrabold text-white">{label}</p><p className="text-[11px] text-slate-300">{text}</p></div></div>)}</div>
          </div>

          <figure className="min-w-0">
            <div className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#081724] shadow-2xl shadow-black/40">
              <img src={imageSrc} alt="Scène documentaire de sensibilisation à la sécurité routière d'enfants sur une route en Afrique." className="block aspect-[4/3] w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" referrerPolicy="no-referrer" onError={() => { if (imageSrc !== ADSO_HOME_SCENE_FALLBACK) setImageSrc(ADSO_HOME_SCENE_FALLBACK); }} />
            </div>
            <figcaption className="mt-2 text-[10px] leading-4 text-slate-400">Illustration documentaire · sensibilisation à la sécurité routière en Afrique.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
