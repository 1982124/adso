'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImagePlus, Megaphone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const categories = [
  ['garage', 'Garage'], ['mechanic', 'Mécanicien'], ['parts', 'Pièces détachées'], ['accessories', 'Accessoires'],
  ['towing', 'Dépannage'], ['inspection', 'Contrôle technique'], ['insurance', 'Assurance'], ['driving_school', 'Auto-école'],
  ['rental', 'Location'], ['vehicle_sales', 'Vente de véhicules'],
]

export default function MarketplacePublishPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ title: '', description: '', category: 'garage', price: '', priceUnit: 'fixed', location: '', city: 'Bamako', country: 'ML', contactPhone: '', contactEmail: '', contactWebsite: '', imageUrl: '' })

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images: form.imageUrl ? [form.imageUrl] : [] }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Publication impossible')
      setMessage('Annonce publiée. Elle est maintenant visible dans la Marketplace.')
      setTimeout(() => router.push('/'), 900)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Publication impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" className="mb-5 text-slate-300 hover:bg-slate-900 hover:text-white" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à ADSO
        </Button>
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white"><Megaphone className="h-5 w-5 text-emerald-400" /> Publier une annonce ADSO</CardTitle>
            <CardDescription className="text-slate-400">Un espace simple pour les garages, assureurs, écoles et partenaires. La publication nécessite une connexion.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label>Titre</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex. Assurance auto — offre rentrée" className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Expliquez clairement l'offre, les conditions et ce que l'utilisateur obtient." className="min-h-28 border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Select value={form.category} onValueChange={category => setForm({ ...form, category })}><SelectTrigger className="border-slate-700 bg-slate-950 text-white"><SelectValue /></SelectTrigger><SelectContent>{categories.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Prix</Label><Input inputMode="decimal" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Laisser vide si sur devis" className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2"><Label>Lieu</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Quartier / adresse" className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2"><Label>Ville</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Image ou affiche (URL)</Label><div className="flex gap-2"><ImagePlus className="mt-2 h-5 w-5 shrink-0 text-slate-500" /><Input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://.../votre-affiche.jpg" className="border-slate-700 bg-slate-950 text-white" /></div><p className="text-xs text-slate-500">Pour la démo, l'image est référencée par URL. Le stockage média sécurisé pourra être branché ensuite.</p></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="border-slate-700 bg-slate-950 text-white" /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Site web</Label><Input type="url" value={form.contactWebsite} onChange={e => setForm({ ...form, contactWebsite: e.target.value })} placeholder="https://..." className="border-slate-700 bg-slate-950 text-white" /></div>
              </div>
              {message && <div role="status" className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">{message}</div>}
              <Button disabled={submitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700"><Send className="mr-2 h-4 w-4" />{submitting ? 'Publication...' : 'Publier l’annonce'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
