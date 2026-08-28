import Link from "next/link";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";

const offers = [
  { name: "Découverte", eyebrow: "LOW-PAY", description: "Un premier parcours court pour découvrir la méthode ADSO et les fondamentaux de la sécurité routière.", cta: "Découvrir", tone: "border-cyan-400/30 bg-cyan-400/10" },
  { name: "Parcours Essentiel", eyebrow: "LOW-PAY", description: "Une porte d'entrée accessible vers des modules ciblés, des cas visuels et des exercices guidés.", cta: "Commencer", tone: "border-emerald-400/30 bg-emerald-400/10" },
  { name: "Premium", eyebrow: "FORMATION", description: "Le parcours complet ADSO avec progression, entraînement et évaluations pédagogiques.", cta: "Voir le parcours", tone: "border-violet-400/30 bg-violet-400/10" },
];

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">← Retour à ADSO</Link>
        <header className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">ADSO · Offres</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Commencer simplement. Progresser réellement.</h1>
          <p className="mt-5 text-base leading-7 text-slate-400">Les offres d'entrée donnent accès à une première expérience pédagogique concrète. Les offres et moyens de paiement réellement disponibles sont affichés sans promesse fictive.</p>
        </header>
        <section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Offres ADSO">
          {offers.map((offer) => (
            <article key={offer.name} className={`rounded-3xl border p-7 ${offer.tone}`}>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-300">{offer.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-semibold">{offer.name}</h2>
              <p className="mt-4 min-h-24 text-sm leading-6 text-slate-300">{offer.description}</p>
              <Link href="/education" className="mt-7 inline-flex rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">{offer.cta} →</Link>
            </article>
          ))}
        </section>
        <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-7" aria-labelledby="lead-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🎯 Demande de parcours</p>
          <h2 id="lead-heading" className="mt-2 text-2xl font-semibold">Vous voulez choisir le bon parcours ?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Laissez vos coordonnées. ADSO enregistre votre demande avec consentement et permet à l'équipe de suivre la source et l'offre qui vous intéressent.</p>
          <LeadCaptureForm offer="Offres ADSO" source="offers" />
        </section>
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="text-xl font-semibold">Pourquoi commencer par une offre d'entrée ?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {["Apprendre avec des cas concrets", "Tester la méthode ADSO", "Passer ensuite au parcours complet"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">✓ {item}</div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
