'use client';

import { useEffect } from 'react';

const BUTTON_CLASS = 'adso-inline-tts-button';
const BLOCK_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,caption,pre';
const MIN_TEXT_LENGTH = 8;

function cleanText(value: string) {
  return value.replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ').trim();
}

function read(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const value = cleanText(text);
  if (!value) return;
  window.speechSynthesis.cancel();
  const prefs = (() => {
    try { return JSON.parse(localStorage.getItem('adso-tts-preferences') || '{}') as { lang?: string; rate?: number; voiceName?: string }; } catch { return {}; }
  })();
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = prefs.lang || document.documentElement.lang || 'fr-FR';
  utterance.rate = typeof prefs.rate === 'number' ? prefs.rate : 1;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.name === prefs.voiceName) || voices.find((v) => v.lang === utterance.lang) || voices.find((v) => v.lang.startsWith(utterance.lang.split('-')[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function shouldProcess(element: HTMLElement) {
  if (element.closest('[data-tts-ignore="true"]')) return false;
  if (element.dataset.ttsInline === 'true') return false;
  if (element.closest('button,a,script,style,svg,select,textarea,input')) return false;
  const text = cleanText(element.innerText || '');
  if (text.length < MIN_TEXT_LENGTH) return false;
  const parent = element.parentElement;
  if (parent && parent.matches(BLOCK_SELECTOR) && cleanText(parent.innerText || '').length === text.length) return false;
  return true;
}

function decorate(root: ParentNode) {
  root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR).forEach((element) => {
    if (!shouldProcess(element)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.textContent = 'Lire';
    button.setAttribute('aria-label', `Lire : ${cleanText(element.innerText || '').slice(0, 100)}`);
    button.dataset.ttsInline = 'button';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      read(element.innerText || '');
    });
    element.dataset.ttsInline = 'true';
    element.insertAdjacentElement('afterend', button);
  });
}

export function InlineTTSButtons() {
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const style = document.createElement('style');
    style.dataset.ttsInlineStyle = 'true';
    style.textContent = `.${BUTTON_CLASS}{display:inline-flex;align-items:center;gap:.25rem;margin:.2rem 0 .35rem;padding:.15rem .45rem;border:1px solid rgba(16,185,129,.45);border-radius:.45rem;background:rgba(16,185,129,.08);color:inherit;font-size:.72rem;line-height:1.2;cursor:pointer;opacity:.78;transition:opacity .15s,background .15s} .${BUTTON_CLASS}:hover{opacity:1;background:rgba(16,185,129,.16)} .${BUTTON_CLASS}:focus-visible{outline:2px solid rgb(16,185,129);outline-offset:2px}`;
    document.head.appendChild(style);
    const run = () => decorate(document);
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      style.remove();
      document.querySelectorAll(`.${BUTTON_CLASS}`).forEach((button) => button.remove());
      document.querySelectorAll('[data-tts-inline="true"]').forEach((element) => element.removeAttribute('data-tts-inline'));
    };
  }, []);

  return null;
}
