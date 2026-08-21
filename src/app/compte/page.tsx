import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

export default async function ComptePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/connexion');

  const user = session.user as typeof session.user & { role?: string };
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Mon espace</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Bienvenue{user.name ? `, ${user.name}` : ''}.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Votre compte ADSO est actif. Retrouvez ici les accès à votre parcours et à votre bibliothèque.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/formation" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400/40 hover:bg-emerald-400/5">
            <h2 className="font-bold">Mon parcours</h2>
            <p className="mt-2 text-sm text-slate-400">Reprendre votre expérience de formation ADSO.</p>
          </Link>
          <Link href="/ebooks" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400/40 hover:bg-emerald-400/5">
            <h2 className="font-bold">Ma bibliothèque</h2>
            <p className="mt-2 text-sm text-slate-400">Retrouver les eBooks auxquels vous avez accès.</p>
          </Link>
          {isAdmin ? <Link href="/admin" className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 transition hover:bg-amber-400/10 sm:col-span-2"><h2 className="font-bold text-amber-200">Cockpit Direction</h2><p className="mt-2 text-sm text-slate-400">Accès réservé à votre rôle administrateur.</p></Link> : null}
        </div>
        <p className="mt-8"><Link href="/" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">← Retour à ADSO</Link></p>
      </section>
    </main>
  );
}
