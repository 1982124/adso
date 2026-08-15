import { getRoadSafetySummaries } from "@/lib/road-safety";

export default async function RoadSafetyCountryTable() {
  let data;
  try {
    data = await getRoadSafetySummaries();
  } catch {
    return (
      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
        <h2 className="text-lg font-semibold">Sécurité routière — données pays</h2>
        <p className="mt-2 text-sm text-slate-400">La source statistique n'est pas momentanément disponible. Aucune valeur n'est inventée ni mise en cache comme si elle était actuelle.</p>
      </section>
    );
  }

  const ordered = [...data].sort((a, b) => a.countryName.localeCompare(b.countryName, "fr"));

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-300">Chaque vie est précieuse</p>
          <h2 className="mt-2 text-xl font-semibold">Sécurité routière par pays</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Pour chaque pays disposant d'historique dans la source, ADSO affiche le taux annuel de mortalité routière le plus bas et le plus haut, avec l'année correspondante. Le taux est exprimé en décès pour 100 000 habitants.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">Plus bas</th>
              <th className="px-4 py-3">Année</th>
              <th className="px-4 py-3">Plus haut</th>
              <th className="px-4 py-3">Année</th>
              <th className="px-4 py-3">Jeunes touchés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {ordered.map((country) => (
              <tr key={country.countryCode} className="text-slate-200">
                <td className="px-4 py-3 font-medium">{country.countryName}</td>
                <td className="px-4 py-3">{country.lowest ? `${country.lowest.ratePer100k.toFixed(1)} / 100k` : "—"}</td>
                <td className="px-4 py-3 text-slate-400">{country.lowest?.year ?? "—"}</td>
                <td className="px-4 py-3">{country.highest ? `${country.highest.ratePer100k.toFixed(1)} / 100k` : "—"}</td>
                <td className="px-4 py-3 text-slate-400">{country.highest?.year ?? "—"}</td>
                <td className="px-4 py-3">
                  {country.youth.available
                    ? `${country.youth.percentage?.toFixed(1)}% (${country.youth.ageFrom}–${country.youth.ageTo} ans, ${country.youth.year})`
                    : "Donnée âge-pays à valider"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">Source du taux : World Bank WDI, indicateur SH.STA.TRAF.P5, issu de l'OMS/GHO, licence CC BY-4.0. Les statistiques par âge doivent être extraites et validées à partir de la WHO Mortality Database avant affichage pays par pays. ADSO ne fabrique jamais une estimation manquante.</p>
    </section>
  );
}
