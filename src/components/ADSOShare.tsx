'use client';

import { useState } from 'react';
import { Check, Copy, Facebook, Linkedin, MessageCircle, Send, Share2 } from 'lucide-react';

const SHARE_TEXT = 'ADSO — Une route peut changer une vie. Apprenons à la protéger. Pour en savoir plus sur ADSO, cliquez ici…';

export default function ADSOShare({ campaignSlug = 'adso' }: { campaignSlug?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/s/${encodeURIComponent(campaignSlug)}`
    : '';
  const fullMessage = `${SHARE_TEXT}\n${shareUrl}`;
  const encodedText = encodeURIComponent(SHARE_TEXT);
  const encodedUrl = encodeURIComponent(shareUrl);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  async function nativeShare() {
    if (!navigator.share) return copyLink();
    await navigator.share({ title: 'ADSO — Une route peut changer une vie', text: SHARE_TEXT, url: shareUrl });
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-left backdrop-blur-sm" aria-label="Partager ADSO">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-white"><Share2 className="size-4 text-emerald-300" /> Partager ADSO</p>
          <p className="mt-1 text-sm leading-6 text-emerald-100/70">Le partage ouvre directement une conversation avec Françoise.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={nativeShare} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500"><Send className="size-4" /> Partager</button>
          <a href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10"><MessageCircle className="size-4" /> WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10"><Facebook className="size-4" /> Facebook</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10"><Linkedin className="size-4" /> LinkedIn</a>
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10"><Send className="size-4" /> Telegram</a>
          <button onClick={copyLink} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10">{copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Copié' : 'Copier'}</button>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-black/20 px-4 py-3 text-xs leading-5 text-emerald-50/70">{fullMessage}</p>
    </div>
  );
}
