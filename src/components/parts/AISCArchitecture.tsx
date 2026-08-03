'use client';

import { motion } from 'framer-motion';
import {
  Crown,
  Cpu,
  Package,
  Megaphone,
  DollarSign,
  Cuboid,
  Code2,
  Headphones,
  GraduationCap,
  ShieldCheck,
  Container,
  Lock,
  ArrowRight,
  Workflow,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PartWrapper,
  SectionTitle,
  SubsectionTitle,
  type PartProps,
} from './BlueprintPart';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

const agents = [
  {
    icon: Crown,
    name: 'Agent CEO',
    role: 'Direction Générale',
    desc: "Orchestre la stratégie globale et la prise de décision. Analyse les KPI business et ajuste les priorités en temps réel. Décide des investissements IA et des pivots stratégiques.",
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Cpu,
    name: 'Agent CTO',
    role: 'Direction Technique',
    desc: "Supervise l'architecture technique et l'infrastructure. Surveille les performances, planifie les mises à jour et garantit la scalabilité de tous les services IA.",
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Package,
    name: 'Agent Product',
    role: 'Gestion Produit',
    desc: 'Gère le backlog produit et les roadmaps. Analyse les retours utilisateurs pour prioriser les fonctionnalités et optimiser l\'expérience utilisateur.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Megaphone,
    name: 'Agent Marketing',
    role: 'Marketing & Croissance',
    desc: 'Optimise les campagnes d\'acquisition, le référencement et la rétention. Analyse les cohortes d\'utilisateurs et recommande des actions de croissance.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    icon: DollarSign,
    name: 'Agent Finance',
    role: 'Finance & Revenus',
    desc: 'Surveille les revenus, les coûts et la rentabilité par pays et par segment. Prédit les cash-flows et alerte sur les dérives budgétaires.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Cuboid,
    name: 'Agent Architect',
    role: 'Architecture Logicielle',
    desc: "Maintient la cohérence architecturale, gère les dépendances et planifie l'évolution du système. Valide les décisions techniques et supervise la dette technique.",
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Code2,
    name: 'Agent Developer',
    role: 'Développement',
    desc: "Assiste les développeurs avec la génération de code, la revue de code IA et le débogage. Maintient les standards de qualité et les conventions de code.",
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Headphones,
    name: 'Agent Support',
    role: 'Support Client',
    desc: 'Gère les tickets de support de niveau 1 et 2. Analyse les tendances de problèmes et identifie les bugs récurrents pour escalade vers les équipes techniques.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: GraduationCap,
    name: 'Agent EdTech',
    role: 'Pédagogie & Contenu',
    desc: 'Supervise la qualité pédagogique du contenu. Analyse l\'efficacité des méthodes d\'enseignement et recommande des améliorations basées sur la recherche en apprentissage.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: ShieldCheck,
    name: 'Agent QA',
    role: 'Qualité & Tests',
    desc: 'Génère et exécute des tests automatisés. Surveille la qualité en production, détecte les régressions et valide les nouvelles fonctionnalités.',
    color: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
  },
  {
    icon: Container,
    name: 'Agent DevOps',
    role: 'Infrastructure & CI/CD',
    desc: 'Gère les pipelines CI/CD, le monitoring et les incidents. Automatise les déploiements, surveille les performances et optimise les coûts cloud.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Lock,
    name: 'Agent Security',
    role: 'Sécurité & Conformité',
    desc: 'Surveille les menaces de sécurité, gère les vulnérabilités et assure la conformité RGPD, HIPAA et aux réglementations locales de chaque pays.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
];

export default function AISCArchitecture({ className }: PartProps) {
  return (
    <PartWrapper id="ai-scos" className={className}>
      <SectionTitle subtitle="12 agents IA spécialisés simulant un comité de direction virtuel">
        Partie 4 — Architecture AI-SCOS
      </SectionTitle>

      {/* 4.1 AI-SCOS Presentation */}
      <SubsectionTitle id="ai-scos-presentation">4.1 Présentation AI-SCOS</SubsectionTitle>
      <motion.div
        className="bg-gradient-to-br from-slate-900 to-violet-950/30 border border-violet-500/20 rounded-xl p-6 sm:p-8 mb-12"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-200 text-lg leading-relaxed mb-4">
          <span className="text-violet-400 font-semibold">AI-SCOS</span> (AI — Smart
          Committee Operating System) est le cerveau collectif de la plateforme ADSO.
          Il s'agit d'un système composé de{' '}
          <span className="text-cyan-400 font-semibold">12 agents IA spécialisés</span>{' '}
          qui simulent un comité de direction virtuel, chacun doté d'une expertise
          métier spécifique.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Contrairement à un système monolithique, AI-SCOS fonctionne comme une
          véritable organisation intelligente où chaque agent a sa spécialité, ses
          objectifs et sa capacité à collaborer avec les autres agents pour prendre
          des décisions collectives éclairées.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Ce système permet à ADSO de fonctionner avec une intelligence
          organisationnelle qui dépasse largement ce qu'un humain seul pourrait
          accomplir, tout en maintenant une cohérence stratégique globale.
        </p>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 4.2 Agent Details */}
      <SubsectionTitle id="agents-detail">4.2 Détail des 12 Agents</SubsectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className={`${agent.bg} ${agent.border} h-full`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <agent.icon className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <div>
                    <CardTitle className={`${agent.color} text-base`}>{agent.name}</CardTitle>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-600 mt-1 text-[10px]">
                      {agent.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-xs leading-relaxed">{agent.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 4.3 Inter-Agent Communication */}
      <SubsectionTitle id="inter-agent">4.3 Communication Inter-Agents</SubsectionTitle>
      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate-300 leading-relaxed mb-8">
          La communication entre les agents est basée sur une architecture
          event-driven avec Apache Kafka comme bus de messages. Chaque agent publie
          des événements sur des sujets spécifiques et s'abonne aux événements des
          autres agents dont il dépend. Une base de connaissances partagée permet
          aux agents de consulter le contexte global et les décisions passées.
        </p>

        {/* Communication Diagram */}
        <div className="bg-slate-800/40 rounded-lg p-6 overflow-x-auto">
          <div className="min-w-[500px] space-y-4">
            {/* Top Row */}
            <div className="flex justify-center gap-3">
              {agents.slice(0, 4).map((agent) => (
                <div
                  key={agent.name}
                  className={`${agent.border} border rounded-lg px-3 py-2 text-center min-w-[100px]`}
                >
                  <agent.icon className={`w-4 h-4 ${agent.color} mx-auto mb-1`} />
                  <span className="text-slate-200 text-[10px] font-medium">{agent.name.replace('Agent ', '')}</span>
                </div>
              ))}
            </div>

            {/* Connection Row 1 */}
            <div className="flex justify-center">
              <div className="flex items-center gap-1 text-slate-500">
                <Workflow className="w-4 h-4" />
                <span className="text-xs">Kafka Event Bus</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Middle Row */}
            <div className="flex justify-center gap-3">
              {agents.slice(4, 8).map((agent) => (
                <div
                  key={agent.name}
                  className={`${agent.border} border rounded-lg px-3 py-2 text-center min-w-[100px]`}
                >
                  <agent.icon className={`w-4 h-4 ${agent.color} mx-auto mb-1`} />
                  <span className="text-slate-200 text-[10px] font-medium">{agent.name.replace('Agent ', '')}</span>
                </div>
              ))}
            </div>

            {/* Connection Row 2 */}
            <div className="flex justify-center">
              <div className="flex items-center gap-1 text-slate-500">
                <Database className="w-4 h-4" />
                <span className="text-xs">Base de Connaissances Partagée</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-center gap-3">
              {agents.slice(8, 12).map((agent) => (
                <div
                  key={agent.name}
                  className={`${agent.border} border rounded-lg px-3 py-2 text-center min-w-[100px]`}
                >
                  <agent.icon className={`w-4 h-4 ${agent.color} mx-auto mb-1`} />
                  <span className="text-slate-200 text-[10px] font-medium">{agent.name.replace('Agent ', '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <h5 className="text-slate-100 font-medium text-sm">Kafka Event Bus</h5>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Chaque agent publie et consomme des événements sur des sujets Kafka dédiés.
              Garantie de livraison (at-least-once), réplication inter-régions et
              rétention configurable. Les événements incluent les décisions, les alertes,
              les métriques et les demandes de collaboration.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h5 className="text-slate-100 font-medium text-sm">Base de Connaissances Partagée</h5>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Un store vectoriel partagé contenant le contexte business global, l\'historique
              des décisions, les patterns identifiés et les recommandations. Chaque agent
              peut interroger cette base pour enrichir ses propres décisions avec le
              contexte collectif.
            </p>
          </div>
        </div>
      </motion.div>
    </PartWrapper>
  );
}
