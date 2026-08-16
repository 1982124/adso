"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    if (!result?.ok) {
      setError("Identifiants invalides ou accès administrateur non autorisé.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050a0a] px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl sm:p-8" aria-labelledby="admin-login-title">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Administration</p>
          <h1 id="admin-login-title" className="mt-3 text-3xl font-black tracking-tight">Connexion administrateur</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Cette entrée est réservée aux comptes ADSO autorisés à accéder au Cockpit Direction.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
            <input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" placeholder="admin@adso..." />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-200">Mot de passe</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" />
          </div>

          {error ? <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-300">
            {loading ? "Vérification…" : "Accéder au Cockpit"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">Les secrets du coffre-fort ne sont jamais demandés ni exposés sur cette page.</p>
      </section>
    </main>
  );
}
