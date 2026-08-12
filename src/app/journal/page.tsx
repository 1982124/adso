'use client'

import { ArrowLeft, BookOpen, Car, CheckCircle2, ClipboardList, GraduationCap, ShieldCheck, Store, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const entries = [
  { icon: GraduationCap, title: 'Formation', action: 'Apprendre et reprendre un cours', detail: 'Ouvrez Formation pour explorer les pays, les permis, les cours, la signalisation, les examens et votre progression.' },
  { icon: Car, title: 'Conduite IA', action: 'S’entraîner avec l’IA', detail: 'Utilisez l’Instructeur IA pour préparer une séance, puis consultez les retours avant de passer à une situation plus complexe.' },
  { icon: ShieldCheck, title: 'Assurance IA', action: 'Comparer et gérer vos assurances', detail: 'Consultez les polices, sinistres, risques et recommandations. Les fonctions réglementées doivent rester soumises aux conditions de l’assureur et du pays.' },
  { icon: Truck, title: 'Flotte', action: 'Enregistrer et suivre les véhicules', detail: 'Créez une flotte, ajoutez les véhicules et suivez kilométrage, maintenance, carburant et échéances.' },
  { icon: Store, title: 'Marketplace', action: 'Trouver ou publier une offre', detail: 'Cherchez un garage, une assurance, une pièce ou un service. Les partenaires connectés peuvent publier une annonce depuis Publier une annonce.' },
  { icon: ClipboardList, title: 'Journée utilisateur', action: 'Comprendre avant d’agir', detail: 'Ce journal explique l’objectif de chaque grande fonction et doit évoluer avec chaque version ADSO.' },
]

export default function UserJournalPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-5"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à ADSO</Button>
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-10">
          <div className="flex items-start gap-4"><div className="rounded-2xl bg-emerald-500/15 p-3"><BookOpen className="h-7 w-7 text-emerald-400" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">ADSO · Journal utilisateur</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Comprendre avant d’agir.</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Le journal explique ce que fait chaque fonction, pourquoi elle existe et quelle est la prochaine action attendue. Aucun écran important ne doit demander à l’utilisateur de deviner.</p></div></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {entries.map(({ icon: Icon, title, action, detail }) => <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><Icon className="h-5 w-5 text-emerald-400" /><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-1 text-sm font-medium text-emerald-300">{action}</p><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Usage documenté</div></article>)}
          </div>
        </div>
      </div>
    </main>
  )
}
