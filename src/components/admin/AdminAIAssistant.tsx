'use client';

import { FormEvent, useState } from 'react';

const prompts = [
  'Donne-moi l’état global d’ADSO et les 3 priorités du jour.',
  'Quels pays nécessitent le plus d’attention en matière de sécurité routière ?',
  'Analyse les abandons de formation et propose des actions.',
  'Quels indicateurs dois-je présenter à un partenaire institutionnel ?',
];

export default function AdminAIAssistant() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(event?: FormEvent) {
    event?.preventDefault();
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
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6" aria-labelledby="adso-admin-ai-title">
      <div>
        <p className="text-sm font-medium text-cyan-300">ADSO Admin AI</p>
        <h2 id="adso-admin-ai-title" className="mt-1 text-xl font-semibold">Assistante de Direction ADSO</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Analysez les données opérationnelles, pédagogiques et institutionnelles d’ADSO. Les réponses doivent distinguer faits, sources, limites et recommandations ; les actions sensibles restent soumises à validation humaine.</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-xs leading-5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-slate-950">
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={ask} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input aria-label="Question à l’assistante de direction" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex. Quels sont les risques et priorités d’ADSO aujourd’hui ?" className="min-h-11 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none focus:border-cyan-400/50" />
        <button disabled={loading || !question.trim()} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Analyse…' : 'Analyser'}</button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      {reply && <div className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-200">{reply}</div>}
    </section>
  );
}
