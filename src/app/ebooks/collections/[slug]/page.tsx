'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book { id: string; slug: string; title: string; description: string; author: string; coverUrl?: string | null; price: number; currency: string; }
interface Collection { title: string; description: string; coverUrl?: string | null; targetAudience?: string | null; language: string; items: Book[]; contributors: { name: string; email?: string | null; role: string }[]; }

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`/api/ebooks/collections?slug=${encodeURIComponent(params.slug)}`)
      .then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Collection introuvable'); return data.collection; })
      .then(setCollection).catch(e => setError(e.message));
  }, [params.slug]);
  if (error) return <main className="min-h-screen p-8"><p>{error}</p><Link href="/ebooks">Retour à la bibliothèque</Link></main>;
  if (!collection) return <main className="min-h-screen p-8"><p>Chargement de la collection…</p></main>;
  return <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
    <div className="mx-auto max-w-6xl">
      <Link href="/ebooks" className="text-sm opacity-80">← Bibliothèque ADSO</Link>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/10">{collection.coverUrl && <img src={collection.coverUrl} alt={collection.title} className="h-full w-full object-cover" />}</div>
          <div><p className="text-sm uppercase tracking-[.2em] opacity-70">Collection ADSO</p><h1 className="mt-2 text-4xl font-bold">{collection.title}</h1><p className="mt-4 max-w-3xl text-lg opacity-85">{collection.description}</p>{collection.targetAudience && <p className="mt-4 text-sm opacity-70">Public : {collection.targetAudience}</p>}<div className="mt-5 flex flex-wrap gap-2">{collection.contributors.map((c,i)=><span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm">{c.name} · {c.role}</span>)}</div></div>
        </div>
      </section>
      <h2 className="mt-10 text-2xl font-semibold">Les {collection.items.length} livres de la collection</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{collection.items.map((book, i)=><article key={book.id} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="aspect-[3/4] overflow-hidden rounded-xl bg-white/10">{book.coverUrl && <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />}</div><p className="mt-3 text-xs opacity-60">Tome {i + 1}</p><h3 className="mt-1 text-lg font-semibold">{book.title}</h3><p className="text-sm opacity-70">{book.author}</p><Link href={`/ebooks/${book.slug}`} className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950">Découvrir le livre</Link></article>)}</div>
    </div>
  </main>;
}
