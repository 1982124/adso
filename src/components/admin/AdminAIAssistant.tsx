'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const prompts = [
  'Donne-moi l’état global d’ADSO et les 3 priorités du jour.',
  'Quels pays nécessitent le plus d’attention en matière de sécurité routière ?',
  'Analyse les abandons de formation et propose des actions.',
  'Quels indicateurs dois-je présenter à un partenaire institutionnel ?',
];

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
};

export default function AdminAIAssistant() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognition = useRef<RecognitionLike | null>(null);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    setVoiceSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
    return () => {
      recognition.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak(text: string) {
    if (!voiceReply || typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.documentElement.lang || 'fr-FR';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

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
      const nextReply = data.reply ?? '';
      setReply(nextReply);
      speak(nextReply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally { setLoading(false); }
  }

  function toggleListening() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError('La reconnaissance vocale n’est pas disponible dans ce navigateur. Utilisez le champ texte.');
      return;
    }
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const instance = new Recognition();
    instance.lang = document.documentElement.lang || 'fr-FR';
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) setQuestion(transcript);
    };
    instance.onerror = () => {
      setListening(false);
      setError('Je n’ai pas compris la commande vocale. Réessayez ou écrivez votre question.');
    };
    instance.onend = () => setListening(false);
    recognition.current = instance;
    setError('');
    setListening(true);
    instance.start();
  }

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6" aria-labelledby="adso-admin-ai-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-300">FRANÇOISE · ADSO AI EXECUTIVE</p>
          <h2 id="adso-admin-ai-title" className="mt-1 text-xl font-semibold">Assistante de Direction ADSO</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Texte ↔ texte, vocal ↔ vocal et vocal ↔ texte. Françoise analyse les données opérationnelles, pédagogiques et institutionnelles d’ADSO ; les actions sensibles restent soumises à validation humaine.</p>
        </div>
        <button type="button" onClick={() => setVoiceReply((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-200" aria-pressed={voiceReply}>
          {voiceReply ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Réponse vocale {voiceReply ? 'activée' : 'désactivée'}
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-xs leading-5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-slate-950">
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={ask} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input aria-label="Question à Françoise" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Écrivez votre question à Françoise…" className="min-h-11 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none focus:border-cyan-400/50" />
        <button type="button" onClick={toggleListening} disabled={!voiceSupported} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-slate-950 px-4 py-3 text-sm font-semibold text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50" aria-label={listening ? 'Arrêter le microphone' : 'Parler à Françoise'} title={!voiceSupported ? 'Reconnaissance vocale indisponible dans ce navigateur' : undefined}>
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {listening ? 'Écouter…' : 'Parler'}
        </button>
        <button type="submit" disabled={loading || !question.trim()} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">{loading ? 'Françoise réfléchit…' : 'Envoyer'}</button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      {reply && (
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/80 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-cyan-300">Réponse de Françoise</span>
            <button type="button" onClick={() => speak(reply)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300" aria-label="Lire la réponse de Françoise">
              <Volume2 className="h-3.5 w-3.5" /> Lire
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{reply}</div>
        </div>
      )}
    </section>
  );
}
