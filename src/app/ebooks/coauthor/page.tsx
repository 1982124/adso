'use client';
import { useEffect, useState } from 'react';

export default function EbookCoauthorPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/ebooks/coauthor-dashboard').then(async r => { const d=await r.json(); if(!r.ok) throw new Error(d.error||'Accès impossible'); setData(d); }).catch(e=>setError(e.message)); }, []);
  return <main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-5xl"><p className="text-sm text-primary">ADSO · Espace coauteur</p><h1 className="mt-2 text-3xl font-bold">Mes ventes eBook</h1><p className="mt-2 text-muted-foreground">Vous pouvez suivre les performances de vos livres associés. Cet espace ne donne aucun accès aux fonds, aux retraits ni aux coordonnées de paiement.</p>{error&&<p className="mt-6 rounded-xl border p-4">{error}</p>}<div className="mt-8 grid gap-4 md:grid-cols-2">{data?.books?.map((b:any)=><article key={b.ebookId} className="rounded-2xl border p-6"><h2 className="text-xl font-semibold">{b.title}</h2><p className="mt-1 text-sm text-muted-foreground">{b.displayName}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Ventes payées</div><div className="mt-1 text-2xl font-bold">{b.paidSales}</div></div><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Chiffre d’affaires</div><div className="mt-1 text-2xl font-bold">{b.grossAmountMinor} {b.currency}</div></div></div><div className="mt-5 rounded-xl border p-4 text-sm">Accès aux fonds : <b>non</b><br/>Retrait : <b>non</b><br/>Gestion du produit : <b>non</b></div></article>)}</div></div></main>;
}
