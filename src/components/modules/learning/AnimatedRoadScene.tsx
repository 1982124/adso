'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { getRoadScene } from '@/lib/engines/road-scene-engine';

function Vehicle({ type, delay = 0, direction = 1, accent = 'emerald', paused = false }: { type: 'car' | 'moto' | 'bike'; delay?: number; direction?: 1 | -1; accent?: 'emerald' | 'slate' | 'amber'; paused?: boolean }) {
  const body = accent === 'amber' ? 'bg-amber-400' : accent === 'slate' ? 'bg-slate-500' : 'bg-emerald-500';
  const width = type === 'car' ? 'w-12' : type === 'moto' ? 'w-7' : 'w-5';
  return <motion.div aria-hidden className={`absolute bottom-9 z-20 ${width} h-5`} animate={{ x: direction === 1 ? ['-12vw', '112vw'] : ['112vw', '-12vw'] }} transition={{ duration: type === 'car' ? 7 : 6, delay, repeat: Infinity, ease: 'linear' }} style={{ scaleX: direction }}>
    <div className={`relative h-4 w-full rounded-md ${body} border border-black/30 shadow-lg`}><span className="absolute -bottom-1 left-1 h-2 w-2 rounded-full bg-black" /><span className="absolute -bottom-1 right-1 h-2 w-2 rounded-full bg-black" /><span className="absolute left-2 top-0.5 h-1.5 w-3 rounded-sm bg-sky-100/80" /></div>
  </motion.div>;
}

function TrafficLight({ phase }: { phase: number }) {
  const red = phase < 0.45;
  const amber = phase >= 0.45 && phase < 0.58;
  const green = phase >= 0.58;
  return <div className="absolute right-4 top-4 z-30 rounded-xl border border-white/20 bg-black/85 p-2 shadow-xl" aria-label={`Feu ${red ? 'rouge' : amber ? 'orange' : 'vert'}`}><div className="space-y-1.5"><span className={`block h-4 w-4 rounded-full ${red ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.9)]' : 'bg-red-950'}`} /><span className={`block h-4 w-4 rounded-full ${amber ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,.9)]' : 'bg-amber-950'}`} /><span className={`block h-4 w-4 rounded-full ${green ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.9)]' : 'bg-emerald-950'}`} /></div><span className="mt-2 block text-[8px] font-semibold uppercase tracking-wider text-white/70">{red ? 'ARRÊT' : amber ? 'ATTENTION' : 'AVANCE APRÈS CONTRÔLE'}</span></div>;
}

export default function AnimatedRoadScene({ category, title, difficulty = 'beginner', backgroundImage }: { category: string; title: string; difficulty?: string; backgroundImage?: string }) {
  const scene = useMemo(() => getRoadScene(category, difficulty), [category, difficulty]);
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (!running) return; const started = performance.now() - elapsed * 1000; const id = window.setInterval(() => setElapsed(Math.min(scene.duration, (performance.now() - started) / 1000)), 100); return () => window.clearInterval(id); }, [running, scene.duration]);
  const progress = scene.duration ? elapsed / scene.duration : 0;
  const step = scene.timeline.find(s => progress * scene.duration >= s.start && progress * scene.duration < s.end) ?? scene.timeline[scene.timeline.length - 1];
  const isNight = scene.lighting === 'nuit';
  return <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900" role="img" aria-label={`Micro-simulation routière : ${title}. ${scene.objective}`}>
    {backgroundImage ? <img src={backgroundImage} alt="" aria-hidden className={`absolute inset-0 h-full w-full object-cover ${isNight ? 'brightness-[.45]' : 'brightness-[.72]'}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : <div className="absolute inset-0 bg-gradient-to-b from-sky-700 via-sky-400 to-slate-700" />}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
    <div className="absolute inset-x-0 bottom-0 h-24 bg-slate-800/90"><div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-amber-200/70" /></div>
    {scene.weather === 'rain' && <motion.div className="absolute inset-0 opacity-50" animate={{ backgroundPositionY: ['0%', '100%'] }} transition={{ duration: .7, repeat: Infinity, ease: 'linear' }} style={{ backgroundImage: 'repeating-linear-gradient(105deg, transparent 0 10px, rgba(255,255,255,.3) 11px 12px, transparent 13px 24px)' }} />}
    {scene.weather === 'fog' && <motion.div className="absolute inset-0 bg-slate-200/25 backdrop-blur-[2px]" animate={{ opacity: [.2, .5, .2] }} transition={{ duration: 5, repeat: Infinity }} />}
    {scene.weather === 'snow' && <div className="absolute inset-0 bg-white/15" />}
    {category === 'roundabout' && <div className="absolute left-[43%] top-[56%] z-10 h-16 w-16 rounded-full border-[10px] border-slate-400/90 bg-slate-700/60 shadow-inner" />}
    {(category === 'city' || category === 'intersection' || category === 'priority') && <TrafficLight phase={(elapsed % 8) / 8} />}
    <Vehicle type="car" delay={0} direction={1} paused={!running} />
    {(category === 'city' || category === 'rural' || category === 'roundabout' || category === 'overtaking') && <Vehicle type="moto" delay={1.6} direction={1} accent="amber" paused={!running} />}
    {(category === 'city' || category === 'rural') && <Vehicle type="bike" delay={3.2} direction={-1} accent="slate" paused={!running} />}
    {category === 'emergency_braking' && <motion.div className="absolute right-[28%] bottom-24 z-30" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: .6, repeat: Infinity }}><AlertTriangle className="w-8 h-8 text-amber-300 drop-shadow-lg" /></motion.div>}
    <div className="absolute left-3 top-3 z-40 max-w-[70%] rounded-lg bg-black/65 px-3 py-2 backdrop-blur-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Micro-simulation · {scene.duration}s</p><p className="text-[11px] font-semibold text-white">{scene.title}</p><p className="text-[9px] text-white/75 mt-0.5">{step?.visualCue}</p></div>
    <div className="absolute inset-x-3 bottom-3 z-40 flex items-center gap-2"><button type="button" onClick={() => setRunning(v => !v)} className="rounded-full bg-black/70 p-2 text-white" aria-label={running ? 'Pause' : 'Lecture'}>{running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}</button><button type="button" onClick={() => { setElapsed(0); setRunning(true); }} className="rounded-full bg-black/70 p-2 text-white" aria-label="Rejouer"><RotateCcw className="w-3.5 h-3.5" /></button><span className="text-[9px] text-white/80">{Math.floor(elapsed)}s / {scene.duration}s</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-emerald-400 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} /></div><span className="flex items-center gap-1 text-[9px] text-white/70"><Volume2 className="w-3 h-3" />audio optionnel</span></div>
  </div>;
}
