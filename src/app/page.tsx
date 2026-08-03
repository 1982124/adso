'use client';

import BluePrintLayout from '@/components/BluePrintLayout';
import BluePrintCover from '@/components/BluePrintCover';
import VisionEntreprise from '@/components/parts/VisionEntreprise';
import EcosystemeComplet from '@/components/parts/EcosystemeComplet';
import ArchitectureTechnique from '@/components/parts/ArchitectureTechnique';
import AISCArchitecture from '@/components/parts/AISCArchitecture';
import IAProduit from '@/components/parts/IAProduit';
import Monetisation from '@/components/parts/Monetisation';
import SecuriteEntreprise from '@/components/parts/SecuriteEntreprise';
import Internationalisation from '@/components/parts/Internationalisation';
import UXUIDesign from '@/components/parts/UXUIDesign';
import DataAnalytics from '@/components/parts/DataAnalytics';
import DevOps from '@/components/parts/DevOps';
import Roadmap from '@/components/parts/Roadmap';
import DirectivesIA from '@/components/parts/DirectivesIA';

export default function Home() {
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
      <Internationalisation />
      <UXUIDesign />
      <DataAnalytics />
      <DevOps />
      <Roadmap />
      <DirectivesIA />

      {/* Final page footer */}
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
