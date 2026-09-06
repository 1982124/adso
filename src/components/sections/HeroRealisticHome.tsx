'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CarFront, ShieldCheck, Users } from 'lucide-react';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée', icon: BookOpen, profile: 'primaire' },
  { label: 'Étudiants', text: 'Université · permis · Code', icon: Users, profile: 'universitaire' },
  { label: 'Apprentis', text: 'Tous secteurs d’activité', icon: ShieldCheck, profile: 'apprenti' },
  { label: 'Conducteurs', text: 'Prévention · perfectionnement', icon: CarFront, profile: 'taxi-voiture' },
];

export default function HeroRealisticHome() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-[11px]">Une ambition africaine · un impact humain</p>
            <h1 className="mt-3 max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.035em] sm:text-[2.35rem] lg:text-[2.75rem]">Construire une mobilité plus sûre, tout au long de la vie.</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-200 sm:text-base">ADSO construit une infrastructure numérique dédiée à l’éducation, à la prévention, à la simulation et au développement des compétences de mobilité sûre, accessible aux publics africains sans les enfermer dans un seul contexte national.</p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link href="/education" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir les contenus gratuits <ArrowRight className="ml-2 size-4" /></Link>
              <Link href="/formation/immersive" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10"><span className="mr-2 text-[#D7B45A]">▶</span> ADSO Immersif</Link>
            </div>
            <div id="parcours" className="mt-5 grid max-w-xl gap-2 sm:grid-cols-2">
              {audiences.map(({ label, text, icon: Icon, profile }) => (
                <Link key={label} href={`/student?profile=${profile}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 hover:bg-white/[0.08]">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon className="size-4" /></span>
                  <div><p className="text-sm font-extrabold text-white">{label}</p><p className="text-[11px] text-slate-300">{text}</p><p className="mt-1 text-[10px] font-bold text-[#D7B45A]">Construire mon parcours →</p></div>
                </Link>
              ))}
            </div>
          </div>

          <figure className="min-w-0">
            <div className="overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#07131F] shadow-2xl shadow-black/40">
              <img src="/images/home/adso-mobilite-ecole.svg" alt="Zone scolaire et mobilité sûre : élèves, vélo équipé d'un casque, taxi-moto et signalisation de vigilance" className="block h-auto w-full" width="1200" height="760" fetchPriority="high" />
            </div>
            <figcaption className="mt-2 text-[10px] leading-4 text-slate-300">Une scène éditoriale distincte du reste du parcours : la route devient un espace d’apprentissage, d’observation et d’anticipation.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
