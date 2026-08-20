'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function AdminEbooksPage() {
  const [form, setForm] = useState({ slug: '', title: '', author: '', description: '', price: '', currency: 'XOF', coverUrl: '', chariowCheckoutUrl: '', maketouCheckoutUrl: '', checkoutUrl: '' });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      if (!file) throw new Error('Sélectionnez le fichier PDF ou EPUB.');
      const created = await fetch('/api/admin/ebooks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), isPublished: false }),
      });
      const createdData = await created.json();
      if (!created.ok) throw new Error(createdData.error ?? 'Création impossible');

      const pathname = `ebooks/${createdData.id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await upload(pathname, file, {
        access: 'private',
        handleUploadUrl: '/api/admin/ebooks/upload',
        clientPayload: JSON.stringify({ ebookId: createdData.id, mimeType: file.type, sizeBytes: file.size, filename: file.name }),
      });
      setMessage(`eBook créé et fichier privé envoyé. ID : ${createdData.id}. Il reste à publier après contrôle.`);
      setForm({ slug: '', title: '', author: '', description: '', price: '', currency: 'XOF', coverUrl: '', chariowCheckoutUrl: '', maketouCheckoutUrl: '', checkoutUrl: '' });
      setFile(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur lors de la publication');
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-primary">ADSO · Administration</p>
        <h1 className="mt-2 text-3xl font-bold">Publier un eBook</h1>
        <p className="mt-2 text-muted-foreground">Les fichiers sont envoyés vers un stockage privé, jamais dans le dépôt GitHub.</p>
        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Titre" className="rounded-xl border bg-background px-4 py-3" />
            <input required value={form.author} onChange={e => update('author', e.target.value)} placeholder="Auteur" className="rounded-xl border bg-background px-4 py-3" />
            <input required value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="slug-exemple" className="rounded-xl border bg-background px-4 py-3" />
            <input required type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} placeholder="Prix" className="rounded-xl border bg-background px-4 py-3" />
            <input required maxLength={3} value={form.currency} onChange={e => update('currency', e.target.value.toUpperCase())} placeholder="XOF" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.coverUrl} onChange={e => update('coverUrl', e.target.value)} placeholder="URL couverture" className="rounded-xl border bg-background px-4 py-3" />
          </div>
          <textarea required value={form.description} onChange={e => update('description', e.target.value)} placeholder="Description commerciale" rows={6} className="w-full rounded-xl border bg-background px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-3">
            <input value={form.chariowCheckoutUrl} onChange={e => update('chariowCheckoutUrl', e.target.value)} placeholder="Lien Chariow" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.maketouCheckoutUrl} onChange={e => update('maketouCheckoutUrl', e.target.value)} placeholder="Lien Maketou" className="rounded-xl border bg-background px-4 py-3" />
            <input value={form.checkoutUrl} onChange={e => update('checkoutUrl', e.target.value)} placeholder="Autre checkout" className="rounded-xl border bg-background px-4 py-3" />
          </div>
          <input required type="file" accept="application/pdf,application/epub+zip,.pdf,.epub" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border p-3" />
          <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Envoi sécurisé…' : 'Créer et envoyer l’eBook'}</button>
          {message && <p role="status" className="rounded-xl border p-4 text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
