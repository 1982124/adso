'use client';

import { BookOpen, CarFront, Sparkles, BarChart3, Share2 } from 'lucide-react';
import { useViewStore, type LearningTab } from '@/stores/view-store';

type Action = { label: string; icon: typeof BookOpen; tab: LearningTab };

const actions: Action[] = [
  { tab: 'cours', label: 'Cours', icon: BookOpen },
  { tab: 'signalisation', label: 'Panneaux', icon: CarFront },
  { tab: 'exercices', label: 'Scènes', icon: Sparkles },
  { tab: 'progression', label: 'Progression', icon: BarChart3 },
];

export function ADSOQuickActions() {
  const setView = useViewStore((state) => state.setView);
  const setLearningTab = useViewStore((state) => state.setLearningTab);

  const openLearning = (tab: LearningTab) => {
    setLearningTab(tab);
    setView('learning');
  };

  const share = async () => {
    const data = {
      title: 'ADSO — La responsabilité au service de la vie',
      text: 'Découvrez ADSO : apprendre, comprendre et agir pour une mobilité plus sûre. Chaque vie est précieuse.',
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else await navigator.clipboard?.writeText(`${data.text} ${data.url}`);
  };

  return (
    <nav aria-label="Accès rapide ADSO" data-tts-ignore="true" className="fixed bottom-4 left-4 z-[9998] print:hidden max-w-[calc(100vw-6rem)]">
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-slate-700/80 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-xl">
        {actions.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            type="button"
            onClick={() => openLearning(tab)}
            title={label}
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-semibold text-slate-300 transition hover:bg-emerald-500/15 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <Icon className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        <button type="button" onClick={share} title="Partager ADSO" className="flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300">
          <Share2 className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Partager</span>
        </button>
      </div>
    </nav>
  );
}
