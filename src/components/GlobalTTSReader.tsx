'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Pause, Play, Settings2, Square, Volume2, X } from 'lucide-react';

const STORAGE_KEY = 'adso-tts-preferences';
type Preferences = { enabled: boolean; rate: number; lang: string; voiceName: string };
type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
};

function cleanText(value: string) {
  return value.replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ').trim();
}

function getReadablePageText() {
  const root = document.querySelector('main') ?? document.body;
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script,style,noscript,svg,input,textarea,select,[aria-hidden="true"],[data-tts-ignore="true"],button,a').forEach((el) => el.remove());
  return cleanText(clone.innerText || clone.textContent || '');
}

function hasAnyCommand(command: string, aliases: string[]) {
  return aliases.some((alias) => command.includes(alias));
}

export function GlobalTTSReader() {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [prefs, setPrefs] = useState<Preferences>({ enabled: true, rate: 1, lang: 'fr-FR', voiceName: '' });
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const wasSpeakingBeforeListeningRef = useRef(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const recognitionSupported = typeof window !== 'undefined' && Boolean((window as RecognitionWindow).SpeechRecognition || (window as RecognitionWindow).webkitSpeechRecognition);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setPrefs((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
  }, []);

  const availableLanguages = useMemo(() => {
    const langs = new Set(voices.map((v) => v.lang).filter(Boolean));
    langs.add('fr-FR');
    langs.add('en-US');
    return Array.from(langs).sort();
  }, [voices]);

  const selectedVoice = voices.find((voice) => voice.name === prefs.voiceName)
    ?? voices.find((voice) => voice.lang === prefs.lang)
    ?? voices.find((voice) => voice.lang.startsWith(prefs.lang.split('-')[0]));

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  const pauseOrResume = useCallback(() => {
    if (!supported || !speaking) return;
    if (paused) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  }, [paused, speaking, supported]);

  const speak = useCallback((text: string) => {
    if (!supported || !prefs.enabled) return;
    const value = cleanText(text);
    if (!value) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = prefs.lang;
    utterance.rate = prefs.rate;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => { setSpeaking(true); setPaused(false); };
    utterance.onpause = () => setPaused(true);
    utterance.onresume = () => setPaused(false);
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utterance);
  }, [prefs, selectedVoice, supported]);

  const readPage = useCallback(() => {
    if (speaking) stop();
    else speak(getReadablePageText());
  }, [speak, speaking, stop]);

  const executeVoiceCommand = useCallback((rawCommand: string) => {
    const command = rawCommand.toLocaleLowerCase(prefs.lang.split('-')[0]);
    const isPause = hasAnyCommand(command, ['pause', 'pauser', 'pumzika', '暂停', '一時停止', 'pausar']);
    const isResume = hasAnyCommand(command, ['reprends', 'reprendre', 'continue', 'continuer', 'resume', 'weiter', 'continuar', 'continua', 'endelea', 'استمر', '继续', '続けて']);
    const isStop = hasAnyCommand(command, ['stop', 'arrête', 'arrêtez', 'silence', 'tais-toi', 'ne parle plus', 'parar', 'pare', 'stopp', 'simama', 'توقف', 'إيقاف', '停止', '止めて']);
    const isRestart = hasAnyCommand(command, ['recommence', 'recommencer', 'restart', 'relis', 'relire', 'reiniciar', 'recomeçar', 'neu starten', 'أعد', '重读', '読み直して']);
    const isRead = hasAnyCommand(command, ['lis', 'lire', 'read', 'lee', 'ler', 'lesen', 'soma', 'اقرأ', '阅读', '読んで']);

    if (isPause) {
      if (speaking && !paused) window.speechSynthesis.pause();
      return;
    }
    if (isResume) {
      if (speaking && paused) window.speechSynthesis.resume();
      return;
    }
    if (isStop) {
      stop();
      return;
    }
    if (isRestart) {
      stop();
      window.setTimeout(() => speak(getReadablePageText()), 50);
      return;
    }
    if (isRead) speak(getReadablePageText());
  }, [paused, prefs.lang, speaking, speak, stop]);

  const toggleVoiceCommands = useCallback(() => {
    if (!recognitionSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognitionCtor = (window as RecognitionWindow).SpeechRecognition || (window as RecognitionWindow).webkitSpeechRecognition;
    if (!recognitionCtor) return;
    const recognition = new recognitionCtor();
    recognition.lang = prefs.lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    wasSpeakingBeforeListeningRef.current = speaking;
    if (speaking && !paused) window.speechSynthesis.pause();
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      executeVoiceCommand(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    try { recognition.start(); } catch { setListening(false); }
  }, [executeVoiceCommand, listening, paused, prefs.lang, recognitionSupported, speaking]);

  if (!supported) return null;

  return <div className="fixed bottom-4 right-4 z-[9500] flex items-end gap-2" data-tts-ignore="true">
    {open && <section aria-label="Réglages du lecteur vocal ADSO" className="absolute bottom-16 right-0 mb-2 w-[min(92vw,380px)] rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-2xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">Lecteur vocal ADSO</p>
          <p className="text-xs text-slate-400">Lecture, pause, arrêt et commandes vocales.</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fermer les réglages vocaux" className="rounded-lg p-2 hover:bg-slate-800"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid gap-2">
        <button type="button" onClick={() => speak(getReadablePageText())} disabled={speaking} className="min-h-11 rounded-xl bg-emerald-600 px-3 text-sm font-semibold disabled:opacity-40"><Play className="mr-2 inline h-4 w-4" />Lire la page</button>
        <button type="button" onClick={pauseOrResume} disabled={!speaking} className="min-h-11 rounded-xl border border-slate-700 px-3 text-sm disabled:opacity-40"><Pause className="mr-2 inline h-4 w-4" />{paused ? 'Reprendre' : 'Pause'}</button>
        <button type="button" onClick={stop} disabled={!speaking} className="min-h-11 rounded-xl border border-red-900/60 px-3 text-sm text-red-300 disabled:opacity-40"><Square className="mr-2 inline h-4 w-4" />Arrêter</button>
        {recognitionSupported && <button type="button" onClick={toggleVoiceCommands} aria-pressed={listening} className={`min-h-11 rounded-xl border px-3 text-sm ${listening ? 'border-emerald-400 bg-emerald-950 text-emerald-200' : 'border-slate-700'}`}><Mic className="mr-2 inline h-4 w-4" />{listening ? 'Écoute… dites « pause », « stop » ou « continue »' : 'Commande vocale'}</button>}
      </div>
      <div className="mt-4 grid gap-3">
        <label className="text-xs text-slate-400">Langue<select value={prefs.lang} onChange={(e) => setPrefs((p) => ({ ...p, lang: e.target.value, voiceName: '' }))} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-white">{availableLanguages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}</select></label>
        <label className="text-xs text-slate-400">Voix<select value={selectedVoice?.name ?? ''} onChange={(e) => setPrefs((p) => ({ ...p, voiceName: e.target.value }))} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-white"><option value="">Voix automatique</option>{voices.filter((v) => v.lang === prefs.lang || v.lang.startsWith(prefs.lang.split('-')[0])).map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} — {voice.lang}</option>)}</select></label>
        <label className="text-xs text-slate-400">Vitesse : {prefs.rate.toFixed(1)}×<input aria-label="Vitesse de lecture" className="mt-2 w-full" type="range" min="0.6" max="1.6" step="0.1" value={prefs.rate} onChange={(e) => setPrefs((p) => ({ ...p, rate: Number(e.target.value) }))} /></label>
        <label className="flex min-h-10 items-center gap-3 text-sm"><input type="checkbox" checked={prefs.enabled} onChange={(e) => setPrefs((p) => ({ ...p, enabled: e.target.checked }))} /> Lecteur vocal activé</label>
      </div>
    </section>}
    <button type="button" onClick={readPage} aria-label={speaking ? 'Arrêter la lecture de la page' : 'Lire toute la page'} className="flex min-h-12 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white shadow-xl hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"><Volume2 className="h-5 w-5" />{speaking ? 'Arrêter' : 'Lire'}</button>
    <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Réglages du lecteur vocal ADSO" aria-expanded={open} className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/95 text-slate-200 shadow-xl hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"><Settings2 className="h-5 w-5" /></button>
  </div>;
}
