'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || 'Impossible de créer le compte.');
        return;
      }

      const login = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/student',
      });
      if (!login?.ok) {
        router.replace('/connexion?created=1');
        return;
      }
      router.replace('/student');
      router.refresh();
    } catch {
      setError('Une erreur réseau est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:py-16">
      <section className="mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Compte utilisateur</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Créer votre compte ADSO</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Un compte gratuit vous permet de retrouver votre progression et de construire votre parcours ADSO.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold">Nom complet</label>
            <input id="name" name="name" type="text" autoComplete="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">Mot de passe</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{showPassword ? 'Masquer' : 'Afficher'}</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">10 caractères minimum, avec majuscule, minuscule et chiffre.</p>
          </div>
          <div>
            <label htmlFor="confirmation" className="mb-2 block text-sm font-semibold">Confirmer le mot de passe</label>
            <div className="relative">
              <input id="confirmation" name="confirmation" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" />
              <button type="button" onClick={() => setShowConfirmation((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{showConfirmation ? 'Masquer' : 'Afficher'}</button>
            </div>
          </div>
          {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Création du compte…' : 'Créer mon compte'}</button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-slate-400 sm:flex-row sm:justify-center sm:gap-1">
          <span>Vous avez déjà un compte ?</span>
          <Link href="/connexion" className="font-semibold text-emerald-300 hover:text-emerald-200">Se connecter</Link>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">L'adresse administrateur ADSO est réservée au compte Direction et ne peut pas être créée par l'inscription publique.</p>
      </section>
    </main>
  );
}
