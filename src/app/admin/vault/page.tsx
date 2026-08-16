"use client";

import { useState } from "react";

export default function AdminVaultPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  async function unlock() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/vault/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Impossible d'ouvrir le coffre-fort.");
      setUnlocked(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sécurité.");
    } finally {
      setBusy(false);
    }
  }

  if (unlocked) {
    return (
      <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-cyan-950/30 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🔐 Coffre-fort personnel ADSO</p>
            <h1 className="mt-3 text-3xl font-black">Zone financière et stratégique</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Cette zone est séparée de Françoise et des autres assistants. Les données sensibles doivent rester accessibles uniquement à l'administrateur autorisé.</p>
          </div>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["💰 Revenus par service", "💳 Paiements & transactions", "📈 Chiffre d'affaires", "🏦 Informations financières", "🔑 Secrets & intégrations", "🛡️ Journal de sécurité"].map((item) => (
              <article key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <h2 className="font-semibold">{item}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">Données réservées au propriétaire du coffre-fort.</p>
              </article>
            ))}
          </section>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5 text-sm leading-6 text-amber-100/80">Protection active : Françoise ne reçoit pas les données de cette zone et aucune réponse de l'assistante ne doit permettre de contourner cette séparation.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
        <section className="w-full rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-7 shadow-2xl sm:p-9">
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl">🔐</div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">ADSO · Cockpit Direction</p>
            <h1 className="mt-2 text-2xl font-black">Coffre-fort personnel</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Cette zone exige un mot de passe distinct de votre authentification administrateur.</p>
          </div>
          <div className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-slate-200" htmlFor="vault-password">Mot de passe personnel</label>
            <input id="vault-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void unlock(); }} className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" placeholder="Votre mot de passe du coffre-fort" />
            {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
            <button type="button" disabled={busy || !password} onClick={() => void unlock()} className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Vérification…" : "Ouvrir le coffre-fort"}</button>
          </div>
          <p className="mt-6 text-center text-xs leading-5 text-slate-600">Ne saisissez jamais ce mot de passe dans Françoise, un chat ou un champ public.</p>
        </section>
      </div>
    </main>
  );
}
