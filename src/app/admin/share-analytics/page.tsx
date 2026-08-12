'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BarChart3, Globe2, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Analytics = {
  periods: { daily: number; monthly: number; annual: number; total: number }
  byPlatform: Record<string, number>
  byCountry: Record<string, number>
  byPlatformAndCountry: Array<{ platform: string; country: string | null; total: number }>
}

const platformLabels: Record<string, string> = {
  facebook: 'Facebook', linkedin: 'LinkedIn', x: 'X', whatsapp: 'WhatsApp', copy: 'Copie du lien', native: 'Partage natif',
}

export default function ShareAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/analytics/shares', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Accès refusé')
        setData(payload)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Impossible de charger les statistiques'))
  }, [])

  const platforms = useMemo(() => Object.entries(data?.byPlatform || {}).sort((a, b) => b[1] - a[1]), [data])
  const countries = useMemo(() => Object.entries(data?.byCountry || {}).sort((a, b) => b[1] - a[1]), [data])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Button variant="ghost" className="mb-5 text-slate-300 hover:bg-slate-900 hover:text-white" onClick={() => router.push('/')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour à ADSO</Button>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">ADSO Owner Cockpit</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Partages & rayonnement</h1><p className="mt-2 text-slate-400">Suivi des partages journaliers, mensuels, annuels et cumulés, avec ventilation par plateforme et pays.</p></div>
          <div className="flex items-center gap-2 text-sm text-slate-500"><Share2 className="h-4 w-4" /> Données ADSO</div>
        </div>

        {error ? <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-red-200">{error}</div> : !data ? <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Chargement des statistiques…</div> : <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([['Aujourd’hui', data.periods.daily], ['Ce mois', data.periods.monthly], ['Cette année', data.periods.annual], ['Total', data.periods.total]] as const).map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-white">{value.toLocaleString('fr-FR')}</p><p className="mt-1 text-xs text-emerald-400">partages enregistrés</p></div>)}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-400" /><h2 className="font-semibold">Par plateforme</h2></div><div className="mt-5 space-y-3">{platforms.length ? platforms.map(([platform, count]) => <div key={platform} className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3"><span className="text-sm text-slate-300">{platformLabels[platform] || platform}</span><strong>{count.toLocaleString('fr-FR')}</strong></div>) : <p className="text-sm text-slate-500">Aucun partage enregistré pour le moment.</p>}</div></section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-2"><Globe2 className="h-5 w-5 text-emerald-400" /><h2 className="font-semibold">Par pays</h2></div><p className="mt-1 text-xs text-slate-500">Le pays est renseigné uniquement lorsqu’une donnée géographique fiable est disponible.</p><div className="mt-5 space-y-3">{countries.length ? countries.map(([country, count]) => <div key={country} className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3"><span className="text-sm text-slate-300">{country}</span><strong>{count.toLocaleString('fr-FR')}</strong></div>) : <p className="text-sm text-slate-500">Aucune donnée pays disponible pour le moment.</p>}</div></section>
          </div>
        </>}
      </div>
    </main>
  )
}
