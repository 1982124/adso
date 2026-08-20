'use client';
import { useState } from 'react';

export default function EbookCoauthorsAdminPage() {
  const [ebookId, setEbookId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [coauthors, setCoauthors] = useState<any[]>([]);

  async function load() {
    if (!ebookId) return;
    const r = await fetch(`/api/admin/ebooks/coauthors?ebookId=${encodeURIComponent(ebookId)}`);
    const d = await r.json(); setCoauthors(d.coauthors || []); if (!r.ok) setMessage(d.error || 'Impossible de charger');
  }
  async function add() {
    setBusy(true); setMessage('');
    try {
      const r = await fetch('/api/admin/ebooks/coauthors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ebookId, displayName: name, email: email || null }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Ajout impossible');
      setMessage(`Coauteur ajouté (${d.status}). Accès financier : interdit.`); setName(''); setEmail(''); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Erreur'); } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-3xl space-y-6">
    <div><p className="text-sm text-primary">ADSO · Administration · Auteurs</p><h1 className="text-3xl font-bold">Coauteurs eBook</h1><p className="mt-2 text-muted-foreground">Ajoutez jusqu’à 2 coauteurs par livre. Ils voient les ventes de leurs livres, jamais les fonds ni les retraits.</p></div>
    <section className="space-y-4 rounded-2xl border p-6"><input value={ebookId} onChange={e=>setEbookId(e.target.value)} placeholder="ID de l’eBook" className="w-full rounded-xl border bg-background px-4 py-3" /><button onClick={load} className="rounded-xl border px-4 py-2">Charger</button><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du coauteur" className="w-full rounded-xl border bg-background px-4 py-3" /><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email du compte ADSO (recommandé)" className="w-full rounded-xl border bg-background px-4 py-3" /><button disabled={busy || !ebookId || !name} onClick={add} className="rounded-xl bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50">{busy ? 'Ajout…' : 'Ajouter le coauteur'}</button>{message && <p className="rounded-xl border p-4 text-sm">{message}</p>}</section>
    <section className="rounded-2xl border p-6"><h2 className="font-semibold">Coauteurs associés</h2><div className="mt-4 space-y-3">{coauthors.map(c=><div key={c.id} className="rounded-xl border p-4"><strong>{c.displayName}</strong><div className="text-sm text-muted-foreground">{c.email || 'Email non renseigné'} · {c.status}</div><div className="mt-1 text-xs">Ventes: {c.canViewSales ? 'oui' : 'non'} · Fonds/retraits: <b>non</b></div></div>)}</div></section>
  </div></main>;
}
