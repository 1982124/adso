'use client';

import { motion } from 'framer-motion';
import { HeartPulse, Users, Target, ShieldCheck } from 'lucide-react';

const indicators = [
  {
    value: '259 601',
    label: 'décès estimés sur les routes africaines en 2021',
    detail: 'Estimation continentale publiée dans le rapport Afrique sur la sécurité routière 2025.',
    icon: HeartPulse,
  },
  {
    value: '52 %',
    label: 'des personnes tuées sont des usagers vulnérables',
    detail: 'Piétons, cyclistes et usagers de deux-roues motorisés sont particulièrement exposés.',
    icon: Users,
  },
  {
    value: '19,6',
    label: 'décès pour 100 000 habitants',
    detail: 'Taux régional estimé pour l’Afrique dans le rapport 2025, à interpréter selon sa source et son année.',
    icon: ShieldCheck,
  },
  {
    value: '−50 %',
    label: 'de décès et de blessures graves : objectif mondial à l’horizon 2030',
    detail: 'Une ambition collective qui exige des actions coordonnées, des données fiables et une évaluation continue.',
    icon: Target,
  },
];

export default function StatsSection() {
  return (
    <section id="stats" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="road-safety-stats-heading">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0B1F33] via-emerald-600 to-[#D7B45A]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">Pourquoi agir maintenant</p>
          <h2 id="road-safety-stats-heading" className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">La mortalité routière en Afrique exige une action durable.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Derrière chaque chiffre, il y a une personne, une famille et une communauté. L’éducation et la prévention sont essentielles, aux côtés de routes plus sûres, de véhicules sûrs, de règles appliquées et de secours efficaces.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map(({ value, label, detail, icon: Icon }, index) => (
            <motion.article key={value} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: index * 0.06 }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#0B1F33] text-[#E4C878]"><Icon className="size-5" aria-hidden="true" /></span>
              <p className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{value}</p>
              <h3 className="mt-2 text-sm font-extrabold leading-5 text-slate-900">{label}</h3>
              <p className="mt-3 text-xs leading-5 text-slate-600">{detail}</p>
            </motion.article>
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Sources et repères : <a className="font-bold underline decoration-emerald-600 underline-offset-2 hover:text-emerald-800" href="https://www.ssatp.org/publication/africa-status-report-road-safety-2025" target="_blank" rel="noreferrer">Rapport Afrique sur la sécurité routière 2025 (SSATP)</a> et <a className="font-bold underline decoration-emerald-600 underline-offset-2 hover:text-emerald-800" href="https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries" target="_blank" rel="noreferrer">Organisation mondiale de la Santé — traumatismes dus aux accidents de la route</a>. Les estimations dépendent des sources, des méthodes et des années de référence ; elles ne représentent pas une mesure de l’impact d’ADSO.
        </p>
      </div>
    </section>
  );
}
