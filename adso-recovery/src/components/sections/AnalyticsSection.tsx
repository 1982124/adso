'use client';

import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// --- Color palette ---
const COLORS = {
  emerald: '#059669',
  emeraldLight: '#34d399',
  amber: '#d97706',
  amberLight: '#fbbf24',
  teal: '#0d9488',
  tealLight: '#2dd4bf',
  slate: '#475569',
  slateLight: '#94a3b8',
};

const PIE_COLORS = [COLORS.emeraldLight, COLORS.amber, '#ef4444'];

// --- Mock data for charts ---
const monthlyProgression = [
  { month: 'Jan', score: 42 },
  { month: 'Fév', score: 48 },
  { month: 'Mar', score: 55 },
  { month: 'Avr', score: 58 },
  { month: 'Mai', score: 65 },
  { month: 'Jun', score: 70 },
  { month: 'Jul', score: 74 },
  { month: 'Aoû', score: 78 },
  { month: 'Sep', score: 82 },
  { month: 'Oct', score: 85 },
  { month: 'Nov', score: 88 },
  { month: 'Déc', score: 91 },
];

// --- Types ---
interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalQuizAttempts: number;
  totalQuestions: number;
  averageScore: number;
  passRate: number;
  difficultyDistribution: { difficulty: string; count: number }[];
  questionCategories: { category: string; count: number }[];
}

interface LeaderboardEntry {
  rank: number;
  userName: string;
  bestScore: number;
  totalAttempts: number;
}

// --- KPI Card ---
function KPICard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className="min-w-0">
            {loading ? (
              <>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
                <p className="text-sm text-slate-500 truncate">{label}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Chart Skeleton ---
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export default function AnalyticsSection() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });

  const { data: leaderboardData } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/leaderboard?limit=5');
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return res.json();
    },
  });

  // Build category bar data — merge API data with fallback
  const categoryData = (() => {
    if (analytics?.questionCategories && analytics.questionCategories.length > 0) {
      return analytics.questionCategories.map((c) => ({
        name: c.category,
        questions: c.count,
      }));
    }
    // Fallback mock data
    return [
      { name: 'Réglementation', questions: 18 },
      { name: 'Sécurité', questions: 15 },
      { name: 'Signalisation', questions: 22 },
      { name: 'Priorité', questions: 12 },
    ];
  })();

  // Build difficulty pie data
  const difficultyData = (() => {
    if (analytics?.difficultyDistribution && analytics.difficultyDistribution.length > 0) {
      const map = new Map<string, number>();
      for (const d of analytics.difficultyDistribution) {
        map.set(d.difficulty, d.count);
      }
      return [
        { name: 'Facile', value: map.get('facile') ?? map.get('easy') ?? 15 },
        { name: 'Moyen', value: map.get('moyen') ?? map.get('medium') ?? 25 },
        { name: 'Difficile', value: map.get('difficile') ?? map.get('hard') ?? 10 },
      ];
    }
    return [
      { name: 'Facile', value: 15 },
      { name: 'Moyen', value: 25 },
      { name: 'Difficile', value: 10 },
    ];
  })();

  const totalQuizzesPassed = analytics
    ? Math.round((analytics.totalQuizAttempts * analytics.passRate) / 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="analytics" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Tableau de bord analytique
              </h2>
              <p className="text-slate-500 text-sm">
                Vue d&apos;ensemble de la plateforme ADSO
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div variants={itemVariants}>
                <KPICard
                  icon={Users}
                  label="Total Utilisateurs"
                  value={analytics?.totalUsers ?? '—'}
                  color={COLORS.emerald}
                  loading={analyticsLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  icon={BookOpen}
                  label="Cours Disponibles"
                  value={analytics?.totalCourses ?? '—'}
                  color={COLORS.amber}
                  loading={analyticsLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  icon={CheckCircle}
                  label="Quiz Réussis"
                  value={analyticsLoading ? '—' : totalQuizzesPassed}
                  color={COLORS.teal}
                  loading={analyticsLoading}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  icon={TrendingUp}
                  label="Score Moyen"
                  value={analyticsLoading ? '—' : `${analytics?.averageScore ?? 0}%`}
                  color={COLORS.slate}
                  loading={analyticsLoading}
                />
              </motion.div>
            </div>

            {/* Charts Grid */}
            {analyticsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart - Score Progression */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Progression des scores</CardTitle>
                      <CardDescription>Évolution mensuelle du score moyen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyProgression}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              }}
                              formatter={(value: number) => [`${value}%`, 'Score']}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="score"
                              name="Score moyen"
                              stroke={COLORS.emerald}
                              strokeWidth={3}
                              dot={{ fill: COLORS.emerald, r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bar Chart - Category Distribution */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Distribution par catégorie</CardTitle>
                      <CardDescription>Nombre de questions par thématique</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11, fill: '#64748b' }}
                              axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <YAxis
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              }}
                            />
                            <Bar
                              dataKey="questions"
                              name="Questions"
                              radius={[6, 6, 0, 0]}
                            >
                              {categoryData.map((_, idx) => (
                                <Cell
                                  key={`cell-${idx}`}
                                  fill={
                                    [COLORS.emerald, COLORS.amber, COLORS.teal, COLORS.slateLight][
                                      idx % 4
                                    ]
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Pie Chart - Difficulty Distribution */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Répartition difficulté</CardTitle>
                      <CardDescription>Distribution des questions par niveau</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={difficultyData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={4}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={{ stroke: '#94a3b8' }}
                            >
                              {difficultyData.map((_, idx) => (
                                <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mini Leaderboard */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Classement — Top 5</CardTitle>
                      <CardDescription>Meilleurs scores des élèves</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(leaderboardData?.leaderboard && leaderboardData.leaderboard.length > 0
                          ? leaderboardData.leaderboard
                          : [
                              { rank: 1, userName: 'Marie D.', bestScore: 95, totalAttempts: 3 },
                              { rank: 2, userName: 'Lucas M.', bestScore: 90, totalAttempts: 5 },
                              { rank: 3, userName: 'Sophie L.', bestScore: 85, totalAttempts: 4 },
                              { rank: 4, userName: 'Thomas R.', bestScore: 80, totalAttempts: 2 },
                              { rank: 5, userName: 'Emma B.', bestScore: 75, totalAttempts: 6 },
                            ]
                        ).slice(0, 5).map((entry) => (
                          <div
                            key={entry.rank}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                entry.rank === 1
                                  ? 'bg-amber-100 text-amber-700'
                                  : entry.rank === 2
                                    ? 'bg-slate-200 text-slate-600'
                                    : entry.rank === 3
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {entry.rank}
                            </span>
                            <span className="flex-1 text-sm font-medium text-slate-700 truncate">
                              {entry.userName}
                            </span>
                            <span className="text-sm font-semibold text-emerald-600">
                              {entry.bestScore}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
