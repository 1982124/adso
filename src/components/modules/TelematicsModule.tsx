'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Car,
  Gauge,
  Timer,
  Fuel,
  AlertTriangle,
  Navigation,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  Info,
  CircleDot,
  Wrench,
  Route,
  BarChart3,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────
interface Trip {
  id: number
  date: string
  depart: string
  arrivee: string
  distance: number
  duree: string
  vitesseMoy: number
  conso: number
}

interface DrivingStats {
  scoreConduite: number
  freinagesUrgence: number
  accelerationsBrusques: number
  vitesseExcessive: number
  tempsRalenti: number
  weeklyData: { day: string; speed: number; braking: number; acceleration: number }[]
  monthlyFuel: { month: string; litres: number }[]
  carburant: { niveau: number; autonomie: number; consoMoyenne: number; coutMoisEnCours: number }
  resumeMois: { totalKm: number; totalTrajets: number; consoMoyenne: number; vitesseMoyenne: number }
}

interface AlertItem {
  id: number
  type: 'speed' | 'geofence' | 'maintenance' | 'info'
  title: string
  description: string
  timestamp: string
  lu: boolean
}

// ─── Mock Data ───────────────────────────────────────────────
const VEHICLES = [
  { id: 'v1', label: 'Véhicule 1 — Peugeot 308' },
  { id: 'v2', label: 'Véhicule 2 — Renault Clio' },
  { id: 'v3', label: 'Véhicule 3 — Toyota Hilux' },
]

const ALERTS: AlertItem[] = [
  { id: 1, type: 'speed', title: 'Vitesse excessive détectée', description: '92 km/h dans une zone 50 km/h sur la Rue du Fleuve', timestamp: '2026-08-04 14:32', lu: false },
  { id: 2, type: 'geofence', title: 'Sortie de zone géo-barrière', description: 'Le véhicule a quitté la zone « Bureau » à 17h05', timestamp: '2026-08-04 17:05', lu: false },
  { id: 3, type: 'maintenance', title: 'Vidange prévue sous 500 km', description: 'Prochaine vidange estimée dans 480 km', timestamp: '2026-08-03 09:00', lu: true },
  { id: 4, type: 'speed', title: 'Vitesse excessive détectée', description: '78 km/h dans une zone 60 km/h sur l\'Avenue de l\'OUA', timestamp: '2026-08-03 11:18', lu: true },
  { id: 5, type: 'info', title: 'Mise à jour GPS effectuée', description: 'Le module GPS a été mis à jour avec succès', timestamp: '2026-08-02 08:00', lu: true },
  { id: 6, type: 'maintenance', title: 'Pression des pneus basse', description: 'Pneu avant gauche : 1.8 bar (recommandé 2.2 bar)', timestamp: '2026-08-01 16:45', lu: true },
  { id: 7, type: 'geofence', title: 'Entrée dans zone interdite', description: 'Le véhicule est entré dans la zone « Zone interdite » à 12h20', timestamp: '2026-07-31 12:20', lu: true },
  { id: 8, type: 'info', title: 'Itinéraire optimisé', description: 'Un itinéraire plus court de 3.2 km a été détecté', timestamp: '2026-07-30 07:30', lu: true },
]

const MOCK_STATS: DrivingStats = {
  scoreConduite: 85,
  freinagesUrgence: 3,
  accelerationsBrusques: 7,
  vitesseExcessive: 2,
  tempsRalenti: 15,
  weeklyData: [
    { day: 'Lun', speed: 2, braking: 1, acceleration: 3 },
    { day: 'Mar', speed: 0, braking: 2, acceleration: 1 },
    { day: 'Mer', speed: 1, braking: 0, acceleration: 2 },
    { day: 'Jeu', speed: 3, braking: 3, acceleration: 4 },
    { day: 'Ven', speed: 0, braking: 1, acceleration: 1 },
    { day: 'Sam', speed: 1, braking: 2, acceleration: 2 },
    { day: 'Dim', speed: 0, braking: 0, acceleration: 0 },
  ],
  monthlyFuel: [
    { month: 'Mars', litres: 52 },
    { month: 'Avril', litres: 48 },
    { month: 'Mai', litres: 61 },
    { month: 'Juin', litres: 55 },
    { month: 'Juillet', litres: 58 },
    { month: 'Août', litres: 34 },
  ],
  carburant: { niveau: 65, autonomie: 450, consoMoyenne: 6.8, coutMoisEnCours: 28500 },
  resumeMois: { totalKm: 183.3, totalTrajets: 10, consoMoyenne: 6.88, vitesseMoyenne: 33.2 },
}

const MOCK_TRIPS: Trip[] = [
  { id: 1, date: '2026-08-04', depart: 'Bamako, Kalaban-Coura', arrivee: 'Bamako, ACI 2000', distance: 8.4, duree: '00:18', vitesseMoy: 28, conso: 7.1 },
  { id: 2, date: '2026-08-03', depart: 'Bamako, ACI 2000', arrivee: 'Kati', distance: 15.2, duree: '00:25', vitesseMoy: 36, conso: 6.8 },
  { id: 3, date: '2026-08-03', depart: 'Kati', arrivee: 'Bamako, Badalabougou', distance: 14.8, duree: '00:22', vitesseMoy: 40, conso: 6.5 },
  { id: 4, date: '2026-08-02', depart: 'Bamako, Badalabougou', arrivee: 'Bamako, Hamdallaye', distance: 5.1, duree: '00:12', vitesseMoy: 25, conso: 7.4 },
  { id: 5, date: '2026-08-01', depart: 'Bamako, Hamdallaye', arrivee: 'Bamako, Lafiabougou', distance: 3.2, duree: '00:08', vitesseMoy: 24, conso: 7.8 },
  { id: 6, date: '2026-07-31', depart: 'Bamako, Lafiabougou', arrivee: 'Koulikoro', distance: 59.0, duree: '01:05', vitesseMoy: 54, conso: 6.2 },
  { id: 7, date: '2026-07-30', depart: 'Koulikoro', arrivee: 'Bamako, Kalaban-Coura', distance: 57.5, duree: '01:02', vitesseMoy: 55, conso: 6.1 },
  { id: 8, date: '2026-07-29', depart: 'Bamako, Kalaban-Coura', arrivee: 'Bamako, Baco Djicoroni', distance: 6.7, duree: '00:15', vitesseMoy: 27, conso: 7.3 },
  { id: 9, date: '2026-07-28', depart: 'Bamako, Baco Djicoroni', arrivee: 'Bamako, Sébenikoro', distance: 4.3, duree: '00:10', vitesseMoy: 26, conso: 7.6 },
  { id: 10, date: '2026-07-27', depart: 'Bamako, Sébenikoro', arrivee: 'Bamako, ACI 2000', distance: 9.1, duree: '00:20', vitesseMoy: 27, conso: 7.0 },
]

// ─── Circular Progress ───────────────────────────────────────
function CircularProgress({ value, max, size = 120, strokeWidth = 10, color = '#10b981' }: {
  value: number; max: number; size?: number; strokeWidth?: number; color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
   const offset = circumference - (value / max) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ─── Alert type helpers ──────────────────────────────────────
function alertMeta(type: AlertItem['type']) {
  switch (type) {
    case 'speed': return { icon: <Gauge className="h-5 w-5" />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', badge: 'bg-red-500/20 text-red-400' }
    case 'geofence': return { icon: <Navigation className="h-5 w-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', badge: 'bg-orange-500/20 text-orange-400' }
    case 'maintenance': return { icon: <Wrench className="h-5 w-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', badge: 'bg-yellow-500/20 text-yellow-400' }
    case 'info': return { icon: <Info className="h-5 w-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', badge: 'bg-blue-500/20 text-blue-400' }
  }
}



// ─── Status badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: 'moving' | 'stopped' | 'offline' }) {
  const map = {
    moving: { label: 'En mouvement', color: 'bg-emerald-500/20 text-emerald-400', dot: 'bg-emerald-500' },
    stopped: { label: 'À l\'arrêt', color: 'bg-yellow-500/20 text-yellow-400', dot: 'bg-yellow-500' },
    offline: { label: 'Hors ligne', color: 'bg-slate-500/20 text-slate-400', dot: 'bg-slate-500' },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'moving' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  )
}

// ─── Fade-in animation wrapper ───────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function TelematicsModule() {
  const [vehicleId, setVehicleId] = useState('v1')
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS)
  const [stats, setStats] = useState<DrivingStats>(MOCK_STATS)
  const [vehicleStatus, setVehicleStatus] = useState<'moving' | 'stopped' | 'offline'>('moving')
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERTS)

  // Fetch from API on mount (optional, fallback to mock)
  useEffect(() => {
    fetch('/api/telematics?type=trips')
      .then(r => r.json())
      .then(res => { if (res.success) setTrips(res.data) })
      .catch(() => { /* use mock */ })
    fetch('/api/telematics?type=stats')
      .then(r => r.json())
      .then(res => { if (res.success) setStats(res.data) })
      .catch(() => { /* use mock */ })
  }, [])

  const markAsRead = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, lu: true } : a))
  }

  const unreadCount = alerts.filter(a => !a.lu).length

  return (
    <div className="pt-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Activity className="h-8 w-8 text-emerald-500" />
                Télématique
              </h1>
              <p className="text-slate-400 mt-1">Suivi GPS, analyse de conduite et gestion du carburant</p>
            </div>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger className="w-full sm:w-72 bg-slate-900 border-slate-800 text-white">
                <Car className="h-4 w-4 mr-2 text-emerald-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                {VEHICLES.map(v => (
                  <SelectItem key={v.id} value={v.id} className="text-slate-200 focus:bg-slate-800 focus:text-white">
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="carte" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-auto flex flex-wrap gap-1">
            <TabsTrigger value="carte" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <MapPin className="h-4 w-4" /> Carte
            </TabsTrigger>
            <TabsTrigger value="trajets" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Route className="h-4 w-4" /> Trajets
            </TabsTrigger>
            <TabsTrigger value="conduite" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Gauge className="h-4 w-4" /> Conduite
            </TabsTrigger>
            <TabsTrigger value="carburant" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Fuel className="h-4 w-4" /> Carburant
            </TabsTrigger>
            <TabsTrigger value="alertes" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5 relative">
              <AlertTriangle className="h-4 w-4" /> Alertes
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: CARTE ─────────────────────────────────── */}
          <TabsContent value="carte">
            <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map placeholder */}
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full h-[400px] sm:h-[500px] bg-slate-800 flex flex-col items-center justify-center rounded-t-lg">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    <Navigation className="h-16 w-16 text-emerald-500/40 mb-4" />
                    <p className="text-slate-500 text-lg font-medium">Suivi GPS en temps réel</p>
                    <p className="text-slate-600 text-sm mt-1">Carte interactive — intégration Mapbox prévue</p>
                    {/* Animated ping on center */}
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-500/60">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info sidebar */}
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-emerald-500" />
                      Statut du véhicule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">État</span>
                      <StatusBadge status={vehicleStatus} />
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Latitude</span>
                        <span className="text-white text-sm font-mono">12.6392° N</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Longitude</span>
                        <span className="text-white text-sm font-mono">8.0029° W</span>
                      </div>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> Vitesse actuelle</span>
                      <span className="text-emerald-400 text-lg font-bold">42 <span className="text-xs text-slate-500">km/h</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Dernière MAJ</span>
                      <span className="text-white text-sm">14:32</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Position</p>
                      <p className="text-white font-medium">Bamako, Kalaban-Coura</p>
                      <p className="text-slate-500 text-xs">Précision: ± 3 m</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick vehicle selector for mobile */}
                <div className="flex gap-2 lg:hidden">
                  {VEHICLES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setVehicleId(v.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        vehicleId === v.id ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      V{v.id.replace('v', '')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── TAB: TRAJETS ───────────────────────────────── */}
          <TabsContent value="trajets">
            <motion.div {...fadeUp} className="space-y-6">
              {/* Summary stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total km (mois)', value: `${stats.resumeMois.totalKm} km`, icon: <Route className="h-5 w-5 text-emerald-500" /> },
                  { label: 'Total trajets', value: stats.resumeMois.totalTrajets.toString(), icon: <Car className="h-5 w-5 text-emerald-500" /> },
                  { label: 'Conso. moyenne', value: `${stats.resumeMois.consoMoyenne} L/100`, icon: <Fuel className="h-5 w-5 text-emerald-500" /> },
                  { label: 'Vitesse moyenne', value: `${stats.resumeMois.vitesseMoyenne} km/h`, icon: <Gauge className="h-5 w-5 text-emerald-500" /> },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="bg-slate-900 border-slate-800">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {stat.icon}
                          <span className="text-slate-500 text-xs uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-white text-xl font-bold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Trips table */}
              <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    Historique des trajets
                  </CardTitle>
                  <CardDescription className="text-slate-500">10 derniers trajets enregistrés</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400 text-xs">Date</TableHead>
                          <TableHead className="text-slate-400 text-xs">Départ</TableHead>
                          <TableHead className="text-slate-400 text-xs hidden sm:table-cell">Arrivée</TableHead>
                          <TableHead className="text-slate-400 text-xs text-right">Distance</TableHead>
                          <TableHead className="text-slate-400 text-xs hidden md:table-cell">Durée</TableHead>
                          <TableHead className="text-slate-400 text-xs text-right hidden lg:table-cell">V. moy.</TableHead>
                          <TableHead className="text-slate-400 text-xs text-right hidden xl:table-cell">Conso.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trips.map((trip, i) => (
                          <motion.tr
                            key={trip.id}
                            className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <TableCell className="text-slate-300 text-sm py-3">{trip.date}</TableCell>
                            <TableCell className="text-white text-sm py-3 max-w-[150px] truncate">{trip.depart}</TableCell>
                            <TableCell className="text-slate-300 text-sm py-3 max-w-[150px] truncate hidden sm:table-cell">{trip.arrivee}</TableCell>
                            <TableCell className="text-emerald-400 text-sm py-3 text-right font-mono">{trip.distance}</TableCell>
                            <TableCell className="text-slate-300 text-sm py-3 hidden md:table-cell font-mono">{trip.duree}</TableCell>
                            <TableCell className="text-slate-300 text-sm py-3 text-right hidden lg:table-cell font-mono">{trip.vitesseMoy}</TableCell>
                            <TableCell className="text-slate-300 text-sm py-3 text-right hidden xl:table-cell font-mono">{trip.conso}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── TAB: CONDUITE ──────────────────────────────── */}
          <TabsContent value="conduite">
            <motion.div {...fadeUp} className="space-y-6">
              {/* Score cards grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Driving score - circular */}
                <Card className="bg-slate-900 border-slate-800 col-span-2 md:col-span-1">
                  <CardContent className="pt-6 pb-5 flex flex-col items-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Score de conduite</p>
                    <div className="relative">
                      <CircularProgress value={stats.scoreConduite} max={100} size={110} strokeWidth={10} color="#10b981" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{stats.scoreConduite}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">sur 100</p>
                  </CardContent>
                </Card>

                {/* Emergency braking */}
                <ScoreCard
                  label="Freinages d'urgence"
                  value={stats.freinagesUrgence}
                  threshold={5}
                  icon={<Zap className="h-5 w-5" />}
                />

                {/* Harsh acceleration */}
                <ScoreCard
                  label="Accélérations brusques"
                  value={stats.accelerationsBrusques}
                  threshold={10}
                  icon={<TrendingUp className="h-5 w-5" />}
                />

                {/* Excessive speed */}
                <ScoreCard
                  label="Vitesse excessive"
                  value={stats.vitesseExcessive}
                  threshold={5}
                  critical
                  icon={<Gauge className="h-5 w-5" />}
                />

                {/* Idle time */}
                <ScoreCard
                  label="Temps au ralenti"
                  value={stats.tempsRalenti}
                  threshold={20}
                  unit="min"
                  icon={<Timer className="h-5 w-5" />}
                />
              </div>

              {/* Weekly chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    Événements de conduite — Semaine
                  </CardTitle>
                  <CardDescription className="text-slate-500">Vitesse, freinage et accélération par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.weeklyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                        <Bar dataKey="speed" name="Vitesse" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="braking" name="Freinage" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="acceleration" name="Accélération" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── TAB: CARBURANT ─────────────────────────────── */}
          <TabsContent value="carburant">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Fuel level */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-400 text-xs uppercase tracking-wider">Niveau de carburant</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.carburant.niveau}<span className="text-lg text-slate-500">%</span></p>
                    <Progress value={stats.carburant.niveau} className="h-2 bg-slate-800 [&>div]:bg-emerald-500" />
                  </CardContent>
                </Card>

                {/* Range remaining */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-400 text-xs uppercase tracking-wider">Autonomie restante</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.carburant.autonomie} <span className="text-lg text-slate-500">km</span></p>
                    <p className="text-slate-500 text-xs">Basé sur la consommation actuelle</p>
                  </CardContent>
                </Card>

                {/* Average consumption */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-400 text-xs uppercase tracking-wider">Conso. moyenne</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.carburant.consoMoyenne} <span className="text-lg text-slate-500">L/100</span></p>
                    <p className="text-emerald-500 text-xs">↓ 0.3L vs mois dernier</p>
                  </CardContent>
                </Card>

                {/* Cost tracker */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-400 text-xs uppercase tracking-wider">Coût du mois</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.carburant.coutMoisEnCours.toLocaleString('fr-FR')} <span className="text-lg text-slate-500">FCFA</span></p>
                    <p className="text-slate-500 text-xs">Estimation en cours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly fuel chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    Consommation mensuelle
                  </CardTitle>
                  <CardDescription className="text-slate-500">Litres de carburant par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.monthlyFuel}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} unit=" L" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
                          formatter={(value: number) => [`${value} L`, 'Litres']}
                        />
                        <Bar dataKey="litres" name="Litres" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── TAB: ALERTES ───────────────────────────────── */}
          <TabsContent value="alertes">
            <motion.div {...fadeUp} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Alertes récentes</h2>
                  <p className="text-slate-500 text-sm">{unreadCount} non lue{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                <Badge variant="outline" className="border-slate-700 text-slate-400">
                  {alerts.length} alerte{alerts.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1">
                {alerts.map((alert, i) => {
                  const meta = alertMeta(alert.type)
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => !alert.lu && markAsRead(alert.id)}
                      className={`cursor-pointer transition-all hover:scale-[1.01]`}
                    >
                      <Card className={`bg-slate-900 border ${alert.lu ? 'border-slate-800' : `${meta.border} ${meta.bg}`}`}>
                        <CardContent className="py-4 px-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${meta.bg} ${meta.color} shrink-0 mt-0.5`}>
                              {meta.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className={`text-sm font-medium ${alert.lu ? 'text-slate-300' : 'text-white'}`}>
                                  {alert.title}
                                  {!alert.lu && <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2" />}
                                </h3>
                                <Badge className={`${meta.badge} text-[10px] shrink-0`} variant="outline">
                                  {alert.lu ? 'Lu' : 'Non lu'}
                                </Badge>
                              </div>
                              <p className="text-slate-500 text-xs mb-1.5">{alert.description}</p>
                              <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                <Clock className="h-3 w-3" />
                                {alert.timestamp}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─── Score Card Sub-component ────────────────────────────────
function ScoreCard({ label, value, threshold, critical, unit = '', icon }: {
  label: string; value: number; threshold: number; critical?: boolean; unit?: string; icon: React.ReactNode
}) {
  const exceeds = critical ? value > threshold : value > threshold
  const color = critical
    ? (exceeds ? 'text-red-400' : 'text-emerald-400')
    : (exceeds ? 'text-yellow-400' : 'text-emerald-400')
  const bgColor = critical
    ? (exceeds ? 'bg-red-500/10' : 'bg-emerald-500/10')
    : (exceeds ? 'bg-yellow-500/10' : 'bg-emerald-500/10')

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-5 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
        </div>
        <p className={`text-2xl font-bold ${color}`}>
          {value}
          {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
        </p>
        <p className={`text-xs ${exceeds ? (critical ? 'text-red-400/70' : 'text-yellow-400/70') : 'text-slate-600'}`}>
          {exceeds ? `Seuil: > ${threshold}${unit}` : 'Dans la norme'}
        </p>
      </CardContent>
    </Card>
  )
}
