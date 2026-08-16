"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

const SpeechRecognitionCtor =
  typeof window !== "undefined"
    ? (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition)
    : undefined;

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function VoiceAccess() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const recognition = useRef<RecognitionLike | null>(null);

  useEffect(() => {
    setSupported(Boolean(SpeechRecognitionCtor));
  }, []);

  useEffect(() => () => recognition.current?.stop(), []);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.documentElement.lang || "fr-FR";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const executeCommand = (raw: string) => {
    const command = raw.toLowerCase().trim();
    if (command.includes("arrête") || command.includes("stop")) {
      window.speechSynthesis?.cancel();
      return;
    }
    if (command.includes("lire") || command.includes("lis")) {
      const main = document.querySelector("main") || document.body;
      const text = Array.from(main.querySelectorAll("h1,h2,h3,p,li,button"))
        .map((node) => node.textContent?.trim())
        .filter(Boolean)
        .join(". ");
      speak(text.slice(0, 12000));
      return;
    }
    if (command.includes("augmenter") && command.includes("texte")) {
      window.dispatchEvent(new CustomEvent("adso:zoom", { detail: "increase" }));
      speak("Taille du texte augmentée.");
      return;
    }
    if (command.includes("réduire") && command.includes("texte")) {
      window.dispatchEvent(new CustomEvent("adso:zoom", { detail: "decrease" }));
      speak("Taille du texte réduite.");
      return;
    }
    if (command.includes("accueil")) {
      window.location.href = "/";
      return;
    }
    if (command.includes("formation") || command.includes("cours")) {
      window.location.href = "/formation";
      return;
    }
    speak(`J'ai entendu : ${raw}. Dites lire, accueil, formation, augmenter le texte ou réduire le texte.`);
  };

  const toggle = () => {
    if (!supported) {
      speak("La commande vocale n'est pas disponible dans ce navigateur. Vous pouvez utiliser la lecture vocale ADSO.");
      return;
    }
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const Recognition = SpeechRecognitionCtor as unknown as new () => RecognitionLike;
    const instance = new Recognition();
    instance.lang = document.documentElement.lang === "fr" ? "fr-FR" : "fr-FR";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript) executeCommand(transcript);
    };
    instance.onerror = () => {
      setListening(false);
      speak("Je n'ai pas compris. Réessayez.");
    };
    instance.onend = () => setListening(false);
    recognition.current = instance;
    setEnabled(true);
    setListening(true);
    speak("Commande vocale activée. Je vous écoute.");
    instance.start();
  };

  return (
    <div className="fixed bottom-5 left-5 z-[80] flex items-center gap-2">
      {enabled && (
        <button
          type="button"
          onClick={() => speak("ADSO : dites lire, accueil, formation, augmenter le texte ou réduire le texte.")}
          className="rounded-full border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
          aria-label="Lire les commandes vocales disponibles"
        >
          <Volume2 className="mr-1 inline h-4 w-4" aria-hidden="true" />
          Commandes vocales
        </button>
      )}
      <button
        type="button"
        onClick={toggle}
        className="flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={listening ? "Arrêter la commande vocale" : "Activer la commande vocale"}
        title={listening ? "Arrêter la commande vocale" : "Commande vocale ADSO"}
      >
        {listening ? <MicOff className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
        <span className="sr-only">{listening ? "Arrêter" : "Activer"} la commande vocale ADSO</span>
      </button>
    </div>
  );
}
