'use client';

import { motion } from 'framer-motion';
import {
  Globe,
  GraduationCap,
  ShieldCheck,
  Target,
  Users,
  Languages,
  Car,
  Link2,
  Skull,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Puzzle,
  MapPin,
  Network,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PartWrapper,
  SectionTitle,
  SubsectionTitle,
  FadeIn,
  type PartProps,
} from './BlueprintPart';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function VisionEntreprise({ className }: PartProps) {
  return (
    <PartWrapper id="vision" className={className}>
      <SectionTitle subtitle="Fondation stratégique et ambition mondiale d'ADSO">
        Partie 1 — Vision Entreprise
      </SectionTitle>

      {/* 1.1 Mission */}
      <SubsectionTitle id="mission">1.1 Mission</SubsectionTitle>
      <motion.p
        className="text-slate-300 text-base leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        La mission d'ADSO est de démocratiser l'éducation à la conduite dans le monde
        entier en rendant l'apprentissage accessible, personnalisé et efficace pour
        chaque conducteur, quel que soit son contexte géographique, social ou
        économique. ADSO s'engage à transformer radicalement la formation au permis
        de conduire grâce à une plateforme IA de nouvelle génération, en s'appuyant
        sur trois piliers fondamentaux :
      </motion.p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Globe,
            title: 'Démocratie Totale',
            desc: "Rendre l'éducation à la conduite accessible à tous, partout dans le monde, en éliminant les barrières géographiques, linguistiques et financières. Chaque individu, qu'il soit en zone urbaine ou rurale, dans un pays développé ou en développement, doit avoir accès à une formation de qualité.",
          },
          {
            icon: GraduationCap,
            title: 'Excellence Pédagogique',
            desc: "Offrir une expérience d'apprentissage supérieure grâce à l'intelligence artificielle, aux simulations interactives et à une méthodologie fondée sur la science cognitive. L'IA adapte le parcours de chaque apprenant en temps réel, identifiant les lacunes et renforçant les points faibles pour maximiser la rétention et la compréhension.",
          },
          {
            icon: ShieldCheck,
            title: 'Sécurité Routière Globale',
            desc: "Contribuer activement à la réduction des accidents de la route à l'échelle mondiale en formant des conducteurs mieux préparés, plus responsables et plus conscients des risques. Chaque conducteur formé par ADSO devient un acteur de la sécurité routière dans sa communauté.",
          },
        ].map((pillar, i) => (
          <motion.div
            key={pillar.title}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/40 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <pillar.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <CardTitle className="text-slate-100 text-lg">
                    {pillar.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 1.2 Vision 2030 */}
      <SubsectionTitle id="vision-2030">1.2 Vision 2030</SubsectionTitle>
      <motion.div
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-200 text-lg leading-relaxed mb-6">
          D'ici 2030, ADSO ambitionne de devenir la référence mondiale absolue de
          l'éducation à la conduite intelligente. La plateforme vise à toucher{' '}
          <span className="text-cyan-400 font-semibold">100 millions d'utilisateurs</span>{' '}
          répartis dans{' '}
          <span className="text-cyan-400 font-semibold">120+ pays</span>,
          couvrant{' '}
          <span className="text-cyan-400 font-semibold">50+ langues</span>.
          ADSO sera le pont entre la formation traditionnelle et l'ère des véhicules
          connectés et autonomes, en intégrant des certifications basées sur la
          blockchain et en préparant les conducteurs aux défis technologiques de
          demain.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
            <Users className="w-4 h-4 mr-1.5" />
            100M utilisateurs
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
            <Globe className="w-4 h-4 mr-1.5" />
            120+ pays
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
            <Languages className="w-4 h-4 mr-1.5" />
            50+ langues
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
            <Car className="w-4 h-4 mr-1.5" />
            Véhicules connectés & autonomes
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1.5 text-sm">
            <Link2 className="w-4 h-4 mr-1.5" />
            Certification blockchain
          </Badge>
        </div>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 1.3 Problème Mondial Résolu */}
      <SubsectionTitle id="probleme-mondial">
        1.3 Problème Mondial Résolu
      </SubsectionTitle>
      <motion.div
        className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 sm:p-6 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Skull className="w-6 h-6 text-red-400" />
          <span className="text-red-400 font-bold text-xl">1,35 million</span>
          <span className="text-slate-300">
            de décès par an sur les routes dans le monde (OMS). Les accidents de la
            route sont la{' '}
            <strong className="text-slate-200">
              première cause de mortalité chez les 5-29 ans
            </strong>
            .
          </span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Problems Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-400" />
            <h4 className="text-slate-200 font-semibold text-lg">
              Problèmes Identifiés
            </h4>
          </div>
          <Card className="bg-slate-900/80 border-red-500/20">
            <CardContent className="space-y-3 pt-6">
              {[
                'Accès inégal à la formation selon la localisation géographique et le revenu',
                'Méthodes pédagogiques obsolètes et non personnalisées',
                'Absence de suivi longitudinal des compétences du conducteur',
                'Coûts prohibitifs dans les pays en développement',
                'Manque de standards internationaux de formation',
                'Taux d\'échec élevé aux examens de conduite (30-50%)',
                'Corruption et manque de transparence dans la délivrance des permis',
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm">{problem}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Solutions Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h4 className="text-slate-200 font-semibold text-lg">
              Solutions ADSO
            </h4>
          </div>
          <Card className="bg-slate-900/80 border-cyan-500/20">
            <CardContent className="space-y-3 pt-6">
              {[
                'Plateforme accessible partout via PWA et application mobile',
                'IA adaptative qui personnalise le parcours d\'apprentissage',
                'Analytique prédictive et suivi continu des compétences',
                'Modèle freemium + tarification adaptée au pouvoir d\'achat local',
                'Conformité avec les réglementations de 120+ pays',
                'Examens adaptatifs avec taux de réussite amélioré de 40%',
                'Certification blockchain infalsifiable et transparente',
              ].map((solution, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm">{solution}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 1.4 Avantage Concurrentiel */}
      <SubsectionTitle id="avantage-concurrentiel">
        1.4 Avantage Concurrentiel
      </SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        L'avantage concurrentiel d'ADSO repose sur cinq piliers stratégiques
        fondamentaux qui créent une barrière à l'entrée significative et un
        positionnement unique sur le marché mondial de l'EdTech automobile.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {[
          {
            num: 1,
            icon: Cpu,
            title: 'Architecture AI-First',
            desc: "L'intelligence artificielle n'est pas un ajout mais le fondement même de la plateforme. Chaque fonctionnalité est conçue autour de l'IA, du coaching personnalisé à la correction automatique d'examens.",
          },
          {
            num: 2,
            icon: Layers,
            title: 'Écosystème Complet',
            desc: "ADSO couvre l'intégralité de la chaîne de valeur : élève, moniteur, auto-école, entreprise et administration. Aucun concurrent n'offre cette couverture holistique.",
          },
          {
            num: 3,
            icon: Puzzle,
            title: 'Modularité SaaS Multitenant',
            desc: "Architecture modulaire permettant à chaque acteur (auto-école, entreprise, administration) de n'utiliser que les modules dont il a besoin, avec une isolation complète des données.",
          },
          {
            num: 4,
            icon: MapPin,
            title: 'Localisation Profonde',
            desc: "Adaptation au contexte local : réglementations routières spécifiques, langues locales, conditions de conduite régionales, tarification adaptée au pouvoir d'achat (PPA).",
          },
          {
            num: 5,
            icon: Network,
            title: 'Vision Écosystémique',
            desc: "ADSO ne se limite pas à un produit : c'est un écosystème connecté intégrant IoT, télématique, assurance, constructeurs automobiles et autorités de régulation.",
          },
        ].map((pillar, i) => (
          <motion.div
            key={pillar.num}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={pillar.num === 5 ? 'sm:col-span-2 lg:col-span-1' : ''}
          >
            <Card className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/40 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">
                    {pillar.num}
                  </div>
                  <div className="flex items-center gap-2">
                    <pillar.icon className="w-4 h-4 text-cyan-400" />
                    <CardTitle className="text-slate-100 text-base">
                      {pillar.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 1.5 Positionnement Face aux EdTech */}
      <SubsectionTitle id="positionnement-edtech">
        1.5 Positionnement Face aux EdTech
      </SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        Contrairement aux plateformes EdTech généralistes comme Coursera, Udemy ou
        edX qui proposent une approche horizontale couvrant tous les domaines de
        connaissance, ADSO adopte une approche{' '}
        <span className="text-cyan-400 font-semibold">verticale spécialisée</span>{' '}
        entièrement dédiée à l'éducation à la conduite. Cette spécialisation permet
        une profondeur fonctionnelle inatteignable par les plateformes généralistes.
      </p>

      <div className="rounded-xl border border-slate-700/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-transparent">
              <TableHead className="text-slate-300 font-semibold">
                Critère
              </TableHead>
              <TableHead className="text-cyan-400 font-semibold">
                ADSO
              </TableHead>
              <TableHead className="text-slate-300 font-semibold">
                EdTech Généralistes
              </TableHead>
              <TableHead className="text-slate-300 font-semibold">
                Concurrents Locaux
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                criterion: 'Approche',
                adso: 'Verticale spécialisée',
                general: 'Horizontale généraliste',
                local: 'Locale monopays',
              },
              {
                criterion: 'IA Intégrée',
                adso: 'AI-First (fondation)',
                general: 'Fonctionnalité ajoutée',
                local: 'Minimale ou absente',
              },
              {
                criterion: 'Couverture Écosystème',
                adso: 'Élève + Moniteur + École + Entreprise',
                general: 'Apprenant uniquement',
                local: 'Élève uniquement',
              },
              {
                criterion: 'Certification',
                adso: 'Blockchain infalsifiable',
                general: 'Certificat numérique basique',
                local: 'Papier ou PDF',
              },
              {
                criterion: 'Simulations',
                adso: '3D + VR/AR + IoT',
                general: 'Aucune',
                local: 'Basiques (2D)',
              },
              {
                criterion: 'Localisation',
                adso: '120+ pays, 50+ langues',
                general: '20-40 langues',
                local: '1 langue, 1 pays',
              },
              {
                criterion: 'Modèle Economique',
                adso: 'SaaS B2B2C + Marketplace',
                general: 'SaaS B2C',
                local: 'Licence ou abonnement',
              },
              {
                criterion: 'Conformité Réglementaire',
                adso: 'Adaptée par pays',
                general: 'Non applicable',
                local: 'Conforme (1 pays)',
              },
            ].map((row, i) => (
              <TableRow
                key={i}
                className="border-slate-700/30"
              >
                <TableCell className="text-slate-200 font-medium">
                  {row.criterion}
                </TableCell>
                <TableCell className="text-cyan-300">
                  {row.adso}
                </TableCell>
                <TableCell className="text-slate-400">
                  {row.general}
                </TableCell>
                <TableCell className="text-slate-400">
                  {row.local}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <motion.div
        className="mt-6 flex items-center gap-2 text-cyan-400 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <ArrowRight className="w-4 h-4" />
        <span>
          ADSO combine la profondeur verticale d'un spécialiste avec l'échelle
          mondiale d'une plateforme horizontale.
        </span>
      </motion.div>
    </PartWrapper>
  );
}
