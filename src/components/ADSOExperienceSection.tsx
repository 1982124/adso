'use client';

import Link from 'next/link';
import { ArrowRight, Baby, Bike, CarFront, GraduationCap, HardHat, School, ShieldCheck } from 'lucide-react';

const journeys = [
  { icon: Baby, age: 'Primaire', title: 'Je découvre la route', text: 'Des situations simples, des images et des défis pour apprendre en s’amusant.', tone: 'bg-amber-50 border-amber-200 text-amber-900', iconTone: 'bg-amber-400 text-white' },
  { icon: School, age: 'Secondaire', title: 'Je comprends la circulation', text: 'Panneaux, dangers et réflexes pour devenir un usager attentif.', tone: 'bg-sky-50 border-sky-200 text-sky-950', iconTone: 'bg-sky-500 text-white' },
  { icon: GraduationCap, age: 'Lycée', title: 'Je prépare ma mobilité', text: 'Anticipation, vitesse, distraction et premiers réflexes du futur conducteur.', tone: 'bg-violet-50 border-violet-200 text-violet-950', iconTone: 'bg-violet-500 text-white' },
  { icon: HardHat, age: 'Apprentis', title: 'Je me prépare à conduire', text: 'Observer, manœuvrer, décider et gérer les situations du quotidien.', tone: 'bg-orange-50 border-orange-200 text-orange-950', iconTone: 'bg-orange-500 text-white' },
  { icon: GraduationCap, age: 'Université', title: 'Je prépare mon permis', text: 'Code de la route, conduite, risques et mobilité responsable.', tone: 'bg-emerald-50 border-emerald-200 text-emerald-950', iconTone: 'bg-emerald-600 text-white' },
  { icon: Bike, age: 'Taxi-moto', title: 'Je maîtrise ma conduite professionnelle', text: 'Code de la route, passager, trafic, vigilance et sécurité à chaque course.', tone: 'bg-teal-50 border-teal-200 text-teal-950', iconTone: 'bg-teal-600 text-white' },
  { icon: CarFront, age: 'Taxi & voiture', title: 'Je perfectionne ma conduite professionnelle', text: 'Révision du code, anticipation, passagers et conduite sûre au quotidien.', tone: 'bg-blue-50 border-blue-200 text-blue-950', iconTone: 'bg-blue-600 text-white' },
  { icon: ShieldCheck, age: 'Tous les âges', title: 'Je progresse chaque jour', text: 'Des mini-défis, des scènes immersives et une progression visible.', tone: 'bg-slate-50 border-slate-200 text-slate-950', iconTone: 'bg-slate-900 text-white' },
];

const visualScenes = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_la_descente_de_l%27%C3%A9cole.jpg',
    alt: 'Enfants traversant la route à la sortie d’une école au Sénégal, avec un adulte qui arrête les voitures.',
    title: 'Sortie d’école',
    context: 'Thiès, Sénégal · traversée protégée',
    credit: 'Babacar Dioum · CC BY-SA 4.0',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_%C3%A0_l%27%C3%A9cole_Notre_Dame_Cotonou.jpg',
    alt: 'Taxis-motos béninois devant une école primaire à Cotonou.',
    title: 'Taxi-moto près d’une école',
    context: 'Cotonou, Bénin · mobilité scolaire',
    credit: 'ShirleyDoss · CC BY-SA 4.0',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Getting_the_Children_to_School_on_time.jpg',
    alt: 'Trois enfants transportés à l’école à moto par leur accompagnateur au Togo.',
    title: 'Transport des élèves à moto',
    context: 'Togo · exposition au risque',
    credit: 'Raguti12 · CC BY-SA 4.0',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_et_clients_sur_le_boulevard_Saint-Michel_%C3%A0_Cotonou_au_B%C3%A9nin.jpg',
    alt: 'Taxi-moto et clients circulant sur le boulevard Saint-Michel à Cotonou.',
    title: 'Circulation urbaine',
    context: 'Cotonou, Bénin · interaction usagers',
    credit: 'Saliousoft · CC BY-SA 4.0',
  },
];

export default function ADSOExperienceSection() {
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
          {journeys.map(({ icon: Icon, age, title, text, tone, iconTone }) => (
            <Link key={age} href="/student" className={`group rounded-[1.6rem] border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${tone}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${iconTone}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] opacity-60">{age}</p>
              <h3 className="mt-2 text-lg font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-6 opacity-75">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold">Découvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>

        <div className="mt-20" aria-labelledby="visual-library-heading">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-700 shadow-sm">Bibliothèque visuelle · scènes réelles</span>
            <h2 id="visual-library-heading" className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Apprendre à partir de situations qui existent vraiment.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">ADSO privilégie des scènes africaines réelles lorsque leur licence permet une utilisation adaptée. Chaque image est conservée avec sa provenance et son contexte pédagogique.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visualScenes.map((scene) => (
              <figure key={scene.src} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={scene.src} alt={scene.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
                <figcaption className="p-4">
                  <h3 className="font-black text-slate-950">{scene.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{scene.context}</p>
                  <p className="mt-2 text-[11px] leading-4 text-slate-400">{scene.credit}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
