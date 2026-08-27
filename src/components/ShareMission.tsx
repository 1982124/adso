'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const MESSAGE = 'Je partage ADSO AFRICA parce qu’une connaissance peut éviter un accident, une blessure ou peut-être sauver une vie. Dans le monde, les traumatismes routiers sont la première cause de décès chez les 5–29 ans. Pour nos enfants, nos jeunes, nos apprentis, nos étudiants et toutes les personnes vulnérables sur nos routes africaines. La sécurité routière nous concerne tous. Une connaissance utile mérite d’être transmise pour sauver des vies et contribuer à réduire les chiffres. Moi, je partage ADSO. Et toi ? 🌍';
const SOURCE = 'Organisation mondiale de la Santé (OMS), Traumatismes dus aux accidents de la circulation, 20 juillet 2026';

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
  const [smartLink, setSmartLink] = useState('https://adso-safety.vercel.app/s/adso-africa');

  useEffect(() => {
    const slug = getOrCreateShareSlug();
    setSmartLink(`${window.location.origin}/s/${slug}`);
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
      await navigator.share({
        title: 'ADSO AFRICA — Une connaissance utile mérite d’être transmise',
        text: MESSAGE,
        url: smartLink,
      }).catch(() => undefined);
      return;
    }
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section aria-labelledby="share-mission-title" className="mt-5 overflow-hidden rounded-2xl border border-[#D7B45A]/25 bg-[#D7B45A]/[0.065] p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E4C878]">Une connaissance utile mérite d’être transmise</p>
          <h2 id="share-mission-title" className="mt-1 text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">Moi, je partage ADSO. Et toi ?</h2>
          <div className="mt-3 rounded-xl border border-white/10 bg-black/10 p-3">
            <p className="text-sm font-black leading-5 text-white sm:text-[15px]">Dans le monde, les traumatismes routiers sont la première cause de décès chez les 5–29 ans.</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-300 sm:text-sm">Je partage ADSO AFRICA parce qu’une connaissance peut éviter un accident, une blessure ou peut-être sauver une vie.</p>
            <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-200 sm:text-sm">Pour nos enfants, nos jeunes, nos apprentis, nos étudiants et toutes les personnes vulnérables sur nos routes africaines.</p>
          </div>
          <p className="mt-2 text-xs font-bold leading-5 text-[#E4C878]">Une connaissance utile mérite d’être transmise pour sauver des vies et contribuer à réduire les chiffres.</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">Source : {SOURCE}.</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
          <button type="button" onClick={share} className="inline-flex min-h-10 items-center rounded-xl bg-[#D7B45A] px-4 py-2 text-xs font-extrabold text-[#0B1F33] hover:bg-[#E4C878]"><Share2 className="mr-2 size-4" /> Partager ADSO</button>
          <button type="button" onClick={copy} className="inline-flex min-h-10 items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">{copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}{copied ? 'Message + lien copiés' : 'Copier le message + lien'}</button>
        </div>
      </div>
    </section>
  );
}
