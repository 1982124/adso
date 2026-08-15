'use client';

import Link from 'next/link';
import CoursesViewReal from './CoursesViewReal';

export default function CoursesView() {
  return (
    <section data-course-catalog>
      <div className="mb-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Formation — socle commun africain</p>
        <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Cours de conduite routier et de la mobilité</h2>
        <p className="mt-1 text-sm text-slate-400">Le catalogue théorique commun est disponible pour les pays africains. Les lois, sanctions, documents administratifs et situations immersives sont traités séparément et ne sont jamais présentés comme des règles locales sans validation.</p>
        <Link href="/formation/immersive" className="mt-4 inline-flex rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">
          Ouvrir le laboratoire immersif →
        </Link>
      </div>
      <CoursesViewReal />
      <style jsx>{`[data-course-catalog] > div:last-child > div:first-child > div > h2 { display: none; }`}</style>
    </section>
  );
}
