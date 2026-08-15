'use client';

import { FormEvent, useState } from 'react';

export default function LeadCaptureForm({ offer = 'Découverte', source = 'offers' }: { offer?: string; source?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('loading');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, offer, source, consent: form.get('consent') === 'on' }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');
      setState('success');
      setMessage('Merci. Votre demande est enregistrée. Un conseiller ADSO pourra vous recontacter.');
      event.currentTarget.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer la demande.');
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Demande d'information ADSO">
      <input name="name" required placeholder="Nom complet" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50" />
      <input name="email" type="email" required placeholder="E-mail" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50" />
      <input name="phone" placeholder="Téléphone / WhatsApp (optionnel)" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50" />
      <input name="country" placeholder="Pays" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50" />
      <label className="sm:col-span-2 flex items-start gap-3 text-xs leading-5 text-slate-400"><input name="consent" type="checkbox" required className="mt-1" /> J'accepte qu'ADSO utilise ces coordonnées pour répondre à ma demande et assurer le suivi commercial de cette offre.</label>
      <button disabled={state === 'loading'} className="sm:col-span-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60">{state === 'loading' ? 'Enregistrement…' : 'Être accompagné →'}</button>
      {message && <p className={`sm:col-span-2 text-sm ${state === 'error' ? 'text-red-300' : 'text-emerald-300'}`} role="status">{message}</p>}
    </form>
  );
}
