'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Building2, Bike } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { COMMERCIAL_OFFERS, formatXof, type BillingPeriod } from '@/lib/commercial-offers'

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <section id="pricing" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">ADSO · Tarifs</p>
          <h2 className="mb-4 mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Des offres simples et transparentes</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">Les tarifs africains validés sont affichés directement en francs CFA. Les eBooks sont vendus séparément dans la Bibliothèque.</p>
        </motion.div>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Période de facturation">
            <button type="button" onClick={() => setBillingPeriod('monthly')} className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Mensuel</button>
            <button type="button" onClick={() => setBillingPeriod('yearly')} className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${billingPeriod === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Annuel</button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMMERCIAL_OFFERS.map((offer, index) => {
            const price = billingPeriod === 'monthly' ? offer.monthly : offer.yearly
            const isCustom = price === null
            const isDriver = offer.id === 'driver'
            const isInstitution = offer.id.startsWith('institution-')

            return (
              <motion.div key={offer.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.06, duration: 0.4 }}>
                <Card className={`flex h-full flex-col ${isDriver ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-200'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-emerald-600">{isDriver ? <Bike className="h-5 w-5" /> : isInstitution ? <Building2 className="h-5 w-5" /> : <Crown className="h-5 w-5" />}</span>
                      {isDriver && <Badge className="bg-emerald-600 text-white">Accessible</Badge>}
                    </div>
                    <CardTitle className="mt-2 text-xl">{offer.name}</CardTitle>
                    <p className="text-sm text-slate-500">{offer.audience}</p>
                    <div className="pt-3">
                      {isCustom ? <span className="text-3xl font-bold text-slate-900">Sur devis</span> : <><span className="text-3xl font-bold text-slate-900">{formatXof(price)}</span><span className="ml-1 text-sm text-slate-500">/ {billingPeriod === 'monthly' ? 'mois' : 'an'}</span></>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {offer.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>{feature}</span></li>)}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant={isDriver ? 'default' : 'outline'}>
                      <Link href={isCustom ? '/institutions' : `/offres?offer=${encodeURIComponent(offer.id)}&period=${billingPeriod}`}>
                        {isCustom ? 'Demander un devis' : 'Choisir cette offre'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-slate-400">Les prix affichés sont la source commerciale de référence pour le lancement africain d’ADSO. La disponibilité des moyens de paiement dépend du pays et de la configuration réelle des prestataires.</p>
      </div>
    </section>
  )
}
