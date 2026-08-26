'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, CarFront, Menu, PlayCircle, ShieldCheck, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';

const ADSO_HOME_SCENE = '/images/adso-home-accident-eleves.svg';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée', icon: BookOpen },
  { label: 'Étudiants', text: 'Université et préparation au permis', icon: Users },
  { label: 'Apprentis', text: 'Tous secteurs d’activité', icon: ShieldCheck },
  { label: 'Conducteurs', text: 'Perfectionnement et prévention', icon: CarFront },
];

const navigation = [
  { label: 'Parcours', view: 'learning' as const },
  { label: 'ADSO Immersif', view: 'learning' as const },
  { label: 'Sécurité', view: 'security' as const },
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
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <header className="relative z-30 border-b border-white/10 bg-[#0B1F33]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO AFRICA — Accueil" className="shrink-0 text-[1.45rem] font-black tracking-[-0.045em] text-white">
            ADSO <span className="text-[#D7B45A]">AFRICA</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {navigation.map(({ label, view }) => (
              <button key={label} type="button" onClick={() => navigate(view)} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">
                {label}
              </button>
            ))}
            <Link href="/institutions" className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">Institutions</Link>
            <Link href="#parcours" className="ml-2 inline-flex min-h-11 items-center rounded-xl border border-[#D7B45A]/50 bg-[#D7B45A] px-4 py-2 text-sm font-extrabold text-[#0B1F33] transition hover:bg-[#E4C878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">Découvrir la plateforme</Link>
          </nav>

          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A] lg:hidden">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="adso-mobile-menu" aria-label="Navigation mobile ADSO AFRICA" className="border-t border-white/10 bg-[#0B1F33] px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {navigation.map(({ label, view }) => (
                <button key={label} type="button" onClick={() => navigate(view)} className="min-h-12 rounded-xl px-4 py-3 text-left font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">{label}</button>
              ))}
              <Link href="/institutions" onClick={() => setMenuOpen(false)} className="min-h-12 rounded-xl px-4 py-3 font-bold text-white transition hover:bg-white/10">Institutions</Link>
              <Link href="#parcours" onClick={() => setMenuOpen(false)} className="min-h-12 rounded-xl bg-[#D7B45A] px-4 py-3 font-extrabold text-[#0B1F33]">Découvrir la plateforme</Link>
            </div>
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-sm">Pensé pour l’Afrique · conçu pour l’avenir</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[4.25rem]">Une infrastructure numérique pour apprendre la mobilité sûre.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl"><strong className="font-extrabold text-white">ADSO AFRICA</strong> accompagne les usagers de la route, de l’école à la vie professionnelle, par l’éducation, la prévention, la simulation et le développement des compétences.</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="button" size="lg" onClick={() => navigate('learning')} className="min-h-14 rounded-xl bg-[#D7B45A] px-7 text-base font-extrabold text-[#0B1F33] shadow-lg shadow-black/20 hover:bg-[#E4C878] focus-visible:ring-2 focus-visible:ring-[#F1DFA7]">Découvrir mon parcours <ArrowRight className="ml-2 size-5" /></Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate('learning')} className="min-h-14 rounded-xl border-white/20 bg-white/5 px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#D7B45A]"><PlayCircle className="mr-2 size-5 text-[#D7B45A]" /> Découvrir ADSO Immersif</Button>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              {audiences.map(({ label, text, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon aria-hidden="true" className="size-5" /></span>
                  <div><p className="font-extrabold text-white">{label}</p><p className="text-xs text-slate-300">{text}</p></div>
                </div>
              ))}
            </div>

            <div id="parcours" className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Un même fil conducteur</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">École <span className="text-[#D7B45A]">→</span> Collège <span className="text-[#D7B45A]">→</span> Lycée <span className="text-[#D7B45A]">→</span> Université <span className="text-[#D7B45A]">→</span> Apprentissage <span className="text-[#D7B45A]">→</span> Conducteur & professionnel</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#081724] shadow-2xl shadow-black/40 lg:rounded-[2rem]">
            <div className="aspect-[4/3] lg:aspect-[5/4]"><img src={ADSO_HOME_SCENE} alt="Scène ADSO AFRICA : un accident impliquant un élève devant une école, dans un environnement routier africain." className="h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" /></div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07131F] via-[#07131F]/80 to-transparent p-5 pt-20 sm:p-6 sm:pt-24">
              <div className="flex items-start gap-3"><span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D7B45A] text-[#0B1F33]"><ShieldCheck className="size-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#E4C878]">Une situation réelle · une compétence à construire</p><p className="mt-1 text-sm font-semibold leading-6 text-white sm:text-base">Observer. Décider. Comprendre la conséquence. Développer un réflexe sûr.</p></div></div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#D7B45A]">Pour les personnes</p><h2 className="mt-2 text-xl font-black">Apprendre et progresser</h2><p className="mt-2 text-sm leading-6 text-slate-300">Des parcours adaptés à l’âge, au niveau et à la situation de mobilité.</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#D7B45A]">Pour les établissements</p><h2 className="mt-2 text-xl font-black">Former et suivre</h2><p className="mt-2 text-sm leading-6 text-slate-300">Une base numérique pour accompagner l’éducation à la mobilité et les compétences.</p></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#D7B45A]">Pour les institutions</p><h2 className="mt-2 text-xl font-black">Observer et collaborer</h2><p className="mt-2 text-sm leading-6 text-slate-300">Une plateforme complémentaire pour les initiatives de mobilité sûre et d’éducation.</p><Link href="/institutions" className="mt-4 inline-flex items-center text-sm font-extrabold text-[#E4C878] hover:text-white">Espace institutions <ArrowRight className="ml-1.5 size-4" /></Link></div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#D7B45A]/20 bg-[#D7B45A]/[0.055] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3"><Building2 className="mt-0.5 size-5 shrink-0 text-[#D7B45A]" /><p className="text-sm leading-6 text-slate-200"><strong className="text-white">ADSO AFRICA complète les dispositifs existants.</strong> Elle n’est pas une autorité publique et ne remplace pas les permis, examens ou certifications officiels des États.</p></div>
          <Link href="/institutions" className="inline-flex shrink-0 items-center font-extrabold text-[#E4C878] hover:text-white">Découvrir l’espace institutions <ArrowRight className="ml-2 size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
