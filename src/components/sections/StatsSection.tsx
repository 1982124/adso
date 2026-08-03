'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Heart, Users, TrendingDown, ShieldCheck, DollarSign, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(eased * end);
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

const statsCards = [
  {
    value: 1.35,
    suffix: 'M',
    label: 'Décès par an sur les routes',
    icon: Car,
    decimals: 2,
    accentColor: 'text-red-500',
    accentBg: 'bg-red-50',
    accentBorder: 'border-red-200',
    iconBg: 'bg-red-100',
  },
  {
    value: 50,
    suffix: 'M',
    label: 'Blessés graves chaque année',
    icon: Heart,
    decimals: 0,
    accentColor: 'text-orange-500',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    iconBg: 'bg-orange-100',
  },
  {
    value: 73,
    suffix: '%',
    label: 'Des jeunes de 15-29 ans touchés',
    icon: Users,
    decimals: 0,
    accentColor: 'text-amber-500',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  {
    value: 518,
    suffix: 'B',
    prefix: '$',
    label: 'Coût économique mondial',
    icon: TrendingDown,
    decimals: 0,
    accentColor: 'text-emerald-500',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
];

const painPoints = [
  {
    icon: MapPin,
    title: 'Accessibilité',
    description:
      'Des milliards de personnes n\'ont pas accès à une formation de conduite de qualité. ADSO brise les barrières géographiques avec une plateforme 100% en ligne.',
  },
  {
    icon: ShieldCheck,
    title: 'Qualité inégale',
    description:
      'Le manque de standardisation mondiale entraîne des formations incohérentes. Notre IA adapte le contenu au niveau de chaque apprenant pour des résultats optimaux.',
  },
  {
    icon: DollarSign,
    title: 'Coût prohibitif',
    description:
      'Les cours de conduite coûtent en moyenne 1 500 à 3 000 €. ADSO rend la formation jusqu\'à 10x plus abordable tout en maintenant l\'excellence.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function StatsSection() {
  return (
    <section id="stats" className="relative bg-white py-16 sm:py-20 lg:py-24">
      {/* Subtle emerald top accent */
      }
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */
        }
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Un enjeu mondial de{' '}
            <span className="text-emerald-600">sécurité routière</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Selon l&rsquo;Organisation Mondiale de la Santé, les accidents de la route causent{' '}
            <strong className="text-gray-800">1,35 million de décès par an</strong> et représentent la{' '}
            <strong className="text-gray-800">première cause de mortalité chez les 15-29 ans</strong>.{' '}
            Un problème que ADSO s&rsquo;engage à résoudre.
          </p>
        </motion.div>

        {/* Stats Grid */
        }
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {statsCards.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card
                className={`${stat.accentBg} ${stat.accentBorder} border-2 hover:shadow-lg transition-all duration-300 h-full group cursor-default`}
              >
                <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center">
                  <div className={`${stat.iconBg} p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`size-6 ${stat.accentColor}`} />
                  </div>
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${stat.accentColor} mb-1`}>
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      decimals={stat.decimals}
                    />
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pain Points */
        }
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Trois défis que <span className="text-emerald-600">ADSO</span> résout
            </h3>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {painPoints.map((point) => (
              <motion.div
                key={point.title}
                variants={itemVariants}
                className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <point.icon className="size-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{point.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
