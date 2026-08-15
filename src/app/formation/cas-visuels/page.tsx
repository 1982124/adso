import Link from "next/link";

const cases = [
  { title: "Intersection sous la pluie", tag: "ANTICIPATION", visual: "🌧️  🚗   🛑   🚶", question: "Que devez-vous anticiper avant d'entrer dans l'intersection ?" },
  { title: "Rond-point et priorité", tag: "PRIORITÉ", visual: "↻  🚘  ↗  🚗", question: "Quelle trajectoire permet de conserver la bonne marge de sécurité ?" },
  { title: "Enfant près de la chaussée", tag: "USAGERS VULNÉRABLES", visual: "🏫  👦  ⚠️  🚙", question: "Quelle réaction réduit immédiatement le risque ?" },
  { title: "Changement de voie", tag: "MANŒUVRE", visual: "🚗  →  🚙  →", question: "Dans quel ordre effectuer observation, signalisation et déplacement ?" },
  { title: "Conduite de nuit", tag: "VISIBILITÉ", visual: "🌙  🚘  💡  🦌", question: "Quelle adaptation de vitesse et de distance est nécessaire ?" },
  { title: "Téléphone au volant", tag: "DISTRACTION", visual: "📱  ≠  🚗  ⚠️", question: "Pourquoi une distraction de quelques secondes peut-elle devenir critique ?" },
  { title: "Moto dans l'angle mort", tag: "PARTAGE DE LA ROUTE", visual: "🚗  ◌  🏍️", question: "Comment vérifier efficacement la zone non visible ?" },
  { title: "Dépassement", tag: "DÉCISION", visual: "🚗  ⇢  🚚  ⇢", question: "Quels éléments doivent être vérifiés avant de dépasser ?" },
];

export default function VisualCasesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/formation" className="text-sm text-slate-400 hover:text-white">← Formation</Link>
        <header className="mt-10 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">ADSO · Apprentissage visuel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Apprendre en voyant la situation, pas seulement en lisant la règle.</h1>
          <p className="mt-5 text-base leading-7 text-slate-400">Cette bibliothèque structure les futures scènes pédagogiques ADSO : situation visuelle → observation → décision → explication → règle → erreur fréquente. Les scènes nationales pourront ensuite être rattachées à leur juridiction.</p>
        </header>
        <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Cas d'apprentissage visuel">
          {cases.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/10">
              <div className="flex min-h-36 items-center justify-center border-b border-white/10 bg-slate-900 px-4 text-center text-2xl tracking-wider transition-transform group-hover:scale-[1.02]" aria-label={`Illustration schématique : ${item.title}`}>{item.visual}</div>
              <div className="p-5">
                <p className="text-[11px] font-bold tracking-[0.18em] text-cyan-300">{item.tag}</p>
                <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.question}</p>
                <button type="button" className="mt-5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">Étudier le cas →</button>
              </div>
            </article>
          ))}
        </section>
        <section className="mt-10 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] p-7">
          <h2 className="text-xl font-semibold">Objectif pédagogique</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">ADSO doit progressivement passer d'une logique de quiz à une logique de simulation : scènes de circulation, panneaux, trajectoires, météo, visibilité, usagers vulnérables et erreurs fréquentes. Chaque asset visuel devra conserver sa source, sa licence et, lorsque nécessaire, sa juridiction.</p>
        </section>
      </div>
    </main>
  );
}
