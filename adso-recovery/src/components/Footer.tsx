'use client'

import { motion } from 'framer-motion'
import { Twitter, Linkedin, Github, ChevronDown } from 'lucide-react'
import { useLocaleStore } from '@/stores/locale-store'

const platformLinks = [
  { label: 'Cours', href: '#courses' },
  { label: 'Examens', href: '#examens' },
  { label: 'AI Coach', href: '#ai-coach' },
  { label: 'Certification', href: '#certification' },
  { label: 'Moniteurs', href: '#moniteurs' },
]

const companyLinks = [
  { label: 'À propos', href: '#about' },
  { label: 'Carrières', href: '#careers' },
  { label: 'Blog', href: '#blog' },
  { label: 'Presse', href: '#press' },
  { label: 'Contact', href: '#contact' },
]

const legalLinks = [
  { label: 'CGU', href: '#cgu' },
  { label: 'Confidentialité', href: '#privacy' },
  { label: 'RGPD', href: '#rgpd' },
  { label: 'Cookies', href: '#cookies' },
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
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* ADSO Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-2xl font-bold mb-3">
              <span className="text-emerald-400">AD</span>SO
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Auto Drive School Online — La plateforme d&rsquo;éducation automobile nouvelle génération,
              propulsée par l&rsquo;intelligence artificielle.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Plateforme Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Entreprise
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Légal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2025 ADSO — Auto Drive School Online. Tous droits réservés.
          </p>
          <div className="relative">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-sm text-slate-300 rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              aria-label="Sélectionner la langue"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
