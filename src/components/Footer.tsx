'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useLocaleStore } from '@/stores/locale-store'

const platformLinks = [
  { label: 'Cours publics', href: '/education' },
  { label: 'ADSO Immersif', href: '/formation/immersive' },
  { label: 'Mon parcours', href: '/student' },
  { label: 'E-books', href: '/ebooks' },
  { label: 'Afrique', href: '/afrique' },
]

const organisationLinks = [
  { label: 'Établissements', href: '/institutions' },
  { label: 'Communauté', href: '/communaute' },
  { label: 'Tarifs', href: '/offres' },
  { label: 'Sécurité', href: '/securite' },
  { label: 'Créer un compte', href: '/inscription' },
]

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Footer() {
  const { locale, setLocale } = useLocaleStore()

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div>
            <div className="mb-3 text-2xl font-bold"><span className="text-emerald-400">AD</span>SO</div>
            <p className="mb-2 text-sm font-semibold text-emerald-300">Éducation · prévention · mobilité sûre</p>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Une plateforme numérique pour apprendre, simuler, évaluer et reconnaître les compétences de mobilité sûre. ADSO complète les dispositifs éducatifs et les autorités publiques ; il ne délivre aucun permis officiel.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Plateforme</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-emerald-400">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">ADSO</h4>
            <ul className="space-y-2.5">
              {organisationLinks.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-emerald-400">{link.label}</Link></li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 ADSO — LÉGENDE VISION · Neo Digital Startup Academy. Tous droits réservés.</p>
          <div className="relative">
            <select value={locale} onChange={(e) => setLocale(e.target.value)} className="cursor-pointer appearance-none rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 pr-8 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" aria-label="Sélectionner la langue">
              {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
