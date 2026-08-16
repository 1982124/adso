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
  { view: "learning", text: "Voici Formation, le cœur de la plateforme : cours, signalisation, réglementations, permis, examens et progression." },
  { view: "driving", text: "Voici Conduite IA, pour apprendre et améliorer sa conduite avec un accompagnement intelligent." },
  { view: "mechanic", text: "Voici Mécanicien IA, pour comprendre les problèmes et le diagnostic du véhicule." },
  { view: "scanner", text: "Voici Scanner, pour exploiter les informations compatibles OBD deux du véhicule." },
  { view: "telematics", text: "Voici Télématique, pour exploiter les données de trajet et contribuer à une mobilité plus sûre." },
  { view: "security", text: "Voici Sécurité, dédiée à la prévention et aux bonnes pratiques de sécurité automobile." },
  { view: "marketplace", text: "Voici Marketplace, où les services et partenaires de l'écosystème automobile peuvent être présentés." },
  { view: "insurance", text: "Voici Assurance IA, pour les usages intelligents autour de l'assurance automobile." },
  { view: "fleet", text: "Voici Flotte, pour organiser et piloter les véhicules professionnels." },
  { view: "enterprise", text: "Voici Entreprise, pour les écoles, entreprises et opérateurs de mobilité." },
];

const MODULE_ALIASES: Array<{ view: AppModule; words: string[] }> = [
  { view: "home", words: ["accueil", "home", "départ"] },
  { view: "learning", words: ["formation", "cours", "apprentissage", "signalisation", "permis", "examens"] },
  { view: "driving", words: ["conduite ia", "conduite", "moniteur ia"] },
  { view: "mechanic", words: ["mécanicien ia", "mécanicien", "mecanicien", "diagnostic"] },
  { view: "scanner", words: ["scanner", "obd", "obd deux", "obd 2"] },
  { view: "telematics", words: ["télématique", "telematique", "gps", "trajet"] },
  { view: "security", words: ["sécurité", "securite", "prévention routière", "prevention routiere"] },
  { view: "marketplace", words: ["marketplace", "publicité", "publicite", "partenaire"] },
  { view: "insurance", words: ["assurance", "assurance ia", "assureur"] },
  { view: "fleet", words: ["flotte", "gestion de flotte", "véhicules professionnels"] },
  { view: "enterprise", words: ["entreprise", "municipalité", "municipalite", "école", "ecole"] },
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
    return () => {
      recognition.current?.stop();
      if (presentationTimer.current) window.clearTimeout(presentationTimer.current);
    };
  }, []);

  const speak = (text: string, lang = document.documentElement.lang || "fr-FR") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const navigate = (view: AppModule) => {
    useViewStore.getState().setView(view);
  };

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
      presentADSO();
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

    if (command.includes("reduire") && command.includes("texte")) {
      window.dispatchEvent(new CustomEvent("adso:zoom", { detail: "decrease" }));
      speak("Taille du texte réduite.");
      return;
    }

    const match = MODULE_ALIASES.find((entry) => entry.words.some((word) => command.includes(normalize(word))));
    if (match) {
      navigate(match.view);
      const label = PRESENTATION.find((item) => item.view === match.view)?.text || `J'ouvre ${match.view}.`;
      speak(label);
      return;
    }

    if (command.includes("anglais") || command.includes("english") || command.includes("i don't speak french") || command.includes("i dont speak french")) {
      speak("Hello. I can help you use ADSO, explain its services and guide you through the platform. Say the name of a service, or say: present ADSO.", "en-US");
      return;
    }

    if (command.includes("espanol") || command.includes("español") || command.includes("podemos hablar") || command.includes("hablar espanol")) {
      speak("Sí. Podemos hablar en español. Puedo explicarte ADSO y guiarte por sus servicios. Di el nombre del servicio que quieres abrir.", "es-ES");
      return;
    }

    if (command.includes("arabe") || command.includes("arabic") || command.includes("العربية")) {
      speak("نعم، يمكنني مساعدتك باللغة العربية في فهم خدمات ADSO والتنقل فيها.", "ar-SA");
      return;
    }

    speak(`J'ai entendu : ${raw}. Vous pouvez me demander d'ouvrir Formation, Conduite IA, Mécanicien IA, Scanner, Télématique, Sécurité, Marketplace, Assurance, Flotte ou Entreprise, ou dire : présente-moi ADSO.`);
  };

  const toggle = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      speak("La commande vocale n'est pas disponible dans ce navigateur. Vous pouvez utiliser la lecture vocale ADSO.");
      return;
    }
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const instance = new Recognition();
    instance.lang = "fr-FR";
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
    <div className="fixed bottom-5 left-5 z-[80] flex items-center gap-2 print:hidden">
      {enabled && (
        <button type="button" onClick={() => speak("Dites le nom d'un service, présente-moi ADSO, lire, augmenter le texte ou réduire le texte.")} className="rounded-full border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur" aria-label="Lire les commandes vocales disponibles">
          <Volume2 className="mr-1 inline h-4 w-4" aria-hidden="true" />
          Commandes vocales
        </button>
      )}
      <button type="button" onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary" aria-label={listening ? "Arrêter la commande vocale" : "Activer la commande vocale"} title={listening ? "Arrêter la commande vocale" : "Commande vocale ADSO"}>
        {listening ? <MicOff className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
        <span className="sr-only">{listening ? "Arrêter" : "Activer"} la commande vocale ADSO</span>
      </button>
      {!supported && <span className="sr-only">Reconnaissance vocale non disponible</span>}
    </div>
  );
}
