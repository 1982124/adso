'use client';

import Link from 'next/link';
import { ArrowRight, Menu, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const ADSO_HOME_SCENE = '/visuals/adso-home-school-safety.svg';

export default function HeroRealisticHome() {
  const setView = useViewStore((state) => state.setView);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="mb-8 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Pensé pour l’Afrique. Conçu pour l’avenir.</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">Voir. Décider. Comprendre. Progresser.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Des situations routières concrètes pour apprendre avant que le danger n’arrive.</p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Éducation routière · mobilité sûre · prévention</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Éduquer aujourd’hui pour <span className="text-emerald-300">sauver des vies demain.</span></h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">De l’école au <strong className="text-white">conducteur responsable</strong>, ADSO apprend à mieux partager la route grâce à des expériences visuelles, interactives et immersives.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-400 px-7 text-base font-extrabold text-slate-950 hover:bg-emerald-300">
                <Link href="/student">Commencer mon parcours<ArrowRight className="ml-2 size-5" /></Link>
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setView('learning')} className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white">
                <PlayCircle className="mr-2 size-5 text-emerald-300" />Découvrir ADSO Immersif
              </Button>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/50 sm:min-h-[560px] lg:min-h-[680px]">
            <img src={ADSO_HOME_SCENE} alt="Scène pédagogique ADSO : devant une école, un élève est au sol après avoir été renversé par un taxi-moto, avec une signalisation de prudence visible." className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Scène pédagogique</p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">Un danger réel peut commencer en quelques secondes devant une école.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200/20 bg-amber-50/[0.06] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Selon l’OMS</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">1,16 million de vies perdues chaque année.</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200"><strong className="text-white">225 482 décès</strong> ont été estimés en 2021 dans la Région africaine de l’OMS, soit <strong className="text-white">19 % du bilan mondial</strong> cette année-là.</p>
          <p className="mt-5 text-lg font-extrabold text-emerald-300">Rejoignez ADSO pour contribuer à réduire ces chiffres.</p>
        </div>
      </div>
    </section>
  );
}
