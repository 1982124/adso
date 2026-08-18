'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, ShieldCheck, GraduationCap, Shield, Truck, Building2, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useViewStore, type AppModule, type LearningTab } from '@/stores/view-store';
import { useLocaleStore } from '@/stores/locale-store';
import CountryExplorer from './CountryExplorer';
import LearnerOnboarding from './LearnerOnboarding';
import CoursesView from './CoursesView';
import RoadSignsLibrary from './RoadSignsLibrary';
import SchoolProgram from './SchoolProgram';
import RegulationsView from './RegulationsView';
import RealWorldScenes from './RealWorldScenes';

const LicenseBrowser = dynamic(() => import('./LicenseBrowser'), { ssr: false, loading: () => <TabLoader /> });
const ExamPlatform = dynamic(() => import('./ExamPlatform'), { ssr: false, loading: () => <TabLoader /> });
const ProgressDashboard = dynamic(() => import('./ProgressDashboard'), { ssr: false, loading: () => <TabLoader /> });

function TabLoader() { return <div className="flex items-center justify-center py-16"><div className="text-center space-y-3"><div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent mx-auto" /><p className="text-sm text-slate-500">Chargement...</p></div></div>; }

const OFFERS: { id: AppModule; icon: React.ElementType; title: string; description: string }[] = [
  { id: 'driving', icon: Car, title: 'Conducteur', description: 'Préparation au permis et accompagnement progressif vers une conduite responsable.' },
  { id: 'security', icon: Shield, title: 'Sécurité routière', description: 'Prévention, culture du risque et apprentissage des bons réflexes.' },
  { id: 'insurance', icon: ShieldCheck, title: 'Prévention & assurance', description: 'Programmes de prévention et partenariats autour de la sécurité.' },
  { id: 'fleet', icon: Truck, title: 'Conducteurs professionnels & flottes', description: 'Formation, prévention et pilotage des équipes de mobilité professionnelle.' },
  { id: 'enterprise', icon: Building2, title: 'Écoles, universités & entreprises', description: 'Déploiement de programmes ADSO à l’échelle d’un établissement ou d’une organisation.' },
];

export default function LearningPlatform() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const setView = useViewStore(s => s.setView);
  const learningTab = useViewStore(s => s.learningTab);
  const setLearningTab = useViewStore(s => s.setLearningTab);
  const country = useLocaleStore(s => s.country);
  const locale = useLocaleStore(s => s.locale);

  useEffect(() => {
    const saved = window.localStorage.getItem('adso-learner-onboarding-v2') || window.localStorage.getItem('adso-learner-onboarding-v1');
    setOnboardingComplete(Boolean(saved && country.code !== 'ZZ'));
  }, [country.code]);

  const startCursus = () => {
    setOnboardingComplete(true);
    setLearningTab('cours');
    window.setTimeout(() => document.getElementById('adso-learning-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return <div className="min-h-screen bg-[#f7f8f6] pb-10 text-slate-950 dark:bg-slate-950 dark:text-white">
    <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8f6d22]"><Sparkles className="h-4 w-4" /> Formation — le cœur d'ADSO</p>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Apprendre à circuler. <span className="text-emerald-700 dark:text-emerald-400">Apprendre à protéger.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">ADSO transforme chaque situation en apprentissage : comprendre, décider, voir la conséquence, corriger et maîtriser.</p>
          </motion.div>
          <div className="rounded-2xl border border-[#c89b3c]/25 bg-[#f7f4ec] p-4 dark:bg-amber-950/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#8f6d22]"><MapPin className="h-4 w-4" /> Environnement actif</div>
            <p className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{country.name}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Langue d'apprentissage : <strong>{locale.toUpperCase()}</strong></p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Les compétences de sécurité sont communes ; les contenus réglementaires suivent le contexte du pays.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pt-6">
      <LearnerOnboarding onComplete={startCursus} />
      {onboardingComplete && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-700/20 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10"><div className="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-200"><MapPin className="h-4 w-4" /><span><strong>{country.name}</strong> — ton environnement d'apprentissage est actif.</span></div><button type="button" onClick={() => setOnboardingComplete(false)} className="text-xs font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300">Modifier mon parcours</button></div>}
    </section>

    <section id="adso-learning-tabs" className="mx-auto max-w-6xl px-4">
      <Tabs value={learningTab} onValueChange={(value) => setLearningTab(value as LearningTab)} className="w-full">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
          <TabsList className="h-auto min-w-max gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <TabsTrigger value="cours" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">📚 Cours</TabsTrigger>
            <TabsTrigger value="exercices" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">🎬 Scènes & exercices</TabsTrigger>
            <TabsTrigger value="examens" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">📝 Examens</TabsTrigger>
            <TabsTrigger value="progression" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">📊 Progression</TabsTrigger>
            <TabsTrigger value="signalisation" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">🚦 Signalisation</TabsTrigger>
            <TabsTrigger value="reglementations" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">⚖️ Réglementations</TabsTrigger>
            <TabsTrigger value="permis" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">🪪 Permis</TabsTrigger>
            <TabsTrigger value="programme" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">🎓 Écoles & Universités</TabsTrigger>
            <TabsTrigger value="explorer" className="rounded-xl px-3 py-2 text-sm text-slate-500 data-[state=active]:bg-emerald-700 data-[state=active]:text-white">🌍 Explorer</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="cours"><CoursesView /></TabsContent>
        <TabsContent value="exercices"><RealWorldScenes /></TabsContent>
        <TabsContent value="examens"><ExamPlatform /></TabsContent>
        <TabsContent value="progression"><ProgressDashboard /></TabsContent>
        <TabsContent value="signalisation"><RoadSignsLibrary /></TabsContent>
        <TabsContent value="reglementations"><RegulationsView /></TabsContent>
        <TabsContent value="permis"><LicenseBrowser /></TabsContent>
        <TabsContent value="programme"><SchoolProgram /></TabsContent>
        <TabsContent value="explorer"><CountryExplorer /></TabsContent>
      </Tabs>
    </section>

    <section className="mx-auto mt-10 max-w-6xl px-4"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8f6d22]">Le parcours de vie ADSO</p><h2 className="mt-1 text-2xl font-black">Une même culture de sécurité, à chaque âge.</h2><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">L'expérience évolue avec l'apprenant : enfant, jeune, étudiant, apprenti ou professionnel.</p></div><GraduationCap className="hidden h-8 w-8 text-emerald-700 sm:block dark:text-emerald-400" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{OFFERS.map(({ id, icon: Icon, title, description }) => <button key={id} type="button" onClick={() => setView(id)} className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><Icon className="h-4 w-4" /></div><h3 className="text-sm font-bold">{title}</h3><ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" /></div><p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p></button>)}</div></section>
  </div>;
}
