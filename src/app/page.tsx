'use client';

import { useLayoutEffect } from 'react';
import Link from 'next/link';
import { useViewStore } from '@/stores/view-store';
import Footer from '@/components/Footer';
import ViewErrorBoundary from '@/components/ViewErrorBoundary';
import ChunkLoadRecovery from '@/components/ChunkLoadRecovery';
import HeroRealisticHome from '@/components/sections/HeroRealisticHome';
import StatsSection from '@/components/sections/StatsSection';
import EcosystemSection from '@/components/sections/EcosystemSection';
import SecuritySection from '@/components/sections/SecuritySection';
import ADSOExperienceSection from '@/components/ADSOExperienceSection';
import LearningPlatform from '@/components/modules/learning/LearningPlatform';
import ShareMission from '@/components/ShareMission';

export default function Home() {
  const { currentView, setView } = useViewStore();

  useLayoutEffect(() => {
    if (currentView !== 'home') setView('home');
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    reset();
    const frame = window.requestAnimationFrame(reset);
    const timer = window.setTimeout(reset, 120);
    window.addEventListener('pageshow', reset);
    if (window.location.hash && !['#ebooks', '#pricing', '#tarifs', '#parcours'].includes(window.location.hash)) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('pageshow', reset);
      window.history.scrollRestoration = previous;
    };
  }, []);

  return <><ChunkLoadRecovery /><main role="main" aria-label="ADSO AFRICA — infrastructure numérique de mobilité sûre"><ViewErrorBoundary key={currentView}>{currentView === 'home' && <HomeView />}{currentView === 'learning' && <LearningPlatform />}{currentView === 'driving' && <SecuritySection />}{currentView === 'security' && <SecuritySection />}</ViewErrorBoundary></main><Footer /></>;
}

function HomeView() {
  return <>
    <HeroRealisticHome />
    <section aria-labelledby="home-proof" className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-[#D7B45A]">Pourquoi ADSO AFRICA</p>
        <h2 id="home-proof" className="mx-auto mt-2 max-w-3xl text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl dark:text-white">Transformer une connaissance en compétence, puis une compétence en réflexe.</h2>
      </div>
    </section>
    <ADSOExperienceSection />
    <StatsSection />
    <section aria-labelledby="share-home" className="border-t border-slate-200 bg-[#0B1F33] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl"><ShareMission /></div>
    </section>
    <section id="ecosysteme" className="border-t border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl"><EcosystemSection /></div>
    </section>
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div><p className="text-sm font-black text-slate-950 dark:text-white">Pour les établissements et institutions</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Découvrir une infrastructure complémentaire pour l'éducation, la prévention et le développement des compétences de mobilité sûre.</p></div>
        <Link href="/institutions" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-xs font-extrabold text-white hover:bg-slate-800 dark:bg-[#D7B45A] dark:text-slate-950 dark:hover:bg-[#E4C878]">Espace institutions</Link>
      </div>
    </section>
    <section className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black">Confiance avant promesse.</p><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-300">ADSO AFRICA complète les dispositifs existants. Elle n’est pas une autorité publique et ne remplace pas les permis, examens ou certifications officiels des États.</p></div><span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-[#D7B45A]">Pensé pour l’Afrique · Conçu pour l’avenir</span></div>
    </section>
  </>;
}
