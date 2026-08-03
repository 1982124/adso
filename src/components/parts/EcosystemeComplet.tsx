'use client';

import { motion } from 'framer-motion';
import {
  Smartphone,
  UserPlus,
  BookOpen,
  Brain,
  ClipboardCheck,
  Monitor,
  Calendar,
  Radio,
  Bluetooth,
  Building2,
  CreditCard,
  BarChart3,
  Car,
  Megaphone,
  Shield,
  Factory,
  Route,
  Gauge,
  Settings,
  Users,
  DollarSign,
  LineChart,
  FileText,
  Handshake,
  Headphones,
  Activity,
  ChevronRight,
  Wifi,
  GraduationCap,
  CarFront,
  Briefcase,
  Landmark,
  ArrowDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div custom={index} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/40 transition-colors h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Icon className="w-4 h-4 text-cyan-400" />
            </div>
            <CardTitle className="text-slate-100 text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function EcosystemeComplet({ className }: PartProps) {
  return (
    <PartWrapper id="ecosysteme" className={className}>
      <SectionTitle subtitle="Les six piliers de la plateforme ADSO couvrant l'ensemble de la chaîne de valeur">
        Partie 2 — Écosystème Complet
      </SectionTitle>

      {/* 2.1 Application Eleve */}
      <SubsectionTitle id="app-eleve">2.1 Application Élève</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        L'application élève est le point d'entrée principal de l'écosystème ADSO. Conçue
        comme une Progressive Web App (PWA), elle offre une expérience fluide sur mobile,
        tablette et desktop, avec un accès hors-ligne pour les zones à connectivité limitée.
      </p>

      <Tabs defaultValue="inscription" className="mb-12">
        <TabsList className="bg-slate-900 border border-slate-700/50 flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="inscription" className="text-xs sm:text-sm data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400">
            <UserPlus className="w-3.5 h-3.5 mr-1" />Inscription
          </TabsTrigger>
          <TabsTrigger value="cours" className="text-xs sm:text-sm data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400">
            <BookOpen className="w-3.5 h-3.5 mr-1" />Cours
          </TabsTrigger>
          <TabsTrigger value="ia-coach" className="text-xs sm:text-sm data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400">
            <Brain className="w-3.5 h-3.5 mr-1" />IA Coach
          </TabsTrigger>
          <TabsTrigger value="examens" className="text-xs sm:text-sm data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400">
            <ClipboardCheck className="w-3.5 h-3.5 mr-1" />Examens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inscription" className="mt-4">
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                2.1.1 Inscription & Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 leading-relaxed">
                Le processus d'inscription en 3 étapes est conçu pour maximiser la conversion
                tout en collectant les informations nécessaires à la personnalisation de
                l'expérience d'apprentissage.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    step: 'Étape 1',
                    title: 'Profil & Objectifs',
                    desc: "Création du compte, sélection du type de permis, pays et langue. Définition des objectifs personnels et du calendrier souhaité.",
                  },
                  {
                    step: 'Étape 2',
                    title: 'Évaluation Initiale IA',
                    desc: "Test diagnostique intelligent qui évalue le niveau de connaissances existant et identifie les lacunes pour construire un parcours personnalisé.",
                  },
                  {
                    step: 'Étape 3',
                    title: 'Parcours Personnalisé',
                    desc: "L'IA génère un plan d'apprentissage adapté au profil, au rythme et aux objectifs de l'élève avec des jalons clairs.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
                      <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 mb-2">
                        {item.step}
                      </Badge>
                      <h5 className="text-slate-100 font-medium mb-1">{item.title}</h5>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm">
                <Smartphone className="w-4 h-4" />
                <span>PWA installable — fonctionne hors-ligne avec synchronisation automatique</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cours" className="mt-4">
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                2.1.2 Cours & Contenu Pédagogique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Le contenu pédagogique est multimodal et conçu selon les principes de la
                science cognitive pour maximiser la rétention et l'engagement.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: '🎥',
                    title: 'Leçons Vidéo HD',
                    desc: 'Vidéos professionnelles avec sous-titres multilingues, ralentissement automatique et points de repère interactifs.',
                  },
                  {
                    icon: '📊',
                    title: 'Infographies Interactives',
                    desc: "Visualisations dynamiques des règles de priorité, panneaux et situations de conduite avec animations pas-à-pas.",
                  },
                  {
                    icon: '🎮',
                    title: 'Simulations 3D',
                    desc: "Environnements 3D réalistes pour pratiquer les intersections, rond-points et manœuvres dans un espace sans risque.",
                  },
                  {
                    icon: '⏱️',
                    title: 'Micro-Learning',
                    desc: "Modules courts de 5-10 minutes optimisés pour l'apprentissage mobile, avec révisions espacées basées sur la courbe d'oubli d'Ebbinghaus.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h5 className="text-slate-100 font-medium mb-1">{item.title}</h5>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia-coach" className="mt-4">
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                2.1.3 IA Coach Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                L'IA Coach est le compagnon intelligent de l'élève, disponible 24h/24 et 7j/7,
                qui analyse en temps réel ses performances et adapte le parcours d'apprentissage.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Analyse en Temps Réel',
                    desc: "Identification instantanée des lacunes et ajustement dynamique du contenu proposé en fonction des performances.",
                  },
                  {
                    title: 'Learning Analytics',
                    desc: "Tableau de bord détaillé avec métriques de progression, temps d'étude, taux de réussite par thématique et prédictions de réussite.",
                  },
                  {
                    title: 'Gamification',
                    desc: "Système de points, badges, classements et défis quotidiens pour maintenir l'engagement et la motivation.",
                  },
                  {
                    title: 'Disponibilité 24/7',
                    desc: "Assistance continue par chat IA avec capacité de réponse en 50+ langues et adaptation au fuseau horaire de l'élève.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
                      <h5 className="text-cyan-400 font-medium mb-1">{item.title}</h5>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examens" className="mt-4">
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                2.1.4 Examens & Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Le système d'examen utilise des algorithmes adaptatifs pour évaluer
                précisément le niveau de l'élève et préparer efficacement à l'examen officiel.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Examens Adaptatifs',
                    desc: "La difficulté des questions s'ajuste automatiquement en fonction des réponses précédentes pour une évaluation plus précise du niveau réel.",
                  },
                  {
                    title: 'Proctoring Intelligent',
                    desc: "Surveillance par IA détectant les comportements suspects (changement de fenêtre, présence multiple) pour garantir l'intégrité des évaluations.",
                  },
                  {
                    title: 'Certificats Blockchain',
                    desc: "Certificats infalsifiables enregistrés sur la blockchain, vérifiables par tout tiers (employeurs, assurances, autorités) en un clic.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
                      <h5 className="text-cyan-400 font-medium mb-1">{item.title}</h5>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="bg-slate-800 mb-12" />

      {/* 2.2 Application Moniteur */}
      <SubsectionTitle id="app-moniteur">2.2 Application Moniteur</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        L'application moniteur est l'outil de travail quotidien des instructeurs de
        conduite. Elle connecte le moniteur à ses élèves, à l'auto-école et aux
        capteurs IoT du véhicule pour un suivi complet des séances pratiques.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          {
            icon: Users,
            title: 'Vue Élèves',
            desc: "Tableau de bord complet de chaque élève : progression théorique, historique des séances pratiques, points forts et axes d'amélioration identifiés par l'IA.",
          },
          {
            icon: Calendar,
            title: 'Planification Intelligente',
            desc: "Calendrier intelligent avec optimisation automatique des créneaux, rappels push, gestion des annulations et remplacements, synchronisation multi-agenda.",
          },
          {
            icon: Radio,
            title: 'Rapports Télématiques IoT',
            desc: "Collecte en temps réel des données du véhicule via Bluetooth : vitesse, accélération, freinage, position GPS. Génération automatique de rapports post-séance.",
          },
          {
            icon: Bluetooth,
            title: 'Assistant IA Bluetooth',
            desc: "Connexion directe au véhicule via Bluetooth Low Energy pour remonter les données télémétriques et fournir des retours instantanés pendant la conduite.",
          },
        ].map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 2.3 Plateforme Auto-ecole SaaS */}
      <SubsectionTitle id="plateforme-autoecole">
        2.3 Plateforme Auto-École SaaS
      </SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        La plateforme SaaS pour auto-écoles est le outil de gestion tout-en-un qui
        permet aux gérants de piloter leur activité efficacement. Architecture
        multitenant avec isolation complète des données.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Users, title: 'CRM Élèves', desc: 'Gestion complète du cycle de vie élève : prospection, inscription, suivi, relances automatiques et fidélisation.' },
          { icon: CreditCard, title: 'Facturation & Paiements', desc: 'Facturation automatique, suivi des paiements, rappels, plans de paiement échelonné et intégration Stripe/local.' },
          { icon: BarChart3, title: 'Analytics & KPI', desc: 'Tableau de bord avec taux de réussite, chiffre d\'affaires, occupation des véhicules, satisfaction élèves.' },
          { icon: Car, title: 'Gestion de Flotte', desc: 'Suivi des véhicules, maintenance préventive, assurance, planning de disponibilité et historique d\'utilisation.' },
          { icon: Megaphone, title: 'Marketing & Acquisition', desc: 'Outils de marketing intégrés : landing pages, campagnes email, gestion des avis et référencement local.' },
          { icon: Shield, title: 'Conformité Réglementaire', desc: 'Génération automatique des documents réglementaires, suivi des agréments, audits de conformité et alertes.' },
        ].map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 2.4 Plateforme Entreprise */}
      <SubsectionTitle id="plateforme-entreprise">
        2.4 Plateforme Entreprise
      </SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        La plateforme entreprise permet aux entreprises de gérer la formation à la
        conduite de leurs employés, en particulier pour les flottes de véhicules
        professionnelles et les conducteurs lourds.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Factory, title: 'Formation Flotte', desc: "Programmes de formation personnalisés pour les conducteurs de flotte : poids lourds, transport de marchandises dangereuses, urgences." },
          { icon: ClipboardCheck, title: 'Suivi Conformité', desc: "Traçabilité complète des formations obligatoires, alertes de renouvellement et génération de rapports d'audit." },
          { icon: BarChart3, title: 'Dashboards Flotte', desc: "Visualisation en temps réel de l'état de la flotte : conducteurs formés, en formation, certificats expirants." },
          { icon: Wifi, title: 'Intégration Télématique', desc: "Connexion aux systèmes télématiques existants (Geotab, Samsara, Fleetmatics) pour des données de conduite réelles." },
        ].map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 2.5 Administration Centrale */}
      <SubsectionTitle id="administration-centrale">
        2.5 Administration Centrale
      </SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        L'administration centrale est le poste de commande de toute la plateforme ADSO,
        réservé aux équipes opérationnelles et de support.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Users, title: 'Gestion Utilisateurs', desc: 'Administration complète de tous les comptes : élèves, moniteurs, gestionnaires, administrateurs avec audit trail.' },
          { icon: DollarSign, title: 'Suivi Revenus', desc: 'Tableau de bord financier : revenus par pays, par plan, par canal. Projections et alertes de variance.' },
          { icon: LineChart, title: 'Analytics Avancés', desc: "Métriques globales : DAU/MAU, funnel de conversion, LTV, CAC, churn rate, NPS par segment géographique." },
          { icon: FileText, title: 'Gestion de Contenu', desc: "CMS multilingue pour gérer les cours, questions d'examen, vidéos et ressources pédagogiques de la plateforme." },
          { icon: Handshake, title: 'Partenariats', desc: "Gestion des partenariats : assureurs, constructeurs, gouvernements, ONG. Suivi des accords et royalties." },
          { icon: Headphones, title: 'Support & Ticketing', desc: "Système de support multi-canal avec IA de tri, escalades automatiques, base de connaissances et SLA tracking." },
          { icon: Activity, title: 'Monitoring & Santé', desc: "Surveillance en temps réel de la plateforme : uptime, temps de réponse, erreurs, alertes et incidents." },
        ].map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 2.6 Vue d'Ensemble */}
      <SubsectionTitle id="vue-ensemble">2.6 Vue d'Ensemble de l'Écosystème</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-8">
        Représentation visuelle de l'architecture en couches de l'écosystème ADSO,
        montrant les interconnexions entre les différentes plateformes.
      </p>

      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 sm:p-8 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Ecosystem Layer Diagram */}
        <div className="min-w-[500px] space-y-3">
          {/* Layer 1: Users */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2.5">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Élève</span>
            </div>
            <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2.5">
              <CarFront className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Moniteur</span>
            </div>
            <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2.5">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Entreprise</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-500" />
          </div>

          {/* Layer 2: Platforms */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-sm">Auto-École SaaS</span>
              </div>
              <p className="text-slate-400 text-xs">CRM, Facturation, Gestion de flotte</p>
            </div>
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-sm">App Élève & Moniteur</span>
              </div>
              <p className="text-slate-400 text-xs">Cours, IA Coach, Examens</p>
            </div>
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Factory className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-sm">Plateforme Entreprise</span>
              </div>
              <p className="text-slate-400 text-xs">Formation flotte, Conformité</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-500" />
          </div>

          {/* Layer 3: AI & Core */}
          <div className="bg-slate-800/80 border border-violet-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <span className="text-violet-400 font-medium">Moteur IA Central & AI-SCOS</span>
            </div>
            <p className="text-slate-400 text-xs">12 agents IA spécialisés — Coaching, Examen, Simulation, Traduction, Analytics, Support</p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-500" />
          </div>

          {/* Layer 4: Infrastructure */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Infrastructure Cloud & APIs</span>
            </div>
            <p className="text-slate-400 text-xs">Kubernetes, PostgreSQL, Redis, Kafka, S3 — Multi-région HA</p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-500" />
          </div>

          {/* Layer 5: Admin */}
          <div className="flex justify-center">
            <div className="bg-slate-800/80 border border-rose-500/30 rounded-lg px-6 py-3 text-center inline-flex items-center gap-2">
              <Landmark className="w-5 h-5 text-rose-400" />
              <span className="text-rose-400 font-medium">Administration Centrale</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-xs">Monitoring, Support, Analytics, Contenu</span>
            </div>
          </div>
        </div>
      </motion.div>
    </PartWrapper>
  );
}
