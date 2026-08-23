"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Period = "7d" | "30d" | "90d";
type Data = {
  generatedAt: string;
  period: Period;
  days: number;
  totals: { users: number; courses: number; countries: number; enrollments: number; certifications: number; auditLogs: number };
  activity: { events: number; newUsers: number; newEnrollments: number; newCertifications: number; attempts: number; progress: number; passRate: number };
  recentEvents: { id: string; eventType: string; metadata: string; createdAt: string }[];
};

type Bar = readonly [label: string, value: number];

const labels: Record<keyof Data["totals"], string> = {
  users: "Utilisateurs", courses: "Cours", countries: "Pays", enrollments: "Inscriptions", certifications: "Certifications", auditLogs: "Journal sécurité",
};

export default function LiveCockpit() {
  const [period, setPeriod] = useState<Period>("30d");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/cockpit?period=${period}`, { cache: "no-store" });
      if (!response.ok) throw new Error("cockpit");
      setData(await response.json());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    setLoading(true);
    load();
    const timer = window.setInterval(load, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const bars = useMemo<Bar[]>(() => data ? [
    ["Nouveaux utilisateurs", data.activity.newUsers],
    ["Nouvelles inscriptions", data.activity.newEnrollments],
    ["Certifications", data.activity.newCertifications],
    ["Tentatives d'examen", data.activity.attempts],
    ["Activités enregistrées", data.activity.events],
  ] : [], [data]);
  const max = Math.max(...bars.map(([, value]) => value), 1);

  return (
    <section aria-labelledby="live-cockpit-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Données vivantes</p>
          <h2 id="live-cockpit-heading" className="mt-1 text-xl font-bold">Cockpit opérationnel</h2>
          <p className="mt-1 text-xs text-slate-500">Actualisation automatique toutes les 60 secondes · lecture seule</p>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-white/[0.035] p-1" role="group" aria-label="Période">
          {(["7d", "30d", "90d"] as Period[]).map((item) => (
            <button key={item} type="button" onClick={() => setPeriod(item)} aria-pressed={period === item} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${period === item ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"}`}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">Les données du cockpit sont momentanément indisponibles. Aucun chiffre n'est remplacé par une donnée fictive.</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(labels) as (keyof Data["totals"])[]).map((key) => (
          <article key={key} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-emerald-400/25">
            <div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-400">{labels[key]}</p><span className="size-2 rounded-full bg-emerald-400" /></div>
            <p className="mt-3 text-3xl font-black tracking-tight">{loading && !data ? "—" : data?.totals[key].toLocaleString("fr-FR") ?? "—"}</p>
            <p className="mt-2 text-xs text-slate-500">Total réel en base</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold">Activité sur {data?.days ?? "—"} jours</h3><p className="mt-1 text-xs text-slate-500">Les barres sont calculées à partir des événements réels.</p></div><span className="text-xs font-semibold text-emerald-300">{data ? new Date(data.generatedAt).toLocaleTimeString("fr-FR") : "—"}</span></div>
          <div className="mt-5 space-y-4">
            {bars.map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between gap-3 text-xs"><span className="text-slate-300">{label}</span><strong>{value.toLocaleString("fr-FR")}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.max((value / max) * 100, value ? 4 : 0)}%` }} /></div></div>)}
          </div>
        </article>
        <article className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Qualité formation</p>
          <p className="mt-3 text-4xl font-black">{data?.activity.passRate ?? "—"}<span className="text-xl">%</span></p>
          <p className="mt-2 text-sm text-slate-400">Taux de réussite des tentatives d'examen sur la période sélectionnée.</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl border border-white/10 bg-black/10 p-3"><span className="text-slate-500">Progressions</span><strong className="mt-1 block text-lg">{data?.activity.progress.toLocaleString("fr-FR") ?? "—"}</strong></div><div className="rounded-xl border border-white/10 bg-black/10 p-3"><span className="text-slate-500">Événements</span><strong className="mt-1 block text-lg">{data?.activity.events.toLocaleString("fr-FR") ?? "—"}</strong></div></div>
        </article>
      </div>

      <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex items-center justify-between"><div><h3 className="font-semibold">Flux récent</h3><p className="mt-1 text-xs text-slate-500">Derniers événements Analytics enregistrés par ADSO.</p></div><span className="text-xs text-slate-500">{data?.recentEvents.length ?? 0} événements</span></div>
        <div className="mt-4 divide-y divide-white/5">{data?.recentEvents.length ? data.recentEvents.map((event) => <div key={event.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-medium text-slate-200">{event.eventType}</span><time className="text-xs text-slate-500" dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString("fr-FR")}</time></div>) : <p className="py-5 text-sm text-slate-500">Aucun événement Analytics enregistré récemment.</p>}</div>
      </article>
    </section>
  );
}
