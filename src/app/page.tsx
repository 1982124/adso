'use client';

import dynamic from 'next/dynamic';
import { useViewStore } from '@/stores/view-store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

// Blueprint — lazy loaded to avoid impacting initial load
const BluePrintLayout = dynamic(
  () => import('@/components/BluePrintLayout'),
  { ssr: false }
);
const BluePrintCover = dynamic(
  () => import('@/components/BluePrintCover'),
  { ssr: false }
);
const VisionEntreprise = dynamic(
  () => import('@/components/parts/VisionEntreprise'),
  { ssr: false }
);
const EcosystemeComplet = dynamic(
  () => import('@/components/parts/EcosystemeComplet'),
  { ssr: false }
);
const ArchitectureTechnique = dynamic(
  () => import('@/components/parts/ArchitectureTechnique'),
  { ssr: false }
);
const AISCArchitecture = dynamic(
  () => import('@/components/parts/AISCArchitecture'),
  { ssr: false }
);
const IAProduit = dynamic(
  () => import('@/components/parts/IAProduit'),
  { ssr: false }
);
const Monetisation = dynamic(
  () => import('@/components/parts/Monetisation'),
  { ssr: false }
);
const SecuriteEntreprise = dynamic(
  () => import('@/components/parts/SecuriteEntreprise'),
  { ssr: false }
);
const InternationalisationPart = dynamic(
  () => import('@/components/parts/Internationalisation'),
  { ssr: false }
);
const UXUIDesign = dynamic(
  () => import('@/components/parts/UXUIDesign'),
  { ssr: false }
);
const DataAnalyticsPart = dynamic(
  () => import('@/components/parts/DataAnalytics'),
  { ssr: false }
);
const DevOps = dynamic(
  () => import('@/components/parts/DevOps'),
  { ssr: false }
);
const RoadmapPart = dynamic(
  () => import('@/components/parts/Roadmap'),
  { ssr: false }
);
const DirectivesIA = dynamic(
  () => import('@/components/parts/DirectivesIA'),
  { ssr: false }
);

export default function Home() {
  const { currentView } = useViewStore();

  return (
    <>
      <Navbar />
      <main role="main" aria-label="ADSO — Auto Drive School Online">
        {currentView === 'app' && <AppView />}
        {currentView === 'blueprint' && <BlueprintView />}
      </main>
      {currentView === 'app' && <Footer />}
    </>
  );
}

function AppView() {
  return (
    <>
      <HeroSection />
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
          ADSO — Auto Drive School Online | Blueprint v1.0 | Août 2026 | Confidentiel
        </p>
        <p className="text-slate-600 text-xs mt-2">
          © 2026 ADSO Engineering. Tous droits réservés.
        </p>
      </footer>
    </BluePrintLayout>
  );
}
