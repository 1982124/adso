'use client'

import { motion } from 'framer-motion'
import {
  Search,
  Blocks,
  TestTube,
  FileText,
  ShieldAlert,
  Lock,
  Zap,
  Lightbulb,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

interface Rule {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const rules: Rule[] = [
  {
    number: 1,
    title: 'Toujours Analyser Avant de Coder',
    description:
      'Comprendre le contexte, les exigences et les contraintes avant ecrire la moindre ligne de code. Lire le code existant, identifier les dependances et evaluer l\'impact des modifications.',
    icon: <Search className="h-5 w-5" />,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    number: 2,
    title: 'Produire une Architecture Claire',
    description:
      'Structurer le code de maniere logique et maintenable. Separer les preoccupations, respecter les principes SOLID et documenter les decisions architecturales.',
    icon: <Blocks className="h-5 w-5" />,
    color: 'from-cyan-400 to-teal-500',
  },
  {
    number: 3,
    title: 'Ecrire des Tests Comprehensifs',
    description:
      'Couvrir les cas nominaux, les cas limites et les cas d\'erreur. Viser 90%+ de couverture. Les tests sont la garantie que le code fonctionne et reste correct.',
    icon: <TestTube className="h-5 w-5" />,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    number: 4,
    title: 'Documenter Systematiquement',
    description:
      'Commenter le code complexe, ecrire des README pour les modules, maintenir la documentation technique a jour. Le code est lu 10x plus qu\'il n\'est ecrit.',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-emerald-500 to-green-500',
  },
  {
    number: 5,
    title: 'Ne Jamais Casser l\'Existant',
    description:
      'Verifier la compatibilite ascendante, executer tous les tests existants, et s\'assurer que les nouvelles fonctionnalites ne regressive pas le systeme. Refactoring progressif.',
    icon: <ShieldAlert className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: 6,
    title: 'Respecter la Securite',
    description:
      'Valider toutes les entrees, sanitiser les donnees, appliquer le principe du moindre privilege. Ne jamais exposer de donnees sensibles et toujours utiliser les meilleures pratiques de securite.',
    icon: <Lock className="h-5 w-5" />,
    color: 'from-red-500 to-rose-500',
  },
  {
    number: 7,
    title: 'Optimiser la Performance',
    description:
      'Minimiser les requetes reseau, utiliser le cache efficacement, eviter les re-rendus inutiles. Mesurer avant d\'optimiser et viser des temps de reponse <100ms.',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-purple-500 to-violet-500',
  },
]

export default function DirectivesIA() {
  return (
    <section id="directives" className="bg-slate-950 py-20 px-4">
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
            Partie 13 — Directives IA
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Directives pour les IA de Developpement
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            7 regles obligatoires pour toute IA assistant au developpement du projet ADSO
          </p>
        </motion.div>

        {/* Rules Grid */}
        <div className="space-y-5">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.number}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: number + icon */}
                    <div className={`sm:w-28 shrink-0 px-5 py-4 sm:py-6 flex items-center gap-4 sm:flex-col bg-gradient-to-b ${rule.color} bg-opacity-5`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rule.color} flex items-center justify-center text-white shrink-0`}>
                        {rule.icon}
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 text-sm font-bold sm:hidden sm:mt-2">
                        {rule.number}
                      </Badge>
                      <span className="text-2xl font-bold text-white hidden sm:block">
                        {String(rule.number).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Right: content */}
                    <div className="flex-1 px-5 py-5 sm:py-6">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="sm:hidden text-xs text-slate-500 font-medium">
                          Regle {rule.number}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-100 mb-2">
                        {rule.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-slate-900 border-cyan-500/20">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Principe fondamental
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Ces regles ne sont pas des suggestions — elles sont obligatoires pour toute IA contribuant au code ADSO.
                  Chaque piece de code generee doit respecter ces 7 principes avant d&apos;etre validee.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
