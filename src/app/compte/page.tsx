import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, getUserRole } from '@/lib/auth';

export default async function ComptePage() {
  const session = await getSession();
  if (!session?.user) redirect('/connexion');

  const role = getUserRole(session);
  const name = session.user.name || session.user.email || 'Utilisateur ADSO';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:py-16">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">ADSO · Mon compte</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Bienvenue, {name}</h1>
        <p className="mt-3 text-slate-600">Votre compte ADSO est actif. Retrouvez votre parcours, votre progression et les expériences auxquelles vous avez accès.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/student" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-100">
            <p className="font-bold text-emerald-900">Mon parcours</p>
            <p className="mt-1 text-sm text-emerald-800/70">Continuer l'apprentissage ADSO.</p>
          </Link>
          <Link href="/marketplace/ebooks" className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-slate-50">
            <p className="font-bold">Marketplace eBook</p>
            <p className="mt-1 text-sm text-slate-500">Découvrir les publications disponibles.</p>
          </Link>
          {['admin', 'super_admin'].includes(role) ? (
            <Link href="/admin" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-400 hover:bg-amber-100 sm:col-span-2">
              <p className="font-bold text-amber-900">Cockpit Direction</p>
              <p className="mt-1 text-sm text-amber-800/70">Accès administrateur autorisé.</p>
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
