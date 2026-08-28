'use client';

import Link from 'next/link';
import { ArrowRight, Award, BarChart3, ShieldCheck, Users } from 'lucide-react';
import { restoredCurriculum } from '@/data/restored-curriculum';

const levels = [
  ['Primaire', 'Découvrir la route', 'Piétons, panneaux essentiels, vélo et premiers réflexes de sécurité.'],
  ['Collège', 'Comprendre la circulation', 'Signalisation, priorités, comportements responsables et dangers.'],
  ['Lycée', 'Se préparer à devenir conducteur', 'Code, situations réelles, responsabilités et évaluations pédagogiques.'],
  ['Université', 'Conducteur et citoyen responsable', 'Code, prévention, conduite défensive et préparation au permis.'],
];

function imageFrom(content: string) {
  return content.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/)?.[1] ?? null;
}

export default function EducationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">ADSO Education · accès public</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">La sécurité routière commence sur les bancs de l&apos;école.</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">ADSO donne d'abord accès à une vraie valeur pédagogique sans compte. Lorsque vous souhaitez sauvegarder votre progression et construire un parcours personnalisé, vous pouvez créer gratuitement votre compte.</p>
        </div>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Apprendre avant de s&apos;inscrire</p><h2 className="mt-1 text-2xl font-black">Des cours publics, réels et illustrés.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-950/70 dark:text-emerald-100/70">Le socle commun enseigne observation, anticipation, signalisation, usagers vulnérables et marges de sécurité. Les règles juridiques nationales restent séparées et contextualisées.</p></div>
            <Link href="/student" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white hover:bg-emerald-800">Créer mon parcours <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="public-courses">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#8f6d22]">Bibliothèque publique</p><h2 id="public-courses" className="mt-1 text-3xl font-black">Commencer maintenant</h2></div><span className="text-sm text-muted-foreground">{restoredCurriculum.length} cours disponibles</span></div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {restoredCurriculum.map((course) => {
              const image = imageFrom(course.modules[0]?.content ?? '');
              return <article key={course.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                {image && <img src={image} alt={`Illustration du cours ${course.title}`} className="aspect-[16/9] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                <div className="p-5"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">GRATUIT</span><span className="text-xs text-muted-foreground">{course.duration} min</span></div><h3 className="mt-3 text-xl font-bold">{course.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description}</p><p className="mt-3 text-xs text-muted-foreground">{course.modules.length} séquences · leçons · situations · quiz</p><Link aria-label={`Lire ${course.title}`} href={`/education/${course.id}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">LIRE <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
              </article>;
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">Des parcours selon le niveau</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">{levels.map(([level, title, text]) => <article key={level} className="rounded-2xl border p-6"><p className="text-sm font-semibold text-primary">{level}</p><h3 className="mt-1 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></article>)}</div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border p-6"><Users className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Cockpit ADSO School</h2><p className="mt-2 text-sm text-muted-foreground">Inscrits, participation, progression et résultats agrégés par établissement ou groupe.</p></article>
          <article className="rounded-2xl border p-6"><BarChart3 className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Rapports pédagogiques</h2><p className="mt-2 text-sm text-muted-foreground">Suivi pédagogique et campagnes de sensibilisation sans exposer inutilement les données individuelles.</p></article>
          <article className="rounded-2xl border p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-3 font-semibold">Une culture durable</h2><p className="mt-2 text-sm text-muted-foreground">Avant le permis, pendant le permis, après le permis : apprendre, maîtriser, progresser, conduire en sécurité.</p></article>
        </section>

        <div className="mt-12 rounded-2xl border bg-muted/40 p-8 text-center">
          <Award className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-xl font-semibold">Évaluer et reconnaître les compétences acquises.</p>
          <p className="mt-2 text-muted-foreground">La reconnaissance ADSO ne remplace aucun permis, examen ou titre officiel délivré par un État.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/student" className="inline-flex rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground">Construire mon parcours</Link><Link href="/formation/immersive" className="inline-flex rounded-lg border px-5 py-3 font-medium">Découvrir l&apos;immersif</Link></div>
        </div>
      </section>
    </main>
  );
}
