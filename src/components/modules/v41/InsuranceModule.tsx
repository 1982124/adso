'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  FileCheck,
  AlertTriangle,
  BarChart3,
  Activity,
  TrendingUp,
  Share2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Camera,
  Send,
  ChevronRight,
  Search,
  Award,
  Zap,
  Heart,
  Phone,
  Siren,
  Gauge,
  Route,
  Star,
  Users,
  FileText,
  CircleDollarSign,
  Target,
  ShieldCheck,
  ShieldAlert,
  BrainCircuit,
  Wrench,
  AlertOctagon,
  Info,
  ArrowRight,
  Calculator,
  Building2,
  RefreshCw,
  FilePlus,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────
interface TrustScoreData {
  id: string
  overallScore: number
  drivingQuality: number
  mechanicalHealth: number
  maintenanceQuality: number
  learningProgress: number
  examPerformance: number
  telematicsScore: number
  accidentHistory: number
  fraudRisk: number
  compliance: number
  lastCalculated: string
}

interface Policy {
  id: string
  policyNumber: string
  type: string
  provider: string
  vehicleType: string
  premium: number
  deductible: number
  status: string
  startDate: string
  endDate: string
  paydEnabled: boolean
  phydEnabled: boolean
}

interface Claim {
  id: string
  policyId: string
  type: string
  status: string
  description: string
  damageAssessment: string | null
  estimatedCost: number | null
  approvedAmount: number | null
  location: string | null
  incidentDate: string | null
  createdAt: string
}

interface RiskData {
  vehicleRiskScore: number
  driverRiskLevel: string
  locationRisk: number
  riskFactors: { name: string; value: number; description: string }[]
  premiumRecommendation: number
}

interface DashboardKpis {
  policesActives: number
  totalReclamations: number
  coutTotalReclamations: number
  alertesFraudeEnAttente: number
  primeMoyenne: number
  risqueMoyen: number
}

interface FraudAlertItem {
  id: string
  claimId: string | null
  type: string
  probability: number
  description: string
  evidence: string | null
  status: string
  createdAt: string
}

interface AccidentIncidentItem {
  id: string
  vehicleId: string | null
  type: string
  severity: string
  latitude: number | null
  longitude: number | null
  speed: number | null
  deceleration: number | null
  timestamp: string
  resolved: boolean
  claimId: string | null
}

interface PhydData {
  totalKm: number
  dureeTotale: number
  dureeTotaleFormatee?: string
  pourcentageConduiteNuit: number
  pourcentageVille: number
  pourcentageAutoroute: number
  scoreConduiteMoyen: number
  scoreEcoMoyen: number
  nombreTrajets: number
  ventilationMensuelle: {
    mois: string
    nombreTrajets: number
    kilometrageTotal: number
    dureeTotaleSecondes: number
    scoreConduiteMoyen: number
    scoreEcoMoyen: number
    freinagesBrusques: number
    accelerationsBrusques: number
  }[]
}

interface PremiumResult {
  policyId: string
  policyNumber: string
  type: string
  basePremium: number
  trustScore: number
  trustAdjustment: number
  behaviorPenalty: number
  riskFactor: number
  calculatedPremium: number
  currentPremium: number | null
  factors: {
    avgVehicleAge: number
    avgMileage: number
    claimsCount: number
    maintenanceQuality: number
    totalHarshBrakes: number
    totalSpeedViolations: number
    totalFatigueEvents: number
    totalSessions: number
  }
}

interface PartnerItem {
  id: string
  name: string
  code: string
  country: string
  contactEmail: string | null
  contactPhone: string | null
  commissionRate: number
  status: string
  createdAt: string
}

// ─── Score History (for Trust Score tab chart) ───────────
const scoreHistory = [
  { mois: 'Jan', score: 62 },
  { mois: 'Fév', score: 65 },
  { mois: 'Mar', score: 64 },
  { mois: 'Avr', score: 70 },
  { mois: 'Mai', score: 73 },
  { mois: 'Jun', score: 76 },
  { mois: 'Jul', score: 78 },
  { mois: 'Août', score: 82 },
]

// ─── Helpers ─────────────────────────────────────────────────
function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: string }> = {
    active: { label: 'Active', variant: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'En attente', variant: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
    expired: { label: 'Expirée', variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' },
    cancelled: { label: 'Annulée', variant: 'bg-red-600/20 text-red-400 border-red-500/30' },
    submitted: { label: 'Soumis', variant: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
    reviewing: { label: 'En cours', variant: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
    approved: { label: 'Approuvé', variant: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
    denied: { label: 'Refusé', variant: 'bg-red-600/20 text-red-400 border-red-500/30' },
    paid: { label: 'Payé', variant: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
    closed: { label: 'Fermé', variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' },
  }
  const s = map[status] || { label: status, variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' }
  return <Badge variant="outline" className={s.variant}>{s.label}</Badge>
}

function getClaimTypeLabel(type: string) {
  const map: Record<string, string> = {
    collision: 'Collision',
    theft: 'Vol',
    vandalism: 'Vandalisme',
    weather: 'Intempérie',
    fire: 'Incendie',
    flood: 'Inondation',
    liability: 'Responsabilité civile',
    uninsured: 'Non assuré',
  }
  return map[type] || type
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

function getProgressColor(score: number): string {
  if (score >= 80) return '[&>div]:bg-emerald-500'
  if (score >= 60) return '[&>div]:bg-amber-500'
  if (score >= 40) return '[&>div]:bg-orange-500'
  return '[&>div]:bg-red-500'
}

// ─── Animated Number ─────────────────────────────────────────
function AnimatedNumber({ value, className = '' }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const step = (end - start) / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span className={className}>{display}</span>
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function InsuranceModule() {
  const [loading, setLoading] = useState(true)
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [dashboardKpis, setDashboardKpis] = useState<DashboardKpis | null>(null)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [newClaimOpen, setNewClaimOpen] = useState(false)
  const [claimForm, setClaimForm] = useState({
    type: 'collision',
    description: '',
    date: '',
    location: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [tsRes, polRes, clRes, riskRes, dashRes] = await Promise.all([
        fetch('/api/insurance/trust-score').then(r => r.json()),
        fetch('/api/insurance/policies').then(r => r.json()),
        fetch('/api/insurance/claims').then(r => r.json()),
        fetch('/api/insurance/risk').then(r => r.json()),
        fetch('/api/insurance/dashboard').then(r => r.json()).catch(() => null),
      ])
      if (tsRes.trustScore) setTrustScore(tsRes.trustScore)
      else setTrustScore({
        id: 'ts-mock', overallScore: 78, drivingQuality: 82, mechanicalHealth: 71,
        maintenanceQuality: 68, learningProgress: 85, examPerformance: 76,
        telematicsScore: 80, accidentHistory: 55, fraudRisk: 8, compliance: 90,
        lastCalculated: new Date().toISOString(),
      })
      if (polRes.policies?.length) setPolicies(polRes.policies)
      else setPolicies([])
      if (clRes.claims?.length) setClaims(clRes.claims)
      else setClaims([])
      if (riskRes.riskData) setRiskData(riskRes.riskData)
      else if (riskRes.vehicleRiskScore !== undefined) setRiskData(riskRes)
      if (dashRes?.kpis) setDashboardKpis(dashRes.kpis)
    } catch {
      setTrustScore({
        id: 'ts-mock', overallScore: 78, drivingQuality: 82, mechanicalHealth: 71,
        maintenanceQuality: 68, learningProgress: 85, examPerformance: 76,
        telematicsScore: 80, accidentHistory: 55, fraudRisk: 8, compliance: 90,
        lastCalculated: new Date().toISOString(),
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => { void fetchData() }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const handleShareScore = async () => {
    try {
      await navigator.clipboard.writeText(`Mon Score de Confiance ADSO : ${trustScore?.overallScore}/100 — Partagé via ADSO Assurance IA`)
    } catch { /* clipboard not available */ }
  }

  const handleFileClaim = async () => {
    if (!claimForm.description || !claimForm.date) return
    try {
      await fetch('/api/insurance/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimForm),
      })
      setNewClaimOpen(false)
      setClaimForm({ type: 'collision', description: '', date: '', location: '' })
      fetchData()
    } catch { /* error handled silently */ }
  }

  const claimsPipeline = [
    { key: 'submitted', label: 'Soumis', count: claims.filter(c => c.status === 'submitted').length, color: 'border-blue-500 bg-blue-500/10' },
    { key: 'reviewing', label: 'En cours', count: claims.filter(c => c.status === 'reviewing').length, color: 'border-amber-500 bg-amber-500/10' },
    { key: 'approved', label: 'Approuvé', count: claims.filter(c => c.status === 'approved').length, color: 'border-emerald-500 bg-emerald-500/10' },
    { key: 'denied', label: 'Refusé', count: claims.filter(c => c.status === 'denied').length, color: 'border-red-500 bg-red-500/10' },
    { key: 'paid', label: 'Payé', count: claims.filter(c => c.status === 'paid').length, color: 'border-emerald-400 bg-emerald-400/10' },
    { key: 'closed', label: 'Fermé', count: claims.filter(c => c.status === 'closed').length, color: 'border-slate-500 bg-slate-500/10' },
  ]

  if (loading) return <LoadingState />
  if (!trustScore) return null

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Assurance IA</h1>
              <p className="text-slate-400 text-sm">Plateforme d'intelligence assurance ADSO v4.2</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="trust" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="trust" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <ShieldCheck className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Score de Confiance</span><span className="sm:hidden">Score</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <BarChart3 className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Tableau de bord</span><span className="sm:hidden">TdB</span>
            </TabsTrigger>
            <TabsTrigger value="claims" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <FileCheck className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Sinistres</span><span className="sm:hidden">Sinistres</span>
            </TabsTrigger>
            <TabsTrigger value="fraud" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <AlertTriangle className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Anti-Fraude</span><span className="sm:hidden">Fraude</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <Target className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Évaluation Risque</span><span className="sm:hidden">Risque</span>
            </TabsTrigger>
            <TabsTrigger value="accident" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <AlertTriangle className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Accidents</span><span className="sm:hidden">Accidents</span>
            </TabsTrigger>
            <TabsTrigger value="telematics" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <Activity className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Télématique</span><span className="sm:hidden">Télém.</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <Calculator className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Tarification</span><span className="sm:hidden">Tarif.</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400 text-slate-300">
              <Building2 className="w-4 h-4 mr-1.5" /><span className="hidden sm:inline">Partenaires</span><span className="sm:hidden">Parts.</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: TRUST SCORE */}
          <TabsContent value="trust">
            <TrustScoreTab trustScore={trustScore} scoreHistory={scoreHistory} onShare={handleShareScore} />
          </TabsContent>

          {/* TAB 2: INSURANCE DASHBOARD */}
          <TabsContent value="dashboard">
            <InsuranceDashboardTab policies={policies} claims={claims} dashboardKpis={dashboardKpis} />
          </TabsContent>

          {/* TAB 3: CLAIMS CENTER */}
          <TabsContent value="claims">
            <ClaimsCenterTab
              claims={claims}
              policies={policies}
              pipeline={claimsPipeline}
              selectedClaim={selectedClaim}
              onSelectClaim={setSelectedClaim}
              newClaimOpen={newClaimOpen}
              setNewClaimOpen={setNewClaimOpen}
              claimForm={claimForm}
              setClaimForm={setClaimForm}
              onFileClaim={handleFileClaim}
            />
          </TabsContent>

          {/* TAB 4: FRAUD DETECTION */}
          <TabsContent value="fraud">
            <FraudDetectionTab trustScore={trustScore} />
          </TabsContent>

          {/* TAB 5: RISK ASSESSMENT */}
          <TabsContent value="risk">
            <RiskAssessmentTab riskData={riskData} />
          </TabsContent>

          {/* TAB 6: ACCIDENT CENTER */}
          <TabsContent value="accident">
            <AccidentCenterTab />
          </TabsContent>

          {/* TAB 7: TELEMATICS CENTER */}
          <TabsContent value="telematics">
            <TelematicsCenterTab />
          </TabsContent>

          {/* TAB 8: PREMIUM ENGINE */}
          <TabsContent value="premium">
            <PremiumEngineTab />
          </TabsContent>

          {/* TAB 9: PARTNERS */}
          <TabsContent value="partners">
            <PartnersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOADING STATE
// ═══════════════════════════════════════════════════════════════
function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-slate-800" />
            <Skeleton className="h-4 w-72 bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 bg-slate-900 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 1: TRUST SCORE DASHBOARD
// ═══════════════════════════════════════════════════════════════
function TrustScoreTab({
  trustScore,
  scoreHistory,
  onShare,
}: {
  trustScore: TrustScoreData
  scoreHistory: { mois: string; score: number }[]
  onShare: () => void
}) {
  const score = trustScore.overallScore
  const circumference = 2 * Math.PI * 90
  const dashOffset = circumference - (score / 100) * circumference

  const factors = [
    { name: 'Qualité de conduite', value: trustScore.drivingQuality, icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'Santé mécanique', value: trustScore.mechanicalHealth, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Maintenance', value: trustScore.maintenanceQuality, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Progression apprentissage', value: trustScore.learningProgress, icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Performance examens', value: trustScore.examPerformance, icon: <Award className="w-4 h-4" /> },
    { name: 'Télématique', value: trustScore.telematicsScore, icon: <Activity className="w-4 h-4" /> },
    { name: 'Historique accidents', value: trustScore.accidentHistory, icon: <AlertOctagon className="w-4 h-4" /> },
    { name: 'Risque de fraude', value: trustScore.fraudRisk, icon: <ShieldAlert className="w-4 h-4" />, inverse: true },
    { name: 'Conformité', value: trustScore.compliance, icon: <ShieldCheck className="w-4 h-4" /> },
  ]

  const recommendations = [
    { text: 'Planifiez un entretien mécanique pour améliorer votre score de santé véhicule.', priority: 'high' },
    { text: 'Réduisez les freinages brusques — votre score télématique peut encore s\'améliorer.', priority: 'medium' },
    { text: 'Passez la certification avancée pour booster votre score de progression.', priority: 'low' },
  ]

  const getLevel = (s: number) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-emerald-400' }
    if (s >= 75) return { label: 'Très bon', color: 'text-emerald-400' }
    if (s >= 60) return { label: 'Bon', color: 'text-amber-400' }
    if (s >= 40) return { label: 'Moyen', color: 'text-orange-400' }
    return { label: 'Faible', color: 'text-red-400' }
  }

  const level = getLevel(score)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Score de Confiance ADSO
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className="relative w-56 h-56 mb-4">
              <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgb(30,41,59)" strokeWidth="12" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke={score >= 75 ? 'rgb(16,185,129)' : score >= 50 ? 'rgb(245,158,11)' : 'rgb(239,68,68)'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatedNumber value={score} className={`text-5xl font-bold ${level.color}`} />
                <span className="text-slate-400 text-sm mt-1">sur 100</span>
                <span className={`text-xs font-medium mt-1 ${level.color}`}>{level.label}</span>
              </div>
            </div>
            <Button
              onClick={onShare}
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 mt-2"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager avec l\'assureur
            </Button>
            <p className="text-slate-500 text-xs mt-3">
              Dernière mise à jour : {new Date(trustScore.lastCalculated).toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Détail du Score</CardTitle>
            <CardDescription className="text-slate-400">Composition par facteur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
            {factors.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500">{f.icon}</span>
                    <span>{f.name}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(f.inverse ? 100 - f.value : f.value)}`}>
                    {f.inverse ? `${100 - f.value}%` : `${f.value}%`}
                  </span>
                </div>
                <Progress
                  value={f.inverse ? 100 - f.value : f.value}
                  className={`h-2 ${getProgressColor(f.inverse ? 100 - f.value : f.value)}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trend & Recommendations */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Évolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(16,185,129)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(16,185,129)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(51,65,85)" />
                  <XAxis dataKey="mois" stroke="rgb(100,116,139)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="rgb(100,116,139)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }}
                    labelStyle={{ color: 'rgb(148,163,184)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="rgb(16,185,129)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Separator className="my-4 bg-slate-800" />
            <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Recommandations
            </h4>
            <div className="space-y-2">
              {recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${r.priority === 'high' ? 'text-red-400' : r.priority === 'medium' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <p className="text-slate-300">{r.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 2: INSURANCE DASHBOARD
// ═══════════════════════════════════════════════════════════════
function InsuranceDashboardTab({ policies, claims, dashboardKpis }: { policies: Policy[]; claims: Claim[]; dashboardKpis: DashboardKpis | null }) {
  const activePolicies = policies.filter(p => p.status === 'active')
  const pendingClaims = claims.filter(c => ['submitted', 'reviewing'].includes(c.status))
  const totalPremium = activePolicies.reduce((s, p) => s + (p.premium || 0), 0)
  const avgRisk = dashboardKpis?.risqueMoyen ?? 50
  const avgPremium = dashboardKpis?.primeMoyenne ?? 0
  const fraudAlertsCount = dashboardKpis?.alertesFraudeEnAttente ?? 0
  const totalClaimsCount = dashboardKpis?.totalReclamations ?? claims.length

  const summary = [
    { label: 'Polices actives', value: dashboardKpis?.policesActives ?? activePolicies.length, icon: <FileCheck className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
    { label: 'Total sinistres', value: totalClaimsCount, icon: <BarChart3 className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-600/10' },
    { label: 'Alertes fraude', value: fraudAlertsCount, icon: <ShieldAlert className="w-5 h-5" />, color: fraudAlertsCount > 0 ? 'text-red-400' : 'text-emerald-400', bg: fraudAlertsCount > 0 ? 'bg-red-600/10' : 'bg-emerald-600/10' },
    { label: 'Prime moyenne', value: `${avgPremium.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`, icon: <CircleDollarSign className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-600/10' },
  ]

  const claimsOverview = [
    { label: 'Soumis', count: claims.filter(c => c.status === 'submitted').length, color: 'bg-blue-500' },
    { label: 'En cours', count: claims.filter(c => c.status === 'reviewing').length, color: 'bg-amber-500' },
    { label: 'Approuvés', count: claims.filter(c => c.status === 'approved').length, color: 'bg-emerald-500' },
    { label: 'Payés', count: claims.filter(c => c.status === 'paid').length, color: 'bg-emerald-400' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <Card key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-slate-400 text-xs">{s.label}</p>
              <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Policies */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Polices actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {policies.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium truncate">{p.policyNumber}</span>
                      {getStatusBadge(p.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{p.type}</span>
                      <span>•</span>
                      <span>{p.vehicleType}</span>
                    </div>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-white font-medium">{p.premium?.toLocaleString('fr-FR')} €</p>
                    <p className="text-slate-500 text-xs">/an</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims Overview */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Aperçu des sinistres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {claimsOverview.map((co) => (
                <div key={co.label} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${co.color} mb-2`} />
                  <p className="text-2xl font-bold text-white">{co.count}</p>
                  <p className="text-slate-400 text-xs">{co.label}</p>
                </div>
              ))}
            </div>
            <Separator className="bg-slate-800" />
            <div>
              <h4 className="text-slate-300 text-sm font-medium mb-2">Derniers sinistres</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {claims.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="text-white text-sm">{getClaimTypeLabel(c.type)}</p>
                      <p className="text-slate-500 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : ''}</p>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 3: CLAIMS CENTER
// ═══════════════════════════════════════════════════════════════
function ClaimsCenterTab({
  claims,
  policies,
  pipeline,
  selectedClaim,
  onSelectClaim,
  newClaimOpen,
  setNewClaimOpen,
  claimForm,
  setClaimForm,
  onFileClaim,
}: {
  claims: Claim[]
  policies: Policy[]
  pipeline: { key: string; label: string; count: number; color: string }[]
  selectedClaim: Claim | null
  onSelectClaim: (c: Claim | null) => void
  newClaimOpen: boolean
  setNewClaimOpen: (v: boolean) => void
  claimForm: { type: string; description: string; date: string; location: string }
  setClaimForm: (f: { type: string; description: string; date: string; location: string }) => void
  onFileClaim: () => void
}) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-semibold">Centre des Sinistres</h2>
          <p className="text-slate-400 text-sm">Gérez vos déclarations de sinistres</p>
        </div>
        <Dialog open={newClaimOpen} onOpenChange={setNewClaimOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Nouveau sinistre
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Déclarer un sinistre</DialogTitle>
              <DialogDescription className="text-slate-400">Remplissez les informations du sinistre</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-slate-300">Type de sinistre</Label>
                <Select value={claimForm.type} onValueChange={(v) => setClaimForm({ ...claimForm, type: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="collision">Collision</SelectItem>
                    <SelectItem value="theft">Vol</SelectItem>
                    <SelectItem value="vandalism">Vandalisme</SelectItem>
                    <SelectItem value="weather">Intempérie</SelectItem>
                    <SelectItem value="fire">Incendie</SelectItem>
                    <SelectItem value="flood">Inondation</SelectItem>
                    <SelectItem value="liability">Responsabilité civile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={claimForm.description}
                  onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                  placeholder="Décrivez les circonstances du sinistre..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Date</Label>
                  <Input
                    type="date"
                    value={claimForm.date}
                    onChange={(e) => setClaimForm({ ...claimForm, date: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Lieu</Label>
                  <Input
                    value={claimForm.location}
                    onChange={(e) => setClaimForm({ ...claimForm, location: e.target.value })}
                    placeholder="Adresse ou ville"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Photos</Label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Cliquez ou glissez les photos</p>
                  <p className="text-slate-500 text-xs mt-1">JPG, PNG — Max 10 Mo</p>
                </div>
              </div>
              <Button onClick={onFileClaim} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="w-4 h-4 mr-2" />Soumettre la déclaration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline / List Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'pipeline' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('pipeline')}
          className={viewMode === 'pipeline' ? 'bg-emerald-600 text-white' : 'border-slate-700 text-slate-300'}
        >
          Pipeline
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-emerald-600 text-white' : 'border-slate-700 text-slate-300'}
        >
          Liste
        </Button>
      </div>

      {viewMode === 'pipeline' ? (
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipeline.map((step) => (
                <div
                  key={step.key}
                  className={`rounded-xl border-l-4 p-3 ${step.color}`}
                >
                  <p className="text-2xl font-bold text-white">{step.count}</p>
                  <p className="text-slate-400 text-xs mt-1">{step.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Statut</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Coût estimé</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((c) => (
                  <TableRow key={c.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white text-sm">{getClaimTypeLabel(c.type)}</TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell className="text-slate-300 text-sm hidden sm:table-cell">
                      {c.incidentDate ? new Date(c.incidentDate).toLocaleDateString('fr-FR') : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm hidden md:table-cell">
                      {c.estimatedCost ? `${c.estimatedCost.toLocaleString('fr-FR')} €` : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectClaim(c)}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Selected Claim Detail */}
      {selectedClaim && (
        <ClaimDetailDialog claim={selectedClaim} policies={policies} onClose={() => onSelectClaim(null)} />
      )}
    </motion.div>
  )
}

// ─── Claim Detail Dialog ─────────────────────────────────────
function ClaimDetailDialog({ claim, policies, onClose }: { claim: Claim; policies: Policy[]; onClose: () => void }) {
  const policy = policies.find(p => p.id === claim.policyId)
  let damage: Record<string, unknown> | null = null
  try { damage = claim.damageAssessment ? JSON.parse(claim.damageAssessment) : null } catch { /* */ }

  const timeline = [
    { label: 'Sinistre déclaré', date: claim.incidentDate, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Prise en charge', date: claim.createdAt, icon: <Clock className="w-4 h-4" />, color: 'text-blue-400' },
    { label: 'Évaluation en cours', date: claim.status !== 'submitted' ? claim.createdAt : null, icon: <Search className="w-4 h-4" />, color: 'text-amber-400' },
    { label: 'Décision', date: ['approved', 'denied', 'paid', 'closed'].includes(claim.status) ? claim.createdAt : null, icon: ['approved', 'paid'].includes(claim.status) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />, color: ['approved', 'paid'].includes(claim.status) ? 'text-emerald-400' : 'text-red-400' },
  ]

  return (
    <Dialog open={!!claim} onOpenChange={() => onClose()}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            Détail du sinistre
            {getStatusBadge(claim.status)}
          </DialogTitle>
          <DialogDescription className="text-slate-400">Référence : {claim.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-slate-500 text-xs">Type</p>
              <p className="text-white text-sm font-medium">{getClaimTypeLabel(claim.type)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs">Police</p>
              <p className="text-white text-sm font-medium">{policy?.policyNumber || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs">Date du sinistre</p>
              <p className="text-white text-sm font-medium">{claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString('fr-FR') : '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs">Lieu</p>
              <p className="text-white text-sm font-medium">{claim.location || '-'}</p>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          <div>
            <p className="text-slate-500 text-xs mb-1">Description</p>
            <p className="text-slate-300 text-sm">{claim.description}</p>
          </div>

          {damage && (
            <>
              <Separator className="bg-slate-800" />
              <div>
                <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  Évaluation des dommages (IA)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Sévérité</p>
                    <p className={`text-sm font-medium capitalize ${(damage?.severity as string) === 'léger' ? 'text-emerald-400' : (damage?.severity as string) === 'modéré' ? 'text-amber-400' : 'text-red-400'}`}>{String(damage?.severity ?? '-')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Délai de réparation</p>
                    <p className="text-white text-sm font-medium">{String(damage?.repairTime ?? '-')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                    <p className="text-slate-500 text-xs mb-1">Zones endommagées</p>
                    <div className="flex flex-wrap gap-1">
                      {(damage?.zones as string[] | undefined)?.map((z: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-slate-600 text-slate-300 text-xs">{z}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                    <p className="text-slate-500 text-xs mb-1">Pièces nécessaires</p>
                    <div className="flex flex-wrap gap-1">
                      {(damage?.parts as string[] | undefined)?.map((p: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-slate-500 text-xs">Coût estimé</p>
              <p className="text-white font-bold">{claim.estimatedCost ? `${claim.estimatedCost.toLocaleString('fr-FR')} €` : 'En attente'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-slate-500 text-xs">Montant approuvé</p>
              <p className="text-emerald-400 font-bold">{claim.approvedAmount != null ? `${claim.approvedAmount.toLocaleString('fr-FR')} €` : 'En attente'}</p>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Timeline */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Chronologie</h4>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`${step.color} mt-0.5`}>{step.icon}</div>
                  <div>
                    <p className="text-slate-300 text-sm">{step.label}</p>
                    {step.date && <p className="text-slate-500 text-xs">{new Date(step.date).toLocaleDateString('fr-FR')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ═══════════════════════════════════════════════════════════════

// TAB 5: RISK ASSESSMENT
// ═══════════════════════════════════════════════════════════════
function RiskAssessmentTab({ riskData }: { riskData: RiskData | null }) {
  if (!riskData) return null

  const getRiskColor = (v: number) => {
    if (v <= 25) return 'text-emerald-400'
    if (v <= 50) return 'text-amber-400'
    if (v <= 75) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vehicle Risk */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Score risque véhicule</p>
                <p className={`text-3xl font-bold ${getRiskColor(riskData.vehicleRiskScore)}`}>{riskData.vehicleRiskScore}</p>
              </div>
            </div>
            <Progress value={riskData.vehicleRiskScore} className={`h-2 ${getProgressColor(100 - riskData.vehicleRiskScore)}`} />
          </CardContent>
        </Card>

        {/* Driver Risk */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Profil risque conducteur</p>
                <p className="text-2xl font-bold text-white mt-1">{riskData.driverRiskLevel}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {['Faible', 'Moyen', 'Élevé', 'Très élevé'].map((level, i) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full ${
                    riskData.driverRiskLevel === 'Faible' && i === 0 ? 'bg-emerald-500' :
                    riskData.driverRiskLevel === 'Moyen' && i === 1 ? 'bg-amber-500' :
                    riskData.driverRiskLevel === 'Élevé' && i === 2 ? 'bg-orange-500' :
                    riskData.driverRiskLevel === 'Très élevé' && i === 3 ? 'bg-red-500' :
                    'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Recommendation */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Prime recommandée</p>
                <p className="text-3xl font-bold text-white">{riskData.premiumRecommendation} €</p>
                <p className="text-slate-500 text-xs">/an — basé sur votre profil</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm">
              <ArrowRight className="w-4 h-4 mr-1" />Comparer les offres
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Facteurs de risque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {riskData.riskFactors.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{f.name}</span>
                  <span className={`text-sm font-medium ${getRiskColor(f.value)}`}>{f.value}%</span>
                </div>
                <Progress value={f.value} className={`h-1.5 ${getProgressColor(100 - f.value)}`} />
                <p className="text-slate-500 text-xs">{f.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location Risk Map Placeholder */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Carte de risque par zone
            </CardTitle>
            <CardDescription className="text-slate-400">Risque basé sur la localisation géographique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-xl overflow-hidden bg-slate-800 h-72 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <div className="absolute bottom-16 right-12 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Carte interactive des zones à risque</p>
                <p className="text-slate-500 text-xs mt-1">Votre zone : {riskData.locationRisk}% de risque</p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-500 text-xs">Faible</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-slate-500 text-xs">Moyen</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-slate-500 text-xs">Élevé</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════

// TAB 4: FRAUD DETECTION CENTER
// ═══════════════════════════════════════════════════════════════
function FraudDetectionTab({ trustScore }: { trustScore: TrustScoreData }) {
  const [alerts, setAlerts] = useState<FraudAlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ type: 'doublon', description: '', claimId: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/insurance/fraud')
      .then(r => r.json())
      .then(data => {
        setAlerts(data.alertes || [])
        setMessage(data.message || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleCreateAlert = async () => {
    if (!form.description) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/insurance/fraud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: form.type, description: form.description, claimId: form.claimId || null }),
      })
      const data = await res.json()
      if (data.alerte) {
        setAlerts(prev => [data.alerte, ...prev])
        setDialogOpen(false)
        setForm({ type: 'doublon', description: '', claimId: '' })
      }
    } catch { /* error */ }
    setSubmitting(false)
  }

  const fraudRisk = trustScore.fraudRisk
  const getRiskLevel = (r: number) => {
    if (r <= 15) return { label: 'Très faible', color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/30' }
    if (r <= 30) return { label: 'Faible', color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/30' }
    if (r <= 50) return { label: 'Moyen', color: 'text-amber-400', bg: 'bg-amber-600/10', border: 'border-amber-500/30' }
    if (r <= 75) return { label: 'Élevé', color: 'text-orange-400', bg: 'bg-orange-600/10', border: 'border-orange-500/30' }
    return { label: 'Critique', color: 'text-red-400', bg: 'bg-red-600/10', border: 'border-red-500/30' }
  }
  const riskLevel = getRiskLevel(fraudRisk)

  const getSeverityBadge = (status: string) => {
    const map: Record<string, { label: string; variant: string }> = {
      pending: { label: 'En attente', variant: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
      investigating: { label: 'En investigation', variant: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
      confirmed: { label: 'Confirmé', variant: 'bg-red-600/20 text-red-400 border-red-500/30' },
      dismissed: { label: 'Écarté', variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' },
    }
    const s = map[status] || { label: status, variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' }
    return <Badge variant="outline" className={s.variant}>{s.label}</Badge>
  }

  const getProbColor = (p: number) => {
    if (p >= 80) return 'text-red-400'
    if (p >= 60) return 'text-orange-400'
    if (p >= 40) return 'text-amber-400'
    return 'text-emerald-400'
  }
  const getProbBar = (p: number) => {
    if (p >= 80) return '[&>div]:bg-red-500'
    if (p >= 60) return '[&>div]:bg-orange-500'
    if (p >= 40) return '[&>div]:bg-amber-500'
    return '[&>div]:bg-emerald-500'
  }

  const getTypeLabel = (t: string) => {
    const map: Record<string, string> = {
      doublon: 'Doublon', repetition: 'Répétition', montant_anormal: 'Montant anormal', manual: 'Alerte manuelle',
    }
    return map[t] || t
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className={`border ${riskLevel.border} rounded-xl`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${riskLevel.bg} flex items-center justify-center`}>
                <ShieldAlert className={`w-8 h-8 ${riskLevel.color}`} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Niveau de risque de fraude</h3>
                <p className={`text-sm font-medium ${riskLevel.color}`}>{riskLevel.label}</p>
                <p className="text-slate-500 text-xs mt-1">{alerts.length} alerte(s) au total</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`text-4xl font-bold ${riskLevel.color}`}>{fraudRisk}</p>
                <p className="text-slate-500 text-xs">sur 100</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <FilePlus className="w-4 h-4 mr-1.5" />Créer une alerte
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-white">Créer une alerte manuelle</DialogTitle>
                    <DialogDescription className="text-slate-400">Signalez une activité suspecte</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Type</Label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="doublon">Doublon</SelectItem>
                          <SelectItem value="repetition">Répétition</SelectItem>
                          <SelectItem value="montant_anormal">Montant anormal</SelectItem>
                          <SelectItem value="manual">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez lactivité suspecte..." className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]" />
                    </div>
                    <Button onClick={handleCreateAlert} disabled={submitting || !form.description} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Send className="w-4 h-4 mr-2" />{submitting ? 'Création...' : 'Créer lalerte'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            Alertes de fraude ({alerts.length})
          </CardTitle>
          {message && <CardDescription className="text-slate-400">{message}</CardDescription>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 bg-slate-800 rounded-lg" />)}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Aucune alerte de fraude</p>
              <p className="text-slate-500 text-sm mt-1">Aucun pattern suspect détecté</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => {
                let evidence: string | null = null
                try { evidence = alert.evidence || null } catch { /* */ }
                return (
                  <div key={alert.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">{getTypeLabel(alert.type)}</Badge>
                        {getSeverityBadge(alert.status)}
                      </div>
                      <span className="text-slate-500 text-xs">{new Date(alert.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{alert.description}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-xs mb-1">Probabilité</p>
                        <div className="flex items-center gap-2">
                          <Progress value={alert.probability} className={`h-2 flex-1 ${getProbBar(alert.probability)}`} />
                          <span className={`text-sm font-medium ${getProbColor(alert.probability)}`}>{Math.round(alert.probability)}%</span>
                        </div>
                      </div>
                      {evidence && (
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-500 text-xs mb-1">Preuve</p>
                          <p className="text-slate-400 text-xs truncate">{JSON.stringify(evidence).slice(0, 80)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 6: ACCIDENT CENTER
// ═══════════════════════════════════════════════════════════════
function AccidentCenterTab() {
  const [incidents, setIncidents] = useState<AccidentIncidentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ type: 'collision', severity: 'medium', speed: '', deceleration: '' })
  const [lastResult, setLastResult] = useState('')

  const fetchIncidents = useCallback(() => {
    fetch('/api/insurance/accident')
      .then(r => r.json())
      .then(data => { setIncidents(data.incidents || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchIncidents() }, [fetchIncidents])

  const handleReport = async () => {
    setSubmitting(true)
    setLastResult('')
    try {
      const res = await fetch('/api/insurance/accident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          severity: form.severity,
          speed: form.speed ? parseFloat(form.speed) : undefined,
          deceleration: form.deceleration ? parseFloat(form.deceleration) : undefined,
        }),
      })
      const data = await res.json()
      setLastResult(data.message || 'Incident signalé')
      if (res.ok) {
        setDialogOpen(false)
        setForm({ type: 'collision', severity: 'medium', speed: '', deceleration: '' })
        fetchIncidents()
      }
    } catch { setLastResult('Erreur lors du signalement') }
    setSubmitting(false)
  }

  const getSeverityBadge = (s: string) => {
    const map: Record<string, { label: string; variant: string }> = {
      low: { label: 'Mineur', variant: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
      medium: { label: 'Moyen', variant: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
      high: { label: 'Élevé', variant: 'bg-orange-600/20 text-orange-400 border-orange-500/30' },
      critical: { label: 'Critique', variant: 'bg-red-600/20 text-red-400 border-red-500/30' },
    }
    const sv = map[s] || { label: s, variant: 'bg-slate-600/20 text-slate-400 border-slate-500/30' }
    return <Badge variant="outline" className={sv.variant}>{sv.label}</Badge>
  }

  const draftClaims = incidents.filter(i => i.claimId)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-semibold">Centre des Accidents</h2>
          <p className="text-slate-400 text-sm">Détection et signalement d'incidents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <FilePlus className="w-4 h-4 mr-2" />Signaler un accident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Signaler un accident</DialogTitle>
              <DialogDescription className="text-slate-400">Enregistrez un incident</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="collision">Collision</SelectItem>
                      <SelectItem value="single_vehicle">Véhicule seul</SelectItem>
                      <SelectItem value="pedestrian">Piéton</SelectItem>
                      <SelectItem value="animal">Animal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Sévérité</Label>
                  <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low">Mineur</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Vitesse (km/h)</Label>
                  <Input type="number" value={form.speed} onChange={(e) => setForm({ ...form, speed: e.target.value })} placeholder="50" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Décélération (m/s²)</Label>
                  <Input type="number" value={form.deceleration} onChange={(e) => setForm({ ...form, deceleration: e.target.value })} placeholder="8.5" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              {lastResult && <p className="text-sm text-slate-300">{lastResult}</p>}
              <Button onClick={handleReport} disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="w-4 h-4 mr-2" />{submitting ? 'Envoi...' : 'Signaler'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incidents Table */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Siren className="w-5 h-5 text-emerald-400" />
            Incidents détectés
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 bg-slate-800 rounded-lg" />)}</div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Aucun incident enregistré</p>
              <p className="text-slate-500 text-sm mt-1">Les incidents détectés par télématique apparaîtront ici</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Sévérité</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Vitesse</TableHead>
                  <TableHead className="text-slate-400">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow key={inc.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white text-sm">{inc.type}</TableCell>
                    <TableCell>{getSeverityBadge(inc.severity)}</TableCell>
                    <TableCell className="text-slate-300 text-sm hidden sm:table-cell">
                      {new Date(inc.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm hidden md:table-cell">
                      {inc.speed ? `${inc.speed} km/h` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={inc.resolved ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}>
                        {inc.resolved ? 'Résolu' : 'En cours'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Auto-generated claim drafts */}
      {draftClaims.length > 0 && (
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Brouillons de réclamations auto-génés ({draftClaims.length})
            </CardTitle>
            <CardDescription className="text-slate-400">Générés automatiquement pour les incidents élevés/critiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {draftClaims.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div>
                  <p className="text-white text-sm font-medium">Incident {inc.severity === 'critical' ? 'critique' : 'élevé'}</p>
                  <p className="text-slate-500 text-xs">Référence: {inc.claimId?.slice(0, 12)}...</p>
                </div>
                <Badge variant="outline" className="bg-amber-600/20 text-amber-400 border-amber-500/30">Brouillon</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Emergency contacts */}
      <Card className="bg-slate-900 border border-red-500/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            Contacts d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ label: 'Police', number: '17', icon: <Siren className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-600/10' },
              { label: 'Ambulance', number: '15', icon: <Heart className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-600/10' },
              { label: 'Famille', number: '06 XX XX XX XX', icon: <Phone className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
              { label: 'Assureur', number: '01 XX XX XX XX', icon: <Shield className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-600/10' },
            ].map((ec) => (
              <div key={ec.label} className={`p-4 rounded-xl border border-slate-700/50 ${ec.bg} flex flex-col items-center text-center`}>
                <div className={`${ec.color} mb-2`}>{ec.icon}</div>
                <p className="text-white text-sm font-medium">{ec.label}</p>
                <p className={`${ec.color} text-sm font-bold mt-1`}>{ec.number}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 7: TELEMATICS CENTER
// ═══════════════════════════════════════════════════════════════
function TelematicsCenterTab() {
  const [phyd, setPhyd] = useState<PhydData | null>(null)
  const [loading, setLoading] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1)
  const [reportYear, setReportYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState<Record<string, unknown> | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetch('/api/insurance/phyd')
      .then(r => r.json())
      .then(data => { setPhyd(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/insurance/phyd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mois: reportMonth, annee: reportYear }),
      })
      const data = await res.json()
      setReport(data.rapport)
    } catch { /* */ }
    setGenerating(false)
  }

  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const pieData = phyd ? [
    { name: 'Ville', value: phyd.pourcentageVille, color: 'rgb(16,185,129)' },
    { name: 'Autoroute', value: phyd.pourcentageAutoroute, color: 'rgb(59,130,246)' },
    { name: 'Nuit', value: phyd.pourcentageConduiteNuit, color: 'rgb(139,92,246)' },
  ] : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 bg-slate-900 rounded-xl" />)}
        </div>
      ) : !phyd || phyd.nombreTrajets === 0 ? (
        <div className="text-center py-16">
          <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Aucune donnée télématique</h3>
          <p className="text-slate-500 text-sm">Les données de conduite apparaîtront une fois les trajets enregistrés</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Kilométrage total', value: `${phyd.totalKm.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km`, icon: <Route className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
              { label: 'Durée totale', value: phyd.dureeTotaleFormatee || `${Math.floor(phyd.dureeTotale / 3600)}h ${Math.floor((phyd.dureeTotale % 3600) / 60)}min`, icon: <Clock className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-600/10' },
              { label: 'Score conduite', value: `${phyd.scoreConduiteMoyen.toFixed(0)}/100`, icon: <Star className="w-5 h-5" />, color: getScoreColor(phyd.scoreConduiteMoyen), bg: 'bg-emerald-600/10' },
              { label: 'Score éco', value: `${phyd.scoreEcoMoyen.toFixed(0)}/100`, icon: <Zap className="w-5 h-5" />, color: getScoreColor(phyd.scoreEcoMoyen), bg: 'bg-emerald-600/10' },
            ].map((k) => (
              <Card key={k.label} className="bg-slate-900 border border-slate-800 rounded-xl">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${k.bg} flex items-center justify-center mb-3 ${k.color}`}>{k.icon}</div>
                  <p className="text-slate-400 text-xs">{k.label}</p>
                  <p className={`text-xl font-bold ${k.color} mt-1`}>{k.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driving composition pie */}
            <Card className="bg-slate-900 border border-slate-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Répartition conduite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}>
                        {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly breakdown chart */}
            <Card className="bg-slate-900 border border-slate-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Kilométrage mensuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {phyd.ventilationMensuelle.length > 0 ? (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={phyd.ventilationMensuelle.map(m => ({ mois: m.mois.slice(5), km: m.kilometrageTotal }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgb(51,65,85)" />
                        <XAxis dataKey="mois" stroke="rgb(100,116,139)" fontSize={12} />
                        <YAxis stroke="rgb(100,116,139)" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }} labelStyle={{ color: 'rgb(148,163,184)' }} />
                        <Bar dataKey="km" fill="rgb(16,185,129)" radius={[4, 4, 0, 0]} name="km" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center"><p className="text-slate-500 text-sm">Aucune donnée mensuelle</p></div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly driving detail table */}
          {phyd.ventilationMensuelle.length > 0 && (
            <Card className="bg-slate-900 border border-slate-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Détail mensuel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Mois</TableHead>
                        <TableHead className="text-slate-400">Trajets</TableHead>
                        <TableHead className="text-slate-400 hidden sm:table-cell">KM</TableHead>
                        <TableHead className="text-slate-400 hidden md:table-cell">Score</TableHead>
                        <TableHead className="text-slate-400 hidden lg:table-cell">Freinages</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phyd.ventilationMensuelle.map((m) => (
                        <TableRow key={m.mois} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-white text-sm">{m.mois}</TableCell>
                          <TableCell className="text-slate-300 text-sm">{m.nombreTrajets}</TableCell>
                          <TableCell className="text-slate-300 text-sm hidden sm:table-cell">{m.kilometrageTotal.toFixed(0)} km</TableCell>
                          <TableCell className="text-slate-300 text-sm hidden md:table-cell"><Badge variant="outline" className={m.scoreConduiteMoyen >= 75 ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}>{m.scoreConduiteMoyen.toFixed(0)}</Badge></TableCell>
                          <TableCell className="text-slate-300 text-sm hidden lg:table-cell">{m.freinagesBrusques}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Report */}
          <Card className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Rapport mensuel PHYD
              </CardTitle>
              <CardDescription className="text-slate-400">Générez un rapport détaillé de conduite pour un mois donné</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Mois</Label>
                  <Select value={String(reportMonth)} onValueChange={(v) => setReportMonth(parseInt(v))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Année</Label>
                  <Input type="number" value={reportYear} onChange={(e) => setReportYear(parseInt(e.target.value) || new Date().getFullYear())} className="bg-slate-800 border-slate-700 text-white w-28" />
                </div>
                <Button onClick={handleGenerateReport} disabled={generating} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />{generating ? 'Génération...' : 'Générer' }
                </Button>
              </div>
              {report && (
                <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="text-white text-sm font-medium mb-2">Rapport {String((report as Record<string, unknown>).periode)}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries((report as Record<string, Record<string, unknown>>).resume || {}).map(([k, v]) => (
                      <div key={k} className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 text-xs capitalize">{k}</p>
                        <p className="text-white text-sm font-medium">{typeof v === 'number' ? v.toLocaleString('fr-FR') : String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 8: PREMIUM ENGINE
// ═══════════════════════════════════════════════════════════════
function PremiumEngineTab() {
  const [premiums, setPremiums] = useState<PremiumResult[]>([])
  const [loading, setLoading] = useState(true)
  const [formula, setFormula] = useState('')
  const [recalculating, setRecalculating] = useState<string | null>(null)

  const fetchPremiums = useCallback(() => {
    fetch('/api/insurance/premium')
      .then(r => r.json())
      .then(data => {
        setPremiums(data.primes || [])
        setFormula(data.formule || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPremiums() }, [fetchPremiums])

  const handleRecalculate = async (policyId: string) => {
    setRecalculating(policyId)
    try {
      await fetch('/api/insurance/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyId }),
      })
      fetchPremiums()
    } catch { /* */ }
    setRecalculating(null)
  }

  const getTypeLabel = (t: string) => {
    const map: Record<string, string> = { third_party: 'Tiers', comprehensive: 'Tous risques', collision: 'Collision', theft: 'Vol', gap: 'DAP' }
    return map[t] || t
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-semibold">Tarification Dynamique</h2>
          <p className="text-slate-400 text-sm">Moteur de calcul de primes basé sur le comportement</p>
        </div>
        {formula && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-md">
            <p className="text-slate-500 text-xs mb-1">Formule</p>
            <p className="text-slate-300 text-xs font-mono">{formula}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-72 bg-slate-900 rounded-xl" />)}</div>
      ) : premiums.length === 0 ? (
        <div className="text-center py-16">
          <Calculator className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Aucune police trouvée</h3>
          <p className="text-slate-500 text-sm">Créez une police d'assurance pour voir le calcul de prime</p>
        </div>
      ) : (
        <div className="space-y-6">
          {premiums.map((p) => (
            <Card key={p.policyId} className="bg-slate-900 border border-slate-800 rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      {p.policyNumber}
                    </CardTitle>
                    <p className="text-slate-500 text-xs mt-1">{getTypeLabel(p.type)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    disabled={recalculating === p.policyId}
                    onClick={() => handleRecalculate(p.policyId)}
                  >
                    <RefreshCw className={`w-4 h-4 mr-1.5 ${recalculating === p.policyId ? 'animate-spin' : ''}`} />
                    {recalculating === p.policyId ? 'Calcul...' : 'Recalculer'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Prime de base</p>
                    <p className="text-white font-bold">{p.basePremium.toFixed(0)} €</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Ajustement confiance</p>
                    <p className="text-slate-300 font-medium">{((1 - p.trustAdjustment) * 100).toFixed(1)}%</p>
                    <p className="text-slate-500 text-xs">Score: {p.trustScore}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Pénalité comportement</p>
                    <p className={p.behaviorPenalty > 0.1 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      +{(p.behaviorPenalty * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Facteur risque</p>
                    <p className={p.riskFactor > 0.3 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      +{(p.riskFactor * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-slate-500 text-xs">Prime calculée</p>
                    <p className="text-emerald-400 text-xl font-bold">{p.calculatedPremium.toFixed(0)} €</p>
                    {p.currentPremium && p.currentPremium !== p.calculatedPremium && (
                      <p className="text-slate-500 text-xs">Actuelle: {p.currentPremium.toFixed(0)} €</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TAB 9: PARTNERS
// ═══════════════════════════════════════════════════════════════
function PartnersTab() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', country: 'FR', contactEmail: '', contactPhone: '', commissionRate: '0' })

  const fetchPartners = useCallback(() => {
    fetch('/api/insurance/partners')
      .then(r => r.json())
      .then(data => { setPartners(data.partenaires || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPartners() }, [fetchPartners])

  const handleAdd = async () => {
    if (!form.name || !form.code) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/insurance/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, code: form.code, country: form.country,
          contactEmail: form.contactEmail || undefined, contactPhone: form.contactPhone || undefined,
          commissionRate: parseFloat(form.commissionRate) || 0,
        }),
      })
      if (res.ok) {
        setDialogOpen(false)
        setForm({ name: '', code: '', country: 'FR', contactEmail: '', contactPhone: '', commissionRate: '0' })
        fetchPartners()
      }
    } catch { /* */ }
    setSubmitting(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-semibold">Partenaires Assureurs</h2>
          <p className="text-slate-400 text-sm">Gérez vos partenariats d'assurance</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Ajouter un partenaire</DialogTitle>
              <DialogDescription className="text-slate-400">Enregistrez un nouvel assureur partenaire</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nom</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AXA France" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Code</Label>
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="AXA-FR" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Pays</Label>
                  <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })} placeholder="FR" className="bg-slate-800 border-slate-700 text-white" maxLength={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Commission (%)</Label>
                  <Input type="number" step="0.1" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email de contact</Label>
                <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="contact@assureur.fr" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Téléphone</Label>
                <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="01 XX XX XX XX" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button onClick={handleAdd} disabled={submitting || !form.name || !form.code} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="w-4 h-4 mr-2" />{submitting ? 'Ajout...' : 'Ajouter le partenaire'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-900 border border-slate-800 rounded-xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 bg-slate-800 rounded-lg" />)}</div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Aucun partenaire</p>
              <p className="text-slate-500 text-sm mt-1">Ajoutez votre premier assureur partenaire</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Nom</TableHead>
                  <TableHead className="text-slate-400">Code</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Pays</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Commission</TableHead>
                  <TableHead className="text-slate-400">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((p) => (
                  <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white text-sm font-medium">{p.name}</TableCell>
                    <TableCell className="text-slate-300 text-sm font-mono">{p.code}</TableCell>
                    <TableCell className="text-slate-300 text-sm hidden sm:table-cell">{p.country}</TableCell>
                    <TableCell className="text-slate-300 text-sm hidden md:table-cell">{p.commissionRate}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={p.status === 'active' ? 'border-emerald-500/30 text-emerald-400' : 'border-slate-500/30 text-slate-400'}>
                        {p.status === 'active' ? 'Actif' : p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
