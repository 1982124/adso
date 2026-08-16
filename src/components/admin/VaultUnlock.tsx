"use client";

import { useState } from "react";

export default function VaultUnlock() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sécurité.");
    } finally {
      setBusy(false);
    }
  }

  return (
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
  );
}
