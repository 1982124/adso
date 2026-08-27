'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type Choice = { id: string; label: string; isCorrect: boolean; scoreDelta: number; consequence: string; explanation: string; competency?: string };
type Interaction = { id: string; type: string; atSecond: number; prompt: string; explanation?: string; ttsText?: string; points: number; choices: Choice[] };
type Scene = { id: string; title: string; description: string; videoUrl: string; durationSeconds: number; competency: string; level: string; language: string; status: string; interactions: Interaction[] };
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function ImmersiveFormationPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selected, setSelected] = useState<Scene | null>(null);
  const [answer, setAnswer] = useState<Record<string, string>>({});
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(null);
  const [triggered, setTriggered] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ score: number; maxScore: number; accuracy: number; competencyGain: number; completed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/api/immersive/scenes')
      .then((r) => r.json())
      .then((data) => {
        const nextScenes = Array.isArray(data.scenes) ? data.scenes : [];
        setScenes(nextScenes);
        if (nextScenes[0]) setSelected(nextScenes[0]);
      })
      .catch(() => setScenes([]))
      .finally(() => setLoading(false));
  }, []);

  const orderedInteractions = useMemo(
    () => [...(selected?.interactions ?? [])].sort((a, b) => a.atSecond - b.atSecond),
    [selected],
  );
  const answeredCount = orderedInteractions.filter((interaction) => Boolean(answer[interaction.id])).length;
  const nextUnanswered = orderedInteractions.find((interaction) => !answer[interaction.id]);

  function selectScene(scene: Scene) {
    setSelected(scene);
    setAnswer({});
    setActiveInteractionId(null);
    setTriggered(new Set());
    setResult(null);
    setSaveState('idle');
    setSaveError('');
    if (videoRef.current) videoRef.current.currentTime = 0;
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !selected || result) return;
    const interaction = orderedInteractions.find((item) => !triggered.has(item.id) && video.currentTime >= item.atSecond);
    if (!interaction) return;

    video.pause();
    setActiveInteractionId(interaction.id);
    setTriggered((current) => new Set(current).add(interaction.id));
  }

  function choose(interactionId: string, choiceId: string) {
    setAnswer((current) => ({ ...current, [interactionId]: choiceId }));
    setSaveState('idle');
  }

  function continueScene() {
    const next = orderedInteractions.find((interaction) => !answer[interaction.id]);
    setActiveInteractionId(null);
    if (next) {
      videoRef.current?.play().catch(() => undefined);
      return;
    }
    if (videoRef.current && videoRef.current.currentTime < (selected?.durationSeconds ?? 60) - 1) {
      videoRef.current.play().catch(() => undefined);
    }
  }

  async function submit() {
    if (!selected || saveState === 'saving' || answeredCount !== orderedInteractions.length) return;
    setSaveState('saving');
    setSaveError('');
    setResult(null);

    const answers = orderedInteractions.map((interaction) => ({
      interactionId: interaction.id,
      choiceId: answer[interaction.id],
    }));

    try {
      const response = await fetch('/api/immersive/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sceneId: selected.id, answers }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.error || (response.status === 401 ? 'Connectez-vous pour enregistrer votre progression.' : 'Impossible d’enregistrer la progression.');
        throw new Error(message);
      }
      setResult(data);
      setActiveInteractionId(null);
      setSaveState('saved');
    } catch (error) {
      setSaveState('error');
      setSaveError(error instanceof Error ? error.message : 'Impossible d’enregistrer la progression.');
    }
  }

  const activeInteraction = orderedInteractions.find((interaction) => interaction.id === activeInteractionId) ?? null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">ADSO Immersive Scene Engine</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-5xl">Apprendre en situation réelle.</h1>
              <p className="mt-3 max-w-3xl text-slate-400">Observer → pause → décider → comprendre la conséquence → développer une compétence → progresser.</p>
            </div>
            <Link href="/education" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">Voir les parcours éducatifs →</Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Bibliothèque</h2>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">{scenes.length}</span>
            </div>
            {loading && <p className="text-sm text-slate-500">Chargement…</p>}
            {!loading && scenes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                La bibliothèque ne contient actuellement aucune scène publiée. L’expérience reste prête à accueillir les contenus validés par ADSO.
              </div>
            )}
            <div className="space-y-2">
              {scenes.map((scene) => (
                <button key={scene.id} onClick={() => selectScene(scene)} className={`w-full rounded-2xl p-3 text-left transition ${selected?.id === scene.id ? 'bg-emerald-400/10 ring-1 ring-emerald-400/40' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                  <div className="font-semibold">{scene.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{scene.durationSeconds}s · {scene.competency}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            {selected ? <>
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  src={selected.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setActiveInteractionId(null)}
                  className="aspect-video w-full object-contain"
                  aria-label={`Scène immersive : ${selected.title}`}
                />
                <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold backdrop-blur">SCÈNE IMMERSIVE</div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">{selected.competency}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.level}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{selected.language.toUpperCase()}</span>
                  <span className="ml-auto text-slate-500">{answeredCount}/{orderedInteractions.length} décisions</span>
                </div>

                <h2 className="mt-4 text-2xl font-black">{selected.title}</h2>
                <p className="mt-2 text-slate-400">{selected.description}</p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10" aria-label="Progression des décisions">
                  <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${orderedInteractions.length ? (answeredCount / orderedInteractions.length) * 100 : 0}%` }} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {orderedInteractions.map((interaction, index) => (
                    <div key={interaction.id} className={`rounded-2xl border p-3 ${answer[interaction.id] ? 'border-emerald-400/30 bg-emerald-400/5' : activeInteractionId === interaction.id ? 'border-amber-300/40 bg-amber-300/5' : 'border-white/10'}`}>
                      <div className="text-xs uppercase tracking-wider text-slate-500">Étape {index + 1}</div>
                      <div className="mt-1 font-semibold">{interaction.type}</div>
                      <div className="mt-1 text-xs text-slate-500">Pause à {interaction.atSecond}s</div>
                    </div>
                  ))}
                </div>

                {activeInteraction && !result && (
                  <div className="mt-6 rounded-3xl border border-amber-300/30 bg-amber-300/5 p-5 sm:p-6" role="dialog" aria-labelledby="decision-title">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Pause décision</div>
                    <h3 id="decision-title" className="mt-2 text-xl font-black">{activeInteraction.prompt}</h3>
                    <p className="mt-2 text-sm text-slate-400">Observe la situation avant de choisir. La conséquence sera révélée après ta décision et l'enregistrement de la scène.</p>
                    <div className="mt-4 grid gap-2">
                      {activeInteraction.choices.map((choice) => (
                        <button key={choice.id} onClick={() => choose(activeInteraction.id, choice.id)} className={`rounded-xl border p-4 text-left text-sm transition ${answer[activeInteraction.id] === choice.id ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'}`}>
                          {choice.label}
                        </button>
                      ))}
                    </div>
                    <button disabled={!answer[activeInteraction.id]} onClick={continueScene} className="mt-4 rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                      Continuer la scène
                    </button>
                  </div>
                )}

                {!activeInteraction && !result && orderedInteractions.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
                    {nextUnanswered ? 'Lance la scène. Elle se mettra automatiquement en pause au moment où une décision est nécessaire.' : 'Toutes les décisions sont prises. Enregistre maintenant ta progression pour obtenir ton résultat.'}
                  </div>
                )}

                {orderedInteractions.length === 0 && !result && (
                  <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">Cette scène est publiée sans interaction pédagogique. Elle doit être complétée avant d'être considérée comme une expérience d'apprentissage complète.</div>
                )}

                <button onClick={submit} disabled={saveState === 'saving' || orderedInteractions.length === 0 || answeredCount !== orderedInteractions.length || Boolean(result)} className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">
                  {saveState === 'saving' ? 'Enregistrement…' : result ? 'Progression enregistrée' : 'Enregistrer ma progression'}
                </button>

                {saveState === 'error' && <div role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{saveError} <button type="button" onClick={submit} className="ml-2 font-bold underline">Réessayer</button></div>}

                {result && (
                  <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                    <div className="text-sm font-semibold text-emerald-200">Situation terminée · résultat enregistré</div>
                    <div className="mt-1 text-3xl font-black">{Math.round(result.accuracy * 100)}% · {result.score}/{result.maxScore}</div>
                    <div className="mt-1 text-sm text-slate-300">Progression de compétence : {result.competencyGain}%</div>
                    <div className="mt-5 grid gap-3">
                      {orderedInteractions.map((interaction) => {
                        const selectedChoice = interaction.choices.find((choice) => choice.id === answer[interaction.id]);
                        return selectedChoice ? (
                          <div key={interaction.id} className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
                            <div className="font-semibold">{interaction.prompt}</div>
                            <div className="mt-2 text-slate-300"><strong className="text-white">Conséquence :</strong> {selectedChoice.consequence}</div>
                            <div className="mt-1 text-slate-300"><strong className="text-white">Pourquoi :</strong> {selectedChoice.explanation}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </> : (
              <div className="flex min-h-[500px] items-center justify-center p-8 text-center text-slate-500">Sélectionnez une scène immersive.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
