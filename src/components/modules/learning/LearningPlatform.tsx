'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Car, ShieldCheck, BookOpen, GraduationCap, Shield, Truck, Building2, ArrowRight, MapPin } from 'lucide-react';
import { useViewStore, type AppModule, type LearningTab } from '@/stores/view-store';
import { useLocaleStore } from '@/stores/locale-store';
import CountryExplorer from './CountryExplorer';
import LearnerOnboarding from './LearnerOnboarding';
import CoursesView from './CoursesView';
import RoadSignsLibrary from './RoadSignsLibrary';
import SchoolProgram from './SchoolProgram';
import RegulationsView from './RegulationsView';

const LicenseBrowser = dynamic(() => import('./LicenseBrowser'), { ssr: false, loading: () => <TabLoader /> });
const ExamPlatform = dynamic(() => import('./ExamPlatform'), { ssr: false, loading: () => <TabLoader /> });
const PracticalExercises = dynamic(() => import('./PracticalExercises'), { ssr: false, loading: () => <TabLoader /> });
const ProgressDashboard = dynamic(() => import('./ProgressDashboard'), { ssr: false, loading: () => <TabLoader /> });

interface SeedCounts { countries: number; licenses: number; signs: number; questions: number; practical: number; }
function TabLoader() { return <div className="flex items-center justify-center py-16"><div className="text-center space-y-3"><div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto animate-spin" /><p className="text-slate-500 text-sm">Chargement...</p></div></div>; }
function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) { return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-emerald-500" /></div><div><p className="text-2xl font-bold text-white">{value}</p><p className="text-xs text-slate-400">{label}</p></div></motion.div>; }

const OFFERS: { id: AppModule; icon: React.ElementType; title: string; description: string }[] = [
  { id: 'driving', icon: Car, title: 'Conducteur', description: 'Préparation au permis et accompagnement progressif vers une conduite responsable.' },
  { id: 'security', icon: Shield, title: 'Sécurité routière', description: 'Prévention, culture du risque et apprentissage des bons réflexes.' },
  { id: 'insurance', icon: ShieldCheck, title: 'Prévention & assurance', description: 'Programmes de prévention et partenariats autour de la sécurité.' },
  { id: 'fleet', icon: Truck, title: 'Conducteurs professionnels & flottes', description: 'Formation, prévention et pilotage des équipes de mobilité professionnelle.' },
  { id: 'enterprise', icon: Building2, title: 'Écoles, universités & entreprises', description: 'Déploiement de programmes ADSO à l’échelle d’un établissement ou d’une organisation.' },
];

export default function LearningPlatform() {
  const [counts, setCounts] = useState<SeedCounts | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const setView = useViewStore(s => s.setView);
  const learningTab = useViewStore(s => s.learningTab);
  const setLearningTab = useViewStore(s => s.setLearningTab);
  const country = useLocaleStore(s => s.country);

  useEffect(() => {
    const saved = window.localStorage.getItem('adso-learner-onboarding-v1');
    setOnboardingComplete(Boolean(saved && country.code !== 'ZZ'));
  }, [country.code]);

  useEffect(() => { const controller = new AbortController(); (async () => { try { const res = await fetch('/api/seed', { signal: controller.signal, cache: 'no-store' }); if (res.ok) { const data = await res.json(); setCounts(data.counts); } } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) console.warn('[ADSO] learning stats unavailable'); } })(); return () => controller.abort(); }, []);

  const startCursus = () => { setOnboardingComplete(true); setLearningTab('cours'); window.setTimeout(() => document.getElementById('adso-learning-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };

  return <div className="min-h-screen bg-slate-950 pb-10">
    <section className="relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-slate-950 to-amber-900/10" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),transparent_60%)]" /><div className="relative mx-auto max-w-6xl px-4 pt-7 pb-4 sm:pt-9 sm:pb-6"><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-2.5"><h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Éducation routière <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">ADSO</span></h1><p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Un parcours adapté à ton pays, ton profil et ton objectif — cours, situations réelles, signalisation, scènes immersives, exercices et progression.</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">{counts ? <><StatCard icon={Globe} label="Pays" value={counts.countries} delay={0.3} /><StatCard icon={Car} label="Permis" value={counts.licenses} delay={0.4} /><StatCard icon={ShieldCheck} label="Signalisation" value={counts.signs} delay={0.5} /><StatCard icon={BookOpen} label="Questions" value={counts.questions} delay={0.6} /></> : Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-4"><Skeleton className="h-5 w-10 mb-1 bg-slate-800" /><Skeleton className="h-3 w-16 bg-slate-800" /></div>)}</motion.div></div></section>

    <section className="mx-auto max-w-6xl px-4 pt-5"><LearnerOnboarding onComplete={startCursus} />
      {onboardingComplete && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3"><div className="flex items-center gap-2 text-sm text-emerald-200"><MapPin className="h-4 w-4 text-emerald-400" /><span><strong>{country.name}</strong> — ton environnement d'apprentissage est actif.</span></div><button type="button" onClick={() => setOnboardingComplete(false)} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Modifier mon parcours</button></div>}
    </section>

    <section id="adso-learning-tabs" className="mx-auto max-w-6xl px-4"><Tabs value={learningTab} onValueChange={(value) => setLearningTab(value as LearningTab)} className="w-full"><div className="-mx-4 overflow-x-auto px-4 scrollbar-none"><TabsList className="h-auto min-w-max gap-1 rounded-xl border border-slate-800/60 bg-slate-900/80 p-1.5"><TabsTrigger value="explorer" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">🌍 Explorer</TabsTrigger><TabsTrigger value="cours" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">📚 Cours</TabsTrigger><TabsTrigger value="programme" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">🎓 Écoles & Universités</TabsTrigger><TabsTrigger value="signalisation" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">🚦 Signalisation</TabsTrigger><TabsTrigger value="reglementations" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">⚖️ Réglementations</TabsTrigger><TabsTrigger value="permis" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">🪪 Permis</TabsTrigger><TabsTrigger value="examens" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">📝 Examens</TabsTrigger><TabsTrigger value="exercices" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">🎬 Scènes & exercices</TabsTrigger><TabsTrigger value="progression" className="rounded-lg px-3 py-2 text-sm text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">📊 Progression</TabsTrigger></TabsList></div><TabsContent value="explorer"><CountryExplorer /></TabsContent><TabsContent value="cours"><CoursesView /></TabsContent><TabsContent value="programme"><SchoolProgram /></TabsContent><TabsContent value="signalisation"><RoadSignsLibrary /></TabsContent><TabsContent value="reglementations"><RegulationsView /></TabsContent><TabsContent value="permis"><LicenseBrowser /></TabsContent><TabsContent value="examens"><ExamPlatform /></TabsContent><TabsContent value="exercices"><PracticalExercises /></TabsContent><TabsContent value="progression"><ProgressDashboard /></TabsContent></Tabs></section>
    <section className="mx-auto mt-8 max-w-6xl px-4"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">ADSO — parcours de vie</p><h2 className="mt-1 text-2xl font-bold text-white">Apprendre tôt. Prévenir mieux. Devenir responsable.</h2><p className="mt-1 text-sm text-slate-400">La Formation reste le cœur ; les autres offres prolongent le parcours vers le conducteur responsable, le professionnel et l'établissement.</p></div><GraduationCap className="hidden h-8 w-8 text-emerald-400 sm:block" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{OFFERS.map(({ id, icon: Icon, title, description }) => <button key={id} onClick={() => setView(id)} className="group rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-colors hover:border-emerald-700/60 hover:bg-slate-900"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10"><Icon className="h-4 w-4 text-emerald-400" /></div><h3 className="text-sm font-semibold text-white">{title}</h3><ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-emerald-400" /></div><p className="mt-3 text-xs leading-relaxed text-slate-400">{description}</p></button>)}</div></section>
  </div>;
}
