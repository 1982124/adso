'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
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
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import AboutSection from '@/components/sections/AboutSection';
import ADSOExperienceSection from '@/components/ADSOExperienceSection';
import LearningPlatform from '@/components/modules/learning/LearningPlatform';

const AIDrivingModule = dynamic(() => import('@/components/modules/v41/AIDrivingModule'), { ssr: false, loading: () => <ModuleLoader label="Conduite IA" /> });
const InsuranceModule = dynamic(() => import('@/components/modules/v41/InsuranceModule'), { ssr: false, loading: () => <ModuleLoader label="Assurance IA" /> });
const FleetModule = dynamic(() => import('@/components/modules/v41/FleetModule'), { ssr: false, loading: () => <ModuleLoader label="Gestion de Flotte" /> });
const EnterpriseModule = dynamic(() => import('@/components/modules/v41/EnterpriseModule'), { ssr: false, loading: () => <ModuleLoader label="Entreprise" /> });

function ModuleLoader({ label }: { label: string }) { return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center space-y-3"><div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto animate-spin" /><p className="text-slate-500 text-sm">Chargement {label}...</p></div></div>; }

export default function Home() {
  const { currentView } = useViewStore();
  useEffect(() => {
    if (currentView !== 'home') return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentView]);

  return <><ChunkLoadRecovery /><main role="main" aria-label="ADSO — éducation routière et mobilité sûre"><ViewErrorBoundary key={currentView}>{currentView === 'home' && <HomeView />}{currentView === 'learning' && <LearningPlatform />}{currentView === 'driving' && <AIDrivingModule />}{currentView === 'security' && <SecurityModuleView />}{currentView === 'insurance' && <InsuranceModule />}{currentView === 'fleet' && <FleetModule />}{currentView === 'enterprise' && <EnterpriseModule />}</ViewErrorBoundary></main><Footer /></>;
}

function HomeView() {
  return <><HeroRealisticHome /><ADSOExperienceSection /><AboutSection /><StatsSection /><EcosystemSection /><AIFeaturesSection /><QuizSection /><AIChatSection /><AnalyticsSection /><PricingSection /><RoadmapSection /><SecuritySection /></>;
}

function SecurityModuleView() { return <SecuritySection />; }
