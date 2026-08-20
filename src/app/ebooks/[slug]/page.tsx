'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ADSOShare from '@/components/ADSOShare';

type Ebook = {
  id: string; slug: string; title: string; description: string; author: string;
  coverUrl: string | null; price: number; currency: string; owned: boolean; hasFile: boolean;
};

function makeKey(slug: string) {
  return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}-checkout`;
}

export default function EbookProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(({ slug }) => fetch(`/api/ebooks/${encodeURIComponent(slug)}`, { cache: 'no-store' }))
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'eBook introuvable');
        setEbook(data.ebook);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Impossible de charger cet eBook'))
      .finally(() => setLoading(false));
  }, [params]);

  const buy = async (provider: 'chariow' | 'maketou') => {
    if (!ebook) return;
    setBuying(provider); setError('');
    try {
      const response = await fetch('/api/ebooks/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: ebook.slug, provider, idempotencyKey: makeKey(ebook.slug) }),
      });
      const data = await response.json();
      if (response.status === 401) { window.location.href = '/api/auth/signin'; return; }
      if (!response.ok) throw new Error(data.error ?? 'Checkout indisponible');
      if (!data.order?.checkoutUrl) throw new Error('Lien de paiement indisponible');
      window.location.href = data.order.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de démarrer le paiement');
    } finally { setBuying(''); }
  };

  if (loading) return <main className="min-h-screen px-4 py-12"><div className="mx-auto max-w-5xl">Chargement…</div></main>;
  if (error && !ebook) return <main className="min-h-screen px-4 py-12"><div className="mx-auto max-w-5xl"><p role="alert" className="rounded-xl border p-5">{error}</p><Link className="mt-5 inline-block underline" href="/ebooks">Retour aux eBooks</Link></div></main>;
  if (!ebook) return null;

  const money = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: ebook.currency }).format(ebook.price);

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/ebooks" className="text-sm underline">← Bibliothèque eBooks</Link>
          <Link href="/marketplace" className="inline-flex min-h-10 items-center rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted">Marketplace</Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
          <div>
            {ebook.coverUrl ? <img src={ebook.coverUrl} alt={`Couverture de ${ebook.title}`} className="w-full rounded-2xl border object-cover shadow-sm" /> : <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border bg-muted p-8 text-center font-semibold">{ebook.title}</div>}
          </div>
          <section>
            <p className="text-sm font-medium text-primary">ADSO · eBook</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{ebook.title}</h1>
            <p className="mt-2 text-muted-foreground">Par {ebook.author}</p>
            <p className="mt-6 whitespace-pre-line leading-7 text-muted-foreground">{ebook.description}</p>
            <div className="mt-8 flex items-center gap-4"><span className="text-2xl font-bold">{money}</span>{ebook.owned && <span className="rounded-full border px-3 py-1 text-sm">Acquis</span>}</div>

            {ebook.owned ? (
              ebook.hasFile ? <div className="mt-8 overflow-hidden rounded-2xl border bg-card"><div className="border-b p-4 font-semibold">Votre lecture</div><iframe title={ebook.title} src={`/api/ebooks/${encodeURIComponent(ebook.slug)}/download`} className="h-[75vh] w-full" /></div> : <div className="mt-8 rounded-xl border p-5">Votre achat est confirmé. Le fichier est en cours de mise à disposition.</div>
            ) : (
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground">Choisissez votre moyen de paiement disponible :</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => buy('chariow')} disabled={Boolean(buying)} className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-50">{buying === 'chariow' ? 'Redirection…' : 'Acheter via Chariow'}</button>
                  <button onClick={() => buy('maketou')} disabled={Boolean(buying)} className="rounded-xl border px-5 py-3 font-medium disabled:opacity-50">{buying === 'maketou' ? 'Redirection…' : 'Acheter via Maketou'}</button>
                </div>
                {error && <p role="alert" className="rounded-xl border p-4 text-sm">{error}</p>}
                <p className="text-xs text-muted-foreground">L’accès à l’eBook n’est accordé qu’après confirmation serveur du paiement.</p>
              </div>
            )}
          </section>
        </div>
        <ADSOShare
          title={`${ebook.title} — ADSO`}
          text={`Découvrez « ${ebook.title} » de ${ebook.author} sur ADSO. Un eBook à découvrir et à partager avec votre communauté.`}
          label={`Partager « ${ebook.title} »`}
        />
      </div>
    </main>
  );
}
