'use client'

import { motion } from 'framer-motion'
import {
  MousePointer,
  Type,
  Tag,
  CircleDot,
  LayoutGrid,
  BookOpen,
  CalendarDays,
  PanelLeft,
  Smartphone,
  Accessibility,
  Hand,
  Target,
  UserPlus,
  BrainCircuit,
  GraduationCap,
  Gift,
  ChevronDown,
  Palette,
  Layers,
  Blocks,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

/* ─── 9.1 Design System ─── */
const atoms = [
  { name: 'Buttons', icon: <MousePointer className="h-4 w-4" />, desc: 'Primaire, secondaire, ghost, outline, destructive' },
  { name: 'Inputs', icon: <Type className="h-4 w-4" />, desc: 'Text, select, checkbox, radio, switch, slider' },
  { name: 'Badges', icon: <Tag className="h-4 w-4" />, desc: 'Status, labels, notifications, filtres' },
  { name: 'Icons', icon: <CircleDot className="h-4 w-4" />, desc: 'Lucide React, 1000+ icones' },
]

const molecules = [
  { name: 'Form Fields', icon: <Type className="h-4 w-4" />, desc: 'Input + Label + Validation + Helper' },
  { name: 'Course Cards', icon: <BookOpen className="h-4 w-4" />, desc: 'Thumbnail + Progress + Meta' },
  { name: 'Planning Cells', icon: <CalendarDays className="h-4 w-4" />, desc: 'Time slot + Status + Actions' },
]

const organisms = [
  { name: 'Headers', icon: <PanelLeft className="h-4 w-4" />, desc: 'Navigation + Search + Profile' },
  { name: 'Dashboards', icon: <LayoutGrid className="h-4 w-4" />, desc: 'KPIs + Charts + Actions' },
]

/* ─── 9.2 Mobile & Accessibilite ─── */
const mobilePrinciples = [
  { title: 'Mobile-First Design', desc: '85% des utilisateurs sur mobile. Design optimise 320-428px.', icon: <Smartphone className="h-5 w-5" /> },
  { title: 'Touch Targets 44x44px', desc: 'Cibles tactiles minimum 44x44px conforme Apple HIG et Material.', icon: <Hand className="h-5 w-5" /> },
  { title: 'Thumb-Friendly Navigation', desc: 'Navigation inferieure, actions accessibles au pouce.', icon: <MousePointer className="h-5 w-5" /> },
  { title: 'WCAG 2.1 AA', desc: 'Contraste 4.5:1 minimum, lecteurs d\'ecran, navigation clavier.', icon: <Accessibility className="h-5 w-5" /> },
]

/* ─── 9.3 Parcours Utilisateur ─── */
const funnelSteps = [
  {
    step: 1,
    title: 'Inscription',
    duration: '30 secondes',
    icon: <UserPlus className="h-5 w-5" />,
    color: 'from-cyan-500 to-cyan-600',
    desc: 'Email + mot de passe. Connexion Google/Apple pour rapidite.',
    width: '100%',
  },
  {
    step: 2,
    title: 'Quiz Diagnostic',
    duration: '3 minutes',
    icon: <Target className="h-5 w-5" />,
    color: 'from-cyan-400 to-teal-500',
    desc: 'Evaluation du niveau pour personnaliser le parcours.',
    width: '85%',
  },
  {
    step: 3,
    title: 'Parcours Personnalise IA',
    duration: 'Adaptatif',
    icon: <BrainCircuit className="h-5 w-5" />,
    color: 'from-teal-500 to-emerald-500',
    desc: 'AI genere un plan de formation adapte au profil.',
    width: '65%',
  },
  {
    step: 4,
    title: 'Essai Gratuit',
    duration: '7 jours',
    icon: <Gift className="h-5 w-5" />,
    color: 'from-emerald-500 to-green-500',
    desc: 'Acces complet pour convertir en abonnement.',
    width: '45%',
  },
]

export default function UXUIDesign() {
  return (
    <section id="ux" className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
            Partie 9 — UX/UI Design
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            UX/UI Design
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Design system atomic, mobile-first, avec parcours utilisateur optimise pour la conversion
          </p>
        </motion.div>

        <Tabs defaultValue="design-system" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-slate-900 border border-slate-800 h-auto p-1 mb-10">
            <TabsTrigger value="design-system" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              9.1 Design System
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              9.2 Mobile & A11y
            </TabsTrigger>
            <TabsTrigger value="parcours" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              9.3 Parcours Utilisateur
            </TabsTrigger>
          </TabsList>

          {/* ─── 9.1 ─── */}
          <TabsContent value="design-system">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                9.1 Design System — Atomic Design 3 niveaux
              </h3>
              <p className="text-slate-400 text-sm">
                Hierarchie modulaire : Atomes → Molecules → Organismes
              </p>
            </div>

            <div className="space-y-8">
              {/* Atoms */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Palette className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-200">Atoms</h4>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">Niveau 1</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {atoms.map((atom, i) => (
                    <motion.div key={atom.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                              {atom.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{atom.name}</span>
                          </div>
                          <p className="text-xs text-slate-400">{atom.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ChevronDown className="h-6 w-6 text-slate-600 rotate-90" />
              </div>

              {/* Molecules */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                    <Blocks className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-200">Molecules</h4>
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs">Niveau 2</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {molecules.map((mol, i) => (
                    <motion.div key={mol.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center text-teal-400">
                              {mol.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{mol.name}</span>
                          </div>
                          <p className="text-xs text-slate-400">{mol.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ChevronDown className="h-6 w-6 text-slate-600 rotate-90" />
              </div>

              {/* Organisms */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-200">Organisms</h4>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Niveau 3</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {organisms.map((org, i) => (
                    <motion.div key={org.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              {org.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{org.name}</span>
                          </div>
                          <p className="text-xs text-slate-400">{org.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── 9.2 ─── */}
          <TabsContent value="mobile">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                9.2 Experience Mobile et Accessibilite
              </h3>
              <p className="text-slate-400 text-sm">
                85% des utilisateurs sur mobile — chaque pixel compte
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { value: '85%', label: 'Mobile users' },
                { value: '320px', label: 'Min viewport' },
                { value: '44px', label: 'Touch target' },
                { value: 'AA', label: 'WCAG 2.1' },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mobilePrinciples.map((principle, i) => (
                <motion.div key={principle.title} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                        {principle.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200 mb-1">{principle.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{principle.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 9.3 ─── */}
          <TabsContent value="parcours">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                9.3 Parcours Utilisateur et Conversion
              </h3>
              <p className="text-slate-400 text-sm">
                Entonnoir de conversion en 4 etapes — de l&apos;inscription a l&apos;abonnement
              </p>
            </div>

            {/* Funnel visualization */}
            <div className="flex flex-col items-center gap-2">
              {funnelSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="w-full"
                  style={{ maxWidth: step.width }}
                >
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        {/* Gradient bar */}
                        <div className={`w-12 shrink-0 flex items-center justify-center bg-gradient-to-b ${step.color}`}>
                          <span className="text-white font-bold text-lg">{step.step}</span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                            {step.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="text-sm font-semibold text-slate-200">{step.title}</h4>
                              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Arrow between steps */}
                  {i < funnelSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ChevronDown className="h-5 w-5 text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Conversion metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Taux d\'inscription', value: '72%', detail: 'Visiteurs → Comptes' },
                { label: 'Completion quiz', value: '89%', detail: 'Quiz demarrés → Termines' },
                { label: 'Activation IA', value: '65%', detail: 'Parcours → Utilisation' },
                { label: 'Conversion payant', value: '23%', detail: 'Essai → Abonnement' },
              ].map((metric, i) => (
                <motion.div key={metric.label} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{metric.value}</div>
                      <div className="text-xs font-medium text-slate-200 mb-0.5">{metric.label}</div>
                      <div className="text-xs text-slate-500">{metric.detail}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
