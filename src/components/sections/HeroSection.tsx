'use client';

import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ShieldCheck, Building2, Bike, School, BriefcaseBusiness, HeartHandshake, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ADSOShare from '@/components/ADSOShare';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type LearningTab } from '@/stores/view-store';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const } }) };

const pillars: { icon: typeof GraduationCap; label: string; tab: LearningTab }[] = [
  { icon: GraduationCap, label: 'Du primaire à l’université', tab: 'programme' },
  { icon: Bike, label: 'Taxi-moto & conducteurs pro', tab: 'reglementations' },
  { icon: School, label: 'Écoles & auto-écoles', tab: 'progression' },
  { icon: ShieldCheck, label: 'Sécurité & citoyenneté', tab: 'reglementations' },
];

const audiences = [
  { icon: GraduationCap, title: 'Éducation', text: 'Primaire, collège, lycée, université et campus.' },
  { icon: Bike, title: 'Conducteurs professionnels', text: 'Taxi-moto, taxi, livraison et mobilité professionnelle.' },
  { icon: BriefcaseBusiness, title: 'Entreprises & flottes', text: 'Formation, prévention, conformité et pilotage.' },
  { icon: HeartHandshake, title: 'Partenaires', text: 'Assureurs, télécoms, ONG, institutions et communautés.' },
];

const institutionalPillars = [
  'Prévention de la mortalité routière', 'Éducation routière tout au long de la vie', 'Professionnalisation des conducteurs', 'Outils pour écoles, entreprises & institutions'
];

export default function HeroSection() {
  const setView = useViewStore((state) => state.setView);
  const setLearningTab = useViewStore((state) => state.setLearningTab);

  const openLearning = (tab: LearningTab) => {
    setLearningTab(tab);
    setView('learning');
  };

  return (
    <section id="hero" className="relative flex min-h-[min(900px,100svh)] flex-col justify-center overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.28),transparent_48%)]" />
        <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-24 sm:px-8 md:pt-20 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-amber-300 sm:text-sm">Afrique · éducation routière · mobilité sûre</p>
              <h1 className="text-7xl font-black tracking-[-0.055em] sm:text-8xl md:text-9xl">ADSO</h1>
              <p className="mt-2 text-lg font-bold text-emerald-300 sm:text-xl">Éducation routière · mobilité sûre · professionnalisation</p>
            </motion.div>

            <motion.h2 custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              De l’école au conducteur professionnel, apprendre à mieux partager la route.
            </motion.h2>
            <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 max-w-2xl text-lg font-bold leading-8 text-emerald-50 sm:text-xl">
              <span className="text-amber-300">ADSO : apprendre à mieux partager la route, avant qu'un accident ne change une vie.</span>
            </motion.p>

            <motion.div custom={2.5} variants={fadeInUp} initial="hidden" animate="visible" className="mt-7 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Chiffres clés de la sécurité routière">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] p-3 sm:p-4"><p className="text-2xl font-black text-amber-200 sm:text-3xl">1,16 M</p><p className="mt-1 text-[11px] font-semibold leading-4 text-white/75 sm:text-xs">de décès routiers/an dans le monde</p></div>
              <div className="rounded-2xl border border-rose-300/20 bg-rose-400/[0.08] p-3 sm:p-4"><p className="text-2xl font-black text-rose-200 sm:text-3xl">225 482</p><p className="mt-1 text-[11px] font-semibold leading-4 text-white/75 sm:text-xs">décès estimés dans la Région africaine de l’OMS en 2021</p></div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.08] p-3 sm:p-4"><p className="text-2xl font-black text-emerald-200 sm:text-3xl">5–29</p><p className="mt-1 text-[11px] font-semibold leading-4 text-white/75 sm:text-xs">ans : première cause de décès liée aux routes</p></div>
            </motion.div>

            <motion.p custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Chaque année, environ 20 à 50 millions de personnes supplémentaires subissent des blessures non mortelles. Plus de la moitié des décès concernent les usagers vulnérables, notamment piétons, cyclistes et motocyclistes. ADSO agit en amont : <strong className="text-white">éduquer plus tôt, prévenir mieux, professionnaliser durablement et contribuer à sauver des vies.</strong>
            </motion.p>

            <motion.div custom={3.5} variants={fadeInUp} initial="hidden" animate="visible" className="mt-7 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-h-14 flex-1 rounded-xl bg-emerald-500 px-7 text-base font-black text-slate-950 shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-400"><Link href="/student" aria-label="Commencer gratuitement sur ADSO">Commencer mon parcours<ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="min-h-14 flex-1 rounded-xl border-white/20 bg-white/5 px-7 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"><a href="#visual-learning" aria-label="Voir les expériences visuelles ADSO"><Eye className="mr-2 size-5" aria-hidden="true" />Voir les scènes</a></Button>
            </motion.div>
          </div>

          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.04] p-2 shadow-2xl shadow-black/40 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-slate-900 sm:col-span-1 sm:row-span-2 sm:aspect-auto">
                  <img src="/illustrations/road-safety-school.svg" alt="Classe africaine apprenant la sécurité routière à partir d'une scène visuelle" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 pt-20"><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Éducation</p><p className="mt-1 text-xl font-black">Apprendre avant de conduire.</p></div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-900"><img src="/illustrations/road-safety-moto.svg" alt="Conducteur africain de taxi-moto équipé pour une mobilité plus sûre" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12"><p className="text-xs font-black uppercase text-amber-300">Taxi-moto</p><p className="text-base font-black">Professionnaliser la mobilité.</p></div></div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-900"><img src="/illustrations/road-safety-decision.svg" alt="Jeune usager africain prenant une décision dans une situation routière" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12"><p className="text-xs font-black uppercase text-sky-300">Immersion</p><p className="text-base font-black">Observer → décider → comprendre.</p></div></div>
              </div>
              <div className="mt-2 rounded-[1.5rem] border border-amber-300/15 bg-amber-300/[0.06] p-4 sm:p-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Notre mission</p><p className="mt-2 text-lg font-black leading-7 text-white">Contribuer à faire baisser la mortalité routière en Afrique en commençant par ce qui peut changer durablement les comportements : l’éducation.</p></div>
            </div>
          </motion.div>
        </div>

        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto mt-9 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{pillars.map(({ icon: Icon, label, tab }) => <button key={label} type="button" onClick={() => openLearning(tab)} className="group flex min-h-18 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-5 py-3.5 text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"><Icon className="size-5 shrink-0 text-emerald-300 transition-transform group-hover:scale-110" aria-hidden="true" /><span className="text-sm font-semibold leading-6 text-white sm:text-base">{label}</span><ArrowRight className="size-4 text-emerald-400/60 transition-transform group-hover:translate-x-1 group-hover:text-emerald-300" aria-hidden="true" /></button>)}</motion.div>
        <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{audiences.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left backdrop-blur-md"><div className="flex items-center gap-2"><Icon className="size-5 text-emerald-300" aria-hidden="true" /><h3 className="font-bold text-white">{title}</h3></div><p className="mt-2 text-sm leading-6 text-emerald-50/75">{text}</p></div>)}</motion.div>
        <motion.section custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto mt-5 max-w-6xl rounded-3xl border border-white/10 bg-black/30 p-5 text-left backdrop-blur-md sm:p-7" aria-labelledby="institutional-heading"><div className="flex items-center gap-3"><Building2 className="size-5 text-emerald-300" aria-hidden="true" /><h2 id="institutional-heading" className="text-lg font-bold text-white sm:text-xl">Une infrastructure africaine de prévention pour toute la chaîne de mobilité</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{institutionalPillars.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-emerald-50/90">{item}</div>)}</div></motion.section>
        <div className="mt-5"><ADSOShare /></div>
      </div>
    </section>
  );
}
