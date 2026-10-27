'use client';

import Link from 'next/link';
import { GraduationCap, Users, Bike, ShieldCheck, Landmark, School, HeartHandshake, ArrowRight } from 'lucide-react';

interface AudienceCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  actions: string[];
  href: string;
}

const cards: AudienceCard[] = [
  { id: 'citizens', title: 'Citoyens et communautés', icon: Users, description: 'Mieux reconnaître les dangers et comprendre les comportements qui réduisent les risques au quotidien.', actions: ['Piétons et passagers', 'Cyclistes et usagers de deux-roues', 'Prévention familiale et communautaire'], href: '/education' },
  { id: 'young', title: 'Élèves, étudiants et apprentis', icon: GraduationCap, description: 'Développer les connaissances de mobilité sûre tout au long des apprentissages.', actions: ['Parcours pédagogiques adaptés', 'Scènes et décisions immersives', 'Évaluations des connaissances disponibles'], href: '/student?profile=primaire' },
  { id: 'drivers', title: 'Conducteurs et professionnels', icon: Bike, description: 'Actualiser les connaissances et travailler l’anticipation des situations à risque.', actions: ['Règles de circulation', 'Vigilance et distances de sécurité', 'Prévention adaptée aux déplacements professionnels'], href: '/student?profile=taxi-voiture' },
  { id: 'schools', title: 'Établissements et formateurs', icon: School, description: 'Intégrer des ressources numériques dans les actions d’éducation et de prévention.', actions: ['Ressources pédagogiques', 'Parcours et évaluations', 'Suivi selon les fonctions effectivement disponibles'], href: '/institutions' },
  { id: 'government', title: 'Institutions et acteurs publics', icon: Landmark, description: 'Explorer un outil complémentaire aux politiques publiques de prévention et d’éducation routière.', actions: ['Sensibilisation et éducation', 'Indicateurs d’usage si disponibles', 'Adaptation aux sources et règles nationales vérifiées'], href: '/institutions' },
  { id: 'partners', title: 'Associations et partenaires', icon: HeartHandshake, description: 'Soutenir des actions collectives de sensibilisation et de formation à la mobilité sûre.', actions: ['Mobilisation des communautés', 'Formation continue', 'Coopération avec les établissements'], href: '/institutions' },
];

function AudienceCardView({ card }: { card: AudienceCard }) {
  return (
    <article className="flex h-full min-w-0 flex-col border-t-2 border-[#0B1F33] bg-white px-4 py-5 sm:px-5">
      <div className="flex items-start gap-3">
        <card.icon className="mt-1 size-5 shrink-0 text-emerald-800" aria-hidden="true" />
        <h3 className="text-base font-bold leading-snug text-slate-950">{card.title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
      <ul className="mt-4 space-y-2 border-t border-slate-200 pt-3">
        {card.actions.map((action) => <li key={action} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-800" aria-hidden="true" />{action}</li>)}
      </ul>
      <Link href={card.href} className="mt-5 inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-emerald-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-emerald-800">Explorer <ArrowRight className="size-4" aria-hidden="true" /></Link>
    </article>
  );
}

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="bg-slate-50 py-14 sm:py-18 lg:py-20" aria-labelledby="ecosystem-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Publics et usages</p>
          <h2 id="ecosystem-heading" className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">Une approche commune, des responsabilités distinctes.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">ADSO AFRICA propose des ressources numériques pour l’éducation routière et la prévention. Les besoins des citoyens, des formateurs et des institutions diffèrent ; les contenus et les données doivent rester adaptés au public et au contexte national.</p>
        </div>

        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => <AudienceCardView key={card.id} card={card} />)}
        </div>

        <div className="mt-10 grid border-t border-slate-300 pt-7 md:grid-cols-2 md:gap-10">
          <div className="pb-6 md:pb-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Méthode pédagogique</p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">Observer, décider, comprendre.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Les activités immersives présentent des situations de circulation, invitent à choisir une réponse et expliquent les conséquences après la décision. Leur qualité dépend de scénarios réalistes et de contenus vérifiés.</p>
          </div>
          <div className="border-t border-slate-300 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Redevabilité</p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">Mesurer ce qui est réellement démontré.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Les données d’utilisation et les résultats d’apprentissage ne prouvent pas, à eux seuls, une baisse des accidents. Toute évaluation d’impact exige des données fiables, une méthode explicite et une analyse adaptée.</p>
            <Link href="/institutions" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-emerald-900 underline underline-offset-4">Consulter l’espace institutions <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
