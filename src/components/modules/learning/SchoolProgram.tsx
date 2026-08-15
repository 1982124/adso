'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Bike, Car, HeartPulse, Trophy, GraduationCap, University, BriefcaseBusiness } from 'lucide-react';
import { Card } from '@/components/ui/card';

const LEVELS = [
  { icon: Bike, level: 'Éveil mobilité', audience: 'École primaire · 5–11 ans', goal: 'Comprendre la route avant de devenir conducteur', topics: ['Piéton et traversée', 'Vélo et visibilité', 'Casque et équipements', 'Feux tricolores et panneaux essentiels', 'Comprendre les véhicules en mouvement', 'Route de l’école et transport scolaire'] },
  { icon: BookOpen, level: 'Citoyen de la route', audience: 'Collège · 11–15 ans', goal: 'Construire une culture de mobilité responsable', topics: ['Signalisation et marquages', 'Partage de la route', 'Deux-roues et transports collectifs', 'Risques liés à la vitesse et aux distractions', 'Nuit, pluie, brouillard et visibilité', 'Premiers réflexes face à un accident'] },
  { icon: Car, level: 'Préparation conducteur', audience: 'Lycée · 15–18 ans', goal: 'Préparer progressivement au code et à la conduite', topics: ['Socle commun du code de la route', 'Priorités, intersections et rond-points', 'Dépassement, freinage et changement de voie', 'Conduite de nuit et conditions difficiles', 'Scènes animées : feu vert, piéton, moto, bus, danger', 'Éco-conduite et anticipation'] },
  { icon: GraduationCap, level: 'Mobilité & sécurité', audience: 'Université · étudiants', goal: 'Comprendre la mobilité comme un enjeu humain, économique et technologique', topics: ['Mobilité urbaine et interurbaine', 'Usagers vulnérables et prévention', 'Analyse des risques et facteurs humains', 'Mobilité active et transports collectifs', 'Données, GPS, télématique et IA', 'Mobilité durable et éco-conduite'] },
  { icon: BriefcaseBusiness, level: 'Mobilité professionnelle', audience: 'Université · formation professionnelle', goal: 'Préparer les futurs acteurs des transports et de la mobilité', topics: ['Chauffeurs et transport professionnel', 'Gestion de flotte', 'Sécurité des entreprises', 'Maintenance et diagnostic automobile', 'Assurance et gestion des risques', 'Entrepreneuriat dans la mobilité'] },
  { icon: HeartPulse, level: 'Sécurité & secours', audience: 'Tous publics', goal: 'Réduire la gravité des accidents par les bons réflexes', topics: ['Protéger–alerter–secourir', 'Comportement après collision', 'Usagers vulnérables', 'Ceinture, casque et visibilité', 'Prévention des comportements à risque'] },
];

const ANIMATED_LESSONS = [
  ['Feu vert', 'Feu rouge → feu vert → observation → démarrage progressif → franchissement sécurisé.'],
  ['Piéton', 'Piéton qui s’approche → conducteur ralentit → traversée → reprise après sécurisation.'],
  ['Rond-point', 'Approche → observation → insertion → circulation → sortie avec contrôle.'],
  ['Dépassement', 'Observation → clignotant → vérification → dépassement → retour avec distance.'],
  ['Freinage d’urgence', 'Danger apparaît → réaction → freinage → stabilisation → reprise maîtrisée.'],
  ['Pluie et visibilité', 'Pluie commence → visibilité diminue → allure adaptée → distance augmentée.'],
];

export default function SchoolProgram() {
  return <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-6">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em]">Programme scolaire & universitaire ADSO</p>
      <h2 className="text-white text-2xl font-bold mt-2">Éduquer à la mobilité avant, pendant et après l’apprentissage de la conduite</h2>
      <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-4xl">ADSO propose une progression par âge et par objectif : sécurité de l’enfant, culture routière, pré-conduite, préparation au permis, mobilité universitaire et compétences professionnelles. Le socle théorique est mutualisé ; les règles nationales restent contextualisées.</p>
    </div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{LEVELS.map(({ icon: Icon, level, audience, goal, topics }) => <Card key={level} className="bg-slate-900 border-slate-800 p-5">
      <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Icon className="w-5 h-5 text-emerald-400" /></div><div><h3 className="text-white font-semibold">{level}</h3><p className="text-emerald-400 text-xs">{audience}</p></div></div>
      <p className="text-slate-300 text-sm mt-4">{goal}</p><ul className="mt-3 space-y-1.5">{topics.map(topic => <li key={topic} className="text-slate-400 text-xs flex gap-2"><span className="text-emerald-400">•</span>{topic}</li>)}</ul>
    </Card>)}</div>
    <Card className="border-slate-800 bg-slate-900 p-5"><div className="flex items-center gap-3 mb-4"><University className="h-5 w-5 text-emerald-400" /><div><h3 className="font-semibold text-white">Bibliothèque de scènes animées</h3><p className="text-xs text-slate-500">Le mouvement raconte la chronologie, sans audio obligatoire.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{ANIMATED_LESSONS.map(([title, sequence]) => <div key={title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-sm font-semibold text-white">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-400">{sequence}</p></div>)}</div></Card>
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /><p className="text-slate-400 text-xs leading-relaxed">Les contenus juridiques officiels, limitations, sanctions, permis et exigences administratives doivent être validés par pays avant d’être présentés comme des règles nationales.</p><Trophy className="w-5 h-5 text-amber-400 shrink-0" /></div>
  </div>;
}
