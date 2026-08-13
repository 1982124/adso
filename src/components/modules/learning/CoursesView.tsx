'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Maximize2,
  Minus,
  MousePointerClick,
  Plus,
  RefreshCw,
  Video,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocaleStore } from '@/stores/locale-store';

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
  licenseCode: string | null;
  modules: CourseModule[];
  studentProgress?: StudentProgress | null;
}

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  theory: 'Théorie', practice: 'Pratique', safety: 'Sécurité', regulations: 'Réglementation',
  'eco-driving': 'Éco-conduite', highway: 'Autoroute', night: 'Conduite de nuit', weather: 'Météo', first_aid: 'Secourisme',
};
const LEVEL_TRANSLATIONS: Record<string, string> = {
  beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé',
};
const CATEGORY_ICONS: Record<string, string> = {
  theory: '📖', practice: '🚗', safety: '🛡️', regulations: '⚖️', 'eco-driving': '🍃', highway: '🛣️', night: '🌙', weather: '🌤️', first_aid: '🚑',
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
const FONT_STEPS = [16, 18, 20, 23, 26, 30, 34];

type ReaderTheme = 'dark' | 'sepia' | 'light';

function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h${remaining}` : `${hours}h`;
}

function CourseReader({
  course,
  module,
  modules,
  onClose,
  onChangeModule,
}: {
  course: Course;
  module: CourseModule;
  modules: CourseModule[];
  onClose: () => void;
  onChangeModule: (module: CourseModule) => void;
}) {
  const [fontIndex, setFontIndex] = useState(2);
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [wide, setWide] = useState(false);
  const index = modules.findIndex((item) => item.id === module.id);
  const canPrev = index > 0;
  const canNext = index >= 0 && index < modules.length - 1;
  const progress = modules.length > 1 && index >= 0 ? ((index + 1) / modules.length) * 100 : 100;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && canPrev) onChangeModule(modules[index - 1]);
      if (event.key === 'ArrowRight' && canNext) onChangeModule(modules[index + 1]);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canNext, canPrev, index, modules, onChangeModule, onClose]);

  const themeClass = theme === 'light' ? 'bg-white text-slate-800' : theme === 'sepia' ? 'bg-[#f5ecd9] text-[#40372d]' : 'bg-slate-950 text-slate-100';
  const articleClass = theme === 'light' ? 'prose-slate' : theme === 'sepia' ? 'prose-stone' : 'prose-invert';

  return (
    <motion.div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`Lecture : ${module.title}`}>
      <motion.div initial={{ y: 24, opacity: 0, scale: 0.99 }} animate={{ y: 0, opacity: 1, scale: 1 }} className={`w-full h-full sm:h-[94vh] ${wide ? 'max-w-7xl' : 'max-w-5xl'} rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col ${themeClass}`}>
        <header className="shrink-0 border-b border-current/10 px-4 sm:px-6 py-3 flex items-center gap-2">
          <div className="min-w-0 flex-1"><p className="text-[11px] uppercase tracking-widest opacity-50 truncate">{course.title}</p><h2 className="font-semibold truncate">{module.title}</h2></div>
          <button onClick={() => setFontIndex((v) => Math.max(0, v - 1))} disabled={fontIndex === 0} aria-label="Réduire la taille du texte" className="p-2 rounded-lg hover:bg-current/10 disabled:opacity-30"><Minus className="w-4 h-4" /></button>
          <span className="hidden sm:block text-xs tabular-nums opacity-60 w-8 text-center">{FONT_STEPS[fontIndex]}</span>
          <button onClick={() => setFontIndex((v) => Math.min(FONT_STEPS.length - 1, v + 1))} disabled={fontIndex === FONT_STEPS.length - 1} aria-label="Augmenter la taille du texte" className="p-2 rounded-lg hover:bg-current/10 disabled:opacity-30"><Plus className="w-4 h-4" /></button>
          <button onClick={() => setTheme((v) => v === 'dark' ? 'sepia' : v === 'sepia' ? 'light' : 'dark')} aria-label="Changer le thème de lecture" className="px-2.5 py-2 rounded-lg hover:bg-current/10 text-xs font-medium">Aa</button>
          <button onClick={() => setWide((v) => !v)} aria-label="Changer la largeur de lecture" className="p-2 rounded-lg hover:bg-current/10"><Maximize2 className="w-4 h-4" /></button>
          <button onClick={onClose} aria-label="Fermer le lecteur" className="p-2 rounded-lg hover:bg-current/10"><X className="w-5 h-5" /></button>
        </header>
        <div className="shrink-0 px-4 sm:px-6 py-2 border-b border-current/10"><div className="flex items-center justify-between text-xs opacity-60 mb-1"><span>Module {Math.max(index + 1, 1)} sur {modules.length}</span><span>{Math.round(progress)}%</span></div><Progress value={progress} className="h-1 bg-current/10 [&>div]:bg-emerald-500" /></div>
        <ScrollArea className="flex-1"><main className="px-5 sm:px-10 lg:px-16 py-8 sm:py-12"><article className={`mx-auto max-w-3xl ${articleClass} prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-emerald-500`} style={{ fontSize: FONT_STEPS[fontIndex], lineHeight: 1.75 }}><ReactMarkdown>{module.content || 'Le contenu de cette leçon est en préparation.'}</ReactMarkdown></article></main></ScrollArea>
        <footer className="shrink-0 border-t border-current/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"><button disabled={!canPrev} onClick={() => onChangeModule(modules[index - 1])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-current/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm"><ChevronLeft className="w-4 h-4" /> Précédent</button><span className="hidden sm:block text-xs opacity-50">← → pour naviguer · Échap pour fermer</span><button disabled={!canNext} onClick={() => onChangeModule(modules[index + 1])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-current/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm">Suivant <ChevronRight className="w-4 h-4" /></button></footer>
      </motion.div>
    </motion.div>
  );
}

export default function CoursesView() {
  const { country } = useLocaleStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [reading, setReading] = useState<{ course: Course; module: CourseModule } | null>(null);

  const fetchCourses = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ countryCode: country.code });
      const res = await fetch(`/api/courses?${params.toString()}`, { signal, cache: 'no-store' });
      if (!res.ok) throw new Error(`Catalogue indisponible (${res.status})`);
      const data: unknown = await res.json();
      if (!Array.isArray(data)) throw new Error('Réponse catalogue invalide');
      setCourses(data as Course[]);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setCourses([]);
      setError('Impossible de charger le catalogue pour le moment.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [country.code]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchCourses(controller.signal);
    return () => controller.abort();
  }, [fetchCourses]);

  useEffect(() => {
    setExpandedId(null);
    setExpandedModuleId(null);
    setReading(null);
  }, [country.code]);

  const filtered = useMemo(() => courses.filter((course) => (!activeCategory || course.category === activeCategory) && (!activeLevel || course.level === activeLevel)), [courses, activeCategory, activeLevel]);
  const catalogCountry = courses[0]?.countryCode ?? null;
  const usingReferenceCatalog = Boolean(catalogCountry && catalogCountry !== country.code);
  const openReader = (course: Course, module: CourseModule) => setReading({ course, module });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">Catalogue pédagogique</p><h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Cours pour {country.name}</h2><p className="text-xs text-slate-500 mt-1">Pays sélectionné : {country.code}</p></div><button onClick={() => void fetchCourses()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:text-white disabled:opacity-40"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser</button></div>
      {usingReferenceCatalog && <div className="rounded-xl border border-amber-700/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-200"><strong>Catalogue de référence :</strong> le catalogue réglementaire spécifique à {country.name} n'est pas encore publié. ADSO affiche temporairement le catalogue France de référence pour que l'apprentissage reste accessible. Le contenu réglementaire ne doit pas être considéré comme spécifique à {country.name}.</div>}
      <div className="space-y-3"><div className="flex flex-wrap gap-2"><FilterButton active={activeCategory === null} onClick={() => setActiveCategory(null)}>Toutes</FilterButton>{CATEGORIES.map((category) => <FilterButton key={category} active={activeCategory === category} onClick={() => setActiveCategory(activeCategory === category ? null : category)}>{CATEGORY_ICONS[category]} {CATEGORY_TRANSLATIONS[category]}</FilterButton>)}</div><div className="flex flex-wrap gap-2"><FilterButton active={activeLevel === null} onClick={() => setActiveLevel(null)}>Tous niveaux</FilterButton>{LEVELS.map((level) => <FilterButton key={level} active={activeLevel === level} onClick={() => setActiveLevel(activeLevel === level ? null : level)}>{LEVEL_TRANSLATIONS[level]}</FilterButton>)}</div></div>
      {error && <div className="rounded-xl border border-red-800/40 bg-red-950/20 px-4 py-3 text-sm text-red-300 flex items-center justify-between gap-3"><span>{error}</span><button onClick={() => void fetchCourses()} className="text-xs font-semibold hover:text-white">Réessayer</button></div>}
      {!loading && !error && <p className="text-xs text-slate-500">{filtered.length} cours disponible{filtered.length !== 1 ? 's' : ''}</p>}
      {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-5 space-y-3"><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg bg-slate-800" /><div className="space-y-1"><Skeleton className="h-5 w-32 bg-slate-800" /><Skeleton className="h-3 w-20 bg-slate-800" /></div></div><Skeleton className="h-3 w-full bg-slate-800" /><Skeleton className="h-3 w-3/4 bg-slate-800" /><Skeleton className="h-2 w-full bg-slate-800" /></div>)}</div>}
      {!loading && !error && filtered.length === 0 && <div className="text-center py-16 space-y-2"><GraduationCap className="w-10 h-10 text-slate-700 mx-auto" /><p className="text-slate-400 text-sm">Aucun cours ne correspond à ces filtres.</p></div>}
      {!loading && !error && filtered.length > 0 && <ScrollArea className="max-h-[700px] overflow-y-auto"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-3">{filtered.map((course) => <CourseCard key={course.id} course={course} expanded={expandedId === course.id} expandedModuleId={expandedModuleId} onToggle={() => { setExpandedId((prev) => prev === course.id ? null : course.id); setExpandedModuleId(null); }} onToggleModule={(moduleId) => setExpandedModuleId((prev) => prev === moduleId ? null : moduleId)} onRead={openReader} />)}</div></ScrollArea>}
      <AnimatePresence>{reading && <CourseReader course={reading.course} module={reading.module} modules={reading.course.modules} onClose={() => setReading(null)} onChangeModule={(module) => setReading({ course: reading.course, module })} />}</AnimatePresence>
    </motion.div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${active ? 'bg-emerald-600 text-white' : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'}`}>{children}</button>;
}

function CourseCard({ course, expanded, expandedModuleId, onToggle, onToggleModule, onRead }: { course: Course; expanded: boolean; expandedModuleId: string | null; onToggle: () => void; onToggleModule: (moduleId: string) => void; onRead: (course: Course, module: CourseModule) => void }) {
  const progress = course.studentProgress?.progress ?? 0;
  return <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}><Card className="bg-slate-900/80 border border-slate-800/60 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-colors"><button onClick={onToggle} className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-expanded={expanded}><div className="flex items-start justify-between gap-2"><div className="flex items-start gap-3 min-w-0"><span className="text-2xl shrink-0 leading-none mt-0.5">{CATEGORY_ICONS[course.category] || '📘'}</span><div className="min-w-0"><h3 className="text-white font-semibold text-sm sm:text-base truncate">{course.title}</h3><p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{course.description}</p></div></div>{expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />}</div><div className="flex flex-wrap items-center gap-2 mt-3"><Badge variant="outline" className="border-emerald-600/30 text-emerald-400 text-[10px] px-2 py-0">{CATEGORY_TRANSLATIONS[course.category] || course.category}</Badge><Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] px-2 py-0">{LEVEL_TRANSLATIONS[course.level] || course.level}</Badge><span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{formatDuration(course.duration)}</span>{course.isPremium && <Badge variant="outline" className="border-amber-600/30 text-amber-400 text-[10px] px-2 py-0">Premium</Badge>}</div>{progress > 0 && <div className="mt-3 space-y-1.5"><div className="flex items-center justify-between text-xs"><span className="text-slate-400">Progression</span><span className="text-emerald-400 font-medium">{Math.round(progress)}%</span></div><Progress value={progress} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-500" /></div>}</button><AnimatePresence>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><Separator className="bg-slate-800/60" /><div className="p-4 sm:p-5 space-y-3"><p className="text-slate-300 text-xs leading-relaxed">{course.description}</p><p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{course.modules.length} module{course.modules.length !== 1 ? 's' : ''}</p><div className="space-y-2">{course.modules.map((module) => <ModuleItem key={module.id} module={module} expanded={expandedModuleId === module.id} onToggle={() => onToggleModule(module.id)} onRead={() => onRead(course, module)} />)}</div></div></motion.div>}</AnimatePresence></Card></motion.div>;
}

function ModuleItem({ module, expanded, onToggle, onRead }: { module: CourseModule; expanded: boolean; onToggle: () => void; onRead: () => void }) {
  const config = MODULE_TYPE_CONFIG[module.type] || MODULE_TYPE_CONFIG.lesson;
  const TypeIcon = config.icon;
  const objectives = safeParse(module.objectives);
  const tips = safeParse(module.tips);
  const mistakes = safeParse(module.commonMistakes);
  const hasDetails = objectives.length > 0 || tips.length > 0 || mistakes.length > 0;
  return <div className="bg-slate-800/40 rounded-lg border border-slate-800/40 overflow-hidden"><div className="flex items-center gap-2.5 px-3 py-2.5"><button onClick={onToggle} className="flex-1 min-w-0 text-left flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg" aria-expanded={expanded}><TypeIcon className="w-4 h-4 text-slate-500 shrink-0" /><span className="text-sm text-slate-200 truncate">{module.title}</span><Badge variant="outline" className={`${config.color} text-[10px] px-1.5 py-0 border`}>{config.label}</Badge><span className="text-[10px] text-slate-500 shrink-0">{formatDuration(module.duration)}</span>{hasDetails && (expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />)}</button><button onClick={onRead} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 px-2.5 py-1.5 text-[11px] font-semibold transition-colors" aria-label={`Lire ${module.title}`}><BookOpen className="w-3.5 h-3.5" />Lire</button></div><AnimatePresence>{expanded && hasDetails && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden"><div className="px-3 pb-3 space-y-2.5">{objectives.length > 0 && <DetailList title="Objectifs" items={objectives} color="text-emerald-400" />}{tips.length > 0 && <DetailList title="Conseils" items={tips} color="text-amber-400" />}{mistakes.length > 0 && <DetailList title="Erreurs courantes" items={mistakes} color="text-red-400" />}</div></motion.div>}</AnimatePresence></div>;
}

function DetailList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return <div className="space-y-1"><p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{title}</p><ul className="space-y-0.5 pl-1">{items.map((item, index) => <li key={`${item}-${index}`} className={`${color} text-[11px] flex items-start gap-1.5`}><span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />{item}</li>)}</ul></div>;
}
