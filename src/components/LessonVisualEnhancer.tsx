'use client';

import { useEffect } from 'react';

const VISUALS = [
  { match: /panneau|signalisation|stop|cédez|priorité|sens interdit|limitation|danger/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/South_africa_stop_sign.png', label: 'Voir le panneau et comprendre le message routier.' },
  { match: /école|élève|enfant|piéton|passage/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_la_descente_de_l%27%C3%A9cole.jpg', label: 'Observer les personnes vulnérables et la traversée.' },
  { match: /moto|motocycl|taxi-moto|casque/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_%C3%A0_l%27%C3%A9cole_Notre_Dame_Cotonou.jpg', label: 'Observer la moto, le passager et l’environnement.' },
  { match: /carrefour|intersection|giratoire|rond-point|priorité/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taxi_moto_et_clients_sur_le_boulevard_Saint-Michel_%C3%A0_Cotonou_au_B%C3%A9nin.jpg', label: 'Observer les trajectoires et les interactions.' },
  { match: /vitesse|distance|frein|arrêt|danger/i, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Getting_the_Children_to_School_on_time.jpg', label: 'Observer le déplacement et anticiper le risque.' },
];

function visualFor(title: string) {
  return VISUALS.find((item) => item.match.test(title)) ?? VISUALS[3];
}

function enhance() {
  document.querySelectorAll<HTMLElement>('.fixed.inset-0.z-\\[100\\]').forEach((reader) => {
    const main = reader.querySelector('main');
    if (!main || main.querySelector('[data-adso-lesson-visual]')) return;
    const heading = reader.querySelector('h2')?.textContent?.trim() || 'Leçon de sécurité routière';
    if (main.querySelector('figure')) return;
    const visual = visualFor(heading);
    const figure = document.createElement('figure');
    figure.setAttribute('data-adso-lesson-visual', 'true');
    figure.className = 'mb-7 overflow-hidden rounded-2xl border border-emerald-900/50 bg-slate-900 shadow-lg';
    figure.innerHTML = `<div class="aspect-[16/9] overflow-hidden bg-slate-950"><img src="${visual.src}" alt="${visual.label}" class="h-full w-full object-cover" loading="eager" decoding="async" referrerpolicy="no-referrer" /></div><figcaption class="px-4 py-3 text-sm font-semibold text-emerald-100">${visual.label}</figcaption>`;
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
