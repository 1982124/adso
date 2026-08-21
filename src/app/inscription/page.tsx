'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';

function RegistrationForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) return setError('Les deux mots de passe ne correspondent pas.');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) return setError(data.error || 'Impossible de créer le compte.');

      const login = await signIn('credentials', { email, password, redirect: false });
      if (!login?.ok) return setError('Compte créé, mais la connexion automatique a échoué. Connectez-vous depuis ADSO.');
      window.location.assign(from.startsWith('/') ? from : '/');
    } catch {
      setError('Une erreur réseau est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <div className="text-sm font-bold tracking-[0.2em] text-emerald-300">ADSO SAFETY</div>
        <h1 className="mt-3 text-3xl font-black">Créer mon compte</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">Rejoignez ADSO pour commencer votre parcours et conserver votre progression.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold">Nom<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400" /></label>
          <label className="block text-sm font-semibold">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400" /></label>
          <label className="block text-sm font-semibold">Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400" /></label>
          <label className="block text-sm font-semibold">Confirmer le mot de passe<input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400" /></label>
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 disabled:opacity-50">{loading ? 'Création…' : 'Créer mon compte ADSO'}</button>
        </form>
        <p className="mt-5 text-center text-sm text-white/50">Vous avez déjà un compte ? <Link href="/" className="font-bold text-emerald-300">Se connecter</Link></p>
      </div>
    </main>
  );
}

export default function RegistrationPage() {
  return <Suspense fallback={<main className="min-h-screen bg-slate-950" />}><RegistrationForm /></Suspense>;
}
