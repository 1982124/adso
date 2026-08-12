'use client';

import { FormEvent, useState } from 'react';

export default function AdminAIAssistant() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Erreur');
      setReply(data.reply ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally { setLoading(false); }
  }

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-300">ADSO Admin AI</p>
          <h2 className="mt-1 text-xl font-semibold">Assistant du cockpit</h2>
          <p className="mt-2 text-sm text-slate-400">Interrogez les données opérationnelles ADSO. Les actions sensibles restent soumises à validation humaine.</p>
        </div>
      </div>
      <form onSubmit={ask} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex. Quel est l’état actuel de la plateforme ?" className="min-h-11 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none focus:border-cyan-400/50" />
        <button disabled={loading || !question.trim()} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Analyse…' : 'Demander'}</button>
      </form>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {reply && <div className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-200">{reply}</div>}
    </section>
  );
}
