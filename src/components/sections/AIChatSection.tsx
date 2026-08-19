'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';

interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp: Date; }

const COPY: Record<string, { greeting: string; subtitle: string; placeholder: string; thinking: string; fallback: string; error: string; chips: string[] }> = {
  fr: { greeting: "Bonjour ! Je suis Françoise, l'assistante ADSO. Je peux vous aider à comprendre et utiliser les services ADSO.", subtitle: 'Posez vos questions sur ADSO, la conduite et la sécurité', placeholder: 'Posez votre question...', thinking: "Françoise réfléchit...", fallback: "Désolée, je n'ai pas pu répondre. Veuillez réessayer.", error: 'Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.', chips: ['Comment fonctionne la Télématique ?', 'Comment utiliser le Scanner ?', 'Présente-moi ADSO'] },
  en: { greeting: 'Hello! I am Françoise, your ADSO assistant. I can help you understand and use ADSO services.', subtitle: 'Ask about ADSO, driving and road safety', placeholder: 'Ask your question...', thinking: 'Françoise is thinking...', fallback: 'Sorry, I could not answer. Please try again.', error: 'Something went wrong. Check your connection and try again.', chips: ['How does Telematics work?', 'How do I use the Scanner?', 'Introduce me to ADSO'] },
  es: { greeting: '¡Hola! Soy Françoise, tu asistente de ADSO. Puedo ayudarte a comprender y utilizar los servicios de ADSO.', subtitle: 'Pregunta sobre ADSO, conducción y seguridad vial', placeholder: 'Haz tu pregunta...', thinking: 'Françoise está pensando...', fallback: 'Lo siento, no pude responder. Inténtalo de nuevo.', error: 'Ha ocurrido un error. Comprueba tu conexión e inténtalo de nuevo.', chips: ['¿Cómo funciona la telemática?', '¿Cómo uso el escáner?', 'Preséntame ADSO'] },
  ar: { greeting: 'مرحباً! أنا فرانسواز، مساعدة ADSO. يمكنني مساعدتك في فهم خدمات ADSO واستخدامها.', subtitle: 'اسأل عن ADSO والقيادة والسلامة على الطرق', placeholder: 'اكتب سؤالك...', thinking: 'فرانسواز تفكر...', fallback: 'عذراً، لم أتمكن من الإجابة. حاول مرة أخرى.', error: 'حدث خطأ. تحقق من الاتصال وحاول مرة أخرى.', chips: ['كيف تعمل الاتصالات عن بُعد؟', 'كيف أستخدم الماسح؟', 'قدّمي لي ADSO'] },
  pt: { greeting: 'Olá! Sou Françoise, sua assistente ADSO. Posso ajudar você a entender e usar os serviços ADSO.', subtitle: 'Pergunte sobre ADSO, condução e segurança rodoviária', placeholder: 'Faça sua pergunta...', thinking: 'Françoise está pensando...', fallback: 'Desculpe, não consegui responder. Tente novamente.', error: 'Ocorreu um erro. Verifique sua conexão e tente novamente.', chips: ['Como funciona a telemática?', 'Como uso o scanner?', 'Apresente-me a ADSO'] },
  de: { greeting: 'Hallo! Ich bin Françoise, Ihre ADSO-Assistentin. Ich helfe Ihnen, die ADSO-Dienste zu verstehen und zu nutzen.', subtitle: 'Fragen zu ADSO, Fahren und Verkehrssicherheit', placeholder: 'Stellen Sie Ihre Frage...', thinking: 'Françoise denkt nach...', fallback: 'Entschuldigung, ich konnte nicht antworten. Bitte versuchen Sie es erneut.', error: 'Ein Fehler ist aufgetreten. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.', chips: ['Wie funktioniert Telematik?', 'Wie benutze ich den Scanner?', 'Stell mir ADSO vor'] },
  zh: { greeting: '您好！我是弗朗索瓦丝，ADSO 助手。我可以帮助您了解和使用 ADSO 服务。', subtitle: '咨询 ADSO、驾驶和道路安全', placeholder: '请输入您的问题...', thinking: '弗朗索瓦丝正在思考...', fallback: '抱歉，我无法回答。请再试一次。', error: '发生错误。请检查网络连接后重试。', chips: ['远程信息处理如何工作？', '如何使用扫描仪？', '介绍一下 ADSO'] },
  ja: { greeting: 'こんにちは！ADSOアシスタントのフランソワーズです。ADSOのサービスについてご案内します。', subtitle: 'ADSO、運転、安全運転について質問してください', placeholder: '質問を入力してください...', thinking: 'フランソワーズが考えています...', fallback: '申し訳ありません。回答できませんでした。もう一度お試しください。', error: 'エラーが発生しました。接続を確認してもう一度お試しください。', chips: ['テレマティクスとは？', 'スキャナーの使い方は？', 'ADSOを紹介して'] },
  sw: { greeting: 'Habari! Mimi ni Françoise, msaidizi wako wa ADSO. Ninaweza kukusaidia kuelewa na kutumia huduma za ADSO.', subtitle: 'Uliza kuhusu ADSO, uendeshaji na usalama barabarani', placeholder: 'Andika swali lako...', thinking: 'Françoise anafikiria...', fallback: 'Samahani, sikuweza kujibu. Tafadhali jaribu tena.', error: 'Hitilafu imetokea. Angalia muunganisho wako kisha ujaribu tena.', chips: ['Telematiki inafanyaje kazi?', 'Natumiaje Scanner?', 'Nielezee ADSO'] },
  bm: { greeting: 'Aw ni ce! Ne ye Françoise, ADSO ka dɛmɛbaga. N bɛ se ka i dɛmɛ ka ADSO baarakɛw faamu ani ka baara kɛ a la.', subtitle: 'I ka se ka ɲininka ADSO, lamɔri ani siratigɛlɛn kan', placeholder: 'I ka i ka ɲininka sɛbɛn...', thinking: 'Françoise bɛ miiri...', fallback: 'Hakɛto, n ma se ka jaabi. Aw ye a bila kɔfɛ.', error: 'Fɛn dɔ ma kɛ ka ɲɛ. Aw ye i ka connexion lajɛ ka a bila kɔfɛ.', chips: ['Télématique bɛ baara cogo di?', 'N bɛ Scanner kɛ cogo di?', 'ADSO jira n na'] },
};

function getCopy(locale: string) { return COPY[locale] ?? COPY.fr; }
function formatTime(date: Date, locale: string): string { return date.toLocaleTimeString(locale || 'fr-FR', { hour: '2-digit', minute: '2-digit' }); }
function PulsingDots({ label }: { label: string }) { return <div className="flex items-center gap-1.5 px-4 py-3"><span className="sr-only">{label}</span><motion.span className="w-2 h-2 rounded-full bg-slate-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} /><motion.span className="w-2 h-2 rounded-full bg-slate-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} /><motion.span className="w-2 h-2 rounded-full bg-slate-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} /><span className="text-sm text-slate-400 ml-2">{label}</span></div>; }

export default function AIChatSection() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getCopy(locale);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMessages((prev) => prev.length ? prev : [{ role: 'assistant', content: copy.greeting, timestamp: new Date() }]); }, [copy.greeting]);

  // Never scroll the page when Françoise initializes. Keep auto-scroll inside the chat viewport.
  useEffect(() => { const container = chatScrollRef.current; if (container) container.scrollTop = container.scrollHeight; }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: new Date() }]);
    setInput(''); setIsLoading(true);
    if (inputRef.current) inputRef.current.style.height = 'auto';
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: trimmed, locale }) });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || copy.fallback, timestamp: new Date() }]);
    } catch { setMessages((prev) => [...prev, { role: 'assistant', content: copy.error, timestamp: new Date() }]); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; };

  return <section id="ai-chat" className="py-16 px-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}><div className="max-w-3xl mx-auto"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
    <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Bot className="w-5 h-5 text-emerald-600" /></div><div><h2 className="text-2xl md:text-3xl font-bold text-slate-900">Françoise — {locale === 'fr' ? 'Votre assistante ADSO' : 'ADSO Assistant'}</h2><p className="text-slate-500 text-sm">{copy.subtitle}</p></div></div>
    <Card className="overflow-hidden"><div ref={chatScrollRef} className="max-h-[500px] overflow-y-auto p-4 md:p-6 space-y-4"><AnimatePresence initial={false}>{messages.map((msg, idx) => <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1"><Bot className="w-4 h-4 text-emerald-600" /></div>}<div className="max-w-[80%] md:max-w-[70%]"><div className={`px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'}`}>{msg.content}</div><p className={`text-[10px] text-slate-400 mt-1 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{formatTime(msg.timestamp, locale)}</p></div>{msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1"><User className="w-4 h-4 text-slate-600" /></div>}
    </motion.div>)}</AnimatePresence>{isLoading && <div className="flex justify-start gap-2.5"><div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1"><Bot className="w-4 h-4 text-emerald-600" /></div><div className="bg-slate-100 rounded-2xl rounded-bl-md"><PulsingDots label={copy.thinking} /></div></div>}</div>
    <div className="px-4 md:px-6 pb-2"><div className="flex flex-wrap gap-2">{copy.chips.map((chip) => <button key={chip} type="button" onClick={() => sendMessage(chip)} disabled={isLoading} className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{chip}</button>)}</div></div>
    <CardContent className="pt-3 pb-4"><form onSubmit={handleSubmit} className="flex items-end gap-2"><textarea ref={inputRef} value={input} onChange={handleTextareaInput} onKeyDown={handleKeyDown} placeholder={copy.placeholder} rows={1} disabled={isLoading} className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 disabled:opacity-50 transition-shadow" /><Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="shrink-0 w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"><Send className="w-4 h-4" /><span className="sr-only">Send</span></Button></form></CardContent></Card>
  </motion.div></div></section>;
}
