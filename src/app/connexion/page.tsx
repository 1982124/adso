'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/compte' });
    if (!result?.ok) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }
    router.replace('/compte');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl sm:p-8" aria-labelledby="login-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Compte</p>
        <h1 id="login-title" className="mt-3 text-3xl font-black tracking-tight">Connexion</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Accédez à votre parcours ADSO, vos formations et votre bibliothèque.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
            <input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-200">Mot de passe</label>
            <div className="relative">
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{showPassword ? 'Masquer' : 'Afficher'}</button>
            </div>
          </div>
          {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Pas encore de compte ? <Link href="/inscription" className="font-bold text-emerald-300 hover:text-emerald-200">Créer mon compte</Link></p>
        <p className="mt-3 text-center text-xs text-slate-600"><Link href="/admin" className="hover:text-slate-400">Administration ADSO</Link></p>
      </section>
    </main>
  );
}
