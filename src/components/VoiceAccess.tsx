"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useViewStore, type AppModule } from "@/stores/view-store";

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

type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
};

const PRESENTATION: Array<{ view: AppModule; text: string }> = [
  { view: "home", text: "Voici l'accueil ADSO, le point de départ de votre expérience." },
  { view: "learning", text: "Voici Formation, le cœur de la plateforme : éducation routière, signalisation, réglementations, permis, examens et progression." },
  { view: "driving", text: "Voici Conducteur, pour apprendre et améliorer sa conduite avec un accompagnement intelligent." },
  { view: "security", text: "Voici Sécurité, dédiée à la prévention et à la culture de sécurité routière." },
  { view: "insurance", text: "Voici Assurance, pour les usages de prévention autour de l'assurance automobile." },
  { view: "fleet", text: "Voici Flottes, pour former et piloter les conducteurs professionnels." },
  { view: "enterprise", text: "Voici Établissements et entreprises, pour les écoles, entreprises et opérateurs de mobilité." },
];

const MODULE_ALIASES: Array<{ view: AppModule; words: string[] }> = [
  { view: "home", words: ["accueil", "home", "départ"] },
  { view: "learning", words: ["formation", "cours", "apprentissage", "signalisation", "permis", "examens"] },
  { view: "driving", words: ["conduite ia", "conduite", "moniteur ia", "conducteur"] },
  { view: "security", words: ["sécurité", "securite", "prévention routière", "prevention routiere"] },
  { view: "insurance", words: ["assurance", "assurance ia", "assureur"] },
  { view: "fleet", words: ["flotte", "flottes", "gestion de flotte", "véhicules professionnels"] },
  { view: "enterprise", words: ["entreprise", "établissement", "établissements", "municipalité", "municipalite", "école", "ecole"] },
];

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function VoiceAccess() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const recognition = useRef<RecognitionLike | null>(null);
  const presentationTimer = useRef<number | null>(null);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    setSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
    const handleToggle = () => toggle();
    window.addEventListener('adso:voice-toggle', handleToggle);
    return () => {
      window.removeEventListener('adso:voice-toggle', handleToggle);
      recognition.current?.stop();
      if (presentationTimer.current) window.clearTimeout(presentationTimer.current);
    };
  }, [listening]);

  const speak = (text: string, lang = document.documentElement.lang || "fr-FR") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const navigate = (view: AppModule) => useViewStore.getState().setView(view);

  const presentADSO = (index = 0) => {
    if (presentationTimer.current) window.clearTimeout(presentationTimer.current);
    if (index >= PRESENTATION.length) {
      speak("La présentation d'ADSO est terminée. Vous pouvez maintenant me demander d'ouvrir un service précis.");
      return;
    }
    const item = PRESENTATION[index];
    navigate(item.view);
    speak(item.text);
    presentationTimer.current = window.setTimeout(() => presentADSO(index + 1), 4200);
  };

  const executeCommand = (raw: string) => {
    const command = normalize(raw);
    if (command.includes("arrete") || command.includes("stop") || command.includes("tais-toi")) {
      window.speechSynthesis?.cancel();
      if (presentationTimer.current) window.clearTimeout(presentationTimer.current);
      return;
    }
    if (command.includes("presente moi adso") || command.includes("presente adso") || command.includes("visite adso") || command.includes("montre moi tout adso")) {
      presentADSO(); return;
    }
    if (command.includes("lire") || command.includes("lis")) {
      const main = document.querySelector("main") || document.body;
      const text = Array.from(main.querySelectorAll("h1,h2,h3,p,li,button")).map((node) => node.textContent?.trim()).filter(Boolean).join(". ");
      speak(text.slice(0, 12000)); return;
    }
    if (command.includes("augmenter") && command.includes("texte")) {
      window.dispatchEvent(new CustomEvent("adso:zoom", { detail: "increase" })); speak("Taille du texte augmentée."); return;
    }
    if (command.includes("reduire") && command.includes("texte")) {
      window.dispatchEvent(new CustomEvent("adso:zoom", { detail: "decrease" })); speak("Taille du texte réduite."); return;
    }
    const match = MODULE_ALIASES.find((entry) => entry.words.some((word) => command.includes(normalize(word))));
    if (match) {
      navigate(match.view);
      speak(PRESENTATION.find((item) => item.view === match.view)?.text || `J'ouvre ${match.view}.`); return;
    }
    if (command.includes("anglais") || command.includes("english") || command.includes("i don't speak french") || command.includes("i dont speak french")) {
      speak("Hello. I can help you use ADSO, explain its services and guide you through the platform. Say the name of a service, or say: present ADSO.", "en-US"); return;
    }
    if (command.includes("espanol") || command.includes("español") || command.includes("podemos hablar") || command.includes("hablar espanol")) {
      speak("Sí. Podemos hablar en español. Puedo explicarte ADSO y guiarte por sus servicios. Di el nombre del servicio que quieres abrir.", "es-ES"); return;
    }
    if (command.includes("arabe") || command.includes("arabic") || command.includes("العربية")) {
      speak("نعم، يمكنني مساعدتك باللغة العربية في فهم خدمات ADSO والتنقل فيها.", "ar-SA"); return;
    }
    speak(`J'ai entendu : ${raw}. Vous pouvez me demander d'ouvrir Formation, Conducteur, Sécurité, Assurance, Flottes ou Établissements, ou dire : présente-moi ADSO.`);
  };

  function toggle() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      speak("La commande vocale n'est pas disponible dans ce navigateur. Vous pouvez utiliser la lecture vocale ADSO."); return;
    }
    if (listening) {
      recognition.current?.stop(); setListening(false); return;
    }
    const instance = new Recognition();
    instance.lang = "fr-FR"; instance.continuous = false; instance.interimResults = false;
    instance.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript || ""; if (transcript) executeCommand(transcript); };
    instance.onerror = () => { setListening(false); speak("Je n'ai pas compris. Réessayez."); };
    instance.onend = () => setListening(false);
    recognition.current = instance; setEnabled(true); setListening(true);
    speak("Commande vocale activée. Je vous écoute."); instance.start();
  }

  // Françoise is controlled from the single microphone in the ADSO header.
  // Keep this controller mounted for voice functionality, but render no second floating microphone.
  if (!enabled && !supported) return null;
  return (
    <div className="sr-only" aria-live="polite">
      {listening ? "Françoise écoute." : "Françoise est prête."}
      {enabled && <span> Commandes vocales disponibles.</span>}
      <span><Volume2 aria-hidden="true" /><Mic aria-hidden="true" /><MicOff aria-hidden="true" /></span>
    </div>
  );
}
