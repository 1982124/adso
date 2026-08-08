'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bluetooth,
  Wifi,
  Usb,
  Plug,
  Link2,
  Unplug,
  Loader2,
  MonitorSmartphone,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Gauge,
  RotateCcw,
  Signal,
  Car,
  Cpu,
  ThermometerSun,
  Wind,
  Fuel,
  Zap,
  Droplets,
  Mountain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

type ConnectionType = 'bluetooth' | 'wifi' | 'usb' | 'obd2';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface SensorData {
  speed: number;
  rpm: number;
  engineTemp: number;
  intakeTemp: number;
  fuelPressure: number;
  maf: number;
  batteryVoltage: number;
  consumption: number;
  oilPressure: number;
  engineLoad: number;
}

interface DTCCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ChartDataPoint {
  time: string;
  speed: number;
  rpm: number;
}

// ═══════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════

const CONNECTION_TYPES: Record<ConnectionType, { label: string; icon: React.ReactNode }> = {
  bluetooth: { label: 'Bluetooth', icon: <Bluetooth className='w-4 h-4' /> },
  wifi: { label: 'WiFi', icon: <Wifi className='w-4 h-4' /> },
  usb: { label: 'USB', icon: <Usb className='w-4 h-4' /> },
  obd2: { label: 'OBD-II', icon: <Plug className='w-4 h-4' /> },
};

const VEHICLE_MAKES = [
  'Peugeot', 'Renault', 'Citroen', 'BMW', 'Mercedes-Benz', 'Volkswagen',
  'Audi', 'Ford', 'Toyota', 'Nissan', 'Hyundai', 'Kia',
  'Opel', 'Fiat', 'Dacia', 'Volvo', 'Skoda', 'Seat',
];

const VEHICLE_MODELS: Record<string, string[]> = {
  'Peugeot': ['208', '308', '508', '2008', '3008', '5008'],
  'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Talisman', 'Zoe'],
  'Citroen': ['C3', 'C4', 'C5', 'C3 Aircross', 'Berlingo'],
  'BMW': ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'GLA', 'GLC'],
  'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc', 'ID.3'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'Q3', 'Q5'],
  'Ford': ['Fiesta', 'Focus', 'Puma', 'Kuga', 'Mustang'],
  'Toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR', 'Hilux'],
  'Nissan': ['Micra', 'Qashqai', 'Juke', 'Leaf', 'X-Trail'],
  'Hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Kona'],
  'Kia': ['Picanto', 'Ceed', 'Sportage', 'Niro', 'EV6'],
  'Opel': ['Corsa', 'Astra', 'Mokka', 'Grandland', 'Zafira'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X', 'Doblò'],
  'Dacia': ['Sandero', 'Duster', 'Logan', 'Spring', 'Jogger'],
  'Volvo': ['V40', 'V60', 'XC40', 'XC60', 'XC90'],
  'Skoda': ['Fabia', 'Octavia', 'Kamiq', 'Kodiaq', 'Superb'],
  'Seat': ['Ibiza', 'Leon', 'Ateca', 'Arona', 'Tarraco'],
};

const YEARS = Array.from({ length: 30 }, (_, i) => String(2026 - i));

const DTC_CODES: DTCCode[] = [
  { code: 'P0300', description: 'Ratés d\'allumage détectés (cylindres multiples)', severity: 'high' },
  { code: 'P0301', description: 'Raté d\'allumage détecté - Cylindre 1', severity: 'high' },
  { code: 'P0302', description: 'Raté d\'allumage détecté - Cylindre 2', severity: 'high' },
  { code: 'P0303', description: 'Raté d\'allumage détecté - Cylindre 3', severity: 'high' },
  { code: 'P0304', description: 'Raté d\'allumage détecté - Cylindre 4', severity: 'high' },
  { code: 'P0171', description: 'Système trop pauvre (Banque 1)', severity: 'medium' },
  { code: 'P0172', description: 'Système trop riche (Banque 1)', severity: 'medium' },
  { code: 'P0174', description: 'Système trop pauvre (Banque 2)', severity: 'medium' },
  { code: 'P0420', description: 'Efficacité du catalyseur sous le seuil (Banque 1)', severity: 'medium' },
  { code: 'P0442', description: 'Fuite détectée dans le système EVAP (petite)', severity: 'low' },
  { code: 'P0455', description: 'Fuite détectée dans le système EVAP (grosse)', severity: 'medium' },
  { code: 'P0128', description: 'Température du liquide de refroidissement sous le seuil', severity: 'medium' },
  { code: 'P0131', description: 'Tension basse du capteur O2 (Banque 1, Sond 1)', severity: 'medium' },
  { code: 'P0135', description: 'Circuit de chauffage capteur O2 (Banque 1, Sond 1)', severity: 'medium' },
  { code: 'P0401', description: 'Débit d\'EGR insuffisant détecté', severity: 'low' },
  { code: 'P0410', description: 'Système d\'injection d\'air secondaire défectueux', severity: 'low' },
  { code: 'P0480', description: 'Circuit de commande du ventilateur 1', severity: 'medium' },
  { code: 'P0500', description: 'Capteur de vitesse du véhicule défectueux', severity: 'high' },
  { code: 'P0700', description: 'Système de commande de transmission (MIL demandée)', severity: 'high' },
  { code: 'P0715', description: 'Circuit du capteur de vitesse turbine/entrée', severity: 'high' },
  { code: 'P0562', description: 'Tension du système basse', severity: 'medium' },
  { code: 'P0101', description: 'Plage/performance du débitmètre MAF', severity: 'medium' },
  { code: 'P0113', description: 'Tension élevée du capteur de température air admission', severity: 'low' },
];

const INITIAL_SENSOR_DATA: SensorData = {
  speed: 0,
  rpm: 800,
  engineTemp: 85,
  intakeTemp: 25,
  fuelPressure: 300,
  maf: 5,
  batteryVoltage: 12.8,
  consumption: 7.5,
  oilPressure: 300,
  engineLoad: 25,
};

const SENSOR_CONFIG = [
  { key: 'speed' as const, label: 'Vitesse', unit: 'km/h', min: 0, max: 180, icon: Gauge, normalRange: [0, 130] },
  { key: 'rpm' as const, label: 'Régime moteur', unit: 'tr/min', min: 800, max: 7000, icon: Activity, normalRange: [800, 3500] },
  { key: 'engineTemp' as const, label: 'Temp. moteur', unit: '°C', min: 70, max: 110, icon: ThermometerSun, normalRange: [80, 100] },
  { key: 'intakeTemp' as const, label: 'Temp. air admission', unit: '°C', min: 10, max: 50, icon: Wind, normalRange: [15, 40] },
  { key: 'fuelPressure' as const, label: 'Pression carburant', unit: 'kPa', min: 200, max: 400, icon: Fuel, normalRange: [250, 380] },
  { key: 'maf' as const, label: 'Débit air (MAF)', unit: 'g/s', min: 2, max: 15, icon: Wind, normalRange: [3, 12] },
  { key: 'batteryVoltage' as const, label: 'Tension batterie', unit: 'V', min: 11.5, max: 14.5, icon: Zap, normalRange: [12.5, 14.2] },
  { key: 'consumption' as const, label: 'Consommation', unit: 'L/100km', min: 3, max: 15, icon: Droplets, normalRange: [4, 10] },
  { key: 'oilPressure' as const, label: 'Pression huile', unit: 'kPa', min: 100, max: 500, icon: Droplets, normalRange: [150, 450] },
  { key: 'engineLoad' as const, label: 'Charge moteur', unit: '%', min: 0, max: 100, icon: Mountain, normalRange: [15, 75] },
];

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function getStatus(value: number, normalRange: [number, number]): 'normal' | 'warning' | 'critical' {
  if (value >= normalRange[0] && value <= normalRange[1]) return 'normal';
  const distLow = normalRange[0] - value;
  const distHigh = value - normalRange[1];
  const dist = Math.max(distLow, distHigh);
  const range = normalRange[1] - normalRange[0];
  return dist > range * 0.5 ? 'critical' : 'warning';
}

function getStatusColor(status: 'normal' | 'warning' | 'critical') {
  switch (status) {
    case 'normal': return 'bg-emerald-500';
    case 'warning': return 'bg-amber-500';
    case 'critical': return 'bg-red-500';
  }
}

function getStatusTextColor(status: 'normal' | 'warning' | 'critical') {
  switch (status) {
    case 'normal': return 'text-emerald-400';
    case 'warning': return 'text-amber-400';
    case 'critical': return 'text-red-400';
  }
}

function getDTCSeverityBadge(severity: string) {
  switch (severity) {
    case 'high':
      return <Badge className='bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'>Critique</Badge>;
    case 'medium':
      return <Badge className='bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'>Modéré</Badge>;
    case 'low':
      return <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'>Mineur</Badge>;
    default:
      return <Badge variant='outline'>{severity}</Badge>;
  }
}

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════

export default function ScannerModule() {
  const [activeTab, setActiveTab] = useState('connect');
  const [connectionType, setConnectionType] = useState<ConnectionType>('bluetooth');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('2024');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [sensorData, setSensorData] = useState<SensorData>(INITIAL_SENSOR_DATA);
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([]);
  const [isReadingCodes, setIsReadingCodes] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const models = vehicleMake ? VEHICLE_MODELS[vehicleMake] || [] : [];

  const simulateSensorUpdate = useCallback((prev: SensorData): SensorData => {
    const variation = (val: number, range: number) =>
      clamp(val + (Math.random() - 0.5) * range, 0, 9999);

    return {
      speed: Math.round(clamp(variation(prev.speed, 8), 0, 180)),
      rpm: Math.round(clamp(variation(prev.rpm, 150), 800, 7000)),
      engineTemp: Math.round(variation(prev.engineTemp, 1) * 10) / 10,
      intakeTemp: Math.round(variation(prev.intakeTemp, 2) * 10) / 10,
      fuelPressure: Math.round(variation(prev.fuelPressure, 10)),
      maf: Math.round(variation(prev.maf, 0.8) * 10) / 10,
      batteryVoltage: Math.round(variation(prev.batteryVoltage, 0.2) * 10) / 10,
      consumption: Math.round(variation(prev.consumption, 0.5) * 10) / 10,
      oilPressure: Math.round(variation(prev.oilPressure, 15)),
      engineLoad: Math.round(clamp(variation(prev.engineLoad, 5), 0, 100)),
    };
  }, []);

  // Start/stop live data updates
  useEffect(() => {
    if (connectionStatus === 'connected') {
      intervalRef.current = setInterval(() => {
        setSensorData((prev) => simulateSensorUpdate(prev));
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [connectionStatus, simulateSensorUpdate]);

  // Accumulate chart data
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const chartInterval = setInterval(() => {
      setSensorData((prev) => {
        const now = new Date();
        const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        setChartData((cd) => {
          const newPoint = { time: timeStr, speed: prev.speed, rpm: prev.rpm };
          const updated = [...cd, newPoint];
          // Keep last 30 data points
          return updated.length > 30 ? updated.slice(-30) : updated;
        });

        return simulateSensorUpdate(prev);
      });
    }, 2000);

    return () => clearInterval(chartInterval);
  }, [connectionStatus, simulateSensorUpdate]);

  const handleConnect = () => {
    if (connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
      setSensorData(INITIAL_SENSOR_DATA);
      setDtcCodes([]);
      setChartData([]);
      return;
    }
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setActiveTab('livedata');
    }, 2000);
  };

  const handleReadCodes = () => {
    setIsReadingCodes(true);
    setTimeout(() => {
      const count = 3 + Math.floor(Math.random() * 4);
      const shuffled = [...DTC_CODES].sort(() => Math.random() - 0.5);
      setDtcCodes(shuffled.slice(0, count));
      setIsReadingCodes(false);
    }, 1500);
  };

  const handleClearCodes = () => {
    setDtcCodes([]);
  };

  const isFormValid = vehicleMake && vehicleModel && vehicleYear;

  return (
    <div className='pt-16 min-h-screen bg-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6'
        >
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
                <Cpu className='w-6 h-6 text-emerald-500' />
              </div>
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-white'>Scanner OBD-II</h1>
                <p className='text-slate-400 text-sm'>Diagnostic vehicule en temps reel</p>
              </div>
            </div>
            {/* Connection Status Badge */}
            <div className='flex items-center gap-2'>
              <div className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
                'bg-slate-600'
              }`} />
              <span className={`text-sm font-medium ${
                connectionStatus === 'connected' ? 'text-emerald-400' :
                connectionStatus === 'connecting' ? 'text-amber-400' :
                'text-slate-500'
              }`}>
                {connectionStatus === 'connected' ? 'Connecté' :
                 connectionStatus === 'connecting' ? 'Connexion...' :
                 'Déconnecté'}
              </span>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='bg-slate-900 border border-slate-800'>
            <TabsTrigger value='connect' className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white'>
              <Link2 className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Connexion</span>
            </TabsTrigger>
            <TabsTrigger
              value='livedata'
              disabled={connectionStatus !== 'connected'}
              className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white disabled:opacity-40'
            >
              <MonitorSmartphone className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Données live</span>
            </TabsTrigger>
            <TabsTrigger
              value='dtc'
              disabled={connectionStatus !== 'connected'}
              className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white disabled:opacity-40'
            >
              <AlertTriangle className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Codes DTC</span>
            </TabsTrigger>
            <TabsTrigger
              value='charts'
              disabled={connectionStatus !== 'connected'}
              className='data-[state=active]:bg-emerald-600 data-[state=active]:text-white disabled:opacity-40'
            >
              <Activity className='w-4 h-4 mr-1.5' />
              <span className='hidden sm:inline'>Graphiques</span>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════ */}
          {/* CONNECTION PANEL */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='connect'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-6 max-w-2xl mx-auto'
            >
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <Signal className='w-5 h-5 text-emerald-500' />
                    Connexion au vehicule
                  </CardTitle>
                  <CardDescription className='text-slate-400'>
                    Configurez et connectez votre scanner OBD-II
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-5'>
                  {/* Connection Type */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>Type de connexion</label>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                      {(Object.entries(CONNECTION_TYPES) as [ConnectionType, typeof CONNECTION_TYPES[ConnectionType]][]).map(([key, ct]) => (
                        <button
                          key={key}
                          onClick={() => setConnectionType(key)}
                          className={connectionType === key
                            ? 'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                            : 'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }
                        >
                          {ct.icon}
                          <span className='text-xs font-medium'>{ct.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className='bg-slate-800' />

                  {/* Vehicle Info */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300 flex items-center gap-2'>
                      <Car className='w-4 h-4' />
                      Informations du vehicule
                    </label>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      <Select value={vehicleMake} onValueChange={(v) => { setVehicleMake(v); setVehicleModel(''); }}>
                        <SelectTrigger className='bg-slate-800 border-slate-700 text-white'>
                          <SelectValue placeholder='Marque' />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700 max-h-60'>
                          {VEHICLE_MAKES.map((make) => (
                            <SelectItem key={make} value={make} className='text-slate-200 focus:bg-slate-700 focus:text-white'>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={vehicleModel} onValueChange={setVehicleModel} disabled={!vehicleMake}>
                        <SelectTrigger className='bg-slate-800 border-slate-700 text-white'>
                          <SelectValue placeholder={vehicleMake ? 'Modele' : 'Marque requise'} />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700 max-h-60'>
                          {models.map((model) => (
                            <SelectItem key={model} value={model} className='text-slate-200 focus:bg-slate-700 focus:text-white'>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={vehicleYear} onValueChange={setVehicleYear}>
                        <SelectTrigger className='bg-slate-800 border-slate-700 text-white'>
                          <SelectValue placeholder='Année' />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700 max-h-60'>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year} className='text-slate-200 focus:bg-slate-700 focus:text-white'>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className='bg-slate-800' />

                  {/* Connect Button */}
                  <Button
                    onClick={handleConnect}
                    disabled={!isFormValid && connectionStatus === 'disconnected'}
                    className={connectionStatus === 'connected'
                      ? 'w-full bg-red-600 hover:bg-red-700 text-white'
                      : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white'
                    }
                  >
                    {connectionStatus === 'disconnected' && (
                      <>
                        <Link2 className='w-4 h-4 mr-2' />
                        Connecter
                      </>
                    )}
                    {connectionStatus === 'connecting' && (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Connexion en cours...
                      </>
                    )}
                    {connectionStatus === 'connected' && (
                      <>
                        <Unplug className='w-4 h-4 mr-2' />
                        Déconnecter
                      </>
                    )}
                  </Button>

                  {/* Status info */}
                  <AnimatePresence>
                    {connectionStatus === 'connected' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Alert className='bg-emerald-500/10 border-emerald-500/30'>
                          <CheckCircle2 className='h-4 w-4 text-emerald-400' />
                          <AlertTitle className='text-emerald-400'>Connecté avec succès</AlertTitle>
                          <AlertDescription className='text-emerald-300/80'>
                            Scanner connecté à {vehicleMake} {vehicleModel} ({vehicleYear}) via {CONNECTION_TYPES[connectionType].label}.
                            Accédez aux données en temps réel via les onglets ci-dessus.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                    {connectionStatus === 'connecting' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Alert className='bg-amber-500/10 border-amber-500/30'>
                          <Loader2 className='h-4 w-4 text-amber-400 animate-spin' />
                          <AlertTitle className='text-amber-400'>Connexion en cours</AlertTitle>
                          <AlertDescription className='text-amber-300/80'>
                            Tentative de connexion au scanner OBD-II... Veuillez patienter.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* LIVE DATA DASHBOARD */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='livedata'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-6'
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                {SENSOR_CONFIG.map((sensor, i) => {
                  const value = sensorData[sensor.key];
                  const status = getStatus(value, sensor.normalRange as [number, number]);
                  const Icon = sensor.icon;
                  return (
                    <motion.div
                      key={sensor.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className='bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors'>
                        <CardContent className='pt-6 pb-5'>
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center gap-2'>
                              <div className={cn(
                                'p-1.5 rounded-md',
                                status === 'normal' ? 'bg-emerald-500/10' :
                                status === 'warning' ? 'bg-amber-500/10' :
                                'bg-red-500/10'
                              )}>
                                <Icon className={cn('w-3.5 h-3.5', getStatusTextColor(status))} />
                              </div>
                              <span className='text-xs text-slate-400 font-medium'>{sensor.label}</span>
                            </div>
                            <div className={cn('w-2 h-2 rounded-full', getStatusColor(status))} />
                          </div>
                          <div className='flex items-baseline gap-1.5'>
                            <motion.span
                              key={sensor.key + '-' + value}
                              initial={{ opacity: 0.6, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn('text-2xl font-bold font-mono', getStatusTextColor(status))}
                            >
                              {typeof value === 'number' && !Number.isInteger(value)
                                ? value.toFixed(1)
                                : value}
                            </motion.span>
                            <span className='text-xs text-slate-500'>{sensor.unit}</span>
                          </div>
                          <div className='mt-2 flex items-center gap-1.5'>
                            <div className='flex-1 h-1 rounded-full bg-slate-800'>
                              <div
                                className={cn('h-1 rounded-full transition-all duration-500', getStatusColor(status))}
                                style={{
                                  width: ((value - sensor.min) / (sensor.max - sensor.min)) * 100 + '%',
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* DTC CODES PANEL */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='dtc'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-6'
            >
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div>
                      <CardTitle className='text-white flex items-center gap-2'>
                        <AlertTriangle className='w-5 h-5 text-amber-500' />
                        Codes de defaut (DTC)
                      </CardTitle>
                      <CardDescription className='text-slate-400 mt-1'>
                        Lecture et effacement des codes d\'erreur OBD-II
                      </CardDescription>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={handleReadCodes}
                        disabled={isReadingCodes}
                        className='bg-emerald-600 hover:bg-emerald-700 text-white'
                      >
                        {isReadingCodes ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Lecture...
                          </>
                        ) : (
                          <>
                            <Activity className='w-4 h-4 mr-2' />
                            Lire les codes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleClearCodes}
                        disabled={dtcCodes.length === 0}
                        variant='outline'
                        className='bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      >
                        <RotateCcw className='w-4 h-4 mr-2' />
                        Effacer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {dtcCodes.length === 0 && !isReadingCodes && (
                    <div className='text-center py-12'>
                      <div className='p-4 rounded-full bg-slate-800 mx-auto mb-4 w-fit'>
                        <CheckCircle2 className='w-10 h-10 text-emerald-500' />
                      </div>
                      <h3 className='text-lg font-semibold text-slate-300 mb-1'>Aucun code de defaut</h3>
                      <p className='text-sm text-slate-500'>Cliquez sur &quot;Lire les codes&quot; pour scanner les codes DTC.</p>
                    </div>
                  )}

                  {dtcCodes.length > 0 && (
                    <div className='max-h-96 overflow-y-auto rounded-lg'>
                      <Table>
                        <TableHeader>
                          <TableRow className='border-slate-800 hover:bg-transparent'>
                            <TableHead className='text-slate-400 w-28'>Code</TableHead>
                            <TableHead className='text-slate-400'>Description</TableHead>
                            <TableHead className='text-slate-400 text-center w-28'>Severité</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dtcCodes.map((dtc, i) => (
                            <motion.tr
                              key={dtc.code}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className='border-b border-slate-800 hover:bg-slate-800/50'
                            >
                              <td className='p-2'>
                                <span className='font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded'>
                                  {dtc.code}
                                </span>
                              </td>
                              <td className='p-2 text-slate-300 text-sm'>{dtc.description}</td>
                              <td className='p-2 text-center'>{getDTCSeverityBadge(dtc.severity)}</td>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════ */}
          {/* SENSOR CHARTS */}
          {/* ═══════════════════════════════════════════════ */}
          <TabsContent value='charts'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-6 space-y-6'
            >
              {/* Speed Chart */}
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <Gauge className='w-5 h-5 text-emerald-500' />
                    Vitesse (km/h) — Temps reel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                        <XAxis
                          dataKey='time'
                          stroke='#64748b'
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke='#64748b'
                          fontSize={12}
                          tickLine={false}
                          domain={[0, 180]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                        <Line
                          type='monotone'
                          dataKey='speed'
                          stroke='#10b981'
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: '#10b981' }}
                          animationDuration={300}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* RPM Chart */}
              <Card className='bg-slate-900 border-slate-800'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center gap-2'>
                    <Activity className='w-5 h-5 text-emerald-500' />
                    Régime moteur (tr/min) — Temps reel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                        <XAxis
                          dataKey='time'
                          stroke='#64748b'
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke='#64748b'
                          fontSize={12}
                          tickLine={false}
                          domain={[0, 7000]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                        <Line
                          type='monotone'
                          dataKey='rpm'
                          stroke='#f59e0b'
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: '#f59e0b' }}
                          animationDuration={300}
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
