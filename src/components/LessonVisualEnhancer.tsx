'use client';

import { useEffect } from 'react';

const REAL_VISUALS = [
  { match: /école|élève|enfant|piéton|passage/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_la_descente_de_l%27%C3%A9cole.jpg', label: 'Photographie réelle : enfants et traversée à la sortie d’une école au Sénégal.' },
  { match: /moto|motocycl|taxi-moto/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_%C3%A0_l%27%C3%A9cole_Notre_Dame_Cotonou.jpg', label: 'Photographie réelle : taxi-motos devant une école à Cotonou, Bénin.' },
  { match: /carrefour|intersection|giratoire|rond-point/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_et_clients_sur_le_boulevard_Saint-Michel_%C3%A0_Cotonou_au_B%C3%A9nin.jpg', label: 'Photographie réelle : circulation et interactions entre usagers à Cotonou.' },
  { match: /transport|enfants.*moto|élèves.*moto/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Getting_the_Children_to_School_on_time.jpg', label: 'Photographie réelle : transport d’enfants à moto au Togo.' },
];

const DIAGRAMS = [
  { match: /panneau|signalisation|stop|cédez|priorité|sens interdit|limitation/i, kind: 'sign', label: 'Illustration pédagogique : reconnaître un panneau puis adapter son comportement.' },
  { match: /feu|rouge|orange|vert/i, kind: 'lights', label: 'Illustration pédagogique : le feu indique quand s’arrêter, attendre ou avancer.' },
  { match: /distance|frein|arrêt|vitesse/i, kind: 'distance', label: 'Illustration pédagogique : plus la vitesse augmente, plus la distance nécessaire pour s’arrêter augmente.' },
  { match: /angle mort|visibilité/i, kind: 'blind', label: 'Illustration pédagogique : certaines zones autour d’un véhicule peuvent être invisibles au conducteur.' },
  { match: /téléphone|distraction/i, kind: 'phone', label: 'Illustration pédagogique : regarder son téléphone détourne l’attention de la route.' },
  { match: /pluie|nuit|visibilité faible|météo/i, kind: 'weather', label: 'Illustration pédagogique : pluie ou nuit réduisent la visibilité et demandent davantage d’anticipation.' },
  { match: /casque|sécurité/i, kind: 'helmet', label: 'Illustration pédagogique : un casque correctement porté protège la tête du conducteur ou du passager.' },
];

function visualFor(title: string) {
  return REAL_VISUALS.find((item) => item.match.test(title)) ?? null;
}

function diagramFor(title: string) {
  return DIAGRAMS.find((item) => item.match.test(title)) ?? DIAGRAMS[0];
}

function diagramMarkup(kind: string) {
  const common = 'width="100%" height="100%" viewBox="0 0 800 450" role="img"';
  if (kind === 'lights') return `<svg ${common} aria-label="Feu tricolore et décision de conduite"><rect width="800" height="450" fill="#0f172a"/><rect x="360" y="55" width="80" height="250" rx="22" fill="#334155"/><circle cx="400" cy="105" r="25" fill="#ef4444"/><circle cx="400" cy="180" r="25" fill="#f59e0b"/><circle cx="400" cy="255" r="25" fill="#22c55e"/><path d="M100 360H700" stroke="#94a3b8" stroke-width="8"/><path d="M140 390h120M420 390h120" stroke="#f8fafc" stroke-width="10"/></svg>`;
  if (kind === 'distance') return `<svg ${common} aria-label="Deux véhicules et distance de sécurité"><rect width="800" height="450" fill="#0f172a"/><path d="M70 340H730" stroke="#64748b" stroke-width="80"/><rect x="145" y="300" width="150" height="70" rx="18" fill="#2563eb"/><rect x="505" y="300" width="150" height="70" rx="18" fill="#ef4444"/><path d="M320 335H480" stroke="#22c55e" stroke-width="14" stroke-dasharray="20 12"/><text x="400" y="250" text-anchor="middle" fill="#bbf7d0" font-size="28" font-weight="700">DISTANCE DE SÉCURITÉ</text></svg>`;
  if (kind === 'blind') return `<svg ${common} aria-label="Zone d'angle mort autour d'un véhicule"><rect width="800" height="450" fill="#0f172a"/><rect x="270" y="150" width="260" height="150" rx="35" fill="#475569"/><circle cx="310" cy="320" r="28" fill="#22c55e"/><circle cx="490" cy="320" r="28" fill="#22c55e"/><path d="M150 110L270 180M650 110L530 180" stroke="#ef4444" stroke-width="35" opacity=".65"/><text x="400" y="90" text-anchor="middle" fill="#fecaca" font-size="28" font-weight="700">ANGLE MORT</text></svg>`;
  if (kind === 'phone') return `<svg ${common} aria-label="Conducteur distrait par son téléphone"><rect width="800" height="450" fill="#0f172a"/><path d="M100 350H700" stroke="#64748b" stroke-width="70"/><circle cx="400" cy="190" r="80" fill="#d4d4d8"/><rect x="365" y="245" width="70" height="120" rx="20" fill="#2563eb"/><rect x="500" y="155" width="70" height="120" rx="10" fill="#111827" stroke="#f59e0b" stroke-width="8"/><path d="M455 210L500 190" stroke="#f59e0b" stroke-width="10"/><text x="400" y="80" text-anchor="middle" fill="#fde68a" font-size="28" font-weight="700">REGARDER LA ROUTE</text></svg>`;
  if (kind === 'helmet') return `<svg ${common} aria-label="Casque correctement porté"><rect width="800" height="450" fill="#0f172a"/><circle cx="400" cy="225" r="95" fill="#d4d4d8"/><path d="M305 220Q400 100 495 220Z" fill="#22c55e"/><path d="M400 315V350" stroke="#22c55e" stroke-width="14"/><path d="M350 345Q400 380 450 345" stroke="#22c55e" stroke-width="14" fill="none"/><text x="400" y="75" text-anchor="middle" fill="#bbf7d0" font-size="28" font-weight="700">CASQUE BIEN ATTACHÉ</text></svg>`;
  if (kind === 'weather') return `<svg ${common} aria-label="Conduite avec pluie et visibilité réduite"><rect width="800" height="450" fill="#0f172a"/><path d="M0 330Q200 250 400 330T800 330V450H0Z" fill="#334155"/><path d="M200 70L160 150M300 60L260 140M400 70L360 150M500 60L460 140M600 70L560 150" stroke="#60a5fa" stroke-width="14"/><rect x="330" y="245" width="140" height="70" rx="15" fill="#e2e8f0"/><circle cx="355" cy="320" r="15" fill="#f8fafc"/><circle cx="445" cy="320" r="15" fill="#f8fafc"/><text x="400" y="205" text-anchor="middle" fill="#bfdbfe" font-size="28" font-weight="700">VISIBILITÉ RÉDUITE</text></svg>`;
  return `<svg ${common} aria-label="Panneau STOP et véhicule arrêté"><rect width="800" height="450" fill="#0f172a"/><path d="M80 350H720" stroke="#64748b" stroke-width="80"/><polygon points="400,65 465,90 490,155 465,220 400,245 335,220 310,155 335,90" fill="#dc2626" stroke="#fff" stroke-width="8"/><text x="400" y="170" text-anchor="middle" fill="white" font-size="34" font-weight="800">STOP</text><rect x="585" y="295" width="110" height="55" rx="12" fill="#2563eb"/><text x="640" y="280" text-anchor="middle" fill="#bbf7d0" font-size="20">ARRÊTER</text></svg>`;
}

function enhance() {
  document.querySelectorAll<HTMLElement>('.fixed.inset-0.z-\\[100\\]').forEach((reader) => {
    const main = reader.querySelector('main');
    if (!main || main.querySelector('[data-adso-lesson-visual]')) return;
    const heading = reader.querySelector('h2')?.textContent?.trim() || 'Leçon de sécurité routière';
    if (main.querySelector('figure')) return;
    const real = visualFor(heading);
    const diagram = diagramFor(heading);
    const figure = document.createElement('figure');
    figure.setAttribute('data-adso-lesson-visual', 'true');
    figure.className = 'mb-7 overflow-hidden rounded-2xl border border-emerald-900/50 bg-slate-900 shadow-lg';
    if (real) {
      figure.innerHTML = `<div class="aspect-[16/9] overflow-hidden bg-slate-950"><img src="${real.src}" alt="${real.label}" class="h-full w-full object-cover" loading="eager" decoding="async" referrerpolicy="no-referrer" /></div><figcaption class="px-4 py-3 text-sm font-semibold text-emerald-100">${real.label}</figcaption>`;
    } else {
      figure.innerHTML = `<div class="aspect-[16/9] overflow-hidden bg-slate-950">${diagramMarkup(diagram.kind)}</div><figcaption class="px-4 py-3 text-sm font-semibold text-emerald-100">${diagram.label}</figcaption>`;
    }
    main.prepend(figure);
  });
}

export default function LessonVisualEnhancer() {
  useEffect(() => {
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
