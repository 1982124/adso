'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const MESSAGE = 'ADSO AFRICA est une plateforme numérique dédiée à l’éducation routière, à la formation à la mobilité et à la prévention. Elle propose des ressources pour mieux comprendre les risques et travailler les décisions qui contribuent à des déplacements plus sûrs. La sécurité routière concerne tous les usagers et nécessite des actions coordonnées, des règles appliquées et une évaluation rigoureuse.';
const SOURCE = 'Organisation mondiale de la Santé (OMS), fiche d’information sur les traumatismes dus aux accidents de la route';

function getOrCreateShareSlug() {
  const key = 'adso_share_id';
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
    const slug = `a-${id}`;
    window.localStorage.setItem(key, slug);
    return slug;
  } catch {
    return 'adso-africa';
  }
}

export default function ShareMission() {
  const [copied, setCopied] = useState(false);
  const [smartLink, setSmartLink] = useState('');

  useEffect(() => {
    const slug = getOrCreateShareSlug();
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    setSmartLink(`${baseUrl}/s/${slug}`);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${MESSAGE}\n\n${smartLink}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const share = async () => {
    const encoded = encodeURIComponent(`${MESSAGE}\n\n${smartLink}`);
    if (navigator.share) {
      await navigator.share({ title: 'ADSO AFRICA — Éducation et prévention routières', text: MESSAGE, url: smartLink }).catch(() => undefined);
      return;
    }
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section aria-labelledby="share-mission-title" className="mt-5 border-t border-white/20 py-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E4C878]">Faire connaître la prévention routière</p>
          <h2 id="share-mission-title" className="mt-2 text-xl font-bold text-white sm:text-2xl">Transmettre des ressources utiles à la sécurité routière.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{MESSAGE}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">Référence générale : {SOURCE}. Les contenus réglementaires doivent être vérifiés pour chaque pays.</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
          <button type="button" onClick={share} disabled={!smartLink} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#D7B45A] px-4 py-3 text-sm font-bold text-[#0B1F33] hover:bg-[#E4C878] disabled:cursor-not-allowed disabled:opacity-60"><Share2 className="size-4" aria-hidden="true" />Partager ADSO</button>
          <button type="button" onClick={copy} disabled={!smartLink} className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/25 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60">{copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}{copied ? 'Message copié' : 'Copier le message'}</button>
        </div>
      </div>
    </section>
  );
}
