'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Gavel,
  ClipboardCheck,
  BarChart3,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Euro,
  TrendingUp,
  MapPin,
  Calendar,
  Filter,
  FileWarning,
  Scale,
  BadgeCheck,
  ExternalLink,
  Wifi,
  WifiOff,
  Activity,
  Eye,
  Search,
  ChevronRight,
  MessageSquare,
  Plus,
  RefreshCw,
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
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Types ───────────────────────────────────────────────────
interface Violation {
  id: string
  violationType: string
  description: string
  severity: string
  points: number
  fineAmount: number | null
  status: string
  location: string | null
  licensePlate: string | null
  incidentDate: string | null
  createdAt: string
}

interface Inspection {
  id: string
  make: string
  model: string
  licensePlate: string
  lastInspection: string | null
  status: string
  fleet: { name: string } | null
}

// ─── Static lookups ───────────────────────────────────────────
const violationTypes: Record<string, string> = {
  speeding: 'Excès de vitesse',
  parking: 'Stationnement irrégulier',
  red_light: 'Feu rouge franchi',
  stop_sign: 'Stop non respecté',
  no_seatbelt: 'Ceinture non attachée',
  phone_use: 'Téléphone au volant',
  drunk_driving: "Conduite en état d'ivresse",
  no_insurance: "Absence d'assurance",
  no_license: 'Conduite sans permis',
  lane_violation: 'Changement de voie irrégulier',
  wrong_way: 'Sens interdit',
  document_violation: "Infraction documentaire",
}

const severityLabels: Record<string, string> = {
  minor: 'Mineur',
  moderate: 'Modéré',
  serious: 'Grave',
  criminal: 'Criminel',
}

const severityColors: Record<string, string> = {
  minor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  moderate: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  serious: 'bg-red-500/20 text-red-400 border-red-500/30',
  criminal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  contested: 'Contesté',
  confirmed: 'Confirmé',
  paid: 'Payé',
  dismissed: 'Rejeté',
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  contested: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  confirmed: 'bg-red-500/20 text-red-400 border-red-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  dismissed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const MOIS_ABREGE = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

// Static data that doesn't come from the API
const nationalApis = [
  { id: 1, name: 'Fichier National des Permis (FNPC)', status: 'connected', lastSync: '2025-07-10 14:30', endpoint: '/api/v1/permis', description: 'Vérification des permis de conduire en temps réel' },
  { id: 2, name: "Système National d'Immatriculation (SNI)", status: 'connected', lastSync: '2025-07-10 14:25', endpoint: '/api/v1/immatriculation', description: 'Consultation du registre national des véhicules' },
  { id: 3, name: 'Centre National de Contrôle Technique', status: 'degraded', lastSync: '2025-07-09 08:00', endpoint: '/api/v1/controle-technique', description: 'Récupération des résultats de contrôle technique' },
  { id: 4, name: 'Fichier Central des Contraventions (FCC)', status: 'connected', lastSync: '2025-07-10 14:32', endpoint: '/api/v1/contraventions', description: 'Synchronisation des infractions et amendes' },
  { id: 5, name: 'Base de Données des Assurances (BDA)', status: 'disconnected', lastSync: '2025-07-05 16:00', endpoint: '/api/v1/assurances', description: 'Vérification de la couverture d\'assurance' },
  { id: 6, name: 'API Méteo France - Routes', status: 'connected', lastSync: '2025-07-10 14:35', endpoint: '/api/v1/meteo/routes', description: 'Conditions météorologiques et alertes routières' },
]

const dataExchangeLogs = [
  { id: 1, time: '14:32:15', api: 'FNPC', direction: 'outgoing', status: 'success', records: 1 },
  { id: 2, time: '14:31:02', api: 'FCC', direction: 'incoming', status: 'success', records: 3 },
  { id: 3, time: '14:30:45', api: 'SNI', direction: 'outgoing', status: 'success', records: 1 },
  { id: 4, time: '14:28:10', api: 'BDA', direction: 'outgoing', status: 'error', records: 0 },
  { id: 5, time: '14:25:33', api: 'CNCT', direction: 'incoming', status: 'success', records: 5 },
  { id: 6, time: '14:20:00', api: 'Météo', direction: 'incoming', status: 'success', records: 12 },
  { id: 7, time: '14:15:22', api: 'FNPC', direction: 'outgoing', status: 'success', records: 2 },
]

const violationChartConfig: ChartConfig = {
  infractions: { label: 'Infractions', color: '#ef4444' },
  amendes: { label: 'Amendes (€)', color: '#f59e0b' },
}

const distChartConfig: ChartConfig = {
  count: { label: 'Nombre', color: '#06b6d4' },
}

const monthlyConfig: ChartConfig = {
  gravite: { label: 'Grave', color: '#ef4444' },
  modere: { label: 'Modéré', color: '#f59e0b' },
  mineur: { label: 'Mineur', color: '#10b981' },
}

// ─── Component ───────────────────────────────────────────────
export default function GovernmentModule() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [contestDialogOpen, setContestDialogOpen] = useState(false)
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [violationDialogOpen, setViolationDialogOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [vRes, iRes] = await Promise.all([
        fetch('/api/government/violations'),
        fetch('/api/government/inspections'),
      ])
      const vData = await vRes.json()
      const iData = await iRes.json()
      if (vData.success) setViolations(vData.data)
      if (iData.success) setInspections(iData.data)
    } catch (e) {
      console.error('Erreur chargement données gouvernement:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ─── Computed data ─────────────────────────────────────────
  const filteredViolations = violations.filter((v) => {
    if (typeFilter !== 'all' && v.violationType !== typeFilter) return false
    if (severityFilter !== 'all' && v.severity !== severityFilter) return false
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    if (searchQuery && !v.description.toLowerCase().includes(searchQuery.toLowerCase()) && !v.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalViolations = violations.length
  const activeInspections = inspections.filter(i => i.status === 'out_of_service').length
  const totalRevenue = violations.filter(v => v.status === 'paid').reduce((s, v) => s + (v.fineAmount ?? 0), 0)
  const complianceRate = inspections.length > 0
    ? Math.round((inspections.filter(i => i.status !== 'out_of_service').length / inspections.length) * 100)
    : 0

  const overdueInspections = inspections.filter(i => {
    if (!i.lastInspection) return false
    const nextDue = new Date(i.lastInspection)
    nextDue.setFullYear(nextDue.getFullYear() + 1)
    return nextDue <= new Date() && i.status === 'out_of_service'
  })

  // Charts computed from real data
  const violationTrendChart = (() => {
    const byMonth: Record<string, { infractions: number; amendes: number }> = {}
    violations.forEach(v => {
      const d = new Date(v.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { infractions: 0, amendes: 0 }
      byMonth[key].infractions += 1
      byMonth[key].amendes += v.fineAmount ?? 0
    })
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([, v], i) => ({
        mois: MOIS_ABREGE[(new Date().getMonth() - 6 + i + 12) % 12],
        infractions: v.infractions,
        amendes: Math.round(v.amendes),
      }))
  })()

  const violationDistChart = (() => {
    const byType: Record<string, number> = {}
    violations.forEach(v => {
      const label = violationTypes[v.violationType] ?? 'Autre'
      byType[label] = (byType[label] ?? 0) + 1
    })
    return Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))
  })()

  const monthlyTrendChart = (() => {
    const byMonth: Record<string, { gravite: number; modere: number; mineur: number }> = {}
    violations.forEach(v => {
      const d = new Date(v.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { gravite: 0, modere: 0, mineur: 0 }
      if (v.severity === 'serious' || v.severity === 'criminal') byMonth[key].gravite += 1
      else if (v.severity === 'moderate') byMonth[key].modere += 1
      else byMonth[key].mineur += 1
    })
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([, v], i) => ({
        mois: MOIS_ABREGE[(new Date().getMonth() - 6 + i + 12) % 12],
        ...v,
      }))
  })()

  const hotspots = (() => {
    const byLoc: Record<string, { location: string; violations: number; types: Set<string> }> = {}
    violations.forEach(v => {
      if (!v.location) return
      if (!byLoc[v.location]) byLoc[v.location] = { location: v.location, violations: 0, types: new Set() }
      byLoc[v.location].violations += 1
      byLoc[v.location].types.add(violationTypes[v.violationType] ?? v.violationType)
    })
    return Object.values(byLoc)
      .sort((a, b) => b.violations - a.violations)
      .slice(0, 5)
      .map((h, i) => ({ id: i + 1, location: h.location, violations: h.violations, type: Array.from(h.types).slice(0, 2).join(' / ') }))
  })()

  // ─── Form handlers ─────────────────────────────────────────
  const handleCreateViolation = async () => {
    const typeEl = document.querySelector('[data-v-type]') as HTMLSelectElement
    const descEl = (document.getElementById('v-desc') as HTMLInputElement)?.value
    const severityEl = document.querySelector('[data-v-severity]') as HTMLSelectElement
    const pointsEl = (document.getElementById('v-points') as HTMLInputElement)?.value
    const fineEl = (document.getElementById('v-fine') as HTMLInputElement)?.value
    const plateEl = (document.getElementById('v-plate') as HTMLInputElement)?.value
    const locEl = (document.getElementById('v-location') as HTMLInputElement)?.value
    if (!typeEl?.value || !descEl) return
    setSubmitting(true)
    try {
      await fetch('/api/government/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'system',
          violationType: typeEl.value,
          description: descEl,
          severity: severityEl?.value ?? 'minor',
          points: pointsEl ? parseInt(pointsEl) : 0,
          fineAmount: fineEl ? parseFloat(fineEl) : null,
          licensePlate: plateEl || null,
          location: locEl || null,
        }),
      })
      setViolationDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur création infraction:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleContest = async () => {
    if (!selectedViolation) return
    try {
      await fetch(`/api/government/violations/${selectedViolation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contested' }),
      })
      setContestDialogOpen(false)
      setDetailDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur contestation:', e)
    }
  }

  // ─── Skeleton helper ───────────────────────────────────────
  const SkeletonCard = () => (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24 mb-2 bg-slate-800" />
        <Skeleton className="h-8 w-16 bg-slate-800" />
      </CardContent>
    </Card>
  )

  return (
    <div className="pt-20 pb-8 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Plateforme Gouvernementale</h1>
              <p className="text-sm text-slate-400">ADSO V4.1 — Conformité et Sécurité Routière</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="violations" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Gavel className="h-4 w-4 mr-2" />Infractions
              </TabsTrigger>
              <TabsTrigger value="inspections" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <ClipboardCheck className="h-4 w-4 mr-2" />Contrôles
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />Analytique
              </TabsTrigger>
              <TabsTrigger value="apis" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />APIs Nationales
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" className="border-slate-700 text-slate-300" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />Actualiser
            </Button>
          </div>

          {/* ═══ TAB 1: Dashboard ═══ */}
          <TabsContent value="dashboard" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Infractions', value: totalViolations, icon: <FileWarning className="h-5 w-5" />, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Contrôles Défavorables', value: activeInspections, icon: <ClipboardCheck className="h-5 w-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Revenus Amendes', value: `${totalRevenue.toLocaleString('fr-FR')} €`, icon: <Euro className="h-5 w-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Taux Conformité', value: `${complianceRate}%`, icon: <BadgeCheck className="h-5 w-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  ].map((card) => (
                    <Card key={card.label} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">{card.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${card.bg}`}>
                            <span className={card.color}>{card.icon}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Violation Trend */}
                  <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Tendance des Infractions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {violationTrendChart.length > 0 ? (
                        <ChartContainer config={violationChartConfig} className="h-[250px] w-full">
                          <LineChart data={violationTrendChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="infractions" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="amendes" stroke="#f59e0b" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ChartContainer>
                      ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée d'infraction</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Violations */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Infractions Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                        {violations.length > 0 ? violations.slice(0, 5).map((v) => (
                          <div key={v.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                            <div className={`mt-0.5 ${v.severity === 'criminal' || v.severity === 'serious' ? 'text-red-400' : 'text-amber-400'}`}>
                              <FileWarning className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-300 truncate">{violationTypes[v.violationType] ?? v.violationType}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500">{v.licensePlate ?? '—'}</span>
                                <Badge variant="outline" className={`text-[10px] px-1 py-0 ${severityColors[v.severity] ?? ''}`}>
                                  {severityLabels[v.severity] ?? v.severity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <p className="text-sm text-slate-500 text-center py-8">Aucune infraction enregistrée</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Map Placeholder */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 rounded-full bg-slate-800 mb-4">
                        <MapPin className="h-10 w-10 text-slate-500" />
                      </div>
                      <h3 className="text-white font-medium mb-1">Carte de Couverture</h3>
                      <p className="text-sm text-slate-500 max-w-md">Carte interactive des zones de contrôle et des points chauds d'infractions. Intégration MapBox en cours.</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ═══ TAB 2: Violations ═══ */}
          <TabsContent value="violations" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-white w-48"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(violationTypes).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-36"><SelectValue placeholder="Sévérité" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {Object.entries(severityLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={violationDialogOpen} onOpenChange={setViolationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />Nouvelle infraction
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Enregistrer une infraction</DialogTitle>
                    <DialogDescription className="text-slate-400">Saisissez les détails de l'infraction</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select>
                          <SelectTrigger data-v-type className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(violationTypes).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Sévérité</Label>
                        <Select>
                          <SelectTrigger data-v-severity className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(severityLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input id="v-desc" placeholder="Description de l'infraction" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input id="v-points" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Amende (€)</Label>
                        <Input id="v-fine" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Immatriculation</Label>
                        <Input id="v-plate" placeholder="AB-123-CD" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Lieu</Label>
                        <Input id="v-location" placeholder="Ex: Avenue des Champs-Élysées" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setViolationDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreateViolation} disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Description</TableHead>
                        <TableHead className="text-slate-400">Sévérité</TableHead>
                        <TableHead className="text-slate-400">Points</TableHead>
                        <TableHead className="text-slate-400">Amende</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                        <TableHead className="text-slate-400">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-24 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-8 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : filteredViolations.length > 0 ? filteredViolations.map((v) => (
                        <TableRow key={v.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedViolation(v); setDetailDialogOpen(true) }}>
                          <TableCell className="text-white text-sm font-medium">{violationTypes[v.violationType] ?? v.violationType}</TableCell>
                          <TableCell className="text-slate-300 text-sm max-w-[200px] truncate">{v.description}</TableCell>
                          <TableCell><Badge variant="outline" className={severityColors[v.severity] ?? ''}>{severityLabels[v.severity] ?? v.severity}</Badge></TableCell>
                          <TableCell className="text-slate-300">{v.points}</TableCell>
                          <TableCell className="text-slate-300">{v.fineAmount ? `${v.fineAmount} €` : '—'}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[v.status] ?? ''}>{statusLabels[v.status] ?? v.status}</Badge></TableCell>
                          <TableCell className="text-slate-400 text-sm">{v.incidentDate ? new Date(v.incidentDate).toLocaleDateString('fr-FR') : '—'}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-500 py-8">Aucune infraction trouvée</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
              <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle>Détails de l'infraction</DialogTitle>
                  <DialogDescription className="text-slate-400">Informations complètes</DialogDescription>
                </DialogHeader>
                {selectedViolation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="text-sm text-white">{violationTypes[selectedViolation.violationType] ?? selectedViolation.violationType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Sévérité</p>
                        <Badge variant="outline" className={severityColors[selectedViolation.severity] ?? ''}>{severityLabels[selectedViolation.severity] ?? selectedViolation.severity}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Points</p>
                        <p className="text-sm text-white">{selectedViolation.points} pts</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Amende</p>
                        <p className="text-sm text-white">{selectedViolation.fineAmount ? `${selectedViolation.fineAmount} €` : '—'}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-xs text-slate-500">Description</p>
                        <p className="text-sm text-slate-300">{selectedViolation.description}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Immatriculation</p>
                        <p className="text-sm text-white font-mono">{selectedViolation.licensePlate ?? '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Lieu</p>
                        <p className="text-sm text-slate-300">{selectedViolation.location ?? '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="text-sm text-slate-300">{selectedViolation.incidentDate ? new Date(selectedViolation.incidentDate).toLocaleDateString('fr-FR') : '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Statut</p>
                        <Badge variant="outline" className={statusColors[selectedViolation.status] ?? ''}>{statusLabels[selectedViolation.status] ?? selectedViolation.status}</Badge>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter className="gap-2">
                  {selectedViolation?.status === 'confirmed' && (
                    <Dialog open={contestDialogOpen} onOpenChange={setContestDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-slate-700 text-slate-300">
                          <MessageSquare className="h-4 w-4 mr-2" />Contester
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Contester l'infraction</DialogTitle>
                          <DialogDescription className="text-slate-400">Décrivez les motifs de votre contestation</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Motif de contestation</Label>
                            <Input placeholder="Ex: Erreur d'identification du véhicule" className="bg-slate-800 border-slate-700" />
                          </div>
                          <div className="space-y-2">
                            <Label>Preuves (description)</Label>
                            <Input placeholder="Description des preuves fournies" className="bg-slate-800 border-slate-700" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setContestDialogOpen(false)}>Annuler</Button>
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleContest}>Soumettre</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setDetailDialogOpen(false)}>Fermer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ═══ TAB 3: Inspections ═══ */}
          <TabsContent value="inspections" className="space-y-6">
            {overdueInspections.length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-400">{overdueInspections.length} contrôle(s) en retard nécessite(nt) une attention immédiate</span>
              </div>
            )}

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">Registre des Contrôles Techniques</CardTitle>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1" />Planifier contrôle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">Véhicule</TableHead>
                        <TableHead className="text-slate-400">Immatriculation</TableHead>
                        <TableHead className="text-slate-400">Date contrôle</TableHead>
                        <TableHead className="text-slate-400">Résultat</TableHead>
                        <TableHead className="text-slate-400">Prochaine échéance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-28 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : inspections.length > 0 ? inspections.map((i) => {
                        const result = i.status === 'out_of_service' ? 'fail' : 'pass'
                        const nextDue = i.lastInspection ? new Date(new Date(i.lastInspection).getTime() + 365 * 24 * 60 * 60 * 1000) : null
                        const isOverdue = nextDue ? nextDue <= new Date() && result === 'fail' : false
                        return (
                          <TableRow key={i.id} className={`border-slate-800 hover:bg-slate-800/50 ${isOverdue ? 'bg-red-500/5' : ''}`}>
                            <TableCell className="text-white text-sm font-medium">{i.make} {i.model}</TableCell>
                            <TableCell className="text-slate-300 font-mono text-sm">{i.licensePlate}</TableCell>
                            <TableCell className="text-slate-300 text-sm">{i.lastInspection ? new Date(i.lastInspection).toLocaleDateString('fr-FR') : '—'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={result === 'pass' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                                {result === 'pass' ? <><CheckCircle2 className="h-3 w-3 mr-1" />Favorable</> : <><XCircle className="h-3 w-3 mr-1" />Défavorable</>}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-300'}`}>
                                {isOverdue && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                                {nextDue ? nextDue.toLocaleDateString('fr-FR') : '—'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      }) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">Aucun contrôle technique enregistré</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 4: Analytics ═══ */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Distribution par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  {violationDistChart.length > 0 ? (
                    <ChartContainer config={distChartConfig} className="h-[280px] w-full">
                      <BarChart data={violationDistChart} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                        <YAxis type="category" dataKey="type" stroke="#94a3b8" fontSize={11} width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Tendances Mensuelles par Sévérité</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyTrendChart.length > 0 ? (
                    <ChartContainer config={monthlyConfig} className="h-[280px] w-full">
                      <BarChart data={monthlyTrendChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="gravite" stackId="a" fill="#ef4444" />
                        <Bar dataKey="modere" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="mineur" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Geographic Distribution / Hotspots */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Points Chauds d'Infractions</CardTitle>
              </CardHeader>
              <CardContent>
                {hotspots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {hotspots.map((h, i) => (
                      <div key={h.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : i < 3 ? 'bg-amber-500' : 'bg-slate-500'}`} />
                          <span className="text-xs text-slate-500">#{i + 1}</span>
                        </div>
                        <p className="text-sm text-white font-medium mb-1">{h.location}</p>
                        <p className="text-xs text-slate-400 mb-2">{h.type}</p>
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                          {h.violations} infractions
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">Aucun point chaud identifié</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 5: National APIs ═══ */}
          <TabsContent value="apis" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Connectées', value: nationalApis.filter(a => a.status === 'connected').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <Wifi className="h-5 w-5" /> },
                { label: 'Dégradées', value: nationalApis.filter(a => a.status === 'degraded').length, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <WifiOff className="h-5 w-5" /> },
                { label: 'Déconnectées', value: nationalApis.filter(a => a.status === 'disconnected').length, color: 'text-red-400', bg: 'bg-red-500/10', icon: <XCircle className="h-5 w-5" /> },
              ].map((card) => (
                <Card key={card.label} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{card.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.bg}`}>
                        <span className={card.color}>{card.icon}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Statut des Connexions API</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">API</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                        <TableHead className="text-slate-400">Dernière sync</TableHead>
                        <TableHead className="text-slate-400">Endpoint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nationalApis.map((api) => (
                        <TableRow key={api.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div>
                              <p className="text-white text-sm font-medium">{api.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{api.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              api.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              api.status === 'degraded' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }>
                              {api.status === 'connected' ? <><Wifi className="h-3 w-3 mr-1" />Connectée</> :
                               api.status === 'degraded' ? <><WifiOff className="h-3 w-3 mr-1" />Dégradée</> :
                               <><XCircle className="h-3 w-3 mr-1" />Hors ligne</>}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">{api.lastSync}</TableCell>
                          <TableCell className="text-cyan-400 text-sm font-mono">{api.endpoint}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Data Exchange Logs */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Journal d'Échange de Données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {dataExchangeLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 text-sm">
                      <span className="text-slate-500 font-mono text-xs w-16">{log.time}</span>
                      <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600 text-xs w-16 justify-center">{log.api}</Badge>
                      <Badge variant="outline" className={log.direction === 'outgoing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs'}>
                        {log.direction === 'outgoing' ? '↗ Sortant' : '↙ Entrant'}
                      </Badge>
                      <Badge variant="outline" className={log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs' : 'bg-red-500/10 text-red-400 border-red-500/30 text-xs'}>
                        {log.status === 'success' ? <><CheckCircle2 className="h-3 w-3 mr-1" />OK</> : <><XCircle className="h-3 w-3 mr-1" />Erreur</>}
                      </Badge>
                      <span className="text-slate-400 text-xs ml-auto">{log.records} enregistrement(s)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
