'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen,
  Car,
  Shield,
  Route,
  Leaf,
  Heart,
  BookMarked,
  Moon,
  PlayCircle,
  Trophy,
  Target,
  Clock,
  Crown,
  User,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CourseModule {
  id: string;
  title: string;
  type: string;
  order: number;
  duration: number;
}

interface StudentProgress {
  id: string;
  progress: number;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  isPremium: boolean;
  modules: CourseModule[];
  studentProgress: StudentProgress | null;
}

// ─── Icon mapping ────────────────────────────────────────────────────────────

const categoryIcons: Record<string, React.ElementType> = {
  theory: BookOpen,
  practice: Car,
  safety: Shield,
  highway: Route,
  'eco-driving': Leaf,
  eco: Leaf,
  'first-aid': Heart,
  firstaid: Heart,
  regulations: BookMarked,
  night: Moon,
};

const categoryColors: Record<string, string> = {
  theory: 'bg-emerald-100 text-emerald-600',
  practice: 'bg-amber-100 text-amber-600',
  safety: 'bg-red-100 text-red-600',
  highway: 'bg-violet-100 text-violet-600',
  'eco-driving': 'bg-lime-100 text-lime-600',
  eco: 'bg-lime-100 text-lime-600',
  'first-aid': 'bg-rose-100 text-rose-600',
  firstaid: 'bg-rose-100 text-rose-600',
  regulations: 'bg-sky-100 text-sky-600',
  night: 'bg-indigo-100 text-indigo-600',
};

const levelLabels: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

const levelColors: Record<string, string> = {
  beginner: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  intermediate: 'border-amber-300 bg-amber-50 text-amber-700',
  advanced: 'border-red-300 bg-red-50 text-red-700',
};

// ─── Progress Ring Component ─────────────────────────────────────────────────

function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 6,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-emerald-500"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-lg font-bold text-gray-800">
        {percentage}%
      </span>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border-gray-100 bg-white shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {value}
          </p>
          <p className="truncate text-xs text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Course Card ─────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const Icon = categoryIcons[course.category] || BookOpen;
  const iconColor = categoryColors[course.category] || 'bg-gray-100 text-gray-600';
  const progressValue = course.studentProgress?.progress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="group h-full border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-5">
          {/* Top row: icon + badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-gray-900">
                  {course.title}
                </h4>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${levelColors[course.level] || 'border-gray-300 text-gray-600'}`}
                  >
                    {levelLabels[course.level] || course.level}
                  </Badge>
                  {course.isPremium && (
                    <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {progressValue > 0 && (
              <span className="shrink-0 text-xs font-semibold text-emerald-600">
                {Math.round(progressValue)}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
            {course.description}
          </p>

          {/* Progress bar */}
          {progressValue > 0 && (
            <div className="space-y-1">
              <Progress
                value={progressValue}
                className="h-1.5 bg-gray-100 [&>div]:bg-emerald-500"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-400">
              {course.duration} min · {course.modules?.length ?? 0} modules
            </span>
            <Button
              size="sm"
              className="h-7 gap-1 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Continuer
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Course Skeleton ─────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <Card className="border-gray-100 bg-white shadow-sm">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Content (needs QueryClientProvider) ───────────────────────────

function DashboardContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () =>
      fetch('/api/courses?userId=demo@adso.com').then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      }),
    staleTime: 60_000,
  });

  const statsCards = [
    {
      icon: BookOpen,
      label: 'Cours en cours',
      value: '5',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Trophy,
      label: 'Quiz réussis',
      value: '12',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Target,
      label: 'Score moyen',
      value: '78%',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Clock,
      label: 'Appris',
      value: '15h',
      color: 'bg-rose-100 text-rose-600',
    },
  ];

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="relative bg-gray-50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tableau de bord de l&apos;élève
          </h2>
          <p className="text-lg text-gray-500">
            Découvrez l&apos;expérience d&apos;apprentissage personnalisée offerte
            par ADSO
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 24 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          {/* Top Bar */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bonjour,</p>
                <p className="text-base font-semibold text-gray-900">
                  Élève Démo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Progression globale</p>
                <p className="text-sm font-semibold text-emerald-600">
                  65% complété
                </p>
              </div>
              <ProgressRing percentage={65} size={64} strokeWidth={5} />
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {statsCards.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Course List Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Mes cours
              </h3>
              <span className="text-xs text-gray-400">
                {courses?.length ?? '—'} cours disponibles
              </span>
            </div>

            {/* Course Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}

              {isError && (
                <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <AlertCircle className="h-10 w-10 text-red-400" />
                  <p className="text-sm text-gray-500">
                    Impossible de charger les cours. Veuillez réessayer.
                  </p>
                </div>
              )}

              {courses &&
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export with QueryClientProvider ─────────────────────────────────────

export default function StudentDashboard() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
