'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ShareMission() {
  const [copied, setCopied] = useState(false);
  const smartLink = useMemo(() => typeof window === 'undefined' ? 'https://adso-safety.vercel.app/s/adso-africa' : `${window.location.origin}/s/adso-africa`, []);
  const message = 'Je partage ADSO AFRICA parce qu’une connaissance peut éviter un accident, une blessure ou peut-être sauver une vie. Pour nos enfants, nos jeunes, nos apprentis, nos étudiants et toutes les personnes vulnérables sur nos routes africaines. La sécurité routière nous concerne tous. Une connaissance utile mérite d’être transmise. Moi, je partage ADSO. Et toi ? 🌍';
  const encoded = encodeURIComponent(`${message}\n\n${smartLink}`);

  const copy = async () => {
    try { await navigator.clipboard.writeText(`${message}\n\n${smartLink}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const share = async () => {
    if (navigator.share) { await navigator.share({ title: 'ADSO AFRICA — Une connaissance utile mérite d’être transmise', text: message, url: smartLink }).catch(() => undefined); return; }
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section aria-labelledby="share-mission-title" className="mt-6 rounded-2xl border border-[#D7B45A]/25 bg-[#D7B45A]/[0.07] p-4 sm:p-5">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#E4C878]">Une connaissance utile mérite d’être transmise</p>
      <h2 id="share-mission-title" className="mt-1.5 text-lg font-black text-white sm:text-xl">Moi, je partage ADSO. Et toi ?</h2>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-300 sm:text-sm">Une connaissance peut éviter un accident, une blessure ou peut-être sauver une vie. Pour nos enfants, nos jeunes, nos apprentis, nos étudiants et toutes les personnes vulnérables sur nos routes africaines.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={share} className="inline-flex min-h-10 items-center rounded-xl bg-[#D7B45A] px-4 py-2 text-xs font-extrabold text-[#0B1F33] hover:bg-[#E4C878]"><Share2 className="mr-2 size-4" /> Partager ADSO</button>
        <button type="button" onClick={copy} className="inline-flex min-h-10 items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">{copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}{copied ? 'Smart link copié' : 'Copier le smart link'}</button>
      </div>
    </section>
  );
}
