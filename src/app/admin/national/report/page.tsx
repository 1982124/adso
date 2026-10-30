import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import PrintReportButton from "@/components/admin/PrintReportButton";

type Params = Promise<{ country?: string; period?: string }>;
const periods = { "30": 30, "90": 90, "365": 365, all: null } as const;
const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const pct = (n: number, d: number) => d ? Math.round(n / d * 100) + " %" : "Non calculable";

export default async function NationalReport({ searchParams }: { searchParams: Params }) {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  if (!hasMinRole(getUserRole(session), "admin")) redirect("/");
  const params = await searchParams;
  const key = params.period && params.period in periods ? params.period as keyof typeof periods : "90";
  const days = periods[key];
  const now = new Date();
  const since = days ? new Date(now.getTime() - days * 86400000) : undefined;
  const countries = await db.country.findMany({ where: { continent: { contains: "Africa", mode: "insensitive" } }, orderBy: { name: "asc" }, select: { code: true, name: true } });
  const codes = countries.map(c => c.code);
  const requested = (params.country || "all").toUpperCase();
  const selected = requested === "ALL" || codes.includes(requested) ? requested : "ALL";
  const selectedCodes = selected === "ALL" ? codes : [selected];
  const countryName = selected === "ALL" ? "Tous les pays africains référencés" : countries.find(c => c.code === selected)?.name || selected;
  if (!selectedCodes.length) return <main className="min-h-screen p-8"><h1>Rapport national ADSO AFRICA</h1><p>Aucun pays africain n’est référencé. Aucun résultat ne peut être calculé.</p></main>;

  const userWhere = { country: { in: selectedCodes } };
  const dateWhere = since ? { gte: since } : undefined;
  const [learners, enrollments, completed, attempts, passed, skillCount, skillGroups, sessions, risk, usersByCountry, attemptsByCountry] = await Promise.all([
    db.user.count({ where: userWhere }),
    db.enrollment.count({ where: { user: userWhere, ...(dateWhere ? { enrolledAt: dateWhere } : {}) } }),
    db.studentProgress.count({ where: { status: "completed", user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) } }),
    db.quizAttempt.count({ where: { country: { in: selectedCodes }, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.quizAttempt.count({ where: { country: { in: selectedCodes }, passed: true, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.skillRecord.count({ where: { user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) } }),
    db.skillRecord.groupBy({ by: ["category"], where: { user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) }, _count: { _all: true }, _avg: { level: true }, orderBy: { category: "asc" } }),
    db.drivingSession.count({ where: { user: userWhere, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.drivingSession.aggregate({ where: { user: userWhere, ...(dateWhere ? { createdAt: dateWhere } : {}) }, _sum: { speedViolations: true, harshBrakes: true, harshAccel: true, harshTurns: true, fatigueEvents: true, distractionEvents: true } }),
    db.user.groupBy({ by: ["country"], where: userWhere, _count: { _all: true } }),
    db.quizAttempt.groupBy({ by: ["country"], where: { country: { in: selectedCodes }, ...(dateWhere ? { createdAt: dateWhere } : {}) }, _count: { _all: true }, _avg: { score: true } }),
  ]);
  const riskRows = [
    ["Excès de vitesse", risk._sum.speedViolations || 0],
    ["Freinages brusques", risk._sum.harshBrakes || 0],
    ["Accélérations brusques", risk._sum.harshAccel || 0],
    ["Virages brusques", risk._sum.harshTurns || 0],
    ["Signaux de fatigue", risk._sum.fatigueEvents || 0],
    ["Distraction signalée", risk._sum.distractionEvents || 0],
  ] as const;
  const riskTotal = riskRows.reduce((sum, row) => sum + row[1], 0);
  const countryRows = countries.map(c => ({ ...c, learners: usersByCountry.find(r => r.country === c.code)?._count._all || 0, attempts: attemptsByCountry.find(r => r.country === c.code)?._count._all || 0, score: attemptsByCountry.find(r => r.country === c.code)?._avg.score ?? null })).filter(r => r.learners || r.attempts);
  const dateLabel = since ? "Depuis le " + since.toLocaleDateString("fr-FR") : "Depuis l’origine des données disponibles";

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl space-y-7 print:max-w-none">
        <nav className="flex flex-wrap justify-between gap-3 print:hidden">
          <Link className="text-sm font-semibold text-emerald-800" href={`/admin/national?country=${selected.toLowerCase()}&period=${key}`}>← Tableau de bord</Link>
          <div className="flex flex-wrap gap-2">
            {(["30", "90", "365", "all"] as const).map(p => <Link key={p} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" href={`/admin/national/report?country=${selected.toLowerCase()}&period=${p}`}>{p === "all" ? "Tout" : p + " jours"}</Link>)}
            <PrintReportButton />
          </div>
        </nav>
        <header className="border-b-2 border-emerald-800 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">ADSO AFRICA · Rapport institutionnel</p>
          <h1 className="mt-3 text-3xl font-black">Rapport national de formation et de prévention routière</h1>
          <h2 className="mt-3 text-xl font-bold">{countryName}</h2>
          <p className="mt-1 text-sm text-slate-600">{dateLabel} · Généré le {now.toLocaleString("fr-FR")}</p>
          <p className="mt-4 text-sm leading-6 text-slate-700">Ce rapport restitue exclusivement les données opérationnelles enregistrées dans ADSO. Il ne constitue pas une statistique officielle des accidents ou de la mortalité routière.</p>
        </header>
        <section>
          <h2 className="text-xl font-bold">1. Synthèse des formations et évaluations</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Apprenants enregistrés", fmt(learners)],
              ["Inscriptions", fmt(enrollments)],
              ["Parcours terminés", fmt(completed)],
              ["Taux de complétion", pct(completed, enrollments)],
              ["Tentatives d’évaluation", fmt(attempts)],
              ["Évaluations réussies", fmt(passed)],
              ["Taux de réussite", pct(passed, attempts)],
              ["Sessions de conduite", fmt(sessions)],
            ].map(([label, value]) => <article key={label} className="break-inside-avoid rounded-xl border border-slate-300 bg-white p-4"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></article>)}
          </div>
          <p className="mt-3 text-xs text-slate-500">Le nombre d’apprenants suit la même règle que le tableau de bord : comptes du périmètre pays, sans filtre de date. Les autres événements sont filtrés selon la période sélectionnée.</p>
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-xl font-bold">2. Compétences évaluées</h2>
          <p className="mt-2 text-sm text-slate-600">Niveaux internes SkillRecord ; ils ne constituent pas un permis ni une certification réglementaire.</p>
          {skillGroups.length ? <table className="mt-3 w-full border-collapse text-left text-sm"><thead><tr className="border-b-2 border-slate-400"><th className="py-2">Catégorie</th><th>Enregistrements</th><th>Niveau moyen</th></tr></thead><tbody>{skillGroups.map(row => <tr key={row.category} className="border-b border-slate-200"><td className="py-2">{row.category}</td><td>{fmt(row._count._all)}</td><td>{row._avg.level === null ? "Non disponible" : row._avg.level.toFixed(1)}</td></tr>)}</tbody></table> : <p className="mt-3 border border-dashed border-slate-300 p-4 text-sm">Aucun enregistrement de compétence pour cette période et ce périmètre.</p>}
          <p className="mt-3 text-sm">Enregistrements de compétences : <strong>{fmt(skillCount)}</strong> (pas nécessairement autant de personnes distinctes).</p>
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-xl font-bold">3. Signaux de prévention enregistrés</h2>
          <p className="mt-2 text-sm text-slate-600">Événements issus des sessions ADSO, et non décompte officiel d’accidents.</p>
          <p className="mt-3 text-2xl font-black">{fmt(riskTotal)} événements enregistrés</p>
          <table className="mt-3 w-full border-collapse text-left text-sm"><tbody>{riskRows.map(([label, value]) => <tr key={label} className="border-b border-slate-200"><td className="py-2">{label}</td><td className="py-2 text-right font-semibold">{fmt(value)}</td></tr>)}</tbody></table>
          <p className="mt-3 text-xs text-slate-500">Un total nul signifie qu’aucun événement correspondant n’est enregistré, pas que le risque est nul.</p>
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-xl font-bold">4. Couverture par pays</h2>
          {countryRows.length ? <table className="mt-3 w-full border-collapse text-left text-sm"><thead><tr className="border-b-2 border-slate-400"><th className="py-2">Pays</th><th>Apprenants</th><th>Évaluations</th><th>Score moyen</th></tr></thead><tbody>{countryRows.map(row => <tr key={row.code} className="border-b border-slate-200"><td className="py-2">{row.name} ({row.code})</td><td>{fmt(row.learners)}</td><td>{fmt(row.attempts)}</td><td>{row.score === null ? "Non disponible" : row.score.toFixed(1)}</td></tr>)}</tbody></table> : <p className="mt-3 text-sm">Aucun compte ou résultat d’évaluation enregistré dans le référentiel sélectionné.</p>}
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-xl font-bold">5. Limites méthodologiques et suites recommandées</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Les résultats reflètent uniquement les enregistrements ADSO disponibles à la date de génération.</li>
            <li>Les comptes sans pays correctement renseigné, les pays absents du référentiel et les sources nationales externes ne sont pas inclus.</li>
            <li>Les indicateurs pédagogiques ne démontrent pas à eux seuls une baisse des accidents ou des décès.</li>
            <li>L’évaluation de la mortalité exige des données officielles, des périodes comparables, des dénominateurs d’exposition et une méthode indépendante validée.</li>
            <li>Les permis, sanctions et reconnaissances officielles restent de la compétence des autorités habilitées.</li>
          </ul>
        </section>
        <footer className="border-t-2 border-slate-300 pt-4 text-xs leading-5 text-slate-500">
          <p><strong>Sources internes :</strong> Country, User, Enrollment, StudentProgress, QuizAttempt, SkillRecord et DrivingSession.</p>
          <p><strong>Horodatage :</strong> {now.toISOString()} · <strong>Périmètre :</strong> {countryName} · Rapport généré à la demande, sans données externes ni estimation de mortalité.</p>
          <p className="mt-2">Document de travail institutionnel à valider avec l’autorité nationale compétente avant publication comme rapport officiel.</p>
        </footer>
      </div>
      <style>{`@media print { body { background: white !important; } main { padding: 0 !important; } section, header, footer, article { break-inside: avoid; } nav { display: none !important; } @page { size: A4; margin: 16mm; } }`}</style>
    </main>
  );
}
