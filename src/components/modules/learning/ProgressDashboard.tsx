'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, CheckCircle2, ClipboardCheck, TrendingUp,
  Clock, Award, Copy, Check, AlertTriangle, BarChart3,
  GraduationCap, Calendar, Shield, Info,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────

const USER_ID = 'demo@adso.com';

type StatsData = {
  userId: string;
  courses: { started: number; completed: number };
  quiz: {
    totalAttempts: number;
    totalQuestionsAnswered: number;
    avgScore: number;
    bestScore: number;
    passRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    totalQuestions: number;
    wrongAttempts: number;
    passRate: number;
  }>;
  weakAreas: Array<{
    category: string;
    passRate: number;
    wrongAttempts: number;
  }>;
};

type ExamHistoryItem = {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  duration: number;
  passed: boolean;
  type: string;
  country: string;
  licenseCode: string;
  wrongAnswers: string[];
  createdAt: string;
};

type ExamHistoryData = {
  history: ExamHistoryItem[];
  stats: {
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    avgScore: number;
    passRate: number;
    bestScore: number;
  };
};

type CertificationItem = {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  countryCode: string;
  licenseCode: string;
  score: number;
  qrCode: string;
  certificateId: string;
  issuedAt: string;
  expiresAt: string;
};

type CertificationsData = {
  certifications: CertificationItem[];
  total: number;
};

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

const TYPE_LABELS: Record<string, string> = {
  practice: 'Entraînement',
  mock_exam: 'Examen blanc',
  official: 'Officiel',
  adaptive: 'Adaptatif',
};

const TYPE_BADGE: Record<string, string> = {
  practice: 'bg-slate-700/50 text-slate-300',
  mock_exam: 'bg-emerald-700/50 text-emerald-300',
  official: 'bg-amber-700/50 text-amber-300',
  adaptive: 'bg-purple-700/50 text-purple-300',
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getBarColor(passRate: number): string {
  if (passRate >= 80) return 'bg-emerald-500';
  if (passRate >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getBarTextColor(passRate: number): string {
  if (passRate >= 80) return 'text-emerald-400';
  if (passRate >= 60) return 'text-amber-400';
  return 'text-red-400';
}

// ─── Component ───────────────────────────────────────────────────────────

export default function ProgressDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistoryData | null>(null);
  const [certifications, setCertifications] = useState<CertificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, examRes, certRes] = await Promise.all([
        fetch(`/api/learning/stats?userId=${USER_ID}`),
        fetch(`/api/exam?userId=${USER_ID}&limit=20`),
        fetch(`/api/certifications?userId=${USER_ID}`),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      if (examRes.ok) {
        const data = await examRes.json();
        setExamHistory(data);
      }
      if (certRes.ok) {
        const data = await certRes.json();
        setCertifications(data);
      }
    } catch {
      // Silently fail — UI shows empty states
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyToClipboard = useCallback((id: string, certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // ─── LOADING STATE ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-800/60 bg-slate-900/80 rounded-xl">
              <CardContent className="py-4 px-4">
                <Skeleton className="h-9 w-9 rounded-lg bg-slate-800 mb-3" />
                <Skeleton className="h-7 w-16 bg-slate-800 mb-1" />
                <Skeleton className="h-3 w-24 bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exam History Skeleton */}
        <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
          <CardHeader className="pb-3 pt-4 px-4">
            <Skeleton className="h-5 w-40 bg-slate-800" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full bg-slate-800 rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
            <CardHeader className="pb-3 pt-4 px-4">
              <Skeleton className="h-5 w-36 bg-slate-800" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-full bg-slate-800 rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
            <CardHeader className="pb-3 pt-4 px-4">
              <Skeleton className="h-5 w-32 bg-slate-800" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-slate-800 rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Cours suivis',
      value: stats?.courses.started ?? 0,
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Cours terminés',
      value: stats?.courses.completed ?? 0,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Examens passés',
      value: examHistory?.stats.totalAttempts ?? stats?.quiz.totalAttempts ?? 0,
      icon: <ClipboardCheck className="h-5 w-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Taux de réussite',
      value: `${examHistory?.stats.passRate ?? stats?.quiz.passRate ?? 0}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Top Row: Stats Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
              <CardContent className="py-4 px-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color} mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── Weak Areas Alert ────────────────────────────────────────────── */}
      {stats?.weakAreas && stats.weakAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-amber-500/30 bg-amber-950/10 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-300 mb-1">
                    Zones à améliorer
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Ces catégories ont un taux de réussite inférieur à 70%. Nous vous recommandons de les pratiquer davantage.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stats.weakAreas.map((area) => (
                      <Badge
                        key={area.category}
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-300"
                      >
                        {CATEGORY_MAP[area.category] || area.category}
                        <span className="ml-1.5 text-amber-400/70">{area.passRate}%</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── Middle: Exam History ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
          <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  Historique des examens
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {examHistory?.history.length ?? 0} tentatives enregistrées
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6">
            {!examHistory?.history || examHistory.history.length === 0 ? (
              <div className="text-center py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 mx-auto mb-3">
                  <ClipboardCheck className="h-7 w-7 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">Aucun examen passé</p>
                <p className="text-xs text-slate-600 mt-1">
                  Passez votre premier examen pour voir votre historique ici
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-2 pr-3">
                  {examHistory.history.slice(0, 10).map((exam, idx) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-xl border border-slate-800/60 bg-slate-800/30 p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${exam.passed ? 'bg-emerald-600/20' : 'bg-red-600/20'}`}>
                            {exam.passed
                              ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              : <AlertTriangle className="h-5 w-5 text-red-400" />
                            }
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white">
                                {exam.correctAnswers}/{exam.totalQuestions}
                              </span>
                              <span className={`text-xs font-semibold ${exam.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {exam.score}%
                              </span>
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${TYPE_BADGE[exam.type] || TYPE_BADGE.practice}`}>
                                {TYPE_LABELS[exam.type] || exam.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{formatDate(exam.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className={`text-xs font-medium ${exam.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                              {exam.passed ? 'Réussi' : 'Échoué'}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                              <Clock className="h-3 w-3" />
                              {formatDuration(exam.duration)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Bottom Row: Category Breakdown + Certifications ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl h-full">
            <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    Taux de réussite par catégorie
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    Performance dans chaque thématique
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              {!stats?.categoryBreakdown || stats.categoryBreakdown.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 mx-auto mb-2">
                    <BarChart3 className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">Aucune donnée disponible</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Passez des examens pour voir vos statistiques par catégorie
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-3 pr-3">
                    {stats.categoryBreakdown
                      .sort((a, b) => a.passRate - b.passRate)
                      .map((cat, idx) => (
                        <motion.div
                          key={cat.category}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-300">
                              {CATEGORY_MAP[cat.category] || cat.category}
                            </span>
                            <span className={`text-xs font-medium ${getBarTextColor(cat.passRate)}`}>
                              {cat.passRate}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.passRate}%` }}
                              transition={{ duration: 0.6, delay: 0.1 + idx * 0.04 }}
                              className={`h-full rounded-full ${getBarColor(cat.passRate)}`}
                            />
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {cat.totalQuestions} questions · {cat.wrongAttempts} erreur(s)
                          </p>
                        </motion.div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl h-full">
            <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    Certifications
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {certifications?.total ?? 0} certification(s) obtenue(s)
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              {!certifications?.certifications || certifications.certifications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 mx-auto mb-2">
                    <GraduationCap className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">Aucune certification</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Obtenez vos certifications en réussissant les examens officiels
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-3 pr-3">
                    {certifications.certifications.map((cert, idx) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-xl border border-slate-800/60 bg-slate-800/30 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                            <Shield className="h-5 w-5 text-amber-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white truncate">{cert.title}</h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-800 text-slate-400 border-slate-700">
                                {TYPE_LABELS[cert.type] || cert.type}
                              </Badge>
                              {cert.score !== null && cert.score > 0 && (
                                <span className="text-[11px] text-emerald-400 font-medium">{cert.score}%</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(cert.issuedAt)}
                              </span>
                              {cert.expiresAt && (
                                <span className="flex items-center gap-1">
                                  Expire : {formatDate(cert.expiresAt)}
                                </span>
                              )}
                            </div>

                            {/* Certificate ID with copy */}
                            <div className="flex items-center gap-2 mt-2">
                              <code className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 font-mono">
                                {cert.certificateId}
                              </code>
                              <button
                                onClick={() => copyToClipboard(cert.id, cert.certificateId)}
                                className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-700 transition-colors"
                                title="Copier l'identifiant"
                              >
                                {copiedId === cert.id
                                  ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  : <Copy className="h-3.5 w-3.5 text-slate-500" />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Additional Stats Footer ───────────────────────────────────────── */}
      {stats && (stats.quiz.totalAttempts > 0 || stats.quiz.bestScore > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-slate-800/60 bg-slate-900/80 rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20">
                  <Info className="h-5 w-5 text-emerald-400" />
                </div>
                <CardTitle className="text-base font-semibold text-white">
                  Détails des performances
                </CardTitle>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Score moyen</p>
                  <p className="text-lg font-bold text-white">{stats.quiz.avgScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Meilleur score</p>
                  <p className="text-lg font-bold text-emerald-400">{stats.quiz.bestScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Questions répondues</p>
                  <p className="text-lg font-bold text-white">{stats.quiz.totalQuestionsAnswered}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tentatives totales</p>
                  <p className="text-lg font-bold text-white">{stats.quiz.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
