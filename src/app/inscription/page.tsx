'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Impossible de créer le compte.');
        return;
      }
      router.replace(`/connexion?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Impossible de contacter ADSO. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl sm:p-8" aria-labelledby="signup-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Compte</p>
        <h1 id="signup-title" className="mt-3 text-3xl font-black tracking-tight">Créer mon compte</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Créez votre espace ADSO pour suivre votre parcours, vos formations et votre bibliothèque.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-slate-200">Nom</label>
            <input id="signup-name" name="name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
            <input id="signup-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-slate-200">Mot de passe</label>
            <div className="relative">
              <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">{showPassword ? 'Masquer' : 'Afficher'}</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">10 caractères minimum, avec majuscule, minuscule et chiffre.</p>
          </div>
          <div>
            <label htmlFor="signup-confirmation" className="mb-2 block text-sm font-semibold text-slate-200">Confirmer le mot de passe</label>
            <input id="signup-confirmation" name="confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
          </div>
          {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Création…' : 'Créer mon compte'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Déjà un compte ? <Link href="/connexion" className="font-bold text-emerald-300 hover:text-emerald-200">Se connecter</Link></p>
        <p className="mt-4 text-center text-xs text-slate-600">Le compte Direction ADSO utilise une entrée d'administration séparée.</p>
      </section>
    </main>
  );
}
