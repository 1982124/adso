import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, getUserRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasMinRole } from "@/lib/rbac";
import AdminAIAssistant from "@/components/admin/AdminAIAssistant";
import RoadSafetyCountryTable from "@/components/admin/RoadSafetyCountryTable";

const cards = [
  { key: "users", label: "Utilisateurs", description: "Comptes ADSO" },
  { key: "courses", label: "Cours", description: "Parcours pédagogiques" },
  { key: "countries", label: "Pays", description: "Référentiels nationaux" },
  { key: "enrollments", label: "Inscriptions", description: "Apprenants actifs" },
  { key: "certifications", label: "Certifications", description: "Titres délivrés" },
  { key: "auditLogs", label: "Journal sécurité", description: "Événements d'audit" },
] as const;

const hubs = [
  { href: "/admin", label: "📊 Cockpit Direction", description: "Pilotage, sécurité et indicateurs" },
  { href: "/offres", label: "💳 Offres ADSO", description: "Offres découverte et LOW-PAY" },
  { href: "/formation/cas-visuels", label: "👁️ Cas visuels", description: "Bibliothèque d'apprentissage par situations" },
];

export default async function AdminCockpitPage() {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user) redirect("/");
  if (!hasMinRole(role, "admin")) redirect("/");

  const [users, courses, countries, enrollments, certifications, auditLogs] = await Promise.all([
    db.user.count(), db.course.count(), db.country.count(), db.enrollment.count(), db.certification.count(), db.auditLogEntry.count(),
  ]);
  const values = { users, courses, countries, enrollments, certifications, auditLogs };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">ADSO Cockpit</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Centre de pilotage</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Vue opérationnelle protégée pour superviser la plateforme, ses contenus, ses apprenants et son périmètre international.</p>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">Connecté · {role}</div>
        </header>

        <nav aria-label="Accès rapides" className="grid gap-3 sm:grid-cols-3">
          {hubs.map((hub) => (
            <Link key={hub.href} href={hub.href} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-400/30 hover:bg-white/[0.07]">
              <p className="font-semibold">{hub.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{hub.description}</p>
            </Link>
          ))}
        </nav>

        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.08] to-cyan-400/[0.05] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🤖 Assistante de Direction ADSO</p>
              <h2 className="mt-2 text-2xl font-semibold">Le cockpit stratégique est ici.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Analysez les données réelles d'ADSO, les risques, la formation, les pays et l'activité de la plateforme. Les actions sensibles restent soumises à validation humaine.</p>
            </div>
            <a href="#assistant" className="shrink-0 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-200">Ouvrir l'assistante ↓</a>
          </div>
        </section>

        <div id="assistant"><AdminAIAssistant /></div>

        <section aria-label="Indicateurs principaux" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/10">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{values[card.key].toLocaleString("fr-FR")}</p>
              <p className="mt-2 text-xs text-slate-500">{card.description}</p>
            </article>
          ))}
        </section>

        <RoadSafetyCountryTable />

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-semibold">Architecture de supervision</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Utilisateurs & rôles", "Contenus & formations", "Pays & réglementations", "Examens & certifications", "Organisations & partenaires", "Assurance & prévention", "Trajets & sécurité routière", "Audit & sécurité"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-6">
            <p className="text-sm font-medium text-emerald-300">Sécurité</p>
            <h2 className="mt-2 text-lg font-semibold">Accès administrateur contrôlé</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Cette interface n'est pas publique. L'accès exige une session authentifiée avec un rôle administrateur ou supérieur. Les actions sensibles restent soumises à validation humaine.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
