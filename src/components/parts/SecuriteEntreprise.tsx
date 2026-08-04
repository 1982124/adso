'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Database,
  KeyRound,
  Lock,
  GlobeLock,
  Fingerprint,
  ScrollText,
  Activity,
  HardDrive,
  Server,
  CloudOff,
  RotateCcw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
}

/* ─── 7.1 Protection des Données ─── */
const dataCategories = [
  {
    category: 'Identité & Profil',
    icon: <Fingerprint className="h-5 w-5" />,
    fields: ['Nom, prénom, date de naissance', 'Adresse, coordonnées', 'Numéro de permis', 'Photo profil'],
    regulations: ['RGPD Art. 6', 'CCPA §1798.100', 'LGPD Art. 7'],
  },
  {
    category: 'Formation & Apprentissage',
    icon: <ScrollText className="h-5 w-5" />,
    fields: ['Progression cours', 'Résultats examens', 'Historique sessions', 'Données quiz'],
    regulations: ['RGPD Art. 9', 'PIPA §18', 'LGPD Art. 11'],
  },
  {
    category: 'Financier & Paiement',
    icon: <KeyRound className="h-5 w-5" />,
    fields: ['Coordonnées bancaires', 'Historique transactions', 'Abonnements', 'Factures'],
    regulations: ['RGPD Art. 6(1b)', 'PCI-DSS L1', 'CCPA §1798.150'],
  },
]

/* ─── 7.2 Chiffrement & Infrastructure ─── */
const securityStack = [
  { layer: 'Application', items: ['HTTPS Strict', 'HSTS Headers', 'CSP Policy', 'CORS Restrictif'], color: 'from-cyan-500 to-cyan-600' },
  { layer: 'Transport', items: ['TLS 1.3', 'Certificate Pinning', 'mTLS Services', 'Perfect Forward Secrecy'], color: 'from-cyan-400 to-teal-500' },
  { layer: 'Données au repos', items: ['AES-256-GCM', 'Encryption at Rest', 'Column-Level Encryption', 'Key Wrapping'], color: 'from-teal-500 to-emerald-500' },
  { layer: 'Gestion des clés', items: ['AWS KMS', 'Rotation 90 jours', 'Hardware Security Module', 'Key Custodian'], color: 'from-emerald-500 to-green-500' },
]

/* ─── 7.3 MFA & RBAC ─── */
const mfaMethods = [
  { name: 'TOTP', desc: 'Time-based One-Time Password (Google Authenticator, Authy)', icon: <KeyRound className="h-5 w-5" /> },
  { name: 'SMS OTP', desc: 'Code à usage unique envoyé par SMS avec délai anti-rejeu', icon: <Fingerprint className="h-5 w-5" /> },
  { name: 'FIDO2 / WebAuthn', desc: 'Clés de sécurité matérielles (YubiKey, Titan)', icon: <ShieldCheck className="h-5 w-5" /> },
  { name: 'Hardware Tokens', desc: 'Jetons physiques RSA SecurID pour accès administrateur', icon: <Lock className="h-5 w-5" /> },
]

const rbacRoles = [
  { role: 'Super Admin', level: 'L1', access: 'Accès global, configuration système', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { role: 'Admin Auto-école', level: 'L2', access: 'Gestion complète de son établissement', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { role: 'Moniteur', level: 'L3', access: 'Planning, suivi élèves, examens', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { role: 'Élève', level: 'L4', access: 'Apprentissage, examens, messagerie', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { role: 'Parent / Tuteur', level: 'L5', access: 'Consultation progression, notifications', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { role: 'Auditeur', level: 'L6', access: 'Lecture seule, rapports conformité', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
]

/* ─── 7.4 Audit & Prevention ─── */
const auditFeatures = [
  { name: 'Logs Immuables', desc: 'S3 Object Lock — WORM, non supprimables, non modifiables', icon: <ScrollText className="h-5 w-5" /> },
  { name: 'Rétention 5 ans', desc: 'Conservation légale conforme aux réglementations europeénne et internationales', icon: <HardDrive className="h-5 w-5" /> },
  { name: 'SIEM Integration', desc: 'Splunk / Datadog Security — détection temps réel des anomalies', icon: <Activity className="h-5 w-5" /> },
  { name: 'WAF', desc: 'Web Application Firewall — protection OWASP Top 10, rate limiting', icon: <ShieldCheck className="h-5 w-5" /> },
  { name: 'DDoS Protection', desc: 'AWS Shield Advanced + CloudFront — mitigation automatique L3-L7', icon: <CloudOff className="h-5 w-5" /> },
  { name: 'Fraude ML', desc: 'Modele de détection de fraude — patterns anormaux, multi-comptes', icon: <Lock className="h-5 w-5" /> },
]

/* ─── 7.5 Sauvegardes & Reprise ─── */
const backupRules = [
  { copies: '3 copies', media: '2 types de supports', offsite: '1 hors site', desc: 'Règle 3-2-1 : redondance maximale' },
]

export default function SecuriteEntreprise() {
  return (
    <section id="securite" className="bg-slate-950 py-20 px-4">
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
            Partie 7 — CISO
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Securite Entreprise
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Infrastructure de securite de niveau bancaire pour proteger les donnees de millions d&apos;utilisateurs
          </p>
        </motion.div>

        <Tabs defaultValue="donnees" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-slate-900 border border-slate-800 h-auto p-1 mb-10">
            <TabsTrigger value="donnees" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              7.1 Protection
            </TabsTrigger>
            <TabsTrigger value="chiffrement" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              7.2 Chiffrement
            </TabsTrigger>
            <TabsTrigger value="mfa" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              7.3 MFA & RBAC
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              7.4 Audit & Prevention
            </TabsTrigger>
            <TabsTrigger value="sauvegardes" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              7.5 Sauvegardes
            </TabsTrigger>
          </TabsList>

          {/* ─── 7.1 ─── */}
          <TabsContent value="donnees">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                7.1 Protection des Donnees — Conformite RGPD, CCPA, LGPD, PIPA
              </h3>
              <p className="text-slate-400 text-sm">
                Classification et protection par categorie de donnees personnelles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dataCategories.map((cat, i) => (
                <motion.div key={cat.category} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                          {cat.icon}
                        </div>
                        <CardTitle className="text-base">{cat.category}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Donnees collectees</p>
                        <ul className="space-y-1.5">
                          {cat.fields.map((f) => (
                            <li key={f} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="bg-slate-800" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Reglementations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.regulations.map((r) => (
                            <Badge key={r} variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/5">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 7.2 ─── */}
          <TabsContent value="chiffrement">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                7.2 Chiffrement et Infrastructure
              </h3>
              <p className="text-slate-400 text-sm">
                Stack de securite en couches — du navigateur jusqu&apos;au Hardware Security Module
              </p>
            </div>
            <div className="space-y-4">
              {securityStack.map((layer, i) => (
                <motion.div
                  key={layer.layer}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Layer label */}
                        <div className={`md:w-48 shrink-0 px-6 py-4 flex items-center bg-gradient-to-r ${layer.color} bg-opacity-10`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${layer.color}`} />
                            <span className="font-semibold text-slate-100 text-sm">{layer.layer}</span>
                          </div>
                        </div>
                        {/* Items */}
                        <div className="flex-1 px-6 py-4 flex flex-wrap gap-2">
                          {layer.items.map((item) => (
                            <Badge key={item} variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/50 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 7.3 ─── */}
          <TabsContent value="mfa">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                7.3 Authentification MFA et RBAC
              </h3>
              <p className="text-slate-400 text-sm">
                Multi-factor authentication et controle d&apos;acces granulaire
              </p>
            </div>

            {/* MFA Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {mfaMethods.map((m, i) => (
                <motion.div key={m.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 h-full">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
                        {m.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 mb-1">{m.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Separator className="bg-slate-800 mb-10" />

            {/* RBAC Roles */}
            <h4 className="text-lg font-semibold text-slate-200 mb-4">6 Roles RBAC</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rbacRoles.map((role, i) => (
                <motion.div key={role.role} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs border ${role.color}`}>
                          {role.level}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 mb-1">{role.role}</h4>
                      <p className="text-xs text-slate-400">{role.access}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 7.4 ─── */}
          <TabsContent value="audit">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                7.4 Audit Logs et Prevention
              </h3>
              <p className="text-slate-400 text-sm">
                Tracabilite complete et protection proactive contre les menaces
              </p>
            </div>
            <div className="space-y-3">
              {auditFeatures.map((feat, i) => (
                <motion.div
                  key={feat.name}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                        {feat.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-200 mb-1">{feat.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 7.5 ─── */}
          <TabsContent value="sauvegardes">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                7.5 Sauvegardes et Reprise
              </h3>
              <p className="text-slate-400 text-sm">
                Architecture de sauvegarde avec objectif de reprise RPO 1h / RTO 4h
              </p>
            </div>

            {/* Backup Architecture Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3-2-1 Rule */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base text-slate-200">Regle 3-2-1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {backupRules.map((rule) => (
                      <div key={rule.copies} className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                          <span className="text-2xl font-bold text-cyan-400">
                            {rule.copies.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{rule.copies}</p>
                      </div>
                    ))}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-teal-400">2</span>
                      </div>
                      <p className="text-xs text-slate-300">{backupRules[0].media}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-emerald-400">1</span>
                      </div>
                      <p className="text-xs text-slate-300">{backupRules[0].offsite}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center">{backupRules[0].desc}</p>
                </CardContent>
              </Card>

              {/* Recovery Objectives */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base text-slate-200">Objectifs de Reprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Server className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">RPO — 1 heure</p>
                      <p className="text-xs text-slate-400">Recovery Point Objective : donnees perdues max 1h</p>
                    </div>
                  </div>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                      <RotateCcw className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">RTO — 4 heures</p>
                      <p className="text-xs text-slate-400">Recovery Time Objective : service restaure en 4h max</p>
                    </div>
                  </div>
                  <Separator className="bg-slate-800" />
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <GlobeLock className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Replication Cross-Region</p>
                      <p className="text-xs text-slate-400">Replication automatique multi-region pour resilience geographique</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Backup Flow */}
            <Card className="bg-slate-900 border-slate-800 mt-6">
              <CardContent className="p-6">
                <h4 className="text-sm font-semibold text-slate-200 mb-4">Architecture de Sauvegarde</h4>
                <div className="flex flex-col md:flex-row items-stretch gap-3">
                  {[
                    { icon: <Database className="h-5 w-5" />, label: 'Base de donnees primaire', sub: 'PostgreSQL RDS' },
                    { icon: <Server className="h-5 w-5" />, label: 'Replication synchrone', sub: 'Read Replica AZ-1' },
                    { icon: <HardDrive className="h-5 w-5" />, label: 'Snapshot quotidien', sub: 'S3 Cross-Region' },
                    { icon: <CloudOff className="h-5 w-5" />, label: 'Archive longue duree', sub: 'S3 Glacier Deep' },
                  ].map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-3 flex-1 border border-slate-700">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                          {step.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{step.label}</p>
                          <p className="text-xs text-slate-500">{step.sub}</p>
                        </div>
                      </div>
                      {idx < 3 && (
                        <div className="hidden md:flex items-center text-slate-600 shrink-0">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
