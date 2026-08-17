'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Bike, ShieldCheck, Landmark, School, HeartHandshake, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EcosystemCard { id: string; title: string; icon: React.ComponentType<{ className?: string }>; bgClass: string; borderClass: string; iconBg: string; iconColor: string; textColor: string; features: string[]; }

const cards: EcosystemCard[] = [
  { id: 'education', title: 'Éducation routière — primaire → université', icon: GraduationCap, bgClass: 'bg-emerald-900', borderClass: 'border-emerald-800', iconBg: 'bg-emerald-800', iconColor: 'text-emerald-200', textColor: 'text-white', features: ['Primaire, collège & lycée', 'Université & campus', 'Parcours progressifs, quiz & certification'] },
  { id: 'parents', title: 'Parents & communautés', icon: HeartHandshake, bgClass: 'bg-emerald-800', borderClass: 'border-emerald-700', iconBg: 'bg-emerald-700', iconColor: 'text-emerald-100', textColor: 'text-white', features: ['Suivi de progression', 'Prévention & sensibilisation', 'Communautés & programmes jeunesse'] },
  { id: 'driver', title: 'Conducteurs & taxi-moto', icon: Bike, bgClass: 'bg-emerald-700', borderClass: 'border-emerald-600', iconBg: 'bg-emerald-600', iconColor: 'text-emerald-100', textColor: 'text-white', features: ['Préparation au permis', 'ADSO Moto Safe', 'Professionnalisation & certification'] },
  { id: 'schools', title: 'Écoles & auto-écoles', icon: School, bgClass: 'bg-emerald-700', borderClass: 'border-emerald-600', iconBg: 'bg-emerald-600', iconColor: 'text-emerald-100', textColor: 'text-white', features: ['Gestion des apprenants', 'Cours & progression', 'Acquisition de futurs conducteurs'] },
  { id: 'business', title: 'Entreprises & flottes', icon: Briefcase, bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500', iconBg: 'bg-emerald-500', iconColor: 'text-white', textColor: 'text-white', features: ['Formation conducteurs', 'Suivi véhicules & équipes', 'Prévention & analytics'] },
  { id: 'partners', title: 'Assureurs & partenaires', icon: Landmark, bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500', iconBg: 'bg-emerald-500', iconColor: 'text-white', textColor: 'text-white', features: ['Assureurs & constructeurs', 'Télécoms, banques & fintech', 'ONG, gouvernements & institutions'] },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };

function EcosystemCardComponent({ card, index }: { card: EcosystemCard; index: number }) {
  return <motion.div variants={itemVariants} custom={index}><Card className={`${card.bgClass} ${card.borderClass} border-2 hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-xl h-full`}><CardContent className="p-4 sm:p-5"><div className="flex items-center gap-3 mb-3"><div className={`${card.iconBg} p-2 rounded-lg`}><card.icon className={`size-5 ${card.iconColor}`} /></div><h4 className={`font-bold text-sm sm:text-base ${card.textColor}`}>{card.title}</h4></div><ul className="space-y-1.5">{card.features.map((feature) => <li key={feature} className={`text-xs sm:text-sm ${card.textColor} opacity-90 flex items-center gap-2`}><span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />{feature}</li>)}</ul></CardContent></Card></motion.div>;
}

export default function EcosystemSection() {
  return <section id="ecosystem" className="bg-slate-50 py-16 sm:py-20 lg:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-12 sm:mb-16"><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">L’écosystème ADSO</p><h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Une chaîne de valeur <span className="text-emerald-600">de l’école à la mobilité professionnelle</span></h2><p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">ADSO ne s’arrête pas au permis. La plateforme accompagne l’éducation routière, le futur conducteur, le professionnel taxi-moto, les écoles, les entreprises, les flottes et les partenaires de sécurité.</p></motion.div>
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => <EcosystemCardComponent key={card.id} card={card} index={index} />)}
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-600" aria-hidden="true" /><h3 className="font-bold text-gray-900 text-lg">Le même parcours, plusieurs modèles économiques</h3></div><p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">Élève, parent, école, conducteur, flotte, assureur ou institution : chacun accède à une proposition de valeur adaptée, tandis qu’ADSO mesure les usages, les coûts de service et la valeur créée.</p></div><ArrowRight className="hidden size-7 text-emerald-500 lg:block" aria-hidden="true" /></div></motion.div>
  </div></section>;
}
