'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Ebook = {
  id: string; slug: string; title: string; description: string; author: string;
  coverUrl: string | null; price: number; currency: string; owned?: boolean; grantedAt?: string;
};

export default function EbooksPage() {
  const [books, setBooks] = useState<Ebook[]>([]);
  const [library, setLibrary] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/ebooks', { cache: 'no-store' }).then(async r => r.ok ? r.json() : Promise.reject(new Error('catalog'))),
      fetch('/api/ebooks/library', { cache: 'no-store' }).then(async r => r.ok ? r.json() : { ebooks: [] }),
    ])
      .then(([catalog, owned]) => { setBooks(catalog.ebooks ?? []); setLibrary(owned.ebooks ?? []); })
      .catch(() => setError('Le catalogue eBooks est temporairement indisponible.'))
      .finally(() => { setLoading(false); setLibraryLoading(false); });
  }, []);

  const money = (value: number, currency: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">ADSO Safety · Bibliothèque</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">eBooks</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Découvrez les publications disponibles dans ADSO. Les achats numériques sont séparés de votre abonnement de formation.
          </p>
        </header>

        {error && <div role="alert" className="mb-6 rounded-xl border p-4 text-sm">{error}</div>}

        <section aria-labelledby="catalogue-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="catalogue-title" className="text-xl font-semibold">Catalogue</h2>
            <Link className="text-sm underline" href="/">Retour à ADSO</Link>
          </div>
          {loading ? <p className="text-muted-foreground">Chargement du catalogue…</p> : books.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center text-muted-foreground">Aucun eBook publié pour le moment.</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map(book => (
                <article key={book.id} className="overflow-hidden rounded-2xl border bg-card">
                  {book.coverUrl ? <img src={book.coverUrl} alt={`Couverture de ${book.title}`} className="aspect-[3/4] w-full object-cover" /> : <div className="flex aspect-[3/4] items-center justify-center bg-muted p-6 text-center font-semibold">{book.title}</div>}
                  <div className="space-y-3 p-5">
                    <div><h3 className="font-semibold">{book.title}</h3><p className="text-sm text-muted-foreground">{book.author}</p></div>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{book.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{money(book.price, book.currency)}</span>
                      {book.owned ? <Link href={`/ebooks/${book.slug}`} className="rounded-lg border px-3 py-2 text-sm font-medium">Lire</Link> : <Link href={`/ebooks/${book.slug}`} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Voir le livre</Link>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="library-title" className="mt-12">
          <h2 id="library-title" className="mb-4 text-xl font-semibold">Ma bibliothèque</h2>
          {libraryLoading ? <p className="text-muted-foreground">Vérification de vos achats…</p> : library.length === 0 ? (
            <div className="rounded-2xl border p-6 text-muted-foreground">Connectez-vous et achetez un eBook pour le retrouver ici.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {library.map(book => <Link key={book.id} href={`/ebooks/${book.slug}`} className="rounded-xl border p-4 hover:bg-muted/50"><span className="font-medium">{book.title}</span><span className="mt-1 block text-sm text-muted-foreground">Accès acquis</span></Link>)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
