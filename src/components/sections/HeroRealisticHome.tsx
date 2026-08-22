'use client';

import Link from 'next/link';
import { ArrowRight, Menu, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const REAL_AFRICAN_SCHOOL_SCENE =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_%C3%A0_l%27%C3%A9cole_Notre_Dame_Cotonou.jpg';
const ADSO_FALLBACK_SCENE = '/visuals/adso-home-school-safety.svg';

export default function HeroRealisticHome() {
  const setView = useViewStore((state) => state.setView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSrc, setHeroSrc] = useState(REAL_AFRICAN_SCHOOL_SCENE);

  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <header className="relative z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO — Accueil" className="text-2xl font-black tracking-[-0.05em] text-white">ADSO</Link>
          <div className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => navigate('learning')} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">Éducation routière</button>
            <button type="button" onClick={() => navigate('learning')} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">ADSO Immersif</button>
            <button type="button" onClick={() => navigate('security')} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">Sécurité</button>
            <Link href="/student" className="ml-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-extrabold text-slate-950 hover:bg-emerald-300">Commencer</Link>
          </div>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 md:hidden">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="adso-mobile-menu" aria-label="Navigation ADSO" className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
            <div className="grid gap-2">
              <button type="button" onClick={() => navigate('learning')} className="rounded-xl px-4 py-3 text-left font-bold hover:bg-white/10">Éducation routière</button>
              <button type="button" onClick={() => navigate('learning')} className="rounded-xl px-4 py-3 text-left font-bold hover:bg-white/10">ADSO Immersif</button>
              <button type="button" onClick={() => navigate('security')} className="rounded-xl px-4 py-3 text-left font-bold hover:bg-white/10">Sécurité</button>
              <Link href="/student" onClick={() => setMenuOpen(false)} className="rounded-xl bg-emerald-400 px-4 py-3 font-extrabold text-slate-950">Commencer mon parcours</Link>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-20">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex flex-col justify-center py-6 lg:py-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Éducation routière · mobilité sûre · prévention</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Éduquer aujourd’hui pour <span className="text-emerald-300">sauver des vies demain.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">De l’école au <strong className="text-white">conducteur responsable</strong>, ADSO apprend à mieux partager la route grâce à des expériences visuelles, interactives et immersives.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-400 px-7 text-base font-extrabold text-slate-950 hover:bg-emerald-300">
                <Link href="/student">Commencer mon parcours<ArrowRight className="ml-2 size-5" /></Link>
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setView('learning')} className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white">
                <PlayCircle className="mr-2 size-5 text-emerald-300" />Découvrir ADSO Immersif
              </Button>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 text-sm">
              <div><p className="font-extrabold text-white">Élève</p><p className="mt-1 text-slate-400">Comprendre</p></div>
              <div><p className="font-extrabold text-white">Conducteur</p><p className="mt-1 text-slate-400">Anticiper</p></div>
              <div><p className="font-extrabold text-white">Responsable</p><p className="mt-1 text-slate-400">Protéger</p></div>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/50 sm:min-h-[560px] lg:min-h-[680px]">
            <img src={heroSrc} alt="Scène réelle de mobilité et de sécurité routière devant une école à Cotonou, au Bénin" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" onError={() => setHeroSrc(ADSO_FALLBACK_SCENE)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <div className="max-w-lg rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Pensé pour l’Afrique. Conçu pour l’avenir.</p>
                <p className="mt-2 text-lg font-extrabold leading-7 text-white">Voir. Décider. Comprendre. Progresser.</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Des situations routières concrètes pour apprendre avant que le danger n'arrive.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">01 · Voir</p><h2 className="mt-2 text-xl font-black">Des scènes qui ressemblent à la vraie route.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Images, signalisation, motos, véhicules, piétons et situations africaines.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">02 · Décider</p><h2 className="mt-2 text-xl font-black">Des choix qui ont une conséquence.</h2><p className="mt-2 text-sm leading-6 text-slate-400">L'apprenant observe, choisit et découvre immédiatement ce qui peut arriver.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">03 · Progresser</p><h2 className="mt-2 text-xl font-black">Une compétence visible dans le temps.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Cours, scènes, exercices, score et progression réunis dans un même parcours.</p></div>
        </div>
      </div>
    </section>
  );
}
