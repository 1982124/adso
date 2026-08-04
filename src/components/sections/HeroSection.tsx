'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Globe, GraduationCap, Award, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const stats = [
  { icon: Globe, label: 'Pays', value: '120+' },
  { icon: GraduationCap, label: 'Élèves', value: '2M+' },
  { icon: Award, label: 'Taux de réussite', value: '95%' },
  { icon: Building2, label: 'Auto-écoles', value: '500+' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen md:h-[80vh] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-black"
    >
      {/* Floating animated elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Road lines */}
        <motion.div
          className="absolute top-[20%] -left-4 w-32 h-1 bg-emerald-500/10 rounded-full"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute top-[45%] right-0 w-48 h-1 bg-emerald-400/10 rounded-full"
          animate={{ x: [0, -120, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[10%] w-24 h-1 bg-emerald-500/8 rounded-full"
          animate={{ x: [0, 80, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        />
        {/* Floating circles (road signs) */}
        <motion.div
          className="absolute top-[15%] right-[15%] w-3 h-3 rounded-full bg-emerald-400/20"
          animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute top-[60%] left-[8%] w-2 h-2 rounded-full bg-emerald-300/15"
          animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[25%] w-4 h-4 rounded-full border border-emerald-500/15"
          animate={{ y: [0, -25, 0], scale: [1, 0.8, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: 3 }}
        />
        {/* Steering wheel shape */}
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-16 h-16 rounded-full border border-emerald-500/10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-16 md:pb-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo text */}
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-2"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white">
              ADSO
            </h1>
            <p className="mt-1 text-sm sm:text-base tracking-[0.3em] uppercase text-emerald-300/80 font-medium">
              Auto Drive School Online
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-100 max-w-3xl"
          >
            La première plateforme intelligente de conduite automobile
          </motion.p>

          {/* Description */}
          <motion.p
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-4 text-base sm:text-lg text-emerald-200/70 max-w-2xl leading-relaxed"
          >
            Nous démocratisons l&rsquo;éducation à la conduite grâce à l&rsquo;intelligence artificielle.
            Une formation accessible, personnalisée et de qualité pour chaque conducteur,
            peu importe où il se trouve dans le monde.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-base rounded-lg shadow-lg shadow-emerald-900/40 transition-all hover:shadow-emerald-700/50 hover:scale-105"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white/90 bg-white/5 hover:bg-white/10 hover:text-white px-8 py-6 text-base rounded-lg backdrop-blur-sm transition-all hover:scale-105"
            >
              Découvrir la plateforme
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        custom={4}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 mt-auto w-full border-t border-white/10 bg-black/30 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-center gap-2 sm:gap-3">
                <stat.icon className="size-5 text-emerald-400 shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-emerald-300/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
