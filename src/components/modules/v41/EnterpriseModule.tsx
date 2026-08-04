'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  Shield,
  Settings,
  Flag,
  Lock,
  Eye,
  Download,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Key,
  Bell,
  Globe,
  FileText,
  Mail,
  ShieldCheck,
  Activity,
  ChevronRight,
  UserCog,
  ClipboardList,
  Server,
  Database,
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
import { Switch } from '@/components/ui/switch'
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
import { Skeleton } from '@/components/ui/skeleton'

// ─── Types ───────────────────────────────────────────────────
interface OrgMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinedAt: string
  lastActive: string
}

interface AuditLog {
  id: string
  timestamp: string
  userName: string
  action: string
  resource: string
  resourceId: string | null
  status: string
  details: string | null
  ipAddress: string | null
}

interface FeatureFlag {
  id: string
  name: string
  description: string
  key: string
  enabled: boolean
  targetAudience: string[]
  category: string
  createdAt: string
}

interface OrgInfo {
  id: string
  name: string
  plan: string
  country: string
  maxVehicles: number
  maxDrivers: number
  createdAt: string
  _count: { vehicles: number; drivers: number }
}

// ─── Static lookups ──────────────────────────────────────────
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  enterprise_admin: 'Admin Entreprise',
  school_admin: 'Admin École',
  instructor: 'Instructeur',
  student: 'Étudiant',
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  enterprise_admin: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  school_admin: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  instructor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  student: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const actionLabels: Record<string, string> = {
  login: 'Connexion', logout: 'Déconnexion', create: 'Création', read: 'Lecture',
  update: 'Modification', delete: 'Suppression', export: 'Export',
  import: 'Import', configure: 'Configuration', approve: 'Approbation', reject: 'Rejet',
}

const resourceLabels: Record<string, string> = {
  user: 'Utilisateur', vehicle: 'Véhicule', fleet: 'Flotte', policy: 'Police',
  claim: 'Sinistre', listing: 'Annonce', course: 'Cours', exam: 'Examen',
  organization: 'Organisation', feature_flag: 'Feature Flag',
}

const gdprChecklist = [
  { id: 1, item: 'Registre des traitements de données', completed: true },
  { id: 2, item: 'Politique de confidentialité mise à jour', completed: true },
  { id: 3, item: 'Consentement explicite des utilisateurs', completed: true },
  { id: 4, item: "Droit à l'oubli implémenté", completed: true },
  { id: 5, item: 'Portabilité des données', completed: true },
  { id: 6, item: 'Délégué à la protection des données (DPO) nommé', completed: false },
  { id: 7, item: "Analyse d'impact (AIPD) pour les traitements à risque", completed: false },
  { id: 8, item: 'Procédure de notification de violation de données', completed: true },
]

const owaspChecks = [
  { id: 1, item: 'Injection SQL', status: 'pass' },
  { id: 2, item: 'Authentification cassée', status: 'pass' },
  { id: 3, item: 'Données sensibles exposées', status: 'pass' },
  { id: 4, item: 'Contrôle d\'accès défaillant', status: 'pass' },
  { id: 5, item: 'Mauvaise configuration', status: 'warn' },
  { id: 6, item: 'Composants vulnérables', status: 'pass' },
  { id: 7, item: 'Authentification et session', status: 'pass' },
  { id: 8, item: 'Contrôle d\'accès API', status: 'pass' },
  { id: 9, item: 'Journalisation et monitoring', status: 'warn' },
  { id: 10, item: 'Redirection non validée', status: 'pass' },
]

const iso27001Checks = [
  { id: 1, item: 'Politique de sécurité de l\'information', completed: true },
  { id: 2, item: 'Gestion des actifs', completed: true },
  { id: 3, item: 'Contrôle d\'accès logique', completed: true },
  { id: 4, item: 'Cryptographie', completed: true },
  { id: 5, item: 'Sécurité physique', completed: false },
  { id: 6, item: 'Sécurité des opérations', completed: true },
  { id: 7, item: 'Gestion des incidents', completed: true },
  { id: 8, item: 'Gestion de la continuité', completed: false },
  { id: 9, item: 'Conformité réglementaire', completed: true },
  { id: 10, item: 'Revue de sécurité interne', completed: false },
]

// ─── Component ───────────────────────────────────────────────
export default function EnterpriseModule() {
  const [organizations, setOrganizations] = useState<OrgInfo[]>([])
  const [members, setMembers] = useState<OrgMember[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [auditDetailOpen, setAuditDetailOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [oRes, aRes, fRes] = await Promise.all([
        fetch('/api/enterprise/organizations'),
        fetch('/api/enterprise/audit-logs'),
        fetch('/api/enterprise/feature-flags'),
      ])
      const oData = await oRes.json()
      const aData = await aRes.json()
      const fData = await fRes.json()

      if (oData.success) {
        setOrganizations(oData.data)
        // Simulate members from organizations + _count
        const simulatedMembers: OrgMember[] = []
        const roles = ['super_admin', 'enterprise_admin', 'school_admin', 'instructor', 'student']
        oData.data.forEach((org: OrgInfo & { _count: { vehicles: number; drivers: number } }, idx: number) => {
          simulatedMembers.push({
            id: `org-${org.id}`,
            name: org.name,
            email: `${org.name.toLowerCase().replace(/\s+/g, '.')}@adso.fr`,
            role: roles[Math.min(idx, roles.length - 1)],
            status: 'active',
            joinedAt: org.createdAt,
            lastActive: org.createdAt,
          })
        })
        setMembers(simulatedMembers)
      }
      if (aData.success) {
        setAuditLogs(aData.data.map((log: { id: string; createdAt: string; action: string; resource: string; resourceId: string | null; status: string; details: string | null; ipAddress: string | null; user: { name: string; email: string } }) => ({
          id: log.id,
          timestamp: log.createdAt,
          userName: log.user?.name ?? 'Système',
          action: log.action,
          resource: log.resource,
          resourceId: log.resourceId,
          status: log.status,
          details: log.details,
          ipAddress: log.ipAddress,
        })))
      }
      if (fData.success) setFeatureFlags(fData.data)
    } catch (e) {
      console.error('Erreur chargement données entreprise:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filteredLogs = auditLogs.filter((l) => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false
    if (resourceFilter !== 'all' && l.resource !== resourceFilter) return false
    if (searchQuery && !l.userName.toLowerCase().includes(searchQuery.toLowerCase()) && !l.resource.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFlag = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/enterprise/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId: id, enabled }),
      })
      const data = await res.json()
      if (data.success) {
        setFeatureFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled } : f)))
      }
    } catch (e) {
      console.error('Erreur mise à jour feature flag:', e)
    }
  }

  const orgInfo = organizations[0]
  const roleDistribution = Object.entries(
    members.reduce((acc, m) => { acc[m.role] = (acc[m.role] || 0) + 1; return acc }, {} as Record<string, number>)
  )

  const gdprProgress = Math.round((gdprChecklist.filter(c => c.completed).length / gdprChecklist.length) * 100)
  const isoProgress = Math.round((iso27001Checks.filter(c => c.completed).length / iso27001Checks.length) * 100)
  const owaspPass = owaspChecks.filter(c => c.status === 'pass').length
  const owaspTotal = owaspChecks.length

  // ─── Skeleton helper ───────────────────────────────────────
  const SkeletonCard = () => (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-32 mb-2 bg-slate-800" />
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
              <Building2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Plateforme Entreprise</h1>
              <p className="text-sm text-slate-400">ADSO V4.1 — Gestion Organisationnelle</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="organization" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="organization" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Building2 className="h-4 w-4 mr-2" />Organisation
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <ClipboardList className="h-4 w-4 mr-2" />Journaux d'Audit
              </TabsTrigger>
              <TabsTrigger value="flags" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Flag className="h-4 w-4 mr-2" />Feature Flags
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />Sécurité
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />Paramètres
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" className="border-slate-700 text-slate-300" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />Actualiser
            </Button>
          </div>

          {/* ═══ TAB 1: Organization ═══ */}
          <TabsContent value="organization" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : (
              <>
                {/* Org Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Informations de l'Organisation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {orgInfo ? [
                          { label: 'Nom', value: orgInfo.name },
                          { label: 'Plan', value: orgInfo.plan.charAt(0).toUpperCase() + orgInfo.plan.slice(1) },
                          { label: 'Pays', value: '🇫🇷 France' },
                          { label: 'Membres', value: `${orgInfo._count.drivers} / ${orgInfo.maxDrivers}` },
                          { label: 'Créée le', value: new Date(orgInfo.createdAt).toLocaleDateString('fr-FR') },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">{item.label}</span>
                            <span className="text-sm text-white font-medium">{item.value}</span>
                          </div>
                        )) : [
                          { label: 'Nom', value: 'Aucune organisation' },
                          { label: 'Plan', value: '—' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">{item.label}</span>
                            <span className="text-sm text-white font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="bg-slate-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Statut</span>
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />Actif
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* RBAC Role Management */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Gestion des Rôles (RBAC)</CardTitle>
                      <CardDescription className="text-slate-500 text-xs">Hiérarchie des permissions par rôle</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(roleLabels).map(([key, label]) => {
                        const count = members.filter(m => m.role === key).length
                        return (
                          <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={roleColors[key]}>{label}</Badge>
                            </div>
                            <span className="text-sm text-slate-400">{count} membre{count > 1 ? 's' : ''}</span>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-base">Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Organisations</span>
                          <span className="text-sm text-emerald-400 font-medium">{organizations.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Actions auditées</span>
                          <span className="text-sm text-cyan-400 font-medium">{auditLogs.length.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Véhicules totaux</span>
                          <span className="text-sm text-amber-400 font-medium">{organizations.reduce((s, o) => s + o._count.vehicles, 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Conducteurs totaux</span>
                          <span className="text-sm text-emerald-400 font-medium">{organizations.reduce((s, o) => s + o._count.drivers, 0)}</span>
                        </div>
                        <Separator className="bg-slate-800" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Alertes sécurité</span>
                          <span className="text-sm text-red-400 font-medium">{auditLogs.filter(l => l.status === 'denied').length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Member List */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle className="text-white text-base">Membres de l'Organisation</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-800 border-slate-700 text-white w-52"
                          />
                        </div>
                        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9">
                              <Plus className="h-4 w-4 mr-1" />Inviter
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Inviter un membre</DialogTitle>
                              <DialogDescription className="text-slate-400">Envoyez une invitation par email</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="email@exemple.fr" className="bg-slate-800 border-slate-700" />
                              </div>
                              <div className="space-y-2">
                                <Label>Rôle</Label>
                                <Select>
                                  <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(roleLabels).map(([k, v]) => (
                                      <SelectItem key={k} value={k}>{v}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setInviteDialogOpen(false)}>Annuler</Button>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setInviteDialogOpen(false)}>Inviter</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800 hover:bg-slate-800/50">
                            <TableHead className="text-slate-400">Membre</TableHead>
                            <TableHead className="text-slate-400">Rôle</TableHead>
                            <TableHead className="text-slate-400">Statut</TableHead>
                            <TableHead className="text-slate-400">Dernière activité</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMembers.length > 0 ? filteredMembers.map((m) => (
                            <TableRow key={m.id} className="border-slate-800 hover:bg-slate-800/50">
                              <TableCell>
                                <div>
                                  <p className="text-white text-sm font-medium">{m.name}</p>
                                  <p className="text-xs text-slate-500">{m.email}</p>
                                </div>
                              </TableCell>
                              <TableCell><Badge variant="outline" className={roleColors[m.role] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>{roleLabels[m.role] ?? m.role}</Badge></TableCell>
                              <TableCell>
                                <Badge variant="outline" className={m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                                  {m.status === 'active' ? 'Actif' : 'Inactif'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-400 text-sm">{new Date(m.lastActive).toLocaleDateString('fr-FR')}</TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-slate-500 py-8">Aucun membre trouvé</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ═══ TAB 2: Audit Logs ═══ */}
          <TabsContent value="audit" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-slate-900 border-slate-800 text-white w-48" />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-40"><SelectValue placeholder="Action" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    {Object.entries(actionLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={resourceFilter} onValueChange={setResourceFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-40"><SelectValue placeholder="Ressource" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {Object.entries(resourceLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="border-slate-700 text-slate-300 h-9">
                <Download className="h-4 w-4 mr-1" />Exporter
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">Horodatage</TableHead>
                        <TableHead className="text-slate-400">Utilisateur</TableHead>
                        <TableHead className="text-slate-400">Action</TableHead>
                        <TableHead className="text-slate-400">Ressource</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                        <TableHead className="text-slate-400">Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800">
                          <TableCell><Skeleton className="h-4 w-24 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-8 bg-slate-800" /></TableCell>
                        </TableRow>
                      )) : filteredLogs.length > 0 ? filteredLogs.map((l) => (
                        <TableRow key={l.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer" onClick={() => { setSelectedLog(l); setAuditDetailOpen(true) }}>
                          <TableCell className="text-slate-400 text-xs font-mono whitespace-nowrap">{new Date(l.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</TableCell>
                          <TableCell className="text-white text-sm whitespace-nowrap">{l.userName}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-xs">{actionLabels[l.action] ?? l.action}</Badge></TableCell>
                          <TableCell className="text-slate-300 text-sm">{resourceLabels[l.resource] ?? l.resource}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={l.status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {l.status === 'success' ? <><CheckCircle2 className="h-3 w-3 mr-1" />OK</> : <><XCircle className="h-3 w-3 mr-1" />Refusé</>}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" className="h-7 text-slate-400 hover:text-white p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-slate-500 py-8">Aucun journal d'audit trouvé</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Audit Detail Dialog */}
            <Dialog open={auditDetailOpen} onOpenChange={setAuditDetailOpen}>
              <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle>Détails du Journal</DialogTitle>
                  <DialogDescription className="text-slate-400">Entrée d'audit complète</DialogDescription>
                </DialogHeader>
                {selectedLog && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><p className="text-xs text-slate-500">Horodatage</p><p className="text-sm text-white">{new Date(selectedLog.timestamp).toLocaleString('fr-FR')}</p></div>
                      <div className="space-y-1"><p className="text-xs text-slate-500">Utilisateur</p><p className="text-sm text-white">{selectedLog.userName}</p></div>
                      <div className="space-y-1"><p className="text-xs text-slate-500">Action</p><p className="text-sm text-white">{actionLabels[selectedLog.action] ?? selectedLog.action}</p></div>
                      <div className="space-y-1"><p className="text-xs text-slate-500">Ressource</p><p className="text-sm text-white">{resourceLabels[selectedLog.resource] ?? selectedLog.resource}</p></div>
                      <div className="space-y-1"><p className="text-xs text-slate-500">ID Ressource</p><p className="text-sm text-white font-mono">{selectedLog.resourceId ?? '—'}</p></div>
                      <div className="space-y-1"><p className="text-xs text-slate-500">Adresse IP</p><p className="text-sm text-white font-mono">{selectedLog.ipAddress ?? '—'}</p></div>
                    </div>
                    {selectedLog.details && (
                      <div className="space-y-1 mt-2">
                        <p className="text-xs text-slate-500">Détails</p>
                        <pre className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg overflow-x-auto">{(() => { try { return JSON.stringify(JSON.parse(selectedLog.details), null, 2) } catch { return selectedLog.details } })()}</pre>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setAuditDetailOpen(false)}>Fermer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ═══ TAB 3: Feature Flags ═══ */}
          <TabsContent value="flags" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10"><Flag className="h-5 w-5 text-emerald-400" /></div>
                    <div><p className="text-sm text-slate-400">Flags activés</p><p className="text-xl font-bold text-white">{featureFlags.filter(f => f.enabled).length}/{featureFlags.length}</p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10"><Server className="h-5 w-5 text-cyan-400" /></div>
                    <div><p className="text-sm text-slate-400">Catégories</p><p className="text-xl font-bold text-white">{new Set(featureFlags.map(f => f.category)).size}</p></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10"><Users className="h-5 w-5 text-amber-400" /></div>
                    <div><p className="text-sm text-slate-400">Audiences ciblées</p><p className="text-xl font-bold text-white">{new Set(featureFlags.flatMap(f => f.targetAudience)).size}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">Feature Flag</TableHead>
                        <TableHead className="text-slate-400">Description</TableHead>
                        <TableHead className="text-slate-400">Catégorie</TableHead>
                        <TableHead className="text-slate-400">Audience</TableHead>
                        <TableHead className="text-slate-400">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featureFlags.map((f) => (
                        <TableRow key={f.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={f.enabled}
                                onCheckedChange={(checked) => toggleFlag(f.id, checked)}
                                className="data-[state=checked]:bg-emerald-600"
                              />
                              <span className={`text-sm font-medium ${f.enabled ? 'text-white' : 'text-slate-500'}`}>{f.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm max-w-[250px] truncate">{f.description}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-xs">{f.category}</Badge></TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {f.targetAudience.map((a) => (
                                <Badge key={a} variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">{a}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={f.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {f.enabled ? <><CheckCircle2 className="h-3 w-3 mr-1" />Actif</> : <><XCircle className="h-3 w-3 mr-1" />Inactif</>}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 4: Security & Compliance ═══ */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-slate-400">RGPD</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{gdprProgress}%</span>
                  </div>
                  <Progress value={gdprProgress} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">{gdprChecklist.filter(c => c.completed).length}/{gdprChecklist.length} contrôles</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-400">OWASP Top 10</span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400">{owaspPass}/{owaspTotal}</span>
                  </div>
                  <Progress value={(owaspPass / owaspTotal) * 100} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">{owaspChecks.filter(c => c.status === 'warn').length} avertissement(s)</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-slate-400">ISO 27001</span>
                    </div>
                    <span className="text-sm font-bold text-purple-400">{isoProgress}%</span>
                  </div>
                  <Progress value={isoProgress} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">{iso27001Checks.filter(c => c.completed).length}/{iso27001Checks.length} contrôles</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GDPR Checklist */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Conformité RGPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {gdprChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50">
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-slate-300' : 'text-slate-500'}`}>{item.item}</span>
                    </div>
                  ))}
                </div>
                </CardContent>
              </Card>

              {/* OWASP + ISO */}
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Sécurité OWASP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {owaspChecks.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-1.5">
                          {item.status === 'pass' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                          )}
                          <span className={`text-sm ${item.status === 'pass' ? 'text-slate-300' : 'text-amber-400'}`}>{item.item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base">Préparation ISO 27001</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {iso27001Checks.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-1.5">
                          {item.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                          )}
                          <span className={`text-sm ${item.completed ? 'text-slate-300' : 'text-slate-500'}`}>{item.item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Alerts */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base">Alertes de Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.filter(l => l.status === 'denied').length > 0 ? auditLogs.filter(l => l.status === 'denied').slice(0, 3).map(l => (
                    <div key={l.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-400 font-medium">Action non autorisée détectée</p>
                        <p className="text-xs text-slate-500 mt-1">{l.userName} — {actionLabels[l.action] ?? l.action} sur {resourceLabels[l.resource] ?? l.resource} — {new Date(l.timestamp).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 shrink-0">Critique</Badge>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-emerald-400 font-medium">Aucune alerte de sécurité</p>
                          <p className="text-xs text-slate-500 mt-1">Toutes les actions auditées sont conformes</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shrink-0">OK</Badge>
                      </div>
                    </>
                  )}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-amber-400 font-medium">Configuration de sécurité non optimisée</p>
                      <p className="text-xs text-slate-500 mt-1">En-têtes de sécurité HTTP manquants sur 2 endpoints — Dernière vérification: 10 Juil 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 shrink-0">Avertissement</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB 5: Settings ═══ */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organization Profile */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Profil de l'Organisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de l'organisation</Label>
                    <Input defaultValue={orgInfo?.name ?? ''} className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Select defaultValue={orgInfo?.country ?? 'FR'}>
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FR">🇫🇷 France</SelectItem>
                          <SelectItem value="BE">🇧🇪 Belgique</SelectItem>
                          <SelectItem value="CH">🇨🇭 Suisse</SelectItem>
                          <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                          <SelectItem value="SN">🇸🇳 Sénégal</SelectItem>
                          <SelectItem value="ML">🇲🇱 Mali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <Select defaultValue={orgInfo?.plan ?? 'starter'}>
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="professional">Professionnel</SelectItem>
                          <SelectItem value="enterprise">Entreprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Sauvegarder</Button>
                </CardContent>
              </Card>

              {/* Multi-tenancy Config */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Configuration Multi-tenant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max véhicules</Label>
                      <Input type="number" defaultValue={orgInfo?.maxVehicles ?? 100} className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max membres</Label>
                      <Input type="number" defaultValue={orgInfo?.maxDrivers ?? 50} className="bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Isolation des données</Label>
                      <Select defaultValue="strict">
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Stricte</SelectItem>
                          <SelectItem value="shared">Partagée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Stockage</Label>
                      <Select defaultValue="dedicated">
                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dedicated">Dédié</SelectItem>
                          <SelectItem value="shared">Partagé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Sauvegarder</Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Préférences de Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Alertes de sécurité par email', description: 'Recevoir les alertes critiques par email', enabled: true },
                    { label: 'Rapport hebdomadaire', description: 'Résumé d\'activité chaque lundi', enabled: true },
                    { label: 'Notifications push', description: 'Alertes en temps réel dans le navigateur', enabled: false },
                    { label: 'Alertes maintenance flotte', description: 'Rappels de maintenance planifiée', enabled: true },
                    { label: 'Notifications conformité', description: 'Mises à jour réglementaires', enabled: false },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50">
                      <div>
                        <p className="text-sm text-white">{notif.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
                      </div>
                      <Switch defaultChecked={notif.enabled} className="data-[state=checked]:bg-emerald-600" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* API Keys */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Gestion des Clés API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Production', key: 'adso_prod_****...x7f2', created: '2024-06-15', status: 'active' },
                    { name: 'Staging', key: 'adso_stg_****...k3m9', created: '2024-09-01', status: 'active' },
                    { name: 'Développement', key: 'adso_dev_****...p2d1', created: '2024-10-15', status: 'expired' },
                  ].map((apiKey, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm text-white">{apiKey.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{apiKey.key}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={apiKey.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {apiKey.status === 'active' ? 'Actif' : 'Expiré'}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 mt-2">
                    <Plus className="h-4 w-4 mr-2" />Générer une nouvelle clé
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
