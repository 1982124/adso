'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, GraduationCap, ClipboardCheck, Monitor, BarChart3, Headphones, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Brain, title: 'AI Coach Personnel', description: "Assistant intelligent qui analyse les performances en temps réel et personnalise le parcours d'apprentissage. Identifie les faiblesses et adapte le contenu." },
  { icon: GraduationCap, title: 'AI Teacher', description: "Génère des explications adaptées au niveau de chaque élève, multimédia et interactives." },
  { icon: ClipboardCheck, title: 'AI Examiner', description: "Crée des examens blancs adaptatifs avec une base exhaustive de questions. Analyse les erreurs pour des révisions ciblées." },
  { icon: Monitor, title: 'AI Simulator', description: "Simule des scénarios de conduite réalistes pour préparer aux situations dangereuses sans risque." },
  { icon: BarChart3, title: 'AI Business Analyst', description: "Analyse les données pour optimiser la gestion des auto-écoles et améliorer les taux de réussite." },
  { icon: Headphones, title: 'AI Support Client', description: 'Assistance 24/7 multilingue pour résoudre les problèmes techniques et pédagogiques.' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };

export default function AIFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return <section id="ai-features" ref={sectionRef} className="relative overflow-hidden bg-white py-20 sm:py-28">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/40" />
    <div className="pointer-events-none absolute -top-40 right-0 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700"><Cpu className="h-4 w-4" />Intelligence Artificielle</div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">L&apos;Intelligence Artificielle <span className="text-emerald-600">au cœur</span> de l&apos;apprentissage</h2>
        <p className="text-lg text-gray-600">7 agents IA spécialisés pour transformer chaque étape de la formation</p>
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => { const Icon = feature.icon; return <motion.div key={feature.title} variants={cardVariants}><Card className="group h-full border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5"><CardContent className="flex flex-col gap-4 p-6"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white"><Icon className="h-6 w-6" /></div><h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3><p className="flex-1 text-sm leading-relaxed text-gray-500">{feature.description}</p><Link href="/student" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700" aria-label={`En savoir plus sur ${feature.title}`}>En savoir plus<ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" /></Link></CardContent></Card></motion.div>; })}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.8 }} className="mt-16"><div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white shadow-lg sm:p-8 lg:p-10"><div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" /><div className="pointer-events-none absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" /><div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"><Sparkles className="h-7 w-7 text-amber-300" /></div><div className="flex-1"><div className="mb-1 flex items-center gap-3"><span className="inline-flex items-center rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-200">AI-SCOS</span><span className="text-sm font-medium text-emerald-100">AI-Smart Course Operating System</span></div><h3 className="mb-2 text-xl font-bold sm:text-2xl">Un système d&apos;exploitation IA pour la formation</h3><p className="max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">AI-SCOS orchestre tous les agents IA en un écosystème cohérent. Chaque agent spécialisé communique avec les autres pour offrir une expérience d&apos;apprentissage fluide, personnalisée et intelligente — du premier cours à l&apos;obtention du permis.</p></div></div></div></motion.div>
    </div>
  </section>;
}
