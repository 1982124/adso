'use client';

import dynamic from 'next/dynamic';
import { useViewStore } from '@/stores/view-store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ViewErrorBoundary from '@/components/ViewErrorBoundary';

import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import EcosystemSection from '@/components/sections/EcosystemSection';
import AIFeaturesSection from '@/components/sections/AIFeaturesSection';
import StudentDashboard from '@/components/sections/StudentDashboard';
import QuizSection from '@/components/sections/QuizSection';
import AIChatSection from '@/components/sections/AIChatSection';
import PricingSection from '@/components/sections/PricingSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import SecuritySection from '@/components/sections/SecuritySection';
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import AboutSection from '@/components/sections/AboutSection';

const LearningPlatform = dynamic(() => import('@/components/modules/learning/LearningPlatform'), { ssr: false, loading: () => <ModuleLoader label="Formation" /> });
const MechanicModule = dynamic(() => import('@/components/modules/MechanicModule'), { ssr: false, loading: () => <ModuleLoader label="Mécanicien IA" /> });
const ScannerModule = dynamic(() => import('@/components/modules/ScannerModule'), { ssr: false, loading: () => <ModuleLoader label="Scanner Véhicule" /> });
const TelematicsModule = dynamic(() => import('@/components/modules/TelematicsModule'), { ssr: false, loading: () => <ModuleLoader label="Télématique" /> });
const SecurityModule = dynamic(() => import('@/components/modules/SecurityModule'), { ssr: false, loading: () => <ModuleLoader label="Sécurité" /> });
const MarketplaceModule = dynamic(() => import('@/components/modules/MarketplaceModule'), { ssr: false, loading: () => <ModuleLoader label="Marketplace" /> });

const AIDrivingModule = dynamic(() => import('@/components/modules/v41/AIDrivingModule'), { ssr: false, loading: () => <ModuleLoader label="Conduite IA" /> });
const InsuranceModule = dynamic(() => import('@/components/modules/v41/InsuranceModule'), { ssr: false, loading: () => <ModuleLoader label="Assurance IA" /> });
const FleetModule = dynamic(() => import('@/components/modules/v41/FleetModule'), { ssr: false, loading: () => <ModuleLoader label="Gestion de Flotte" /> });
const GovernmentModule = dynamic(() => import('@/components/modules/v41/GovernmentModule'), { ssr: false, loading: () => <ModuleLoader label="Gouvernement" /> });
const EnterpriseModule = dynamic(() => import('@/components/modules/v41/EnterpriseModule'), { ssr: false, loading: () => <ModuleLoader label="Entreprise" /> });

const BluePrintLayout = dynamic(() => import('@/components/BluePrintLayout'), { ssr: false });
const BluePrintCover = dynamic(() => import('@/components/BluePrintCover'), { ssr: false });
const VisionEntreprise = dynamic(() => import('@/components/parts/VisionEntreprise'), { ssr: false });
const EcosystemeComplet = dynamic(() => import('@/components/parts/EcosystemeComplet'), { ssr: false });
const ArchitectureTechnique = dynamic(() => import('@/components/parts/ArchitectureTechnique'), { ssr: false });
const AISCArchitecture = dynamic(() => import('@/components/parts/AISCArchitecture'), { ssr: false });
const IAProduit = dynamic(() => import('@/components/parts/IAProduit'), { ssr: false });
const Monetisation = dynamic(() => import('@/components/parts/Monetisation'), { ssr: false });
const SecuriteEntreprise = dynamic(() => import('@/components/parts/SecuriteEntreprise'), { ssr: false });
const InternationalisationPart = dynamic(() => import('@/components/parts/Internationalisation'), { ssr: false });
const UXUIDesign = dynamic(() => import('@/components/parts/UXUIDesign'), { ssr: false });
const DataAnalyticsPart = dynamic(() => import('@/components/parts/DataAnalytics'), { ssr: false });
const DevOps = dynamic(() => import('@/components/parts/DevOps'), { ssr: false });
const RoadmapPart = dynamic(() => import('@/components/parts/Roadmap'), { ssr: false });
const DirectivesIA = dynamic(() => import('@/components/parts/DirectivesIA'), { ssr: false });

function ModuleLoader({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Chargement {label}...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { currentView } = useViewStore();

  return (
    <>
      <Navbar />
      <main role="main" aria-label="ADSO — AI-Driven & Smart Operations">
        <ViewErrorBoundary key={currentView}>
          {currentView === 'home' && <HomeView />}
          {currentView === 'learning' && <LearningPlatform />}
          {currentView === 'driving' && <AIDrivingModule />}
          {currentView === 'mechanic' && <MechanicModule />}
          {currentView === 'scanner' && <ScannerModule />}
          {currentView === 'telematics' && <TelematicsModule />}
          {currentView === 'security' && <SecurityModule />}
          {currentView === 'marketplace' && <MarketplaceModule />}
          {currentView === 'insurance' && <InsuranceModule />}
          {currentView === 'fleet' && <FleetModule />}
          {currentView === 'government' && <GovernmentModule />}
          {currentView === 'enterprise' && <EnterpriseModule />}
          {currentView === 'blueprint' && <BlueprintView />}
        </ViewErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

function HomeView() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <EcosystemSection />
      <AIFeaturesSection />
      <StudentDashboard />
      <QuizSection />
      <AIChatSection />
      <AnalyticsSection />
      <PricingSection />
      <RoadmapSection />
      <SecuritySection />
    </>
  );
}

function BlueprintView() {
  return (
    <BluePrintLayout>
      <BluePrintCover />
      <VisionEntreprise />
      <EcosystemeComplet />
      <ArchitectureTechnique />
      <AISCArchitecture />
      <IAProduit />
      <Monetisation />
      <SecuriteEntreprise />
      <InternationalisationPart />
      <UXUIDesign />
      <DataAnalyticsPart />
      <DevOps />
      <RoadmapPart />
      <DirectivesIA />
      <footer className="border-t border-slate-800 py-12 px-6 text-center">
        <p className="text-slate-500 text-sm">
          ADSO — AI-Driven & Smart Operations | Blueprint v1.0 | Août 2026 | Confidentiel
        </p>
        <p className="text-slate-600 text-xs mt-2">
          © 2026 ADSO Engineering. Tous droits réservés.
        </p>
      </footer>
    </BluePrintLayout>
  );
}
