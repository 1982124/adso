'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Eye, ShieldCheck, Bike, GraduationCap } from 'lucide-react';

const scenes = [
  {
    title: 'Traverser la route',
    level: 'Primaire',
    image: '/illustrations/road-safety-crosswalk.png',
    alt: 'Élèves africains traversant une route sur un passage piéton avec une moto et des véhicules',
    lesson: 'Observer, s’arrêter, regarder des deux côtés puis traverser lorsque la voie est libre.',
    accent: 'from-emerald-600/90 to-emerald-900/95',
  },
  {
    title: 'Moto & taxi-moto',
    level: 'Conducteur professionnel',
    image: '/illustrations/road-safety-moto.png',
    alt: 'Conducteur africain de taxi-moto portant un casque dans une rue urbaine',
    lesson: 'Casque, distance de sécurité, vitesse adaptée et anticipation des comportements des autres usagers.',
    accent: 'from-amber-500/90 to-orange-800/95',
  },
  {
    title: 'Panneaux & signalisation',
    level: 'Collège · Lycée',
    image: '/illustrations/road-safety-signs.png',
    alt: 'Rue africaine avec panneaux de signalisation et jeunes usagers de la route',
    lesson: 'Reconnaître rapidement les panneaux et relier chaque signal à une décision concrète.',
    accent: 'from-sky-500/90 to-blue-900/95',
  },
  {
    title: 'Choisir sous pression',
    level: 'Pré-conduite',
    image: '/illustrations/road-safety-decision.png',
    alt: 'Jeune conducteur africain confronté à une situation routière complexe',
    lesson: 'ADSO transforme une scène réelle en décision : observer → analyser → choisir → comprendre la conséquence.',
    accent: 'from-violet-500/90 to-purple-950/95',
  },
];

export default function VisualLearningGallery() {
  return (
    <section id="visual-learning" className="bg-slate-950 py-16 text-white sm:py-20 lg:py-24" aria-labelledby="visual-learning-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">La pédagogie ADSO</p>
          <h2 id="visual-learning-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Apprendre par les images et les situations réelles.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">Une scène, une question, une décision, une conséquence et une compétence. Les illustrations deviennent le support principal de compréhension avant le texte.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {scenes.map((scene, index) => (
            <motion.article key={scene.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: index * 0.06 }} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img src={scene.image} alt={scene.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${scene.accent} px-5 pb-5 pt-14`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">{scene.level}</p>
                      <h3 className="mt-1 text-xl font-black sm:text-2xl">{scene.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/20 bg-black/20 p-2 backdrop-blur" aria-hidden="true"><Eye className="size-5" /></span>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <p className="text-sm leading-6 text-slate-300 sm:text-base">{scene.lesson}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-emerald-300">
                  <span>Observer → décider → progresser</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5"><GraduationCap className="size-6 text-emerald-300" aria-hidden="true" /><h3 className="mt-3 font-bold">Du primaire à l’université</h3><p className="mt-1 text-sm leading-6 text-slate-300">Même langage visuel, complexité progressive selon l’âge.</p></div>
          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-5"><Bike className="size-6 text-amber-300" aria-hidden="true" /><h3 className="mt-3 font-bold">Des réalités africaines</h3><p className="mt-1 text-sm leading-6 text-slate-300">Motos, taxi-motos, transports, écoles et rues locales deviennent des situations d’apprentissage.</p></div>
          <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.06] p-5"><ShieldCheck className="size-6 text-sky-300" aria-hidden="true" /><h3 className="mt-3 font-bold">Une bibliothèque vivante</h3><p className="mt-1 text-sm leading-6 text-slate-300">Chaque nouvelle scène peut devenir une leçon, un quiz et une compétence mesurable.</p></div>
        </div>
      </div>
    </section>
  );
}
