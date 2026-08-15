'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Eye, Info, ShieldCheck } from 'lucide-react';

type Sign = { id: string; category: string; subcategory?: string | null; name: string; description: string; meaning: string; useCase: string; shape?: string | null; colors?: unknown; applicability?: string };

type Scene = { title: string; environment: string; prompt: string; answer: string; sign: string; risk: string };

const scenes: Scene[] = [
  { title: 'Approche d’un carrefour', environment: 'Zone urbaine · visibilité moyenne', prompt: 'Vous voyez le panneau et un véhicule arrive sur la voie transversale. Quelle est votre première action ?', answer: 'Ralentir, observer et appliquer la prescription du panneau et la règle de priorité de la juridiction concernée.', sign: 'Priorité', risk: 'Entrée trop rapide dans le carrefour' },
  { title: 'Enfant près de la chaussée', environment: 'Quartier résidentiel · après-midi', prompt: 'Un enfant est proche du bord de la route. Même si rien ne vous oblige encore à freiner, que faites-vous ?', answer: 'Réduire l’allure, augmenter la vigilance et être prêt à s’arrêter.', sign: 'Danger', risk: 'Sous-estimation d’un usager vulnérable' },
  { title: 'Chaussée humide', environment: 'Route ouverte · pluie', prompt: 'La visibilité diminue et la chaussée est mouillée. Quelle adaptation est prioritaire ?', answer: 'Adapter la vitesse et augmenter la distance de sécurité.', sign: 'Danger', risk: 'Vitesse inadaptée aux conditions' },
  { title: 'Téléphone au volant', environment: 'Circulation dense · distraction', prompt: 'Une notification arrive pendant la conduite. Quelle décision protège le mieux la sécurité ?', answer: 'Ne pas manipuler le téléphone pendant la conduite ; s’arrêter dans un lieu autorisé si une action est indispensable.', sign: 'Prévention', risk: 'Distraction cognitive et visuelle' },
];

function SignGraphic({ sign }: { sign: Sign }) {
  const label = sign.name.length > 28 ? `${sign.name.slice(0, 28)}…` : sign.name;
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,.18),transparent_55%),linear-gradient(145deg,#0f172a,#020617)] shadow-2xl">
      <div className="absolute inset-5 rounded-[1.5rem] border border-white/5" />
      <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border-4 border-white/80 bg-slate-100 p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,.45)]">
        <div className="absolute inset-2 rounded-[1.5rem] border-4 border-slate-900/80" />
        <span className="relative z-10 text-sm font-black uppercase leading-tight text-slate-900">{label}</span>
      </div>
      <div className="absolute bottom-4 left-4 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">Illustration pédagogique</div>
    </div>
  );
}

export default function ImmersiveRoadSigns({ signs }: { signs: Sign[] }) {
  const [category, setCategory] = useState('all');
  const [index, setIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const categories = useMemo(() => ['all', ...Array.from(new Set(signs.map((s) => s.category).filter(Boolean)))], [signs]);
  const filtered = useMemo(() => category === 'all' ? signs : signs.filter((s) => s.category === category), [category, signs]);
  const active = filtered[index] ?? signs[0];
  const scene = scenes[sceneIndex];

  if (!active) return <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center text-slate-400">Aucun panneau disponible. Le catalogue sera enrichi après validation des sources.</div>;

  const moveSign = (delta: number) => setIndex((current) => (current + delta + filtered.length) % filtered.length);

  return (
    <section className="space-y-8" aria-label="Atlas immersif ADSO de signalisation routière">
      <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => { setCategory(item); setIndex(0); }} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${category === item ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]'}`}>{item === 'all' ? 'Tous' : item}</button>)}</div>

      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5"><SignGraphic sign={active} /><div className="mt-5 flex items-center justify-between"><button type="button" onClick={() => moveSign(-1)} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Panneau précédent"><ArrowLeft className="size-5" /></button><span className="text-xs text-slate-500">{index + 1} / {filtered.length}</span><button type="button" onClick={() => moveSign(1)} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Panneau suivant"><ArrowRight className="size-5" /></button></div></div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider"><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">{active.category}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-400">{active.applicability || 'common'}</span></div>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{active.name}</h2>
          <p className="mt-3 text-slate-300">{active.description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2 text-sm font-bold text-emerald-200"><Info className="size-4" /> Signification</div><p className="mt-2 text-sm leading-6 text-slate-400">{active.meaning}</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2 text-sm font-bold text-amber-200"><ShieldCheck className="size-4" /> Action conducteur</div><p className="mt-2 text-sm leading-6 text-slate-400">{active.useCase}</p></div></div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-emerald-300/10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,.12),transparent_55%),#020617] p-6 sm:p-8">
        <div className="flex items-center gap-3"><Eye className="size-5 text-emerald-300" /><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">ADSO Immersive Case Lab</p><h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Voir → décider → comprendre</h2></div></div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-64 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#172554_0%,#0f172a_45%,#111827_46%,#030712_100%)] p-6"><div className="absolute left-1/2 top-0 h-full w-28 -translate-x-1/2 -skew-x-6 bg-slate-700/70" /><div className="absolute bottom-5 left-1/2 h-20 w-2 -translate-x-1/2 border-x-2 border-dashed border-white/60" /><div className="relative flex h-full min-h-52 flex-col justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{scene.environment}</p><h3 className="mt-2 max-w-sm text-xl font-bold text-white">{scene.title}</h3></div><div className="self-end rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-xs font-semibold text-slate-200">Panneau : {scene.sign}</div></div></div>
          <div><p className="text-base leading-7 text-white">{scene.prompt}</p>{showAnswer ? <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5"><div className="flex items-center gap-2 font-bold text-emerald-200"><CheckCircle2 className="size-5" /> Décision recommandée</div><p className="mt-2 text-sm leading-6 text-emerald-50/80">{scene.answer}</p><p className="mt-3 text-xs text-amber-200">⚠️ Risque à éviter : {scene.risk}</p></div> : <button type="button" onClick={() => setShowAnswer(true)} className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500">Voir la correction</button>}<div className="mt-5 flex gap-2"><button type="button" onClick={() => { setSceneIndex((sceneIndex - 1 + scenes.length) % scenes.length); setShowAnswer(false); }} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Cas précédent"><ArrowLeft className="size-4" /></button><button type="button" onClick={() => { setSceneIndex((sceneIndex + 1) % scenes.length); setShowAnswer(false); }} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Cas suivant"><ArrowRight className="size-4" /></button></div></div>
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs leading-5 text-slate-500"><AlertTriangle className="size-4 shrink-0" /> Les règles juridictionnelles doivent être vérifiées dans la couche nationale applicable au pays sélectionné. Les scènes ci-dessus sont pédagogiques.</p>
    </section>
  );
}
