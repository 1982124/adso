'use client';

import { useEffect, useRef, useState } from 'react';

type Choice = { id: string; label: string; isCorrect: boolean; scoreDelta: number; consequence: string; explanation: string; competency?: string };
type Interaction = { id: string; type: string; atSecond: number; prompt: string; explanation?: string; ttsText?: string; points: number; choices: Choice[] };
type Scene = { id: string; title: string; description: string; videoUrl: string; durationSeconds: number; competency: string; level: string; language: string; status: string; interactions: Interaction[] };
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function ImmersiveFormationPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selected, setSelected] = useState<Scene | null>(null);
  const [answer, setAnswer] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number; accuracy: number; competencyGain: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/immersive/scenes', { credentials: 'include' })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || 'Impossible de charger les scènes.');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const nextScenes = Array.isArray(data?.scenes) ? data.scenes : [];
        setScenes(nextScenes);
        if (nextScenes[0]) setSelected(nextScenes[0]);
      })
      .catch(() => {
        if (!cancelled) setScenes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const selectedIndex = selected ? scenes.findIndex((scene) => scene.id === selected.id) : -1;
  const answeredCount = selected ? selected.interactions.filter((interaction) => Boolean(answer[interaction.id])).length : 0;
  const interactionCount = selected?.interactions.length ?? 0;
  const progressPercent = interactionCount === 0 ? 0 : Math.round((answeredCount / interactionCount) * 100);
  const canSubmit = Boolean(selected && interactionCount > 0 && answeredCount === interactionCount && saveState !== 'saving');

  function selectScene(index: number) {
    const next = scenes[index];
    if (!next) return;
    setSelected(next);
    setAnswer({});
    setResult(null);
    setSaveState('idle');
    setSaveError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    if (!selected || !canSubmit) return;
    setSaveState('saving');
    setSaveError('');
    setResult(null);

    const answers = selected.interactions.map((interaction) => {
      const choiceId = answer[interaction.id];
      const choice = interaction.choices.find((c) => c.id === choiceId);
      return { interactionId: interaction.id, choiceId, scoreDelta: choice?.scoreDelta ?? 0, correct: Boolean(choice?.isCorrect) };
    });

    try {
      const response = await fetch('/api/immersive/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sceneId: selected.id, competency: selected.competency, interactions: selected.interactions, answers }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.error || (response.status === 401 ? 'Connectez-vous pour enregistrer votre progression.' : 'Impossible d’enregistrer la progression.');
        throw new Error(message);
      }
      setResult(data);
      setSaveState('saved');
    } catch (error) {
      setSaveState('error');
      setSaveError(error instanceof Error ? error.message : 'Impossible d’enregistrer la progression.');
    }
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
            <div className="space-y-2">{scenes.map((scene, index) => <button key={scene.id} type="button" aria-current={selected?.id === scene.id ? 'page' : undefined} onClick={() => selectScene(index)} className={`w-full rounded-2xl p-3 text-left transition ${selected?.id === scene.id ? 'bg-emerald-400/10 ring-1 ring-emerald-400/40' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}><div className="font-semibold">{scene.title}</div><div className="mt-1 text-xs text-slate-500">{scene.durationSeconds}s · {scene.competency}</div></button>)}</div>
          </aside>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            {selected ? <>
              <div className="relative bg-black">
                <video ref={videoRef} src={selected.videoUrl} controls playsInline className="aspect-video w-full object-contain" aria-label={`Vidéo de la scène ${selected.title}`} />
                <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold backdrop-blur">SCÈNE IMMERSIVE</div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">{selected.competency}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.level}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.language.toUpperCase()}</span></div>
                <h2 className="mt-4 text-2xl font-black">{selected.title}</h2><p className="mt-2 text-slate-400">{selected.description}</p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4" aria-label="Progression de la scène">
                  <div className="flex items-center justify-between text-sm"><span className="font-semibold">Progression de la scène</span><span className="text-emerald-300">{answeredCount}/{interactionCount}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progressPercent}%` }} /></div>
                  <p className="mt-2 text-xs text-slate-500">{progressPercent}% des décisions complétées</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">{selected.interactions.map((interaction) => <div key={interaction.id} className="rounded-2xl border border-white/10 p-3"><div className="text-xs uppercase tracking-wider text-slate-500">{interaction.type}</div><div className="mt-1 font-semibold">Pause à {interaction.atSecond}s</div></div>)}</div>
                {selected.interactions.map((interaction) => <div key={interaction.id} className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5"><div className="text-xs font-bold uppercase tracking-wider text-amber-300">{interaction.type} · {interaction.points} points</div><h3 className="mt-2 text-lg font-bold">{interaction.prompt}</h3><div className="mt-4 grid gap-2">{interaction.choices.map((choice) => <button key={choice.id} type="button" aria-pressed={answer[interaction.id] === choice.id} onClick={() => { setAnswer((current) => ({ ...current, [interaction.id]: choice.id })); setSaveState('idle'); setResult(null); setSaveError(''); }} className={`rounded-xl border p-3 text-left text-sm transition ${answer[interaction.id] === choice.id ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 hover:border-white/20'}`}>{choice.label}</button>)}</div>{answer[interaction.id] && <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-slate-300"><strong className="text-white">Conséquence :</strong> {interaction.choices.find((c) => c.id === answer[interaction.id])?.consequence}<br /><strong className="text-white">Pourquoi :</strong> {interaction.choices.find((c) => c.id === answer[interaction.id])?.explanation}</div>}</div>)}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={() => selectScene(selectedIndex - 1)} disabled={selectedIndex <= 0 || saveState === 'saving'} aria-label="Scène précédente" className="rounded-xl border border-white/10 px-5 py-3 font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40">← Précédente</button>
                  <button type="button" onClick={submit} disabled={!canSubmit} className="rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">{saveState === 'saving' ? 'Enregistrement…' : saveState === 'saved' ? 'Progression enregistrée' : 'Enregistrer ma progression'}</button>
                  <button type="button" onClick={() => selectScene(selectedIndex + 1)} disabled={selectedIndex < 0 || selectedIndex >= scenes.length - 1 || saveState === 'saving'} aria-label="Scène suivante" className="rounded-xl border border-white/10 px-5 py-3 font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40">Suivante →</button>
                </div>
                {!canSubmit && saveState !== 'saving' && interactionCount > 0 && <p className="mt-3 text-center text-xs text-slate-500">Répondez à toutes les décisions avant d’enregistrer votre progression.</p>}
                {saveState === 'error' && <div role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{saveError} <button type="button" onClick={submit} className="ml-2 font-bold underline">Réessayer</button></div>}
                {result && <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5"><div className="text-sm text-emerald-200">Progression enregistrée</div><div className="mt-1 text-3xl font-black">{Math.round(result.accuracy * 100)}% · {result.score}/{result.maxScore}</div><div className="mt-1 text-sm text-slate-300">Maîtrise de compétence : {result.competencyGain}%</div></div>}
              </div>
            </> : <div className="flex min-h-[500px] items-center justify-center p-8 text-center text-slate-500">Sélectionnez une scène immersive.</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
