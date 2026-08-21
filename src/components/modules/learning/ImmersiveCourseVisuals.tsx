'use client';

import Link from 'next/link';

type SceneKey =
  | 'school-zone'
  | 'crossing'
  | 'helmet'
  | 'moto-passenger'
  | 'junction'
  | 'priority'
  | 'distraction'
  | 'overtake'
  | 'blindspot'
  | 'rain'
  | 'night'
  | 'bus-stop';

type Scene = {
  icon: string;
  title: string;
  text: string;
  scene: SceneKey;
};

const scenes: readonly Scene[] = [
  { icon: '🏫', title: 'Zone scolaire', text: 'Repérer le panneau, ralentir et anticiper une traversée imprévisible.', scene: 'school-zone' },
  { icon: '🚸', title: 'Traversée d’élève', text: 'Observer le piéton avant qu’il ne s’engage sur la chaussée.', scene: 'crossing' },
  { icon: '⛑️', title: 'Casque à moto', text: 'Comprendre pourquoi le casque doit devenir un réflexe, pas une option.', scene: 'helmet' },
  { icon: '🏍️', title: 'Passager à moto', text: 'Choisir une conduite sûre quand une personne monte derrière soi.', scene: 'moto-passenger' },
  { icon: '🚦', title: 'Intersection', text: 'Lire les flux et décider avant de franchir un carrefour.', scene: 'junction' },
  { icon: '↔️', title: 'Priorité', text: 'Identifier qui doit céder le passage et pourquoi.', scene: 'priority' },
  { icon: '📱', title: 'Distraction', text: 'Mesurer la perte d’attention provoquée par un téléphone.', scene: 'distraction' },
  { icon: '↗️', title: 'Dépassement', text: 'Évaluer visibilité, distance et espace avant de dépasser.', scene: 'overtake' },
  { icon: '👀', title: 'Angle mort', text: 'Apprendre à vérifier ce que le rétroviseur ne montre pas.', scene: 'blindspot' },
  { icon: '🌧️', title: 'Pluie', text: 'Adapter vitesse, distance et trajectoire quand l’adhérence baisse.', scene: 'rain' },
  { icon: '🌙', title: 'Conduite de nuit', text: 'Voir, être vu et conserver une marge de sécurité.', scene: 'night' },
  { icon: '🚌', title: 'Arrêt de bus', text: 'Anticiper les piétons qui surgissent derrière un véhicule arrêté.', scene: 'bus-stop' },
];

function RoadScene({ scene }: { scene: SceneKey }) {
  const night = scene === 'night';
  const rain = scene === 'rain';
  const school = scene === 'school-zone' || scene === 'crossing' || scene === 'bus-stop';
  const moto = scene === 'helmet' || scene === 'moto-passenger' || scene === 'blindspot';
  const junction = scene === 'junction' || scene === 'priority' || scene === 'overtake';
  const danger = scene === 'distraction' || scene === 'blindspot';
  const sky = night ? '#07111f' : rain ? '#607080' : '#b9dded';

  return (
    <svg viewBox="0 0 640 300" role="img" aria-label={`Illustration immersive : ${scene}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky} /><stop offset="1" stopColor={night ? '#172554' : '#e9dcc5'} /></linearGradient>
        <linearGradient id={`road-${scene}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#475569" /><stop offset="1" stopColor="#111827" /></linearGradient>
        <linearGradient id={`moto-${scene}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#facc15" /><stop offset="0.5" stopColor="#d97706" /><stop offset="1" stopColor="#78350f" /></linearGradient>
        <filter id={`shadow-${scene}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity=".35" /></filter>
      </defs>

      <rect width="640" height="300" fill={`url(#sky-${scene})`} />
      <circle cx={night ? 520 : 92} cy="48" r="25" fill={night ? '#e2e8f0' : '#fff1b8'} opacity=".9" />
      <path d="M0 150 Q110 125 220 150 T440 150 T640 145 V190 H0Z" fill={night ? '#0f172a' : '#14532d'} opacity=".9" />

      {school && <g transform="translate(40 75)"><rect x="0" y="35" width="150" height="90" rx="5" fill="#f5e5c5" /><path d="M-8 35 L75 -5 L158 35Z" fill="#a16207" /><rect x="18" y="60" width="30" height="65" fill="#0f766e" /><rect x="65" y="60" width="30" height="28" fill="#93c5fd" /><rect x="108" y="60" width="25" height="28" fill="#93c5fd" /><text x="75" y="52" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">ÉCOLE</text></g>}

      <path d="M0 178 L640 178 L640 300 L0 300Z" fill={`url(#road-${scene})`} />
      <path d="M280 178 L360 178 L445 300 L195 300Z" fill="#334155" opacity=".8" />
      <path d="M317 188 L328 188 L342 214 L328 214Z M320 228 L337 228 L356 262 L332 262Z M337 280 L370 280 L380 300 L345 300Z" fill="#f8fafc" opacity=".85" />

      {(scene === 'crossing' || scene === 'school-zone' || scene === 'bus-stop') && <g opacity=".95">{[0,1,2,3,4].map((i) => <path key={i} d={`M220 ${212 + i * 14} L410 ${212 + i * 14} L416 ${222 + i * 14} L214 ${222 + i * 14}Z`} fill="#f8fafc" />)}</g>}

      {school && <g transform="translate(470 78)"><rect x="0" y="25" width="8" height="92" rx="4" fill="#334155" /><path d="M4 10 L-20 50 H28 Z" fill="#ef4444" stroke="#f8fafc" strokeWidth="3" /><circle cx="4" cy="43" r="12" fill="#fff" /><path d="M4 39 L4 52 M-3 46 L11 46" stroke="#334155" strokeWidth="3" /></g>}

      {(junction || scene === 'school-zone') && <g transform="translate(540 70)"><rect x="0" y="0" width="9" height="108" rx="4" fill="#0f172a" /><circle cx="4.5" cy="18" r="15" fill="#ef4444" /><circle cx="4.5" cy="54" r="15" fill="#fbbf24" /><circle cx="4.5" cy="90" r="15" fill="#22c55e" /></g>}

      {scene === 'bus-stop' && <g transform="translate(370 122)"><rect width="110" height="55" rx="10" fill="#f8fafc" /><rect x="12" y="10" width="30" height="20" rx="3" fill="#93c5fd" /><rect x="48" y="10" width="30" height="20" rx="3" fill="#93c5fd" /><circle cx="22" cy="56" r="9" fill="#111827" /><circle cx="88" cy="56" r="9" fill="#111827" /></g>}

      {moto && <g filter={`url(#shadow-${scene})`} transform="translate(300 160)"><circle cx="-45" cy="65" r="18" fill="#111827" /><circle cx="52" cy="65" r="18" fill="#111827" /><path d="M-43 48 Q-12 25 18 43 L45 48 Q48 53 42 57 L-42 57Z" fill={`url(#moto-${scene})`} /><path d="M-5 38 L18 8 L33 8 L42 46" fill="none" stroke="#111827" strokeWidth="8" strokeLinecap="round" /><circle cx="15" cy="-2" r="15" fill="#6b3f2a" /><path d="M0 -5 Q15 -28 30 -5" fill="#111827" stroke="#facc15" strokeWidth="4" />{scene === 'moto-passenger' && <g transform="translate(42 -2)"><circle cx="15" cy="-2" r="14" fill="#70412b" /><path d="M1 -4 Q15 -22 29 -4" fill="#111827" stroke="#facc15" strokeWidth="3" /><path d="M5 10 L27 43" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" /></g>}</g>}

      {!moto && <g filter={`url(#shadow-${scene})`} transform="translate(290 175)"><path d="M-46 38 Q-42 10 -18 4 L22 4 Q45 10 50 38 L43 61 Q39 68 27 68 H-29 Q-41 68 -45 61Z" fill="#059669" /><path d="M-24 10 L-8 -8 H17 L35 10Z" fill="#0f172a" opacity=".9" /><path d="M-17 8 L-6 -3 H5 V8Z M9 8 V-3 H16 L29 8Z" fill="#93c5fd" opacity=".85" /><circle cx="-29" cy="60" r="11" fill="#020617" /><circle cx="33" cy="60" r="11" fill="#020617" /></g>}

      {(scene === 'crossing' || scene === 'school-zone') && <g transform="translate(430 168)"><circle cx="0" cy="0" r="11" fill="#6b3f2a" /><path d="M0 12 L-8 43 M0 12 L12 43 M0 20 L-17 28 M0 20 L17 28" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" /><circle cx="0" cy="-1" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" opacity=".9" /></g>}

      {danger && <g transform="translate(455 90)"><rect width="130" height="42" rx="21" fill="#7f1d1d" opacity=".9" /><text x="65" y="27" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">DANGER À OBSERVER</text></g>}
      {scene === 'distraction' && <g transform="translate(320 120)"><rect width="48" height="78" rx="8" fill="#020617" stroke="#f8fafc" strokeWidth="3" /><circle cx="24" cy="64" r="4" fill="#22c55e" /><path d="M10 12 H38" stroke="#94a3b8" strokeWidth="3" /></g>}
      {rain && <g opacity=".5">{Array.from({ length: 42 }, (_, i) => <path key={i} d={`M${(i * 73) % 640} ${(i * 29) % 170} l-10 28`} stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />)}</g>}
      {night && <g><path d="M280 188 L250 265 M360 188 L420 265" stroke="#fef3c7" strokeWidth="12" opacity=".18" /><circle cx="520" cy="205" r="38" fill="#fde68a" opacity=".08" /></g>}

      <g transform="translate(24 22)"><rect width="205" height="30" rx="15" fill="#020617" opacity=".72" /><circle cx="18" cy="15" r="6" fill="#34d399" /><text x="34" y="20" fill="#fff" fontSize="13" fontWeight="700">ADSO · SCÈNE PÉDAGOGIQUE</text></g>
    </svg>
  );
}

export default function ImmersiveCourseVisuals() {
  return (
    <section aria-labelledby="immersive-course-visuals" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Bibliothèque ADSO Immersif</p><h3 id="immersive-course-visuals" className="mt-1 text-xl font-black text-white">12 situations prioritaires pour apprendre par la décision</h3><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">Chaque scène prépare un futur parcours scène → question → décision → conséquence → explication → exercice → score → compétence.</p></div>
        <span className="rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">12 / bibliothèque en expansion</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenes.map(({ icon, title, text, scene }) => (
          <Link key={scene} href="/formation/immersive" className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 transition hover:-translate-y-0.5 hover:border-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <div className="relative h-36 overflow-hidden border-b border-white/10 bg-slate-950"><RoadScene scene={scene} /><span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs backdrop-blur" aria-hidden="true">{icon}</span></div>
            <div className="px-3 pb-3 pt-3"><h4 className="text-sm font-semibold text-white">{title}</h4><p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p><span className="mt-2 inline-flex text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">Voir la scène →</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
