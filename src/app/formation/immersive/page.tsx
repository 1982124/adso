'use client';

import { useEffect, useRef, useState } from 'react';

type Choice = { id: string; label: string; isCorrect: boolean; scoreDelta: number; consequence: string; explanation: string; competency?: string };
type Interaction = { id: string; type: string; atSecond: number; prompt: string; explanation?: string; ttsText?: string; points: number; choices: Choice[] };
type Scene = { id: string; title: string; description: string; videoUrl: string; durationSeconds: number; competency: string; level: string; language: string; status: string; interactions: Interaction[] };

export default function ImmersiveFormationPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selected, setSelected] = useState<Scene | null>(null);
  const [answer, setAnswer] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number; accuracy: number; competencyGain: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/api/immersive/scenes').then((r) => r.json()).then((data) => {
      setScenes(Array.isArray(data.scenes) ? data.scenes : []);
      if (data.scenes?.[0]) setSelected(data.scenes[0]);
    }).finally(() => setLoading(false));
  }, []);

  async function submit() {
    if (!selected) return;
    const answers = selected.interactions.filter((i) => answer[i.id]).map((i) => {
      const choice = i.choices.find((c) => c.id === answer[i.id]);
      return { interactionId: i.id, choiceId: answer[i.id], scoreDelta: choice?.scoreDelta ?? 0, correct: Boolean(choice?.isCorrect) };
    });
    const response = await fetch('/api/immersive/attempts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sceneId: selected.id, competency: selected.competency, interactions: selected.interactions, answers }) });
    if (response.ok) setResult(await response.json());
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">ADSO Immersive Scene Engine</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Apprendre en situation réelle.</h1>
          <p className="mt-3 max-w-3xl text-slate-400">Vidéo courte → pause → décision → conséquence → explication → score → compétence → progression.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Bibliothèque</h2><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">{scenes.length}</span></div>
            {loading && <p className="text-sm text-slate-500">Chargement…</p>}
            {!loading && scenes.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">Aucune scène publiée. Les instructeurs peuvent créer les scènes via l’API d’authoring.</div>}
            <div className="space-y-2">{scenes.map((scene) => <button key={scene.id} onClick={() => { setSelected(scene); setAnswer({}); setResult(null); }} className={`w-full rounded-2xl p-3 text-left transition ${selected?.id === scene.id ? 'bg-emerald-400/10 ring-1 ring-emerald-400/40' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}><div className="font-semibold">{scene.title}</div><div className="mt-1 text-xs text-slate-500">{scene.durationSeconds}s · {scene.competency}</div></button>)}</div>
          </aside>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            {selected ? <>
              <div className="relative bg-black">
                <video ref={videoRef} src={selected.videoUrl} controls playsInline className="aspect-video w-full object-contain" />
                <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold backdrop-blur">SCÈNE IMMERSIVE</div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">{selected.competency}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.level}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.language.toUpperCase()}</span></div>
                <h2 className="mt-4 text-2xl font-black">{selected.title}</h2><p className="mt-2 text-slate-400">{selected.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">{selected.interactions.map((interaction) => <div key={interaction.id} className="rounded-2xl border border-white/10 p-3"><div className="text-xs uppercase tracking-wider text-slate-500">{interaction.type}</div><div className="mt-1 font-semibold">Pause à {interaction.atSecond}s</div></div>)}</div>
                {selected.interactions.map((interaction) => <div key={interaction.id} className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5"><div className="text-xs font-bold uppercase tracking-wider text-amber-300">{interaction.type} · {interaction.points} points</div><h3 className="mt-2 text-lg font-bold">{interaction.prompt}</h3><div className="mt-4 grid gap-2">{interaction.choices.map((choice) => <button key={choice.id} onClick={() => setAnswer((current) => ({ ...current, [interaction.id]: choice.id }))} className={`rounded-xl border p-3 text-left text-sm transition ${answer[interaction.id] === choice.id ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 hover:border-white/20'}`}>{choice.label}</button>)}</div>{answer[interaction.id] && <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-slate-300"><strong className="text-white">Conséquence :</strong> {interaction.choices.find((c) => c.id === answer[interaction.id])?.consequence}<br /><strong className="text-white">Pourquoi :</strong> {interaction.choices.find((c) => c.id === answer[interaction.id])?.explanation}</div>}</div>)}
                <button onClick={submit} className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300">Enregistrer ma progression</button>
                {result && <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5"><div className="text-sm text-emerald-200">Progression enregistrée</div><div className="mt-1 text-3xl font-black">{Math.round(result.accuracy * 100)}% · {result.score}/{result.maxScore}</div><div className="mt-1 text-sm text-slate-300">Maîtrise de compétence : {result.competencyGain}%</div></div>}
              </div>
            </> : <div className="flex min-h-[500px] items-center justify-center p-8 text-center text-slate-500">Sélectionnez une scène immersive.</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
