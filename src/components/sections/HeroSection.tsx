'use client';

import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ShieldCheck, Building2, PlayCircle, UserRound, School2, TriangleAlert, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FrancoiseAssistant } from '@/components/FrancoiseAssistant';
import { useViewStore, type LearningTab } from '@/stores/view-store';

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const } }),
};

const pillars: { icon: typeof GraduationCap; label: string; tab: LearningTab }[] = [
  { icon: GraduationCap, label: 'Élèves · culture de la circulation', tab: 'programme' },
  { icon: UserRound, label: 'Apprentis · apprendre et anticiper', tab: 'programme' },
  { icon: ShieldCheck, label: 'Citoyens · sécurité et responsabilité', tab: 'reglementations' },
  { icon: Building2, label: 'Établissements · déployer ADSO', tab: 'programme' },
];

const audiences = [
  { icon: GraduationCap, title: 'Élève', text: 'Comprendre la circulation, les panneaux et les bons réflexes dès l’école.', href: '/student' },
  { icon: UserRound, title: 'Apprenti', text: 'Apprendre à observer, anticiper et prendre de bonnes décisions.', href: '/student' },
  { icon: ShieldCheck, title: 'Citoyen responsable', text: 'Développer une culture de sécurité utile à chaque déplacement.', href: '/student' },
  { icon: Building2, title: 'Établissement', text: 'Déployer ADSO auprès des apprenants et suivre leur parcours.', href: '/institutions' },
];

function StudentCrashScene() {
  return (
    <svg viewBox="0 0 1200 720" role="img" aria-labelledby="crash-title crash-desc" className="h-full w-full">
      <title id="crash-title">Scène pédagogique ADSO : un accident impliquant un élève vient de se produire</title>
      <desc id="crash-desc">Un élève avec son sac est protégé à distance d'un véhicule arrêté après une collision légère près d'un passage piéton. Un adulte sécurise la zone. La scène ne montre ni blessure graphique ni sang.</desc>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#bfe7ee" /><stop offset="1" stopColor="#eef7f1" /></linearGradient>
        <linearGradient id="road" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
        <linearGradient id="car" x1="0" x2="1"><stop offset="0" stopColor="#f4f0e6" /><stop offset="1" stopColor="#cbd5e1" /></linearGradient>
        <linearGradient id="vest" x1="0" x2="1"><stop offset="0" stopColor="#fbbf24" /><stop offset="1" stopColor="#f59e0b" /></linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#sky)" />
      <circle cx="1010" cy="110" r="58" fill="#f4c95d" opacity=".8" />
      <path d="M0 305 C190 265 360 275 520 305 C700 338 940 280 1200 300 L1200 420 L0 420 Z" fill="#77a66b" />
      <path d="M0 390 L1200 330 L1200 720 L0 720 Z" fill="url(#road)" />
      <path d="M0 505 L1200 445" stroke="#f8fafc" strokeWidth="12" strokeDasharray="56 36" opacity=".7" />
      <g opacity=".98">
        <path d="M720 365 L1040 345 L1130 455 L770 475 Z" fill="url(#car)" stroke="#0f172a" strokeWidth="6" />
        <path d="M790 365 L850 330 L980 324 L1038 345 Z" fill="#26364a" />
        <path d="M825 355 L856 338 L900 336 L898 360 Z" fill="#8fc7d3" />
        <path d="M915 335 L970 332 L1007 347 L918 355 Z" fill="#8fc7d3" />
        <circle cx="820" cy="468" r="42" fill="#111827" /><circle cx="820" cy="468" r="17" fill="#94a3b8" />
        <circle cx="1030" cy="446" r="42" fill="#111827" /><circle cx="1030" cy="446" r="17" fill="#94a3b8" />
        <path d="M1050 365 L1118 384 L1140 422 L1080 417 Z" fill="#ef4444" opacity=".85" />
        <path d="M1118 390 L1144 408" stroke="#fef2f2" strokeWidth="8" />
      </g>
      <g transform="translate(540 390)">
        <ellipse cx="45" cy="158" rx="76" ry="18" fill="#020617" opacity=".35" />
        <circle cx="44" cy="25" r="25" fill="#5b3b2b" />
        <path d="M14 62 Q45 42 76 62 L92 128 L-2 128 Z" fill="#166534" />
        <path d="M20 128 L35 185 M70 128 L57 185" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
        <path d="M20 75 L-12 113 M76 72 L104 103" stroke="#5b3b2b" strokeWidth="14" strokeLinecap="round" />
        <rect x="0" y="70" width="22" height="62" rx="8" fill="#b91c1c" transform="rotate(13 11 101)" />
        <path d="M88 95 Q128 108 148 144" fill="none" stroke="#64748b" strokeWidth="11" />
        <circle cx="148" cy="145" r="13" fill="#64748b" />
      </g>
      <g transform="translate(390 505) rotate(-13)">
        <circle cx="0" cy="60" r="43" fill="none" stroke="#111827" strokeWidth="11" />
        <circle cx="154" cy="60" r="43" fill="none" stroke="#111827" strokeWidth="11" />
        <path d="M0 60 L57 10 L110 60 L154 60 L93 6 L57 10" fill="none" stroke="#94a3b8" strokeWidth="9" />
        <path d="M55 12 L38 -22" stroke="#94a3b8" strokeWidth="8" /><path d="M36 -24 L65 -26" stroke="#94a3b8" strokeWidth="8" />
      </g>
      <g transform="translate(160 365)">
        <circle cx="42" cy="18" r="21" fill="#6b4634" />
        <path d="M16 48 Q42 30 69 48 L78 122 L5 122 Z" fill="url(#vest)" stroke="#7c2d12" strokeWidth="4" />
        <path d="M22 126 L12 177 M62 126 L75 177" stroke="#1e293b" strokeWidth="17" strokeLinecap="round" />
        <path d="M15 60 L-14 100 M68 61 L100 94" stroke="#6b4634" strokeWidth="13" strokeLinecap="round" />
        <rect x="18" y="67" width="50" height="10" fill="#fef3c7" opacity=".9" />
      </g>
      <g transform="translate(255 525)">
        <path d="M0 0 L58 0 L29 -55 Z" fill="#f59e0b" stroke="#fff7ed" strokeWidth="7" />
        <rect x="22" y="-5" width="14" height="28" fill="#f8fafc" />
      </g>
      <g transform="translate(75 255)">
        <rect x="0" y="0" width="245" height="70" rx="16" fill="#065f46" />
        <text x="22" y="30" fill="#d1fae5" fontSize="18" fontWeight="800" letterSpacing="2">SCÈNE ADSO</text>
        <text x="22" y="55" fill="#ffffff" fontSize="20" fontWeight="700">Le danger peut surgir en une seconde.</text>
      </g>
      <g transform="translate(835 515)">
        <rect x="0" y="0" width="290" height="92" rx="18" fill="#020617" fillOpacity=".88" stroke="#ffffff" strokeOpacity=".2" />
        <circle cx="40" cy="45" r="24" fill="#fbbf24" /><path d="M40 29 L40 48 M40 59 L40 61" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
        <text x="78" y="39" fill="#ffffff" fontSize="18" fontWeight="800">Observer · décider · protéger</text>
        <text x="78" y="65" fill="#a7f3d0" fontSize="16" fontWeight="700">Une scène pour apprendre, pas pour choquer.</text>
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const setView = useViewStore((state) => state.setView);
  const setLearningTab = useViewStore((state) => state.setLearningTab);
  const openLearning = (tab: LearningTab) => { setLearningTab(tab); setView('learning'); };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(16,185,129,.20),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(200,155,60,.10),transparent_30%)]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-[5.5rem] sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
          <div className="order-2 min-w-0 lg:order-1 lg:pt-4">
            <motion.p custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">LÉGENDE VISION · Impacter positivement le monde</motion.p>
            <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="mt-2 flex items-end gap-3">
              <h1 className="text-5xl font-black tracking-[-0.05em] text-white sm:text-7xl">ADSO</h1>
              <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-200"><HeartPulse className="size-3.5" /> Toute vie est précieuse</span>
            </motion.div>
            <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="mt-1 text-base font-extrabold tracking-wide text-emerald-200 sm:text-lg">African Digital Safety &amp; Orientation</motion.p>
            <div className="mt-3 h-1 w-20 rounded-full bg-amber-400" />
            <motion.h2 custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-3xl text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl">Chaque trajet compte. Chaque décision peut protéger une vie.</motion.h2>
            <motion.p custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">ADSO transforme l’éducation routière en expériences visuelles, interactives et immersives — de l’école au conducteur professionnel.</motion.p>
            <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible" className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-h-14 rounded-2xl bg-emerald-500 px-7 text-base font-extrabold text-slate-950 shadow-xl shadow-emerald-950/40 hover:bg-emerald-400"><Link href="/student">Commencer mon parcours<ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="min-h-14 rounded-2xl border-white/20 bg-white/5 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/10 hover:text-white"><a href="#immersive"><PlayCircle className="mr-2 size-5 text-emerald-300" />Explorer la scène</a></Button>
            </motion.div>
            <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-xl rounded-2xl border border-emerald-300/15 bg-white/[0.045] p-4">
              <p className="text-sm font-bold leading-6 text-slate-200">Observer → décider → comprendre → progresser.</p>
              <p className="mt-1 text-sm leading-6 text-emerald-200">Une pédagogie adaptée au pays, à l’âge et au parcours de chacun.</p>
            </motion.div>
            <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 max-w-md"><FrancoiseAssistant /></motion.div>
          </div>

          <motion.div id="immersive" custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="relative order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/30">
              <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-900">
                <StudentCrashScene />
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
                <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">ADSO Immersif · prévention</p><p className="mt-1 text-sm font-bold text-white sm:text-base">Une vraie situation. Une vraie décision.</p></div>
                <Link href="/student" className="shrink-0 rounded-xl px-3 py-2 text-sm font-extrabold text-emerald-300 transition hover:bg-white/10 hover:text-emerald-200">Commencer →</Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] bg-emerald-400/10 blur-3xl" aria-hidden="true" />
          </motion.div>
        </div>

        <motion.div custom={8} variants={fadeInUp} initial="hidden" animate="visible" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, label, tab }) => <button key={label} type="button" onClick={() => openLearning(tab)} className="group flex min-h-18 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3.5 text-center backdrop-blur transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-300"><Icon className="size-5 shrink-0 text-emerald-300" aria-hidden="true" /><span className="text-sm font-bold leading-6 text-white sm:text-base">{label}</span><ArrowRight className="size-4 text-emerald-300/60" aria-hidden="true" /></button>)}
        </motion.div>

        <motion.section custom={9} variants={fadeInUp} initial="hidden" animate="visible" className="mt-6" aria-labelledby="audiences-heading">
          <div className="mb-4 flex items-center gap-3"><School2 className="size-5 text-emerald-300" aria-hidden="true" /><h2 id="audiences-heading" className="text-xl font-extrabold text-white sm:text-2xl">À qui s’adresse ADSO ?</h2></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-300"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon className="size-5 text-emerald-300" aria-hidden="true" /><h3 className="font-bold text-white">{title}</h3></div><ArrowRight className="size-4 text-emerald-300/60 transition group-hover:translate-x-1" aria-hidden="true" /></div><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></Link>)}
          </div>
        </motion.section>
      </div>
    </section>
  );
}
