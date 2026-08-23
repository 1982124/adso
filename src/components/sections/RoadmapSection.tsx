'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Server, BookOpen, BrainCircuit, Globe2, ShieldCheck } from 'lucide-react'

type Status = 'done' | 'active' | 'planned'

interface Phase {
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  items: string[]
  status: Status
}

const phases: Phase[] = [
  {
    title: 'Phase 1 : Fondation produit',
    duration: 'Priorité P0',
    icon: <Server className="h-5 w-5" />,
    description: 'Stabiliser le cœur ADSO et supprimer la complexité hors mission.',
    items: [
      'Accueil stable et mobile-first',
      'Formation et progression',
      'ADSO Immersif',
      'Authentification et données',
      'Navigation recentrée',
    ],
    status: 'done',
  },
  {
    title: 'Phase 2 : E-books & monétisation',
    duration: 'Priorité P0',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Faire des contenus éducatifs numériques un véritable deuxième pilier.',
    items: [
      'Catalogue e-books',
      'Fiches et aperçus',
      'Bibliothèque personnelle',
      'Achats et abonnements',
      'Offres établissements',
    ],
    status: 'active',
  },
  {
    title: 'Phase 3 : IA pédagogique',
    duration: 'Priorité P1',
    icon: <BrainCircuit className="h-5 w-5" />,
    description: 'Utiliser l’IA pour améliorer réellement l’apprentissage et le contenu.',
    items: [
      'AI Coach',
      'AI Teacher',
      'AI Examiner',
      'Assistant de création de contenu',
      'Personnalisation progressive',
    ],
    status: 'planned',
  },
  {
    title: 'Phase 4 : Afrique & qualité',
    duration: 'Priorité P1',
    icon: <Globe2 className="h-5 w-5" />,
    description: 'Déployer des Country Packs traçables sans inventer les réglementations.',
    items: [
      '54 pays africains',
      'Sources et dates de vérification',
      'Mali prioritaire',
      'Statuts de complétude des données',
      'Accessibilité et faible débit',
    ],
    status: 'planned',
  },
  {
    title: 'Phase 5 : Confiance & échelle',
    duration: 'Priorité P2',
    icon: <ShieldCheck className="h-5 w-5" />,
    description: 'Renforcer la confiance avant d’ajouter de la complexité.',
    items: [
      'Certification ADSO clairement distinguée des permis officiels',
      'Offline progressif',
      'Observabilité avancée',
      'Tests E2E et smoke production',
      'Expansion internationale maîtrisée',
    ],
    status: 'planned',
  },
]

const statusConfig: Record<Status, { label: string; className: string; dotClass: string }> = {
  done: {
    label: 'Terminé',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500 ring-4 ring-emerald-500/20',
  },
  active: {
    label: 'En cours',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500 ring-4 ring-amber-500/20 animate-pulse',
  },
  planned: {
    label: 'Planifié',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400 ring-4 ring-slate-400/20',
  },
}

const nodeVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Notre feuille de route
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Construire une plateforme claire de formation à la mobilité et de contenus éducatifs numériques.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-12">
            {phases.map((phase, i) => {
              const cfg = statusConfig[phase.status]
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={phase.title}
                  custom={i}
                  variants={nodeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative"
                >
                  <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className={isLeft ? 'text-right pr-8' : ''}>
                      {isLeft && <PhaseCard phase={phase} cfg={cfg} align="right" />}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                      <div className={`w-10 h-10 rounded-full ${cfg.dotClass} flex items-center justify-center text-white`}>
                        {phase.icon}
                      </div>
                    </div>
                    <div className={!isLeft ? 'pl-8' : ''}>
                      {!isLeft && <PhaseCard phase={phase} cfg={cfg} align="left" />}
                    </div>
                  </div>

                  <div className="md:hidden flex gap-4 pl-1">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 rounded-full ${cfg.dotClass} flex items-center justify-center text-white mt-1`}>
                        {phase.icon}
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <PhaseCard phase={phase} cfg={cfg} align="left" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhaseCard({
  phase,
  cfg,
  align,
}: {
  phase: Phase
  cfg: (typeof statusConfig)[Status]
  align: 'left' | 'right'
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm ${align === 'right' ? 'ml-auto max-w-sm' : 'mr-auto max-w-sm'}`}>
      <div className={`flex items-center gap-2 mb-2 ${align === 'right' ? 'justify-end' : ''}`}>
        <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
        <span className="text-xs text-slate-400 font-medium">{phase.duration}</span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{phase.title}</h3>
      <p className="text-sm text-slate-500 mb-3">{phase.description}</p>
      <ul className="space-y-1.5">
        {phase.items.map((item) => (
          <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
