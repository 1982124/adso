'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Bike, ShieldCheck, Landmark, School, HeartHandshake, ClipboardCheck, ChartNoAxesCombined } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AudienceCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  actions: string[];
  href: string;
}

const cards: AudienceCard[] = [
  {
    id: 'citizens',
    title: 'Citoyens, familles & communautés',
    icon: Users,
    description: 'Comprendre les dangers et adopter des comportements qui protègent la vie au quotidien.',
    actions: ['Sécurité des piétons et des passagers', 'Vélo, moto et taxi-moto plus sûrs', 'Sensibilisation familiale et communautaire'],
    href: '/education',
  },
  {
    id: 'young',
    title: 'Élèves, étudiants & apprentis',
    icon: GraduationCap,
    description: 'Installer une culture de mobilité sûre dès l’école et tout au long des apprentissages.',
    actions: ['Parcours adaptés à l’âge et au niveau', 'Scènes, questions et décisions immersives', 'Progression et compétences acquises'],
    href: '/student?profile=primaire',
  },
  {
    id: 'drivers',
    title: 'Conducteurs & professionnels',
    icon: Bike,
    description: 'Entretenir les connaissances et mieux anticiper les situations à risque.',
    actions: ['Révision du Code de la circulation', 'Vigilance, vitesse et distances de sécurité', 'Prévention adaptée aux trajets professionnels'],
    href: '/student?profile=taxi-voiture',
  },
  {
    id: 'schools',
    title: 'Établissements & formateurs',
    icon: School,
    description: 'Déployer des apprentissages structurés et accompagner les publics dans la durée.',
    actions: ['Ressources pédagogiques numériques', 'Parcours et évaluations', 'Suivi des acquis selon les fonctions disponibles'],
    href: '/institutions',
  },
  {
    id: 'government',
    title: 'Gouvernements & acteurs publics',
    icon: Landmark,
    description: 'Disposer d’un outil complémentaire pour soutenir les politiques de prévention et la sensibilisation.',
    actions: ['Programmes d’éducation et de prévention', 'Indicateurs d’usage et de progression, si disponibles', 'Approche adaptée au contexte et aux règles de chaque pays'],
    href: '/institutions',
  },
  {
    id: 'partners',
    title: 'Entreprises, associations & partenaires',
    icon: HeartHandshake,
    description: 'Mobiliser les organisations autour de la protection des usagers et de la prévention des risques.',
    actions: ['Sensibilisation des équipes et communautés', 'Formation continue à la mobilité sûre', 'Coopération avec les établissements et institutions'],
    href: '/institutions',
  },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } } };

function AudienceCardView({ card }: { card: AudienceCard }) {
  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0B1F33] text-[#E4C878]"><card.icon className="size-5" aria-hidden="true" /></span>
          <h3 className="pt-1 text-base font-black leading-snug text-slate-950">{card.title}</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{card.description}</p>
        <ul className="mt-4 space-y-2">
          {card.actions.map((action) => (
            <li key={action} className="flex items-start gap-2 text-xs leading-5 text-slate-700">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" /> {action}
            </li>
          ))}
        </ul>
        <a href={card.href} className="mt-5 inline-flex min-h-10 items-center justify-center self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-900 transition hover:border-emerald-600 hover:bg-emerald-50">
          Découvrir les parcours <span className="ml-2" aria-hidden="true">→</span>
        </a>
      </CardContent>
    </Card>
  );
}

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="bg-[#f7f8f4] py-16 sm:py-20 lg:py-24" aria-labelledby="ecosystem-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-800"><ShieldCheck className="size-4" aria-hidden="true" /> Une mission collective</p>
          <h2 id="ecosystem-heading" className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">La sécurité routière concerne toute la société.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">ADSO AFRICA relie l’apprentissage des citoyens, les besoins des établissements et les objectifs de prévention des institutions. La plateforme complète les dispositifs publics et éducatifs ; elle ne remplace ni les autorités ni les services d’urgence.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => <motion.div key={card.id} variants={itemVariants} className="h-full"><AudienceCardView card={card} /></motion.div>)}
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl bg-[#0B1F33] p-6 text-white sm:p-8">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E4C878]"><ClipboardCheck className="size-5" aria-hidden="true" /></span><div><h3 className="text-lg font-black">Apprendre, décider, progresser</h3><p className="mt-2 text-sm leading-6 text-slate-200">Les expériences pédagogiques d’ADSO aident à reconnaître un danger, choisir une conduite plus sûre, comprendre les conséquences et renforcer progressivement les compétences.</p></div></div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><ChartNoAxesCombined className="size-5" aria-hidden="true" /></span><div><h3 className="text-lg font-black text-slate-950">Prévenir et mesurer avec rigueur</h3><p className="mt-2 text-sm leading-6 text-slate-600">L’impact sur les accidents et les décès doit être évalué à partir de données fiables, de références datées et d’indicateurs validés avec les acteurs compétents. ADSO ne revendique pas de baisse de mortalité sans preuve.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
