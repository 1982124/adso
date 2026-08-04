'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Search,
  Camera,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Euro,
  Package,
  ClipboardList,
  History,
  CalendarClock,
  ChevronRight,
  Loader2,
  Thermometer,
  Gauge,
  Zap,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

type Category =
  | 'moteur'
  | 'freinage'
  | 'transmission'
  | 'electricite'
  | 'direction'
  | 'suspension'
  | 'climatisation'
  | 'echappement'
  | 'pneumatiques'
  | 'batterie';

type Severity = 'leger' | 'modere' | 'grave';

interface DiagnosisResult {
  problem: string;
  causes: { cause: string; probability: number }[];
  severity: Severity;
  costRange: { min: number; max: number };
  repairTime: string;
  parts: string[];
  recommendations: string[];
}

interface RepairRecord {
  id: string;
  date: string;
  vehicle: string;
  problem: string;
  cost: number;
  status: 'Termine' | 'En cours' | 'Planifie';
}

interface MaintenanceItem {
  id: string;
  name: string;
  vehicle: string;
  type: 'kilometre' | 'temps';
  threshold: string;
  current: string;
  dueDate?: string;
  urgency: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════
// Constants & Data
// ═══════════════════════════════════════════════════════════

const CATEGORIES: Record<Category, string> = {
  moteur: 'Moteur (Engine)',
  freinage: 'Freinage (Brakes)',
  transmission: 'Transmission',
  electricite: 'Electricite (Electrical)',
  direction: 'Direction (Steering)',
  suspension: 'Suspension',
  climatisation: 'Climatisation (AC)',
  echappement: "Systeme d'echappement (Exhaust)",
  pneumatiques: 'Pneumatiques (Tires)',
  batterie: 'Batterie',
};

const SUB_CATEGORIES: Record<Category, string[]> = {
  moteur: [
    'Surchauffe moteur',
    'Perte de puissance',
    'Bruits anormaux',
    'Vibrations excessives',
    'Consommation anormale',
    'Demarrage difficile',
    'Fuite d\'huile',
    'Ratés d\'allumage',
  ],
  freinage: [
    'Freins qui grincent',
    'Pedale spongieuse',
    'Tirage vers la gauche/droite',
    'Vibrations au freinage',
    'Usure des plaquettes',
    'Fuite de liquide de frein',
    'ABS defectueux',
  ],
  transmission: [
    'Boite de vitesses difficile',
    'Clacements en changement de vitesse',
    'Patinage de l\'embrayage',
    'Fuite de liquide de transmission',
    'Vibrations en marche',
    'Surconsommation de carburant',
  ],
  electricite: [
    'Batterie faible',
    'Alternateur defectueux',
    'Phares faibles',
    'Probleme de demarreur',
    'Fusibles qui sautent',
    'Probleme electronique',
    'Tableau de bord en panne',
  ],
  direction: [
    'Direction dure',
    'Jeu dans le volant',
    'Tirage lateral',
    'Vibrations dans le volant',
    'Bruit en virage',
    'Fuite de direction assistee',
  ],
  suspension: [
    'Amortisseurs uses',
    'Vibrations en conduite',
    'Vehicule qui rebondit',
    'Bruits de suspension',
    'Usure irreguliere des pneus',
    'Direction instable',
  ],
  climatisation: [
    'Pas de froid',
    'Froid insuffisant',
    'Odeurs desagreables',
    'Bruit du compresseur',
    'Fuite de refrigerant',
    'Climatisation qui tourne en continu',
  ],
  echappement: [
    'Bruit d\'echappement fort',
    'Odeur de gaz',
    'Fumee noire',
    'Fumee blanche',
    'Fumee bleue',
    'Perte de puissance liee a l\'echappement',
    'Catalyseur defectueux',
  ],
  pneumatiques: [
    'Pneu a plat',
    'Usure irreguliere',
    'Vibrations a haute vitesse',
    'Perte de pression',
    'Crevaison repetee',
    'Age des pneus',
  ],
  batterie: [
    'Batterie morte',
    'Demarrage difficile',
    'Batterie qui ne charge plus',
    'Corrosion des bornes',
    'Fuite d\'acide',
    'Surtension electrique',
  ],
};

const SEVERITIES: Record<Severity, { label: string; color: string; bg: string }> = {
  leger: { label: 'Leger (Minor)', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  modere: { label: 'Modere (Moderate)', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
  grave: { label: 'Grave (Critical)', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
};

const MOCK_REPAIRS: RepairRecord[] = [
  { id: 'R001', date: '2026-07-15', vehicle: 'Peugeot 308 II', problem: 'Remplacement plaquettes de frein avant', cost: 185, status: 'Termine' },
  { id: 'R002', date: '2026-07-28', vehicle: 'Renault Clio V', problem: 'Remplacement alternateur', cost: 420, status: 'Termine' },
  { id: 'R003', date: '2026-08-01', vehicle: 'BMW 320d', problem: 'Vidange + filtre a huile', cost: 95, status: 'En cours' },
  { id: 'R004', date: '2026-08-10', vehicle: 'Mercedes Classe C', problem: 'Diagnostic climatisation', cost: 60, status: 'Planifie' },
  { id: 'R005', date: '2026-06-20', vehicle: 'Volkswagen Golf VIII', problem: 'Remplacement amortisseurs arriere', cost: 340, status: 'Termine' },
  { id: 'R006', date: '2026-08-15', vehicle: 'Peugeot 308 II', problem: 'Remplacement courroie de distribution', cost: 680, status: 'Planifie' },
  { id: 'R007', date: '2026-05-10', vehicle: 'Citroen C3', problem: 'Reparation fuite echappement', cost: 220, status: 'Termine' },
];

const MOCK_MAINTENANCE: MaintenanceItem[] = [
  { id: 'M001', name: 'Vidange huile moteur', vehicle: 'Peugeot 308 II', type: 'kilometre', threshold: '15 000 km', current: '13 200 km', urgency: 'medium' },
  { id: 'M002', name: 'Remplacement filtre a air', vehicle: 'Peugeot 308 II', type: 'kilometre', threshold: '30 000 km', current: '13 200 km', urgency: 'low' },
  { id: 'M003', name: 'Controle des freins', vehicle: 'Renault Clio V', type: 'kilometre', threshold: '20 000 km', current: '18 500 km', urgency: 'high' },
  { id: 'M004', name: 'Remplacement liquide de refroidissement', vehicle: 'BMW 320d', type: 'temps', threshold: '2 ans', current: '1 an 8 mois', dueDate: '2026-10-01', urgency: 'medium' },
  { id: 'M005', name: 'Verification pneus (pression + usure)', vehicle: 'Mercedes Classe C', type: 'kilometre', threshold: '10 000 km', current: '8 900 km', urgency: 'medium' },
  { id: 'M006', name: 'Remplacement batterie', vehicle: 'Citroen C3', type: 'temps', threshold: '4 ans', current: '3 ans 11 mois', dueDate: '2026-09-15', urgency: 'high' },
  { id: 'M007', name: 'Remplacement plaquettes de frein arriere', vehicle: 'Volkswagen Golf VIII', type: 'kilometre', threshold: '40 000 km', current: '35 200 km', urgency: 'medium' },
  { id: 'M008', name: 'Revision generale annuelle', vehicle: 'BMW 320d', type: 'temps', threshold: '1 an', current: '9 mois', dueDate: '2026-11-01', urgency: 'low' },
];

// ═══════════════════════════════════════════════════════════
// Animation variants
// ═══════════════════════════════════════════════════════════

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════

export default function MechanicModule() {
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [category, setCategory] = useState<Category | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [description, setDescription] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subCategories = category ? SUB_CATEGORIES[category as Category] : [];

  const handleDiagnose = async () => {
    if (!category || !subCategory || !severity) return;
    setIsDiagnosing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await fetch('/api/mechanic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subCategory, severity, description }),
      });

      if (!res.ok) throw new Error('Erreur de diagnostic');

      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setSubCategory('');
    setSeverity('');
    setDescription('');
    setDiagnosis(null);
    setError(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Termine':
        return <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'>Termine</Badge>;
      case 'En cours':
        return <Badge className='bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'>En cours</Badge>;
      case 'Planifie':
        return <Badge className='bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30'>Planifie</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge className='bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'>Urgent</Badge>;
      case 'medium':
        return <Badge className='bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'>Moyen</Badge>;
      case 'low':
        return <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'>Faible</Badge>;
      default:
        return <Badge variant='outline'>{urgency}</Badge>;
    }
  };

  return (
    <div className='pt-16 min-h-screen bg-slate-950'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
              <Wrench className='w-6 h-6 text-emerald-500' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>Mecanicien IA</h1>
              <p className='text-slate-400 text-sm'>Diagnostic intelligent de vehicules</p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='bg-slate-900 border border-slate-800'>
            <TabsTrigger value='diagnostic' className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white'>
              <Search className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Diagnostic</span>
            </TabsTrigger>
            <TabsTrigger value='history' className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white'>
              <History className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Historique</span>
            </TabsTrigger>
            <TabsTrigger value='maintenance' className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white'>
              <CalendarClock className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Maintenance</span>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════ */}
          {/* DIAGNOSTIC TAB */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='diagnostic'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
              {/* Symptom Input Form */}
              <motion.div variants={fadeInUp} initial='hidden' animate='visible'>
                <Card className='bg-slate-900 border-slate-800'>
                  <CardHeader>
                    <CardTitle className='text-white flex items-center gap-2'>
                      <Activity className='w-5 h-5 text-emerald-500' />
                      Saisie des symptomes
                    </CardTitle>
                    <CardDescription className='text-slate-400'>
                      Decrivez le probleme de votre vehicule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-5'>
                    {/* Category */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-slate-300'>Categorie</label>
                      <Select
                        value={category}
                        onValueChange={(v) => {
                          setCategory(v as Category);
                          setSubCategory('');
                        }}
                      >
                        <SelectTrigger className='w-full bg-slate-800 border-slate-700 text-white'>
                          <SelectValue placeholder='Selectionnez une categorie' />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700'>
                          {Object.entries(CATEGORIES).map(([key, label]) => (
                            <SelectItem key={key} value={key} className='text-slate-200 focus:bg-slate-700 focus:text-white'>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sub-category */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-slate-300'>Sous-categorie</label>
                      <Select value={subCategory} onValueChange={setSubCategory} disabled={!category}>
                        <SelectTrigger className='w-full bg-slate-800 border-slate-700 text-white'>
                          <SelectValue placeholder={category ? 'Selectionnez un sous-type' : 'Choisissez d\'abord une categorie'} />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700 max-h-60'>
                          {subCategories.map((sub) => (
                            <SelectItem key={sub} value={sub} className='text-slate-200 focus:bg-slate-700 focus:text-white'>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Severity */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-slate-300'>Severite</label>
                      <div className='grid grid-cols-3 gap-3'>
                        {(['leger', 'modere', 'grave'] as Severity[]).map((s) => {
                          const info = SEVERITIES[s];
                          const isSelected = severity === s;
                          const btnCls = `flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200 ${isSelected ? `${info.bg} ${info.color} border-current` : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`;
                          return (
                            <button
                              key={s}
                              onClick={() => setSeverity(s)}
                              className={btnCls}
                            >
                              <Thermometer className={isSelected ? 'w-4 h-4' : 'w-4 h-4 opacity-50'} />
                              <span className='text-xs font-medium'>{info.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-slate-300'>Description detaillee</label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Decrivez les symptomes en detail : quand le probleme apparait, conditions de conduite, bruits, odeurs...'
                        className='bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px] resize-none'
                      />
                    </div>

                    {/* Photo Upload (UI only) */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-slate-300'>Photos (optionnel)</label>
                      <div className='border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-slate-800/30'>
                        <Camera className='w-8 h-8 text-slate-500 mx-auto mb-2' />
                        <p className='text-sm text-slate-400'>Cliquez ou glissez des photos ici</p>
                        <p className='text-xs text-slate-500 mt-1'>JPG, PNG jusqu\'a 10 MB</p>
                      </div>
                    </div>

                    {/* Voice Input (UI only) */}
                    <Button
                      variant='outline'
                      className='w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                    >
                      <Mic className='w-4 h-4 mr-2' />
                      Saisie vocale des symptomes
                    </Button>

                    {/* Action Buttons */}
                    <div className='flex gap-3 pt-2'>
                      <Button
                        onClick={handleDiagnose}
                        disabled={!category || !subCategory || !severity || isDiagnosing}
                        className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white'
                      >
                        {isDiagnosing ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Analyse en cours...
                          </>
                        ) : (
                          <>
                            <Search className='w-4 h-4 mr-2' />
                            Diagnostiquer
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant='outline'
                        className='bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      >
                        <RotateCcw className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Diagnostic Results */}
              <motion.div variants={fadeInUp} initial='hidden' animate='visible' transition={{ delay: 0.1 }}>
                {error && (
                  <Alert variant='destructive' className='mb-6 bg-red-500/10 border-red-500/30'>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertTitle className='text-red-400'>Erreur</AlertTitle>
                    <AlertDescription className='text-red-300'>{error}</AlertDescription>
                  </Alert>
                )}

                {!diagnosis && !error && !isDiagnosing && (
                  <Card className='bg-slate-900 border-slate-800 h-full'>
                    <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
                      <div className='p-4 rounded-full bg-slate-800 mb-4'>
                        <Gauge className='w-10 h-10 text-slate-600' />
                      </div>
                      <h3 className='text-lg font-semibold text-slate-400 mb-2'>En attente de diagnostic</h3>
                      <p className='text-sm text-slate-500 max-w-sm'>
                        Remplissez le formulaire de symptomes et cliquez sur &quot;Diagnostiquer&quot; pour obtenir une analyse IA de votre probleme.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {isDiagnosing && (
                  <Card className='bg-slate-900 border-slate-800 h-full'>
                    <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
                      <Loader2 className='w-12 h-12 text-emerald-500 animate-spin mb-4' />
                      <h3 className='text-lg font-semibold text-white mb-2'>Analyse en cours...</h3>
                      <p className='text-sm text-slate-400'>
                        Notre IA analyse vos symptomes et consulte la base de donnees technique.
                      </p>
                      <div className='w-64 mt-6'>
                        <Progress value={65} className='h-2 bg-slate-800' />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <AnimatePresence>
                  {diagnosis && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='space-y-4'
                    >
                      {/* Problem Identified */}
                      <Card className='bg-slate-900 border-slate-800'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-white flex items-center gap-2 text-base'>
                            <AlertTriangle className='w-4 h-4 text-amber-400' />
                            Probleme identifie
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className='text-slate-200'>{diagnosis.problem}</p>
                          <div className='mt-3'>
                            <Badge className={`${SEVERITIES[diagnosis.severity].bg} ${SEVERITIES[diagnosis.severity].color} border`}>
                              {SEVERITIES[diagnosis.severity].label}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Probable Causes */}
                      <Card className='bg-slate-900 border-slate-800'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-white flex items-center gap-2 text-base'>
                            <Search className='w-4 h-4 text-emerald-500' />
                            Causes probables
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                          {diagnosis.causes.map((c, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className='space-y-1.5'
                            >
                              <div className='flex items-center justify-between text-sm'>
                                <span className='text-slate-200'>{c.cause}</span>
                                <span className={`font-mono font-semibold ${c.probability > 70 ? 'text-red-400' : c.probability > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {c.probability}%
                                </span>
                              </div>
                              <div className='w-full bg-slate-800 rounded-full h-2'>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${c.probability}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 }}
                                  className={`h-2 rounded-full ${c.probability > 70 ? 'bg-red-500' : c.probability > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Cost & Time */}
                      <div className='grid grid-cols-2 gap-4'>
                        <Card className='bg-slate-900 border-slate-800'>
                          <CardContent className='pt-6'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Euro className='w-4 h-4 text-emerald-500' />
                              <span className='text-sm text-slate-400'>Cout estime</span>
                            </div>
                            <p className='text-xl font-bold text-white'>
                              {diagnosis.costRange.min} - {diagnosis.costRange.max} &euro;
                            </p>
                          </CardContent>
                        </Card>
                        <Card className='bg-slate-900 border-slate-800'>
                          <CardContent className='pt-6'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Clock className='w-4 h-4 text-emerald-500' />
                              <span className='text-sm text-slate-400'>Temps de reparation</span>
                            </div>
                            <p className='text-xl font-bold text-white'>{diagnosis.repairTime}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Required Parts */}
                      <Card className='bg-slate-900 border-slate-800'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-white flex items-center gap-2 text-base'>
                            <Package className='w-4 h-4 text-emerald-500' />
                            Pieces requises
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className='space-y-2'>
                            {diagnosis.parts.map((part, i) => (
                              <li key={i} className='flex items-center gap-2 text-sm text-slate-300'>
                                <ChevronRight className='w-3 h-3 text-emerald-500 shrink-0' />
                                {part}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card className='bg-slate-900 border-slate-800'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-white flex items-center gap-2 text-base'>
                            <ClipboardList className='w-4 h-4 text-emerald-500' />
                            Actions recommandees
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className='space-y-2'>
                            {diagnosis.recommendations.map((rec, i) => (
                              <li key={i} className='flex items-start gap-2 text-sm text-slate-300'>
                                <CheckCircle2 className='w-4 h-4 text-emerald-500 shrink-0 mt-0.5' />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* REPAIR HISTORY TAB */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='history'>
            <motion.div variants={staggerContainer} initial='hidden' animate='visible' className='mt-6'>
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <History className='w-5 h-5 text-emerald-500' />
                    Historique des reparations
                  </CardTitle>
                  <CardDescription className='text-slate-400'>
                    Historique complet des interventions sur vos vehicules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='max-h-[500px] overflow-y-auto rounded-lg'>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-slate-800 hover:bg-transparent'>
                          <TableHead className='text-slate-400'>Date</TableHead>
                          <TableHead className='text-slate-400'>Vehicule</TableHead>
                          <TableHead className='text-slate-400'>Probleme</TableHead>
                          <TableHead className='text-slate-400 text-right'>Cout</TableHead>
                          <TableHead className='text-slate-400 text-center'>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_REPAIRS.map((repair) => (
                          <TableRow key={repair.id} className='border-slate-800'>
                            <TableCell className='text-slate-300'>{repair.date}</TableCell>
                            <TableCell className='text-white font-medium'>{repair.vehicle}</TableCell>
                            <TableCell className='text-slate-300'>{repair.problem}</TableCell>
                            <TableCell className='text-emerald-400 text-right font-mono'>{repair.cost} &euro;</TableCell>
                            <TableCell className='text-center'>{getStatusBadge(repair.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* MAINTENANCE SCHEDULE TAB */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='maintenance'>
            <motion.div variants={staggerContainer} initial='hidden' animate='visible' className='mt-6 space-y-6'>
              {/* Kilometer-based reminders */}
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <Gauge className='w-5 h-5 text-emerald-500' />
                    Rappels base kilometrage
                  </CardTitle>
                  <CardDescription className='text-slate-400'>
                    Entretiens planifies selon le kilometrage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 max-h-96 overflow-y-auto'>
                    {MOCK_MAINTENANCE
                      .filter((m) => m.type === 'kilometre')
                      .map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className='flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-800'
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <p className='text-sm font-medium text-white truncate'>{item.name}</p>
                              {getUrgencyBadge(item.urgency)}
                            </div>
                            <p className='text-xs text-slate-400'>{item.vehicle}</p>
                          </div>
                          <div className='text-right ml-4 shrink-0'>
                            <p className='text-sm text-slate-300'>Seuil: <span className='text-white font-medium'>{item.threshold}</span></p>
                            <p className='text-xs text-slate-400'>Actuel: {item.current}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time-based reminders */}
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <Clock className='w-5 h-5 text-emerald-500' />
                    Rappels base temps
                  </CardTitle>
                  <CardDescription className='text-slate-400'>
                    Entretiens planifies selon la periode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 max-h-96 overflow-y-auto'>
                    {MOCK_MAINTENANCE
                      .filter((m) => m.type === 'temps')
                      .map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className='flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-800'
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <p className='text-sm font-medium text-white truncate'>{item.name}</p>
                              {getUrgencyBadge(item.urgency)}
                            </div>
                            <p className='text-xs text-slate-400'>{item.vehicle}</p>
                          </div>
                          <div className='text-right ml-4 shrink-0'>
                            <p className='text-sm text-slate-300'>Frequence: <span className='text-white font-medium'>{item.threshold}</span></p>
                            {item.dueDate && (
                              <p className='text-xs text-slate-400'>Echeance: {item.dueDate}</p>
                            )}
                            <p className='text-xs text-slate-500'>Actuel: {item.current}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
