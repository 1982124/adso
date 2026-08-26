'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ShareMission() {
  const [copied, setCopied] = useState(false);
  const smartLink = useMemo(() => {
    if (typeof window === 'undefined') return 'https://adso-safety.vercel.app/s/adso-africa';
    return `${window.location.origin}/s/adso-africa`;
  }, []);
  const message = 'Moi, je partage ADSO AFRICA pour contribuer à prévenir les accidents, les blessures et les décès sur nos routes, particulièrement chez les jeunes et les personnes vulnérables. Moi, je partage ADSO. Et toi ? 🌍';
  const encoded = encodeURIComponent(`${message}\n\n${smartLink}`);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${message}\n\n${smartLink}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'ADSO AFRICA', text: message, url: smartLink }).catch(() => undefined);
      return;
    }
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section aria-labelledby="share-mission-title" className="mt-8 rounded-2xl border border-[#D7B45A]/25 bg-[#D7B45A]/[0.07] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E4C878]">Une connaissance utile mérite d’être transmise</p>
          <h2 id="share-mission-title" className="mt-2 text-lg font-black text-white sm:text-xl">Moi, je partage ADSO. Et toi ?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Partagez la mission autour de vous pour contribuer à faire circuler des connaissances utiles sur la mobilité sûre.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={share} className="inline-flex min-h-11 items-center rounded-xl bg-[#D7B45A] px-4 py-2 text-sm font-extrabold text-[#0B1F33] transition hover:bg-[#E4C878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]"><Share2 className="mr-2 size-4" /> Partager pour sensibiliser</button>
          <button type="button" onClick={copy} className="inline-flex min-h-11 items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B45A]"><span>{copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}</span>{copied ? 'Lien copié' : 'Copier le smart link'}</button>
        </div>
      </div>
    </section>
  );
}
