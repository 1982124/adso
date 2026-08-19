'use client';

import { FormEvent, useEffect, useState } from 'react';

interface Book {
  id: string; slug: string; title: string; author: string; coverUrl: string | null;
  price: number; currency: string; isPublished: boolean; createdAt: string; sales: number; revenue: number;
}

interface Dashboard { books: Book[]; sales: { orders: number; revenue: number } }

export default function AdminEbooksPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/admin/ebooks', { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? 'Chargement impossible');
    setData(payload);
  }

  useEffect(() => { load().catch((e) => setError(e.message)); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const form = new FormData(event.currentTarget);
      form.set('isPublished', 'true');
      const response = await fetch('/api/admin/ebooks', { method: 'POST', body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Publication impossible');
      event.currentTarget.reset();
      setMessage(`Livre publié. URL commerciale : ${window.location.origin}${payload.url}`);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur'); }
    finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-cyan-950/30 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO BOOKS · Publisher</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Publication & ventes eBooks</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Publiez un titre, générez son lien commercial permanent et suivez les ventes depuis un seul cockpit.</p></div>
            <a href="/ebooks" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-semibold hover:bg-white/10">Voir la bibliothèque →</a>
          </div>
        </header>

        {error && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>}
        {message && <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200 break-words">{message}</div>}

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-slate-400">Commandes payées</p><p className="mt-2 text-3xl font-black">{data?.sales.orders ?? '—'}</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-slate-400">Chiffre d'affaires</p><p className="mt-2 text-3xl font-black">{data ? `${data.sales.revenue.toLocaleString('fr-FR')} FCFA` : '—'}</p></article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div><h2 className="text-xl font-bold">+ Nouveau livre</h2><p className="mt-1 text-sm text-slate-400">PDF ou EPUB, fichier privé et téléchargement contrôlé après achat.</p></div>
            <input name="title" required placeholder="Titre du livre" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400" />
            <input name="author" required placeholder="Auteur" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400" />
            <input name="slug" required pattern="[-a-z0-9]+" placeholder="slug-commercial-exemple" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400" />
            <textarea name="description" required rows={5} placeholder="Description commerciale" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400" />
            <div className="grid gap-3 sm:grid-cols-2"><input name="price" required type="number" min="0" step="1" placeholder="Prix" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-emerald-400" /><input name="currency" defaultValue="XOF" maxLength={3} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm uppercase outline-none focus:border-emerald-400" /></div>
            <label className="block text-sm text-slate-300">Fichier eBook<input name="file" required type="file" accept="application/pdf,.pdf,application/epub+zip,.epub" className="mt-2 block w-full text-sm text-slate-400" /></label>
            <label className="block text-sm text-slate-300">Couverture (optionnelle)<input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm text-slate-400" /></label>
            <button disabled={saving} className="w-full rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50">{saving ? 'Publication…' : 'Publier le livre'}</button>
          </form>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold">Catalogue commercial</h2><p className="mt-1 text-sm text-slate-400">Chaque titre possède un lien partageable.</p></div><span className="text-xs text-slate-500">{data?.books.length ?? 0} titres</span></div>
            <div className="mt-5 space-y-3">{data?.books.map((book) => <article key={book.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="flex gap-4">{book.coverUrl ? <img src={book.coverUrl} alt="" className="h-20 w-14 rounded-lg object-cover" /> : <div className="h-20 w-14 rounded-lg bg-slate-800" />}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold">{book.title}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${book.isPublished ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'}`}>{book.isPublished ? 'PUBLIÉ' : 'BROUILLON'}</span></div><p className="mt-1 text-xs text-slate-400">{book.author} · {book.price.toLocaleString('fr-FR')} {book.currency}</p><p className="mt-2 text-xs text-slate-500">{Number(book.sales)} ventes · {Number(book.revenue).toLocaleString('fr-FR')} {book.currency}</p><a className="mt-2 inline-block text-xs font-semibold text-emerald-300 hover:text-emerald-200" href={`/ebooks/${book.slug}`}>Ouvrir le lien commercial →</a></div></div></article>)}{data && data.books.length === 0 && <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Aucun livre publié.</p>}</div>
          </section>
        </section>
      </div>
    </main>
  );
}
