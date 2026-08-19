'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LearnerCockpit from '@/components/sections/LearnerCockpit';
import LearnerOnboarding from '@/components/modules/learning/LearnerOnboarding';
import { useLocaleStore } from '@/stores/locale-store';

const STORAGE_KEY = 'adso-learner-onboarding-v2';

export default function StudentCockpitPage() {
  const country = useLocaleStore((s) => s.country);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem('adso-learner-onboarding-v1');
    setOnboardingComplete(Boolean(saved && country.code !== 'ZZ'));
  }, [country.code]);

  const completeOnboarding = () => setOnboardingComplete(true);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-14 lg:pt-16" aria-label="ADSO learner cockpit">
        <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">ADSO · Parcours apprenant</p>
            <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">Commencez par construire votre parcours.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Choisissez votre pays, votre langue, votre profil et votre objectif. ADSO adaptera ensuite votre expérience d'apprentissage.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!onboardingComplete ? (
            <LearnerOnboarding onComplete={completeOnboarding} />
          ) : (
            <LearnerCockpit />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
