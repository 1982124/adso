import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";

type SearchParams = Promise<{ country?: string; period?: string }>;
const PERIODS = { "30": 30, "90": 90, "365": 365, all: null } as const;

function metric(value: number) { return new Intl.NumberFormat("fr-FR").format(value); }
function percent(numerator: number, denominator: number) {
  return denominator > 0 ? `${Math.round((numerator / denominator) * 100)} %` : "Non calculable";
}

export default async function NationalDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  const role = getUserRole(session);
  if (!hasMinRole(role, "admin")) redirect("/");

  const params = await searchParams;
  const periodKey = params.period && params.period in PERIODS ? params.period as keyof typeof PERIODS : "90";
  const days = PERIODS[periodKey];
  const since = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;
  const countries = await db.country.findMany({
    where: { continent: { contains: "Africa", mode: "insensitive" } },
    orderBy: { name: "asc" },
    select: { code: true, name: true },
  });
  const countryCodes = countries.map((country) => country.code);
  const requestedCountry = (params.country || "all").toUpperCase();
  const selectedCountry = requestedCountry === "ALL" || countryCodes.includes(requestedCountry) ? requestedCountry : "ALL";
  const codes = selectedCountry === "ALL" ? countryCodes : [selectedCountry];

  if (codes.length === 0) {
    return <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-8"><div className="mx-auto max-w-6xl"><Link href="/admin" className="text-sm text-emerald-300">← Cockpit direction</Link><h1 className="mt-5 text-3xl font-black">Tableau de bord national ADSO AFRICA</h1><p className="mt-4 rounded-xl border border-amber-300/20 p-5 text-sm text-amber-100">Aucun pays africain n’est actuellement référencé dans le catalogue des pays. Le tableau ne peut pas agréger de données nationales sans référentiel pays vérifié.</p></div></main>;
  }

  const userWhere = { country: { in: codes } };
  const dateWhere = since ? { gte: since } : undefined;
  const [
    learners,
    enrollments,
    completed,
    attempts,
    passedAttempts,
    skillCount,
    skillCategories,
    drivingSessions,
    drivingRisk,
    countryUsers,
    countryAttempts,
  ] = await Promise.all([
    db.user.count({ where: userWhere }),
    db.enrollment.count({ where: { user: userWhere, ...(dateWhere ? { enrolledAt: dateWhere } : {}) } }),
    db.studentProgress.count({ where: { status: "completed", user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) } }),
    db.quizAttempt.count({ where: { country: { in: codes }, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.quizAttempt.count({ where: { country: { in: codes }, passed: true, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.skillRecord.count({ where: { user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) } }),
    db.skillRecord.groupBy({ by: ["category"], where: { user: userWhere, ...(dateWhere ? { updatedAt: dateWhere } : {}) }, _count: { _all: true }, _avg: { level: true }, orderBy: { category: "asc" } }),
    db.drivingSession.count({ where: { user: userWhere, ...(dateWhere ? { createdAt: dateWhere } : {}) } }),
    db.drivingSession.aggregate({ where: { user: userWhere, ...(dateWhere ? { createdAt: dateWhere } : {}) }, _sum: { speedViolations: true, harshBrakes: true, harshAccel: true, harshTurns: true, fatigueEvents: true, distractionEvents: true }, _count: { _all: true } }),
    db.user.groupBy({ by: ["country"], where: userWhere, _count: { _all: true } }),
    db.quizAttempt.groupBy({ by: ["country"], where: { country: { in: codes }, ...(dateWhere ? { createdAt: dateWhere } : {}) }, _count: { _all: true }, _avg: { score: true } }),
  ]);

  const completionRate = percent(completed, enrollments);
  const successRate = percent(passedAttempts, attempts);
  const riskEvents = (drivingRisk._sum.speedViolations || 0) + (drivingRisk._sum.harshBrakes || 0) + (drivingRisk._sum.harshAccel || 0) + (drivingRisk._sum.harshTurns || 0) + (drivingRisk._sum.fatigueEvents || 0) + (drivingRisk._sum.distractionEvents || 0);
  const selectedName = selectedCountry === "ALL" ? "Tous les pays africains référencés" : countries.find((country) => country.code === selectedCountry)?.name || selectedCountry;
  const countryRows = countries.map((country) => ({
    ...country,
    learners: countryUsers.find((row) => row.country === country.code)?._count._all || 0,
    attempts: countryAttempts.find((row) => row.country === country.code)?._count._all || 0,
    averageScore: countryAttempts.find((row) => row.country === country.code)?._avg.score ?? null,
  })).filter((country) => country.learners > 0 || country.attempts > 0);

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">← Cockpit direction</Link>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">ADSO AFRICA · Pilotage institutionnel</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Tableau de bord national</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Suivi des formations, compétences évaluées et signaux de prévention issus des enregistrements ADSO. Les indicateurs ne mesurent pas directement les accidents évités ni les décès réduits.</p>
          </div>
          <form action="/admin/national" method="get" className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <label className="text-xs text-slate-400">Périmètre<select name="country" defaultValue={selectedCountry.toLowerCase() === "all" ? "all" : selectedCountry} className="mt-1 block rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white">{<option value="all">Tous les pays référencés</option>}{countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select></label>
            <label className="text-xs text-slate-400">Période<select name="period" defaultValue={periodKey} className="mt-1 block rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"><option value="30">30 derniers jours</option><option value="90">90 derniers jours</option><option value="365">12 derniers mois</option><option value="all">Depuis l’origine des données</option></select></label>
            <button type="submit" className="self-end rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950">Appliquer</button>
          </form>
        </header>

        <section className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4 text-sm text-slate-300">
          <strong className="text-emerald-200">Périmètre affiché :</strong> {selectedName} · {days ? `les ${days} derniers jours` : "toute la période disponible"}. Les nombres sont calculés à partir des enregistrements présents dans la base ADSO au moment de la consultation. L’absence d’enregistrement n’est pas une preuve d’absence d’activité routière.
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs de formation">
          {[
            ["Apprenants enregistrés", metric(learners), "Comptes dont le pays correspond au périmètre"],
            ["Inscriptions en formation", metric(enrollments), "Inscriptions sur la période sélectionnée"],
            ["Parcours terminés", metric(completed), "Progressions marquées « completed »"],
            ["Taux de complétion", completionRate, "Terminés / inscriptions ; non calculable sans inscription"],
          ].map(([label, value, note]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-3xl font-black tabular-nums">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{note}</p></article>)}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs de compétences">
          {[
            ["Tentatives d’évaluation", metric(attempts), "Tentatives enregistrées dans QuizAttempt"],
            ["Évaluations réussies", metric(passedAttempts), "Tentatives marquées réussies"],
            ["Taux de réussite", successRate, "Réussites / tentatives ; non calculable sans tentative"],
            ["Compétences suivies", metric(skillCount), "Enregistrements SkillRecord, pas nombre de personnes uniques"],
          ].map(([label, value, note]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-3xl font-black tabular-nums">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{note}</p></article>)}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold">Compétences évaluées</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Répartition par catégorie et niveau moyen enregistré (échelle interne SkillRecord). Ce niveau n’est pas une certification officielle.</p>
            {skillCategories.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-white/15 p-5 text-sm text-slate-400">Aucun enregistrement de compétence pour ce périmètre et cette période.</p> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-3">Catégorie</th><th className="pb-3">Enregistrements</th><th className="pb-3">Niveau moyen</th></tr></thead><tbody className="divide-y divide-white/10">{skillCategories.map((item) => <tr key={item.category}><td className="py-3 font-medium">{item.category}</td><td className="py-3 tabular-nums">{metric(item._count._all)}</td><td className="py-3 tabular-nums">{item._avg.level === null ? "Non disponible" : item._avg.level.toFixed(1)}</td></tr>)}</tbody></table></div>}
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold">Signaux de prévention enregistrés</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Données déclarées ou calculées dans les sessions de conduite ADSO. Elles ne constituent pas un décompte officiel d’accidents.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Sessions de conduite</p><p className="mt-2 text-2xl font-black">{metric(drivingSessions)}</p></div>
              <div className="rounded-xl bg-slate-900 p-4"><p className="text-xs text-slate-400">Événements de risque signalés</p><p className="mt-2 text-2xl font-black">{metric(riskEvents)}</p></div>
              {[
                ["Excès de vitesse", drivingRisk._sum.speedViolations || 0],
                ["Freinages brusques", drivingRisk._sum.harshBrakes || 0],
                ["Accélérations brusques", drivingRisk._sum.harshAccel || 0],
                ["Virages brusques", drivingRisk._sum.harshTurns || 0],
                ["Signaux de fatigue", drivingRisk._sum.fatigueEvents || 0],
                ["Distraction signalée", drivingRisk._sum.distractionEvents || 0],
              ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 border-b border-white/5 py-2 text-sm"><span className="text-slate-400">{label}</span><strong className="tabular-nums">{metric(Number(value))}</strong></div>)}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Un total nul signifie qu’aucun événement correspondant n’est enregistré dans le périmètre sélectionné ; il ne signifie pas que le risque est nul.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-bold">Couverture par pays</h2>
          <p className="mt-2 text-sm text-slate-400">Comptes apprenants et tentatives d’évaluation disponibles par code pays. Les pays sans enregistrement ne sont pas présentés comme ayant zéro accident ou zéro risque.</p>
          {countryRows.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-white/15 p-5 text-sm text-slate-400">Aucun compte ou résultat d’évaluation enregistré dans le référentiel pays africain pour la période sélectionnée.</p> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="pb-3">Pays</th><th className="pb-3">Apprenants</th><th className="pb-3">Évaluations</th><th className="pb-3">Score moyen</th></tr></thead><tbody className="divide-y divide-white/10">{countryRows.map((country) => <tr key={country.code}><td className="py-3 font-medium">{country.name} <span className="text-xs text-slate-500">{country.code}</span></td><td className="py-3 tabular-nums">{metric(country.learners)}</td><td className="py-3 tabular-nums">{metric(country.attempts)}</td><td className="py-3 tabular-nums">{country.averageScore === null ? "Non disponible" : country.averageScore.toFixed(1)}</td></tr>)}</tbody></table></div>}
        </section>

        <footer className="border-t border-white/10 pt-5 text-xs leading-6 text-slate-500">
          <p><strong className="text-slate-300">Limites méthodologiques :</strong> ce tableau exploite les données opérationnelles actuellement présentes dans ADSO (User.country, Enrollment, StudentProgress, QuizAttempt, SkillRecord et DrivingSession). Les pays absents du référentiel, les comptes dont le pays est mal renseigné, les données historiques non structurées et les sources nationales externes ne sont pas inclus.</p>
          <p className="mt-2">Aucun chiffre de décès, d’accidents évités ou de baisse de mortalité n’est calculé à partir des formations. Pour cela, il faudra des données officielles nationales, des périodes comparables, des dénominateurs d’exposition et une méthode d’évaluation validée par les autorités.</p>
        </footer>
      </div>
    </main>
  );
}
