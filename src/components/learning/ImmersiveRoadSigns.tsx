'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Eye, Info, ShieldCheck } from 'lucide-react';

type Sign = { id: string; category: string; subcategory?: string | null; name: string; description: string; meaning: string; useCase: string; shape?: string | null; colors?: unknown; applicability?: string };
type Scene = { title: string; environment: string; prompt: string; answer: string; sign: string; risk: string };

type Country = { code: string; label: string; note: string };
const COUNTRIES: Country[] = [
  { code: 'ALL', label: 'Afrique · socle commun', note: 'Référentiel commun à contextualiser selon le pays.' },
  { code: 'BJ', label: '🇧🇯 Bénin', note: 'Parcours national Bénin — à compléter avec les textes et panneaux officiels en vigueur.' },
  { code: 'ML', label: '🇲🇱 Mali', note: 'Parcours national Mali — à contextualiser selon la signalisation locale.' },
  { code: 'BF', label: '🇧🇫 Burkina Faso', note: 'Parcours national Burkina Faso.' },
  { code: 'CI', label: '🇨🇮 Côte d’Ivoire', note: 'Parcours national Côte d’Ivoire.' },
  { code: 'TG', label: '🇹🇬 Togo', note: 'Parcours national Togo.' },
  { code: 'SN', label: '🇸🇳 Sénégal', note: 'Parcours national Sénégal.' },
  { code: 'GH', label: '🇬🇭 Ghana', note: 'Parcours national Ghana.' },
  { code: 'NG', label: '🇳🇬 Nigeria', note: 'Parcours national Nigeria.' },
  { code: 'CM', label: '🇨🇲 Cameroun', note: 'Parcours national Cameroun.' },
  { code: 'KE', label: '🇰🇪 Kenya', note: 'Parcours national Kenya.' },
  { code: 'UG', label: '🇺🇬 Ouganda', note: 'Parcours national Ouganda.' },
];

const REAL_SIGN_FILES: Record<string, string> = {
  'STOP': 'Stop sign.svg',
  'Cédez le passage': 'Yield sign.svg',
  'Sens interdit': 'No entry sign.svg',
  'Limitation de vitesse': 'Speed limit 50 km-h.svg',
  'Stationnement interdit': 'No parking sign.svg',
  'Arrêt et stationnement interdits': 'No stopping sign.svg',
  'Interdiction de dépasser': 'No overtaking sign.svg',
  'Carrefour à sens giratoire': 'Roundabout.svg',
  'Passage de piétons': 'Pedestrian crossing.svg',
  'Enfants': 'Children crossing.svg',
  'Travaux': 'Road works.svg',
  'Chaussée glissante': 'Slippery road sign.svg',
  'Animaux sauvages': 'Wild animals sign.svg',
  'Feux de circulation': 'Traffic lights.svg',
  'Sens unique': 'One way traffic sign.svg',
  'Hôpital': 'Hospital sign.svg',
  'Parking': 'Parking sign.svg',
  'Piste cyclable': 'Cycle lane sign.svg',
  'Chaussée rétrécie': 'Road narrows sign.svg',
  'Chutes de pierres': 'Falling rocks sign.svg',
  'Croisement de routes': 'Crossroads sign.svg',
  'Danger général': 'Warning sign.svg',
};

const signImage = (name: string) => {
  const file = REAL_SIGN_FILES[name];
  return file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}` : null;
};

const scenes: Scene[] = [
  { title: 'Bénin · carrefour urbain et motos', environment: 'Cotonou · circulation mixte · journée', prompt: 'Un panneau de priorité apparaît alors qu’une moto et un véhicule arrivent sur la voie transversale. Quelle est votre première action ?', answer: 'Ralentir, observer les deux-roues et les autres trajectoires, puis appliquer la signalisation et la règle de priorité du pays.', sign: 'Priorité', risk: 'Entrée trop rapide face à un usager vulnérable' },
  { title: 'Bénin · enfant près de la chaussée', environment: 'Zone résidentielle · après-midi', prompt: 'Un enfant se rapproche du bord de la route pendant qu’un deux-roues passe. Que faites-vous ?', answer: 'Réduire l’allure, augmenter la marge de sécurité et être prêt à s’arrêter.', sign: 'Danger', risk: 'Sous-estimation d’un usager vulnérable' },
  { title: 'Route africaine sous forte pluie', environment: 'Route interurbaine · pluie intense', prompt: 'La visibilité baisse et l’eau recouvre une partie de la chaussée. Quelle adaptation est prioritaire ?', answer: 'Réduire la vitesse, augmenter la distance de sécurité et éviter les manœuvres brusques.', sign: 'Chaussée glissante', risk: 'Aquaplanage et perte de contrôle' },
  { title: 'Intersection · feu rouge', environment: 'Ville · carrefour signalé', prompt: 'Le feu passe au rouge pendant votre approche. Que devez-vous faire ?', answer: 'Arrêter le véhicule avant la ligne d’arrêt et attendre la phase autorisant le passage.', sign: 'Feux de circulation', risk: 'Franchissement d’un feu rouge' },
];

function TrafficLight() {
  const [phase, setPhase] = useState<'red' | 'amber' | 'green'>('red');
  useEffect(() => {
    const timer = window.setInterval(() => setPhase((p) => p === 'red' ? 'green' : p === 'green' ? 'amber' : 'red'), 3000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Simulation du cycle lumineux</div>
      <div className="mx-auto flex w-16 flex-col items-center gap-2 rounded-2xl border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl" aria-label={`Feu ${phase}`}>
        <span className={`h-8 w-8 rounded-full border border-white/10 ${phase === 'red' ? 'bg-red-500 shadow-[0_0_18px_rgba(239,68,68,.8)]' : 'bg-red-950'}`} />
        <span className={`h-8 w-8 rounded-full border border-white/10 ${phase === 'amber' ? 'bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,.8)]' : 'bg-amber-950'}`} />
        <span className={`h-8 w-8 rounded-full border border-white/10 ${phase === 'green' ? 'bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,.8)]' : 'bg-emerald-950'}`} />
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-white">{phase === 'red' ? 'ROUGE · ARRÊT' : phase === 'amber' ? 'ORANGE · VIGILANCE' : 'VERT · PASSAGE AUTORISÉ'}</p>
    </div>
  );
}

function SignGraphic({ sign }: { sign: Sign }) {
  const [failed, setFailed] = useState(false);
  const image = signImage(sign.name);
  if (image && !failed) {
    return (
      <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl">
        <img src={image} alt={`${sign.name} — visuel réel de référence`} className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
        <div className="absolute bottom-3 left-3 rounded-full border border-emerald-700/20 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">Visuel réel · Wikimedia Commons</div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden rounded-[2rem] border border-amber-300/10 bg-slate-950 p-6 text-center">
      <div><p className="text-sm font-bold text-amber-200">Visuel officiel à valider</p><p className="mt-2 text-xs leading-5 text-slate-400">Ce panneau est conservé dans le catalogue, mais ADSO ne fabrique pas une fausse illustration. Une source photographique ou réglementaire vérifiée doit être attachée avant publication.</p></div>
    </div>
  );
}

export default function ImmersiveRoadSigns({ signs }: { signs: Sign[] }) {
  const [country, setCountry] = useState('ALL');
  const [category, setCategory] = useState('all');
  const [index, setIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const categories = useMemo(() => ['all', ...Array.from(new Set(signs.map((s) => s.category).filter(Boolean)))], [signs]);
  const filtered = useMemo(() => category === 'all' ? signs : signs.filter((s) => s.category === category), [category, signs]);
  const active = filtered[index] ?? signs[0];
  const scene = scenes[sceneIndex];
  const selectedCountry = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

  if (!active) return <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center text-slate-400">Aucun panneau disponible.</div>;
  const moveSign = (delta: number) => setIndex((current) => (current + delta + filtered.length) % filtered.length);

  return (
    <section className="space-y-8" aria-label="Atlas immersif ADSO de signalisation routière">
      <div className="rounded-[2rem] border border-emerald-300/10 bg-emerald-400/[0.04] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Référentiel pays</p><h2 className="mt-2 text-xl font-black text-white">Une signalisation africaine contextualisée</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Le socle commun ne prétend pas remplacer les codes nationaux. Le Bénin est désormais un parcours de premier niveau et chaque pays peut recevoir sa couche réglementaire vérifiée.</p></div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Pays de référence">{COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}</select>
        </div>
        <p className="mt-3 text-xs text-emerald-100/70">{selectedCountry.note}</p>
      </div>

      <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => { setCategory(item); setIndex(0); }} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${category === item ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]'}`}>{item === 'all' ? 'Tous' : item}</button>)}</div>

      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5"><SignGraphic sign={active} /><div className="mt-5 flex items-center justify-between"><button type="button" onClick={() => moveSign(-1)} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Panneau précédent"><ArrowLeft className="size-5" /></button><span className="text-xs text-slate-500">{index + 1} / {filtered.length}</span><button type="button" onClick={() => moveSign(1)} className="rounded-xl border border-white/10 p-3 text-white hover:bg-white/5" aria-label="Panneau suivant"><ArrowRight className="size-5" /></button></div></div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider"><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">{active.category}</span><span className="rounded-full bg-white/5 px-3 py-1 text-slate-400">{active.applicability || 'socle commun'}</span></div>
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

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 sm:p-8"><div className="flex items-center gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Feux réels simulés</p><h2 className="mt-1 text-xl font-bold text-white">Le feu change réellement d’état</h2></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><TrafficLight /><div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm font-semibold text-white">Feu clignotant et phases lumineuses</p><p className="mt-2 text-sm leading-6 text-slate-400">ADSO ne présente plus un simple dessin statique pour l’apprentissage des feux : le cycle rouge → vert → orange est animé. Les variantes clignotantes et les règles précises restent contextualisées au pays sélectionné.</p></div></div></div>

      <p className="flex items-center gap-2 text-xs leading-5 text-slate-500"><AlertTriangle className="size-4 shrink-0" /> ADSO distingue désormais le socle commun, les parcours nationaux et les visuels de référence. Aucun panneau ne doit être présenté comme juridiquement identique dans tous les pays africains sans validation nationale.</p>
    </section>
  );
}
