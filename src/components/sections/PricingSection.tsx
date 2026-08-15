'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useDrivingStore } from '@/stores/driving-store'
import { formatPrice, getPricingForCountry } from '@/lib/pricing-engine'

interface Feature { name: string; included: boolean }
interface Plan {
  id: 'free' | 'starter' | 'pro' | 'premium'
  name: string
  price: string
  period: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  features: Feature[]
  cta: string
  highlighted?: boolean
}

const b2cPlans: Plan[] = [
  {
    id: 'free', name: 'Gratuit', price: '0€', period: '/mois',
    features: [
      { name: '20% des cours théoriques', included: true }, { name: '5 quiz par mois', included: true },
      { name: '1 examen blanc', included: true }, { name: 'Support email', included: true },
      { name: 'AI Coach', included: false }, { name: 'Simulations', included: false }, { name: 'Certificats', included: false },
    ], cta: 'Commencer',
  },
  {
    id: 'starter', name: 'Low Pay', price: '9.99€', period: '/mois', badge: 'Accessible', badgeVariant: 'default',
    features: [
      { name: '100% cours théoriques', included: true }, { name: 'Quiz illimités', included: true },
      { name: 'Examens adaptatifs', included: true }, { name: 'Progression sauvegardée', included: true },
      { name: 'AI Coach', included: false }, { name: 'Simulations', included: false }, { name: 'Certificats', included: false },
    ], cta: 'Commencer',
  },
  {
    id: 'pro', name: 'Pro', price: '19.99€', period: '/mois', badge: 'Populaire', badgeVariant: 'default',
    features: [
      { name: '100% cours théoriques', included: true }, { name: 'Quiz illimités', included: true },
      { name: 'Examens adaptatifs', included: true }, { name: 'Progression sauvegardée', included: true },
      { name: 'AI Coach personnalisé', included: true }, { name: 'Simulations de conduite', included: true }, { name: 'Certificats de réussite', included: true },
    ], cta: 'Commencer', highlighted: true,
  },
  {
    id: 'premium', name: 'Premium', price: '39.99€', period: '/mois', badge: 'Excellence', badgeVariant: 'secondary',
    features: [
      { name: 'Tout du plan Pro', included: true }, { name: 'Cours pratiques guidés', included: true },
      { name: 'Moniteur dédié', included: true }, { name: 'Certification blockchain', included: true },
      { name: 'Support prioritaire 24/7', included: true }, { name: 'Accès anticipé nouvelles fonctionnalités', included: true }, { name: 'Parcours personnalisé IA', included: true },
    ], cta: 'Commencer',
  },
]

const b2bPlans: Plan[] = [
  { id: 'starter', name: 'Starter', price: '299€', period: '/mois', features: [
    { name: '<50 élèves', included: true }, { name: 'CRM basique', included: true }, { name: 'Facturation intégrée', included: true },
    { name: 'Statistiques standard', included: true }, { name: 'Marketing avancé', included: false }, { name: 'IA Assistant', included: false }, { name: 'API & Intégrations', included: false },
  ], cta: 'Commencer' },
  { id: 'pro', name: 'Professionnel', price: '699€', period: '/mois', badge: 'Populaire', badgeVariant: 'default', features: [
    { name: '<200 élèves', included: true }, { name: 'CRM avancé', included: true }, { name: 'Marketing intégré', included: true },
    { name: 'IA Assistant', included: true }, { name: 'API & Intégrations', included: true }, { name: 'SLA garanti', included: false }, { name: 'Support dédié', included: false },
  ], cta: 'Commencer', highlighted: true },
  { id: 'premium', name: 'Enterprise', price: 'Sur devis', period: '', badge: 'Sur mesure', badgeVariant: 'secondary', features: [
    { name: 'Élèves illimités', included: true }, { name: 'Tout inclus Professionnel', included: true }, { name: 'SLA garanti 99.9%', included: true },
    { name: 'Support dédié 24/7', included: true }, { name: 'Custom & white-label', included: true }, { name: 'Formation équipe', included: true }, { name: 'Audit de conformité', included: true },
  ], cta: "Contacter l'équipe" },
]

const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const } }) }

function PlanCard({ plan, index, countryCode, localized }: { plan: Plan; index: number; countryCode: string; localized: boolean }) {
  const iconMap: Record<string, React.ReactNode> = {
    Gratuit: <Zap className="h-5 w-5" />, LowPay: <Zap className="h-5 w-5" />, Starter: <Zap className="h-5 w-5" />,
    Pro: <Sparkles className="h-5 w-5" />, Premium: <Crown className="h-5 w-5" />, Professionnel: <Sparkles className="h-5 w-5" />, Enterprise: <Crown className="h-5 w-5" />,
  }
  const localizedResult = localized && plan.id !== 'free' && plan.id !== 'premium' ? getPricingForCountry(countryCode, plan.id) : null
  const displayPrice = localizedResult ? formatPrice(localizedResult.price, localizedResult.currency, 'fr-FR') : plan.price
  const original = localizedResult ? formatPrice(localizedResult.originalPrice, 'EUR', 'fr-FR') : null

  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className={plan.highlighted ? 'md:-mt-4 md:mb-[-1rem]' : ''}>
      <Card className={plan.highlighted ? 'relative border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 md:scale-105' : 'border border-slate-200'}>
        {plan.badge && plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs">✨ Le plus populaire</Badge></div>}
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={plan.highlighted ? 'text-emerald-600' : 'text-slate-500'}>{iconMap[plan.name.replace(/\s+/g, '')] || iconMap[plan.name] || <Zap className="h-5 w-5" />}</span>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            {plan.badge && !plan.highlighted && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">{plan.badge}</Badge>}
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-slate-900">{displayPrice}</span>
            {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
          </div>
          {localizedResult && localizedResult.discount > 0 && <p className="mt-1 text-xs font-medium text-emerald-600">Tarif localisé — jusqu'à {localizedResult.discount}% de réduction</p>}
          {original && localizedResult && localizedResult.price < localizedResult.originalPrice && <p className="text-xs text-slate-400 line-through">Tarif de référence : {original}</p>}
        </CardHeader>
        <CardContent className="flex-1"><ul className="space-y-3">{plan.features.map((feature) => <li key={feature.name} className="flex items-start gap-2.5">{feature.included ? <Check className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" /> : <X className="h-4 w-4 mt-0.5 text-slate-300 shrink-0" />}<span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>{feature.name}</span></li>)}</ul></CardContent>
        <CardFooter><Button className={plan.highlighted ? 'w-full bg-emerald-600 hover:bg-emerald-700 text-white' : 'w-full'} variant={plan.highlighted ? 'default' : 'outline'}>{plan.cta}</Button></CardFooter>
      </Card>
    </motion.div>
  )
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<'b2c' | 'b2b'>('b2c')
  const selectedCountry = useDrivingStore((state) => state.selectedCountry)
  const plans = activeTab === 'b2c' ? b2cPlans : b2bPlans

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choisissez votre plan</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Des offres adaptées à chaque profil, avec une tarification localisée selon le pays choisi.</p>
          <p className="mt-2 text-sm font-medium text-emerald-700">Offre Low Pay disponible : le prix est calculé selon le pays sélectionné dans ADSO.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
            <button onClick={() => setActiveTab('b2c')} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'b2c' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Particuliers (B2C)</button>
            <button onClick={() => setActiveTab('b2b')} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'b2b' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Entreprises (B2B)</button>
          </div>
        </motion.div>
        <div className={`grid gap-6 ${plans.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          {plans.map((plan, i) => <PlanCard key={`${activeTab}-${plan.name}`} plan={plan} index={i} countryCode={selectedCountry} localized={activeTab === 'b2c'} />)}
        </div>
      </div>
    </section>
  )
}
