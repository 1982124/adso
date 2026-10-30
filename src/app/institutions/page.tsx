import Link from 'next/link';
import InstitutionalInquiryForm from '@/components/institutional/InstitutionalInquiryForm';

const pillars = [
  { title: 'Éduquer', text: 'Parcours de mobilité et de sécurité routière adaptés à l’âge, au contexte, au métier et au profil de mobilité de l’apprenant.' },
  { title: 'Prévenir', text: 'Scénarios visuels, comportements à risque, sensibilisation des jeunes, apprentis et usagers vulnérables.' },
  { title: 'Mesurer', text: 'Indicateurs pédagogiques par pays, programme et année, avec sources, méthodologie, tendances et limites clairement documentées.' },
  { title: 'Évaluer & reconnaître', text: 'Évaluation et reconnaissance des compétences acquises, avec critères, contexte et juridiction explicitement distingués. ADSO ne se substitue pas aux certifications officielles des États.' },
  { title: 'Innover', text: 'ADSO LAB, IA, simulations et expérimentations pédagogiques évaluables dans un cadre responsable.' },
];

const audiences = ['Administrations publiques', 'Collectivités et territoires', 'Établissements scolaires et organismes de formation', 'Entreprises et organisations', 'Acteurs de la prévention et de la mobilité', 'Universités, chercheurs et programmes internationaux'];

const pilotPhases = [
  { period: 'Jours 1–15', title: 'Cadrer et préparer', text: 'Définir le public, le territoire, les objectifs pédagogiques, les responsabilités, les données nécessaires et les conditions de protection des participants.' },
  { period: 'Jours 16–30', title: 'Démontrer et tester', text: 'Faire tester un parcours complet sur téléphone : situation, décision, explication, évaluation et progression. Recueillir les premiers retours utilisateurs.' },
  { period: 'Jours 31–60', title: 'Déployer le pilote', text: 'Avec un partenaire volontaire, former un groupe défini, mesurer les connaissances avant et après le parcours et documenter la participation.' },
  { period: 'Jours 61–90', title: 'Évaluer et décider', text: 'Présenter les résultats, les limites, les coûts observés et les améliorations. Décider avec le partenaire s’il faut adapter, prolonger ou étendre le programme.' },
];

const pilotMetrics = [
  'Participants inscrits, actifs et ayant terminé le parcours',
  'Résultats avant/après sur les connaissances et la reconnaissance des risques',
  'Compétences évaluées et progression observée',
  'Accessibilité mobile, difficultés rencontrées et satisfaction',
  'Coût par participant formé et ressources nécessaires',
  'Limites de l’évaluation et recommandations pour la suite',
];

export default function InstitutionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-emerald-950 to-slate-950 px-5 pb-20 pt-28 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">ADSO AFRICA · Institutionnel</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Éduquer. Prévenir. Évaluer. Agir.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/80">Une infrastructure numérique complémentaire pour l’éducation routière, la formation à la mobilité, la prévention, la simulation et l’évaluation et reconnaissance des compétences acquises.</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Notre ambition : aider les citoyens et les organisations à développer des comportements plus sûrs, puis mesurer rigoureusement les progrès d’apprentissage. La réduction des accidents et des décès est un objectif de contribution, pas un résultat revendiqué sans preuve.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/education" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Découvrir les parcours ADSO</Link>
            <Link href="#pilot" className="rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-5 py-3 font-semibold text-emerald-100">Étudier un projet pilote</Link>
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

      <section id="pilot" className="border-y border-emerald-300/15 bg-emerald-300/[0.035] px-5 py-16 sm:px-8" aria-labelledby="pilot-heading">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Passer de l’ambition à la preuve</p>
          <h2 id="pilot-heading" className="mt-2 max-w-4xl text-3xl font-bold">Un projet pilote de 90 jours, avec des objectifs vérifiables</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">ADSO AFRICA propose de co-construire un pilote avec un établissement, une organisation ou un acteur public volontaire. Le Mali constitue le premier terrain envisagé de preuve de concept ; le Bénin pourra servir de deuxième terrain de référence. Aucun partenariat n’est présumé : le périmètre et les responsabilités seront convenus avec chaque partenaire.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pilotPhases.map((phase) => <article key={phase.period} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">{phase.period}</p><h3 className="mt-3 text-lg font-bold">{phase.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{phase.text}</p></article>)}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl bg-white p-6 text-slate-950">
              <h3 className="text-lg font-black">Ce que le pilote doit produire</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Un rapport compréhensible par les décideurs, présentant les données observées, la méthode, les résultats, les limites et les prochaines décisions possibles.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-black">Indicateurs proposés</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {pilotMetrics.map((metric) => <li key={metric} className="flex items-start gap-2 text-sm leading-6 text-slate-300"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-300" />{metric}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-400">Garde-fou : les résultats d’apprentissage ne sont pas des statistiques officielles d’accidents. Une éventuelle évolution des accidents ou des décès nécessiterait des données fiables, une méthode d’évaluation adaptée et une période d’observation suffisante.</p>
          <Link href="#inquiry" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 font-extrabold text-slate-950 hover:bg-emerald-300">Proposer un projet pilote <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 sm:px-8" aria-labelledby="audiences">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Écosystème</p>
          <h2 id="audiences" className="mt-2 text-3xl font-bold">Pour les acteurs qui œuvrent pour une mobilité plus sûre</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{audiences.map((audience) => <div key={audience} className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm font-medium text-slate-200">{audience}</div>)}</div>
        </div>
      </section>

      <section id="inquiry" className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="inquiry-heading">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Entrer en relation</p>
          <h2 id="inquiry-heading" className="mt-2 text-3xl font-bold">Construisons un pilote adapté à votre contexte</h2>
          <p className="mt-3 text-slate-400">Indiquez le pays, l’organisation, le public concerné et votre objectif. La demande sera transmise pour examen ; elle ne vaut ni engagement contractuel ni confirmation de partenariat.</p>
        </div>
        <InstitutionalInquiryForm />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-labelledby="governance">
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
