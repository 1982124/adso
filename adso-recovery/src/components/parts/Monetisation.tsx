'use client';

import { motion } from 'framer-motion';
import {
  User,
  Rocket,
  Crown,
  Star,
  Building2,
  Briefcase,
  Landmark,
  Store,
  Code2,
  Plug,
  Globe,
  CheckCircle2,
  XCircle,
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

function CheckCell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-cyan-400 text-xs font-medium">{value}</span>;
  }
  return value ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
  ) : (
    <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
  );
}

export default function Monetisation({ className }: PartProps) {
  return (
    <PartWrapper id="monetisation" className={className}>
      <SectionTitle subtitle="Modèle économique multi-canal avec tarification adaptée au marché local">
        Partie 6 — Monétisation
      </SectionTitle>

      {/* 6.1 B2C Pricing Table */}
      <SubsectionTitle id="b2c-pricing">6.1 Tarification B2C</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        Le modèle B2C propose quatre plans progressifs, du gratuit au premium,
        permettant à chaque utilisateur de trouver l'offre adaptée à ses besoins
        et à son budget. La conversion est optimisée par un modèle freemium
        généreux.
      </p>

      <motion.div
        className="rounded-xl border border-slate-700/50 overflow-hidden mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-transparent">
              <TableHead className="text-slate-300 font-semibold">Plan</TableHead>
              <TableHead className="text-slate-300 font-semibold">Prix</TableHead>
              <TableHead className="text-slate-300 font-semibold">Cours</TableHead>
              <TableHead className="text-slate-300 font-semibold">Quiz</TableHead>
              <TableHead className="text-slate-300 font-semibold">Examens</TableHead>
              <TableHead className="text-slate-300 font-semibold">IA Coach</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                plan: 'Free',
                price: '0€',
                highlight: false,
                courses: '20% du catalogue',
                quiz: '5/mois',
                exams: '1 examen blanc',
                aiCoach: false,
              },
              {
                plan: 'Starter',
                price: '9,99€/mois',
                highlight: false,
                courses: '100% théorie',
                quiz: 'Illimité',
                exams: 'Adaptatifs',
                aiCoach: false,
              },
              {
                plan: 'Pro',
                price: '19,99€/mois',
                highlight: true,
                courses: 'Tout Starter +',
                quiz: 'Tout Starter +',
                exams: 'Tout Starter +',
                aiCoach: true,
              },
              {
                plan: 'Premium',
                price: '39,99€/mois',
                highlight: false,
                courses: '+ Pratique',
                quiz: 'Tout Pro +',
                exams: '+ Blockchain',
                aiCoach: 'Dédié',
              },
            ].map((row, i) => (
              <TableRow
                key={i}
                className={`border-slate-700/30 ${row.highlight ? 'bg-cyan-500/5' : ''}`}
              >
                <TableCell className="text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    {row.plan === 'Free' && <User className="w-4 h-4 text-slate-400" />}
                    {row.plan === 'Starter' && <Rocket className="w-4 h-4 text-blue-400" />}
                    {row.plan === 'Pro' && <Crown className="w-4 h-4 text-cyan-400" />}
                    {row.plan === 'Premium' && <Star className="w-4 h-4 text-amber-400" />}
                    <span className={row.highlight ? 'text-cyan-400' : ''}>
                      {row.plan}
                    </span>
                    {row.highlight && (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">
                        Populaire
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-200 font-semibold">{row.price}</TableCell>
                <TableCell className="text-slate-300 text-sm">{row.courses}</TableCell>
                <TableCell className="text-slate-300 text-sm">{row.quiz}</TableCell>
                <TableCell className="text-slate-300 text-sm">{row.exams}</TableCell>
                <TableCell>
                  <CheckCell value={row.aiCoach} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 6.2 B2B Pricing */}
      <SubsectionTitle id="b2b-pricing">6.2 Tarification B2B</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        Les offres B2B s'adressent aux auto-écoles, aux entreprises avec flotte et
        aux administrations. Chaque plan inclut un nombre d'utilisateurs, des
        fonctionnalités avancées et un support dédié.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Building2,
            name: 'Starter',
            price: '299€/mois',
            desc: 'Pour les auto-écoles indépendantes. Gestion de 1 à 50 élèves avec CRM, facturation et analytics de base.',
            features: ['Jusqu\'à 50 élèves', 'CRM intégré', 'Facturation', 'Analytics basiques', 'Support email'],
          },
          {
            icon: Briefcase,
            name: 'Professionnel',
            price: '699€/mois',
            desc: 'Pour les auto-écoles multi-sites et les entreprises. Gestion de flotte, API avancée et support prioritaire.',
            features: [
              'Jusqu\'à 500 élèves',
              'Tout Starter +',
              'Gestion de flotte',
              'API avancée',
              'Support prioritaire',
              'White-label',
            ],
            highlight: true,
          },
          {
            icon: Landmark,
            name: 'Enterprise',
            price: 'Sur devis',
            desc: 'Pour les grandes organisations, gouvernements et franchises. Customisation complète et SLA garanti.',
            features: [
              'Utilisateurs illimités',
              'Tout Pro +',
              'Customisation complète',
              'SLA garanti 99.9%',
              'Account manager dédié',
              'Conformité sur mesure',
            ],
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card
              className={`h-full ${
                plan.highlight
                  ? 'bg-cyan-500/5 border-cyan-500/40'
                  : 'bg-slate-900/80 border-slate-700/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <plan.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">{plan.name}</CardTitle>
                    <div className="text-cyan-400 font-bold text-lg">{plan.price}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">{plan.desc}</p>
                <div className="space-y-2">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 6.3 Marketplace */}
      <SubsectionTitle id="marketplace">6.3 Marketplace</SubsectionTitle>
      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate-300 leading-relaxed mb-4">
          Le marketplace ADSO permet aux créateurs de contenu pédagogique (auto-écoles,
          moniteurs indépendants, éditeurs spécialisés) de publier et vendre leurs cours,
          quiz et simulations sur la plateforme.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <div className="text-cyan-400 font-bold text-2xl mb-1">15%</div>
            <div className="text-slate-300 text-sm font-medium">Commission par leçon</div>
            <div className="text-slate-400 text-xs mt-1">
              Commission prélevée sur chaque vente de contenu sur le marketplace
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <Store className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="text-slate-300 text-sm font-medium">Réductions de volume</div>
            <div className="text-slate-400 text-xs mt-1">
              12% au-delà de 100 ventes/mois, 10% au-delà de 500 ventes/mois
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-4">
            <Globe className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="text-slate-300 text-sm font-medium">Audience mondiale</div>
            <div className="text-slate-400 text-xs mt-1">
              Accès au marché de 100M d'utilisateurs potentiels dans 120+ pays
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 6.4 API Partnerships */}
      <SubsectionTitle id="api-partnerships">6.4 Partenariats API</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        L'API ADSO permet aux partenaires (assureurs, constructeurs automobiles,
        gouvernements) d'intégrer les fonctionnalités d'ADSO dans leurs propres
        applications et systèmes.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Code2,
            name: 'Sandbox',
            price: 'Gratuit',
            desc: 'Environnement de développement avec données de test. Idéal pour le prototypage et les POC.',
            features: ['1 000 requêtes/jour', 'Clé API sandbox', 'Documentation complète', 'Support communauté'],
          },
          {
            icon: Plug,
            name: 'Production',
            price: '99€/mois',
            desc: 'Accès complet à l\'API en production. Pour les intégrations en conditions réelles.',
            features: ['100 000 requêtes/mois', 'Clé API production', 'Webhooks', 'Support email prioritaire'],
            highlight: true,
          },
          {
            icon: Building2,
            name: 'Enterprise',
            price: 'Sur mesure',
            desc: 'Contrat personnalisé avec SLA garanti, volume illimité et support dédié.',
            features: ['Requêtes illimitées', 'SLA 99.9%', 'Account manager', 'Custom endpoints'],
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card
              className={`h-full ${
                plan.highlight
                  ? 'bg-cyan-500/5 border-cyan-500/40'
                  : 'bg-slate-900/80 border-slate-700/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <plan.icon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <CardTitle className="text-slate-100">{plan.name}</CardTitle>
                    <div className="text-cyan-400 font-bold">{plan.price}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-3">{plan.desc}</p>
                <div className="space-y-1.5">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 6.5 Prix par Pays */}
      <SubsectionTitle id="prix-pays">6.5 Prix par Pays (PPA)</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        ADSO applique une tarification adaptée au pouvoir d'achat local (Parité
        de Pouvoir d'Achat) pour rendre la plateforme accessible dans tous les
        marchés. Le prix de base (Zone 1) est ajusté par un coefficient PPA.
      </p>

      <motion.div
        className="rounded-xl border border-slate-700/50 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-transparent">
              <TableHead className="text-slate-300 font-semibold">Zone</TableHead>
              <TableHead className="text-slate-300 font-semibold">Exemples de Pays</TableHead>
              <TableHead className="text-slate-300 font-semibold">Coefficient PPA</TableHead>
              <TableHead className="text-slate-300 font-semibold">Prix Pro (exemple)</TableHead>
              <TableHead className="text-slate-300 font-semibold">Prix Premium (exemple)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                zone: 'Zone 1',
                countries: 'France, Allemagne, UK, Suisse, États-Unis, Canada',
                ppa: '1.0x',
                pro: '19,99€',
                premium: '39,99€',
              },
              {
                zone: 'Zone 2',
                countries: 'Espagne, Italie, Portugal, Pologne, Corée du Sud',
                ppa: '0.7x',
                pro: '13,99€',
                premium: '27,99€',
              },
              {
                zone: 'Zone 3',
                countries: 'Brésil, Turquie, Maroc, Tunisie, Vietnam, Thaïlande',
                ppa: '0.4x',
                pro: '7,99€',
                premium: '15,99€',
              },
              {
                zone: 'Zone 4',
                countries: 'Cameroun, Sénégal, Haïti, Bangladesh, Népal',
                ppa: '0.2x',
                pro: '3,99€',
                premium: '7,99€',
              },
            ].map((row, i) => (
              <TableRow key={i} className="border-slate-700/30">
                <TableCell className="text-cyan-400 font-medium">{row.zone}</TableCell>
                <TableCell className="text-slate-300 text-xs">{row.countries}</TableCell>
                <TableCell className="text-slate-200 font-mono">{row.ppa}</TableCell>
                <TableCell className="text-slate-200">{row.pro}</TableCell>
                <TableCell className="text-slate-200">{row.premium}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <motion.div
        className="mt-6 bg-slate-900/60 border border-slate-700/40 rounded-lg p-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-slate-400 text-xs leading-relaxed">
          <span className="text-cyan-400 font-medium">Note :</span> Les prix par
          pays sont calculés automatiquement en fonction de la géolocalisation de
          l'utilisateur et de l'indice PPA du pays. Les prix en monnaie locale sont
          affichés avec conversion automatique. Le coefficient PPA est mis à jour
          trimestriellement selon les données de la Banque Mondiale.
        </p>
      </motion.div>
    </PartWrapper>
  );
}
