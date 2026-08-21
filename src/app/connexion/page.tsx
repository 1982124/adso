'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ConnexionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/student' });
      if (!result?.ok) {
        setError('Email ou mot de passe incorrect.');
        return;
      }
      router.replace('/student');
      router.refresh();
    } catch {
      setError('Impossible de se connecter pour le moment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:py-16">
      <section className="mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Compte utilisateur</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Se connecter</h1>
        {params.get('created') === '1' ? <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Votre compte est créé. Connectez-vous pour continuer.</p> : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">Mot de passe</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{showPassword ? 'Masquer' : 'Afficher'}</button>
            </div>
          </div>
          {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Pas encore de compte ? <Link href="/inscription" className="font-semibold text-emerald-300 hover:text-emerald-200">Créer mon compte</Link></p>
      </section>
    </main>
  );
}
