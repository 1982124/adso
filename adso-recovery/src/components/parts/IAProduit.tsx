'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  GraduationCap,
  ClipboardCheck,
  Gamepad2,
  Languages,
  TrendingUp,
  Headphones,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

interface AIFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  desc: string;
  capabilities: string[];
}

const aiFeatures: AIFeature[] = [
  {
    icon: Brain,
    title: '5.1 AI Driving Coach',
    subtitle: 'Coach de Conduite Personnel',
    desc: "L'IA Driving Coach est le compagnon intelligent de l'élève conducteur. Il analyse en temps réel les performances, identifie les lacunes et adapte le parcours d'apprentissage pour une progression optimale.",
    capabilities: [
      'Entraînement personnalisé basé sur le profil de conduite et les erreurs récurrentes',
      'Learning analytics avancées avec courbes de progression et prédictions de réussite',
      'Gamification : points, badges, défis quotidiens, classements et récompenses',
      'Retours contextuels immédiats après chaque exercice ou quiz',
      'Planification adaptative des révisions selon la courbe d\'oubli d\'Ebbinghaus',
    ],
  },
  {
    icon: GraduationCap,
    title: '5.2 AI Teacher',
    subtitle: 'Enseignant Intelligent',
    desc: "L'AI Teacher génère et adapte les explications pédagogiques en fonction du profil cognitif de l'élève. Il peut alterner entre différents modes d'explication pour maximiser la compréhension.",
    capabilities: [
      'Explications adaptatives : visuelles, textuelles, audio selon le style d\'apprentissage',
      'Contenu multimodal : vidéos, infographies interactives, simulations 3D',
      'Support multilingue natif avec traduction contextuelle en 50+ langues',
      'Génération de contenu pédagogique personnalisé pour chaque lacune identifiée',
      'Système Socratic : pose des questions pour guider l\'élève vers la compréhension',
    ],
  },
  {
    icon: ClipboardCheck,
    title: '5.3 AI Examiner',
    subtitle: 'Examinateur Intelligent',
    desc: "L'AI Examiner conçoit et administre des examens adaptatifs qui évaluent précisément le niveau de connaissances. Il ajuste la difficulté en temps réel pour une évaluation juste et exhaustive.",
    capabilities: [
      'Examens adaptatifs : la difficulté s\'ajuste dynamiquement selon les réponses',
      'Détection de triche par analyse comportementale (proctoring intelligent)',
      'Analyse d\'erreurs détaillée avec explications des mauvaises réponses',
      'Génération automatique de nouvelles questions pour éviter la mémorisation',
      'Rapports post-examen avec recommandations de révision ciblées',
    ],
  },
  {
    icon: Gamepad2,
    title: '5.4 AI Simulator',
    subtitle: 'Simulateur de Conduite',
    desc: "L'AI Simulator crée des scénarios de conduite 3D immersifs et interactifs pour permettre aux élèves de pratiquer dans un environnement sûr et réaliste sans risque.",
    capabilities: [
      'Scénarios 3D réalistes : intersections, rond-points, autoroutes, conditions météo',
      'Entraînement sans risque avec retour immédiat sur chaque décision de conduite',
      'Support VR/AR pour une immersion totale avec casque de réalité virtuelle',
      'Génération procédurale de scénarios personnalisés selon les lacunes de l\'élève',
      'Intégration IoT avec les données du véhicule réel pour des scénarios hybrides',
    ],
  },
  {
    icon: Languages,
    title: '5.5 AI Translation Engine',
    subtitle: 'Moteur de Traduction',
    desc: "Le moteur de traduction IA assure la traduction de tout le contenu pédagogique en 50+ langues avec une qualité professionnelle, en tenant compte du contexte automobile et des réglementations locales.",
    capabilities: [
      'Support de 50+ langues avec traduction en temps réel des cours et quiz',
      'Adaptation contextuelle au vocabulaire automobile et aux panneaux de signalisation',
      'Traduction des questions d\'examen en respectant le jargon juridique local',
      'Voix off multilingue pour les vidéos et les explications audio',
      'Détection automatique de la langue préférée et basculement fluide',
    ],
  },
  {
    icon: TrendingUp,
    title: '5.6 AI Business Analyst',
    subtitle: 'Analyste Business',
    desc: "L'AI Business Analyst fournit des insights actionnables aux gestionnaires d'auto-écoles et aux équipes ADSO à travers des analyses prédictives et des tableaux de bord intelligents.",
    capabilities: [
      'Analyses prédictives : prédiction du taux de réussite, du churn et du LTV',
      'Détection précoce des élèves à risque de décrochage avec recommandations',
      'Optimisation des plannings et des ressources basée sur les données historiques',
      'Tableaux de bord personnalisés pour chaque rôle (gestionnaire, moniteur, admin)',
      'Rapports automatisés avec insights narratifs générés par IA',
    ],
  },
  {
    icon: Headphones,
    title: '5.7 AI Customer Support',
    subtitle: 'Support Client IA',
    desc: "Le support client IA assure une assistance 24h/24, 7j/7 dans toutes les langues de la plateforme. Il résout 80% des demandes de niveau 1 automatiquement et escalade intelligemment les cas complexes.",
    capabilities: [
      'Disponibilité 24/7 multilingue avec résolution instantanée des demandes courantes',
      'Aide contextuelle : l\'IA connaît le parcours et l\'historique de l\'utilisateur',
      'Escalade intelligente vers un humain avec transfert du contexte complet',
      'Base de connaissances auto-enrichie à partir des résolutions réussies',
      'Analyse de sentiment pour détecter l\'insatisfaction et prioriser les escalades',
    ],
  },
  {
    icon: ShieldCheck,
    title: '5.8 Sécurité IA et RAG',
    subtitle: 'Fiabilité & Garde-Fous',
    desc: "La sécurité de l'IA est garantie par une architecture RAG (Retrieval-Augmented Generation) qui empêche les hallucinations et garantit que toutes les réponses sont fondées sur du contenu vérifié.",
    capabilities: [
      'Prévention des hallucinations : chaque réponse est vérifiée contre le contenu de référence',
      'Vérification de contenu en temps réel pour garantir l\'exactitude des informations',
      'Garde-fous (guardrails) pour empêcher les réponses hors périmètre',
      'Traçabilité complète : chaque réponse IA est liée à ses sources',
      'Audit régulier du modèle par l\'Agent QA et l\'Agent Security d\'AI-SCOS',
    ],
  },
];

export default function IAProduit({ className }: PartProps) {
  return (
    <PartWrapper id="ia-produit" className={className}>
      <SectionTitle subtitle="Les 8 moteurs IA qui transforment l'éducation à la conduite">
        Partie 5 — IA Produit
      </SectionTitle>

      <motion.p
        className="text-slate-300 text-base leading-relaxed mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Chaque composant IA d'ADSO est conçu pour résoudre un problème métier spécifique
        avec une expertise approfondie. Ensemble, ils forment un écosystème intelligent
        qui couvre l'ensemble du parcours d'apprentissage, de l'inscription à la certification.
      </motion.p>

      <div className="space-y-8">
        {aiFeatures.map((feature, featureIdx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: featureIdx * 0.05 }}
          >
            <Card className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10">
                    <feature.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100 text-lg">{feature.title}</CardTitle>
                    <span className="text-slate-400 text-sm">{feature.subtitle}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">{feature.desc}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {feature.capabilities.map((cap, capIdx) => (
                    <motion.div
                      key={capIdx}
                      custom={capIdx}
                      variants={fadeInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 text-xs leading-relaxed">{cap}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PartWrapper>
  );
}
