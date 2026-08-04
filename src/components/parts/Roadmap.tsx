'use client'

import { motion } from 'framer-motion'
import {
  Server,
  CreditCard,
  BrainCircuit,
  Store,
  Globe2,
  ShieldCheck,
  Users,
  BookOpen,
  FileCheck,
  Receipt,
  Bell,
  GraduationCap,
  Sparkles,
  Handshake,
  Code2,
  BadgeCheck,
  Link2,
  Rocket,
  Blocks,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Status = 'termine' | 'en-cours' | 'planifie'

interface Phase {
  phase: number
  title: string
  duration: string
  icon: React.ReactNode
  description: string
  items: string[]
  status: Status
}

const phases: Phase[] = [
  {
    phase: 1,
    title: 'Fondation',
    duration: 'Mois 1-6',
    icon: <Server className="h-5 w-5" />,
    description: 'Infrastructure cloud, auth, user management, student app MVP',
    items: [
      'Infrastructure cloud scalable',
      'Authentification & gestion utilisateurs',
      'App eleve MVP',
      'Cours theoriques complets',
      'Examens basiques',
    ],
    status: 'termine',
  },
  {
    phase: 2,
    title: 'SaaS & Paiement',
    duration: 'Mois 7-12',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Auto-ecole platform, CRM, planning, Stripe billing, instructor app',
    items: [
      'Plateforme auto-ecole complete',
      'CRM & planning integre',
      'Facturation Stripe',
      'App moniteur',
      'Systeme de notifications',
    ],
    status: 'en-cours',
  },
  {
    phase: 3,
    title: 'IA Avancee',
    duration: 'Mois 13-24',
    icon: <BrainCircuit className="h-5 w-5" />,
    description: 'AI Coach, AI Examiner, adaptive exams, AI Simulator, advanced analytics',
    items: [
      'AI Coach personnalise',
      'AI Examinateur adaptatif',
      'Examens adaptatifs',
      'AI Simulator de conduite',
      'Analytics avances',
    ],
    status: 'planifie',
  },
  {
    phase: 4,
    title: 'Marketplace',
    duration: 'Mois 25-36',
    icon: <Store className="h-5 w-5" />,
    description: 'Marketplace lessons, partnerships, certification program, API SDK',
    items: [
      'Marketplace lecons pratiques',
      'Partenariats assureurs / constructeurs',
      'Programme de certification',
      'API & SDK ouvertes',
    ],
    status: 'planifie',
  },
  {
    phase: 5,
    title: 'Expansion Mondiale',
    duration: 'Mois 37-48',
    icon: <Globe2 className="h-5 w-5" />,
    description: '120+ countries, blockchain certification, connected vehicles, ADSO Scholarship',
    items: [
      '120+ pays couverts',
      'Certifications blockchain',
      'Integration vehicules connectes',
      'Bourse ADSO',
    ],
    status: 'planifie',
  },
]

const statusConfig: Record<Status, { label: string; badgeClass: string; dotClass: string; lineClass: string }> = {
  termine: {
    label: 'TERMINE',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500 ring-4 ring-emerald-500/20',
    lineClass: 'bg-emerald-500/40',
  },
  'en-cours': {
    label: 'EN COURS',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500 ring-4 ring-amber-500/20 animate-pulse',
    lineClass: 'bg-slate-700',
  },
  planifie: {
    label: 'PLANIFIE',
    badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dotClass: 'bg-slate-500 ring-4 ring-slate-500/20',
    lineClass: 'bg-slate-800',
  },
}

const nodeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="bg-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
            Partie 12 — Plan de Construction
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Plan de Construction
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            48 mois pour revolutionner l&apos;education automobile mondiale
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-0.5 bg-slate-800" />

          <div className="space-y-10 md:space-y-12">
            {phases.map((phase, i) => {
              const cfg = statusConfig[phase.status]
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={phase.phase}
                  custom={i}
                  variants={nodeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative"
                >
                  {/* Desktop: Alternating layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 items-start">
                    {/* Left side */}
                    <div className={`pr-6 ${isLeft ? '' : 'order-3 pl-6'}`}>
                      {isLeft && (
                        <PhaseCard phase={phase} cfg={cfg} align="right" />
                      )}
                    </div>

                    {/* Center: dot + line segment */}
                    <div className="flex flex-col items-center">
                      {/* Line segment above dot (colored based on status) */}
                      <div className={`w-0.5 h-6 ${i > 0 ? statusConfig[phases[i - 1].status].lineClass : 'bg-transparent'}`} />
                      {/* Dot */}
                      <div
                        className={`w-10 h-10 rounded-full ${cfg.dotClass} flex items-center justify-center text-white z-10 shrink-0`}
                      >
                        {phase.icon}
                      </div>
                      {/* Line segment below dot */}
                      <div className={`w-0.5 flex-1 min-h-[24px] ${cfg.lineClass}`} />
                    </div>

                    {/* Right side */}
                    <div className={`pl-6 ${isLeft ? 'order-3' : ''}`}>
                      {!isLeft && (
                        <PhaseCard phase={phase} cfg={cfg} align="left" />
                      )}
                    </div>
                  </div>

                  {/* Mobile: Left-aligned */}
                  <div className="md:hidden flex gap-4">
                    {/* Center column */}
                    <div className="flex flex-col items-center shrink-0">
                      {/* Line segment above */}
                      <div className={`w-0.5 h-3 ${i > 0 ? statusConfig[phases[i - 1].status].lineClass : 'bg-transparent'}`} />
                      {/* Dot */}
                      <div
                        className={`w-10 h-10 rounded-full ${cfg.dotClass} flex items-center justify-center text-white z-10 shrink-0`}
                      >
                        {phase.icon}
                      </div>
                      {/* Line segment below */}
                      <div className={`w-0.5 flex-1 min-h-[12px] ${cfg.lineClass}`} />
                    </div>
                    {/* Card */}
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
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div
          className={`flex items-center gap-2 mb-2 flex-wrap ${
            align === 'right' ? 'justify-end' : ''
          }`}
        >
          <Badge className={`text-xs border ${cfg.badgeClass}`}>
            {cfg.label}
          </Badge>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
            Phase {phase.phase}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">{phase.duration}</span>
        </div>
        <h3
          className={`font-semibold text-slate-100 mb-1 text-sm ${
            align === 'right' ? 'text-right' : ''
          }`}
        >
          {phase.title}
        </h3>
        <p
          className={`text-xs text-slate-400 mb-3 ${
            align === 'right' ? 'text-right' : ''
          }`}
        >
          {phase.description}
        </p>
        <ul className="space-y-1.5">
          {phase.items.map((item) => (
            <li
              key={item}
              className={`text-xs text-slate-500 flex items-start gap-2 ${
                align === 'right' ? 'flex-row-reverse text-right' : ''
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
