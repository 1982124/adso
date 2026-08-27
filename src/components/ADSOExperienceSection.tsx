'use client';

import Link from 'next/link';
import { ArrowRight, Bike, CarFront, GraduationCap, HardHat, School, ShieldCheck, Sparkles } from 'lucide-react';

const groups = [
  {
    number: '01',
    label: 'JEUNE USAGER',
    description: 'Construire les premiers réflexes de mobilité sûre.',
    items: [
      { icon: School, age: 'École', title: 'Je découvre la route', text: 'Situations simples, images et défis pour apprendre les premiers réflexes.', tone: 'bg-amber-50 border-amber-200 text-amber-950', iconTone: 'bg-amber-500 text-white' },
      { icon: School, age: 'Collège', title: 'Je comprends la circulation', text: 'Panneaux, dangers, usagers vulnérables et décisions du quotidien.', tone: 'bg-sky-50 border-sky-200 text-sky-950', iconTone: 'bg-sky-600 text-white' },
      { icon: GraduationCap, age: 'Lycée', title: 'Je prépare ma mobilité', text: 'Anticipation, vitesse, distraction et premiers réflexes du futur conducteur.', tone: 'bg-violet-50 border-violet-200 text-violet-950', iconTone: 'bg-violet-600 text-white' },
    ],
  },
  {
    number: '02',
    label: 'ÉTUDIANT & FUTUR CONDUCTEUR',
    description: 'Préparer son permis ou renforcer sa maîtrise du Code de la circulation.',
    items: [
      { icon: GraduationCap, age: 'Université · Permis', title: 'Je prépare mon permis', text: 'Code, conduite, risques et mobilité responsable pour préparer la suite.', tone: 'bg-emerald-50 border-emerald-200 text-emerald-950', iconTone: 'bg-emerald-600 text-white' },
      { icon: ShieldCheck, age: 'Université · Code', title: 'Je maîtrise le Code de la circulation', text: 'Réviser, comprendre les règles et développer de meilleurs réflexes.', tone: 'bg-teal-50 border-teal-200 text-teal-950', iconTone: 'bg-teal-600 text-white' },
    ],
  },
  {
    number: '03',
    label: 'APPRENTI & CONDUCTEUR',
    description: 'Passer de l’apprentissage à une conduite plus sûre et plus autonome.',
    items: [
      { icon: HardHat, age: 'Apprentissage', title: 'Je me prépare à conduire', text: 'Observer, manœuvrer, décider et gérer les situations du quotidien.', tone: 'bg-orange-50 border-orange-200 text-orange-950', iconTone: 'bg-orange-600 text-white' },
      { icon: CarFront, age: 'Conducteur', title: 'Je développe mes compétences', text: 'Entretenir ses connaissances, anticiper les risques et améliorer ses décisions.', tone: 'bg-slate-50 border-slate-200 text-slate-950', iconTone: 'bg-slate-800 text-white' },
    ],
  },
  {
    number: '04',
    label: 'MOBILITÉ PROFESSIONNELLE',
    description: 'Renforcer les compétences des conducteurs exposés aux réalités du trafic.',
    items: [
      { icon: Bike, age: 'Taxi-moto', title: 'Je maîtrise ma conduite professionnelle', text: 'Passager, trafic, vigilance, anticipation et sécurité à chaque course.', tone: 'bg-cyan-50 border-cyan-200 text-cyan-950', iconTone: 'bg-cyan-700 text-white' },
      { icon: CarFront, age: 'Taxi & voiture', title: 'Je perfectionne ma conduite professionnelle', text: 'Révision, anticipation, passagers et conduite sûre au quotidien.', tone: 'bg-blue-50 border-blue-200 text-blue-950', iconTone: 'bg-blue-700 text-white' },
    ],
  },
];

export default function ADSOExperienceSection() {
  return (
    <section id="parcours" className="relative overflow-hidden bg-[#f7f8f4] py-14 sm:py-18" aria-labelledby="journeys-heading">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 shadow-sm"><Sparkles className="size-3.5" aria-hidden="true" /> Une même mission · des parcours adaptés</span>
          <h2 id="journeys-heading" className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">ADSO grandit avec chaque personne.</h2>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">De l’école à la vie professionnelle, chacun avance selon son âge, son niveau, sa mobilité et ses objectifs.</p>
        </div>

        <div className="mt-9 space-y-9">
          {groups.map((group) => (
            <div key={group.number} className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-black tracking-[0.18em] text-emerald-700">{group.number}</span>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-900">{group.label}</h3>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-right">{group.description}</p>
              </div>
              <div className={`grid gap-4 ${group.items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
                {group.items.map(({ icon: Icon, age, title, text, tone, iconTone }) => (
                  <Link key={`${group.number}-${age}`} href="/student" className={`group rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${tone}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${iconTone}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] opacity-60">{age}</span>
                    </div>
                    <h4 className="mt-5 text-lg font-black leading-tight">{title}</h4>
                    <p className="mt-2 text-sm leading-6 opacity-75">{text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold">Commencer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Formation continue · tous les âges</p>
            <p className="mt-1 text-base font-bold text-slate-900">Je progresse chaque jour.</p>
            <p className="mt-1 text-sm text-slate-600">Mini-défis, scènes immersives et progression visible pour entretenir les compétences dans la durée.</p>
          </div>
          <Link href="/student" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">Continuer mon parcours <ArrowRight className="ml-2 size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
