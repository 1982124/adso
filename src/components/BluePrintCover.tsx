'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function BluePrintCover() {
  return (
    <section
      id="cover"
      data-blueprint-section
      className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #020617 0%, #0f172a 40%, #0c1425 100%)',
      }}
    >
      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Small caps header */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-400 font-semibold mb-6"
        >
          Global AI Driving Education Ecosystem
        </motion.p>

        {/* Cyan line */}
        <motion.div
          variants={lineExpand}
          initial="hidden"
          animate="visible"
          className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-10 mx-auto w-48"
          style={{ transformOrigin: 'center' }}
        />

        {/* Main title */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          Auto Drive School Online
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto mb-12"
        >
          Global AI Driving Education Ecosystem Blueprint 2026–2030
        </motion.p>

        {/* Metadata block */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 border border-slate-700/50 rounded-xl px-6 py-4 bg-slate-900/40 backdrop-blur-sm"
        >
          <span>Document de Spécification Maître</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span>Version 1.0</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span>Août 2026</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-cyan-500/80 font-medium">Confidentiel</span>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 py-6">
        <div className="h-px bg-gradient-to-r from-cyan-500/40 via-cyan-500/20 to-transparent mb-4" />
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-medium text-slate-500">ADSO Engineering</span>
          <span>2026 — 2030</span>
        </div>
      </div>
    </section>
  );
}
