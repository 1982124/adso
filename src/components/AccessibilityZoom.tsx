'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus, RotateCcw, ZoomIn } from 'lucide-react';

const STORAGE_KEY = 'adso-font-scale';
const MIN = 1;
const MAX = 1.5;
const STEP = 0.1;

function clamp(value: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(value * 10) / 10));
}

export function AccessibilityZoom() {
  const [scale, setScale] = useState(MIN);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved >= MIN && saved <= MAX) setScale(clamp(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--adso-font-scale', String(scale));
    document.documentElement.dataset.fontScale = String(scale);
    window.localStorage.setItem(STORAGE_KEY, String(scale));
  }, [scale]);

  const update = (next: number) => setScale(clamp(next));

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-2xl border border-white/15 bg-slate-950/95 p-1.5 text-white shadow-2xl backdrop-blur-md print:hidden"
      aria-label="Taille du texte ADSO"
    >
      <div className="hidden items-center gap-1 px-2 text-xs font-semibold sm:flex">
        <ZoomIn className="size-4 text-cyan-300" aria-hidden="true" />
        <span>Texte</span>
      </div>
      <button
        type="button"
        onClick={() => update(scale - STEP)}
        disabled={scale <= MIN}
        className="flex size-9 items-center justify-center rounded-xl transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Réduire la taille du texte"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-12 text-center text-xs font-bold tabular-nums" aria-live="polite">
        {Math.round(scale * 100)}%
      </span>
      <button
        type="button"
        onClick={() => update(scale + STEP)}
        disabled={scale >= MAX}
        className="flex size-9 items-center justify-center rounded-xl transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Augmenter la taille du texte"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => update(MIN)}
        disabled={scale === MIN}
        className="flex size-9 items-center justify-center rounded-xl transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Réinitialiser la taille du texte"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
