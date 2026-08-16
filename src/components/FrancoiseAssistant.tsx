"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Send, Volume2, X } from "lucide-react";

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
};

export function FrancoiseAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
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

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.documentElement.lang || "fr-FR";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const ask = async (question: string, speakReply = false) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/francoise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Service indisponible");
      const nextReply = data.reply || "Je n'ai pas reçu de réponse.";
      setReply(nextReply);
      if (speakReply) speak(nextReply);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Françoise est momentanément indisponible.";
      setReply(text);
      if (speakReply) speak(text);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void ask(message, false);
  };

  const toggleVoice = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      const text = "La commande vocale n'est pas disponible dans ce navigateur. Vous pouvez toujours écrire à Françoise.";
      setReply(text);
      speak(text);
      return;
    }
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }

    const instance = new Recognition();
    instance.lang = document.documentElement.lang || "fr-FR";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() || "";
      if (transcript) void ask(transcript, true);
    };
    instance.onerror = () => {
      setListening(false);
      const text = "Je n'ai pas compris. Réessayez en parlant naturellement.";
      setReply(text);
      speak(text);
    };
    instance.onend = () => setListening(false);
    recognition.current = instance;
    setListening(true);
    speak("Françoise vous écoute.");
    instance.start();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-[9999] flex items-center gap-2 rounded-full border border-primary/30 bg-background/95 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary print:hidden sm:bottom-24 lg:bottom-8"
        aria-label="Ouvrir Françoise, l'assistante ADSO"
        title="Parler à Françoise"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          F
          <span className="absolute -right-1 -top-1 flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" aria-hidden="true" />
        </span>
        <span>Françoise</span>
        <Mic className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/35 p-3 sm:items-center print:hidden" role="dialog" aria-modal="true" aria-label="Françoise, assistante ADSO">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <div className="flex items-center gap-2 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">F</span> Françoise</div>
                <p className="mt-1 text-xs text-muted-foreground">Assistante ADSO — texte, écoute et réponse vocale</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted" aria-label="Fermer Françoise"><X className="h-5 w-5" /></button>
            </div>

            <div className="max-h-[55vh] min-h-40 overflow-y-auto p-5">
              {!reply ? (
                <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
                  Bonjour, je suis Françoise. Vous pouvez m'écrire ou appuyer sur le microphone et me parler.
                </div>
              ) : (
                <div className="rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Françoise</div>
                  {reply}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="border-t p-4">
              <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(message, false); } }}
                  placeholder="Écrivez à Françoise…"
                  rows={2}
                  className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
                  aria-label="Message à Françoise"
                />
                <button type="button" onClick={toggleVoice} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${listening ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} aria-label={listening ? "Arrêter Françoise" : "Parler à Françoise"} title={voiceSupported ? "Parler à Françoise" : "Commande vocale non disponible"}>
                  {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button type="submit" disabled={loading || !message.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50" aria-label="Envoyer à Françoise">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
              {reply && (
                <button type="button" onClick={() => speak(reply)} className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted-foreground hover:bg-muted" aria-label="Écouter la réponse de Françoise">
                  <Volume2 className="h-4 w-4" /> Écouter la réponse
                </button>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">Les actions sensibles ou critiques restent soumises aux permissions ADSO et à une validation humaine explicite.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
