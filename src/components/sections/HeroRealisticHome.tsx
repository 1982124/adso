'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, CarFront, Menu, PlayCircle, ShieldCheck, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useState } from 'react';
import ShareMission from '@/components/ShareMission';

const ADSO_HOME_SCENE = '/images/adso-home-accident-eleves.svg';

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
  const [imageFailed, setImageFailed] = useState(false);

  const navigate = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <header className="relative z-30 border-b border-white/10 bg-[#0B1F33]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="ADSO AFRICA — Accueil" className="shrink-0 text-[1.35rem] font-black tracking-[-0.045em] text-white">ADSO <span className="text-[#D7B45A]">AFRICA</span></Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {navigation.map(({ label, view }) => <button key={label} type="button" onClick={() => navigate(view)} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]">{label}</button>)}
            <Link href="/institutions" className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200/85 transition hover:bg-white/8 hover:text-white">Institutions</Link>
            <Link href="#parcours" className="ml-2 inline-flex min-h-10 items-center rounded-xl bg-[#D7B45A] px-4 py-2 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir la plateforme</Link>
          </nav>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="adso-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
        {menuOpen && <nav id="adso-mobile-menu" aria-label="Navigation mobile ADSO AFRICA" className="border-t border-white/10 bg-[#0B1F33] px-4 py-3 lg:hidden"><div className="grid gap-1.5">{navigation.map(({ label, view }) => <button key={label} type="button" onClick={() => navigate(view)} className="min-h-11 rounded-xl px-4 py-2.5 text-left font-bold text-white hover:bg-white/10">{label}</button>)}<Link href="/institutions" onClick={() => setMenuOpen(false)} className="min-h-11 rounded-xl px-4 py-2.5 font-bold text-white hover:bg-white/10">Institutions</Link><Link href="#parcours" onClick={() => setMenuOpen(false)} className="min-h-11 rounded-xl bg-[#D7B45A] px-4 py-2.5 font-extrabold text-[#0B1F33]">Découvrir la plateforme</Link></div></nav>}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-14">
        <div className="grid items-start gap-8 lg:grid-cols-[0.93fr_1.07fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-xs">Une ambition africaine · un impact humain</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.04] tracking-[-0.04em] sm:text-4xl lg:text-[3.55rem]">Construire en Afrique une infrastructure numérique pour faire progresser les compétences de mobilité sûre tout au long de la vie.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">ADSO AFRICA accompagne chaque personne, de l’école à la vie professionnelle, par l’éducation, la prévention, la simulation et le développement des compétences — avec l’ambition de contribuer, pays après pays et dans toutes les langues, à réduire les accidents, les blessures et les décès sur les routes africaines.</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"><Button type="button" size="lg" onClick={() => navigate('learning')} className="min-h-12 rounded-xl bg-[#D7B45A] px-6 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir mon parcours <ArrowRight className="ml-2 size-4" /></Button><Button type="button" variant="outline" size="lg" onClick={() => navigate('learning')} className="min-h-12 rounded-xl border-white/20 bg-white/5 px-6 text-sm font-bold text-white hover:bg-white/10 hover:text-white"><PlayCircle className="mr-2 size-4 text-[#D7B45A]" /> Découvrir ADSO Immersif</Button></div>
            <div className="mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">{audiences.map(({ label, text, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-extrabold text-white">{label}</p><p className="text-[11px] text-slate-300">{text}</p></div></div>)}</div>
            <ShareMission />
            <div id="parcours" className="mt-5 border-t border-white/10 pt-4"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Un même fil conducteur</p><p className="mt-1.5 text-xs leading-5 text-slate-300 sm:text-sm">École <span className="text-[#D7B45A]">→</span> Collège <span className="text-[#D7B45A]">→</span> Lycée <span className="text-[#D7B45A]">→</span> Université <span className="text-[#D7B45A]">→</span> Apprentissage <span className="text-[#D7B45A]">→</span> Conducteur & professionnel</p></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#081724] shadow-2xl shadow-black/40 lg:rounded-[1.5rem]">
            <div className="aspect-[4/3] lg:aspect-[5/4]">
              {!imageFailed ? <img src={ADSO_HOME_SCENE} alt="Scène ADSO AFRICA : un accident impliquant un élève devant une école, dans un environnement routier africain." className="h-full w-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" onError={() => setImageFailed(true)} /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_30%,#31566f,transparent_45%),linear-gradient(145deg,#102b40,#07131f)] p-8 text-center"><div><ShieldCheck className="mx-auto size-14 text-[#D7B45A]"/><p className="mt-4 text-xl font-black">ADSO AFRICA · mobilité sûre</p><p className="mt-2 text-sm text-slate-300">Observer · Décider · Comprendre · Progresser</p></div></div>}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07131F] via-[#07131F]/80 to-transparent p-4 pt-16 sm:p-5 sm:pt-20"><div className="flex items-start gap-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D7B45A] text-[#0B1F33]"><ShieldCheck className="size-4" /></span><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#E4C878]">Une situation réelle · une compétence à construire</p><p className="mt-0.5 text-xs font-semibold leading-5 text-white sm:text-sm">Observer. Décider. Comprendre la conséquence. Développer un réflexe sûr.</p></div></div></div>
          </div>
        </div>

        <div className="mt-9 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#D7B45A]">Pour les personnes</p><h2 className="mt-1.5 text-lg font-black">Apprendre et progresser</h2><p className="mt-1.5 text-xs leading-5 text-slate-300">Des parcours adaptés à l’âge, au niveau et à la situation de mobilité.</p></div><div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#D7B45A]">Pour les établissements</p><h2 className="mt-1.5 text-lg font-black">Former et suivre</h2><p className="mt-1.5 text-xs leading-5 text-slate-300">Une base numérique pour accompagner l’éducation à la mobilité et les compétences.</p></div><div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#D7B45A]">Pour les institutions</p><h2 className="mt-1.5 text-lg font-black">Observer et collaborer</h2><p className="mt-1.5 text-xs leading-5 text-slate-300">Une plateforme complémentaire pour les initiatives de mobilité sûre et d’éducation.</p><Link href="/institutions" className="mt-3 inline-flex items-center text-xs font-extrabold text-[#E4C878] hover:text-white">Espace institutions <ArrowRight className="ml-1.5 size-3.5" /></Link></div></div>
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#D7B45A]/20 bg-[#D7B45A]/[0.055] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Building2 className="mt-0.5 size-4 shrink-0 text-[#D7B45A]" /><p className="text-xs leading-5 text-slate-200"><strong className="text-white">ADSO AFRICA complète les dispositifs existants.</strong> Elle n’est pas une autorité publique et ne remplace pas les permis, examens ou certifications officiels des États.</p></div><Link href="/institutions" className="inline-flex shrink-0 items-center text-xs font-extrabold text-[#E4C878] hover:text-white">Découvrir l’espace institutions <ArrowRight className="ml-1.5 size-3.5" /></Link></div>
      </div>
    </section>
  );
}
