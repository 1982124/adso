'use client';

import { useEffect, useMemo, useState } from 'react';
import { Film, Link2, Plus, ShieldCheck, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';

type Asset = { id: string; name: string; url: string; status: string; moderationStatus: string; copyrightConfirmed: boolean; durationSeconds?: number | null; mimeType: string; sizeBytes: number | string };

type Choice = { label: string; isCorrect: boolean; scoreDelta: number; consequence: string; explanation: string; competency: string };

export default function ImmersiveAdminPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [competency, setCompetency] = useState('Anticipation du danger');
  const [pause, setPause] = useState('10');
  const [prompt, setPrompt] = useState('Que devrait faire l’usager ?');
  const [choices, setChoices] = useState<Choice[]>([
    { label: 'Ralentir, observer et se préparer à céder le passage.', isCorrect: true, scoreDelta: 10, consequence: 'Le danger est mieux anticipé.', explanation: 'Observer et réduire l’exposition au danger améliore la sécurité.', competency: 'Anticipation du danger' },
    { label: 'Accélérer pour passer avant le danger.', isCorrect: false, scoreDelta: 0, consequence: 'Le temps disponible pour réagir diminue.', explanation: 'Accélérer dans une situation incertaine augmente le risque.', competency: 'Anticipation du danger' },
  ]);
  const [message, setMessage] = useState('');

  async function loadAssets() {
    const response = await fetch('/api/lab/media', { cache: 'no-store' });
    if (response.ok) setAssets((await response.json()).assets ?? []);
  }
  useEffect(() => { void loadAssets(); }, []);

  const readyAssets = useMemo(() => assets.filter((asset) => asset.status === 'ready' && asset.moderationStatus === 'approved' && asset.copyrightConfirmed && asset.url), [assets]);
  const selectedAsset = readyAssets.find((asset) => asset.id === selected);

  async function createScene() {
    setMessage('');
    if (!selectedAsset) return setMessage('Sélectionne une vidéo réellement stockée et approuvée.');
    const duration = selectedAsset.durationSeconds ?? 30;
    const response = await fetch('/api/immersive/scenes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoAssetId: selectedAsset.id,
        durationSeconds: duration,
        title: title || selectedAsset.name,
        description,
        competency,
        level: 'beginner', language: 'fr', status: 'draft',
        interactions: [{ type: 'decision', atSecond: Number(pause), prompt, points: 10, explanation: 'Analyse la situation avant d’agir.', choices }],
      }),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? 'Création impossible');
    setMessage(`Scène créée en brouillon : ${data.id}. Elle n’est pas publiée automatiquement.`);
  }

  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8"><div className="mx-auto max-w-6xl space-y-8">
    <header><div className="flex items-center gap-3"><Film className="h-8 w-8 text-emerald-400"/><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">ADSO AFRICA</p><h1 className="text-3xl font-black">Immersive Content Studio</h1></div></div><p className="mt-2 max-w-3xl text-slate-400">Une vidéo réelle devient une scène uniquement après stockage, contrôle des droits et approbation. Aucun média fictif n’est créé.</p></header>
    <section className="rounded-2xl border border-emerald-700/30 bg-emerald-950/10 p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-400"/><div><h2 className="font-bold">Chaîne de preuve</h2><p className="mt-1 text-sm text-slate-400">Vidéo réelle → stockage persistant → modération → scène → décision → évaluation → compétence → preuve.</p></div></div></section>
    <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4"><div className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-emerald-400"/><h2 className="font-semibold">1 · Vidéos approuvées</h2></div>{readyAssets.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-7 text-center text-sm text-slate-500">Aucune vidéo réelle approuvée. Utilise ADSO LAB pour importer et modérer un média.</div> : <div className="space-y-3">{readyAssets.map(asset => <button key={asset.id} type="button" onClick={() => setSelected(asset.id)} className={`w-full rounded-xl border p-3 text-left ${selected === asset.id ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 bg-slate-950/60'}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{asset.name}</p><p className="mt-1 text-xs text-slate-500">{asset.mimeType} · {asset.durationSeconds ?? 'durée à renseigner'} s</p></div><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400"/></div></button>)}</div>}</div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4"><div className="flex items-center gap-2"><Link2 className="h-5 w-5 text-emerald-400"/><h2 className="font-semibold">2 · Construire une scène</h2></div><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de la scène" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5"/><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description pédagogique" className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5"/><input value={competency} onChange={e => setCompetency(e.target.value)} placeholder="Compétence évaluée" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5"/><div className="grid gap-3 sm:grid-cols-2"><input value={pause} onChange={e => setPause(e.target.value)} type="number" min="0" placeholder="Seconde de pause" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5"/><input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Question / décision" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5"/></div><div className="space-y-3"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Choix de décision</p>{choices.map((choice, index) => <div key={index} className="rounded-xl border border-slate-800 p-3 space-y-2"><input value={choice.label} onChange={e => setChoices(v => v.map((c,i) => i===index ? {...c,label:e.target.value}:c))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"/><label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={choice.isCorrect} onChange={e => setChoices(v => v.map((c,i) => i===index ? {...c,isCorrect:e.target.checked}:c))}/> Décision correcte</label></div>)}<button type="button" onClick={() => setChoices(v => [...v,{label:'Nouvelle décision',isCorrect:false,scoreDelta:0,consequence:'',explanation:'',competency}])} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-800"><Plus className="h-4 w-4"/> Ajouter un choix</button></div><button type="button" onClick={() => void createScene()} className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold hover:bg-emerald-500">Créer la scène en brouillon</button>{message && <p className="flex items-start gap-2 text-sm text-amber-300"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0"/>{message}</p>}</div>
    </section>
  </div></main>;
}
