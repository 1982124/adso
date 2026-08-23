'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect } from 'react';
import { useViewStore } from '@/stores/view-store';
import Footer from '@/components/Footer';
import ViewErrorBoundary from '@/components/ViewErrorBoundary';
import ChunkLoadRecovery from '@/components/ChunkLoadRecovery';
import HeroRealisticHome from '@/components/sections/HeroRealisticHome';
import StatsSection from '@/components/sections/StatsSection';
import EcosystemSection from '@/components/sections/EcosystemSection';
import AIFeaturesSection from '@/components/sections/AIFeaturesSection';
import QuizSection from '@/components/sections/QuizSection';
import AIChatSection from '@/components/sections/AIChatSection';
import PricingSection from '@/components/sections/PricingSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import SecuritySection from '@/components/sections/SecuritySection';
import AboutSection from '@/components/sections/AboutSection';
import ADSOExperienceSection from '@/components/ADSOExperienceSection';
import LearningPlatform from '@/components/modules/learning/LearningPlatform';
import RealWorldScenes from '@/components/modules/learning/RealWorldScenes';

const AIDrivingModule = dynamic(() => import('@/components/modules/v41/AIDrivingModule'), { ssr: false, loading: () => <ModuleLoader label="Formation mobilité" /> });
const EnterpriseModule = dynamic(() => import('@/components/modules/v41/EnterpriseModule'), { ssr: false, loading: () => <ModuleLoader label="Établissements" /> });

function ModuleLoader({ label }: { label: string }) {
  return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center space-y-3"><div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto animate-spin" /><p className="text-slate-500 text-sm">Chargement {label}...</p></div></div>;
}

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
    if (window.location.hash && !['#ebooks', '#pricing', '#tarifs'].includes(window.location.hash)) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('pageshow', reset);
      window.history.scrollRestoration = previous;
    };
  }, []);

  return <><ChunkLoadRecovery /><main role="main" aria-label="ADSO — formation à la mobilité et éducation routière"><ViewErrorBoundary key={currentView}>{currentView === 'home' && <HomeView />}{currentView === 'learning' && <LearningPlatform />}{currentView === 'driving' && <AIDrivingModule />}{currentView === 'security' && <SecurityModuleView />}{currentView === 'enterprise' && <EnterpriseModule />}</ViewErrorBoundary></main><Footer /></>;
}

function HomeView() {
  return <>
    <HeroRealisticHome />
    <ADSOExperienceSection />
    <section id="scenes-reelles" className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl"><RealWorldScenes /></div>
    </section>
    <AboutSection />
    <StatsSection />
    <EcosystemSection />
    <AIFeaturesSection />
    <QuizSection />
    <AIChatSection />
    <section id="ebooks" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">ADSO E-books</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Apprendre, lire et progresser</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Des contenus éducatifs numériques consacrés à la mobilité, à la prévention et à la sécurité routière.</p>
        <a href="#ebooks" aria-current="page" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">Explorer les e-books</a>
      </div>
    </section>
    <div id="tarifs" className="scroll-mt-20"><PricingSection /></div>
    <RoadmapSection />
    <SecuritySection />
  </>;
}

function SecurityModuleView() { return <SecuritySection />; }
