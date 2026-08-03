'use client'

import { motion } from 'framer-motion'
import {
  GitBranch,
  GitPullRequest,
  Play,
  CheckCircle2,
  Search,
  TestTube,
  Globe,
  ShieldCheck,
  Rocket,
  Monitor,
  Server,
  HardDrive,
  Activity,
  AlertTriangle,
  Bell,
  Gauge,
  Database,
  CloudOff,
  ArrowRight,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

/* ─── 11.1 CI/CD Pipeline ─── */
const pipelineStages = [
  { name: 'Lint', desc: 'ESLint + Prettier', icon: <Search className="h-4 w-4" />, color: 'text-yellow-400' },
  { name: 'Static Analysis', desc: 'TypeScript + SonarQube', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-blue-400' },
  { name: 'Unit Tests', desc: 'Jest — coverage 90%+', icon: <TestTube className="h-4 w-4" />, color: 'text-green-400' },
  { name: 'Integration', desc: 'Playwright — API tests', icon: <Globe className="h-4 w-4" />, color: 'text-teal-400' },
  { name: 'E2E', desc: 'Playwright — full flows', icon: <Monitor className="h-4 w-4" />, color: 'text-cyan-400' },
  { name: 'Security Scan', desc: 'Snyk + OWASP ZAP', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-amber-400' },
  { name: 'Deploy', desc: 'Vercel — preview + prod', icon: <Rocket className="h-4 w-4" />, color: 'text-emerald-400' },
]

/* ─── 11.2 Environments ─── */
const environments = [
  {
    name: 'Development',
    icon: <Monitor className="h-5 w-5" />,
    desc: 'Environnement local des developpeurs',
    details: ['Hot reload', 'Mock data', 'Debug tools', 'Local DB'],
    color: 'border-yellow-500/30 bg-yellow-500/5',
    badge: 'LOCAL',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    name: 'Staging',
    icon: <Server className="h-5 w-5" />,
    desc: 'Pre-visualisation des pull requests',
    details: ['Preview deploys', 'E2E automated', 'CodeReview', 'Feature flags'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'CI/CD',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    name: 'Pre-production',
    icon: <HardDrive className="h-5 w-5" />,
    desc: 'Mirror de la production avec data anonymisee',
    details: ['Load testing', 'Canary releases', 'Stress tests', 'Data anonymisee'],
    color: 'border-amber-500/30 bg-amber-500/5',
    badge: 'QA',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    name: 'Production',
    icon: <Globe className="h-5 w-5" />,
    desc: 'Environnement live avec SLA garanti',
    details: ['Multi-region', 'Auto-scaling', '99.9% SLA', 'Real users'],
    color: 'border-emerald-500/30 bg-emerald-500/5',
    badge: 'LIVE',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
]

const monitoringTools = [
  { name: 'APM', tool: 'Datadog', desc: 'Traces, metriques, logs correlés', icon: <Activity className="h-4 w-4" /> },
  { name: 'Logging', tool: 'ELK Stack', desc: 'Elasticsearch + Logstash + Kibana', icon: <Database className="h-4 w-4" /> },
  { name: 'Alerting', tool: 'PagerDuty', desc: 'Escalades automatiques 24/7', icon: <Bell className="h-4 w-4" /> },
]

/* ─── 11.3 Scalabilite ─── */
const perfTargets = [
  { label: 'Latence p95', value: '<100ms', desc: 'Temps de reponse 95e centile', icon: <Gauge className="h-5 w-5" /> },
  { label: 'Disponibilite', value: '99.9%', desc: 'SLA garanti, <43min downtime/mois', icon: <Zap className="h-5 w-5" /> },
  { label: 'Debit', value: '10K RPS', desc: 'Requetes par seconde en baseline', icon: <Activity className="h-5 w-5" /> },
]

const scalingStrategies = [
  { name: 'Kubernetes HPA', desc: 'Auto-scaling horizontal base sur CPU, RAM et requetes', icon: <Cpu className="h-4 w-4" /> },
  { name: 'Read Replicas', desc: '3 replicas de lecture pour distribuer la charge DB', icon: <Database className="h-4 w-4" /> },
  { name: 'Write-Through Cache', desc: 'Redis cache avec invalidation automatique', icon: <Layers className="h-4 w-4" /> },
  { name: 'CDN Global', desc: 'CloudFront — assets statiques + edge caching', icon: <CloudOff className="h-4 w-4" /> },
]

export default function DevOps() {
  return (
    <section id="devops" className="bg-slate-950 py-20 px-4">
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
            Partie 11 — DevOps Production
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            DevOps Production
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Pipeline CI/CD robuste, monitoring 24/7 et architecture scalable pour des millions d&apos;utilisateurs
          </p>
        </motion.div>

        <Tabs defaultValue="cicd" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-slate-900 border border-slate-800 h-auto p-1 mb-10">
            <TabsTrigger value="cicd" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              11.1 Git & CI/CD
            </TabsTrigger>
            <TabsTrigger value="environments" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              11.2 Environnements & Monitoring
            </TabsTrigger>
            <TabsTrigger value="scalabilite" className="text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">
              11.3 Scalabilite & Performance
            </TabsTrigger>
          </TabsList>

          {/* ─── 11.1 ─── */}
          <TabsContent value="cicd">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                11.1 Git Workflow et Pipeline CI/CD
              </h3>
              <p className="text-slate-400 text-sm">
                GitHub Flow — branches feature, PR reviews, deploiement automatise
              </p>
            </div>

            {/* Git Flow */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="h-5 w-5 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-slate-200">GitHub Flow</h4>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {[
                    { icon: <GitBranch className="h-4 w-4" />, label: 'feature/*', sub: 'Branche de travail' },
                    { icon: <GitPullRequest className="h-4 w-4" />, label: 'Pull Request', sub: 'Review + CI' },
                    { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Merge', sub: 'main branch' },
                    { icon: <Play className="h-4 w-4" />, label: 'Deploy', sub: 'Auto deploiement' },
                  ].map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-2 flex-1">
                      <div className="bg-slate-800 rounded-lg px-4 py-3 flex items-center gap-2 flex-1 border border-slate-700">
                        <span className="text-cyan-400 shrink-0">{step.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{step.label}</p>
                          <p className="text-xs text-slate-500">{step.sub}</p>
                        </div>
                      </div>
                      {idx < 3 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 shrink-0 hidden sm:block">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline stages */}
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Pipeline CI/CD — 7 etapes</h4>
            <div className="space-y-2">
              {pipelineStages.map((stage, i) => (
                <motion.div key={stage.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-3 flex items-center gap-4">
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-500 w-5">{i + 1}</span>
                        <ArrowRight className="h-4 w-4 text-slate-700" />
                        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center ${stage.color}`}>
                          {stage.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">{stage.name}</p>
                        <p className="text-xs text-slate-500">{stage.desc}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs shrink-0">
                        PASS
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 11.2 ─── */}
          <TabsContent value="environments">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                11.2 Environnements et Monitoring
              </h3>
              <p className="text-slate-400 text-sm">
                4 environnements isoles et monitoring 24/7 avec Datadog + ELK + PagerDuty
              </p>
            </div>

            {/* Environments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {environments.map((env, i) => (
                <motion.div key={env.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className={`bg-slate-900 border ${env.color}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                            {env.icon}
                          </div>
                          <CardTitle className="text-base text-slate-200">{env.name}</CardTitle>
                        </div>
                        <Badge className={`text-xs border ${env.badgeColor}`}>{env.badge}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-400 mb-3">{env.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {env.details.map((d) => (
                          <Badge key={d} variant="outline" className="text-xs border-slate-700 text-slate-400 bg-slate-800/50">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Monitoring */}
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Stack de Monitoring</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {monitoringTools.map((tool, i) => (
                <motion.div key={tool.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-400">{tool.icon}</span>
                        <span className="text-sm font-semibold text-slate-200">{tool.name}</span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium mb-1">{tool.tool}</p>
                      <p className="text-xs text-slate-400">{tool.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── 11.3 ─── */}
          <TabsContent value="scalabilite">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                11.3 Scalabilite et Performance
              </h3>
              <p className="text-slate-400 text-sm">
                Architecture elasticue pour supporter la croissance
              </p>
            </div>

            {/* Performance Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {perfTargets.map((target, i) => (
                <motion.div key={target.label} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800 text-center">
                    <CardContent className="p-5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                        {target.icon}
                      </div>
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{target.value}</div>
                      <div className="text-sm font-medium text-slate-200 mb-0.5">{target.label}</div>
                      <div className="text-xs text-slate-500">{target.desc}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Scaling Strategies */}
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Strategies de Scaling</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scalingStrategies.map((strat, i) => (
                <motion.div key={strat.name} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                        {strat.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200 mb-1">{strat.name}</h4>
                        <p className="text-xs text-slate-400">{strat.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
