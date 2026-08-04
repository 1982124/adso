'use client'

import { useState, useEffect } from 'react'
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

// ─── Demo Data ───────────────────────────────────────────────
const demoVehicles: Vehicle[] = [
  { id: 'v1', make: 'Renault', model: 'Kangoo E-Tech', year: 2024, type: 'car', fuelType: 'electric', licensePlate: 'AB-123-CD', mileage: 15200, status: 'active', assignedDriverId: 'd1', fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 3, fuelRecords: 12 } },
  { id: 'v2', make: 'Peugeot', model: 'Expert', year: 2023, type: 'car', fuelType: 'diesel', licensePlate: 'EF-456-GH', mileage: 45800, status: 'active', assignedDriverId: 'd2', fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 7, fuelRecords: 34 } },
  { id: 'v3', make: 'Citroën', model: 'ë-Jumpy', year: 2024, type: 'car', fuelType: 'electric', licensePlate: 'IJ-789-KL', mileage: 8900, status: 'maintenance', assignedDriverId: null, fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 2, fuelRecords: 8 } },
  { id: 'v4', make: 'Dacia', model: 'Spring', year: 2023, type: 'car', fuelType: 'electric', licensePlate: 'MN-012-OP', mileage: 22100, status: 'active', assignedDriverId: 'd3', fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 5, fuelRecords: 18 } },
  { id: 'v5', make: 'Mercedes', model: 'Sprinter', year: 2022, type: 'truck', fuelType: 'diesel', licensePlate: 'QR-345-ST', mileage: 87500, status: 'out_of_service', assignedDriverId: null, fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 12, fuelRecords: 56 } },
  { id: 'v6', make: 'Renault', model: 'Master E-Tech', year: 2024, type: 'truck', fuelType: 'electric', licensePlate: 'UV-678-WX', mileage: 5300, status: 'active', assignedDriverId: 'd4', fleet: { name: 'Flotte ADSO' }, _count: { maintenanceRecords: 1, fuelRecords: 4 } },
]

const demoDrivers = [
  { id: 'd1', name: 'Jean Dupont', licenseType: 'B', drivingScore: 92, totalTrips: 342, totalDistance: 12450, licenseExpiry: '2027-03-15', status: 'active' },
  { id: 'd2', name: 'Marie Martin', licenseType: 'B, BE', drivingScore: 88, totalTrips: 287, totalDistance: 9820, licenseExpiry: '2026-08-22', status: 'active' },
  { id: 'd3', name: 'Pierre Bernard', licenseType: 'B', drivingScore: 76, totalTrips: 156, totalDistance: 5430, licenseExpiry: '2026-01-10', status: 'active' },
  { id: 'd4', name: 'Sophie Laurent', licenseType: 'C', drivingScore: 94, totalTrips: 410, totalDistance: 18200, licenseExpiry: '2028-06-30', status: 'active' },
  { id: 'd5', name: 'Luc Moreau', licenseType: 'B', drivingScore: 65, totalTrips: 89, totalDistance: 3200, licenseExpiry: '2025-12-01', status: 'suspended' },
]

const demoMaintenance: MaintenanceRecord[] = [
  { id: 'm1', type: 'routine', description: 'Vidange huile moteur + filtres', cost: 185, performedAt: '2025-06-15', nextDueDate: '2025-12-15', nextDueMileage: 30000, status: 'completed', vehicle: { id: 'v1', make: 'Renault', model: 'Kangoo', licensePlate: 'AB-123-CD' } },
  { id: 'm2', type: 'tire', description: 'Rotation pneus + vérification usure', cost: 60, performedAt: '2025-07-01', nextDueDate: '2025-10-01', nextDueMileage: 20000, status: 'completed', vehicle: { id: 'v2', make: 'Peugeot', model: 'Expert', licensePlate: 'EF-456-GH' } },
  { id: 'm3', type: 'brake', description: 'Remplacement plaquettes de frein avant', cost: 320, performedAt: null, nextDueDate: '2025-07-20', nextDueMileage: null, status: 'overdue', vehicle: { id: 'v3', make: 'Citroën', model: 'ë-Jumpy', licensePlate: 'IJ-789-KL' } },
  { id: 'm4', type: 'inspection', description: 'Contrôle technique annuel', cost: 95, performedAt: null, nextDueDate: '2025-08-15', nextDueMileage: null, status: 'scheduled', vehicle: { id: 'v4', make: 'Dacia', model: 'Spring', licensePlate: 'MN-012-OP' } },
  { id: 'm5', type: 'battery', description: 'Remplacement batterie 12V', cost: 210, performedAt: null, nextDueDate: '2025-07-25', nextDueMileage: null, status: 'in_progress', vehicle: { id: 'v5', make: 'Mercedes', model: 'Sprinter', licensePlate: 'QR-345-ST' } },
  { id: 'm6', type: 'routine', description: 'Révision 30 000 km complète', cost: 450, performedAt: '2025-05-10', nextDueDate: '2025-11-10', nextDueMileage: 60000, status: 'completed', vehicle: { id: 'v2', make: 'Peugeot', model: 'Expert', licensePlate: 'EF-456-GH' } },
]

const demoFuel: FuelRecord[] = [
  { id: 'f1', fuelType: 'electric', quantity: 45, costPerLiter: 0.18, totalCost: 8.1, odometer: 15200, fuelingDate: '2025-07-10', stationName: 'Ionity Paris', location: 'Paris', vehicle: { id: 'v1', make: 'Renault', model: 'Kangoo', licensePlate: 'AB-123-CD' } },
  { id: 'f2', fuelType: 'diesel', quantity: 55, costPerLiter: 1.75, totalCost: 96.25, odometer: 45800, fuelingDate: '2025-07-08', stationName: 'TotalEnergies', location: 'Lyon', vehicle: { id: 'v2', make: 'Peugeot', model: 'Expert', licensePlate: 'EF-456-GH' } },
  { id: 'f3', fuelType: 'electric', quantity: 38, costPerLiter: 0.15, totalCost: 5.7, odometer: 8900, fuelingDate: '2025-07-05', stationName: 'Tesla SC', location: 'Marseille', vehicle: { id: 'v3', make: 'Citroën', model: 'ë-Jumpy', licensePlate: 'IJ-789-KL' } },
  { id: 'f4', fuelType: 'diesel', quantity: 70, costPerLiter: 1.72, totalCost: 120.4, odometer: 87500, fuelingDate: '2025-07-03', stationName: 'BP', location: 'Toulouse', vehicle: { id: 'v5', make: 'Mercedes', model: 'Sprinter', licensePlate: 'QR-345-ST' } },
  { id: 'f5', fuelType: 'electric', quantity: 52, costPerLiter: 0.16, totalCost: 8.32, odometer: 5300, fuelingDate: '2025-07-01', stationName: 'Ionity Bordeaux', location: 'Bordeaux', vehicle: { id: 'v6', make: 'Renault', model: 'Master', licensePlate: 'UV-678-WX' } },
  { id: 'f6', fuelType: 'diesel', quantity: 48, costPerLiter: 1.78, totalCost: 85.44, odometer: 45200, fuelingDate: '2025-06-28', stationName: 'Shell', location: 'Nice', vehicle: { id: 'v2', make: 'Peugeot', model: 'Expert', licensePlate: 'EF-456-GH' } },
]

const costPerVehicleChart = [
  { vehicle: 'Kangoo', cout: 1250 },
  { vehicle: 'Expert', cout: 3420 },
  { vehicle: 'ë-Jumpy', cout: 890 },
  { vehicle: 'Spring', cout: 650 },
  { vehicle: 'Sprinter', cout: 5800 },
  { vehicle: 'Master', cout: 420 },
]

const fuelTrendChart = [
  { mois: 'Jan', litres: 280, cout: 485 },
  { mois: 'Fév', litres: 310, cout: 520 },
  { mois: 'Mar', litres: 290, cout: 495 },
  { mois: 'Avr', litres: 340, cout: 560 },
  { mois: 'Mai', litres: 320, cout: 530 },
  { mois: 'Jun', litres: 350, cout: 575 },
  { mois: 'Jul', litres: 305, cout: 505 },
]

const maintenanceCostChart = [
  { mois: 'Jan', cout: 850 },
  { mois: 'Fév', cout: 1200 },
  { mois: 'Mar', cout: 650 },
  { mois: 'Avr', cout: 2100 },
  { mois: 'Mai', cout: 980 },
  { mois: 'Jun', cout: 1500 },
  { mois: 'Jul', cout: 735 },
]

const statusData = [
  { name: 'Actif', value: 4, color: '#10b981' },
  { name: 'Maintenance', value: 1, color: '#f59e0b' },
  { name: 'Hors service', value: 1, color: '#ef4444' },
  { name: 'Réformé', value: 0, color: '#6b7280' },
]

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

// ─── Component ───────────────────────────────────────────────
export default function FleetModule() {
  const [vehicles] = useState<Vehicle[]>(demoVehicles)
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [fuelDialogOpen, setFuelDialogOpen] = useState(false)

  const filteredVehicles = vehicles.filter(
    (v) =>
      `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = vehicles.filter((v) => v.status === 'active').length
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length
  const totalMileage = vehicles.reduce((s, v) => s + v.mileage, 0)
  const totalCosts = 12410
  const recentActivity = [
    { id: 1, text: 'Vidange complétée - Renault Kangoo AB-123-CD', time: 'Il y a 2h', icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
    { id: 2, text: 'Plaquettes freins en retard - Citroën ë-Jumpy', time: 'Il y a 4h', icon: <AlertTriangle className="h-4 w-4 text-red-400" /> },
    { id: 3, text: 'Ravitaillement - Peugeot Expert EF-456-GH', time: 'Il y a 6h', icon: <Fuel className="h-4 w-4 text-cyan-400" /> },
    { id: 4, text: 'Contrôle technique planifié - Dacia Spring', time: 'Il y a 8h', icon: <Calendar className="h-4 w-4 text-blue-400" /> },
    { id: 5, text: 'Sprinter QR-345-ST mis hors service', time: 'Il y a 1j', icon: <XCircle className="h-4 w-4 text-red-400" /> },
  ]

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

          {/* ═══ TAB 1: Dashboard ═══ */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Véhicules', value: vehicles.length, icon: <Car className="h-5 w-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Conducteurs Actifs', value: demoDrivers.filter(d => d.status === 'active').length, icon: <Users className="h-5 w-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { label: 'Maintenance en attente', value: maintenanceCount + demoMaintenance.filter(m => m.status === 'scheduled' || m.status === 'overdue').length, icon: <Wrench className="h-5 w-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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
                    <span className="text-emerald-400 font-medium">{activeCount}/{vehicles.length}</span>
                  </div>
                  <Progress value={(activeCount / vehicles.length) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Kilométrage moyen</span>
                    <span className="text-cyan-400 font-medium">{(totalMileage / vehicles.length).toLocaleString('fr-FR')} km</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Score moyen conducteurs</span>
                    <span className="text-amber-400 font-medium">{(demoDrivers.reduce((s, d) => s + d.drivingScore, 0) / demoDrivers.length).toFixed(0)}/100</span>
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
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Status Pie */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Statut des Véhicules</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Activité Récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {recentActivity.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="mt-0.5">{a.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 truncate">{a.text}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                        <Input placeholder="Ex: Renault" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Modèle</Label>
                        <Input placeholder="Ex: Kangoo" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input type="number" placeholder="2024" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Immatriculation</Label>
                        <Input placeholder="AB-123-CD" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de carburant</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                          <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setVehicleDialogOpen(false)}>Ajouter</Button>
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
                      {filteredVehicles.map((v) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 3: Drivers ═══ */}
          <TabsContent value="drivers" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {demoDrivers.map((d) => {
                const scoreColor = d.drivingScore >= 85 ? 'text-emerald-400' : d.drivingScore >= 70 ? 'text-amber-400' : 'text-red-400'
                const expiryDate = new Date(d.licenseExpiry)
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isExpiringSoon = daysUntilExpiry < 90
                return (
                  <Card key={d.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.licenseType}</p>
                        </div>
                        <Badge variant="outline" className={statusColors[d.status]}>
                          {statusLabels[d.status]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Score conduite</span>
                          <span className={`font-bold ${scoreColor}`}>{d.drivingScore}/100</span>
                        </div>
                        <Progress value={d.drivingScore} className="h-1.5" />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-center p-2 rounded bg-slate-800/50">
                            <p className="text-xs text-slate-500">Trajets</p>
                            <p className="text-sm font-medium text-white">{d.totalTrips}</p>
                          </div>
                          <div className="text-center p-2 rounded bg-slate-800/50">
                            <p className="text-xs text-slate-500">Distance</p>
                            <p className="text-sm font-medium text-white">{(d.totalDistance / 1000).toFixed(1)}k km</p>
                          </div>
                        </div>
                        {isExpiringSoon && (
                          <div className="flex items-center gap-2 mt-2 p-2 rounded bg-red-500/10">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                            <span className="text-xs text-red-400">Permis expire dans {daysUntilExpiry}j</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* ═══ TAB 4: Maintenance ═══ */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />{demoMaintenance.filter(m => m.status === 'overdue').length} En retard
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <Clock className="h-3 w-3 mr-1" />{demoMaintenance.filter(m => m.status === 'scheduled').length} Planifiés
                </Badge>
              </div>
              <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                          <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(maintenanceTypeLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Coût estimé (€)</Label>
                        <Input type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Description de l'intervention" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date prévue</Label>
                        <Input type="date" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Prochain kilométrage</Label>
                        <Input type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setMaintenanceDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setMaintenanceDialogOpen(false)}>Planifier</Button>
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
                      {demoMaintenance.map((m) => (
                        <TableRow key={m.id} className={`border-slate-800 hover:bg-slate-800/50 ${m.status === 'overdue' ? 'bg-red-500/5' : ''}`}>
                          <TableCell className="text-white text-sm">{m.vehicle.make} {m.vehicle.model} <span className="text-slate-500 font-mono">({m.vehicle.licensePlate})</span></TableCell>
                          <TableCell><Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{maintenanceTypeLabels[m.type]}</Badge></TableCell>
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
                      ))}
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
                      <p className="text-xl font-bold text-white">{demoFuel.reduce((s, f) => s + (f.totalCost ?? 0), 0).toFixed(2)} €</p>
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
                      <p className="text-xl font-bold text-white">{demoFuel.reduce((s, f) => s + f.quantity, 0)} L</p>
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
                      <p className="text-xl font-bold text-white">{(demoFuel.filter(f => f.costPerLiter).reduce((s, f) => s + (f.costPerLiter ?? 0), 0) / demoFuel.filter(f => f.costPerLiter).length).toFixed(2)} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Dialog open={fuelDialogOpen} onOpenChange={setFuelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                        <Input type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Coût total (€)</Label>
                        <Input type="number" step="0.01" placeholder="0.00" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Station</Label>
                        <Input placeholder="Nom de la station" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Kilométrage</Label>
                        <Input type="number" placeholder="0" className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setFuelDialogOpen(false)}>Annuler</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setFuelDialogOpen(false)}>Enregistrer</Button>
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
                      {demoFuel.map((f) => (
                        <TableRow key={f.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-white text-sm">{f.vehicle.make} {f.vehicle.model} <span className="text-slate-500 font-mono">({f.vehicle.licensePlate})</span></TableCell>
                          <TableCell className="text-slate-300 text-sm">{new Date(f.fuelingDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-slate-300">{f.quantity} L</TableCell>
                          <TableCell className="text-slate-300">{f.totalCost?.toFixed(2)} €</TableCell>
                          <TableCell className="text-slate-300 text-sm">{f.stationName ?? '—'}</TableCell>
                        </TableRow>
                      ))}
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
                { label: 'Coût/véhicule/mois', value: '2 068 €', trend: <TrendingDown className="h-4 w-4 text-emerald-400" />, trendText: '-12%', trendColor: 'text-emerald-400' },
                { label: 'Conso. moyenne', value: '6.8 L/100km', trend: <TrendingDown className="h-4 w-4 text-emerald-400" />, trendText: '-5%', trendColor: 'text-emerald-400' },
                { label: 'Coûts maintenance', value: '8 015 €', trend: <TrendingUp className="h-4 w-4 text-red-400" />, trendText: '+8%', trendColor: 'text-red-400' },
                { label: 'Disponibilité flotte', value: '67%', trend: <TrendingDown className="h-4 w-4 text-red-400" />, trendText: '-15%', trendColor: 'text-red-400' },
              ].map((kpi) => (
                <Card key={kpi.label} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-400">{kpi.label}</p>
                    <div className="flex items-end gap-2 mt-1">
                      <p className="text-2xl font-bold text-white">{kpi.value}</p>
                      <span className={`flex items-center text-sm ${kpi.trendColor}`}>{kpi.trend} {kpi.trendText}</span>
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
                  <ChartContainer config={costChartConfig} className="h-[250px] w-full">
                    <BarChart data={costPerVehicleChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="vehicle" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cout" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Fuel trends */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Tendances Carburant</CardTitle>
                </CardHeader>
                <CardContent>
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
                  <ChartContainer config={maintChartConfig} className="h-[250px] w-full">
                    <BarChart data={maintenanceCostChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cout" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
