'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Bike, Car, HeartPulse, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

const LEVELS = [
  { icon: Bike, level: 'Éveil mobilité', audience: 'École primaire', goal: 'Comprendre la route avant de devenir conducteur', topics: ['Piéton et traversée', 'Vélo et visibilité', 'Casque et équipements', 'Comprendre les principaux panneaux', 'Comportements sûrs autour des véhicules'] },
  { icon: BookOpen, level: 'Citoyen de la route', audience: 'Collège', goal: 'Construire une culture de mobilité responsable', topics: ['Signalisation et marquages', 'Partage de la route', 'Deux-roues et transports collectifs', 'Risques liés à la vitesse et aux distractions', 'Premiers réflexes face à un accident'] },
  { icon: Car, level: 'Préparation conducteur', audience: 'Lycée / jeunes adultes', goal: 'Préparer progressivement au code et à la conduite', topics: ['Socle commun du code de la route', 'Priorités, intersections et rond-points', 'Dépassement et freinage d’urgence', 'Conduite de nuit, pluie, brouillard et routes dégradées', 'Éco-conduite et anticipation'] },
  { icon: HeartPulse, level: 'Sécurité & secours', audience: 'Tous publics', goal: 'Réduire la gravité des accidents par les bons réflexes', topics: ['Protéger–alerter–secourir', 'Comportement après collision', 'Usagers vulnérables', 'Ceinture, casque et visibilité', 'Prévention des comportements à risque'] },
];

export default function SchoolProgram() {
  return <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-6">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em]">Programme scolaire ADSO</p>
      <h2 className="text-white text-2xl font-bold mt-2">Éduquer à la mobilité avant d’apprendre à conduire</h2>
      <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-3xl">Un parcours progressif qui commence par la sécurité des piétons et des cyclistes, développe la culture routière, puis accompagne l’entrée dans l’apprentissage du code et de la conduite. Le socle théorique est mutualisé ; les règles nationales et les situations immersives restent contextualisées.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-4">{LEVELS.map(({ icon: Icon, level, audience, goal, topics }) => <Card key={level} className="bg-slate-900 border-slate-800 p-5">
      <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Icon className="w-5 h-5 text-emerald-400" /></div><div><h3 className="text-white font-semibold">{level}</h3><p className="text-emerald-400 text-xs">{audience}</p></div></div>
      <p className="text-slate-300 text-sm mt-4">{goal}</p><ul className="mt-3 space-y-1.5">{topics.map(topic => <li key={topic} className="text-slate-400 text-xs flex gap-2"><span className="text-emerald-400">•</span>{topic}</li>)}</ul>
    </Card>)}</div>
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /><p className="text-slate-400 text-xs leading-relaxed">Les contenus juridiques officiels, limitations, sanctions, permis et exigences administratives doivent être validés par pays avant d’être présentés comme des règles nationales.</p><Trophy className="w-5 h-5 text-amber-400 shrink-0" /></div>
  </div>;
}
