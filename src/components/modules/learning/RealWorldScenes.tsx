'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, MapPin, Play, ShieldCheck } from 'lucide-react';

const SCENES = [
  { id: 'bamako-moto', title: 'Bamako — partager la route avec les motos', place: 'Bamako, Mali', category: 'Ville · Motos · Vigilance', difficulty: 'Débutant', image: 'https://images.pexels.com/photos/35340754/pexels-photo-35340754.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Circulation réelle dans une ville africaine avec voitures, motos et piétons', question: 'Un deux-roues arrive dans votre zone de trajectoire. Que devez-vous anticiper ?', options: ['Accélérer pour passer avant lui', 'Réduire l’allure, observer et conserver une marge latérale', 'Klaxonner et maintenir la même vitesse'], correct: 1, consequence: 'Une marge de sécurité laisse du temps aux deux usagers pour corriger leur trajectoire.' },
  { id: 'ouaga-motos', title: 'Ouagadougou — trafic dense et usagers vulnérables', place: 'Ouagadougou, Burkina Faso', category: 'Ville · Motos · Piétons', difficulty: 'Intermédiaire', image: 'https://images.pexels.com/photos/36875810/pexels-photo-36875810.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Motocyclistes africains dans une circulation urbaine dense', question: 'Dans un trafic dense, quelle priorité adopter ?', options: ['Chercher à gagner quelques secondes', 'Regarder loin, réduire les changements brusques et protéger les usagers vulnérables', 'Suivre au plus près le véhicule devant'], correct: 1, consequence: 'Anticiper les trajectoires réduit les conflits avec motos, piétons et véhicules.' },
  { id: 'rural-nigeria', title: 'Route rurale — visibilité et anticipation', place: 'Nigeria', category: 'Campagne · Route · Anticipation', difficulty: 'Débutant', image: 'https://images.pexels.com/photos/31848230/pexels-photo-31848230.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Conducteur africain à moto près d’une route rurale au Nigeria', question: 'Sur une route rurale avec une visibilité limitée, que faire ?', options: ['Conserver une allure permettant de s’arrêter dans la zone visible', 'Accélérer avant le prochain virage', 'Se déporter vers le bord opposé'], correct: 0, consequence: 'La vitesse doit rester compatible avec la distance réellement visible.' },
  { id: 'nairobi-traffic', title: 'Nairobi — intersection et circulation mixte', place: 'Nairobi, Kenya', category: 'Intersection · Ville · Piétons', difficulty: 'Intermédiaire', image: 'https://images.pexels.com/photos/36109053/pexels-photo-36109053.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Intersection réelle dans une ville africaine avec véhicules, motos et piétons', question: 'À l’approche d’une intersection chargée, quelle action vient en premier ?', options: ['Observer les trajectoires croisées et ralentir si nécessaire', 'Changer de file au dernier moment', 'Regarder uniquement le véhicule devant'], correct: 0, consequence: 'Une lecture globale permet d’identifier plus tôt les mouvements conflictuels.' },
  { id: 'ghana-moto', title: 'Ghana — deux-roues dans le trafic', place: 'Ghana', category: 'Motos · Trafic · Distance', difficulty: 'Intermédiaire', image: 'https://images.pexels.com/photos/12415510/pexels-photo-12415510.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Deux hommes africains sur une moto sur une route urbaine', question: 'Comment partager l’espace avec un deux-roues ?', options: ['Laisser une distance et éviter les écarts brusques', 'Rouler très près pour l’obliger à s’écarter', 'Dépasser sans vérifier l’environnement'], correct: 0, consequence: 'Une distance latérale et longitudinale suffisante réduit le risque de collision.' },
  { id: 'addis-traffic', title: 'Addis-Abeba — véhicules et motos en circulation', place: 'Addis-Abeba, Éthiopie', category: 'Ville · Trafic · Observation', difficulty: 'Avancé', image: 'https://images.pexels.com/photos/14391906/pexels-photo-14391906.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Motos et voitures dans la circulation réelle d’Addis-Abeba', question: 'Dans un environnement très chargé, quelle compétence est décisive ?', options: ['La vitesse de réaction uniquement', 'L’observation continue et l’anticipation des trajectoires', 'Le klaxon comme moyen principal de prévention'], correct: 1, consequence: 'L’anticipation donne davantage de temps pour décider sans manœuvre brutale.' },
  { id: 'rain-uganda', title: 'Ouganda — pluie et chaussée inondée', place: 'Ouganda', category: 'Pluie · Adhérence · Visibilité', difficulty: 'Intermédiaire', image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Rain_and_Roads.jpg', alt: 'Motocycliste africain traversant une zone de route inondée sous la pluie', question: 'La chaussée est recouverte d’eau. Quelle décision est la plus sûre ?', options: ['Accélérer pour traverser rapidement', 'Réduire l’allure et augmenter la marge de sécurité', 'Freiner brutalement au milieu de l’eau'], correct: 1, consequence: 'Une vitesse réduite et des gestes progressifs limitent la perte d’adhérence et la perte de contrôle.' },
  { id: 'douala-moto', title: 'Douala — transport professionnel à moto', place: 'Douala, Cameroun', category: 'Taxi-moto · Professionnel · Sécurité', difficulty: 'Avancé', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Mototaximan.jpg', alt: 'Conducteur de moto-taxi africain avec passager sur une route de Douala', question: 'Avant de démarrer avec un passager, quel réflexe est essentiel ?', options: ['Partir immédiatement pour gagner du temps', 'Vérifier le véhicule, l’équipement et l’environnement avant de s’insérer', 'Se concentrer uniquement sur la destination'], correct: 1, consequence: 'Le contrôle avant départ permet d’éviter qu’un problème prévisible devienne un incident sur la route.' },
];

export default function RealWorldScenes() {
  const [filter, setFilter] = useState('Toutes');
  const visible = filter === 'Toutes' ? SCENES : SCENES.filter(s => s.category.includes(filter));
  return <div className="space-y-5">
    <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Bibliothèque terrain ADSO</p>
      <h2 className="mt-2 text-2xl font-black text-white">Apprendre sur de vraies routes africaines.</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Chaque scène s’appuie sur une photographie réelle d’un environnement africain, avec personnes, véhicules et route réels. L’image sert de contexte ; le scénario ADSO ajoute le point de décision, la conséquence et la compétence à entraîner.</p>
    </div>
    <div className="flex flex-wrap gap-2">
      {['Toutes', 'Ville', 'Motos', 'Campagne', 'Intersection', 'Pluie', 'Taxi-moto'].map(x => <button key={x} type="button" onClick={() => setFilter(x)} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter === x ? 'bg-emerald-600 text-white' : 'border border-slate-800 bg-slate-900 text-slate-400'}`}>{x}</button>)}
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {visible.map(scene => <SceneCard key={scene.id} scene={scene} />)}
    </div>
  </div>;
}

function SceneCard({ scene }: { scene: typeof SCENES[number] }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const answered = choice !== null;
  return <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
    <div className="relative aspect-[16/10] bg-slate-800">
      <img src={scene.image} alt={scene.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><MapPin className="h-3.5 w-3.5" />{scene.place}</div>
        <h3 className="mt-1 text-lg font-black text-white">{scene.title}</h3>
      </div>
      <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-white">Scène réelle · {scene.difficulty}</div>
    </div>
    <div className="p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{scene.category}</p>
      <button type="button" onClick={() => setOpen(v => !v)} className="mt-3 flex w-full items-center justify-between gap-3 text-left">
        <span className="font-extrabold text-white">{scene.question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-4 space-y-3">
        {scene.options.map((option, index) => <button key={option} type="button" onClick={() => setChoice(index)} disabled={answered} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${answered ? index === scene.correct ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200' : index === choice ? 'border-red-500/50 bg-red-500/10 text-red-200' : 'border-slate-800 bg-slate-950 text-slate-500' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-emerald-600/50'}`}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-black">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}
        {answered && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"><div className="flex items-center gap-2 text-sm font-black text-emerald-300"><CheckCircle2 className="h-4 w-4" />{choice === scene.correct ? 'Bonne décision' : 'Décision à corriger'}</div><p className="mt-2 text-sm leading-6 text-slate-300">{scene.consequence}</p></div>}
      </div>}
      {!open && <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400"><Play className="h-3.5 w-3.5" />Ouvrir le point de décision</div>}
      <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-3 text-[11px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Observation · Décision · Conséquence · Compétence <ArrowRight className="ml-auto h-3.5 w-3.5" /></div>
    </div>
  </article>;
}
