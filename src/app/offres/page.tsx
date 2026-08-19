import Link from "next/link";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { COMMERCIAL_OFFERS, formatXof } from "@/lib/commercial-offers";

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">← Retour à ADSO</Link>
        <header className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">ADSO · Offres</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Des offres simples, accessibles et transparentes.</h1>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Les tarifs de lancement ci-dessous sont exprimés en francs CFA (XOF). Ils correspondent aux offres ADSO validées pour le marché africain. Les eBooks sont vendus séparément dans la Bibliothèque.
          </p>
        </header>

        <section className="mt-10 grid gap-5 lg:grid-cols-2" aria-label="Offres ADSO">
          {COMMERCIAL_OFFERS.map((offer) => (
            <article key={offer.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{offer.audience}</p>
              <h2 className="mt-3 text-2xl font-semibold">{offer.name}</h2>

              {offer.monthly !== null ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Mensuel</p>
                    <p className="mt-2 text-2xl font-bold">{formatXof(offer.monthly)}<span className="text-sm font-normal text-slate-400"> / mois</span></p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">Annuel</p>
                    <p className="mt-2 text-2xl font-bold">{formatXof(offer.yearly!)}<span className="text-sm font-normal text-slate-400"> / an</span></p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Tarification</p>
                  <p className="mt-2 text-2xl font-bold">Sur devis</p>
                </div>
              )}

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {offer.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
              </ul>

              {offer.checkoutEnabled ? (
                <Link href={`/formation?offer=${encodeURIComponent(offer.id)}`} className="mt-7 inline-flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Choisir cette offre →
                </Link>
              ) : (
                <Link href="/institutions" className="mt-7 inline-flex w-full justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
                  Demander un devis →
                </Link>
              )}
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-7" aria-labelledby="lead-heading">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🎯 Contact ADSO</p>
          <h2 id="lead-heading" className="mt-2 text-2xl font-semibold">Besoin d’aide pour choisir ?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Laissez vos coordonnées. ADSO enregistre votre demande avec consentement afin de vous orienter vers l’offre adaptée.</p>
          <LeadCaptureForm offer="Offres ADSO" source="offers" />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="text-xl font-semibold">À propos des paiements</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Le catalogue d’offres utilise des identifiants stables afin que l’affichage des prix et le futur checkout restent cohérents. Les moyens disponibles dépendent du pays et de la configuration réelle des prestataires de paiement.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Les eBooks restent séparés des abonnements et sont achetés individuellement depuis la Bibliothèque.
          </p>
        </section>
      </div>
    </main>
  );
}
