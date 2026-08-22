import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import AdminAIAssistant from "@/components/admin/AdminAIAssistant";
import LiveCockpit from "@/components/admin/LiveCockpit";
import RoadSafetyCountryTable from "@/components/admin/RoadSafetyCountryTable";

const hubs = [
  { href: "/admin", label: "📊 Cockpit Direction", description: "Pilotage, sécurité et indicateurs" },
  { href: "/cockpit", label: "🖼️ Gestion du Home", description: "Importer, prévisualiser, publier et restaurer l'image du Home" },
  { href: "/admin/ebooks", label: "📚 Gestion des E-books", description: "Importer, faire analyser par ADSO AI, configurer la vente et publier" },
  { href: "/admin/ebooks/analytics", label: "📈 E-books · Tracking & ventes", description: "Funnel, campagnes, commandes et revenus vérifiés" },
  { href: "/admin/vault", label: "🔐 Coffre-fort personnel", description: "Zone financière et stratégique protégée" },
  { href: "/admin/leads", label: "🎯 IA Leads Tracker", description: "Prospects, sources, offres et opportunités" },
  { href: "/offres", label: "💳 Offres ADSO", description: "Offres découverte et LOW-PAY" },
  { href: "/formation/cas-visuels", label: "👁️ Cas visuels", description: "Bibliothèque d'apprentissage par situations" },
];

export default async function AdminCockpitPage() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  const role = getUserRole(session);
  if (!hasMinRole(role, "admin")) redirect("/");

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-cyan-950/30 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300"><span>ADSO</span><span className="text-white/30">/</span><span>Cockpit Direction</span></div>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Centre de pilotage</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">Prévention, formation, simulation, certification et pilotage de la sécurité routière — avec des indicateurs issus des données réelles d'ADSO.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-emerald-300">● Système ADSO</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">Rôle · {role}</span></div>
          </div>
        </header>

        <nav aria-label="Accès rapides" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((hub) => <Link key={hub.href} href={hub.href} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-400"><p className="font-semibold text-white">{hub.label}<span className="ml-2 text-emerald-400 opacity-0 transition group-hover:opacity-100">→</span></p><p className="mt-1 text-xs leading-5 text-slate-400">{hub.description}</p></Link>)}
        </nav>

        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.09] via-cyan-400/[0.04] to-transparent p-5 sm:p-6" aria-labelledby="assistant-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🤖 FRANÇOISE · ASSISTANTE DE DIRECTION ADSO</p><h2 id="assistant-heading" className="mt-2 text-xl font-bold sm:text-2xl">Françoise — votre cockpit décisionnel.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Les données observées sont séparées des recommandations. Les actions sensibles restent soumises à validation humaine.</p></div>
            <a href="#assistant" className="shrink-0 rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300">Parler à Françoise ↓</a>
          </div>
        </section>

        <div id="assistant" className="scroll-mt-6"><AdminAIAssistant /></div>

        <LiveCockpit />

        <RoadSafetyCountryTable />

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Architecture de supervision</p>
            <h2 className="mt-1 text-lg font-semibold">Les domaines à piloter</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["🌍", "Observatoire", "Pays, indicateurs, tendances et sources", "/admin"],
                ["📚", "Académie", "Cours, progression, examens et certifications", "/formation"],
                ["🚦", "Sécurité routière", "Signalisation, réglementation et prévention", "/securite"],
                ["🎯", "Acquisition", "Leads, offres, campagnes et conversion", "/admin/leads"],
                ["🛡️", "Gouvernance", "Rôles, audit, sécurité et conformité", "/admin"],
                ["🤖", "Intelligence", "Françoise et analyses décisionnelles", "#assistant"],
              ].map(([icon, title, description, href]) => <Link key={title} href={href} className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.04]"><span aria-hidden="true">{icon}</span><strong className="ml-2 text-sm text-white">{title}</strong><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></Link>)}
            </div>
          </article>
          <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-6"><p className="text-sm font-medium text-emerald-300">Sécurité</p><h2 className="mt-2 text-lg font-semibold">Accès administrateur contrôlé</h2><p className="mt-3 text-sm leading-6 text-slate-400">Cette interface n'est pas publique. L'accès exige une session authentifiée avec un rôle administrateur ou supérieur. Les actions sensibles restent soumises à validation humaine.</p></article>
        </section>
      </div>
    </main>
  );
}
