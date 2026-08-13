'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Car, ShieldCheck, BookOpen } from 'lucide-react';

const CountryExplorer = dynamic(() => import('./CountryExplorer'), { ssr: false, loading: () => <TabLoader /> });
const CoursesView = dynamic(() => import('./CoursesView'), { ssr: false, loading: () => <TabLoader /> });
const LicenseBrowser = dynamic(() => import('./LicenseBrowser'), { ssr: false, loading: () => <TabLoader /> });
const RoadSignsLibrary = dynamic(() => import('./RoadSignsLibrary'), { ssr: false, loading: () => <TabLoader /> });
const ExamPlatform = dynamic(() => import('./ExamPlatform'), { ssr: false, loading: () => <TabLoader /> });
const PracticalExercises = dynamic(() => import('./PracticalExercises'), { ssr: false, loading: () => <TabLoader /> });
const ProgressDashboard = dynamic(() => import('./ProgressDashboard'), { ssr: false, loading: () => <TabLoader /> });

interface CatalogueCounts {
  countries: number;
  licenses: number;
  signs: number;
  questions: number;
  practical: number;
  courses: number;
}

function TabLoader() {
  return <div className="flex items-center justify-center py-20"><div className="text-center space-y-3"><div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-slate-500 text-sm">Chargement...</p></div></div>;
}

function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-emerald-500" /></div><div><p className="text-2xl font-bold text-white">{value}</p><p className="text-xs text-slate-400">{label}</p></div></motion.div>;
}

export default function LearningPlatform() {
  const [counts, setCounts] = useState<CatalogueCounts | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/learning/catalog-stats', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (!cancelled && data) setCounts(data); })
      .catch(() => { /* the catalogue tabs remain independently usable */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-slate-950 to-emerald-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-10 sm:pt-16 sm:pb-14">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Plateforme d&apos;Apprentissage <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">ADSO</span></h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">Explorez les règles de conduite dans le monde, préparez vos examens, et progressez à votre rythme grâce à notre plateforme complète.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {counts ? <>
              <StatCard icon={Globe} label="Pays" value={counts.countries} delay={0.3} />
              <StatCard icon={Car} label="Permis" value={counts.licenses} delay={0.4} />
              <StatCard icon={ShieldCheck} label="Signalisation" value={counts.signs} delay={0.5} />
              <StatCard icon={BookOpen} label="Questions" value={counts.questions} delay={0.6} />
            </> : Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4"><Skeleton className="h-5 w-10 mb-1 bg-slate-800" /><Skeleton className="h-3 w-16 bg-slate-800" /></div>)}
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <Tabs defaultValue="explorer" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
            <TabsList className="bg-slate-900/80 border border-slate-800/60 rounded-xl h-auto p-1.5 gap-1 min-w-max">
              <TabsTrigger value="explorer" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">🌍 Explorer</TabsTrigger>
              <TabsTrigger value="cours" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">📚 Cours</TabsTrigger>
              <TabsTrigger value="permis" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">🪪 Permis</TabsTrigger>
              <TabsTrigger value="signalisation" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">🚦 Signalisation</TabsTrigger>
              <TabsTrigger value="examens" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">📝 Examens</TabsTrigger>
              <TabsTrigger value="exercices" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">🚗 Exercices Pratiques</TabsTrigger>
              <TabsTrigger value="progression" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 rounded-lg px-3 py-2 text-sm">📊 Progression</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="explorer"><CountryExplorer /></TabsContent>
          <TabsContent value="cours"><CoursesView /></TabsContent>
          <TabsContent value="permis"><LicenseBrowser /></TabsContent>
          <TabsContent value="signalisation"><RoadSignsLibrary /></TabsContent>
          <TabsContent value="examens"><ExamPlatform /></TabsContent>
          <TabsContent value="exercices"><PracticalExercises /></TabsContent>
          <TabsContent value="progression"><ProgressDashboard /></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
