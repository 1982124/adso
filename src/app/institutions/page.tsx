import Link from 'next/link';

const pillars = [
  { title: 'Éduquer', text: 'Parcours de mobilité et de sécurité routière adaptés à l’âge, au contexte et au niveau de l’apprenant.' },
  { title: 'Prévenir', text: 'Scénarios visuels, comportements à risque, sensibilisation des jeunes et outils de prévention.' },
  { title: 'Mesurer', text: 'Indicateurs par pays et par année, sources, méthodologie, tendances et limites clairement documentées.' },
  { title: 'Certifier', text: 'Évaluations et certifications traçables, avec juridiction et critères explicites.' },
  { title: 'Innover', text: 'ADSO LAB, IA, simulations et expérimentations pédagogiques évaluables.' },
];

const audiences = ['Administrations publiques', 'Collectivités et territoires', 'Établissements scolaires et organismes de formation', 'Entreprises et gestionnaires de flottes', 'Assureurs et acteurs de la prévention', 'Universités, chercheurs et programmes internationaux'];

export default function InstitutionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-emerald-950 to-slate-950 px-5 pb-20 pt-28 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">ADSO · Institutional</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Éduquer. Prévenir. Mesurer. Agir.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/80">ADSO — La responsabilité au service de la vie. Une plateforme numérique complémentaire pour la mobilité sûre, l’éducation, la prévention, la donnée et l’innovation.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Découvrir ADSO</Link>
            <Link href="/admin" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold">Cockpit sécurisé</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="pillars">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Cadre d’action</p>
        <h2 id="pillars" className="mt-2 text-3xl font-bold">Une infrastructure complémentaire aux programmes existants</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h3 className="text-lg font-bold text-emerald-300">{pillar.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{pillar.text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 sm:px-8" aria-labelledby="audiences">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Écosystème</p>
          <h2 id="audiences" className="mt-2 text-3xl font-bold">Pour les acteurs qui œuvrent pour une mobilité plus sûre</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{audiences.map((audience) => <div key={audience} className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm font-medium text-slate-200">{audience}</div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="governance">
        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-7 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Confiance & gouvernance</p>
          <h2 id="governance" className="mt-2 text-3xl font-bold">Des données contextualisées, sourcées et traçables</h2>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li>• Année et source affichées lorsque disponibles.</li>
            <li>• Distinction entre données communes, harmonisées et nationales.</li>
            <li>• Aucune juridiction nationale déduite silencieusement.</li>
            <li>• Les limites et lacunes des données sont signalées.</li>
            <li>• Les recommandations IA restent distinguées des faits observés.</li>
            <li>• Les actions sensibles nécessitent une validation humaine.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
