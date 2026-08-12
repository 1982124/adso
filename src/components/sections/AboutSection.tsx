'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Brain, Globe2, Users, Route, Award, Building2 } from 'lucide-react';

const pillars = [
  { icon: Brain, title: 'Apprendre et maîtriser', text: 'Des parcours adaptés au pays, au permis, au niveau et aux besoins de chaque utilisateur.' },
  { icon: ShieldCheck, title: 'Prévenir avant le danger', text: 'Prévention, rappels, analyse de conduite et informations routières pour encourager des comportements responsables.' },
  { icon: Route, title: 'Accompagner dans la durée', text: 'Avant le permis, pendant le permis et après le permis : ADSO reste un compagnon numérique de mobilité.' },
  { icon: Users, title: 'Connecter aux professionnels', text: 'Lorsque la pratique devient nécessaire, ADSO oriente vers des auto-écoles et moto-écoles partenaires.' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.08),transparent_35%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em]">Qui sommes-nous ?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">ADSO</h2>
          <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-100">Maîtriser le Code de la circulation et devenir un citoyen responsable.</p>
          <p className="mt-4 text-lg font-medium text-emerald-300">Parce que toute vie est précieuse.</p>
          <p className="mt-6 text-slate-300 leading-8">
            ADSO est une plateforme numérique d'apprentissage, de prévention et d'accompagnement de la mobilité. Elle prépare les citoyens aux réalités de la circulation, mesure leur progression et met l'intelligence artificielle au service de l'apprentissage, de la sécurité et de la prévention.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
              <h3 className="mt-5 font-bold text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3"><Globe2 className="w-5 h-5 text-emerald-400" /><h3 className="font-bold">Une plateforme internationale</h3></div>
            <p className="mt-3 text-sm leading-6 text-slate-400">ADSO adapte les contenus aux pays, aux réglementations, aux catégories de permis et aux réalités locales de circulation.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3"><Award className="w-5 h-5 text-emerald-400" /><h3 className="font-bold">Une certification ADSO</h3></div>
            <p className="mt-3 text-sm leading-6 text-slate-400">Après réussite des évaluations prévues par ADSO, l'utilisateur peut obtenir automatiquement sa certification numérique. Elle ne remplace jamais un permis officiel.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-emerald-400" /><h3 className="font-bold">Un écosystème de confiance</h3></div>
            <p className="mt-3 text-sm leading-6 text-slate-400">ADSO travaille à connecter citoyens, conducteurs professionnels, auto-écoles, moto-écoles, assureurs, entreprises, flottes et institutions autour d'un objectif commun : une circulation plus sûre.</p>
          </div>
        </div>

        <div className="mt-12 text-center border-t border-slate-800 pt-10">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Notre promesse</p>
          <p className="mt-3 text-xl sm:text-2xl font-bold">Avant le permis. Pendant le permis. Après le permis.</p>
          <p className="mt-2 text-emerald-300 font-semibold">Apprendre. Maîtriser. Progresser. Conduire en sécurité.</p>
        </div>
      </div>
    </section>
  );
}
