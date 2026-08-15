'use client';

import { useEffect, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Film, UploadCloud, ShieldCheck, AlertCircle, Loader2, PlayCircle } from 'lucide-react';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number | string;
  status: string;
  moderationStatus: string;
  moduleId?: string | null;
  courseId?: string | null;
  copyrightConfirmed: boolean;
  failureReason?: string | null;
}

const MAX_BYTES = 500 * 1024 * 1024;

export default function AdsoLabPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  async function load() {
    const response = await fetch('/api/lab/media', { cache: 'no-store' });
    if (response.ok) setAssets((await response.json()).assets ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function onSelect(file: File | undefined) {
    if (!file) return;
    setMessage('');
    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
      setMessage('Format accepté : MP4, WebM ou MOV.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage('La vidéo dépasse la limite de 500 MB.');
      return;
    }
    if (!copyrightConfirmed) {
      setMessage('Confirme d’abord que tu disposes des droits de diffusion de cette vidéo.');
      return;
    }

    setBusy(true);
    try {
      const result = await upload(`adso-lab/${moduleId || 'general'}/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/lab/media/upload',
        clientPayload: JSON.stringify({
          name: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          moduleId: moduleId || null,
          courseId: courseId || null,
          copyrightConfirmed,
        }),
      });
      if (!result.url) throw new Error('URL vidéo absente après upload');
      setMessage('Vidéo reçue. Elle est enregistrée dans ADSO LAB et attend la modération.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload vidéo impossible');
    } finally {
      setBusy(false);
    }
  }

  async function moderate(asset: MediaAsset, moderationStatus: 'approved' | 'rejected') {
    const response = await fetch('/api/lab/media', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: asset.id, moderationStatus, status: moderationStatus === 'approved' ? 'ready' : 'failed', failureReason: moderationStatus === 'rejected' ? 'Rejet de modération' : null }),
    });
    if (response.ok) await load();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <div className="flex items-center gap-3"><Film className="h-8 w-8 text-emerald-400" /><h1 className="text-3xl font-bold">ADSO LAB</h1></div>
          <p className="mt-2 max-w-3xl text-slate-400">Pipeline média réel : upload persistant, contrôle des droits, modération, statut de traitement et lecture vidéo. Les fonctions vidéo ne sont plus présentées comme disponibles tant qu’un asset réel n’est pas prêt.</p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID (optionnel)" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" />
            <input value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder="Module ID (optionnel)" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" />
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={copyrightConfirmed} onChange={(e) => setCopyrightConfirmed(e.target.checked)} className="mt-1" />Je confirme disposer des droits nécessaires pour stocker et diffuser cette vidéo.</label>
          <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-700/50 bg-emerald-950/10 p-6 text-center hover:bg-emerald-950/20">
            {busy ? <Loader2 className="h-8 w-8 animate-spin text-emerald-400" /> : <UploadCloud className="h-8 w-8 text-emerald-400" />}
            <span className="mt-3 font-semibold">{busy ? 'Upload sécurisé en cours…' : 'Importer une vidéo réelle'}</span>
            <span className="mt-1 text-xs text-slate-500">MP4, WebM, MOV · 500 MB maximum</span>
            <input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={busy} onChange={(e) => void onSelect(e.target.files?.[0])} className="sr-only" />
          </label>
          {message && <p className="mt-4 flex items-center gap-2 text-sm text-amber-300"><AlertCircle className="h-4 w-4" />{message}</p>}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-400" /><h2 className="text-xl font-semibold">Médias ADSO LAB</h2></div>
          {assets.length === 0 ? <div className="rounded-xl border border-slate-800 p-8 text-center text-slate-500">Aucun asset vidéo réel pour le moment.</div> : <div className="grid gap-5 lg:grid-cols-2">{assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
              {asset.url && asset.status === 'ready' && asset.moderationStatus === 'approved' ? <video controls preload="metadata" className="aspect-video w-full bg-black" src={asset.url} /> : <div className="flex aspect-video items-center justify-center bg-slate-950 text-slate-600"><PlayCircle className="h-10 w-10" /></div>}
              <div className="space-y-3 p-4"><div><h3 className="font-semibold">{asset.name}</h3><p className="text-xs text-slate-500">{asset.moduleId ? `Module : ${asset.moduleId}` : 'Asset non rattaché'}</p></div>
                <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-slate-800 px-2 py-1">{asset.status}</span><span className="rounded-full bg-slate-800 px-2 py-1">modération : {asset.moderationStatus}</span></div>
                {asset.moderationStatus === 'pending' && <div className="flex gap-2"><button onClick={() => void moderate(asset, 'approved')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold">Approuver</button><button onClick={() => void moderate(asset, 'rejected')} className="rounded-lg bg-red-900/70 px-3 py-2 text-sm font-semibold">Rejeter</button></div>}
                {asset.failureReason && <p className="text-xs text-red-300">{asset.failureReason}</p>}
              </div>
            </article>
          ))}</div>}
        </section>
      </div>
    </main>
  );
}
