'use client';

import { ArrowRight, Baby, Bike, CarFront, GraduationCap, HardHat, School, ShieldCheck } from 'lucide-react';
import { useViewStore, type LearningTab } from '@/stores/view-store';

const journeys: { icon: typeof Baby; age: string; title: string; text: string; tone: string; iconTone: string; tab: LearningTab }[] = [
  { icon: Baby, age: 'Primaire', title: 'Je découvre la route', text: 'Des situations simples, des images et des défis pour apprendre en s’amusant.', tone: 'bg-amber-50 border-amber-200 text-amber-900', iconTone: 'bg-amber-400 text-white', tab: 'explorer' },
  { icon: School, age: 'Secondaire', title: 'Je comprends la circulation', text: 'Panneaux, dangers et réflexes pour devenir un usager attentif.', tone: 'bg-sky-50 border-sky-200 text-sky-950', iconTone: 'bg-sky-500 text-white', tab: 'signalisation' },
  { icon: GraduationCap, age: 'Lycée', title: 'Je prépare ma mobilité', text: 'Anticipation, vitesse, distraction et premiers réflexes du futur conducteur.', tone: 'bg-violet-50 border-violet-200 text-violet-950', iconTone: 'bg-violet-500 text-white', tab: 'cours' },
  { icon: HardHat, age: 'Apprentis', title: 'Je me prépare à conduire', text: 'Observer, manœuvrer, décider et gérer les situations du quotidien.', tone: 'bg-orange-50 border-orange-200 text-orange-950', iconTone: 'bg-orange-500 text-white', tab: 'programme' },
  { icon: GraduationCap, age: 'Université', title: 'Je prépare mon permis', text: 'Code de la route, conduite, risques et mobilité responsable.', tone: 'bg-emerald-50 border-emerald-200 text-emerald-950', iconTone: 'bg-emerald-600 text-white', tab: 'permis' },
  { icon: Bike, age: 'Taxi-moto', title: 'Je maîtrise ma conduite professionnelle', text: 'Code de la route, passager, trafic, vigilance et sécurité à chaque course.', tone: 'bg-teal-50 border-teal-200 text-teal-950', iconTone: 'bg-teal-600 text-white', tab: 'exercices' },
  { icon: CarFront, age: 'Taxi & voiture', title: 'Je perfectionne ma conduite professionnelle', text: 'Révision du code, anticipation, passagers et conduite sûre au quotidien.', tone: 'bg-blue-50 border-blue-200 text-blue-950', iconTone: 'bg-blue-600 text-white', tab: 'cours' },
  { icon: ShieldCheck, age: 'Tous les âges', title: 'Je progresse chaque jour', text: 'Des mini-défis, des scènes immersives et une progression visible.', tone: 'bg-slate-50 border-slate-200 text-slate-950', iconTone: 'bg-slate-900 text-white', tab: 'progression' },
];

export default function ADSOExperienceSection() {
  const { setView, setLearningTab } = useViewStore();
  const openJourney = (tab: LearningTab) => {
    setLearningTab(tab);
    setView('learning');
  };

  return (
    <section id="parcours" className="relative overflow-hidden bg-[#f7f8f4] py-20 sm:py-24" aria-labelledby="journeys-heading">
      <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 shadow-sm">Une même mission · des parcours adaptés</span>
          <h2 id="journeys-heading" className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">ADSO grandit avec chaque apprenant.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Les enfants apprennent par le jeu, les jeunes par l’expérience, les futurs conducteurs par la pratique et les professionnels par l’entraînement continu.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journeys.map(({ icon: Icon, age, title, text, tone, iconTone, tab }) => (
            <button type="button" key={age} onClick={() => openJourney(tab)} className={`group text-left rounded-[1.6rem] border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${tone}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${iconTone}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] opacity-60">{age}</p>
              <h3 className="mt-2 text-lg font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-6 opacity-75">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold">Découvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
