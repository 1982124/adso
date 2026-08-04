'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Clock,
  Play,
  Trophy,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Target,
  BrainCircuit,
  FileCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';

// ─── Constants ─────────────────────────────────────────────────────────────

const USER_ID = 'demo@adso.com';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const CATEGORY_MAP: Record<string, string> = {
  regulation: 'Réglementation',
  safety: 'Sécurité',
  sign: 'Signalisation',
  priority: 'Priorité',
  highway: 'Autoroute',
  intersection: 'Intersection',
  parking: 'Stationnement',
  first_aid: 'Secourisme',
  eco_driving: 'Éco-conduite',
  weather: 'Météo',
  vehicle: 'Véhicule',
};

const DIFFICULTY_MAP: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-green-700/50 text-green-300',
  medium: 'bg-amber-700/50 text-amber-300',
  hard: 'bg-red-700/50 text-red-300',
};

// ─── Types ─────────────────────────────────────────────────────────────────

type ExamType = 'practice' | 'mock_exam' | 'official' | 'adaptive';

type ExamState = 'idle' | 'loading' | 'running' | 'finished';

type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
  category: string;
  theme: string;
  reference: string;
};

type ExamResult = {
  attemptId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  wrongAnswers: string[];
};

type ExamConfig = {
  type: ExamType;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  questionCount: number;
  duration: number;
  passThreshold: number;
};

// ─── Exam type definitions ─────────────────────────────────────────────────

const EXAM_TYPES: ExamConfig[] = [
  {
    type: 'practice',
    title: 'Entraînement Libre',
    description: 'Pratiquez à votre rythme avec des questions aléatoires',
    badge: 'Libre',
    badgeColor: 'bg-slate-700/50 text-slate-300',
    icon: Target,
    questionCount: 20,
    duration: 0,
    passThreshold: 70,
  },
  {
    type: 'mock_exam',
    title: 'Examen Blanc',
    description: '40 questions, 30 minutes, comme le vrai examen',
    badge: 'Simulation',
    badgeColor: 'bg-emerald-700/50 text-emerald-300',
    icon: FileCheck,
    questionCount: 40,
    duration: 1800,
    passThreshold: 70,
  },
  {
    type: 'official',
    title: 'Examen Officiel',
    description: '40 questions, 35 minutes, seuil de réussite 35/40',
    badge: 'Officiel',
    badgeColor: 'bg-amber-700/50 text-amber-300',
    icon: GraduationCap,
    questionCount: 40,
    duration: 2100,
    passThreshold: 88,
  },
  {
    type: 'adaptive',
    title: 'Examen Adaptatif',
    description: 'Questions adaptées à vos faiblesses',
    badge: 'Adaptatif',
    badgeColor: 'bg-purple-700/50 text-purple-300',
    icon: BrainCircuit,
    questionCount: 40,
    duration: 1800,
    passThreshold: 70,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ─── IDLE STATE ────────────────────────────────────────────────────────────

function IdleState({
  onStart,
}: {
  onStart: (type: ExamType, difficulty: string, count: number) => void;
}) {
  const [selectedType, setSelectedType] = useState<ExamType>('practice');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(20);

  const selectedConfig = EXAM_TYPES.find((e) => e.type === selectedType)!;
  const isPractice = selectedType === 'practice';

  return (
    <div className="space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold text-white">Plateforme d&rsquo;Examen</h2>
        <p className="text-slate-400">
          Choisissez votre type d&rsquo;examen et commencez à réviser
        </p>
      </motion.div>

      {/* Exam type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {EXAM_TYPES.map((config, i) => {
          const Icon = config.icon;
          const isSelected = selectedType === config.type;
          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                onClick={() => setSelectedType(config.type)}
                className={`cursor-pointer transition-all duration-200 border-slate-800/60 ${
                  isSelected
                    ? 'ring-2 ring-emerald-500/70 bg-slate-800/80'
                    : 'bg-slate-900/80 hover:bg-slate-800/60 hover:border-emerald-500/30'
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-emerald-500/20' : 'bg-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className={`${config.badgeColor} border-0 text-xs`}
                    >
                      {config.badge}
                    </Badge>
                  </div>
                  <h3 className="text-white font-semibold text-sm">
                    {config.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {config.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Configuration section (only for practice) */}
      <AnimatePresence mode="wait">
        {isPractice && (
          <motion.div
            key="practice-config"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900/80 border-slate-800/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">
                  Configuration de l&rsquo;entraînement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm font-medium">
                    Difficulté
                  </p>
                  <Select
                    value={difficulty}
                    onValueChange={setDifficulty}
                  >
                    <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white w-full sm:w-64">
                      <SelectValue placeholder="Choisir la difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm font-medium">
                    Nombre de questions
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {[10, 20, 30, 40].map((n) => (
                      <Button
                        key={n}
                        variant={questionCount === n ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuestionCount(n)}
                        className={
                          questionCount === n
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                        }
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          onClick={() => onStart(selectedType, difficulty, questionCount)}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-8 py-6 text-base shadow-lg shadow-emerald-500/20"
        >
          <Play className="w-5 h-5 mr-2" />
          Commencer l&rsquo;examen
        </Button>
      </motion.div>
    </div>
  );
}

// ─── LOADING STATE ─────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72 bg-slate-800" />
      <Skeleton className="h-4 w-full bg-slate-800" />
      <Card className="bg-slate-900/80 border-slate-800/60">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-800" />
          <Skeleton className="h-5 w-full bg-slate-800" />
          <Skeleton className="h-5 w-3/4 bg-slate-800" />
          <div className="space-y-3 pt-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-slate-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── RUNNING STATE ─────────────────────────────────────────────────────────

function RunningState({
  questions,
  examConfig,
  timeRemaining,
  selectedOption,
  answered,
  onSelectOption,
  onNext,
  onFinish,
  currentIndex,
  answers,
}: {
  questions: Question[];
  examConfig: ExamConfig;
  timeRemaining: number;
  selectedOption: number | null;
  answered: boolean;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onFinish: () => void;
  currentIndex: number;
  answers: Map<string, number>;
}) {
  const q = questions[currentIndex];
  const total = questions.length;
  const progressPercent = Math.round(((currentIndex + (answered ? 1 : 0)) / total) * 100);
  const isLowTime = timeRemaining > 0 && timeRemaining < 60;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm font-medium">
            Question {currentIndex + 1}/{total}
          </span>
          <Badge
            variant="outline"
            className={`${examConfig.badgeColor} border-0 text-xs`}
          >
            {examConfig.badge}
          </Badge>
        </div>
        {examConfig.duration > 0 && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isLowTime
                ? 'bg-red-500/10 border border-red-500/30'
                : 'bg-slate-800/60'
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                isLowTime ? 'text-red-400' : 'text-slate-400'
              }`}
            />
            <span
              className={`font-mono text-sm font-semibold ${
                isLowTime ? 'text-red-400' : 'text-white'
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-2 [&>div]:bg-emerald-500" />

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-slate-900/80 border-slate-800/60">
            <CardContent className="p-6 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                  {CATEGORY_MAP[q.category] || q.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${DIFFICULTY_BADGE[q.difficulty] || 'bg-slate-700 text-slate-300'} border-0 text-xs`}
                >
                  {DIFFICULTY_MAP[q.difficulty] || q.difficulty}
                </Badge>
                {q.theme && (
                  <Badge variant="outline" className="bg-slate-800/60 text-slate-400 border-slate-700/50 text-xs">
                    {q.theme}
                  </Badge>
                )}
              </div>

              {/* Question text */}
              <p className="text-white text-base leading-relaxed font-medium">
                {q.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((option, idx) => {
                  const isCorrect = idx === q.correctIndex;
                  const isSelected = selectedOption === idx;
                  const showResult = answered;

                  let borderColor = 'border-slate-800/60 hover:border-emerald-500/30';
                  let bgColor = 'bg-slate-800/60 hover:bg-slate-700/40';

                  if (showResult) {
                    if (isCorrect) {
                      borderColor = 'border-emerald-500';
                      bgColor = 'bg-emerald-500/10';
                    } else if (isSelected && !isCorrect) {
                      borderColor = 'border-red-500';
                      bgColor = 'bg-red-500/10';
                    }
                  } else if (isSelected) {
                    borderColor = 'border-emerald-500/50';
                    bgColor = 'bg-emerald-500/5';
                  }

                  return (
                    <motion.div
                      key={idx}
                      whileHover={!answered ? { scale: 1.01 } : undefined}
                      whileTap={!answered ? { scale: 0.99 } : undefined}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (!answered && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            onSelectOption(idx);
                          }
                        }}
                        onClick={() => !answered && onSelectOption(idx)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${borderColor} ${bgColor} ${
                          !answered ? 'hover:shadow-[0_0_12px_rgba(16,185,129,0.15)]' : ''
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                            showResult && isCorrect
                              ? 'bg-emerald-500 text-white'
                              : showResult && isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        <span
                          className={`text-sm leading-relaxed pt-1 ${
                            showResult && isCorrect
                              ? 'text-emerald-300 font-medium'
                              : showResult && isSelected && !isCorrect
                                ? 'text-red-300'
                                : 'text-slate-200'
                          }`}
                        >
                          {option}
                        </span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-auto mt-0.5" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-auto mt-0.5" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700/50 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-sm font-semibold">
                          Explication
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {q.explanation}
                      </p>
                      {q.reference && (
                        <p className="text-slate-500 text-xs mt-1">
                          Référence : {q.reference}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                {answered && currentIndex < total - 1 && (
                  <Button
                    variant="outline"
                    onClick={onNext}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    Question suivante
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
                {(!answered || currentIndex === total - 1) && <div />}
                <Button
                  variant="outline"
                  onClick={onFinish}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Terminer l&rsquo;examen
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── FINISHED STATE ────────────────────────────────────────────────────────

function FinishedState({
  questions,
  answers,
  result,
  examConfig,
  elapsedSeconds,
  onRestart,
  onBack,
}: {
  questions: Question[];
  answers: Map<string, number>;
  result: ExamResult | null;
  examConfig: ExamConfig;
  elapsedSeconds: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const score = result?.score ?? 0;
  const passed = result?.passed ?? false;
  const correctCount = result?.correctAnswers ?? 0;
  const totalQuestions = questions.length;

  // Build wrong answers details
  const wrongDetails = questions.filter((q) => answers.has(q.id) && answers.get(q.id) !== q.correctIndex);

  // Category analysis
  const categoryStats: Record<
    string,
    { total: number; correct: number }
  > = {};
  for (const q of questions) {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total++;
    if (answers.get(q.id) === q.correctIndex) {
      categoryStats[q.category].correct++;
    }
  }
  const categories = Object.entries(categoryStats).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total
  );

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="text-center space-y-4 py-6"
      >
        <div className="relative inline-block">
          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center mx-auto ${
              passed
                ? 'bg-emerald-500/10 ring-4 ring-emerald-500/30'
                : 'bg-red-500/10 ring-4 ring-red-500/30'
            }`}
          >
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {score}%
              </motion.span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {passed ? (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Trophy className="w-6 h-6 text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-400">
                  RÉUSSI
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-2xl font-bold text-red-400">
                  ÉCHOUÉ
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            label: 'Réponses',
            value: `${correctCount}/${totalQuestions}`,
            icon: CheckCircle2,
            color: 'text-emerald-400',
          },
          {
            label: 'Score',
            value: `${score}%`,
            icon: Target,
            color: 'text-emerald-400',
          },
          {
            label: 'Temps',
            value: formatTime(elapsedSeconds),
            icon: Clock,
            color: 'text-slate-300',
          },
          {
            label: 'Type',
            value: examConfig.badge,
            icon: examConfig.icon,
            color: 'text-slate-300',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 text-center"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
            <p className="text-white text-lg font-bold">{stat.value}</p>
            <p className="text-slate-400 text-xs">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Wrong answers */}
      {wrongDetails.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/80 border-slate-800/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Réponses incorrectes ({wrongDetails.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  {showDetails ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ScrollArea className="max-h-96 px-6 pb-4">
                    <div className="space-y-4">
                      {wrongDetails.map((q, i) => {
                        const userAnswer = answers.get(q.id)!;
                        return (
                          <div
                            key={q.id}
                            className="border border-slate-800/60 rounded-xl p-4 space-y-2"
                          >
                            <p className="text-slate-200 text-sm font-medium">
                              {i + 1}. {q.question}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 text-xs">
                              <span className="text-red-400">
                                Votre réponse : {OPTION_LABELS[userAnswer]} — {q.options[userAnswer]}
                              </span>
                              <span className="hidden sm:inline text-slate-600">|</span>
                              <span className="text-emerald-400">
                                Bonne réponse : {OPTION_LABELS[q.correctIndex]} — {q.options[q.correctIndex]}
                              </span>
                            </div>
                            {q.explanation && (
                              <p className="text-slate-400 text-xs leading-relaxed">
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Category analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-slate-900/80 border-slate-800/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Analyse par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map(([cat, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100);
              const barColor =
                pct >= 80
                  ? 'bg-emerald-500'
                  : pct >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500';
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      {CATEGORY_MAP[cat] || cat}
                    </span>
                    <span className="text-slate-400">
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
      >
        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux examens
        </Button>
      </motion.div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function ExamPlatform() {
  const [examState, setExamState] = useState<ExamState>('idle');
  const [examConfig, setExamConfig] = useState<ExamConfig>(EXAM_TYPES[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending auto-advance on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // Post results to API
  const submitResults = useCallback(
    async (qs: Question[], ans: Map<string, number>, config: ExamConfig, elapsed: number) => {
      const answerArray = Array.from(ans.entries()).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      if (answerArray.length === 0) return;

      try {
        const res = await fetch('/api/exam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: USER_ID,
            answers: answerArray,
            type: config.type,
            duration: elapsed,
            countryCode: 'FR',
            licenseCode: 'B',
          }),
        });
        if (res.ok) {
          const data: ExamResult = await res.json();
          setResult(data);
        }
      } catch (err) {
        console.error('Erreur de soumission :', err);
      }
    },
    []
  );

  const handleFinish = useCallback(async () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setElapsedSeconds(finalElapsed);
    setExamState('finished');

    await submitResults(questions, answers, examConfig, finalElapsed);
  }, [questions, answers, examConfig, submitResults]);

  // Timer countdown
  useEffect(() => {
    if (examState !== 'running' || examConfig.duration <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, examConfig.duration]);

  // Auto-finish when timer reaches 0
  useEffect(() => {
    if (
      examState === 'running' &&
      examConfig.duration > 0 &&
      timeRemaining === 0
    ) {
      handleFinish();
    }
  }, [timeRemaining, examState, examConfig.duration, handleFinish]);

  // Elapsed time counter
  useEffect(() => {
    if (examState !== 'running') return;
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [examState]);

  const startExam = useCallback(
    async (type: ExamType, difficulty: string, count: number) => {
      const config = EXAM_TYPES.find((e) => e.type === type)!;
      setExamConfig(config);
      setExamState('loading');
      setAnswers(new Map());
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswered(false);
      setResult(null);
      setElapsedSeconds(0);

      // Build query params
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.set('difficulty', difficulty);
      params.set('count', String(type === 'practice' ? count : config.questionCount));

      try {
        const res = await fetch(`/api/learning/questions?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const fetchedQuestions: Question[] = data.questions;
          if (fetchedQuestions.length === 0) {
            setExamState('idle');
            return;
          }
          setQuestions(fetchedQuestions);
          setTimeRemaining(config.duration);
          setExamState('running');
        } else {
          setExamState('idle');
        }
      } catch (err) {
        console.error('Erreur de chargement des questions :', err);
        setExamState('idle');
      }
    },
    []
  );

  const handleSelectOption = useCallback(
    (index: number) => {
      if (answered) return;
      const q = questions[currentIndex];
      setSelectedOption(index);
      setAnswered(true);

      const newAnswers = new Map(answers);
      newAnswers.set(q.id, index);
      setAnswers(newAnswers);

      // Auto-advance after 1.5s
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setAnswered(false);
        }
      }, 1500);
    },
    [answered, answers, currentIndex, questions]
  );

  const handleNext = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setExamState('idle');
    setQuestions([]);
    setAnswers(new Map());
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setResult(null);
    setElapsedSeconds(0);
    setTimeRemaining(0);
  }, []);

  const handleBack = useCallback(() => {
    handleRestart();
  }, [handleRestart]);

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-full">
      {examState === 'idle' && <IdleState onStart={startExam} />}
      {examState === 'loading' && <LoadingState />}
      {examState === 'running' && (
        <RunningState
          questions={questions}
          examConfig={examConfig}
          timeRemaining={timeRemaining}
          selectedOption={selectedOption}
          answered={answered}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          onFinish={handleFinish}
          currentIndex={currentIndex}
          answers={answers}
        />
      )}
      {examState === 'finished' && (
        <FinishedState
          questions={questions}
          answers={answers}
          result={result}
          examConfig={examConfig}
          elapsedSeconds={elapsedSeconds}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
