'use client'

import { motion } from 'framer-motion'
import { Lock, ShieldCheck, FileText, DatabaseBackup, Globe, Languages, CreditCard, Scale } from 'lucide-react'

const securityFeatures = [
  { icon: <Lock className="h-6 w-6" />, title: 'HTTPS et protection des flux', description: "La production ADSO est servie sur HTTPS avec des en-têtes de sécurité côté plateforme. Les mécanismes réellement actifs sont vérifiés dans l'environnement de déploiement." },
  { icon: <ShieldCheck className="h-6 w-6" />, title: 'Accès et rôles', description: "Les accès administratifs sont séparés des parcours publics. Une fonctionnalité de sécurité n'est présentée comme obligatoire que lorsqu'elle est effectivement imposée et vérifiée." },
  { icon: <FileText className="h-6 w-6" />, title: 'Traçabilité', description: "ADSO privilégie des journaux d'activité et des preuves vérifiables. Les garanties d'immutabilité, de conformité ou de rétention légale ne sont annoncées qu'après implémentation et test." },
  { icon: <DatabaseBackup className="h-6 w-6" />, title: 'Sauvegarde et reprise', description: "La stratégie de sauvegarde et de reprise est traitée comme une exigence d'infrastructure. Aucun niveau de PRA ou de sauvegarde n'est présenté comme testé tant qu'une preuve de test n'est pas disponible." },
]

const internationalFeatures = [
  { icon: <Globe className="h-6 w-6" />, title: 'Country Packs', description: "ADSO peut servir des contextes nationaux distincts. Les données réglementaires sont séparées du socle pédagogique commun et doivent être sourcées, datées et versionnées." },
  { icon: <Languages className="h-6 w-6" />, title: 'Langues V1', description: "Les choix d'apprentissage V1 sont Français, English, العربية, Español et Português. La couverture réelle est mesurée par contenu, pas seulement par traduction de l'interface." },
  { icon: <CreditCard className="h-6 w-6" />, title: 'Paiements locaux', description: "Les moyens de paiement sont activés pays par pays. ADSO ne promet pas une méthode de paiement avant que son intégration et son parcours de règlement aient été vérifiés." },
  { icon: <Scale className="h-6 w-6" />, title: 'Gouvernance responsable', description: "ADSO ne se présente pas comme une autorité publique. Les permis, examens et titres officiels restent de la responsabilité des États et organismes habilités." },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function SecuritySection() {
  return (
    <section id="security" className="bg-slate-900 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-16">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-400">ADSO · sécurité & gouvernance</p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Une sécurité démontrable, pas une promesse bancaire.</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">Nous documentons les protections réellement actives et séparons clairement les contrôles en place des objectifs d'infrastructure encore à auditer.</p>
          </div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {securityFeatures.map((feature) => <motion.div key={feature.title} variants={itemVariants} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 transition-colors hover:bg-slate-800"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">{feature.icon}</div><h3 className="mb-2 font-semibold text-white">{feature.title}</h3><p className="text-sm leading-relaxed text-slate-400">{feature.description}</p></motion.div>)}
          </motion.div>
        </motion.div>

        <div className="mb-16 border-t border-slate-700/50" />

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="mb-10 text-center"><h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Une architecture africaine et vérifiable</h2><p className="mx-auto max-w-2xl text-lg text-slate-400">ADSO est conçue pour accueillir plusieurs pays, langues et contextes sans prétendre que toutes les réglementations sont déjà validées.</p></div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {internationalFeatures.map((feature) => <motion.div key={feature.title} variants={itemVariants} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 transition-colors hover:bg-slate-800"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">{feature.icon}</div><h3 className="mb-2 font-semibold text-white">{feature.title}</h3><p className="text-sm leading-relaxed text-slate-400">{feature.description}</p></motion.div>)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
