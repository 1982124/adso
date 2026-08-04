'use client'

import { motion } from 'framer-motion'
import { Lock, ShieldCheck, FileText, DatabaseBackup, Globe, Languages, CreditCard, Scale } from 'lucide-react'

const securityFeatures = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Chiffrement AES-256 + TLS 1.3',
    description: 'Données au repos et en transit protégées par un chiffrement de niveau militaire.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'MFA obligatoire + RBAC',
    description: "Authentification multi-facteurs et contrôle d'accès basé sur les rôles pour chaque utilisateur.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Audit logs immuables + RGPD',
    description: "Traçabilité complète de chaque action et conformité totale avec le règlement européen.",
  },
  {
    icon: <DatabaseBackup className="h-6 w-6" />,
    title: 'Sauvegardes 3-2-1 + PRA',
    description: "Stratégie de sauvegarde redondante et plan de reprise après incident testé régulièrement.",
  },
]

const internationalFeatures = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Country Packs réglementaires',
    description: "Contenu réglementaire adapté à chaque pays : code de la route, règles spécifiques, panneaux locaux.",
  },
  {
    icon: <Languages className="h-6 w-6" />,
    title: 'Support RTL',
    description: "Interface complète en arabe, hébreu et toutes les langues à écriture droite-à-gauche.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Paiements locaux',
    description: "Apple Pay, Orange Money, M-Pesa, WeChat Pay et plus de 50 méthodes de paiement locales.",
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: 'Parité de pouvoir d\'achat',
    description: "Tarification adaptée au niveau de vie local pour un accès équitable dans chaque marché.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.4, ease: 'easeOut' as const },
  }),
}

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Security subsection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sécurité entreprise de niveau bancaire
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              La protection de vos données et de celles de vos élèves est notre priorité absolue
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {securityFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-slate-700/50 mb-16" />

        {/* International subsection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Une plateforme véritablement mondiale
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Conçue dès le départ pour servir chaque marché, chaque langue, chaque devise
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mb-12">
            {[
              { value: '120+', label: 'Pays cibles' },
              { value: '50+', label: 'Langues' },
              { value: '135+', label: 'Devises' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statsVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* International features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {internationalFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
