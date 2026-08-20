import Link from 'next/link'
import { ArrowRight, CheckCircle2, Headphones, Images, Users, Volume2 } from 'lucide-react'

const pillars = [
  { icon: Users, title: 'Apprendre ensemble', text: 'Un parcours conçu pour les groupes, associations et communautés locales.' },
  { icon: Images, title: 'Voir pour comprendre', text: 'Des scènes réalistes de mobilité servent de support pédagogique avant la lecture.' },
  { icon: Volume2, title: 'Écouter pour apprendre', text: 'La voix permet de suivre une activité même lorsque la lecture est difficile.' },
  { icon: Headphones, title: 'Ancrer les bons réflexes', text: 'Les décisions, conséquences et répétitions transforment une situation en compétence.' },
]

export default function CommunautePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.2),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">ADSO Communauté</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Le code de la mobilité se partage.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              ADSO Communauté permet de faire apprendre la mobilité sûre à plusieurs personnes, dans leur propre environnement,
              avec des images, la voix, des décisions et des situations concrètes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-black text-slate-950 hover:bg-emerald-300">
                Découvrir l’offre <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/formation" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Commencer une formation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <Icon className="h-6 w-6 text-emerald-300" />
                <h2 className="mt-4 font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Accessibilité pédagogique</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Même sans savoir lire, on peut apprendre à mieux partager la route.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              L'expérience ADSO privilégie une séquence simple : voir, écouter, choisir, observer la conséquence, puis répéter.
              Le texte reste disponible comme support, mais il ne doit pas être la seule porte d'entrée.
            </p>
            <ul className="mt-6 space-y-3">
              {['Scènes réalistes et contextualisées', 'Questions compréhensibles par l’image et la voix', 'Apprentissage collectif extensible', 'Progression individuelle et collective à construire dans le même socle'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7">
            <p className="text-sm font-bold text-emerald-800">MVP ADSO Communauté</p>
            <p className="mt-3 text-2xl font-black text-slate-900">Socle collectif prêt à être étendu</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Le MVP expose l'offre et son parcours pédagogique sans prétendre qu'une plateforme sociale complète est déjà disponible.
              Les fonctions avancées de groupes, modération et statistiques collectives seront activées progressivement.
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}
