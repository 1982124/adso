'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LearnerCockpit from '@/components/sections/LearnerCockpit';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentCockpitPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-14 lg:pt-16" aria-label="ADSO learner cockpit">
        <section className="relative z-0 border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-emerald-300">
                  <GraduationCap className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">ADSO · Learner cockpit</p>
                </div>
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">Votre salle de cours, votre progression, votre prochaine action.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Un espace d'apprentissage orienté preuve : cours, modules, progression et entraînement réunis dans une seule vue.</p>
              </div>
              <Button variant="outline" className="w-fit border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-900" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
              </Button>
            </div>
          </div>
        </section>
        <section className="relative z-0 pointer-events-auto">
          <LearnerCockpit />
        </section>
      </main>
      <Footer />
    </>
  );
}
