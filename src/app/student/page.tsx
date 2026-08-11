'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LearnerCockpit from '@/components/sections/LearnerCockpit';

export default function StudentCockpitPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-14 lg:pt-16" aria-label="ADSO learner cockpit">
        <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">ADSO · Learner cockpit</p>
            <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">Votre salle de cours, votre progression, votre prochaine action.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Un espace d'apprentissage orienté preuve : cours, modules, progression et entraînement réunis dans une seule vue.</p>
          </div>
        </section>
        <LearnerCockpit />
      </main>
      <Footer />
    </>
  );
}
