'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Navigation,
  Clock,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Move,
  Truck,
  Plus,
  ChevronRight,
  Share2,
  Target,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Home,
  Building2,
  Ban,
  History,
  Filter,
  Crosshair,
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
import { Switch } from '@/components/ui/switch'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Types ───────────────────────────────────────────────────
interface ToggleControl {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

interface GeofenceZone {
  id: string
  name: string
  radius: number
  type: 'safe' | 'work' | 'forbidden'
  icon: React.ReactNode
  color: string
  bgColor: string
}

// ─── API Event type (from DB) ───────────────────────────
interface ApiSecurityEvent {
  id: string
  type: string
  event: string
  time: string
  location: string
  status: 'confirmed' | 'resolved' | 'pending'
  severity: string
  color: string
  latitude?: number | null
  longitude?: number | null
  speed?: number | null
}

// ─── Mock Data for controls and zones (kept local) ─────────
const INITIAL_CONTROLS: ToggleControl[] = [
  { id: 'immobilize', label: 'Immobiliser le véhicule', description: 'Bloque le démarrage du moteur à distance', icon: <Lock className="h-5 w-5" />, enabled: false },
  { id: 'alarm', label: 'Mode alarme', description: 'Déclenche une sirène en cas d\'intrusion détectée', icon: <Bell className="h-5 w-5" />, enabled: true },
  { id: 'motion', label: 'Détection mouvement', description: 'Alerte si le véhicule est déplacé sans autorisation', icon: <Move className="h-5 w-5" />, enabled: true },
  { id: 'towing', label: 'Détection remorquage', description: 'Détecte si le véhicule est soulevé ou remorqué', icon: <Truck className="h-5 w-5" />, enabled: false },
]

const ZONES: GeofenceZone[] = [
  { id: 'z1', name: 'Domicile', radius: 200, type: 'safe', icon: <Home className="h-5 w-5" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { id: 'z2', name: 'Bureau', radius: 500, type: 'work', icon: <Building2 className="h-5 w-5" />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { id: 'z3', name: 'Zone interdite', radius: 1000, type: 'forbidden', icon: <Ban className="h-5 w-5" />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
]

// ─── Icon resolver for event types ─────────────────────────
function eventIcon(type: string) {
  switch (type) {
    case 'alarm': return <Bell className="h-4 w-4" />
    case 'motion': case 'movement': return <Move className="h-4 w-4" />
    case 'geofence': case 'geofence_exit': case 'geofence_enter': return <Navigation className="h-4 w-4" />
    case 'towing': case 'tow': return <Truck className="h-4 w-4" />
    case 'immobilize': return <Lock className="h-4 w-4" />
    case 'system': return <ShieldCheck className="h-4 w-4" />
    default: return <Shield className="h-4 w-4" />
  }
}

// ─── Animation wrapper ───────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function SecurityModule() {
  const [controls, setControls] = useState<ToggleControl[]>(INITIAL_CONTROLS)
  const [zones, setZones] = useState<GeofenceZone[]>(ZONES)
  const [events, setEvents] = useState<ApiSecurityEvent[]>([])
  const [showAddZone, setShowAddZone] = useState(false)
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneRadius, setNewZoneRadius] = useState('300')
  const [newZoneType, setNewZoneType] = useState<'safe' | 'work' | 'forbidden'>('safe')
  const [eventFilter, setEventFilter] = useState('all')

  // Fetch events from API on mount
  useEffect(() => {
    fetch('/api/security')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setEvents(res.data)
        }
      })
      .catch(() => { /* keep empty */ })
  }, [])

  const systemActive = controls.every(c => !c.enabled) || controls.some(c => c.id === 'alarm' && c.enabled)

  const toggleControl = (id: string) => {
    const updated = controls.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)
    setControls(updated)
    // POST toggle change to API as an event
    const ctrl = updated.find(c => c.id === id)
    if (ctrl) {
      fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: id,
          severity: ctrl.enabled ? 'info' : 'warning',
        }),
      }).catch(() => {})
    }
  }

  const addZone = () => {
    if (!newZoneName.trim()) return
    const typeConfig = {
      safe: { icon: <Home className="h-5 w-5" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
      work: { icon: <Building2 className="h-5 w-5" />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
      forbidden: { icon: <Ban className="h-5 w-5" />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    }
    const cfg = typeConfig[newZoneType]
    setZones(prev => [
      ...prev,
      {
        id: `z${Date.now()}`,
        name: newZoneName,
        radius: parseInt(newZoneRadius) || 300,
        type: newZoneType,
        ...cfg,
      },
    ])
    setNewZoneName('')
    setNewZoneRadius('300')
    setShowAddZone(false)
  }

  const removeZone = (id: string) => {
    setZones(prev => prev.filter(z => z.id !== id))
  }

  const filteredEvents = eventFilter === 'all'
    ? events
    : events.filter(e => e.type === eventFilter)

  const statusBadge = (status: ApiSecurityEvent['status']) => {
    const map = {
      confirmed: { label: 'Confirmé', cls: 'bg-emerald-500/20 text-emerald-400' },
      resolved: { label: 'Résolu', cls: 'bg-slate-500/20 text-slate-400' },
      pending: { label: 'En attente', cls: 'bg-yellow-500/20 text-yellow-400' },
    }
    const s = map[status]
    return <Badge className={`${s.cls} text-[10px] border-0`} variant="outline">{s.label}</Badge>
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── HERO SECTION ─────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-8 sm:p-12">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Protection Totale</h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg">
                  Sécurité avancée avec localisation GPS, anti-vol intelligent et géo-barrières personnalisées.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span className="text-emerald-400 font-medium text-sm">Sécurisé</span>
                </div>
                <span className="text-slate-500 text-xs">Alarme activée</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── TABS ──────────────────────────────────────────── */}
        <Tabs defaultValue="localisation" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-auto flex flex-wrap gap-1">
            <TabsTrigger value="localisation" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <MapPin className="h-4 w-4" /> Localisation
            </TabsTrigger>
            <TabsTrigger value="antivol" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Anti-Vol
            </TabsTrigger>
            <TabsTrigger value="geofence" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <Target className="h-4 w-4" /> Géo-barrière
            </TabsTrigger>
            <TabsTrigger value="historique" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-1.5">
              <History className="h-4 w-4" /> Historique
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: LOCALISATION ────────────────────────────── */}
          <TabsContent value="localisation">
            <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map placeholder */}
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full h-[400px] sm:h-[500px] bg-slate-800 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                    {/* Visual zone circles */}
                    <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20" />
                    <div className="absolute w-56 h-56 rounded-full border border-emerald-500/10" />
                    <div className="absolute w-80 h-80 rounded-full border border-emerald-500/5" />
                    <Crosshair className="h-12 w-12 text-emerald-500/60 mb-3 relative z-10" />
                    <p className="text-slate-500 text-sm relative z-10">Position du véhicule</p>
                    {/* Pulsing dot */}
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-500">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info panel */}
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      Position actuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-slate-500 text-xs uppercase tracking-wider">Adresse</span>
                      <p className="text-white font-medium mt-1">Quartier Kalaban-Coura</p>
                      <p className="text-slate-400 text-sm">Bamako, Mali</p>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 text-xs">Latitude</span>
                        <p className="text-white text-sm font-mono">12.6392° N</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">Longitude</span>
                        <p className="text-white text-sm font-mono">8.0029° W</p>
                      </div>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        Dernière MAJ
                      </div>
                      <span className="text-white text-sm">14:32:15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Crosshair className="h-3.5 w-3.5" />
                        Précision GPS
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs" variant="outline">± 3 m</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager la position
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── TAB: ANTI-VOL ────────────────────────────────── */}
          <TabsContent value="antivol">
            <motion.div {...fadeUp} className="space-y-6">
              {/* Status card */}
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-6 px-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${systemActive ? 'bg-emerald-500/10' : 'bg-yellow-500/10'}`}>
                        {systemActive ? (
                          <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <ShieldAlert className="h-6 w-6 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Système anti-vol</h3>
                        <p className="text-slate-400 text-sm">
                          {systemActive ? 'Système actif — Surveillance en cours' : 'En veille — Certaines protections sont désactivées'}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${systemActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'} border-0 px-4 py-1.5`} variant="outline">
                      {systemActive ? 'Actif' : 'En veille'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Controls grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {controls.map((control, i) => (
                  <motion.div
                    key={control.id}
                    custom={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Card className={`bg-slate-900 border transition-colors ${control.enabled ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                      <CardContent className="py-5 px-5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2.5 rounded-lg shrink-0 ${control.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                              {control.icon}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-white text-sm font-medium">{control.label}</h4>
                              <p className="text-slate-500 text-xs mt-0.5 truncate">{control.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={control.enabled}
                            onCheckedChange={() => toggleControl(control.id)}
                            className="data-[state=checked]:bg-emerald-600 shrink-0"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Alert history table */}
              <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-emerald-500" />
                    Historique des alertes anti-vol
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400 text-xs">Événement</TableHead>
                          <TableHead className="text-slate-400 text-xs hidden sm:table-cell">Heure</TableHead>
                          <TableHead className="text-slate-400 text-xs hidden md:table-cell">Lieu</TableHead>
                          <TableHead className="text-slate-400 text-xs text-right">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event, i) => (
                          <motion.tr
                            key={event.id}
                            className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                <span className={event.color}>{eventIcon(event.type)}</span>
                                <span className="text-white text-sm">{event.event}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm hidden sm:table-cell font-mono">{event.time}</TableCell>
                            <TableCell className="text-slate-400 text-sm hidden md:table-cell">{event.location}</TableCell>
                            <TableCell className="text-right">{statusBadge(event.status)}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── TAB: GÉO-BARRIÈRE ────────────────────────────── */}
          <TabsContent value="geofence">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Zones géo-barrières</h2>
                  <p className="text-slate-500 text-sm">Gérez vos zones de surveillance</p>
                </div>
                <Dialog open={showAddZone} onOpenChange={setShowAddZone}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter une zone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Nouvelle zone géo-barrière</DialogTitle>
                      <DialogDescription className="text-slate-400">Définissez une nouvelle zone de surveillance</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Nom de la zone</Label>
                        <Input
                          value={newZoneName}
                          onChange={e => setNewZoneName(e.target.value)}
                          placeholder="Ex: École"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Rayon (mètres)</Label>
                        <Input
                          value={newZoneRadius}
                          onChange={e => setNewZoneRadius(e.target.value)}
                          type="number"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Type de zone</Label>
                        <Select value={newZoneType} onValueChange={(v: string) => setNewZoneType(v as 'safe' | 'work' | 'forbidden')}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="safe" className="text-slate-200">Zone sûre</SelectItem>
                            <SelectItem value="work" className="text-slate-200">Zone de travail</SelectItem>
                            <SelectItem value="forbidden" className="text-slate-200">Zone interdite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowAddZone(false)} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                          Annuler
                        </Button>
                        <Button onClick={addZone} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                          Créer la zone
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Visual representation + zone list */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual map placeholder */}
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full h-[350px] bg-slate-800 flex flex-col items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06),transparent_70%)]" />
                      {/* Zone circles */}
                      <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center">
                        <span className="text-emerald-400 text-[10px] font-medium">Domicile</span>
                      </div>
                      <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                        <span className="text-blue-400 text-[10px] font-medium">Bureau</span>
                      </div>
                      <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-[10px] font-medium">Zone interdite</span>
                      </div>
                      <div className="absolute w-3 h-3 rounded-full bg-emerald-500">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
                      </div>
                      <p className="text-slate-600 text-xs mt-44 relative z-10">Vue schématique des zones</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Zone list */}
                <div className="space-y-3">
                  {zones.map((zone, i) => (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardContent className="py-4 px-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-lg ${zone.bgColor} ${zone.color}`}>
                                {zone.icon}
                              </div>
                              <div>
                                <h4 className="text-white text-sm font-medium">{zone.name}</h4>
                                <p className="text-slate-500 text-xs mt-0.5">Rayon: {zone.radius}m</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`border-0 text-[10px] ${
                                  zone.type === 'safe' ? 'bg-emerald-500/20 text-emerald-400' :
                                  zone.type === 'work' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}
                                variant="outline"
                              >
                                {zone.type === 'safe' ? 'Sûre' : zone.type === 'work' ? 'Travail' : 'Interdite'}
                              </Badge>
                              <button
                                onClick={() => removeZone(zone.id)}
                                className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                aria-label="Supprimer la zone"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── TAB: HISTORIQUE ──────────────────────────────── */}
          <TabsContent value="historique">
            <motion.div {...fadeUp} className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historique de sécurité</h2>
                  <p className="text-slate-500 text-sm">Timeline complète des événements</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-40 bg-slate-900 border-slate-800 text-slate-300">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrer" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="all" className="text-slate-200">Tous les types</SelectItem>
                      <SelectItem value="alarm" className="text-slate-200">Alarme</SelectItem>
                      <SelectItem value="motion" className="text-slate-200">Mouvement</SelectItem>
                      <SelectItem value="geofence" className="text-slate-200">Géo-barrière</SelectItem>
                      <SelectItem value="towing" className="text-slate-200">Remorquage</SelectItem>
                      <SelectItem value="system" className="text-slate-200">Système</SelectItem>
                      <SelectItem value="immobilize" className="text-slate-200">Immobilisation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timeline */}
              <div className="max-h-[600px] overflow-y-auto space-y-0 relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-800" />

                {filteredEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative flex gap-4 pb-6 pl-0"
                  >
                    {/* Dot on timeline */}
                    <div className="relative z-10 mt-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        event.status === 'confirmed' ? 'bg-emerald-500/10' :
                        event.status === 'resolved' ? 'bg-slate-800' :
                        'bg-yellow-500/10'
                      }`}>
                        <span className={event.color}>{eventIcon(event.type)}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <Card className="flex-1 bg-slate-900 border-slate-800">
                      <CardContent className="py-3.5 px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-white text-sm font-medium">{event.event}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-slate-500 text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {event.time}
                              </span>
                              {event.location !== '—' && (
                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {statusBadge(event.status)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Aucun événement trouvé pour ce filtre</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
