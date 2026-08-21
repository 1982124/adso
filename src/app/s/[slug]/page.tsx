'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

const campaignCopy: Record<string, { title: string; intro: string }> = {
  'accident-eleve': {
    title: 'Cette scène aurait-elle pu être évitée ?',
    intro: 'Vous venez de découvrir une scène de sensibilisation ADSO autour d’un élève, d’une moto et d’une traversée près d’une école. Parlons-en avec Françoise.',
  },
  'education-routiere': {
    title: 'Apprendre à mieux partager la route',
    intro: 'Vous venez de découvrir ADSO grâce à un partage consacré à l’éducation routière. Françoise peut vous montrer par où commencer.',
  },
};

type Message = { role: 'user' | 'assistant'; content: string };

export default function SmartLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('adso');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  useMemo(() => {
    params.then((value) => setSlug(value.slug || 'adso'));
  }, [params]);

  const copy = campaignCopy[slug] || {
    title: 'Une route peut changer une vie. Apprenons à la protéger.',
    intro: 'Vous venez de découvrir ADSO depuis un partage. Françoise peut vous présenter l’expérience et vous orienter vers le parcours qui vous correspond.',
  };

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    const nextMessages: Message[] = [...messages, { role: 'user', content: message }];
    setMessages(nextMessages);
    setInput('');
    setStarted(true);
    setLoading(true);
    try {
      const response = await fetch('/api/smart-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, slug, history: messages }),
      });
      const data = await response.json();
      setMessages([...nextMessages, {
        role: 'assistant',
        content: data.reply || data.fallback || 'Je peux vous guider vers ADSO. Commencez par me dire ce que vous souhaitez apprendre ou protéger.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
        <header className="border-b border-white/10 p-6 sm:p-8">
          <div className="mb-4 text-sm font-semibold tracking-[0.2em] text-emerald-300">ADSO SAFETY · DÉCOUVERTE</div>
          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">{copy.intro}</p>
        </header>

        <section className="flex-1 space-y-5 p-5 sm:p-8" aria-label="Conversation avec Françoise">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="font-bold text-emerald-200">Françoise est prête.</p>
              <p className="mt-2 text-sm leading-6 text-white/75">Posez-moi une question sur ADSO, l’éducation routière, les conducteurs responsables, les apprentis de tous secteurs, les écoles ou la prévention.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Pourquoi ADSO ?', 'Je veux protéger les élèves', 'Je veux apprendre', 'Je veux devenir conducteur responsable'].map((prompt) => (
                  <button key={prompt} type="button" onClick={() => { setInput(prompt); }} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10">{prompt}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === 'assistant' ? 'max-w-3xl rounded-2xl bg-emerald-400/10 p-4 text-white/90' : 'ml-auto max-w-2xl rounded-2xl bg-white/10 p-4 text-white'}>
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/45">{message.role === 'assistant' ? 'Françoise · ADSO' : 'Vous'}</div>
              <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
            </div>
          ))}

          {started && !loading && messages.some((message) => message.role === 'assistant') && (
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5">
              <p className="font-bold">Envie de continuer avec ADSO ?</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Créez votre compte gratuitement pour commencer votre parcours, retrouver votre progression et poursuivre votre expérience ADSO.</p>
              <Link href={`/inscription?from=${encodeURIComponent(`/s/${slug}`)}`} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 font-bold text-slate-950 hover:bg-emerald-400">Créer mon compte ADSO</Link>
            </div>
          )}
        </section>

        <form onSubmit={sendMessage} className="border-t border-white/10 p-4 sm:p-6">
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écrivez votre question à Françoise…" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/35" aria-label="Message à Françoise" />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">{loading ? '…' : 'Envoyer'}</button>
          </div>
          <p className="mt-2 text-center text-xs text-white/35">ADSO ne vous demandera jamais votre mot de passe dans cette conversation.</p>
        </form>
      </div>
    </main>
  );
}
