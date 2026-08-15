'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen, CheckCircle2, FileCheck2, Globe2, ShieldCheck } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';

const COMMON = [
  ['Fondamentaux de circulation', 'Observation, positionnement, vitesse adaptée, distance de sécurité et anticipation.'],
  ['Signalisation et marquages', 'Formes, couleurs, symboles, feux, marquages et messages de sécurité harmonisés.'],
  ['Priorités et intersections', 'Lecture des trajectoires, carrefours, ronds-points et comportements préventifs.'],
  ['Usagers vulnérables', 'Piétons, cyclistes, motocyclistes, enfants, transports collectifs et véhicules lourds.'],
  ['Conduite responsable', 'Fatigue, distraction, alcool et drogues, vitesse, visibilité, météo et éco-conduite.'],
];

const NATIONAL = [
  'Documents et catégories de permis',
  'Limitations et prescriptions nationales',
  'Sanctions et obligations administratives',
  'Équipements obligatoires et exigences locales',
  'Procédures d’examen et autorités compétentes',
];

export default function RegulationsView() {
  const { country } = useLocaleStore();
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Réglementations</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Comprendre ce qui est commun et ce qui dépend du pays</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">ADSO ne bloque pas l’apprentissage lorsqu’une couche juridique nationale n’est pas encore validée. Le socle de conduite et de sécurité reste accessible ; les prescriptions nationales sont affichées séparément et uniquement lorsqu’elles sont vérifiées.</p>
          </div>
          <Badge className="bg-emerald-600 text-white">{country.name}</Badge>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-emerald-900/40 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-3"><Globe2 className="h-5 w-5 text-emerald-400" /><div><h3 className="font-semibold text-white">Socle commun de conduite</h3><p className="text-xs text-slate-500">Disponible pour l’apprentissage dans ADSO</p></div></div>
          <div className="space-y-3">{COMMON.map(([title, text]) => <div key={title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><div><p className="text-sm font-medium text-white">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p></div></div></div>)}</div>
        </Card>

        <Card className="border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-3"><FileCheck2 className="h-5 w-5 text-sky-400" /><div><h3 className="font-semibold text-white">Couche nationale — {country.name}</h3><p className="text-xs text-slate-500">À distinguer du socle pédagogique commun</p></div></div>
          <div className="space-y-2">{NATIONAL.map(item => <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3"><span className="h-2 w-2 rounded-full bg-sky-400" /><span className="text-sm text-slate-300">{item}</span></div>)}</div>
          <div className="mt-5 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4"><p className="text-sm font-semibold text-amber-200">Validation nationale</p><p className="mt-1 text-xs leading-relaxed text-amber-100/70">Les éléments juridiques qui ne sont pas encore vérifiés pour {country.name} ne sont pas inventés. Ils restent signalés comme une couche à valider, sans empêcher l’élève de poursuivre sa formation.</p></div>
        </Card>
      </div>

      <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" /><p className="text-xs leading-relaxed text-slate-400"><span className="font-semibold text-slate-200">Principe ADSO :</span> le socle pédagogique peut être mutualisé ; une règle juridique nationale ne doit jamais être présentée comme locale sans validation officielle.</p><BookOpen className="ml-auto h-5 w-5 shrink-0 text-emerald-400" /></div>
    </div>
  );
}
