'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

type FormState = { slug: string; title: string; author: string; description: string; price: string; currency: string; coverUrl: string; chariowCheckoutUrl: string; maketouCheckoutUrl: string; checkoutUrl: string };
const empty: FormState = { slug: '', title: '', author: '', description: '', price: '', currency: 'XOF', coverUrl: '', chariowCheckoutUrl: '', maketouCheckoutUrl: '', checkoutUrl: '' };

export default function AdminEbooksPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  const update = (key: keyof FormState, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const analyze = async (): Promise<FormState> => {
    if (!file) throw new Error('Déposez d’abord le PDF ou EPUB.');
    const fd = new FormData(); fd.append('file', file);
    const response = await fetch('/api/admin/ebooks/ai-finalize', { method: 'POST', body: fd });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Analyse IA impossible');
    const m = data.metadata || {};
    const next = { ...form,
      title: String(m.title || form.title), author: String(m.author || form.author), description: String(m.description || form.description),
      slug: String(m.slug || form.slug), price: m.suggestedPriceXof != null ? String(m.suggestedPriceXof) : form.price,
    };
    setForm(next); setAiReady(true); return next;
  };

  const runAnalyze = async () => {
    setBusy(true); setMessage('ADSO AI analyse le livre et prépare sa fiche commerciale…');
    try { await analyze(); setMessage('ADSO AI a préparé la fiche. Ajoutez le lien de paiement, puis finalisez la publication.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Analyse IA impossible'); }
    finally { setBusy(false); }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      if (!file) throw new Error('Sélectionnez le PDF ou EPUB.');
      const nextForm = aiReady ? form : await analyze();
      const created = await fetch('/api/admin/ebooks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...nextForm, price: Number(nextForm.price), isPublished: false }) });
      const createdData = await created.json();
      if (!created.ok) throw new Error(createdData.error ?? 'Création impossible');
      const pathname = `ebooks/${createdData.id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await upload(pathname, file, { access: 'private', handleUploadUrl: '/api/admin/ebooks/upload', clientPayload: JSON.stringify({ ebookId: createdData.id, mimeType: file.type, sizeBytes: file.size, filename: file.name }) });
      const publish = await fetch('/api/admin/ebooks/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ebookId: createdData.id }) });
      const publishData = await publish.json();
      if (!publish.ok) throw new Error(`eBook enregistré mais non publié : ${publishData.error || 'contrôle requis'}`);
      setMessage(`✅ ${publishData.title} est publié. Fichier sécurisé, fiche commerciale créée et paiement configuré.`);
      setForm(empty); setFile(null); setAiReady(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Erreur lors de la publication'); }
    finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-primary">ADSO · Administration · AI Publishing</p>
        <h1 className="mt-2 text-3xl font-bold">Publier un eBook avec ADSO AI</h1>
        <p className="mt-2 text-muted-foreground">Déposez simplement le PDF/EPUB. ADSO AI prépare les métadonnées commerciales ; le fichier reste privé. La publication exige un moyen de paiement configuré.</p>
        <div className="mt-6 rounded-2xl border p-5">
          <label className="text-sm font-medium">1. Déposer le livre</label>
          <input type="file" accept="application/pdf,application/epub+zip,.pdf,.epub" onChange={e => { setFile(e.target.files?.[0] ?? null); setAiReady(false); }} className="mt-3 w-full rounded-xl border p-3" />
          <button type="button" disabled={!file || busy} onClick={runAnalyze} className="mt-3 rounded-xl border px-5 py-3 font-medium disabled:opacity-50">{busy ? 'ADSO AI travaille…' : '✨ Analyser avec ADSO AI'}</button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border p-6">
          <p className="text-sm font-medium">2. Fiche commerciale générée par l’IA — modifiable avant publication</p>
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Titre" className="rounded-xl border bg-background px-4 py-3" />
            <input required value={form.author} onChange={e => update('author', e.target.value)} placeholder="Auteur" className="rounded-xl border bg-background px-4 py-3" />
            <input required value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="slug-exemple" className="rounded-xl border bg-background px-4 py-3" />
            <input required type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} placeholder="Prix" className="rounded-xl border bg-background px-4 py-3" />
            <input required maxLength={3} value={form.currency} onChange={e => update('currency', e.target.value.toUpperCase())} placeholder="XOF" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.coverUrl} onChange={e => update('coverUrl', e.target.value)} placeholder="URL couverture (optionnelle)" className="rounded-xl border bg-background px-4 py-3" />
          </div>
          <textarea required value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description commerciale" rows={7} className="w-full rounded-xl border bg-background px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-3">
            <input value={form.chariowCheckoutUrl} onChange={e => update('chariowCheckoutUrl', e.target.value)} placeholder="Lien Chariow" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.maketouCheckoutUrl} onChange={e => update('maketouCheckoutUrl', e.target.value)} placeholder="Lien Maketou" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.checkoutUrl} onChange={e => update('checkoutUrl', e.target.value)} placeholder="Autre checkout" className="rounded-xl border bg-background px-4 py-3" />
          </div>
          <button disabled={busy || !file} className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Publication sécurisée…' : '🚀 Finaliser et publier'}</button>
          {message && <p role="status" className="rounded-xl border p-4 text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
