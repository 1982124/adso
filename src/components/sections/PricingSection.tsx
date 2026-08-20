'use client'

import { motion } from 'framer-motion'
import { Check, Crown, Users, GraduationCap, Car, Building2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscriptionStore } from '@/stores/subscription-store'
import { COMMERCIAL_OFFERS, formatXof, type BillingPeriod } from '@/lib/commercial-offers'

const icons = {
  jeune: GraduationCap,
  communaute: Users,
  pro: Car,
  premium: Crown,
  etablissement: Building2,
} as const

const highlighted = new Set(['communaute', 'pro'])

export default function PricingSection() {
  const billingPeriod = useSubscriptionStore((state) => state.billingPeriod)
  const setBillingPeriod = useSubscriptionStore((state) => state.setBillingPeriod)
  const setPlan = useSubscriptionStore((state) => state.setPlan)

  return (
    <section id="pricing" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Offres ADSO</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Une offre pour chaque façon d’apprendre et d’agir</h2>
          <p className="mt-4 text-lg leading-7 text-slate-500">
            Individuel, collectif, professionnel ou établissement : le même code de la mobilité, adapté au contexte.
          </p>
        </motion.div>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Période de facturation">
            {(['monthly', 'yearly'] as BillingPeriod[]).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${billingPeriod === period ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {period === 'monthly' ? 'Mensuel' : 'Annuel'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {COMMERCIAL_OFFERS.map((offer, index) => {
            const Icon = icons[offer.id]
            const price = billingPeriod === 'yearly' ? offer.yearly : offer.monthly
            const isHighlighted = highlighted.has(offer.id)
            const isCommunity = offer.id === 'communaute'
            const cta = offer.checkoutEnabled ? 'Choisir cette offre' : 'Découvrir l’offre'

            return (
              <motion.div
                key={offer.id}
                custom={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className={`flex h-full flex-col ${isHighlighted ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-200'} ${isCommunity ? 'bg-emerald-50/40' : 'bg-white'}`}>
                  {isHighlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="whitespace-nowrap bg-emerald-600 text-white">{isCommunity ? 'Impact collectif' : 'Populaire'}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-lg bg-slate-100 p-2 text-emerald-700"><Icon className="h-5 w-5" /></span>
                      <CardTitle className="text-lg">{offer.name}</CardTitle>
                    </div>
                    <p className="min-h-12 text-sm leading-5 text-slate-500">{offer.audience}</p>
                    <div className="pt-3">
                      {price !== null ? (
                        <>
                          <span className="text-3xl font-black text-slate-900">{formatXof(price)}</span>
                          <span className="ml-1 text-sm text-slate-500">/{billingPeriod === 'yearly' ? 'an' : 'mois'}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-slate-900">Sur mesure</span>
                      )}
                    </div>
                    {billingPeriod === 'yearly' && offer.monthly !== null && offer.yearly !== null && (
                      <p className="text-xs font-medium text-emerald-700">Économie sur la formule annuelle</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {offer.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      className={`w-full ${isHighlighted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}`}
                      variant={isHighlighted ? 'default' : 'outline'}
                      onClick={() => offer.checkoutEnabled && setPlan(offer.id)}
                    >
                      {cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Prix de lancement en XOF</span>
          <span>•</span>
          <span>Les intégrations de paiement utilisent les identifiants d’offre canoniques.</span>
        </div>
      </div>
    </section>
  )
}
