import Link from 'next/link';
import InstitutionalInquiryForm from '@/components/institutional/InstitutionalInquiryForm';

const pillars = [
  { title: 'Éduquer', text: 'Parcours adaptés à l’âge, au contexte national, au métier et au profil de mobilité : élèves, étudiants, apprentis, conducteurs et usagers vulnérables.' },
  { title: 'Prévenir', text: 'Situations routières immersives, identification des dangers, décisions, conséquences et apprentissage des comportements protecteurs.' },
  { title: 'Mesurer', text: 'Indicateurs de couverture, participation, progression et compétences, avec définitions, dénominateurs, sources et périodes explicites.' },
  { title: 'Évaluer & reconnaître', text: 'Évaluation pédagogique documentée. ADSO ne délivre pas à la place des États un permis, une habilitation ou une certification réglementaire.' },
  { title: 'Améliorer', text: 'Expérimentations évaluables, retours terrain et amélioration continue, avec validation humaine des décisions sensibles.' },
];

const audiences = ['Ministères et administrations des transports', 'Ministères de l’éducation et de la formation', 'Agences et autorités de sécurité routière', 'Collectivités et municipalités', 'Écoles, universités et centres de formation', 'Forces de prévention, ONG et partenaires techniques', 'Entreprises, transporteurs et gestionnaires de flottes', 'Instituts de recherche et programmes régionaux'];

const phases = [
  ['01', 'Cadrage institutionnel', 'Définir le pays, les autorités compétentes, les objectifs publics, les populations cibles, les langues et les règles applicables.'],
  ['02', 'Diagnostic de référence', 'Établir les données de départ, les sources, les limites, les zones prioritaires et les indicateurs qui pourront réellement être suivis.'],
  ['03', 'Pilote limité et encadré', 'Tester les parcours auprès d’un public et d’un territoire définis, avec responsables identifiés, protocole de protection et calendrier.'],
  ['04', 'Évaluation indépendante', 'Comparer les résultats au point de départ, documenter les écarts et recueillir les retours des bénéficiaires et des encadrants.'],
  ['05', 'Décision de déploiement', 'Étendre, corriger ou arrêter sur la base des résultats, des coûts, des capacités locales et d’un accord formel.'],
];

const indicators = [
  ['Couverture', 'Personnes inscrites, participantes et ayant terminé, ventilées par territoire et public.'],
  ['Apprentissage', 'Progression pré/post-évaluation, taux de réussite et compétences démontrées par thème.'],
  ['Prévention', 'Dangers correctement identifiés, choix protecteurs dans les simulations et évolution des erreurs récurrentes.'],
  ['Équité d’accès', 'Participation par âge, genre lorsque légalement et volontairement collecté, zone, langue et type d’accès numérique.'],
  ['Qualité', 'Taux d’abandon, accessibilité, satisfaction, incidents signalés et délai de résolution.'],
  ['Impact routier', 'Accidents, blessures et exposition uniquement si des données administratives fiables, comparables et attribuables sont disponibles.'],
];

export default function InstitutionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 px-5 pb-20 pt-28 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">ADSO AFRICA · Présentation institutionnelle</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Une infrastructure numérique pour renforcer l’éducation et la prévention routières.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/80">ADSO AFRICA accompagne les institutions dans la sensibilisation, la formation à la mobilité sûre, la simulation de situations routières et l’évaluation des compétences acquises. La plateforme complète les politiques publiques ; elle ne remplace ni les autorités, ni les services d’urgence, ni les dispositifs officiels de délivrance du permis.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/education" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Découvrir les parcours</Link>
            <a href="#demande-institutionnelle" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white">Étudier un projet pilote</a>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-400">Présentation de capacité et proposition de coopération. Aucune institution n’est présentée comme partenaire sans convention publiée ou accord vérifiable.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="mission">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Mission opérationnelle</p>
        <h2 id="mission" className="mt-2 text-3xl font-bold">De l’éducation à la mesure des résultats</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h3 className="text-lg font-bold text-emerald-300">{pillar.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{pillar.text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 sm:px-8" aria-labelledby="publics">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Parties prenantes</p>
          <h2 id="publics" className="mt-2 text-3xl font-bold">Une coopération intersectorielle</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">La sécurité routière concerne les transports, l’éducation, la santé, la jeunesse, les collectivités, les acteurs du transport et la société civile. Le périmètre d’un programme est défini avec les autorités compétentes du pays concerné.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{audiences.map((audience) => <div key={audience} className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm font-medium text-slate-200">{audience}</div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="pilot">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Méthode de déploiement</p>
        <h2 id="pilot" className="mt-2 text-3xl font-bold">Un pilote maîtrisé avant tout déploiement à grande échelle</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Chaque coopération commence par un cadrage, une situation de référence et un périmètre mesurable. Les étapes ci-dessous constituent une méthode proposée, à adapter et valider avec l’institution.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {phases.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-2xl font-black text-emerald-300">{number}</p><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 sm:px-8" aria-labelledby="indicators">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Suivi & évaluation</p>
          <h2 id="indicators" className="mt-2 text-3xl font-bold">Des indicateurs utiles à la décision publique</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Les résultats sont publiés avec période, population, méthode, dénominateur et source. Les indicateurs pédagogiques ne prouvent pas à eux seuls une baisse des accidents ou des décès.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">{indicators.map(([title, description]) => <article key={title} className="rounded-xl border border-white/10 bg-slate-900/70 p-5"><h3 className="font-bold text-emerald-300">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="deliverables">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Livrables institutionnels</p>
        <h2 id="deliverables" className="mt-2 text-3xl font-bold">Ce qu’un programme ADSO peut documenter</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="font-bold">Cadre de programme</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400"><li>Objectifs, territoire, durée et populations bénéficiaires.</li><li>Cartographie des parties prenantes et responsabilités.</li><li>Référentiel pédagogique, langues et adaptation nationale.</li><li>Plan de déploiement, formation des encadrants et assistance.</li></ul></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="font-bold">Rapport de suivi</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400"><li>Indicateurs de participation et de progression.</li><li>Résultats ventilés selon les données autorisées.</li><li>Limites, incidents, risques et mesures correctives.</li><li>Recommandations et décision de poursuite du pilote.</li></ul></article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 sm:px-8" aria-labelledby="governance">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Confiance, souveraineté et responsabilité</p>
          <h2 id="governance" className="mt-2 text-3xl font-bold">Des garde-fous indispensables à la coopération publique</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Données nationales', 'Les règles, contenus et statistiques sont vérifiés pays par pays, avec source, date et version.'],
              ['Protection des personnes', 'Minimisation des données, accès par rôle, durée de conservation définie et protection des mineurs.'],
              ['Souveraineté', 'Hébergement, localisation, transferts et accès aux données à définir avec l’autorité compétente avant le pilote.'],
              ['Transparence', 'Les faits observés, estimations, recommandations IA et données manquantes sont distingués.'],
              ['Contrôle humain', 'Aucune décision administrative, sanction ou reconnaissance officielle n’est automatisée par ADSO.'],
              ['Interopérabilité', 'Les échanges de données et intégrations sont définis par accord, formats documentés et contrôle d’accès.'],
            ].map(([title, description]) => <article key={title} className="rounded-xl border border-white/10 bg-slate-900/70 p-5"><h3 className="font-bold text-emerald-300">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500">Les éléments ci-dessus décrivent des exigences de cadrage et des engagements à formaliser. Ils ne constituent pas une déclaration de conformité juridique ou de certification déjà obtenue.</p>
        </div>
      </section>

      <section id="demande-institutionnelle" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16 sm:px-8" aria-labelledby="inquiry">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Dialogue institutionnel</p>
          <h2 id="inquiry" className="mt-2 text-3xl font-bold">Étudier un programme pilote dans votre pays</h2>
          <p className="mt-3 text-slate-400">Précisez votre institution, votre rôle, le territoire et le public concernés. L’équipe ADSO pourra examiner le besoin et proposer un échange exploratoire. La soumission ne crée aucun partenariat ni engagement contractuel.</p>
        </div>
        <InstitutionalInquiryForm />
      </section>
    </main>
  );
}
