'use client';

import { ArrowRight, Bike, Car, GraduationCap, HardHat, School2, University, Users } from 'lucide-react';

const pathways = [
  {
    group: 'Primaire', icon: School2, tone: 'emerald',
    titles: ['Je découvre la route', 'Je lis les panneaux', 'Je traverse en sécurité', 'Je protège les autres', 'Je deviens un usager responsable'],
    visual: '8 visuels : enfant, traversée, école, panneaux, vélo, casque, circulation et scène de décision.',
  },
  {
    group: 'Collège & secondaire', icon: GraduationCap, tone: 'teal',
    titles: ['Comprendre la circulation', 'Reconnaître les dangers', 'Partager la route avec les usagers vulnérables', 'Observer avant d’agir', 'Mobilité responsable'],
    visual: '8 visuels : carrefour, piéton, vélo, moto, bus, signalisation, distraction et choix sécurisé.',
  },
  {
    group: 'Lycée', icon: GraduationCap, tone: 'cyan',
    titles: ['Je prépare ma mobilité', 'Premiers réflexes de mobilité sûre', 'Vitesse, distance et anticipation', 'Alcool, fatigue et distraction', 'Citoyen mobile et responsable'],
    visual: '8 visuels : jeune usager, route urbaine, route interurbaine, nuit, pluie, téléphone, fatigue et décision.',
  },
  {
    group: 'Apprentis de tous secteurs', icon: HardHat, tone: 'amber',
    titles: ['Je travaille et je me déplace en sécurité', 'Identifier les risques de mon trajet et de mon métier', 'Être visible et protéger les autres', 'Réagir face aux situations dangereuses', 'Adopter les bons réflexes chaque jour'],
    visual: '8 visuels : apprenti en situation professionnelle, trajet, traversée, deux-roues, passager, chantier, incident évité et évaluation.',
  },
  {
    group: 'Universitaires', icon: University, tone: 'violet',
    titles: ['Mobilité sûre sur le campus', 'Analyse des risques routiers', 'Conduite et déplacement responsables', 'Mobilité durable et partagée', 'Leadership sécurité'],
    visual: '6 visuels : campus, transport collectif, mobilité douce, analyse de situation, sécurité et leadership.',
  },
  {
    group: 'Deux-roues & taxi-moto', icon: Bike, tone: 'orange',
    titles: ['Usager deux-roues sûr', 'Casque, passager et équipement', 'Positionnement, anticipation et distance', 'Conduire dans le trafic urbain', 'Fatigue, vitesse et prise de risque', 'Un déplacement sûr du départ à l’arrivée'],
    visual: '8 visuels : deux-roues africain, casque, passager, carrefour, dépassement, pluie, nuit et situation immersive.',
  },
  {
    group: 'Taxi, voiture & professionnels', icon: Car, tone: 'blue',
    titles: ['Conducteur : sécurité avant service', 'Accueil et protection du passager', 'Conduite souple et anticipation', 'Ville, interurbain et conditions difficiles', 'Fatigue, distraction et vigilance', 'Un trajet sûr du départ à l’arrivée'],
    visual: '8 visuels : taxi, passager, conduite urbaine, route interurbaine, nuit, pluie, arrêt sûr et décision.',
  },
  {
    group: 'Tous les usagers', icon: Users, tone: 'slate',
    titles: ['Je comprends ma vulnérabilité', 'Je partage la voie', 'Je protège les plus vulnérables', 'Je reconnais les dangers', 'Je contribue à une mobilité responsable'],
    visual: '8 visuels : piéton, passager, cycliste, moto, véhicule, enfant, transport collectif et scène collective.',
  },
];

export default function AudienceCurriculumSection() {
  return (
    <section id="parcours" className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:py-20" aria-labelledby="parcours-heading">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Le cœur pédagogique d’ADSO Africa</p>
          <h2 id="parcours-heading" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Un parcours adapté à chaque âge, chaque métier et chaque situation de mobilité.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">ADSO Africa ne réduit pas la sécurité routière à l’apprentissage de la conduite. Un enfant, un étudiant, un apprenti de n’importe quel secteur, un piéton, un passager, un cycliste, un motocycliste ou un conducteur peuvent tous être exposés aux risques de la circulation. Le socle commun est la capacité à comprendre, anticiper, décider et agir en sécurité.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map(({ group, icon: Icon, titles, visual }) => (
            <article key={group} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:border-emerald-300/30">
              <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-emerald-400/10"><Icon className="size-5 text-emerald-300" aria-hidden="true" /></div><h3 className="text-xl font-black">{group}</h3></div><ArrowRight className="size-4 text-emerald-300/60" aria-hidden="true" /></div>
              <ol className="mt-5 space-y-2.5">{titles.map((title, index) => <li key={title} className="flex gap-3 text-sm leading-6 text-slate-200"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-black text-emerald-300">{index + 1}</span><span>{title}</span></li>)}</ol>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">{visual}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
