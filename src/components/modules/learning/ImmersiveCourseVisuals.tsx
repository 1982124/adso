'use client';

import Link from 'next/link';

type SceneKey = 'crossing' | 'rain' | 'junction' | 'night';

const scenes: readonly [string, string, string, SceneKey][] = [
  ['🚸', 'Piéton & traversée', 'Observer, anticiper, décider.', 'crossing'],
  ['🌧️', 'Conduite sous la pluie', 'Adhérence, distance et visibilité.', 'rain'],
  ['🚦', 'Intersection & priorité', 'Lire la situation avant d’agir.', 'junction'],
  ['🌙', 'Conduite de nuit', 'Voir, être vu, adapter sa vitesse.', 'night'],
];

function RoadScene({ scene }: { scene: SceneKey }) {
  const night = scene === 'night';
  const rain = scene === 'rain';
  const junction = scene === 'junction';
  const crossing = scene === 'crossing';

  return (
    <svg viewBox="0 0 640 300" role="img" aria-label={`Illustration immersive : ${scene}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#07111f' : rain ? '#617080' : '#7dd3fc'} />
          <stop offset="1" stopColor={night ? '#172554' : '#dbeafe'} />
        </linearGradient>
        <linearGradient id={`road-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#475569" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id={`car-${scene}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.55" stopColor="#059669" />
          <stop offset="1" stopColor="#064e3b" />
        </linearGradient>
        <filter id={`shadow-${scene}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity=".35" />
        </filter>
      </defs>

      <rect width="640" height="300" fill={`url(#sky-${scene})`} />
      <circle cx={night ? 520 : 95} cy="55" r="28" fill={night ? '#e2e8f0' : '#fef3c7'} opacity=".9" />
      <path d="M0 150 Q110 125 220 150 T440 150 T640 145 V190 H0Z" fill={night ? '#0f172a' : '#14532d'} opacity=".9" />
      <path d="M0 178 L640 178 L640 300 L0 300Z" fill={`url(#road-${scene})`} />
      <path d="M280 178 L360 178 L445 300 L195 300Z" fill="#334155" opacity=".8" />
      <path d="M317 188 L328 188 L342 214 L328 214Z M320 228 L337 228 L356 262 L332 262Z M337 280 L370 280 L380 300 L345 300Z" fill="#f8fafc" opacity=".85" />

      {crossing && <g opacity=".95">
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M235 ${214 + i * 15} L410 ${214 + i * 15} L416 ${224 + i * 15} L229 ${224 + i * 15}Z`} fill="#f8fafc" />)}
        <circle cx="445" cy="165" r="12" fill="#f8fafc" /><circle cx="445" cy="188" r="9" fill="#f8fafc" />
        <path d="M445 198 L435 222 M445 198 L458 221 M445 205 L428 212 M445 205 L460 211" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
      </g>}

      {junction && <g>
        <path d="M70 190 H570" stroke="#f8fafc" strokeWidth="5" opacity=".8" />
        <path d="M140 190 V250 M205 190 V250 M270 190 V250 M335 190 V250 M400 190 V250 M465 190 V250" stroke="#f8fafc" strokeWidth="10" opacity=".75" />
        <rect x="520" y="72" width="10" height="105" rx="5" fill="#0f172a" />
        <circle cx="525" cy="90" r="15" fill="#ef4444" /><circle cx="525" cy="125" r="15" fill="#fbbf24" /><circle cx="525" cy="160" r="15" fill="#22c55e" />
      </g>}

      {rain && <g opacity=".5">
        {Array.from({ length: 42 }, (_, i) => <path key={i} d={`M${(i * 73) % 640} ${(i * 29) % 170} l-10 28`} stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />)}
        <path d="M160 292 Q320 265 480 292" stroke="#93c5fd" strokeWidth="5" opacity=".45" fill="none" />
      </g>}

      {night && <g>
        <path d="M280 188 L250 265 M360 188 L420 265" stroke="#fef3c7" strokeWidth="12" opacity=".18" />
        <circle cx="520" cy="205" r="38" fill="#fde68a" opacity=".08" />
      </g>}

      <g filter={`url(#shadow-${scene})`} transform="translate(275 176)">
        <path d="M-46 38 Q-42 10 -18 4 L22 4 Q45 10 50 38 L43 61 Q39 68 27 68 H-29 Q-41 68 -45 61Z" fill={`url(#car-${scene})`} />
        <path d="M-24 10 L-8 -8 H17 L35 10Z" fill="#0f172a" opacity=".9" />
        <path d="M-17 8 L-6 -3 H5 V8Z M9 8 V-3 H16 L29 8Z" fill="#93c5fd" opacity=".85" />
        <circle cx="-29" cy="60" r="11" fill="#020617" /><circle cx="33" cy="60" r="11" fill="#020617" />
        <circle cx="-29" cy="60" r="5" fill="#94a3b8" /><circle cx="33" cy="60" r="5" fill="#94a3b8" />
        <rect x="-46" y="38" width="8" height="9" rx="2" fill="#fef08a" /><rect x="42" y="38" width="8" height="9" rx="2" fill="#fef08a" />
      </g>

      <g transform="translate(24 22)">
        <rect width="150" height="30" rx="15" fill="#020617" opacity=".72" />
        <circle cx="18" cy="15" r="6" fill="#34d399" />
        <text x="34" y="20" fill="#fff" fontSize="13" fontWeight="700">SCÈNE 3D PÉDAGOGIQUE</text>
      </g>
    </svg>
  );
}

export default function ImmersiveCourseVisuals() {
  return (
    <section aria-labelledby="immersive-course-visuals" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Apprendre par la situation</p>
          <h3 id="immersive-course-visuals" className="mt-1 text-lg font-bold text-white">Scènes visuelles intégrées aux cours</h3>
          <p className="mt-1 text-xs text-slate-400">Observer une situation avant de mémoriser la règle.</p>
        </div>
        <span className="hidden rounded-full border border-emerald-700/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 sm:inline-flex">IMMERSION</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenes.map(([icon, title, text, scene]) => (
          <Link key={scene} href="/formation/immersive" className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 transition hover:-translate-y-0.5 hover:border-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <div className="relative h-36 overflow-hidden border-b border-white/10 bg-slate-950">
              <RoadScene scene={scene} />
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs backdrop-blur" aria-hidden="true">{icon}</span>
            </div>
            <div className="px-3 pb-3 pt-3">
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p>
              <span className="mt-2 inline-flex text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">Voir la scène →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
