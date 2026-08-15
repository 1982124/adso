'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LIGHT_CYCLE = { red: { backgroundColor: '#ef4444', opacity: [1, 1, 0.25, 0.25], transition: { duration: 6, repeat: Infinity, times: [0, 0.28, 0.3, 1] } }, amber: { backgroundColor: '#f59e0b', opacity: [0.25, 0.25, 1, 1, 0.25], transition: { duration: 6, repeat: Infinity, times: [0, 0.5, 0.52, 0.62, 0.64] } }, green: { backgroundColor: '#22c55e', opacity: [0.25, 0.25, 1, 1], transition: { duration: 6, repeat: Infinity, times: [0, 0.45, 0.47, 1] } } };

function Car({ color = 'emerald', className = '', duration = 5, delay = 0 }: { color?: 'emerald' | 'slate' | 'amber' | 'white'; className?: string; duration?: number; delay?: number }) {
  const body = color === 'amber' ? 'bg-amber-400' : color === 'white' ? 'bg-white' : color === 'slate' ? 'bg-slate-600' : 'bg-emerald-500';
  return <motion.div className={`absolute h-5 w-10 rounded-md border border-black/30 shadow-lg ${body} ${className}`} animate={{ x: ['-8vw', '118vw'] }} transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}><span className="absolute -bottom-1 left-1 h-2 w-2 rounded-full bg-slate-950" /><span className="absolute -bottom-1 right-1 h-2 w-2 rounded-full bg-slate-950" /><span className="absolute left-2 top-1 h-1.5 w-3 rounded-sm bg-sky-200/80" /></motion.div>;
}

function TrafficLight() {
  return <div className="absolute right-5 top-5 z-20 rounded-xl border border-white/20 bg-slate-950/90 p-2 shadow-xl"><div className="space-y-1.5"><motion.span className="block h-4 w-4 rounded-full" animate={LIGHT_CYCLE.red} /><motion.span className="block h-4 w-4 rounded-full" animate={LIGHT_CYCLE.amber} /><motion.span className="block h-4 w-4 rounded-full" animate={LIGHT_CYCLE.green} /></div><span className="mt-2 block text-[8px] font-semibold uppercase tracking-wider text-white/70">Cycle</span></div>;
}

export default function AnimatedRoadScene({ category, title }: { category: string; title: string }) {
  const traffic = ['city', 'intersection', 'priority', 'roundabout', 'maneuver'].includes(category);
  const pedestrian = ['city', 'intersection', 'priority', 'parking'].includes(category);
  const rain = category === 'rain';
  const fog = category === 'fog';
  const night = category === 'night';
  const emergency = category === 'emergency_braking';
  const roundabout = category === 'roundabout';
  const mountain = category === 'mountain';
  const snow = category === 'snow';
  return <div className={`relative h-48 overflow-hidden rounded-xl border border-white/10 ${night ? 'bg-slate-950' : mountain ? 'bg-gradient-to-b from-sky-800 via-slate-500 to-slate-800' : 'bg-gradient-to-b from-sky-500/70 via-sky-300/40 to-slate-700'}`} role="img" aria-label={`Scène animée : ${title}`}>
    <div className="absolute inset-x-0 bottom-0 h-24 bg-slate-800"><div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-amber-200/60" /></div>
    {mountain && <><div className="absolute bottom-24 left-0 h-20 w-48 -skew-x-12 bg-slate-700/80" /><div className="absolute bottom-24 right-0 h-28 w-56 skew-x-12 bg-slate-600/80" /></>}
    {snow && <div className="absolute inset-0 bg-white/20" />}
    {fog && <motion.div className="absolute inset-0 bg-slate-200/30 backdrop-blur-[2px]" animate={{ opacity: [0.25, 0.55, 0.25] }} transition={{ duration: 5, repeat: Infinity }} />}
    {rain && <motion.div className="absolute inset-0 opacity-50" animate={{ backgroundPositionY: ['0%', '100%'] }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} style={{ backgroundImage: 'repeating-linear-gradient(105deg, transparent 0 10px, rgba(255,255,255,.28) 11px 12px, transparent 13px 24px)' }} />}
    {night && <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-transparent" />}
    {traffic && <TrafficLight />}
    {roundabout ? <motion.div className="absolute left-[42%] top-[55%] h-16 w-16 rounded-full border-8 border-slate-500 bg-emerald-900/60" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} /> : null}
    {pedestrian && <motion.div className="absolute bottom-24 left-[48%] z-10 h-7 w-2 rounded-full bg-slate-100" animate={{ x: [-25, 20, -25] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><span className="absolute -top-2 left-0.5 h-2 w-2 rounded-full bg-slate-100" /></motion.div>}
    <Car color="emerald" duration={traffic ? 6 : 5} />
    <Car color="white" duration={7} delay={1.2} className="bottom-14" />
    {emergency && <motion.div className="absolute right-[30%] bottom-20 z-20 text-3xl" animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>⚠️</motion.div>}
    <div className="absolute bottom-2 left-3 z-30 rounded-lg bg-black/65 px-3 py-1.5 backdrop-blur-sm"><p className="text-[10px] font-semibold text-white">🎬 Scène animée</p><p className="text-[9px] text-white/70">Mouvement visuel · aucun son requis</p></div>
  </div>;
}
