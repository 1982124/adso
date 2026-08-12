'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap, ShieldCheck, Users, BarChart3, Award } from 'lucide-react';

const levels = [
  ['Primaire', 'Découvrir la route', 'Piétons, panneaux essentiels, vélo et premiers réflexes de sécurité.'],
  ['Collège', 'Comprendre la circulation', 'Signalisation, priorités, comportements responsables et dangers.'],
  ['Lycée', 'Se préparer à devenir conducteur', 'Code, situations réelles, responsabilités et examens blancs.'],
  ['Université', 'Conducteur et citoyen responsable', 'Code, prévention, conduite défensive et préparation au permis.'],
];

export default function EducationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">ADSO Education</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">La sécurité routière commence sur les bancs de l&apos;école.</h1>
          <p className="mt-6 text-lg text-muted-foreground">Former les élèves et étudiants à la maîtrise du Code de la circulation et aux comportements responsables, bien avant le premier permis.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [GraduationCap, 'Abonnement établissement', 'L&apos;école ou l&apos;université abonne ses élèves et étudiants et pilote le programme depuis son cockpit.'],
            [BookOpen, 'Parcours adaptés', 'Les contenus évoluent selon l&apos;âge et le niveau : primaire, collège, lycée et université.'],
            [Award, 'Progression & certification', 'Les apprenants suivent leur parcours, passent les évaluations et peuvent obtenir leur certification ADSO lorsqu&apos;ils remplissent les conditions.'],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof GraduationCap;
            return <article key={String(title)} className="rounded-2xl border bg-card p-6 shadow-sm"><I className="h-8 w-8 text-primary" /><h2 className="mt-4 text-xl font-semibold">{title as string}</h2><p className="mt-2 text-muted-foreground">{text as string}</p></article>;
          })}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">Des parcours selon le niveau</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {levels.map(([level, title, text]) => <article key={level} className="rounded-2xl border p-6"><p className="text-sm font-semibold text-primary">{level}</p><h3 className="mt-1 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></article>)}
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border p-6"><Users className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Cockpit ADSO School</h2><p className="mt-2 text-sm text-muted-foreground">Inscrits, participation, progression et résultats agrégés par établissement ou groupe.</p></article>
          <article className="rounded-2xl border p-6"><BarChart3 className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Rapports de sécurité</h2><p className="mt-2 text-sm text-muted-foreground">Suivi pédagogique et campagnes de sensibilisation sans exposer inutilement les données individuelles.</p></article>
          <article className="rounded-2xl border p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Une culture durable</h2><p className="mt-2 text-sm text-muted-foreground">Avant le permis, pendant le permis, après le permis : apprendre, maîtriser, progresser, conduire en sécurité.</p></article>
        </section>

        <div className="mt-12 rounded-2xl border bg-muted/40 p-8 text-center">
          <p className="text-xl font-semibold">ADSO — Maîtriser le Code de la circulation et devenir un citoyen responsable.</p>
          <p className="mt-2 text-muted-foreground">Parce que toute vie est précieuse.</p>
          <Link href="/" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground">Découvrir ADSO</Link>
        </div>
      </section>
    </main>
  );
}
