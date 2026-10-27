'use client';

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
    <section id="stats" className="bg-white py-14 sm:py-18 lg:py-20" aria-labelledby="road-safety-stats-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-5 border-b border-slate-200 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:items-end lg:gap-12">
          <div>
            <p className="border-l-2 border-[#D7B45A] pl-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0B1F33]">Données de référence</p>
            <h2 id="road-safety-stats-heading" className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              La mortalité routière en Afrique exige une action durable.
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            L’éducation et la prévention sont essentielles, aux côtés de routes plus sûres, de véhicules sûrs, de règles appliquées et de secours efficaces. Ces données décrivent le contexte routier : elles ne mesurent pas l’impact d’ADSO.
          </p>
        </div>

        <div className="mt-2 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map(({ value, label, detail, icon: Icon }) => (
            <article key={value} className="min-w-0 border-b border-slate-200 py-6 sm:border-b-0 sm:py-7 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.13em]">Repère routier</span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-[#0B1F33] sm:text-4xl">{value}</p>
              <h3 className="mt-2 text-sm font-bold leading-5 text-slate-900">{label}</h3>
              <p className="mt-3 text-xs leading-5 text-slate-600">{detail}</p>
            </article>
          ))}
        </div>

        <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          Sources et repères : <a className="font-semibold underline underline-offset-2 hover:text-slate-900" href="https://www.ssatp.org/publication/africa-status-report-road-safety-2025" target="_blank" rel="noreferrer">Rapport Afrique sur la sécurité routière 2025 (SSATP)</a> et <a className="font-semibold underline underline-offset-2 hover:text-slate-900" href="https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries" target="_blank" rel="noreferrer">Organisation mondiale de la Santé — traumatismes dus aux accidents de la route</a>. Les estimations dépendent des sources, des méthodes et des années de référence.
        </p>
      </div>
    </section>
  );
}
