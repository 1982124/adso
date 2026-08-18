'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Globe, GraduationCap, ShieldCheck, Building2, Bike, BriefcaseBusiness, HeartHandshake, PlayCircle, UserRound, School2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ADSOShare from '@/components/ADSOShare';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type LearningTab } from '@/stores/view-store';

const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const } }) };

const pillars: { icon: typeof Globe; label: string; tab: LearningTab }[] = [
  { icon: GraduationCap, label: 'Élèves · culture routière', tab: 'programme' },
  { icon: UserRound, label: 'Apprentis · parcours permis', tab: 'programme' },
  { icon: Bike, label: 'Conducteurs · mobilité pro', tab: 'reglementations' },
  { icon: ShieldCheck, label: 'Sécurité · citoyenneté', tab: 'reglementations' },
];

const audiences = [
  { icon: GraduationCap, title: 'Élève', text: 'Découvrir les règles, les panneaux et les bons réflexes dès l’école.', href: '/student' },
  { icon: UserRound, title: 'Apprenti conducteur', text: 'Se former, pratiquer les décisions et progresser vers la maîtrise du code.', href: '/student' },
  { icon: Bike, title: 'Conducteur professionnel', text: 'Taxi-moto, taxi, livraison et mobilité professionnelle plus sûre.', href: '/student' },
  { icon: BriefcaseBusiness, title: 'Établissement / entreprise', text: 'Déployer ADSO auprès des apprenants et des équipes.', href: '/institutions' },
];

const institutionalPillars = ['Prévention de la mortalité routière', 'Éducation routière tout au long de la vie', 'Professionnalisation des conducteurs', 'Outils pour écoles, entreprises & institutions'];

export default function HeroSection() {
  const setView = useViewStore((state) => state.setView);
  const setLearningTab = useViewStore((state) => state.setLearningTab);
  const openLearning = (tab: LearningTab) => { setLearningTab(tab); setView('learning'); };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,.24),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(45,212,191,.14),transparent_32%)]" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[min(860px,100svh)] w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:gap-14 lg:pt-24">
        <div className="min-w-0">
          <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200"><Globe className="size-4" aria-hidden="true" /> Africa First</div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-base">Éducation routière · mobilité sûre · professionnalisation</p>
            <h1 className="text-6xl font-black tracking-[-0.05em] text-white sm:text-7xl md:text-8xl">ADSO</h1>
            <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300" />
          </motion.div>
          <motion.h2 custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">Pour éduquer et former des conducteurs responsables dès l’école.</motion.h2>
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 max-w-2xl rounded-3xl border border-emerald-300/15 bg-white/[0.045] p-5 shadow-2xl shadow-black/20">
            <p className="text-lg font-extrabold leading-7 text-white sm:text-xl">Plus d’1,1 million de personnes perdent chaque année la vie sur les routes dans le monde. Les traumatismes routiers restent la première cause de décès chez les 5–29 ans.</p>
            <p className="mt-3 text-base font-bold leading-7 text-emerald-200">Il est temps de changer les chiffres. Parce que toute vie est précieuse.</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Source de référence : Organisation mondiale de la Santé (OMS), données mondiales sur les traumatismes dus aux accidents de la circulation.</p>
          </motion.div>
          <motion.p custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">ADSO transforme la formation routière en expériences visuelles, interactives et immersives. Observer, décider, comprendre et progresser — avec ou sans Françoise.</motion.p>
          <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-500 px-7 text-base font-extrabold text-slate-950 shadow-xl shadow-emerald-950/40 hover:bg-emerald-400"><Link href="/student" aria-label="Commencer sur ADSO">Commencer mon parcours<ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline" size="lg" className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/10 hover:text-white"><a href="#immersive" aria-label="Voir une scène immersive ADSO"><PlayCircle className="mr-2 size-5 text-emerald-300" />Voir ADSO Immersif</a></Button>
          </motion.div>
          <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-md"><FrancoiseAssistant /></motion.div>
        </div>

        <motion.div id="immersive" custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-emerald-400/10 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-2 shadow-2xl backdrop-blur">
            <Image src="/adso-immersive-scene.svg" alt="Scène immersive ADSO : carrefour, panneau STOP, passage piéton et taxi-moto" width={1200} height={760} priority className="h-auto w-full rounded-[1.5rem]" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 rounded-2xl border border-white/15 bg-slate-950/85 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Expérience immersive</p><p className="font-bold text-white">Observe → Décide → Vois la conséquence</p></div><Link href="/student" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">Commencer →</Link></div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, label, tab }) => <button key={label} type="button" onClick={() => openLearning(tab)} className="group flex min-h-18 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3.5 text-center backdrop-blur transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-300"><Icon className="size-5 shrink-0 text-emerald-300" aria-hidden="true" /><span className="text-sm font-bold leading-6 text-white sm:text-base">{label}</span><ArrowRight className="size-4 text-emerald-300/60" aria-hidden="true" /></button>)}
        </motion.div>
        <div className="mt-6"><ADSOShare /></div>
        <motion.section custom={8} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6" aria-labelledby="audiences-heading">
          <div className="mb-4 flex items-center gap-3"><School2 className="size-5 text-emerald-300" aria-hidden="true" /><h2 id="audiences-heading" className="text-xl font-extrabold text-white sm:text-2xl">À qui s’adresse ADSO ?</h2></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-300"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon className="size-5 text-emerald-300" aria-hidden="true" /><h3 className="font-bold text-white">{title}</h3></div><ArrowRight className="size-4 text-emerald-300/60 transition group-hover:translate-x-1" aria-hidden="true" /></div><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></Link>)}
          </div>
        </motion.section>
        <motion.section custom={9} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md sm:p-7" aria-labelledby="institutional-heading"><div className="flex items-center gap-3"><Building2 className="size-5 text-emerald-300" aria-hidden="true" /><h2 id="institutional-heading" className="text-lg font-bold text-white sm:text-xl">Une infrastructure de prévention pour toute la chaîne de mobilité</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{institutionalPillars.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm leading-6 text-slate-200">{item}</div>)}</div></motion.section>
      </div>
    </section>
  );
}
