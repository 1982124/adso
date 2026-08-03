'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Building2,
  ShieldCheck,
  Database,
  Workflow,
  BrainCircuit,
  Target,
  DollarSign,
  Activity,
  Repeat,
  ThumbsUp,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

/* ─── 10.1 Dashboards ─── */
const dashboards = [
  {
    role: 'Eleve',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'from-cyan-500 to-cyan-600',
    kpis: [
      { name: 'Progression', value: '78%', icon: <Target className="h-3 w-3" /> },
      { name: 'Performance', value: '92/100', icon: <TrendingUp className="h-3 w-3" /> },
      { name: 'Objectifs', value: '5/8', icon: <Activity className="h-3 w-3" /> },
    ],
    features: ['Cours suivis', 'Examens passes', 'Temps d\'apprentissage', 'Points forts/faiblesses'],
  },
  {
    role: 'Moniteur',
    icon: <Users className="h-5 w-5" />,
    color: 'from-teal-500 to-emerald-500',
    kpis: [
      { name: 'Eleves actifs', value: '24', icon: <Users className="h-3 w-3" /> },
      { name: 'Planning', value: '87%', icon: <Clock className="h-3 w-3" /> },
      { name: 'Taux reussite', value: '88%', icon: <ThumbsUp className="h-3 w-3" /> },
    ],
    features: ['Vue globale eleves', 'Optimisation planning', 'Progression individuelle', 'Examens a venir'],
  },
  {
    role: 'Auto-ecole',
    icon: <Building2 className="h-5 w-5" />,
    color: 'from-emerald-500 to-green-500',
    kpis: [
      { name: 'Revenus', value: '45.2K€', icon: <DollarSign className="h-3 w-3" /> },
      { name: 'Eleves', value: '156', icon: <Users className="h-3 w-3" /> },
      { name: 'Perf. moniteurs', value: '91%', icon: <TrendingUp className="h-3 w-3" /> },
    ],
    features: ['Revenue mensuel', 'Metriques eleves', 'Performance moniteurs', 'Taux de retention'],
  },
  {
    role: 'Admin',
    icon: <ShieldCheck className="h-5 w-5" />,
    color: 'from-purple-500 to-violet-500',
    kpis: [
      { name: 'DAU', value: '523K', icon: <Activity className="h-3 w-3" /> },
      { name: 'Revenus', value: '2.1M€', icon: <DollarSign className="h-3 w-3" /> },
      { name: 'Pays actifs', value: '45', icon: <Target className="h-3 w-3" /> },
    ],
    features: ['Analytics globaux', 'Performance systeme', 'Alertes securite', 'KPIs business'],
  },
]

/* ─── 10.2 BI Architecture ─── */
const biLayers = [
  { layer: 'Sources', items: ['PostgreSQL RDS', 'Redis Cache', 'S3 Logs', 'Stripe API', 'Auth0 Events'], icon: <Database className="h-4 w-4" /> },
  { layer: 'Ingestion', items: ['Airflow DAGs', 'Fivetran', 'Custom Connectors'], icon: <Workflow className="h-4 w-4" /> },
  { layer: 'Transformation', items: ['dbt Core', 'SQL Models', 'Tests & Docs', 'Lineage Tracking'], icon: <BrainCircuit className="h-4 w-4" /> },
  { layer: 'Warehouse', items: ['BigQuery', 'Star Schema', 'Partitioned Tables', 'Materialized Views'], icon: <Database className="h-4 w-4" /> },
  { layer: 'Analytics', items: ['Looker Studio', 'Custom Dashboards', 'Predictive ML', 'Anomaly Detection'], icon: <BarChart3 className="h-4 w-4" /> },
]

/* ─── 10.3 Key Metrics ─── */
const keyMetrics = [
  { metric: 'DAU', target: '500K+', formula: 'Daily active users', icon: <Activity className="h-4 w-4" /> },
  { metric: 'Completion rate', target: '85%+', formula: 'Completed courses / Started', icon: <Target className="h-4 w-4" /> },
  { metric: 'Pass rate first try', target: '75%+', formula: 'First-try passes / Total attempts', icon: <ThumbsUp className="h-4 w-4" /> },
  { metric: 'NPS', target: '60+', formula: 'Net Promoter Score', icon: <TrendingUp className="h-4 w-4" /> },
  { metric: 'CAC payback', target: '<6 mois', formula: 'Customer acquisition cost', icon: <DollarSign className="h-4 w-4" /> },
  { metric: 'Churn monthly', target: '<3%', formula: 'Monthly churn rate', icon: <AlertTriangle className="h-4 w-4" /> },
]

export default function DataAnalytics() {
  return (
    <section id="analytics" className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
            Partie 10 — Data & Analytics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Data et Analytics
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tableaux de bord personnalises, Business Intelligence avancee et metriques cles pour chaque acteur
          </p>
        </motion.div>

        <Tabs defaultValue="dashboards" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-slate-900 border border-slate-800 h-auto p-1 mb-10">
            <TabsTrigger value="dashboards" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              10.1 Dashboards & KPIs
            </TabsTrigger>
            <TabsTrigger value="bi" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              10.2 Business Intelligence
            </TabsTrigger>
            <TabsTrigger value="metriques" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              10.3 Metriques Cles
            </TabsTrigger>
          </TabsList>

          {/* ─── 10.1 ─── */}
          <TabsContent value="dashboards">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                10.1 Tableaux de Bord et KPIs
              </h3>
              <p className="text-slate-400 text-sm">
                4 tableaux de bord adaptes a chaque role : eleve, moniteur, auto-ecole, admin
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboards.map((dash, i) => (
                <motion.div key={dash.role} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    {/* Header bar */}
                    <div className={`px-5 py-3 bg-gradient-to-r ${dash.color} flex items-center gap-3`}>
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                        {dash.icon}
                      </div>
                      <span className="text-white font-semibold text-sm">Dashboard {dash.role}</span>
                    </div>
                    <CardContent className="p-5">
                      {/* KPI cards */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {dash.kpis.map((kpi) => (
                          <div key={kpi.name} className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
                            <div className="text-xs text-slate-500 mb-1">{kpi.name}</div>
                            <div className="text-lg font-bold text-cyan-400">{kpi.value}</div>
                          </div>
                        ))}
                      </div>
                      <Separator className="bg-slate-800 mb-3" />
                      {/* Feature list */}
                      <ul className="space-y-1.5">
                        {dash.features.map((feat) => (
                          <li key={feat} className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 10.2 ─── */}
          <TabsContent value="bi">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                10.2 Architecture Business Intelligence
              </h3>
              <p className="text-slate-400 text-sm">
                Pipeline ETL modern data stack : Airflow + dbt + BigQuery
              </p>
            </div>
            <div className="space-y-3">
              {biLayers.map((layer, i) => (
                <motion.div key={layer.layer} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-44 shrink-0 px-5 py-3 bg-slate-800/80 flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-slate-700">
                          <div className="text-cyan-400">{layer.icon}</div>
                          <span className="text-sm font-semibold text-slate-200">{layer.layer}</span>
                        </div>
                        <div className="flex-1 px-5 py-3 flex flex-wrap gap-2">
                          {layer.items.map((item) => (
                            <Badge key={item} variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/50 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Data flow diagram */}
            <Card className="bg-slate-900 border-slate-800 mt-6">
              <CardContent className="p-5">
                <h4 className="text-sm font-semibold text-slate-200 mb-4">Flux de donnees</h4>
                <div className="flex flex-col md:flex-row items-center gap-2">
                  {[
                    { label: 'Sources', sub: 'App + DB + API' },
                    { label: 'Airflow', sub: 'Orchestration' },
                    { label: 'dbt', sub: 'Transformation' },
                    { label: 'BigQuery', sub: 'Entrepot' },
                    { label: 'Dashboards', sub: 'Visualisation' },
                  ].map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 text-center min-w-[80px]">
                        <p className="text-xs font-semibold text-cyan-400">{step.label}</p>
                        <p className="text-xs text-slate-500">{step.sub}</p>
                      </div>
                      {idx < 4 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 shrink-0 hidden md:block">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── 10.3 ─── */}
          <TabsContent value="metriques">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                10.3 Metriques Cles
              </h3>
              <p className="text-slate-400 text-sm">
                KPIs de suivi pour mesurer la performance globale de la plateforme
              </p>
            </div>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-semibold">Metrique</TableHead>
                      <TableHead className="text-slate-400 font-semibold">Objectif</TableHead>
                      <TableHead className="text-slate-400 font-semibold">Formule</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keyMetrics.map((row, i) => (
                      <motion.tr
                        key={row.metric}
                        custom={i}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400">{row.icon}</span>
                            <span className="text-sm font-medium text-slate-200">{row.metric}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                            {row.target}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">{row.formula}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
