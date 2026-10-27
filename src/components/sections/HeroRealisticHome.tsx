'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const audiences = [
  { number: '01', label: 'Citoyens et usagers', text: 'Piétons, passagers, cyclistes, conducteurs de deux-roues et automobilistes.', href: '/education' },
  { number: '02', label: 'Écoles et centres de formation', text: 'Des parcours d’apprentissage adaptés aux publics et aux situations de circulation.', href: '/student?profile=primaire' },
  { number: '03', label: 'Conducteurs et professionnels', text: 'Réviser les règles, analyser les risques et consolider les bons réflexes.', href: '/student?profile=taxi-voiture' },
  { number: '04', label: 'Institutions et collectivités', text: 'Soutenir les actions d’éducation, de prévention et de sensibilisation routière.', href: '/institutions' },
];

export default function HeroRealisticHome() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <p className="border-l-2 border-[#D7B45A] pl-3 text-xs font-bold uppercase tracking-[0.2em] text-[#E4C878] sm:text-sm">
              Sécurité routière · Éducation · Prévention
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-[2.45rem] font-bold leading-[1.04] tracking-[-0.04em] [overflow-wrap:anywhere] sm:text-5xl lg:text-[4.35rem]">
              Pour des routes africaines plus sûres, <span className="text-[#E4C878]">l’éducation doit agir avant l’accident.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
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
            <p className="mt-6 max-w-2xl border-t border-white/15 pt-4 text-sm leading-6 text-slate-300">
              Notre ambition est de contribuer à réduire les décès et les blessures sur les routes grâce à la prévention, à des apprentissages mesurables et à une culture durable de la mobilité sûre.
            </p>
          </div>

          <aside className="min-w-0 border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="Publics accompagnés par ADSO AFRICA">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E4C878]">Une action pour chaque public</p>
            <div className="mt-4 divide-y divide-white/15 border-y border-white/15">
              {audiences.map(({ number, label, text, href }) => (
                <Link key={number} href={href} className="group grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 py-4 transition-colors hover:bg-white/[0.04] sm:gap-4 sm:px-2">
                  <span className="pt-0.5 text-xs font-bold tabular-nums text-[#E4C878]">{number}</span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold leading-6 text-white">{label}</span>
                    <span className="mt-1 block break-words text-sm leading-6 text-slate-300">{text}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#E4C878]">Explorer <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 border-l-2 border-[#D7B45A] pl-4">
              <p className="text-sm font-semibold text-white">Observer. Comprendre. Décider. Progresser.</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">La démarche ADSO Immersif transforme les situations routières en occasions d’apprentissage et d’évaluation.</p>
            </div>
            <Link href="/institutions" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-[#D7B45A]/70 hover:bg-white/5 sm:w-auto">
              Espace institutions et formateurs <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
