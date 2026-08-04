'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronUp,
  Building2,
  Route,
  TreePine,
  Mountain,
  Moon,
  CloudRain,
  CloudFog,
  Snowflake,
  SquareParking,
  MoveVertical,
  GitBranch,
  Shield,
  CircleDot,
  ArrowRightLeft,
  TriangleAlert,
  Leaf,
  Target,
  ClipboardList,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  objectives: string[];
  steps: string[];
  criteria: string[];
  tips: string[];
  scoring: Record<string, string | number>;
  countryCode: string;
  licenseCode: string;
}

// ── Constants ──────────────────────────────────────────────────────────
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  city: 'Ville',
  highway: 'Autoroute',
  rural: 'Campagne',
  mountain: 'Montagne',
  night: 'Nuit',
  rain: 'Pluie',
  fog: 'Brouillard',
  snow: 'Neige',
  parking: 'Stationnement',
  maneuver: 'Manœuvres',
  intersection: 'Intersection',
  priority: 'Priorité',
  roundabout: 'Rond-point',
  overtaking: 'Dépassement',
  emergency_braking: 'Freinage d\'urgence',
  eco_driving: 'Éco-conduite',
};

const DIFFICULTY_TRANSLATIONS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-950/40',
  intermediate: 'text-amber-400 bg-amber-950/40',
  advanced: 'text-red-400 bg-red-950/40',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  city: Building2,
  highway: Route,
  rural: TreePine,
  mountain: Mountain,
  night: Moon,
  rain: CloudRain,
  fog: CloudFog,
  snow: Snowflake,
  parking: SquareParking,
  maneuver: MoveVertical,
  intersection: GitBranch,
  priority: Shield,
  roundabout: CircleDot,
  overtaking: ArrowRightLeft,
  emergency_braking: TriangleAlert,
  eco_driving: Leaf,
};

const CATEGORIES = Object.keys(CATEGORY_TRANSLATIONS);
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// ── Component ──────────────────────────────────────────────────────────
export default function PracticalExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set('category', activeCategory);
      if (activeDifficulty) params.set('difficulty', activeDifficulty);
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/learning/practical${query}`);
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeDifficulty]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
                }`}
              >
                {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                {CATEGORY_TRANSLATIONS[cat]}
              </button>
            );
          })}
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveDifficulty(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeDifficulty === null
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            Toutes difficultés
          </button>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(activeDifficulty === diff ? null : diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeDifficulty === diff
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
              }`}
            >
              {DIFFICULTY_TRANSLATIONS[diff]}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          {total} exercice{total !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <Skeleton className="h-5 w-32 bg-slate-800" />
              <Skeleton className="h-3 w-full bg-slate-800" />
              <Skeleton className="h-3 w-3/4 bg-slate-800" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 bg-slate-800" />
                <Skeleton className="h-5 w-20 bg-slate-800" />
              </div>
              <Skeleton className="h-3 w-48 bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && exercises.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <Target className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">
            Aucun exercice ne correspond à ces filtres.
          </p>
        </div>
      )}

      {/* Exercises Grid */}
      {!loading && exercises.length > 0 && (
        <ScrollArea className="max-h-[700px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-3">
            <AnimatePresence mode="popLayout">
              {exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  expanded={expandedId === ex.id}
                  onToggle={() => toggleExpand(ex.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}

// ── Exercise Card ──────────────────────────────────────────────────────
function ExerciseCard({
  exercise,
  expanded,
  onToggle,
}: {
  exercise: Exercise;
  expanded: boolean;
  onToggle: () => void;
}) {
  const catLabel = CATEGORY_TRANSLATIONS[exercise.category] || exercise.category;
  const diffLabel = DIFFICULTY_TRANSLATIONS[exercise.difficulty] || exercise.difficulty;
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || 'text-slate-400 bg-slate-800/40';

  const hasDetails =
    exercise.objectives.length > 0 ||
    exercise.steps.length > 0 ||
    exercise.criteria.length > 0 ||
    exercise.tips.length > 0 ||
    Object.keys(exercise.scoring).length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-slate-900/80 border border-slate-800/60 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-colors">
        <button
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={expanded}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate min-w-0">
              {exercise.title}
            </h3>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            )}
          </div>

          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {exercise.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className="border-emerald-600/30 text-emerald-400 text-[10px] px-2 py-0">
              {catLabel}
            </Badge>
            <Badge variant="outline" className={`${diffColor} text-[10px] px-2 py-0 border`}>
              {diffLabel}
            </Badge>
          </div>

          <p className="text-slate-500 text-[10px] mt-2.5">
            {exercise.objectives.length} objectif{exercise.objectives.length !== 1 ? 's' : ''}{' '}
            <span className="text-slate-700">•</span>{' '}
            {exercise.steps.length} étape{exercise.steps.length !== 1 ? 's' : ''}{' '}
            <span className="text-slate-700">•</span>{' '}
            {exercise.criteria.length} critère{exercise.criteria.length !== 1 ? 's' : ''}
          </p>
        </button>

        <AnimatePresence>
          {expanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="bg-slate-800/60" />
              <div className="p-4 sm:p-5 space-y-4">
                {/* Objectives */}
                {exercise.objectives.length > 0 && (
                  <DetailSection title="Objectifs" icon={Target} items={exercise.objectives} color="text-emerald-400" />
                )}

                {/* Steps */}
                {exercise.steps.length > 0 && (
                  <NumberedList title="Étapes" icon={ClipboardList} items={exercise.steps} />
                )}

                {/* Criteria */}
                {exercise.criteria.length > 0 && (
                  <DetailSection title="Critères d\'évaluation" icon={Shield} items={exercise.criteria} color="text-amber-400" />
                )}

                {/* Tips */}
                {exercise.tips.length > 0 && (
                  <DetailSection title="Conseils" icon={Leaf} items={exercise.tips} color="text-sky-400" />
                )}

                {/* Scoring */}
                {Object.keys(exercise.scoring).length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">
                      Barème de notation
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(exercise.scoring).map(([key, value]) => (
                        <div key={key} className="bg-slate-800/40 rounded-md px-2.5 py-1.5 flex items-center justify-between">
                          <span className="text-slate-300 text-[11px]">{key}</span>
                          <span className="text-emerald-400 text-[11px] font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── Detail Section ─────────────────────────────────────────────────────
function DetailSection({
  title,
  icon: Icon,
  items,
  color = 'text-slate-300',
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
  color?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5">
        <Icon className={`w-3 h-3 ${color}`} />
        {title}
      </p>
      <ul className="space-y-0.5 pl-1">
        {items.map((item, idx) => (
          <li key={idx} className={`${color} text-[11px] flex items-start gap-1.5`}>
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Numbered List ──────────────────────────────────────────────────────
function NumberedList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-slate-400" />
        {title}
      </p>
      <ol className="space-y-0.5 pl-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-slate-300 text-[11px] flex items-start gap-1.5">
            <span className="text-emerald-500 font-medium text-[10px] mt-0.5 shrink-0 w-4 text-right">
              {idx + 1}.
            </span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
