'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_CHIPS = [
  'Quelles sont les priorités ?',
  'Limites de vitesse en ville',
  'Comment réussir l\'examen ?',
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function PulsingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="sr-only">L'IA Coach réfléchit...</span>
      <motion.span
        className="w-2 h-2 rounded-full bg-slate-400"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 rounded-full bg-slate-400"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 rounded-full bg-slate-400"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
      />
      <span className="text-sm text-slate-400 ml-2">L'IA Coach réfléchit...</span>
    </div>
  );
}

export default function AIChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Bonjour ! Je suis votre IA Coach ADSO. Je suis là pour vous aider dans votre apprentissage de la conduite. Posez-moi une question sur le code de la route, la sécurité routière ou la préparation à l'examen !",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo@adso.com',
          message: trimmed,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Désolé, je n\'ai pas pu répondre. Veuillez réessayer.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <section id="ai-chat" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                IA Coach — Votre assistant personnel
              </h2>
              <p className="text-slate-500 text-sm">
                Posez vos questions sur la conduite
              </p>
            </div>
          </div>

          {/* Chat Card */}
          <Card className="overflow-hidden">
            {/* Chat Messages Area */}
            <div className="max-h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar */}
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}

                    <div className="max-w-[80%] md:max-w-[70%]">
                      <div
                        className={`px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md'
                            : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p
                        className={`text-[10px] text-slate-400 mt-1 px-1 ${
                          msg.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>

                    {/* User Avatar */}
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-md">
                    <PulsingDots />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 md:px-6 pb-2">
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <CardContent className="pt-3 pb-4">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 disabled:opacity-50 transition-shadow"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
