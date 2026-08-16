'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Globe, GraduationCap, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ADSOShare from '@/components/ADSOShare';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type LearningTab } from '@/stores/view-store';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const } }) };

const pillars: { icon: typeof Globe; label: string; tab: LearningTab }[] = [
  { icon: Globe, label: 'Pays & réalités locales', tab: 'explorer' },
  { icon: GraduationCap, label: 'Parcours selon l’âge', tab: 'programme' },
  { icon: ShieldCheck, label: 'Sécurité & citoyenneté', tab: 'reglementations' },
  { icon: Sparkles, label: 'IA personnalisée', tab: 'progression' },
];

const institutionalPillars = [
  'Prévention de la mortalité routière', 'Données & indicateurs par pays', 'Éducation et inclusion', 'Outils pour institutions & territoires'
];

export default function HeroSection() {
  const setView = useViewStore((state) => state.setView);
  const setLearningTab = useViewStore((state) => state.setLearningTab);

  const openLearning = (tab: LearningTab) => {
    setLearningTab(tab);
    setView('learning');
  };

  return (
    <section id="hero" className="relative flex min-h-[min(760px,100svh)] flex-col justify-center overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true"><motion.div className="absolute left-0 top-[25%] h-px w-40 bg-emerald-400/15" animate={{ x: [0, 120, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }} /><motion.div className="absolute right-0 top-[48%] h-px w-56 bg-emerald-300/15" animate={{ x: [0, -140, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }} /><div className="absolute left-1/2 top-1/2 size-[min(70vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/5" /></div>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-8 pt-24 sm:px-8 md:pt-20 lg:pb-10">
        <div className="flex flex-col items-center text-center">
          <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300/90 sm:text-base">Auto Drive School Online</p><h1 className="text-6xl font-black tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-9xl">ADSO</h1></motion.div>
          <motion.h2 custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-emerald-50 sm:text-4xl md:text-5xl">La responsabilité au service de la vie.</motion.h2>
          <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="mt-4 max-w-3xl text-base leading-7 text-emerald-100/80 sm:text-lg md:text-xl">Chaque vie est précieuse. ADSO accompagne l&apos;apprentissage, la mobilité et la sécurité routière avec des parcours adaptés à l&apos;âge, au pays et aux réalités locales, tout en fournissant des outils et des indicateurs utiles aux territoires et aux institutions.</motion.p>
          <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <FrancoiseAssistant />
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="min-h-14 rounded-xl bg-emerald-600 px-8 text-base font-bold text-white shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-500 hover:shadow-emerald-700/40"><Link href="/student" aria-label="Commencer gratuitement sur ADSO">Commencer mon parcours<ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="min-h-14 rounded-xl border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"><a href="#ecosystem" aria-label="Découvrir l’écosystème ADSO">Découvrir ADSO</a></Button>
            </div>
          </motion.div>
        </div>
        <div className="mt-5"><ADSOShare /></div>
        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, label, tab }) => <button key={label} type="button" onClick={() => openLearning(tab)} className="group flex min-h-18 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-5 py-3.5 text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"><Icon className="size-5 shrink-0 text-emerald-300 transition-transform group-hover:scale-110" aria-hidden="true" /><span className="text-sm font-semibold leading-6 text-white sm:text-base">{label}</span><ArrowRight className="size-4 text-emerald-400/60 transition-transform group-hover:translate-x-1 group-hover:text-emerald-300" aria-hidden="true" /></button>)}
        </motion.div>
        <motion.section custom={5} variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto mt-6 max-w-5xl rounded-3xl border border-white/10 bg-black/30 p-5 text-left backdrop-blur-md sm:p-7" aria-labelledby="institutional-heading"><div className="flex items-center gap-3"><Building2 className="size-5 text-emerald-300" aria-hidden="true" /><h2 id="institutional-heading" className="text-lg font-bold text-white sm:text-xl">Une plateforme pour les citoyens, les territoires et les institutions</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{institutionalPillars.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-emerald-50/90">{item}</div>)}</div></motion.section>
      </div>
    </section>
  );
}
