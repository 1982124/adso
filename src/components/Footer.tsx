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

const promotionMessage = 'Je suis utilisateur de ADSO — apprendre autrement la conduite, conduire avec responsabilité, car chaque vie compte. 🚗❤️ Cliquez ici 👉'

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Footer() {
  const { locale, setLocale } = useLocaleStore()

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.origin)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer')
  }

  const copyPromotionMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${promotionMessage} ${window.location.origin}`)
    } catch {
      // Clipboard access can be unavailable in restricted browsers; sharing remains available.
    }
  }

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
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-2xl font-bold mb-3"><span className="text-emerald-400">AD</span>SO</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Auto Drive School Online — La plateforme d&rsquo;éducation automobile nouvelle génération,
              propulsée par l&rsquo;intelligence artificielle.
            </p>
            <div className="flex items-center gap-3" aria-label="Réseaux sociaux ADSO">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
              <button type="button" onClick={shareOnFacebook} aria-label="Partager ADSO sur Facebook" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors font-bold">f</button>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Plateforme</h4>
            <ul className="space-y-2.5">{platformLinks.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link.label}</a></li>)}</ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Entreprise</h4>
            <ul className="space-y-2.5">{companyLinks.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link.label}</a></li>)}</ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Légal</h4>
            <ul className="space-y-2.5">{legalLinks.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link.label}</a></li>)}</ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-semibold text-white">Faites connaître ADSO</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">Je suis utilisateur de ADSO — apprendre autrement la conduite, conduire avec responsabilité, car chaque vie compte.</p>
          </div>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button type="button" onClick={copyPromotionMessage} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">Copier le message</button>
            <button type="button" onClick={shareOnFacebook} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Partager sur Facebook</button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 ADSO — Auto Drive School Online. Tous droits réservés.</p>
          <div className="relative">
            <select value={locale} onChange={(e) => setLocale(e.target.value)} className="appearance-none bg-slate-900 border border-slate-700 text-sm text-slate-300 rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer" aria-label="Sélectionner la langue">
              {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
