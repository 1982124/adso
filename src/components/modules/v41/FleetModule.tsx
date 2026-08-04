'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Truck,
  Users,
  Wrench,
  Fuel,
  BarChart3,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Euro,
  Activity,
  TrendingUp,
  TrendingDown,
  Car,
  FileText,
  Download,
  Gauge,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  ArrowUpDown,
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
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Types ───────────────────────────────────────────────────
interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  type: string
  fuelType: string
  licensePlate: string
  mileage: number
  status: string
  assignedDriverId: string | null
  fleet: { name: string }
  _count: { maintenanceRecords: number; fuelRecords: number }
}

interface DriverGroup {
  id: string
  name: string
  driverCount: number
  vehicleCount: number
  plan: string
}

interface MaintenanceRecord {
  id: string
  type: string
  description: string
  cost: number | null
  performedAt: string | null
  nextDueDate: string | null
  nextDueMileage: number | null
  status: string
  vehicle: { id: string; make: string; model: string; licensePlate: string }
}

interface FuelRecord {
  id: string
  fuelType: string
  quantity: number
  costPerLiter: number | null
  totalCost: number | null
  odometer: number | null
  fuelingDate: string
  stationName: string | null
  location: string | null
  vehicle: { id: string; make: string; model: string; licensePlate: string }
}

// ─── Chart configs ───────────────────────────────────────────
const costChartConfig: ChartConfig = {
  cout: { label: 'Coût (€)', color: '#10b981' },
}

const fuelChartConfig: ChartConfig = {
  litres: { label: 'Litres', color: '#06b6d4' },
  cout: { label: 'Coût (€)', color: '#f59e0b' },
}

const maintChartConfig: ChartConfig = {
  cout: { label: 'Coût (€)', color: '#8b5cf6' },
}

// ─── Status helpers ──────────────────────────────────────────
const statusLabels: Record<string, string> = {
  active: 'Actif',
  maintenance: 'En maintenance',
  out_of_service: 'Hors service',
  retired: 'Réformé',
  scheduled: 'Planifié',
  in_progress: 'En cours',
  completed: 'Terminé',
  overdue: 'En retard',
  suspended: 'Suspendu',
  inactive: 'Inactif',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  maintenance: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  out_of_service: 'bg-red-500/20 text-red-400 border-red-500/30',
  retired: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
  inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const maintenanceTypeLabels: Record<string, string> = {
  routine: 'Routine',
  repair: 'Réparation',
  inspection: 'Inspection',
  tire: 'Pneus',
  oil: 'Huile',
  brake: 'Freins',
  battery: 'Batterie',
  transmission: 'Transmission',
  engine: 'Moteur',
  body: 'Carrosserie',
}

const MOIS_ABREGE = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

// ─── Component ───────────────────────────────────────────────
export default function FleetModule() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [driverGroups, setDriverGroups] = useState<DriverGroup[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([])
  const [fuel, setFuel] = useState<FuelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [fuelDialogOpen, setFuelDialogOpen] = useState(false)
  const [fleetDialogOpen, setFleetDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [vRes, fRes, mRes, fuRes] = await Promise.all([
        fetch('/api/fleet/vehicles'),
        fetch('/api/fleet'),
        fetch('/api/fleet/maintenance'),
        fetch('/api/fleet/fuel'),
      ])
      const vData = await vRes.json()
      const fData = await fRes.json()
      const mData = await mRes.json()
      const fuData = await fuRes.json()

      if (vData.success) setVehicles(vData.data)
      if (fData.success) {
        setDriverGroups(
          fData.data.map((org: { id: string; name: string; plan: string; _count: { vehicles: number; drivers: number } }) => ({
            id: org.id,
            name: org.name,
            driverCount: org._count.drivers,
            vehicleCount: org._count.vehicles,
            plan: org.plan,
          }))
        )
      }
      if (mData.success) setMaintenance(mData.data)
      if (fuData.success) setFuel(fuData.data)
    } catch (e) {
      console.error('Erreur chargement données flotte:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ─── Computed data ─────────────────────────────────────────
  const filteredVehicles = vehicles.filter(
    (v) =>
      `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = vehicles.filter((v) => v.status === 'active').length
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length
  const totalMileage = vehicles.reduce((s, v) => s + v.mileage, 0)
  const totalCosts = maintenance.reduce((s, m) => s + (m.cost ?? 0), 0) + fuel.reduce((s, f) => s + (f.totalCost ?? 0), 0)
  const totalDrivers = driverGroups.reduce((s, d) => s + d.driverCount, 0)

  const pendingMaintCount = maintenance.filter(m => m.status === 'scheduled' || m.status === 'overdue').length

  const statusData = [
    { name: 'Actif', value: vehicles.filter(v => v.status === 'active').length, color: '#10b981' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length, color: '#f59e0b' },
    { name: 'Hors service', value: vehicles.filter(v => v.status === 'out_of_service').length, color: '#ef4444' },
    { name: 'Réformé', value: vehicles.filter(v => v.status === 'retired').length, color: '#6b7280' },
  ]

  const costPerVehicleChart = vehicles.length > 0
    ? vehicles.map(v => {
        const maintCost = maintenance.filter(m => m.vehicle.id === v.id).reduce((s, m) => s + (m.cost ?? 0), 0)
        const fuelCost = fuel.filter(f => f.vehicle.id === v.id).reduce((s, f) => s + (f.totalCost ?? 0), 0)
        return { vehicle: `${v.make} ${v.model}`, cout: Math.round(maintCost + fuelCost) }
      }).filter(c => c.cout > 0)
    : []

  const fuelTrendChart = (() => {
    const byMonth: Record<string, { litres: number; cout: number }> = {}
    fuel.forEach(f => {
      const d = new Date(f.fuelingDate)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { litres: 0, cout: 0 }
      byMonth[key].litres += f.quantity
      byMonth[key].cout += f.totalCost ?? 0
    })
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([, v], i) => ({
        mois: MOIS_ABREGE[(new Date().getMonth() - 6 + i + 12) % 12],
        litres: Math.round(v.litres),
        cout: Math.round(v.cout),
      }))
  })()

  const maintenanceCostChart = (() => {
    const byMonth: Record<string, number> = {}
    maintenance.forEach(m => {
      if (m.performedAt) {
        const d = new Date(m.performedAt)
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
        byMonth[key] = (byMonth[key] ?? 0) + (m.cost ?? 0)
      }
    })
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([, v], i) => ({
        mois: MOIS_ABREGE[(new Date().getMonth() - 6 + i + 12) % 12],
        cout: Math.round(v),
      }))
  })()

  const recentActivity = (() => {
    const activities: Array<{ id: number; text: string; time: string; icon: React.ReactNode }> = []
    maintenance.slice(0, 3).forEach((m, i) => {
      activities.push({
        id: i,
        text: `${maintenanceTypeLabels[m.type] ?? m.type} — ${m.vehicle.make} ${m.vehicle.model} ${m.vehicle.licensePlate}`,
        time: m.performedAt ? `Le ${new Date(m.performedAt).toLocaleDateString('fr-FR')}` : 'Planifié',
        icon: m.status === 'overdue'
          ? <AlertTriangle className="h-4 w-4 text-red-400" />
          : m.status === 'completed'
            ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            : <Clock className="h-4 w-4 text-blue-400" />,
      })
    })
    fuel.slice(0, 2).forEach((f, i) => {
      activities.push({
        id: 10 + i,
        text: `Ravitaillement — ${f.vehicle.make} ${f.vehicle.model} (${f.vehicle.licensePlate})`,
        time: `Le ${new Date(f.fuelingDate).toLocaleDateString('fr-FR')}`,
        icon: <Fuel className="h-4 w-4 text-cyan-400" />,
      })
    })
    return activities.slice(0, 5)
  })()

  // ─── Form handlers ─────────────────────────────────────────
  const handleCreateFleet = async () => {
    const nameInput = document.getElementById('fleet-name') as HTMLInputElement
    if (!nameInput?.value) return
    setSubmitting(true)
    try {
      await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.value }),
      })
      setFleetDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur création flotte:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddVehicle = async () => {
    const make = (document.getElementById('v-make') as HTMLInputElement)?.value
    const model = (document.getElementById('v-model') as HTMLInputElement)?.value
    const year = parseInt((document.getElementById('v-year') as HTMLInputElement)?.value ?? '0')
    const plate = (document.getElementById('v-plate') as HTMLInputElement)?.value
    const fuelTypeEl = document.querySelector('[data-fuel-type]') as HTMLSelectElement
    const typeEl = document.querySelector('[data-vehicle-type]') as HTMLSelectElement
    if (!make || !model || !year) return
    const fleetId = driverGroups[0]?.id
    if (!fleetId) return
    setSubmitting(true)
    try {
      await fetch('/api/fleet/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleetId, make, model, year, licensePlate: plate, fuelType: fuelTypeEl?.value, type: typeEl?.value }),
      })
      setVehicleDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur ajout véhicule:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddMaintenance = async () => {
    const vehicleEl = document.querySelector('[data-maint-vehicle]') as HTMLSelectElement
    const typeEl = document.querySelector('[data-maint-type]') as HTMLSelectElement
    const costEl = (document.getElementById('m-cost') as HTMLInputElement)?.value
    const descEl = (document.getElementById('m-desc') as HTMLInputElement)?.value
    const dateEl = (document.getElementById('m-date') as HTMLInputElement)?.value
    const mileageEl = (document.getElementById('m-mileage') as HTMLInputElement)?.value
    if (!vehicleEl?.value || !descEl) return
    setSubmitting(true)
    try {
      await fetch('/api/fleet/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fleetVehicleId: vehicleEl.value,
          type: typeEl?.value ?? 'routine',
          description: descEl,
          cost: costEl ? parseFloat(costEl) : null,
          nextDueDate: dateEl || null,
          nextDueMileage: mileageEl ? parseInt(mileageEl) : null,
          status: 'scheduled',
        }),
      })
      setMaintenanceDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur planification maintenance:', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddFuel = async () => {
    const vehicleEl = document.querySelector('[data-fuel-vehicle]') as HTMLSelectElement
    const qtyEl = (document.getElementById('f-qty') as HTMLInputElement)?.value
    const costEl = (document.getElementById('f-cost') as HTMLInputElement)?.value
    const stationEl = (document.getElementById('f-station') as HTMLInputElement)?.value
    const odometerEl = (document.getElementById('f-odometer') as HTMLInputElement)?.value
    if (!vehicleEl?.value || !qtyEl) return
    setSubmitting(true)
    try {
      await fetch('/api/fleet/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fleetVehicleId: vehicleEl.value,
          quantity: parseFloat(qtyEl),
          totalCost: costEl ? parseFloat(costEl) : null,
          stationName: stationEl || null,
          odometer: odometerEl ? parseInt(odometerEl) : null,
        }),
      })
      setFuelDialogOpen(false)
      loadData()
    } catch (e) {
      console.error('Erreur ajout carburant:', e)
    } finally {
      setSubmitting(false)
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
              <Truck className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion de Flotte</h1>
              <p className="text-sm text-slate-400">ADSO V4.1 — Module Flotte</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Car className="h-4 w-4 mr-2" />Véhicules
              </TabsTrigger>
              <TabsTrigger value="drivers" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />Conducteurs
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Wrench className="h-4 w-4 mr-2" />Maintenance
              </TabsTrigger>
              <TabsTrigger value="fuel" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Fuel className="h-4 w-4 mr-2" />Carburant
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />Rapports
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />Actualiser
              </Button>
              <Dialog open={fleetDialogOpen} onOpenChange={setFleetDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />Créer une flotte
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Créer une Flotte</DialogTitle>
                    <DialogDescription className="text-slate-400">Créez une nouvelle organisation de flotte</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nom de la flotte</Label>
                      <Input id="fleet-name" placeholder="Ex: Flotte ADSO" className="bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setFleetDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreateFleet} disabled={submitting}>{submitting ? 'Création...' : 'Créer'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* ═══ TAB 1: Dashboard ═══ */}
          <TabsContent value="dashboard" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Véhicules', value: vehicles.length, icon: <Car className="h-5 w-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Conducteurs Actifs', value: totalDrivers, icon: <Users className="h-5 w-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Maintenance en attente', value: maintenanceCount + pendingMaintCount, icon: <Wrench className="h-5 w-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Coûts Totaux', value: `${totalCosts.toLocaleString('fr-FR')} €`, icon: <Euro className="h-5 w-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
                  {/* Fleet Health */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Santé de la Flotte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Véhicules actifs</span>
                        <span className="text-emerald-400 font-medium">{activeCount}/{vehicles.length || 1}</span>
                      </div>
                      <Progress value={vehicles.length ? (activeCount / vehicles.length) * 100 : 0} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Kilométrage moyen</span>
                        <span className="text-cyan-400 font-medium">{vehicles.length ? (totalMileage / vehicles.length).toLocaleString('fr-FR') : 0} km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Organisations flotte</span>
                        <span className="text-amber-400 font-medium">{driverGroups.length}</span>
                      </div>
                      <Separator className="bg-slate-800" />
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400">Répartition par statut</p>
                        {statusData.filter(s => s.value > 0).map((s) => (
                          <div key={s.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-sm text-slate-300 flex-1">{s.name}</span>
                            <Badge variant="outline" className={statusColors[s.name === 'Actif' ? 'active' : s.name === 'Maintenance' ? 'maintenance' : 'out_of_service']}>
                              {s.value}
                            </Badge>
                          </div>
                        ))}
                        {statusData.every(s => s.value === 0) && (
                          <p className="text-sm text-slate-500">Aucun véhicule enregistré</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Status Pie */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Statut des Véhicules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statusData.some(s => s.value > 0) ? (
                        <ChartContainer config={costChartConfig} className="h-[200px] w-full">
                          <PieChart>
                            <Pie
                              data={statusData.filter(s => s.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                              nameKey="name"
                            >
                              {statusData.filter(s => s.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ChartContainer>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                        {recentActivity.length > 0 ? recentActivity.map((a) => (
                          <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                            <div className="mt-0.5">{a.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-300 truncate">{a.text}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-sm text-slate-500 text-center py-8">Aucune activité récente</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* ═══ TAB 2: Vehicles ═══ */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Rechercher véhicule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-white"
                />
              </div>
              <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={driverGroups.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />Ajouter un véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Ajouter un véhicule</DialogTitle>
                    <DialogDescription className="text-slate-400">Renseignez les informations du nouveau véhicule</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Marque</Label>
                        <Input id="v-make" placeholder="Ex: Renault" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Modèle</Label>
                        <Input id="v-model" placeholder="Ex: Kangoo" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input id="v-year" type="number" placeholder="2024" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Immatriculation</Label>
                        <Input id="v-plate" placeholder="AB-123-CD" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de carburant</Label>
                        <Select>
                          <SelectTrigger data-fuel-type className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="gasoline">Essence</SelectItem>
                            <SelectItem value="electric">Électrique</SelectItem>
                            <SelectItem value="hybrid">Hybride</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select>
                          <SelectTrigger data-vehicle-type className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car">Voiture</SelectItem>
                            <SelectItem value="truck">Camion</SelectItem>
                            <SelectItem value="motorcycle">Moto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Kilométrage</Label>
                      <Input type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setVehicleDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddVehicle} disabled={submitting}>{submitting ? 'Ajout...' : 'Ajouter'}</Button>
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
                        <TableHead className="text-slate-400">Véhicule</TableHead>
                        <TableHead className="text-slate-400">Immatriculation</TableHead>
                        <TableHead className="text-slate-400">Kilométrage</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                        <TableHead className="text-slate-400">Maintenance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-32 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : filteredVehicles.length > 0 ? filteredVehicles.map((v) => (
                        <TableRow key={v.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-white font-medium">{v.make} {v.model} <span className="text-slate-500">({v.year})</span></TableCell>
                          <TableCell className="text-slate-300 font-mono text-sm">{v.licensePlate}</TableCell>
                          <TableCell className="text-slate-300">{v.mileage.toLocaleString('fr-FR')} km</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[v.status]}>
                              {statusLabels[v.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {v._count.maintenanceRecords > 0 && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                  <Wrench className="h-3 w-3 mr-1" />{v._count.maintenanceRecords}
                                </Badge>
                              )}
                              {v.status === 'maintenance' && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                                  <AlertTriangle className="h-3 w-3 mr-1" />En cours
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">Aucun véhicule trouvé. Créez d'abord une flotte, puis ajoutez des véhicules.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 3: Drivers ═══ */}
          <TabsContent value="drivers" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : driverGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {driverGroups.map((d) => {
                  const planColor = d.plan === 'enterprise' ? 'text-purple-400' : d.plan === 'professional' ? 'text-cyan-400' : 'text-emerald-400'
                  return (
                    <Card key={d.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-medium">{d.name}</p>
                            <p className="text-xs text-slate-500">Plan {d.plan}</p>
                          </div>
                          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Actif
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Conducteurs</span>
                            <span className={`font-bold ${planColor}`}>{d.driverCount}</span>
                          </div>
                          <Progress value={d.driverCount > 0 ? Math.min((d.driverCount / d.vehicleCount) * 50, 100) : 0} className="h-1.5" />
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="text-center p-2 rounded bg-slate-800/50">
                              <p className="text-xs text-slate-500">Véhicules</p>
                              <p className="text-sm font-medium text-white">{d.vehicleCount}</p>
                            </div>
                            <div className="text-center p-2 rounded bg-slate-800/50">
                              <p className="text-xs text-slate-500">Plan</p>
                              <p className={`text-sm font-medium ${planColor}`}>{d.plan.charAt(0).toUpperCase() + d.plan.slice(1)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Aucune organisation de flotte. Créez une flotte pour gérer vos conducteurs.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB 4: Maintenance ═══ */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />{maintenance.filter(m => m.status === 'overdue').length} En retard
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <Clock className="h-3 w-3 mr-1" />{maintenance.filter(m => m.status === 'scheduled').length} Planifiés
                </Badge>
              </div>
              <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={vehicles.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />Planifier maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Planifier une maintenance</DialogTitle>
                    <DialogDescription className="text-slate-400">Définissez les détails de l'intervention</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Véhicule</Label>
                      <Select>
                        <SelectTrigger data-maint-vehicle className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {vehicles.map(v => (
                            <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select>
                          <SelectTrigger data-maint-type className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(maintenanceTypeLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Coût estimé (€)</Label>
                        <Input id="m-cost" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input id="m-desc" placeholder="Description de l'intervention" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date prévue</Label>
                        <Input id="m-date" type="date" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Prochain kilométrage</Label>
                        <Input id="m-mileage" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setMaintenanceDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddMaintenance} disabled={submitting}>{submitting ? 'Planification...' : 'Planifier'}</Button>
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
                        <TableHead className="text-slate-400">Véhicule</TableHead>
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Description</TableHead>
                        <TableHead className="text-slate-400">Échéance</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                        <TableHead className="text-slate-400">Coût</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-32 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : maintenance.length > 0 ? maintenance.map((m) => (
                        <TableRow key={m.id} className={`border-slate-800 hover:bg-slate-800/50 ${m.status === 'overdue' ? 'bg-red-500/5' : ''}`}>
                          <TableCell className="text-white text-sm">{m.vehicle.make} {m.vehicle.model} <span className="text-slate-500 font-mono">({m.vehicle.licensePlate})</span></TableCell>
                          <TableCell><Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{maintenanceTypeLabels[m.type] ?? m.type}</Badge></TableCell>
                          <TableCell className="text-slate-300 text-sm max-w-[200px] truncate">{m.description}</TableCell>
                          <TableCell className="text-slate-300 text-sm">{m.nextDueDate ? new Date(m.nextDueDate).toLocaleDateString('fr-FR') : '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[m.status]}>
                              {m.status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {statusLabels[m.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">{m.cost ? `${m.cost} €` : '—'}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-slate-500 py-8">Aucun enregistrement de maintenance</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 5: Fuel ═══ */}
          <TabsContent value="fuel" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Fuel className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Coût total carburant</p>
                      <p className="text-xl font-bold text-white">{loading ? '...' : fuel.reduce((s, f) => s + (f.totalCost ?? 0), 0).toFixed(2)} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Gauge className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Volume total</p>
                      <p className="text-xl font-bold text-white">{loading ? '...' : fuel.reduce((s, f) => s + f.quantity, 0).toFixed(0)} L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <TrendingDown className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Coût moyen/L</p>
                      <p className="text-xl font-bold text-white">{loading ? '...' : (() => { const withCpl = fuel.filter(f => f.costPerLiter); return withCpl.length ? (withCpl.reduce((s, f) => s + (f.costPerLiter ?? 0), 0) / withCpl.length).toFixed(2) : '—' })()} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Dialog open={fuelDialogOpen} onOpenChange={setFuelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={vehicles.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />Ajouter ravitaillement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Ajouter un ravitaillement</DialogTitle>
                    <DialogDescription className="text-slate-400">Enregistrez les détails du plein</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Véhicule</Label>
                      <Select>
                        <SelectTrigger data-fuel-vehicle className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {vehicles.map(v => (
                            <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantité (L)</Label>
                        <Input id="f-qty" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Coût total (€)</Label>
                        <Input id="f-cost" type="number" step="0.01" placeholder="0.00" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Station</Label>
                        <Input id="f-station" placeholder="Nom de la station" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Kilométrage</Label>
                        <Input id="f-odometer" type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setFuelDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddFuel} disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</Button>
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
                        <TableHead className="text-slate-400">Véhicule</TableHead>
                        <TableHead className="text-slate-400">Date</TableHead>
                        <TableHead className="text-slate-400">Quantité</TableHead>
                        <TableHead className="text-slate-400">Coût</TableHead>
                        <TableHead className="text-slate-400">Station</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-32 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : fuel.length > 0 ? fuel.map((f) => (
                        <TableRow key={f.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-white text-sm">{f.vehicle.make} {f.vehicle.model} <span className="text-slate-500 font-mono">({f.vehicle.licensePlate})</span></TableCell>
                          <TableCell className="text-slate-300 text-sm">{new Date(f.fuelingDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-slate-300">{f.quantity} L</TableCell>
                          <TableCell className="text-slate-300">{f.totalCost?.toFixed(2)} €</TableCell>
                          <TableCell className="text-slate-300 text-sm">{f.stationName ?? '—'}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">Aucun enregistrement de carburant</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 6: Reports ═══ */}
          <TabsContent value="reports" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Coût/véhicule/mois', value: vehicles.length ? `${Math.round(totalCosts / vehicles.length).toLocaleString('fr-FR')} €` : '—', trend: <TrendingDown className="h-4 w-4 text-emerald-400" />, trendText: '', trendColor: 'text-emerald-400' },
                { label: 'Conso. moyenne', value: fuel.length ? `${(fuel.reduce((s, f) => s + f.quantity, 0) / Math.max(fuel.length, 1)).toFixed(1)} L/plein` : '—', trend: <TrendingDown className="h-4 w-4 text-emerald-400" />, trendText: '', trendColor: 'text-emerald-400' },
                { label: 'Coûts maintenance', value: `${maintenance.reduce((s, m) => s + (m.cost ?? 0), 0).toLocaleString('fr-FR')} €`, trend: <TrendingUp className="h-4 w-4 text-red-400" />, trendText: '', trendColor: 'text-red-400' },
                { label: 'Disponibilité flotte', value: vehicles.length ? `${Math.round((activeCount / vehicles.length) * 100)}%` : '—', trend: <TrendingDown className="h-4 w-4 text-red-400" />, trendText: '', trendColor: 'text-red-400' },
              ].map((kpi) => (
                <Card key={kpi.label} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400">{kpi.label}</p>
                    <div className="flex items-end gap-2 mt-1">
                      <p className="text-2xl font-bold text-white">{kpi.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost per vehicle */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Coût par Véhicule (€)</CardTitle>
                </CardHeader>
                <CardContent>
                  {costPerVehicleChart.length > 0 ? (
                    <ChartContainer config={costChartConfig} className="h-[250px] w-full">
                      <BarChart data={costPerVehicleChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="vehicle" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="cout" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée de coût</div>
                  )}
                </CardContent>
              </Card>

              {/* Fuel trends */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Tendances Carburant</CardTitle>
                </CardHeader>
                <CardContent>
                  {fuelTrendChart.length > 0 ? (
                    <ChartContainer config={fuelChartConfig} className="h-[250px] w-full">
                      <LineChart data={fuelTrendChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="litres" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="cout" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée de carburant</div>
                  )}
                </CardContent>
              </Card>

              {/* Maintenance costs over time */}
              <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base">Coûts de Maintenance dans le Temps</CardTitle>
                    <Button variant="outline" className="border-slate-700 text-slate-300 h-8 text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" />Exporter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {maintenanceCostChart.length > 0 ? (
                    <ChartContainer config={maintChartConfig} className="h-[250px] w-full">
                      <BarChart data={maintenanceCostChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="cout" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">Aucune donnée de maintenance</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
