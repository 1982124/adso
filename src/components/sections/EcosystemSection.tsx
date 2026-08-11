'use client';

import { motion } from 'framer-motion';
import { Building2, MonitorSmartphone, Briefcase, UserCheck, Landmark, Smartphone, ArrowDown, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EcosystemCard { id: string; title: string; icon: React.ComponentType<{ className?: string }>; bgClass: string; borderClass: string; iconBg: string; iconColor: string; textColor: string; features: string[]; }

const cards: EcosystemCard[] = [
  { id: 'admin', title: 'Administration Centrale', icon: Building2, bgClass: 'bg-emerald-900', borderClass: 'border-emerald-800', iconBg: 'bg-emerald-800', iconColor: 'text-emerald-200', textColor: 'text-white', features: ['Dashboard analytique', 'Gestion multi-pays', 'Conformité réglementaire'] },
  { id: 'saas', title: 'Plateforme Auto-école SaaS', icon: MonitorSmartphone, bgClass: 'bg-emerald-700', borderClass: 'border-emerald-600', iconBg: 'bg-emerald-600', iconColor: 'text-emerald-100', textColor: 'text-white', features: ['Gestion des élèves', 'Planification des leçons', 'Suivi de progression'] },
  { id: 'enterprise', title: 'Plateforme Entreprise', icon: Briefcase, bgClass: 'bg-emerald-700', borderClass: 'border-emerald-600', iconBg: 'bg-emerald-600', iconColor: 'text-emerald-100', textColor: 'text-white', features: ['Flottes corporate', 'Formation sécurité', 'Rapports conformité'] },
  { id: 'monitor', title: 'App Moniteur', icon: UserCheck, bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500', iconBg: 'bg-emerald-500', iconColor: 'text-white', textColor: 'text-white', features: ['Planning intelligent', 'Évaluation en temps réel', 'Feedback IA'] },
  { id: 'partners', title: 'Partenaires', icon: Landmark, bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500', iconBg: 'bg-emerald-500', iconColor: 'text-white', textColor: 'text-white', features: ['Moniteurs & instructeurs', 'Assureurs & constructeurs', 'Gouvernements & institutions'] },
  { id: 'student', title: 'App Élève', icon: Smartphone, bgClass: 'bg-emerald-500', borderClass: 'border-emerald-400', iconBg: 'bg-emerald-400', iconColor: 'text-emerald-900', textColor: 'text-white', features: ['Cours interactifs', 'Simulateur IA', 'Permis numérique'] },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };

function EcosystemCardComponent({ card, index }: { card: EcosystemCard; index: number }) {
  return <motion.div variants={itemVariants} custom={index}><Card className={`${card.bgClass} ${card.borderClass} border-2 hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-xl h-full`}><CardContent className="p-4 sm:p-5"><div className="flex items-center gap-3 mb-3"><div className={`${card.iconBg} p-2 rounded-lg`}><card.icon className={`size-5 ${card.iconColor}`} /></div><h4 className={`font-bold text-sm sm:text-base ${card.textColor}`}>{card.title}</h4></div><ul className="space-y-1.5">{card.features.map((feature) => <li key={feature} className={`text-xs sm:text-sm ${card.textColor} opacity-90 flex items-center gap-2`}><span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />{feature}</li>)}</ul></CardContent></Card></motion.div>;
}
function Connector({ className = '' }: { className?: string }) { return <motion.div variants={itemVariants} className={`flex items-center justify-center ${className}`}><ArrowDown className="size-5 text-emerald-400" /></motion.div>; }
function ConnectorHorizontal({ className = '' }: { className?: string }) { return <motion.div variants={itemVariants} className={`hidden md:flex items-center justify-center ${className}`}><ArrowRight className="size-5 text-emerald-400" /></motion.div>; }

export default function EcosystemSection() {
  const [admin, saas, enterprise, monitor, partners, student] = cards;
  return <section id="ecosystem" className="bg-slate-50 py-16 sm:py-20 lg:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-12 sm:mb-16"><h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Un écosystème complet <span className="text-emerald-600">au service de la conduite</span></h2><p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Une architecture qui connecte tous les acteurs de l&rsquo;écosystème de la conduite — de l&rsquo;administration aux élèves, en passant par les moniteurs et les partenaires institutionnels.</p></motion.div>
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="relative max-w-4xl mx-auto">
      <div className="hidden md:block"><div className="flex justify-center"><div className="w-[480px]"><EcosystemCardComponent card={admin} index={0} /></div></div><Connector className="py-2" /><div className="flex justify-center"><div className="w-px h-4 bg-emerald-300" /></div><Connector className="py-2" /><div className="flex items-stretch gap-3"><div className="flex-1"><EcosystemCardComponent card={saas} index={1} /></div><div className="flex items-center"><div className="w-6 h-px bg-emerald-300" /><div className="w-2 h-2 rounded-full bg-emerald-400" /><div className="w-6 h-px bg-emerald-300" /></div><div className="flex-1"><EcosystemCardComponent card={enterprise} index={2} /></div></div><Connector className="py-2" /><div className="flex justify-center"><div className="w-px h-4 bg-emerald-300" /></div><Connector className="py-2" /><div className="flex items-stretch gap-3"><div className="flex-1"><EcosystemCardComponent card={monitor} index={3} /></div><div className="flex items-center"><div className="w-6 h-px bg-emerald-300" /><div className="w-2 h-2 rounded-full bg-emerald-400" /><div className="w-6 h-px bg-emerald-300" /></div><div className="flex-1"><EcosystemCardComponent card={partners} index={4} /></div></div><Connector className="py-2" /><div className="flex justify-center"><div className="w-px h-4 bg-emerald-300" /></div><Connector className="py-2" /><div className="flex justify-center"><div className="w-[480px]"><EcosystemCardComponent card={student} index={5} /></div></div></div>
      <div className="md:hidden"><div className="relative pl-8"><div className="absolute left-[15px] top-0 bottom-0 w-px bg-emerald-300" />{[admin, saas, enterprise, monitor, partners, student].map((card, index) => <div key={card.id} className={`relative ${index < 5 ? 'pb-4' : ''}`}><div className="absolute -left-8 top-5 w-8 flex justify-center"><div className={`w-3 h-3 rounded-full ${index === 5 ? 'bg-emerald-400 ring-4 ring-emerald-400/30' : 'bg-emerald-500 ring-4 ring-emerald-500/20'}`} /></div><EcosystemCardComponent card={card} index={index} /></div>)}</div></div>
    </motion.div>
  </div></section>;
}
