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
  TrendingDown,
  Share2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Camera,
  Send,
  ChevronRight,
  Bell,
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

// ─── Mock Data ───────────────────────────────────────────────
const scoreHistory = [
  { mois: 'Jan', score: 62 },
  { mois: 'Fév', score: 65 },
  { mois: 'Mar', score: 64 },
  { mois: 'Avr', score: 70 },
  { mois: 'Mai', score: 73 },
  { mois: 'Jun', score: 76 },
  { mois: 'Jul', score: 78 },
  { mois: 'Aoû', score: 82 },
]

const mockPolicies: Policy[] = [
  {
    id: 'pol-1',
    policyNumber: 'ADS-2024-001478',
    type: 'Tous risques',
    provider: 'ADSO Assurances',
    vehicleType: 'Renault Clio V',
    premium: 890,
    deductible: 150,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    paydEnabled: true,
    phydEnabled: true,
  },
  {
    id: 'pol-2',
    policyNumber: 'ADS-2024-001902',
    type: 'Responsabilité civile',
    provider: 'ADSO Assurances',
    vehicleType: 'Peugeot 208',
    premium: 420,
    deductible: 0,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    paydEnabled: false,
    phydEnabled: false,
  },
  {
    id: 'pol-3',
    policyNumber: 'ADS-2024-002356',
    type: 'Collision',
    provider: 'Mutuelle Mobilité',
    vehicleType: 'Citroën C3',
    premium: 650,
    deductible: 200,
    status: 'pending',
    startDate: '2024-09-01',
    endDate: '2025-09-01',
    paydEnabled: true,
    phydEnabled: false,
  },
]

const mockClaims: Claim[] = [
  {
    id: 'clm-1',
    policyId: 'pol-1',
    type: 'collision',
    status: 'approved',
    description: 'Accrochage à un carrefour lors d\'un tour à droite. Autre véhicule endommagé au niveau du pare-chocs avant.',
    damageAssessment: JSON.stringify({
      severity: 'modéré',
      zones: ['pare-chocs avant', 'phaire gauche'],
      repairTime: '3 jours',
      parts: ['pare-chocs', 'phaire', 'support phare'],
    }),
    estimatedCost: 1850,
    approvedAmount: 1650,
    location: 'Paris 11ème, Bd Voltaire',
    incidentDate: '2024-06-15T14:30:00',
    createdAt: '2024-06-15T15:00:00',
  },
  {
    id: 'clm-2',
    policyId: 'pol-1',
    type: 'vandalisme',
    status: 'reviewing',
    description: 'Rayures profondes sur le côté gauche du véhicule, probablement causées par une clé.',
    damageAssessment: JSON.stringify({
      severity: 'léger',
      zones: ['porte conducteur', 'aile arrière gauche'],
      repairTime: '2 jours',
      parts: ['repeinture porte', 'repeinture aile'],
    }),
    estimatedCost: 620,
    approvedAmount: null,
    location: 'Lyon 3ème, Rue de la Part-Dieu',
    incidentDate: '2024-08-02T08:00:00',
    createdAt: '2024-08-02T09:30:00',
  },
  {
    id: 'clm-3',
    policyId: 'pol-1',
    type: 'intempérie',
    status: 'paid',
    description: 'Dégâts causés par la grêle sur le toit et le capot du véhicule.',
    damageAssessment: JSON.stringify({
      severity: 'modéré',
      zones: ['toit', 'capot'],
      repairTime: '4 jours',
      parts: ['débosselage toit', 'débosselage capot', 'peinture'],
    }),
    estimatedCost: 2100,
    approvedAmount: 1890,
    location: 'Marseille, Vieux Port',
    incidentDate: '2024-05-20T16:00:00',
    createdAt: '2024-05-20T17:00:00',
  },
  {
    id: 'clm-4',
    policyId: 'pol-2',
    type: 'vol',
    status: 'submitted',
    description: 'Tentative de vol du véhicule. Vitre brisée et colonne de direction endommagée.',
    damageAssessment: null,
    estimatedCost: null,
    approvedAmount: null,
    location: 'Toulouse, Place du Capitole',
    incidentDate: '2024-08-10T22:00:00',
    createdAt: '2024-08-11T08:00:00',
  },
  {
    id: 'clm-5',
    policyId: 'pol-1',
    type: 'collision',
    status: 'denied',
    description: 'Collision avec un poteau en marchant arrière dans un parking.',
    damageAssessment: JSON.stringify({
      severity: 'léger',
      zones: ['pare-chocs arrière'],
      repairTime: '1 jour',
      parts: ['pare-chocs arrière'],
    }),
    estimatedCost: 450,
    approvedAmount: 0,
    location: 'Bordeaux, Parking Sainte-Catherine',
    incidentDate: '2024-04-05T10:00:00',
    createdAt: '2024-04-05T11:00:00',
  },
]

const mockRiskData: RiskData = {
  vehicleRiskScore: 35,
  driverRiskLevel: 'Faible',
  locationRisk: 42,
  riskFactors: [
    { name: 'Âge du conducteur', value: 15, description: 'Conducteur expérimenté (30-45 ans)' },
    { name: 'Historique accidents', value: 25, description: '2 sinistres en 3 ans' },
    { name: 'Kilométrage annuel', value: 40, description: 'Environ 12 000 km/an' },
    { name: 'Zone géographique', value: 42, description: 'Zone urbaine moyenne' },
    { name: 'Type de véhicule', value: 20, description: 'Berline compacte, catégorie standard' },
    { name: 'Score de conduite', value: 18, description: 'Excellent comportement de conduite' },
    { name: 'Fréquence d\'utilisation', value: 30, description: 'Usage quotidien modéré' },
    { name: 'Stationnement', value: 50, description: 'Stationnement principalement en rue' },
  ],
  premiumRecommendation: 780,
}

const telematicsWeekly = [
  { jour: 'Lun', score: 78, km: 32 },
  { jour: 'Mar', score: 82, km: 28 },
  { jour: 'Mer', score: 75, km: 45 },
  { jour: 'Jeu', score: 88, km: 22 },
  { jour: 'Ven', score: 71, km: 51 },
  { jour: 'Sam', score: 65, km: 68 },
  { jour: 'Dim', score: 60, km: 15 },
]

const radarData = [
  { subject: 'Freinage', A: 85, fullMark: 100 },
  { subject: 'Accélération', A: 78, fullMark: 100 },
  { subject: 'Vitesse', A: 90, fullMark: 100 },
  { subject: 'Virages', A: 72, fullMark: 100 },
  { subject: 'Distance', A: 88, fullMark: 100 },
  { subject: 'Anticipation', A: 80, fullMark: 100 },
]

const tripScores = [
  { id: 1, date: '08/08/2024', depart: 'Domicile', arrivee: 'Bureau', distance: '12 km', duree: '25 min', score: 85 },
  { id: 2, date: '08/08/2024', depart: 'Bureau', arrivee: 'Domicile', distance: '14 km', duree: '32 min', score: 72 },
  { id: 3, date: '07/08/2024', depart: 'Domicile', arrivee: 'Centre commercial', distance: '8 km', duree: '18 min', score: 91 },
  { id: 4, date: '07/08/2024', depart: 'Centre commercial', arrivee: 'Domicile', distance: '9 km', duree: '20 min', score: 88 },
  { id: 5, date: '06/08/2024', depart: 'Domicile', arrivee: 'Gare', distance: '18 km', duree: '35 min', score: 65 },
]

const safeDriverRewards = [
  { mois: 'Février', prime: '-45 €', niveau: 'Bronze' },
  { mois: 'Mars', prime: '-62 €', niveau: 'Bronze' },
  { mois: 'Avril', prime: '-78 €', niveau: 'Argent' },
  { mois: 'Mai', prime: '-85 €', niveau: 'Argent' },
  { mois: 'Juin', prime: '-95 €', niveau: 'Or' },
  { mois: 'Juillet', prime: '-110 €', niveau: 'Or' },
  { mois: 'Août', prime: '-118 €', niveau: 'Or' },
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function InsuranceModule() {
  const [loading, setLoading] = useState(true)
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [riskData, setRiskData] = useState<RiskData | null>(null)
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
      const [tsRes, polRes, clRes, riskRes] = await Promise.all([
        fetch('/api/insurance/trust-score').then(r => r.json()),
        fetch('/api/insurance/policies').then(r => r.json()),
        fetch('/api/insurance/claims').then(r => r.json()),
        fetch('/api/insurance/risk').then(r => r.json()),
      ])
      if (tsRes.trustScore) setTrustScore(tsRes.trustScore)
      else setTrustScore({
        id: 'ts-mock', overallScore: 78, drivingQuality: 82, mechanicalHealth: 71,
        maintenanceQuality: 68, learningProgress: 85, examPerformance: 76,
        telematicsScore: 80, accidentHistory: 55, fraudRisk: 8, compliance: 90,
        lastCalculated: new Date().toISOString(),
      })
      if (polRes.policies?.length) setPolicies(polRes.policies)
      else setPolicies(mockPolicies)
      if (clRes.claims?.length) setClaims(clRes.claims)
      else setClaims(mockClaims)
      if (riskData) setRiskData(riskData)
      else setRiskData(mockRiskData)
    } catch {
      setTrustScore({
        id: 'ts-mock', overallScore: 78, drivingQuality: 82, mechanicalHealth: 71,
        maintenanceQuality: 68, learningProgress: 85, examPerformance: 76,
        telematicsScore: 80, accidentHistory: 55, fraudRisk: 8, compliance: 90,
        lastCalculated: new Date().toISOString(),
      })
      setPolicies(mockPolicies)
      setClaims(mockClaims)
      setRiskData(mockRiskData)
    }
    setLoading(false)
  }, [riskData])

  useEffect(() => { fetchData() }, []) // eslint-disable-line react-hooks/set-state-in-effect

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
              <p className="text-slate-400 text-sm">Plateforme d'intelligence assurance ADSO v4.1</p>
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
          </TabsList>

          {/* ═══════ TAB 1: TRUST SCORE ═══════ */}
          <TabsContent value="trust">
            <TrustScoreTab trustScore={trustScore} scoreHistory={scoreHistory} onShare={handleShareScore} />
          </TabsContent>

          {/* ═══════ TAB 2: INSURANCE DASHBOARD ═══════ */}
          <TabsContent value="dashboard">
            <InsuranceDashboardTab policies={policies} claims={claims} />
          </TabsContent>

          {/* ═══════ TAB 3: CLAIMS CENTER ═══════ */}
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

          {/* ═══════ TAB 4: FRAUD DETECTION ═══════ */}
          <TabsContent value="fraud">
            <FraudDetectionTab trustScore={trustScore} />
          </TabsContent>

          {/* ═══════ TAB 5: RISK ASSESSMENT ═══════ */}
          <TabsContent value="risk">
            <RiskAssessmentTab riskData={riskData} />
          </TabsContent>

          {/* ═══════ TAB 6: ACCIDENT CENTER ═══════ */}
          <TabsContent value="accident">
            <AccidentCenterTab />
          </TabsContent>

          {/* ═══════ TAB 7: TELEMATICS CENTER ═══════ */}
          <TabsContent value="telematics">
            <TelematicsCenterTab />
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
function InsuranceDashboardTab({ policies, claims }: { policies: Policy[]; claims: Claim[] }) {
  const activePolicies = policies.filter(p => p.status === 'active')
  const pendingClaims = claims.filter(c => ['submitted', 'reviewing'].includes(c.status))
  const totalPremium = activePolicies.reduce((s, p) => s + (p.premium || 0), 0)
  const avgRisk = 35

  const summary = [
    { label: 'Polices actives', value: activePolicies.length, icon: <FileCheck className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
    { label: 'Sinistres en cours', value: pendingClaims.length, icon: <Clock className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-600/10' },
    { label: 'Prime totale/an', value: `${totalPremium.toLocaleString('fr-FR')} €`, icon: <CircleDollarSign className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-600/10' },
    { label: 'Niveau de risque', value: avgRisk <= 30 ? 'Faible' : avgRisk <= 60 ? 'Moyen' : 'Élevé', icon: <Target className="w-5 h-5" />, color: avgRisk <= 30 ? 'text-emerald-400' : avgRisk <= 60 ? 'text-amber-400' : 'text-red-400', bg: avgRisk <= 30 ? 'bg-emerald-600/10' : avgRisk <= 60 ? 'bg-amber-600/10' : 'bg-red-600/10' },
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
  let damage = null
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
                    <p className={`text-sm font-medium capitalize ${damage.severity === 'léger' ? 'text-emerald-400' : damage.severity === 'modéré' ? 'text-amber-400' : 'text-red-400'}`}>{damage.severity}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-slate-500 text-xs">Délai de réparation</p>
                    <p className="text-white text-sm font-medium">{damage.repairTime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                    <p className="text-slate-500 text-xs mb-1">Zones endommagées</p>
                    <div className="flex flex-wrap gap-1">
                      {damage.zones?.map((z: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-slate-600 text-slate-300 text-xs">{z}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                    <p className="text-slate-500 text-xs mb-1">Pièces nécessaires</p>
                    <div className="flex flex-wrap gap-1">
                      {damage.parts?.map((p: string, i: number) => (
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
// TAB 4: FRAUD DETECTION CENTER
// ═══════════════════════════════════════════════════════════════
function FraudDetectionTab({ trustScore }: { trustScore: TrustScoreData }) {
  const fraudRisk = trustScore.fraudRisk

  const indicators = [
    { name: 'Cohérence des déclarations', status: 'ok', detail: 'Aucune incohérence détectée' },
    { name: 'Fréquence des sinistres', status: 'warning', detail: 'Légèrement au-dessus de la moyenne' },
    { name: 'Patterns de conduite', status: 'ok', detail: 'Comportement normal' },
    { name: 'Historique de localisation', status: 'ok', detail: 'Déplacements cohérents' },
    { name: 'Données télématiques', status: 'ok', detail: 'Aucune anomalie détectée' },
    { name: 'Vérification documentaire', status: 'ok', detail: 'Tous les documents validés' },
  ]

  const suspiciousActivities = [
    { date: '15/06/2024', description: 'Déclaration tardive du sinistre CLM-001 (4h après)', level: 'low' },
    { date: '02/08/2024', description: 'Deuxième sinistre vandalisme en 3 mois — surveillance active', level: 'medium' },
  ]

  const anomalies = [
    { metric: 'Vitesse au moment de l\'impact', expected: '20-40 km/h', detected: '45 km/h', verdict: 'normal' },
    { metric: 'Heure du sinistre', expected: 'Période de trafic', detected: '14h30', verdict: 'normal' },
    { metric: 'Distance entre sinistres', expected: '> 50 km', detected: '12 km', verdict: 'attention' },
  ]

  const getRiskLevel = (r: number) => {
    if (r <= 15) return { label: 'Très faible', color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/30' }
    if (r <= 30) return { label: 'Faible', color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/30' }
    if (r <= 50) return { label: 'Moyen', color: 'text-amber-400', bg: 'bg-amber-600/10', border: 'border-amber-500/30' }
    if (r <= 75) return { label: 'Élevé', color: 'text-orange-400', bg: 'bg-orange-600/10', border: 'border-orange-500/30' }
    return { label: 'Critique', color: 'text-red-400', bg: 'bg-red-600/10', border: 'border-red-500/30' }
  }

  const riskLevel = getRiskLevel(fraudRisk)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Risk Assessment Header */}
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
              </div>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${riskLevel.color}`}>{fraudRisk}</p>
              <p className="text-slate-500 text-xs">sur 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Indicators */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Indicateurs de fraude
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {indicators.map((ind) => (
              <div key={ind.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3">
                  {ind.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{ind.name}</p>
                    <p className="text-slate-500 text-xs">{ind.detail}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={ind.status === 'ok'
                    ? 'border-emerald-500/30 text-emerald-400'
                    : 'border-amber-500/30 text-amber-400'
                  }
                >
                  {ind.status === 'ok' ? 'OK' : 'Attention'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suspicious Activities & Anomalies */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Activités suspectes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suspiciousActivities.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Aucune activité suspecte détectée</p>
              ) : (
                suspiciousActivities.map((a, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${a.level === 'high' ? 'border-red-500 bg-red-500/5' : 'border-amber-500 bg-amber-500/5'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{a.description}</p>
                    </div>
                    <p className="text-slate-500 text-xs">{a.date}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                Détection d'anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-white text-sm font-medium">{a.metric}</p>
                      <p className="text-slate-500 text-xs">Attendu : {a.expected} → Détecté : {a.detected}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={a.verdict === 'normal'
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-amber-500/30 text-amber-400'
                      }
                    >
                      {a.verdict === 'normal' ? 'Normal' : 'Attention'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
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
// TAB 6: ACCIDENT CENTER
// ═══════════════════════════════════════════════════════════════
function AccidentCenterTab() {
  const [autoDetect, setAutoDetect] = useState(false)

  const emergencyContacts = [
    { label: 'Police', number: '17', iconName: 'siren', color: 'text-blue-400', bg: 'bg-blue-600/10' },
    { label: 'Ambulance', number: '15', iconName: 'heart', color: 'text-red-400', bg: 'bg-red-600/10' },
    { label: 'Famille', number: '06 XX XX XX XX', iconName: 'phone', color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
    { label: 'Assureur', number: '01 XX XX XX XX', iconName: 'shield', color: 'text-amber-400', bg: 'bg-amber-600/10' },
  ]

  const getEmergencyIcon = (name: string) => {
    switch (name) {
      case 'siren': return <Siren className="w-5 h-5" />
      case 'heart': return <Heart className="w-5 h-5" />
      case 'phone': return <Phone className="w-5 h-5" />
      case 'shield': return <Shield className="w-5 h-5" />
      default: return <Phone className="w-5 h-5" />
    }
  }

  const damageZones = [
    { zone: 'Avant', severity: 'Aucun', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { zone: 'Arrière', severity: 'Léger', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { zone: 'Côté gauche', severity: 'Aucun', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { zone: 'Côté droit', severity: 'Modéré', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { zone: 'Toit', severity: 'Aucun', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ]

  const repairEstimate = [
    { item: 'Remplacement pare-chocs arrière', cost: 320 },
    { item: 'Réparation aile droite', cost: 450 },
    { item: 'Peinture et finition', cost: 180 },
    { item: 'Main-d\'œuvre (3h)', cost: 210 },
  ]

  const totalEstimate = repairEstimate.reduce((s, r) => s + r.cost, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Accident Detection */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              Détection d'accident IA
            </CardTitle>
            <CardDescription className="text-slate-400">Détection automatique en temps réel via capteurs et télématique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-xl border-2 ${autoDetect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${autoDetect ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span className={`text-sm font-medium ${autoDetect ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {autoDetect ? 'Surveillance active' : 'Désactivé'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={autoDetect ? 'default' : 'outline'}
                  onClick={() => setAutoDetect(!autoDetect)}
                  className={autoDetect ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-slate-700 text-slate-300'}
                >
                  {autoDetect ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <Gauge className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">Accéléromètre</p>
                  <p className="text-emerald-400 text-xs">OK</p>
                </div>
                <div>
                  <Activity className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">Gyroscope</p>
                  <p className="text-emerald-400 text-xs">OK</p>
                </div>
                <div>
                  <MapPin className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">GPS</p>
                  <p className="text-emerald-400 text-xs">OK</p>
                </div>
              </div>
            </div>

            {/* Crash Reconstruction */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <Route className="w-4 h-4 text-emerald-400" />
                Reconstitution de crash
              </h4>
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 h-40 flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Visualisation 3D de la reconstitution</p>
                  <p className="text-slate-500 text-xs mt-1">Disponible après détection d'un accident</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Damage Detection & Repair Cost */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                Détection de dommages IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {damageZones.map((dz) => (
                  <div key={dz.zone} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50">
                    <span className="text-slate-300 text-sm">{dz.zone}</span>
                    <Badge variant="outline" className={dz.color}>{dz.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border border-slate-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                Estimation du coût de réparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {repairEstimate.map((r) => (
                  <div key={r.item} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{r.item}</span>
                    <span className="text-white font-medium">{r.cost} €</span>
                  </div>
                ))}
                <Separator className="bg-slate-800" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-white font-semibold">Total estimé</span>
                  <span className="text-emerald-400 font-bold text-lg">{totalEstimate.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Dispatch */}
      <Card className="bg-slate-900 border border-red-500/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-400" />
            Alerte d'urgence
          </CardTitle>
          <CardDescription className="text-slate-400">Notification automatique des services d'urgence en cas d'accident</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {emergencyContacts.map((ec) => {
              const bg = ec.bg
              const clr = ec.color
              return (
              <div key={ec.label} className={"p-4 rounded-xl border border-slate-700/50 " + bg + " flex flex-col items-center text-center"}>
                <div className={clr + " mb-2"}>{getEmergencyIcon(ec.iconName)}</div>
                <p className="text-white text-sm font-medium">{ec.label}</p>
                <p className={clr + " text-sm font-bold mt-1"}>{ec.number}</p>
                <Button variant="outline" size="sm" className="mt-2 border-slate-600 text-slate-300 hover:bg-slate-800 text-xs w-full">
                  <Phone className="w-3 h-3 mr-1" />Appeler
                </Button>
              </div>
              )
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-slate-300 text-sm">En cas de détection d'accident grave, ADSO notifie automatiquement les secours avec votre position GPS et les données du véhicule.</p>
            </div>
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
  const paydMetrics = {
    kmParcourus: 1847,
    kmPrevu: 2400,
    primeEconomisee: 118,
    joursRestants: 45,
    scoreMoyen: 79,
  }

  const phydMetrics = [
    { name: 'Freinage progressif', score: 85, icon: <Gauge className="w-4 h-4" /> },
    { name: 'Accélération fluide', score: 78, icon: <Zap className="w-4 h-4" /> },
    { name: 'Respect des limitations', score: 92, icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Anticipation virages', score: 72, icon: <Route className="w-4 h-4" /> },
    { name: 'Distance de sécurité', score: 88, icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'Conduite de nuit', score: 65, icon: <Star className="w-4 h-4" /> },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* PAYD & PHYD Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PAYD Metrics */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Route className="w-5 h-5 text-emerald-400" />
              Payez selon votre distance (PAYD)
            </CardTitle>
            <CardDescription className="text-slate-400">Prime proportionnelle au kilométrage parcouru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-500 text-xs">KM parcourus</p>
                <p className="text-white text-xl font-bold">{paydMetrics.kmParcourus.toLocaleString('fr-FR')}</p>
                <p className="text-slate-500 text-xs">sur {paydMetrics.kmPrevu.toLocaleString('fr-FR')} prévus</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-500 text-xs">Économie réalisée</p>
                <p className="text-emerald-400 text-xl font-bold">-{paydMetrics.primeEconomisee} €</p>
                <p className="text-slate-500 text-xs">sur la prime annuelle</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-500 text-xs">Score moyen</p>
                <p className="text-white text-xl font-bold">{paydMetrics.scoreMoyen}/100</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-slate-500 text-xs">Jours restants</p>
                <p className="text-white text-xl font-bold">{paydMetrics.joursRestants}</p>
              </div>
            </div>
            <Progress
              value={(paydMetrics.kmParcourus / paydMetrics.kmPrevu) * 100}
              className="h-3 [&>div]:bg-emerald-500"
            />
            <p className="text-slate-500 text-xs text-center">{Math.round((paydMetrics.kmParcourus / paydMetrics.kmPrevu) * 100)}% du kilométrage prévu</p>
          </CardContent>
        </Card>

        {/* PHYD Metrics */}
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Payez selon votre conduite (PHYD)
            </CardTitle>
            <CardDescription className="text-slate-400">Prime ajustée selon votre comportement de conduite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {phydMetrics.map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{m.icon}</span>
                    <span className="text-slate-300 text-sm">{m.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(m.score)}`}>{m.score}%</span>
                </div>
                <Progress value={m.score} className={`h-2 ${getProgressColor(m.score)}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Driving Behavior Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Analyse comportementale hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={telematicsWeekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(51,65,85)" />
                  <XAxis dataKey="jour" stroke="rgb(100,116,139)" fontSize={12} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }}
                    labelStyle={{ color: 'rgb(148,163,184)' }}
                  />
                  <Bar dataKey="score" fill="rgb(16,185,129)" radius={[4, 4, 0, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Profil de conduite radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(51,65,85)" />
                  <PolarAngleAxis dataKey="subject" stroke="rgb(100,116,139)" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgb(71,85,105)" fontSize={10} />
                  <Radar name="Score" dataKey="A" stroke="rgb(16,185,129)" fill="rgb(16,185,129)" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip-Based Scoring */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Route className="w-5 h-5 text-emerald-400" />
            Scoring par trajet
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Trajet</TableHead>
                <TableHead className="text-slate-400 hidden sm:table-cell">Distance</TableHead>
                <TableHead className="text-slate-400 hidden md:table-cell">Durée</TableHead>
                <TableHead className="text-slate-400">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tripScores.map((t) => (
                <TableRow key={t.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-slate-300 text-sm">{t.date}</TableCell>
                  <TableCell className="text-white text-sm">{t.depart} → {t.arrivee}</TableCell>
                  <TableCell className="text-slate-300 text-sm hidden sm:table-cell">{t.distance}</TableCell>
                  <TableCell className="text-slate-300 text-sm hidden md:table-cell">{t.duree}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={t.score >= 80
                        ? 'border-emerald-500/30 text-emerald-400'
                        : t.score >= 65
                          ? 'border-amber-500/30 text-amber-400'
                          : 'border-red-500/30 text-red-400'
                      }
                    >
                      {t.score}/100
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Safe Driver Rewards */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Récompenses conducteur prudent
          </CardTitle>
          <CardDescription className="text-slate-400">Économies mensuelles basées sur votre conduite sécuritaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeDriverRewards}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(51,65,85)" />
                <XAxis dataKey="mois" stroke="rgb(100,116,139)" fontSize={12} />
                <YAxis stroke="rgb(100,116,139)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(51,65,85)', borderRadius: '8px' }}
                  labelStyle={{ color: 'rgb(148,163,184)' }}
                />
                <Bar dataKey="niveau" fill="rgb(16,185,129)" radius={[4, 4, 0, 0]} name="Niveau" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {safeDriverRewards.slice(-3).map((r) => (
              <div key={r.mois} className="p-3 rounded-lg bg-slate-800/50 text-center">
                <p className="text-slate-500 text-xs">{r.mois}</p>
                <p className="text-emerald-400 font-bold text-sm mt-1">{r.prime}</p>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs mt-1">{r.niveau}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
