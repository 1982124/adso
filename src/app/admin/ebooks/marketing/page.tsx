'use client';

import { useEffect, useState } from 'react';
import { upload } from '@vercel/blob/client';

interface Ebook { id: string; title: string; slug: string; }
interface Asset { id: string; ebookId: string; kind: string; title: string; description: string | null; url: string; contentType: string; sizeBytes: number; status: string; }

export default function EbookMarketingPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [ebookId, setEbookId] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadEbooks() {
    const response = await fetch('/api/ebooks', { cache: 'no-store' });
    if (!response.ok) throw new Error('Catalogue eBook inaccessible');
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.ebooks ?? data.items ?? []);
    setEbooks(list.map((item: Record<string, unknown>) => ({ id: String(item.id), title: String(item.title), slug: String(item.slug) })));
  }
  async function loadAssets(id: string) {
    if (!id) { setAssets([]); return; }
    const response = await fetch(`/api/admin/ebooks/marketing?ebookId=${encodeURIComponent(id)}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Médias marketing inaccessibles');
    setAssets(data.assets ?? []);
  }
  useEffect(() => { loadEbooks().catch(e => setMessage(e instanceof Error ? e.message : 'Erreur')); }, []);
  useEffect(() => { loadAssets(ebookId).catch(e => setMessage(e instanceof Error ? e.message : 'Erreur')); }, [ebookId]);

  async function uploadAsset() {
    if (!file || !ebookId || !title.trim()) return;
    setBusy(true); setMessage('');
    try {
      await upload(`ebooks/${ebookId}/marketing/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/ebooks/marketing-upload',
        clientPayload: JSON.stringify({ ebookId, mimeType: file.type, sizeBytes: file.size, filename: file.name, title, description }),
      });
      setFile(null); setTitle(''); setDescription('');
      await loadAssets(ebookId);
      setMessage('✅ Média marketing enregistré en brouillon. Publiez-le après vérification.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Upload impossible'); }
    finally { setBusy(false); }
  }
  async function setStatus(id: string, status: string) {
    const response = await fetch('/api/admin/ebooks/marketing', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Publication impossible');
    await loadAssets(ebookId);
  }

  return <main className="min-h-screen bg-background px-4 py-8 md:px-8"><div className="mx-auto max-w-5xl space-y-6">
    <header><p className="text-sm font-medium text-primary">ADSO · E-books · Marketing</p><h1 className="mt-2 text-3xl font-bold">Teasers & médias promotionnels</h1><p className="mt-2 text-muted-foreground">Importez des vidéos teasers ou des visuels promotionnels, puis contrôlez leur publication.</p></header>
    <section className="rounded-2xl border p-6 space-y-4"><label className="block text-sm font-semibold">E-book</label><select value={ebookId} onChange={e => setEbookId(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3"><option value="">Sélectionner un e-book</option>{ebooks.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}</select><div className="grid gap-4 md:grid-cols-2"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre du teaser / visuel" className="rounded-xl border bg-background px-4 py-3" /><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description marketing (optionnelle)" className="rounded-xl border bg-background px-4 py-3" /></div><input type="file" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border p-3" /><button disabled={busy || !file || !ebookId || !title.trim()} onClick={uploadAsset} className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Téléversement…' : '🎬 Téléverser le teaser'}</button>{message && <p role="status" className="rounded-xl border p-4 text-sm">{message}</p>}</section>
    <section className="space-y-3"><h2 className="text-xl font-bold">Médias de l’e-book</h2>{!ebookId && <p className="text-sm text-muted-foreground">Sélectionnez un e-book pour afficher ses teasers.</p>}{ebookId && assets.length === 0 && <p className="rounded-xl border p-5 text-sm text-muted-foreground">Aucun média promotionnel. Ajoutez votre premier teaser.</p>}{assets.map(asset => <article key={asset.id} className="rounded-2xl border p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold">{asset.title}</h3><p className="text-xs text-muted-foreground">{asset.kind} · {asset.contentType} · {asset.status}</p><p className="mt-1 text-sm text-muted-foreground">{asset.description}</p></div><div className="flex gap-2"><button onClick={() => setStatus(asset.id, asset.status === 'published' ? 'draft' : 'published')} className="rounded-lg border px-3 py-2 text-sm font-medium">{asset.status === 'published' ? 'Dépublier' : 'Publier'}</button><button onClick={() => setStatus(asset.id, 'archived')} className="rounded-lg border px-3 py-2 text-sm">Archiver</button></div></div>{asset.contentType.startsWith('video/') ? <video controls preload="metadata" className="mt-4 max-h-80 w-full rounded-xl bg-black" src={asset.url} /> : <img src={asset.url} alt={asset.title} className="mt-4 max-h-80 w-full rounded-xl object-contain" />}</article>)}</section>
  </div></main>;
}
