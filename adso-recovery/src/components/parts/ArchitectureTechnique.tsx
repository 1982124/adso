'use client';

import { motion } from 'framer-motion';
import {
  Cloud,
  Container,
  Globe2,
  MonitorSmartphone,
  Code2,
  Server,
  Lock,
  Database,
  HardDrive,
  Zap,
  Shield,
  KeyRound,
  Fingerprint,
  UserCog,
  Archive,
  Cpu,
  Radio,
  Workflow,
  Users,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Bell,
  BarChart3,
  Brain,
  FileImage,
  Calendar,
  Handshake,
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
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function ArchitectureTechnique({ className }: PartProps) {
  return (
    <PartWrapper id="architecture" className={className}>
      <SectionTitle subtitle="Infrastructure cloud-native, microservices et pile technologique moderne">
        Partie 3 — Architecture Technique
      </SectionTitle>

      {/* 3.1 Cloud Architecture */}
      <SubsectionTitle id="cloud-architecture">3.1 Architecture Cloud</SubsectionTitle>
      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sm:p-8 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          L'architecture cloud d'ADSO repose sur Kubernetes pour l'orchestration de
          conteneurs, avec une approche microservices garantissant la scalabilité,
          la résilience et l'isolation des failures. Le déploiement multi-région
          assure une latence minimale pour les utilisateurs répartis dans 120+ pays.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Container,
              title: 'Kubernetes',
              desc: 'Orchestration de conteneurs avec auto-scaling horizontal, health checks, rolling updates et self-healing.',
            },
            {
              icon: Workflow,
              title: 'Microservices',
              desc: 'Architecture en 12 services indépendants communiquant via API REST/gRPC et event bus Kafka.',
            },
            {
              icon: Globe2,
              title: 'Multi-Région',
              desc: 'Déploiement sur 3+ régions (EU, US, APAC) avec CDN global et load balancing géographique.',
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
                <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <h5 className="text-slate-100 font-medium mb-1">{item.title}</h5>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 3.2 Frontend */}
      <SubsectionTitle id="frontend">3.2 Frontend</SubsectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-slate-900/80 border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
              Stack Frontend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Le frontend est construit avec les technologies les plus modernes du
              marché, optimisé pour la performance, l'accessibilité et l'expérience
              utilisateur. L'approche PWA garantit l'installabilité et le fonctionnement
              hors-ligne.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Next.js 15', desc: 'App Router, RSC' },
                { name: 'React 19', desc: 'Concurrent mode' },
                { name: 'TypeScript 5', desc: 'Type safety' },
                { name: 'PWA', desc: 'Hors-ligne' },
                { name: 'Tailwind CSS', desc: 'Utility-first' },
                { name: 'shadcn/ui', desc: 'Composants' },
              ].map((tech, i) => (
                <motion.div
                  key={tech.name}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3 text-center">
                    <div className="text-cyan-400 font-semibold text-sm">{tech.name}</div>
                    <div className="text-slate-500 text-xs mt-1">{tech.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 3.3 Backend Modular */}
      <SubsectionTitle id="backend">3.3 Backend Modulaire</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        Le backend est composé de 12 microservices indépendants, chacun responsable
        d'un domaine métier spécifique. Cette architecture permet un développement,
        un déploiement et une mise à l'échelle indépendants de chaque service.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {[
          { icon: KeyRound, name: 'Auth Service', desc: 'Authentification, OAuth 2.0, JWT' },
          { icon: Users, name: 'User Service', desc: 'Profils, préférences, rôles' },
          { icon: BookOpen, name: 'Content Service', desc: 'Cours, modules, médias' },
          { icon: GraduationCap, name: 'Learning Service', desc: 'Progression, parcours IA' },
          { icon: ClipboardCheck, name: 'Exam Service', desc: 'Quiz, examens adaptatifs' },
          { icon: CreditCard, name: 'Payment Service', desc: 'Paiements, abonnements' },
          { icon: Bell, name: 'Notification Service', desc: 'Push, email, in-app' },
          { icon: BarChart3, name: 'Analytics Service', desc: 'Métriques, rapports' },
          { icon: Brain, name: 'AI Service', desc: 'IA Coach, recommandations' },
          { icon: FileImage, name: 'File Service', desc: 'Upload, CDN, images' },
          { icon: Calendar, name: 'Schedule Service', desc: 'Calendrier, réservations' },
          { icon: Handshake, name: 'Partner Service', desc: 'Partenariats, marketplace' },
        ].map((service, i) => (
          <motion.div
            key={service.name}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/40 transition-colors h-full">
              <CardContent className="pt-6 p-4">
                <service.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-slate-100 font-medium text-sm">{service.name}</div>
                <div className="text-slate-400 text-xs mt-1">{service.desc}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 3.4 Database PostgreSQL */}
      <SubsectionTitle id="database">3.4 Base de Données PostgreSQL</SubsectionTitle>
      <p className="text-slate-300 text-base leading-relaxed mb-6">
        PostgreSQL est le moteur de base de données principal d'ADSO, choisi pour sa
        fiabilité, ses performances sur des charges de travail complexes et son
        support natif du JSONB pour les données semi-structurées.
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
              <TableHead className="text-slate-300 font-semibold">Table</TableHead>
              <TableHead className="text-slate-300 font-semibold">Description</TableHead>
              <TableHead className="text-slate-300 font-semibold">Colonnes Clés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { table: 'users', desc: 'Profils utilisateurs', cols: 'id, email, role, lang, country' },
              { table: 'courses', desc: 'Cours de conduite', cols: 'id, title, category, difficulty, published' },
              { table: 'modules', desc: 'Modules de cours', cols: 'id, course_id, title, type, order' },
              { table: 'enrollments', desc: 'Inscriptions élèves', cols: 'id, user_id, course_id, status, progress' },
              { table: 'quiz_attempts', desc: 'Tentatives de quiz', cols: 'id, user_id, score, duration, passed' },
              { table: 'questions', desc: 'Questions d\'examen', cols: 'id, module_id, type, difficulty, answers' },
              { table: 'chat_messages', desc: 'Messages IA Coach', cols: 'id, user_id, role, content, timestamp' },
              { table: 'schools', desc: 'Auto-écoles', cols: 'id, name, country, plan, tenant_id' },
              { table: 'analytics_events', desc: 'Événements tracking', cols: 'id, user_id, event_type, metadata, ts' },
            ].map((row, i) => (
              <TableRow key={i} className="border-slate-700/30">
                <TableCell className="text-cyan-400 font-mono text-sm">{row.table}</TableCell>
                <TableCell className="text-slate-200">{row.desc}</TableCell>
                <TableCell className="text-slate-400 text-xs">{row.cols}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 3.5 Auth & Security */}
      <SubsectionTitle id="auth-security">3.5 Authentification & Sécurité</SubsectionTitle>
      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          La sécurité est un pilier fondamental de l'architecture ADSO. Le système
          d'authentification est basé sur OAuth 2.0 avec des tokens JWT à courte
          durée de vie, complété par une authentification multi-facteurs et un
          contrôle d'accès basé sur les rôles.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Shield,
              title: 'OAuth 2.0',
              desc: 'Flux d\'autorisation standard avec support Google, Apple, Facebook et email/password.',
            },
            {
              icon: KeyRound,
              title: 'JWT Double Tokens',
              desc: 'Access token de 15 minutes + Refresh token de 7 jours. Rotation automatique des refresh tokens.',
            },
            {
              icon: Fingerprint,
              title: 'MFA',
              desc: 'Authentification multi-facteurs via TOTP, SMS, ou clé physique (WebAuthn/FIDO2).',
            },
            {
              icon: UserCog,
              title: 'RBAC',
              desc: 'Contrôle d\'accès basé sur les rôles : élève, moniteur, gestionnaire, admin, super-admin.',
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
                <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <h5 className="text-slate-100 font-medium mb-1">{item.title}</h5>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Separator className="bg-slate-800 mb-12" />

      {/* 3.6 Storage */}
      <SubsectionTitle id="storage">3.6 Stockage & Cache</SubsectionTitle>
      <motion.div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          La stratégie de stockage combine un stockage objet S3 avec cycle de vie
          automatique, un cache en mémoire Redis pour les données fréquemment
          accédées, et un bus d'événements Kafka pour la communication
          asynchrone entre microservices.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Archive,
              title: 'S3 + Lifecycle',
              desc: 'Stockage objet avec règles de cycle de vie : migration automatique vers Glacier après 90 jours, suppression après 1 an pour les fichiers temporaires. CDN intégré pour la distribution de médias.',
            },
            {
              icon: Zap,
              title: 'Redis Cache',
              desc: 'Cache distribué pour les sessions, le contenu fréquemment accédé et les résultats de requêtes. Stratégie TTL adaptative avec invalidation intelligente sur mise à jour des données.',
            },
            {
              icon: Radio,
              title: 'Kafka Event Bus',
              desc: 'Bus d\'événements pour la communication asynchrone entre services. Garantit la livraison des événements avec réplication et partitionnement. Sujet par domaine métier.',
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
                <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <h5 className="text-slate-100 font-medium mb-1">{item.title}</h5>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PartWrapper>
  );
}
