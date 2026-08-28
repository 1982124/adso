import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Globe2 } from 'lucide-react';
import { restoredCurriculum } from '@/data/restored-curriculum';

function imageFrom(content: string) {
  return content.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/)?.[1] ?? null;
}

function clean(content: string) {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)\n?/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*/g, '')
    .trim();
}

export default async function PublicCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = restoredCurriculum.find((item) => item.id === courseId);
  if (!course) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/education" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"><ArrowLeft className="h-4 w-4" /> Retour aux contenus publics</Link>
          <div className="mt-7 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Contenu public</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Socle commun ADSO</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">{course.level}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{course.description}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400"><span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {course.duration} min</span><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" /> {course.modules.length} séquences</span><span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Afrique · règles nationales séparées</span></div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-amber-300/40 bg-amber-50 p-5 text-sm leading-6 text-amber-950 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-100">
          <strong>Important :</strong> ce cours public enseigne des principes de mobilité et de sécurité communs. Les vitesses, sanctions, procédures, documents et autres règles juridiques nationales doivent être lus dans le contexte réglementaire vérifié du pays sélectionné.
        </div>

        <div className="space-y-8">
          {course.modules.map((module, index) => {
            const image = imageFrom(module.content);
            const text = clean(module.content);
            return (
              <article key={module.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-7 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Séquence {index + 1} · {module.type}</span><span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" /> {module.duration} min</span></div>
                  <h2 className="mt-2 text-2xl font-black">{module.title}</h2>
                </div>
                {image && <img src={image} alt={`Illustration pédagogique : ${module.title}`} className="max-h-[480px] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                <div className="px-5 py-6 sm:px-7 sm:py-8">
                  <div className="whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-200">{text}</div>
                  {module.type !== 'lesson' && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-100"><CheckCircle2 className="mb-2 h-5 w-5" /><strong>Cette séquence prépare une évaluation.</strong><p className="mt-1">Pour sauvegarder ta progression et poursuivre un parcours personnalisé, crée gratuitement ton compte ADSO.</p></div>}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D7B45A]">Continuer gratuitement</p>
          <h2 className="mt-2 text-2xl font-black">Construis ton parcours personnel</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Crée ton compte pour sauvegarder ta progression, choisir ton pays, ta langue, ton profil et ton objectif, puis poursuivre avec les parcours ADSO adaptés.</p>
          <Link href="/student" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#D7B45A] px-5 text-sm font-extrabold text-slate-950">Créer mon parcours →</Link>
        </div>
      </section>
    </main>
  );
}
