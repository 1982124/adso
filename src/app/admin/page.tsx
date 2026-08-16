import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, getUserRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasMinRole } from "@/lib/rbac";
import AdminAIAssistant from "@/components/admin/AdminAIAssistant";
import RoadSafetyCountryTable from "@/components/admin/RoadSafetyCountryTable";

const cards = [
  { key: "users", label: "Utilisateurs", description: "Comptes ADSO", tone: "emerald" },
  { key: "courses", label: "Cours", description: "Parcours pédagogiques", tone: "cyan" },
  { key: "countries", label: "Pays", description: "Référentiels nationaux", tone: "amber" },
  { key: "enrollments", label: "Inscriptions", description: "Apprenants actifs", tone: "violet" },
  { key: "certifications", label: "Certifications", description: "Titres délivrés", tone: "blue" },
  { key: "auditLogs", label: "Journal sécurité", description: "Événements d'audit", tone: "rose" },
] as const;

const hubs = [
  { href: "/admin", label: "📊 Cockpit Direction", description: "Pilotage, sécurité et indicateurs" },
  { href: "/admin/vault", label: "🔐 Coffre-fort personnel", description: "Zone financière et stratégique protégée" },
  { href: "/admin/leads", label: "🎯 IA Leads Tracker", description: "Prospects, sources, offres et opportunités" },
  { href: "/offres", label: "💳 Offres ADSO", description: "Offres découverte et LOW-PAY" },
  { href: "/formation/cas-visuels", label: "👁️ Cas visuels", description: "Bibliothèque d'apprentissage par situations" },
];

const modules = [
  ["🌍", "Observatoire", "Pays, indicateurs, tendances et sources"],
  ["📚", "Académie", "Cours, progression, examens et certifications"],
  ["🚦", "Sécurité routière", "Signalisation, réglementation et prévention"],
  ["🎯", "Acquisition", "Leads, offres, campagnes et conversion"],
  ["🛡️", "Gouvernance", "Rôles, audit, sécurité et conformité"],
  ["🤖", "Intelligence", "Françoise, assistante de Direction et analyses"],
] as const;

export default async function AdminCockpitPage() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");

  const role = getUserRole(session);
  if (!hasMinRole(role, "admin")) redirect("/");

  const [users, courses, countries, enrollments, certifications, auditLogs] = await Promise.all([
    db.user.count(), db.course.count(), db.country.count(), db.enrollment.count(), db.certification.count(), db.auditLogEntry.count(),
  ]);
  const values = { users, courses, countries, enrollments, certifications, auditLogs };

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-cyan-950/30 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300"><span>ADSO</span><span className="text-white/30">/</span><span>Cockpit Direction</span></div>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Centre de pilotage</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">Une vue unique pour piloter l'apprentissage, la sécurité routière, les territoires, l'acquisition et les opérations internationales.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-emerald-300">● Système ADSO</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">Rôle · {role}</span></div>
          </div>
        </header>
        <nav aria-label="Accès rapides" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{hubs.map((hub) => <Link key={hub.href} href={hub.href} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-400"><p className="font-semibold text-white">{hub.label}<span className="ml-2 text-emerald-400 opacity-0 transition group-hover:opacity-100">→</span></p><p className="mt-1 text-xs leading-5 text-slate-400">{hub.description}</p></Link>)}</nav>
        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.09] via-cyan-400/[0.04] to-transparent p-5 sm:p-6" aria-labelledby="assistant-heading"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🤖 FRANÇOISE · ASSISTANTE DE DIRECTION ADSO</p><h2 id="assistant-heading" className="mt-2 text-xl font-bold sm:text-2xl">Françoise — votre cockpit décisionnel.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Analysez les données réelles d'ADSO, les risques, la formation, les pays et l'activité. Les recommandations sont séparées des données observées et les actions sensibles restent soumises à validation humaine.</p></div><a href="#assistant" className="shrink-0 rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300">Parler à Françoise ↓</a></div></section>
        <div id="assistant" className="scroll-mt-6"><AdminAIAssistant /></div>
        <section aria-labelledby="kpi-heading"><div className="mb-3 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Vue instantanée</p><h2 id="kpi-heading" className="mt-1 text-xl font-bold">Indicateurs ADSO</h2></div><span className="text-xs text-slate-500">Données du cockpit</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{cards.map((card) => <article key={card.key} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/20"><div className="flex items-start justify-between gap-4"><p className="text-sm text-slate-400">{card.label}</p><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.55)]" /></div><p className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{values[card.key].toLocaleString("fr-FR")}</p><p className="mt-2 text-xs text-slate-500">{card.description}</p></article>)}</div></section>
        <section aria-labelledby="modules-heading"><div className="mb-3"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Navigation stratégique</p><h2 id="modules-heading" className="mt-1 text-xl font-bold">Les domaines à piloter</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([icon, title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/55 p-5"><div className="text-xl" aria-hidden="true">{icon}</div><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-400">{description}</p></article>)}</div></section>
        <RoadSafetyCountryTable />
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"><article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><h2 className="text-lg font-semibold">Architecture de supervision</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{["Utilisateurs & rôles", "Contenus & formations", "Pays & réglementations", "Examens & certifications", "Organisations & partenaires", "Assurance & prévention", "Trajets & sécurité routière", "Audit & sécurité", "Leads & acquisition"].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">{item}</div>)}</div></article><article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-6"><p className="text-sm font-medium text-emerald-300">Sécurité</p><h2 className="mt-2 text-lg font-semibold">Accès administrateur contrôlé</h2><p className="mt-3 text-sm leading-6 text-slate-400">Cette interface n'est pas publique. L'accès exige une session authentifiée avec un rôle administrateur ou supérieur. Les actions sensibles restent soumises à validation humaine.</p></article></section>
      </div>
    </main>
  );
}
