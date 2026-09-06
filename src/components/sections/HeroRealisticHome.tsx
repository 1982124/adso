'use client';

import Link from 'next/link';
import { ArrowRight, Bike, BookOpen, CarFront, ShieldCheck, TriangleAlert, Users } from 'lucide-react';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée', icon: BookOpen, profile: 'primaire' },
  { label: 'Étudiants', text: 'Université · permis · Code', icon: Users, profile: 'universitaire' },
  { label: 'Apprentis', text: 'Tous secteurs d’activité', icon: ShieldCheck, profile: 'apprenti' },
  { label: 'Conducteurs', text: 'Prévention · perfectionnement', icon: CarFront, profile: 'taxi-voiture' },
];

export default function HeroRealisticHome() {
  return <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
    <div className="mx-auto max-w-7xl px-4 pb-9 pt-20 sm:px-6 lg:px-8 lg:pb-11">
      <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-9">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7B45A] sm:text-[11px]">Une ambition africaine · un impact humain</p>
          <h1 className="mt-3 max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.035em] sm:text-[2.35rem] lg:text-[2.75rem]">Construire une mobilité plus sûre, tout au long de la vie.</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-200 sm:text-base">ADSO construit une infrastructure numérique dédiée à l’éducation, à la prévention, à la simulation et au développement des compétences de mobilité sûre, accessible aux publics africains sans les enfermer dans un seul contexte national.</p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link href="/education" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-[#0B1F33] hover:bg-[#E4C878]">Découvrir les contenus gratuits <ArrowRight className="ml-2 size-4" /></Link>
            <Link href="/formation/immersive" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10"><span className="mr-2 text-[#D7B45A]">▶</span> ADSO Immersif</Link>
          </div>
          <div id="parcours" className="mt-5 grid max-w-xl gap-2 sm:grid-cols-2">{audiences.map(({ label, text, icon: Icon, profile }) => <Link key={label} href={`/student?profile=${profile}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 hover:bg-white/[0.08]"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#D7B45A]"><Icon className="size-4" /></span><div><p className="text-sm font-extrabold text-white">{label}</p><p className="text-[11px] text-slate-300">{text}</p><p className="mt-1 text-[10px] font-bold text-[#D7B45A]">Construire mon parcours →</p></div></Link>)}</div>
        </div>

        <figure className="min-w-0">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] border border-white/15 bg-gradient-to-br from-[#163B57] via-[#0E2A42] to-[#07131F] p-5 shadow-2xl shadow-black/40 sm:min-h-[430px]">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#D7B45A]" />
            <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D7B45A]">ADSO · scène d’apprentissage</p>
                  <h2 className="mt-2 max-w-md text-3xl font-black leading-tight sm:text-4xl">ATTENTION<br />AUX ÉLÈVES</h2>
                  <p className="mt-2 max-w-sm text-sm leading-5 text-slate-200">Une situation réelle devient une leçon : observer, anticiper, décider, comprendre la conséquence.</p>
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#D7B45A]/40 bg-[#D7B45A]/10 text-[#D7B45A]" aria-hidden="true"><TriangleAlert className="size-7" /></span>
              </div>

              <div className="relative mt-8 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/15">
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[#07131F]" />
                <div className="absolute left-[9%] bottom-8 flex flex-col items-center gap-2">
                  <div className="rounded-full bg-[#D7B45A] px-3 py-1 text-[9px] font-black uppercase text-[#0B1F33]">École</div>
                  <div className="h-24 w-32 rounded-t-3xl border-2 border-white/20 bg-[#123653] sm:h-28 sm:w-40"><div className="mx-auto mt-6 h-10 w-10 rounded bg-[#D7B45A]/80" /></div>
                </div>
                <div className="absolute left-[43%] bottom-7 flex flex-col items-center text-[#D7B45A]">
                  <Bike className="size-16 sm:size-20" strokeWidth={1.5} aria-hidden="true" />
                  <span className="mt-1 rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold text-white">Élève · vigilance</span>
                </div>
                <div className="absolute right-[8%] bottom-7 flex flex-col items-center text-slate-200">
                  <CarFront className="size-20 sm:size-24" strokeWidth={1.4} aria-hidden="true" />
                  <span className="mt-1 rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold text-white">Taxi-moto · prudence</span>
                </div>
                <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-xl border border-[#D7B45A]/50 bg-[#D7B45A] px-4 py-2 text-center text-[10px] font-black uppercase tracking-wide text-[#0B1F33] shadow-lg">Ralentir · observer · protéger</div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">1 · Observer</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">2 · Décider</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">3 · Comprendre</div>
              </div>
            </div>
          </div>
          <figcaption className="mt-2 text-[10px] leading-4 text-slate-300">Une scène visible et lisible dès l’arrivée sur ADSO · apprendre par la situation, développer les bons réflexes.</figcaption>
        </figure>
      </div>
    </div>
  </section>;
}
