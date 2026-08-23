'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Menu, PlayCircle, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const ADSO_HOME_SCENE = '/images/adso-home-accident-eleves.svg';

const learningPillars = [
  { icon: Brain, title: 'Apprendre', text: 'Des parcours courts, progressifs et adaptés au niveau de chacun.' },
  { icon: ShieldCheck, title: 'Décider', text: 'Des scènes réalistes pour reconnaître le danger et choisir le bon réflexe.' },
  { icon: BookOpen, title: 'Lire', text: 'Des e-books éducatifs pour approfondir la mobilité et la prévention.' },
];

export default function HeroRealisticHome() {
  const setView = useViewStore((state) => state.setView);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <header className="relative z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO — Accueil" className="shrink-0 text-2xl font-black tracking-[-0.05em] text-white">ADSO</Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => navigate('learning')} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">Formation</button>
            <button type="button" onClick={() => navigate('learning')} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">ADSO Immersif</button>
            <button type="button" onClick={() => navigate('security')} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">Sécurité</button>
            <a href="#ebooks" className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">E-books</a>
            <Link href="#tarifs" className="ml-1 inline-flex min-h-11 items-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Voir les offres</Link>
          </nav>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:hidden">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="adso-mobile-menu" aria-label="Navigation mobile ADSO" className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
            <div className="grid gap-2">
              <button type="button" onClick={() => navigate('learning')} className="min-h-12 rounded-xl px-4 py-3 text-left font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">Formation</button>
              <button type="button" onClick={() => navigate('learning')} className="min-h-12 rounded-xl px-4 py-3 text-left font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">ADSO Immersif</button>
              <button type="button" onClick={() => navigate('security')} className="min-h-12 rounded-xl px-4 py-3 text-left font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">Sécurité</button>
              <a href="#ebooks" onClick={() => setMenuOpen(false)} className="min-h-12 rounded-xl px-4 py-3 font-bold transition hover:bg-white/10">E-books</a>
              <a href="#tarifs" onClick={() => setMenuOpen(false)} className="min-h-12 rounded-xl bg-emerald-400 px-4 py-3 font-extrabold text-slate-950">Voir les offres</a>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-20">
        <div className="mb-8 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Pensé pour l’Afrique. Conçu pour l’avenir.</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">Formation à la mobilité. Éducation. Prévention.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">ADSO aide à apprendre, comprendre et pratiquer une mobilité plus sûre grâce à la formation immersive et aux contenus éducatifs numériques.</p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Formation · mobilité sûre · prévention</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Voir. Décider. Comprendre. <span className="text-emerald-300">Progresser.</span></h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">De l’élève au conducteur responsable, ADSO transforme les situations de mobilité en expériences d’apprentissage concrètes.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="button" size="lg" onClick={() => navigate('learning')} className="min-h-14 rounded-2xl bg-emerald-400 px-7 text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200">
                Commencer ma formation<ArrowRight className="ml-2 size-5" />
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate('learning')} className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300">
                <PlayCircle className="mr-2 size-5 text-emerald-300" />Découvrir ADSO Immersif
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {learningPillars.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <Icon aria-hidden="true" className="size-6 text-emerald-300" />
                  <h3 className="mt-3 font-extrabold">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/50 sm:min-h-[560px] lg:min-h-[680px]">
            <img src={ADSO_HOME_SCENE} alt="Scène ADSO : accident d'un élève devant une école, avec des témoins et des motos sur une route africaine." className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Scène ADSO · sécurité routière</p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">Observer le danger, décider et comprendre les conséquences.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200/20 bg-amber-50/[0.06] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Objectif ADSO</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Des connaissances qui deviennent de bons réflexes.</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200">ADSO combine formation, mises en situation et contenus éducatifs numériques pour renforcer une mobilité plus sûre.</p>
        </div>
      </div>
    </section>
  );
}
