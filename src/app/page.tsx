'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import EcosystemSection from '@/components/sections/EcosystemSection';
import AIFeaturesSection from '@/components/sections/AIFeaturesSection';
import StudentDashboard from '@/components/sections/StudentDashboard';
import QuizSection from '@/components/sections/QuizSection';
import AIChatSection from '@/components/sections/AIChatSection';
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import PricingSection from '@/components/sections/PricingSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import SecuritySection from '@/components/sections/SecuritySection';
import Footer from '@/components/Footer';

export default function Home() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <EcosystemSection />
          <AIFeaturesSection />

          {/* Divider before demo sections */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Découvrez la plateforme en action
              </h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Explorez les fonctionnalités interactives d&apos;ADSO : tableau de bord élève,
                quiz adaptatifs, IA Coach et analyses en temps réel.
              </p>
            </div>
          </div>

          <StudentDashboard />
          <QuizSection />
          <AIChatSection />
          <AnalyticsSection />

          <PricingSection />
          <RoadmapSection />
          <SecuritySection />

          {/* Final CTA Section */}
          <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Prêt à révolutionner votre apprentissage ?
              </h2>
              <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">
                Rejoignez plus de 2 millions d&apos;élèves qui font confiance à ADSO pour leur
                formation à la conduite. Commencez gratuitement aujourd&apos;hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 transition-colors text-lg shadow-lg">
                  Commencer gratuitement
                </button>
                <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg">
                  Voir les tarifs
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </QueryClientProvider>
  );
}
