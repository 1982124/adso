'use client';

import Link from 'next/link';
import { ArrowRight, Mic, Menu, PlayCircle, ShieldCheck, UserPlus, X } from 'lucide-react';
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

  const openVoice = () => window.dispatchEvent(new CustomEvent('adso:voice-toggle'));
  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <header className="relative z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO — Accueil" className="shrink-0 text-2xl font-black tracking-[-0.04em] text-white">ADSO</Link>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Link href="/inscription" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-extrabold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"><UserPlus className="size-4" />Créer mon compte</Link>
            <Link href="/connexion" className="inline-flex min-h-11 items-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">Se connecter</Link>
          </div>
          <button type="button" onClick={openVoice} aria-label="Ouvrir Françoise" title="Françoise — assistante ADSO" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200 transition hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"><Mic className="size-5" /></button>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40">{menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}</button>
        </div>
        {menuOpen && (
          <nav id="adso-mobile-menu" aria-label="Navigation ADSO" className="border-t border-white/10 bg-slate-950 px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/inscription" className="rounded-xl bg-emerald-500 px-4 py-3 font-extrabold text-slate-950">Créer mon compte</Link>
              <Link href="/connexion" className="rounded-xl border border-white/10 px-4 py-3 font-bold text-white hover:bg-white/10">Se connecter</Link>
              <button type="button" onClick={() => navigate('learning')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Formation</button>
              <button type="button" onClick={() => navigate('driving')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Conducteur responsable</button>
              <button type="button" onClick={() => navigate('security')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Sécurité</button>
              <button type="button" onClick={() => navigate('fleet')} className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10">Flottes</button>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl shadow-black/40">
          <div className="relative aspect-[16/9] min-h-[390px] w-full overflow-hidden bg-slate-900 sm:min-h-[540px] lg:min-h-[680px]">
            <img
              src={heroSrc}
              alt="Scène réelle à Cotonou au Bénin : taxis-motos devant une école, illustrant le danger potentiel autour d'une zone scolaire"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={() => setHeroSrc(ADSO_FALLBACK_SCENE)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5" aria-hidden="true" />
            <div className="absolute left-5 top-5 max-w-[18rem] rounded-2xl border border-amber-300/30 bg-black/55 p-4 shadow-xl backdrop-blur-md sm:left-8 sm:top-8 sm:max-w-xs">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-amber-200"><ShieldCheck className="size-4" />Zone scolaire</div>
              <p className="mt-2 text-sm font-bold leading-5 text-white">Un enfant peut traverser en quelques secondes. Le conducteur doit déjà avoir anticipé.</p>
              <p className="mt-2 text-[11px] leading-4 text-white/60">Direction artistique ADSO · scène réelle de Cotonou utilisée comme référence terrain.</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-black/40 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 backdrop-blur sm:text-sm"><ShieldCheck className="size-4" />ADSO · apprendre avant le danger</div>
                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">Une route peut changer une vie. <span className="text-emerald-300">Apprenons à la protéger.</span></h1>
                <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/90 sm:text-xl sm:leading-8">ADSO transforme les situations de circulation en décisions simples à comprendre, à pratiquer et à retenir — de l'école au conducteur responsable.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-500 px-7 text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-400"><Link href="/inscription">Créer mon compte gratuitement <ArrowRight className="ml-2 size-5" /></Link></Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => navigate('learning')} className="min-h-14 rounded-2xl border-white/25 bg-black/30 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/10 hover:text-white"><PlayCircle className="mr-2 size-5 text-emerald-300" />Voir comment ADSO apprend</Button>
                </div>
              </div>
            </div>
          </div>
          <p className="border-t border-white/10 bg-slate-950 px-4 py-2 text-[10px] leading-4 text-slate-500 sm:px-6">Photo réelle · Cotonou, Bénin · taxis-motos devant l'école primaire Notre Dame · ShirleyDoss / Wikimedia Commons · CC BY-SA 4.0</p>
        </div>

        <div className="mx-auto max-w-5xl py-12 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">Pourquoi ADSO existe</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Voir le danger plus tôt. Décider plus vite. Protéger davantage.</h2>
              <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">ADSO ne se contente pas de montrer des règles. L'apprenant observe une situation, choisit, découvre la conséquence et comprend pourquoi la bonne décision compte.</p>
            </div>
            <div className="rounded-3xl border border-emerald-300/15 bg-emerald-400/[0.06] p-6 sm:p-7">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-200">Votre première étape</p>
              <p className="mt-3 text-2xl font-black text-white">Créez votre compte et commencez votre parcours.</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Votre compte permet à ADSO de mémoriser votre progression et de vous donner accès aux expériences disponibles.</p>
              <Link href="/inscription" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-extrabold text-slate-950 transition hover:bg-emerald-50">Commencer maintenant <ArrowRight className="ml-2 size-4" /></Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-300/15 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Le signal d'alarme de l'OMS</p>
          <p className="mt-3 max-w-4xl text-xl font-black leading-8 text-white sm:text-2xl">En 2021, la Région africaine de l'OMS a enregistré environ 225 482 décès liés aux accidents de la route.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-black text-amber-200">225 482</p><p className="mt-1 text-xs leading-5 text-slate-400">décès estimés en 2021</p></div>
            <div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-black text-amber-200">19,4</p><p className="mt-1 text-xs leading-5 text-slate-400">décès pour 100 000 habitants</p></div>
            <div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-black text-amber-200">19 %</p><p className="mt-1 text-xs leading-5 text-slate-400">de la charge mondiale des décès routiers</p></div>
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">L'Afrique ne représente qu'environ 15 % de la population mondiale et 3 % du parc motorisé mondial, mais supporte une part disproportionnée des décès routiers. ADSO fait de l'éducation, de la prévention et de la décision responsable un apprentissage accessible dès l'école.</p>
          <p className="mt-4 text-xs leading-5 text-slate-500">Source : Organisation mondiale de la Santé, <em>Road safety in the WHO African Region 2023</em>, estimations 2021.</p>
        </div>
      </div>
    </section>
  );
}
