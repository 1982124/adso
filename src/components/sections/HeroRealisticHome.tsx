'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CarFront, ShieldCheck, Users } from 'lucide-react';

const audiences = [
  { label: 'Élèves', text: 'École, collège et lycée · Je découvre la route', icon: BookOpen, profile: 'primaire' },
  { label: 'Étudiants', text: 'Université · permis · Code', icon: Users, profile: 'universitaire' },
  { label: 'Apprentis', text: 'Tous secteurs d’activité · mobilité', icon: ShieldCheck, profile: 'apprenti' },
  { label: 'Conducteurs', text: 'Prévention · perfectionnement', icon: CarFront, profile: 'taxi-voiture' },
];

export default function HeroRealisticHome() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E4C878] sm:text-sm">
            Sécurité routière · Éducation · Prévention
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-[2.45rem] font-bold leading-[1.04] tracking-[-0.04em] [overflow-wrap:anywhere] sm:text-5xl lg:text-[4.35rem]">
            Pour des routes africaines plus sûres, <span className="text-[#E4C878]">l’éducation doit agir avant l’accident.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            ADSO AFRICA est une plateforme numérique dédiée à l’éducation routière, à la formation à la mobilité et à la prévention. Elle accompagne les usagers, les établissements et les acteurs publics dans l’apprentissage des comportements qui protègent les vies.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/education" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#D7B45A] px-5 py-3 text-center text-sm font-bold leading-5 text-[#0B1F33] transition-colors hover:bg-[#E4C878] sm:w-auto">
              Accéder aux formations <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/formation/immersive" className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/35 px-5 py-3 text-center text-sm font-semibold leading-5 text-white transition-colors hover:bg-white/10 sm:w-auto">
              Découvrir la formation immersive
            </Link>
          </div>
          <p className="mt-6 max-w-3xl border-t border-white/15 pt-4 text-sm leading-6 text-slate-300">
            Notre ambition est de contribuer à réduire les décès et les blessures sur les routes grâce à la prévention, à des apprentissages mesurables et à une culture durable de la mobilité sûre.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 border-t border-white/20 pt-7 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E4C878]">Une action pour chaque public</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Des ressources adaptées aux réalités de chaque usager et de chaque contexte d’apprentissage.</p>
          </div>
          <div className="grid gap-0 divide-y divide-white/15 border-y border-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {audiences.map(({ label, text, icon: Icon, profile }) => (
              <Link key={label} href={`/student?profile=${profile}`} className="group flex min-w-0 items-start gap-3 px-3 py-4 transition-colors hover:bg-white/[0.04] sm:border-b sm:border-white/15 sm:odd:border-r sm:odd:pr-4 sm:even:pl-4 sm:nth-last-[-n+2]:border-b-0">
                <Icon className="mt-1 size-4 shrink-0 text-[#E4C878]" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-5 text-white">{label}</span>
                  <span className="mt-1 block break-words text-xs leading-5 text-slate-300">{text}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#E4C878]">Construire mon parcours <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
