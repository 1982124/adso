'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CarFront, ShieldCheck, Users, Landmark, School } from 'lucide-react';

const audiences = [
  { label: 'Citoyens & familles', text: 'Piétons, passagers, cyclistes et usagers de deux-roues', icon: Users, href: '/education' },
  { label: 'Élèves, étudiants & apprentis', text: 'Apprendre les bons réflexes dès le plus jeune âge', icon: BookOpen, href: '/student?profile=primaire' },
  { label: 'Conducteurs & professionnels', text: 'Anticiper les risques et renforcer ses compétences', icon: CarFront, href: '/student?profile=taxi-voiture' },
  { label: 'Établissements & formateurs', text: 'Structurer les parcours et suivre les apprentissages', icon: School, href: '/institutions' },
];

export default function HeroRealisticHome() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#0B1F33] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-14">
        <div className="mx-auto grid max-w-5xl items-center gap-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#D7B45A]/40 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#E4C878] sm:text-[11px]">
              <ShieldCheck className="size-4" aria-hidden="true" /> Éducation · Prévention · Mobilité sûre
            </p>
            <h1 className="mt-5 max-w-2xl text-[2.25rem] font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
              Chaque vie compte. <span className="text-[#E4C878]">La sécurité routière s’apprend.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              ADSO AFRICA est une plateforme numérique d’éducation routière, de formation à la mobilité et de prévention. Elle aide les citoyens à mieux comprendre les risques, les établissements à former et les institutions à renforcer leurs actions de sécurité routière.
            </p>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/90">
              Notre ambition : contribuer à réduire les décès et les blessures sur les routes africaines grâce à l’apprentissage, aux bons réflexes et à des compétences évaluables.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/education" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-[#0B1F33] transition hover:bg-[#E4C878]">
                Apprendre les bons réflexes <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link href="/formation/immersive" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10">
                Découvrir ADSO Immersif <span className="ml-2 text-[#E4C878]">▶</span>
              </Link>
              <Link href="/institutions" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-bold text-white/90 transition hover:bg-white/10">
                Espace institutions <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
            <div className="mt-5 rounded-xl border border-[#D7B45A]/25 bg-white/[0.04] p-4" aria-label="Méthode pédagogique ADSO Immersif">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E4C878]">La méthode ADSO Immersif</p>
              <ol className="mt-2 grid gap-2 text-xs font-semibold leading-5 text-slate-100 sm:grid-cols-2">
                <li><span className="mr-2 text-[#E4C878]">01</span>Observer une situation de risque</li>
                <li><span className="mr-2 text-[#E4C878]">02</span>Choisir comment réagir</li>
                <li><span className="mr-2 text-[#E4C878]">03</span>Comprendre les conséquences</li>
                <li><span className="mr-2 text-[#E4C878]">04</span>Évaluer et renforcer ses réflexes</li>
              </ol>
            </div>
            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {audiences.map(({ label, text, icon: Icon, href }) => (
                <Link key={label} href={href} className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3 transition hover:border-[#D7B45A]/60 hover:bg-white/[0.08]">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D7B45A]/10 text-[#E4C878]"><Icon className="size-4" aria-hidden="true" /></span>
                  <span><span className="block text-sm font-extrabold text-white">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-300">{text}</span></span>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-5 text-slate-400">Pensé pour les réalités africaines · Conçu pour tous les usagers de la route</p>
          </div>

        </div>
      </div>
    </section>
  );
}
