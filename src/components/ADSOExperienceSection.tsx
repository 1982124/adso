'use client';

import Link from 'next/link';
import { ArrowRight, Bike, CarFront, GraduationCap, HardHat, School, ShieldCheck } from 'lucide-react';

const groups = [
  {
    number: '01',
    label: 'ÉDUCATION ROUTIÈRE DES JEUNES',
    description: 'Développer les connaissances et les comportements sûrs à chaque étape de la scolarité.',
    items: [
      { icon: School, age: 'École primaire', title: 'Découvrir les situations de circulation', text: 'Repérer les dangers, comprendre les panneaux et apprendre à se déplacer avec prudence.' },
      { icon: School, age: 'Collège', title: 'Comprendre les risques routiers', text: 'Analyser la visibilité, les traversées, la vitesse et les interactions entre usagers.' },
      { icon: GraduationCap, age: 'Lycée', title: 'Préparer une mobilité responsable', text: 'Comprendre la distraction, la vitesse, les distances et les décisions à risque.' },
    ],
  },
  {
    number: '02',
    label: 'ÉTUDIANTS ET FUTURS CONDUCTEURS',
    description: 'Renforcer les connaissances en complément des dispositifs officiels de formation au permis.',
    items: [
      { icon: GraduationCap, age: 'Préparation au permis', title: 'Réviser les règles de circulation', text: 'Travailler les connaissances, les situations de risque et les principes de conduite responsable.' },
      { icon: ShieldCheck, age: 'Formation continue', title: 'Consolider les bons réflexes', text: 'Réexaminer les situations courantes et améliorer la prise de décision.' },
    ],
  },
  {
    number: '03',
    label: 'APPRENTIS ET CONDUCTEURS',
    description: 'Faire de la sécurité une compétence qui se développe avec la pratique et l’expérience.',
    items: [
      { icon: HardHat, age: 'Apprentissage', title: 'Comprendre les risques en situation', text: 'Observer l’environnement, anticiper les dangers et prendre des décisions adaptées.' },
      { icon: CarFront, age: 'Conducteurs', title: 'Actualiser ses connaissances', text: 'Entretenir sa vigilance et réviser les principes de circulation et de prévention.' },
    ],
  },
  {
    number: '04',
    label: 'MOBILITÉ PROFESSIONNELLE',
    description: 'Tenir compte des contraintes spécifiques des déplacements professionnels.',
    items: [
      { icon: Bike, age: 'Taxi-moto', title: 'Prévenir les risques du transport à deux-roues', text: 'Vigilance, protection, transport du passager et anticipation dans le trafic.' },
      { icon: CarFront, age: 'Taxi et voiture', title: 'Renforcer les pratiques de conduite sûre', text: 'Gestion des passagers, distances, fatigue et vigilance sur les trajets.' },
    ],
  },
];

export default function ADSOExperienceSection() {
  return (
    <section id="parcours" className="bg-white py-14 sm:py-18" aria-labelledby="journeys-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Parcours de formation</p>
          <h2 id="journeys-heading" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">Des apprentissages adaptés aux réalités de la mobilité.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">ADSO propose des entrées pédagogiques selon les publics et les situations. Les contenus réglementaires doivent être adaptés au pays et vérifiés à partir de sources officielles.</p>
        </div>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.number} className="border-t border-slate-200 pt-6" aria-labelledby={`group-${group.number}`}>
              <div className="mb-5 grid gap-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold tabular-nums text-emerald-800">{group.number}</span>
                  <h3 id={`group-${group.number}`} className="text-sm font-bold uppercase tracking-[0.1em] text-slate-900">{group.label}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-600 md:text-right">{group.description}</p>
              </div>
              <div className={`grid gap-0 border-y border-slate-200 ${group.items.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
                {group.items.map(({ icon: Icon, age, title, text }) => (
                  <Link key={age} href="/student" className="group flex min-w-0 gap-4 border-b border-slate-200 px-3 py-5 transition-colors hover:bg-slate-50 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                    <span className="mt-1 flex size-9 shrink-0 items-center justify-center border border-slate-200 bg-white text-[#0B1F33]"><Icon className="size-4" aria-hidden="true" /></span>
                    <span className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{age}</span>
                      <span className="mt-1 block text-base font-bold leading-6 text-slate-950">{title}</span>
                      <span className="mt-2 block text-sm leading-6 text-slate-600">{text}</span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800">Accéder au parcours <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Formation continue</p>
            <p className="mt-1 text-lg font-bold text-slate-950">La sécurité routière s’entretient dans la durée.</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Les scènes immersives et les évaluations permettent de travailler les décisions et de suivre les acquis disponibles.</p>
          </div>
          <Link href="/student" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-slate-300 px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-slate-500 hover:bg-slate-50">Voir les parcours <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
