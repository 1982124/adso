'use client';

import Link from 'next/link';
import { ArrowRight, Mic, Menu, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const HERO_IMAGE = 'https://commons.wikimedia.org/wiki/Special:FilePath/V%C3%A9hicule_accident%C3%A9_circulant_sur_une_route_%C3%A0_Cotonou_02.jpg';

export default function HeroRealisticHome() {
  const setView = useViewStore((state) => state.setView);
  const [menuOpen, setMenuOpen] = useState(false);

  const openVoice = () => window.dispatchEvent(new CustomEvent('adso:voice-toggle'));

  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <header className="relative z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO — Accueil" className="text-2xl font-black tracking-[-0.04em] text-white">ADSO</Link>
          <div className="mx-auto flex items-center gap-2">
            <button type="button" onClick={openVoice} aria-label="Ouvrir Françoise" title="Françoise — assistante ADSO" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200 transition hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/60">
              <Mic className="size-5" />
            </button>
          </div>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="adso-mobile-menu" aria-label="Navigation ADSO" className="border-t border-white/10 bg-slate-950 px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <button type="button" onClick={() => navigate('learning')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Formation</button>
              <button type="button" onClick={() => navigate('driving')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Conducteur</button>
              <button type="button" onClick={() => navigate('security')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Sécurité</button>
              <button type="button" onClick={() => navigate('fleet')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Flottes</button>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40">
          <div className="relative aspect-[16/9] min-h-[280px] w-full overflow-hidden bg-slate-900 sm:min-h-[420px] lg:min-h-[560px]">
            <img src={HERO_IMAGE} alt="Véhicule accidenté sur une route à Cotonou, au Bénin — scène routière réelle" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-7 sm:left-7 sm:right-7">
              <span className="inline-flex rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">Cotonou · Bénin · situation réelle</span>
            </div>
          </div>
          <div className="border-t border-white/10 bg-slate-950/95 px-5 py-4 sm:px-7">
            <p className="text-sm font-bold text-emerald-200">Scène réelle · observer avant d'agir</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">ADSO transforme une situation routière réelle en expérience d'apprentissage.</p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl py-10 text-center sm:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">Éducation routière · mobilité sûre · prévention</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Chaque trajet compte. Chaque décision peut protéger une vie.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">Avec ADSO, nous formons des citoyens responsables dès l'école et apprenons à mieux partager la route.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-500 px-7 text-base font-extrabold text-slate-950 hover:bg-emerald-400"><Link href="/student">Commencer la formation<ArrowRight className="ml-2 size-5" /></Link></Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setView('learning')} className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white"><PlayCircle className="mr-2 size-5 text-emerald-300" />Explorer les scènes</Button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-300/15 bg-white/[0.04] p-5 text-center sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Un chiffre qui doit nous alerter</p>
          <p className="mt-3 text-base font-bold leading-7 text-white">L'Afrique affiche le taux de mortalité routière le plus élevé au monde.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-white">225 482 décès sur les routes en 2021</strong>, soit environ <strong className="text-white">19,4 décès pour 100 000 habitants</strong>.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-white">Chez les 5–29 ans, les accidents de la route constituent la première cause de décès dans le monde.</strong></p>
          <p className="mt-4 text-sm font-extrabold leading-6 text-emerald-200">Avec ADSO, nous formons des citoyens responsables dès l'école, apprenons à mieux partager la route et agissons dès aujourd'hui pour contribuer à réduire les accidents, les blessures et les décès sur nos routes.</p>
        </div>
      </div>
    </section>
  );
}
