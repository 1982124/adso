'use client';

import Link from 'next/link';
import { ArrowRight, Mic, Menu, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

// Original ADSO editorial illustration. It is intentionally self-contained,
// fast to load and independent of third-party image availability/licensing.
const HERO_IMAGE = '/visuals/adso-home-school-safety.svg';

// Optional contextual photograph. Attribution remains visible because this is
// third-party material; it is never presented as an ADSO-created image.
const SCHOOL_MOTO_IMAGE = 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_%C3%A0_l%27%C3%A9cole_Notre_Dame_Cotonou.jpg';

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
          <div className="relative aspect-[16/9] min-h-[300px] w-full overflow-hidden bg-slate-900 sm:min-h-[480px] lg:min-h-[640px]">
            <img src={HERO_IMAGE} alt="Illustration ADSO : élève près d'une école, taxi-moto, véhicule et signalisation de sécurité routière" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
          </div>
          <p className="border-t border-white/10 bg-slate-950 px-4 py-2 text-[10px] leading-4 text-slate-500 sm:px-6">Illustration originale ADSO · scène pédagogique de sécurité routière</p>
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

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
              <img src={SCHOOL_MOTO_IMAGE} alt="Taxi-motos béninois devant l'école primaire Notre Dame à Cotonou" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>
            <p className="border-t border-white/10 bg-slate-950 px-4 py-2 text-[10px] leading-4 text-slate-500">Image contextuelle · Cotonou · taxi-motos devant une école · ShirleyDoss / Wikimedia Commons · CC BY-SA 4.0</p>
          </div>
          <div className="rounded-2xl border border-emerald-300/15 bg-white/[0.04] p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Apprendre avant le danger</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">L'école est le premier terrain de sécurité routière.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">ADSO relie les situations concrètes aux compétences à acquérir : observer, anticiper, décider, protéger les piétons et partager la route avec les deux-roues.</p>
            <button type="button" onClick={() => navigate('learning')} className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15">Voir les scènes immersives<ArrowRight className="ml-2 size-4" /></button>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-amber-300/15 bg-white/[0.04] p-5 text-center sm:p-6">
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