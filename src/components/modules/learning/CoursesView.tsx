'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, Clock, BookOpen, GraduationCap, Video, MousePointerClick, HelpCircle, FileText } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: 'lesson' | 'video' | 'interactive' | 'quiz' | 'summary';
  order: number;
  duration: number;
  objectives: string | null;
  tips: string | null;
  commonMistakes: string | null;
}

interface StudentProgress {
  progress: number;
  status: string;
  lastAccess: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  order: number;
  icon: string;
  isPremium: boolean;
  countryCode: string;
  licenseCode: string;
  modules: CourseModule[];
  studentProgress?: StudentProgress;
}

// ── Constants ──────────────────────────────────────────────────────────
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  theory: 'Théorie',
  practice: 'Pratique',
  safety: 'Sécurité',
  regulations: 'Réglementation',
  'eco-driving': 'Éco-conduite',
  highway: 'Autoroute',
  night: 'Nuit',
  weather: 'Météo',
  first_aid: 'Secourisme',
};

const LEVEL_TRANSLATIONS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

const CATEGORY_ICONS: Record<string, string> = {
  theory: '📖',
  practice: '🚗',
  safety: '🛡️',
  regulations: '⚖️',
  'eco-driving': '🍃',
  highway: '🛣️',
  night: '🌙',
  weather: '🌤️',
  first_aid: '🚑',
};

const CATEGORIES = Object.keys(CATEGORY_TRANSLATIONS);
const LEVELS = ['beginner', 'intermediate', 'advanced'];

const MODULE_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  lesson: { label: 'Leçon', icon: BookOpen, color: 'text-blue-400 bg-blue-950/40 border-blue-800/30' },
  video: { label: 'Vidéo', icon: Video, color: 'text-purple-400 bg-purple-950/40 border-purple-800/30' },
  interactive: { label: 'Interactif', icon: MousePointerClick, color: 'text-amber-400 bg-amber-950/40 border-amber-800/30' },
  quiz: { label: 'Quiz', icon: HelpCircle, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30' },
  summary: { label: 'Résumé', icon: FileText, color: 'text-slate-400 bg-slate-800/40 border-slate-700/30' },
};

// ── Helpers ────────────────────────────────────────────────────────────
function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h}h`;
}

// ── Component ──────────────────────────────────────────────────────────
export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses?userId=demo@adso.com');
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = courses.filter((c) => {
    if (activeCategory && c.category !== activeCategory) return false;
    if (activeLevel && c.level !== activeLevel) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (expandedId === id) setExpandedModuleId(null);
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
              }`}
            >
              {CATEGORY_ICONS[cat]} {CATEGORY_TRANSLATIONS[cat]}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveLevel(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeLevel === null
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            Tous niveaux
          </button>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(activeLevel === lvl ? null : lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeLevel === lvl
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
              }`}
            >
              {LEVEL_TRANSLATIONS[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          {filtered.length} cours trouvé{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-slate-800" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32 bg-slate-800" />
                  <Skeleton className="h-3 w-20 bg-slate-800" />
                </div>
              </div>
              <Skeleton className="h-3 w-full bg-slate-800" />
              <Skeleton className="h-3 w-3/4 bg-slate-800" />
              <Skeleton className="h-2 w-full bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">
            Aucun cours ne correspond à ces filtres.
          </p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <ScrollArea className="max-h-[700px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  expanded={expandedId === course.id}
                  expandedModuleId={expandedModuleId}
                  onToggle={() => toggleExpand(course.id)}
                  onToggleModule={(modId) =>
                    setExpandedModuleId((prev) => (prev === modId ? null : modId))
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}

// ── Course Card ────────────────────────────────────────────────────────
function CourseCard({
  course,
  expanded,
  expandedModuleId,
  onToggle,
  onToggleModule,
}: {
  course: Course;
  expanded: boolean;
  expandedModuleId: string | null;
  onToggle: () => void;
  onToggleModule: (modId: string) => void;
}) {
  const catLabel = CATEGORY_TRANSLATIONS[course.category] || course.category;
  const lvlLabel = LEVEL_TRANSLATIONS[course.level] || course.level;
  const emoji = CATEGORY_ICONS[course.category] || '📘';
  const progress = course.studentProgress?.progress ?? 0;

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
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl shrink-0 leading-none mt-0.5">{emoji}</span>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className="border-emerald-600/30 text-emerald-400 text-[10px] px-2 py-0">
              {catLabel}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] px-2 py-0">
              {lvlLabel}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatDuration(course.duration)}
            </span>
            {course.isPremium && (
              <Badge variant="outline" className="border-amber-600/30 text-amber-400 text-[10px] px-2 py-0">
                Premium
              </Badge>
            )}
          </div>

          {progress > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progression</span>
                <span className="text-emerald-400 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-500" />
            </div>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="bg-slate-800/60" />
              <div className="p-4 sm:p-5 space-y-3">
                <p className="text-slate-300 text-xs leading-relaxed">
                  {course.description}
                </p>
                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">
                  {course.modules.length} module{course.modules.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {course.modules.map((mod) => (
                    <ModuleItem
                      key={mod.id}
                      module={mod}
                      expanded={expandedModuleId === mod.id}
                      onToggle={() => onToggleModule(mod.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── Module Item ────────────────────────────────────────────────────────
function ModuleItem({
  module: mod,
  expanded,
  onToggle,
}: {
  module: CourseModule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cfg = MODULE_TYPE_CONFIG[mod.type] || MODULE_TYPE_CONFIG.lesson;
  const TypeIcon = cfg.icon;
  const objectives = safeParse(mod.objectives);
  const tips = safeParse(mod.tips);
  const mistakes = safeParse(mod.commonMistakes);
  const hasDetails = objectives.length > 0 || tips.length > 0 || mistakes.length > 0;

  return (
    <div className="bg-slate-800/40 rounded-lg border border-slate-800/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        aria-expanded={expanded}
      >
        <TypeIcon className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="text-sm text-slate-200 flex-1 truncate">{mod.title}</span>
        <Badge variant="outline" className={`${cfg.color} text-[10px] px-1.5 py-0 border`}>{
          cfg.label
        }</Badge>
        <span className="text-[10px] text-slate-500 shrink-0">{formatDuration(mod.duration)}</span>
        {hasDetails &&
          (expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          ))}
      </button>

      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5">
              {objectives.length > 0 && (
                <DetailList title="Objectifs" items={objectives} color="text-emerald-400" />
              )}
              {tips.length > 0 && (
                <DetailList title="Conseils" items={tips} color="text-amber-400" />
              )}
              {mistakes.length > 0 && (
                <DetailList title="Erreurs courantes" items={mistakes} color="text-red-400" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Detail List ────────────────────────────────────────────────────────
function DetailList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="space-y-1">
      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{title}</p>
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
