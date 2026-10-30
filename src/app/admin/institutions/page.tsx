import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";

type Inquiry = {
  country?: string;
  institution?: string;
  institutionType?: string;
  role?: string;
  interest?: string;
  population?: string;
  language?: string;
  contact?: string;
  message?: string;
};
type Qualification = {
  relevance?: string;
  topic?: string;
  suggestedResponse?: string;
  nextAction?: string;
  diplomacyCautions?: string[];
};
function parseMetadata(value: string): Record<string, unknown> {
  try { const parsed = JSON.parse(value); return parsed && typeof parsed === "object" ? parsed : {}; }
  catch { return {}; }
}
function asString(value: unknown) { return typeof value === "string" ? value : ""; }

export default async function InstitutionalPipelinePage() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  const role = getUserRole(session);
  if (!hasMinRole(role, "admin")) redirect("/");

  const events = await db.analyticsEvent.findMany({
    where: { eventType: { in: ["institutional_inbound_request", "institutional_inbound_qualification"] } },
    orderBy: { createdAt: "desc" },
    take: 120,
    select: { id: true, eventType: true, metadata: true, createdAt: true },
  });

  const inquiries = events
    .filter((event) => event.eventType === "institutional_inbound_request")
    .map((event) => {
      const meta = parseMetadata(event.metadata);
      const submitted = (meta.submitted && typeof meta.submitted === "object" ? meta.submitted : {}) as Inquiry;
      return { id: event.id, createdAt: event.createdAt, submitted, receivedAt: asString(meta.receivedAt) };
    });

  const qualifications = events
    .filter((event) => event.eventType === "institutional_inbound_qualification")
    .map((event) => {
      const meta = parseMetadata(event.metadata);
      return { country: asString(meta.country), institution: asString(meta.institution), qualification: (meta.qualification && typeof meta.qualification === "object" ? meta.qualification : {}) as Qualification };
    });

  const countryCount = new Set(inquiries.map((item) => item.submitted.country).filter(Boolean)).size;

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">← Cockpit direction</Link>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">ADSO AFRICA · Accès restreint</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Relations institutionnelles</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Suivi des demandes reçues par le formulaire institutionnel. Une demande entrante n’est ni un partenariat, ni une approbation gouvernementale.</p>
          </div>
          <Link href="/institutions" className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold hover:bg-white/5">Voir la présentation publique ↗</Link>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Indicateurs du pipeline">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Demandes enregistrées</p><p className="mt-2 text-3xl font-black tabular-nums">{inquiries.length}</p><p className="mt-1 text-xs text-slate-500">Dans les 120 derniers événements chargés</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Pays représentés</p><p className="mt-2 text-3xl font-black tabular-nums">{countryCount}</p><p className="mt-1 text-xs text-slate-500">Selon les déclarations des demandeurs</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-400">Qualifications IA enregistrées</p><p className="mt-2 text-3xl font-black tabular-nums">{qualifications.length}</p><p className="mt-1 text-xs text-slate-500">À considérer comme aide au tri, jamais comme décision</p></article>
        </section>

        <section className="space-y-4">
          <div><h2 className="text-xl font-bold">Demandes institutionnelles</h2><p className="mt-1 text-sm text-slate-400">Les coordonnées et messages ci-dessous sont des données professionnelles fournies volontairement. Accès réservé aux administrateurs.</p></div>
          {inquiries.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-8 text-sm text-slate-400">Aucune demande institutionnelle enregistrée pour le moment.</div> : inquiries.map((item) => {
            const q = qualifications.find((entry) => entry.institution === item.submitted.institution && entry.country === item.submitted.country)?.qualification;
            return (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-lg font-bold">{item.submitted.institution || "Institution non renseignée"}</h3><p className="mt-1 text-sm text-emerald-300">{item.submitted.country || "Pays non renseigné"} · {item.submitted.institutionType || "Type non renseigné"}</p></div>
                  <time className="text-xs text-slate-500" dateTime={item.createdAt.toISOString()}>{item.createdAt.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div><p className="text-xs uppercase tracking-wider text-slate-500">Contact professionnel</p><p className="mt-1 break-words text-slate-200">{item.submitted.contact || "Non renseigné"}</p><p className="mt-2 text-slate-400">{item.submitted.role || ""}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-slate-500">Sujet / public</p><p className="mt-1 text-slate-200">{item.submitted.interest || "Non renseigné"}</p><p className="mt-2 text-slate-400">{item.submitted.population || "Public non précisé"} · {item.submitted.language || "Langue non précisée"}</p></div>
                </div>
                <div className="mt-4 rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-wider text-slate-500">Contexte communiqué</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.submitted.message || "Aucun message"}</p></div>
                {q && <div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-200">Préqualification IA · validation humaine requise</p><p className="mt-2 text-sm text-slate-200">Pertinence suggérée : {q.relevance || "non définie"} · {q.topic || item.submitted.interest}</p><p className="mt-2 text-sm leading-6 text-slate-400">{q.suggestedResponse || "Aucune réponse suggérée."}</p>{q.nextAction && <p className="mt-2 text-xs text-slate-500">Prochaine étape suggérée : {q.nextAction}</p>}</div>}
              </article>
            );
          })}
        </section>
        <p className="border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Ce tableau est un registre de réception et de préqualification. Il ne gère pas encore les statuts de négociation, les conventions, les signatures ou les autorisations officielles. Ne communiquez aucune donnée personnelle d’apprenant dans ce pipeline.</p>
      </div>
    </main>
  );
}
