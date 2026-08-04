'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Send,
  Brain,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Activity,
  History,
  Gauge,
  Clock,
  MapPin,
  Wind,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Shield,
  Zap,
  BarChart3,
  Star,
  Target,
  Award,
  ChevronRight,
  RefreshCw,
  Volume2,
  MessageSquare,
  Route,

  ThermometerSun,
  CircleDot,
  Circle,
  Bike,
  Bus,
  Truck,
  Filter,
  Calendar,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader2,
  Info,
  Lightbulb,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useDrivingSessionStore, type DrivingEventItem, type VehicleType, type WeatherCondition, type RoadType, type ChatMessage } from '@/stores/driving-session-store';

// ═══════════════════════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════════════════════
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ═══════════════════════════════════════════════════════════
// Severity helpers
// ═══════════════════════════════════════════════════════════
const severityConfig: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = {
  smooth: { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', label: 'Fluide', icon: CheckCircle2 },
  normal: { color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', label: 'Normal', icon: CircleDot },
  harsh: { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', label: 'Brusque', icon: AlertTriangle },
  dangerous: { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', label: 'Dangereux', icon: XCircle },
};

const eventTypeLabels: Record<string, string> = {
  brake: 'Freinage',
  accelerate: 'Accélération',
  turn: 'Virage',
  lane_change: 'Changement de voie',
  stop: 'Arrêt',
  start: 'Démarrage',
  overtake: 'Dépassement',
  park: 'Stationnement',
  reverse: 'Marche arrière',
  signal: 'Clignotant',
};

const vehicleIcons: Record<VehicleType, React.ElementType> = {
  car: Car,
  motorcycle: Bike,
  truck: Truck,
  bus: Bus,
};

const vehicleLabels: Record<VehicleType, string> = {
  car: 'Voiture',
  motorcycle: 'Moto',
  truck: 'Camion',
  bus: 'Bus',
};

const weatherLabels: Record<WeatherCondition, string> = {
  clear: 'Clair ☀️',
  rain: 'Pluie 🌧️',
  fog: 'Brouillard 🌫️',
  snow: 'Neige ❄️',
  night: 'Nuit 🌙',
  storm: 'Tempête ⛈️',
};

const roadTypeLabels: Record<RoadType, string> = {
  urban: 'Urbain 🏙️',
  rural: 'Rural 🌾',
  highway: 'Autoroute 🛣️',
  mountain: 'Montagne ⛰️',
};

// ═══════════════════════════════════════════════════════════
// Score Gauge Component
// ═══════════════════════════════════════════════════════════
function ScoreGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80" cy="80" r={radius}
          fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="12"
        />
        <circle
          cx="80" cy="80" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(score)}</span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Event Feed Item
// ═══════════════════════════════════════════════════════════
function EventFeedItem({ event }: { event: DrivingEventItem }) {
  const config = severityConfig[event.severity] || severityConfig.normal;
  const Icon = config.icon;
  const label = eventTypeLabels[event.type] || event.type;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${config.bg}`}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-medium">{label}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-current/30 ${config.color}`}>
            {config.label}
          </Badge>
        </div>
        {event.speed && (
          <span className="text-xs text-slate-400">{event.speed} km/h</span>
        )}
      </div>
      <span className="text-xs text-slate-500 shrink-0">
        {new Date(event.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// Chat Bubble
// ═══════════════════════════════════════════════════════════
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-md'
            : 'bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 1: AI Instructor
// ═══════════════════════════════════════════════════════════
function AIInstructorTab() {
  const store = useDrivingSessionStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [store.chatMessages]);

  // Session timer
  useEffect(() => {
    if (store.sessionStatus === 'active') {
      timerRef.current = setInterval(() => {
        store.setSessionDuration(store.sessionDuration + 1);
        // Simulate distance gain
        if (Math.random() < 0.3) {
          store.setSessionDistance(store.sessionDistance + 0.02);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [store.sessionStatus]);

  // Simulate driving events when active
  useEffect(() => {
    if (store.sessionStatus !== 'active') return;
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        const types = ['brake', 'accelerate', 'turn', 'lane_change', 'stop', 'signal'];
        const severities = ['smooth', 'smooth', 'normal', 'normal', 'normal', 'harsh', 'dangerous'];
        const type = types[Math.floor(Math.random() * types.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)] as DrivingEventItem['severity'];
        const speed = 20 + Math.floor(Math.random() * 100);

        const event: DrivingEventItem = {
          id: `evt-${Date.now()}`,
          sessionId: store.currentSession?.id || '',
          type,
          severity,
          speed,
          timestamp: new Date().toISOString(),
        };
        store.addEvent(event);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [store.sessionStatus]);

  const handleStartSession = async () => {
    try {
      const res = await fetch('/api/driving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lesson',
          vehicleType: store.selectedVehicleType,
          weather: store.weather,
          roadType: store.roadType,
        }),
      });
      const session = await res.json();
      store.setCurrentSession(session);
      store.setSessionStatus('active');
      store.setDrivingScore(100);
      store.clearEvents();
    } catch {
      console.error('Failed to start session');
    }
  };

  const handlePauseSession = async () => {
    if (!store.currentSession) return;
    try {
      await fetch(`/api/driving/sessions/${store.currentSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused', duration: store.sessionDuration }),
      });
      store.setSessionStatus('paused');
      store.updateSession(store.currentSession.id, { status: 'paused' });
    } catch {
      console.error('Failed to pause session');
    }
  };

  const handleResumeSession = async () => {
    if (!store.currentSession) return;
    try {
      await fetch(`/api/driving/sessions/${store.currentSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      store.setSessionStatus('active');
    } catch {
      console.error('Failed to resume session');
    }
  };

  const handleStopSession = async () => {
    if (!store.currentSession) return;
    try {
      await fetch(`/api/driving/sessions/${store.currentSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          duration: store.sessionDuration,
          distance: store.sessionDistance,
          score: store.drivingScore,
          harshBrakes: store.events.filter((e) => e.type === 'brake' && e.severity === 'harsh').length,
          harshAccel: store.events.filter((e) => e.type === 'accelerate' && e.severity === 'harsh').length,
          harshTurns: store.events.filter((e) => e.type === 'turn' && e.severity === 'harsh').length,
          speedViolations: store.events.filter((e) => e.type === 'accelerate' && e.severity === 'dangerous').length,
        }),
      });
      store.addSession({
        ...store.currentSession,
        status: 'completed',
        duration: store.sessionDuration,
        distance: store.sessionDistance,
        score: store.drivingScore,
      });
      store.setSessionStatus('idle');
      store.resetSession();
    } catch {
      console.error('Failed to stop session');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    store.addChatMessage({ role: 'user', content: msg, timestamp: Date.now() });
    store.setIsChatLoading(true);

    try {
      const res = await fetch('/api/driving/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          sessionId: store.currentSession?.id,
          score: store.drivingScore,
          events: store.events.slice(0, 5).map((e) => ({ type: e.type, severity: e.severity })),
        }),
      });
      const data = await res.json();
      store.addChatMessage({ role: 'assistant', content: data.reply, timestamp: Date.now() });
    } catch {
      store.addChatMessage({ role: 'assistant', content: 'Désolé, une erreur est survenue.', timestamp: Date.now() });
    } finally {
      store.setIsChatLoading(false);
    }
  };

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const VehicleIcon = vehicleIcons[store.selectedVehicleType];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* LEFT: Score + Controls + Event Feed */}
      <div className="space-y-4">
        {/* Score Card */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-500" />
                Score de Conduite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreGauge score={store.drivingScore} />
              <div className="flex justify-center gap-4 mt-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{store.events.filter((e) => e.severity === 'smooth').length}</div>
                  <div className="text-[10px] text-emerald-400">Fluides</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{store.events.filter((e) => e.severity === 'normal').length}</div>
                  <div className="text-[10px] text-blue-400">Normaux</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{store.events.filter((e) => e.severity === 'harsh').length}</div>
                  <div className="text-[10px] text-amber-400">Brusques</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{store.events.filter((e) => e.severity === 'dangerous').length}</div>
                  <div className="text-[10px] text-red-400">Dangereux</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Controls */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500" />
                Contrôles de Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Type */}
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Type de véhicule</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(vehicleLabels) as VehicleType[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => store.sessionStatus === 'idle' && store.setSelectedVehicleType(v)}
                      disabled={store.sessionStatus !== 'idle'}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                        store.selectedVehicleType === v
                          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      } ${store.sessionStatus !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {(() => {
                        const Icon = vehicleIcons[v];
                        return <Icon className="w-4 h-4" />;
                      })()}
                      {vehicleLabels[v]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather & Road */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Météo</label>
                  <Select
                    value={store.weather}
                    onValueChange={(v) => store.setWeather(v as WeatherCondition)}
                    disabled={store.sessionStatus !== 'idle'}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {(Object.keys(weatherLabels) as WeatherCondition[]).map((w) => (
                        <SelectItem key={w} value={w}>{weatherLabels[w]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Route</label>
                  <Select
                    value={store.roadType}
                    onValueChange={(v) => store.setRoadType(v as RoadType)}
                    disabled={store.sessionStatus !== 'idle'}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {(Object.keys(roadTypeLabels) as RoadType[]).map((r) => (
                        <SelectItem key={r} value={r}>{roadTypeLabels[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {store.sessionStatus === 'idle' && (
                  <Button onClick={handleStartSession} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10">
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer
                  </Button>
                )}
                {store.sessionStatus === 'active' && (
                  <>
                    <Button onClick={handlePauseSession} variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 h-10">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={handleStopSession} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10">
                      <Square className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                  </>
                )}
                {store.sessionStatus === 'paused' && (
                  <>
                    <Button onClick={handleResumeSession} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10">
                      <Play className="w-4 h-4 mr-2" />
                      Reprendre
                    </Button>
                    <Button onClick={handleStopSession} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10">
                      <Square className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                  </>
                )}
              </div>

              {/* Session Stats */}
              {store.sessionStatus !== 'idle' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
                    <div className="text-sm font-mono text-white">{formatDuration(store.sessionDuration)}</div>
                    <div className="text-[10px] text-slate-500">Durée</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <Route className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
                    <div className="text-sm font-mono text-white">{store.sessionDistance.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-500">km</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {store.sessionStatus === 'active' ? (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                      )}
                    </div>
                    <div className="text-sm text-white capitalize">
                      {store.sessionStatus === 'active' ? 'En cours' : 'Pause'}
                    </div>
                    <div className="text-[10px] text-slate-500">Statut</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Event Feed */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Fil d&apos;Événements
                {store.events.length > 0 && (
                  <Badge className="bg-slate-800 text-slate-300 ml-auto">{store.events.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {store.events.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Aucun événement enregistré</p>
                    <p className="text-xs text-slate-600">Démarrez une session pour commencer</p>
                  </div>
                )}
                <AnimatePresence>
                  {store.events.slice(0, 20).map((event) => (
                    <EventFeedItem key={event.id} event={event} />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* RIGHT: Chat Interface */}
      <motion.div {...fadeUp} className="lg:col-span-2">
        <Card className="bg-slate-900 border-slate-800 rounded-xl flex flex-col h-[calc(100vh-12rem)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-500" />
              Instructeur IA
              <VehicleIcon className="w-4 h-4 text-slate-400 ml-auto" />
              <span className="text-xs text-slate-400">{vehicleLabels[store.selectedVehicleType]}</span>
              {store.weather !== 'clear' && (
                <span className="text-xs text-slate-400">{weatherLabels[store.weather]}</span>
              )}
            </CardTitle>
          </CardHeader>
          <Separator className="bg-slate-800" />
          <CardContent className="flex-1 flex flex-col pt-0">
            <div className="flex-1 overflow-y-auto space-y-3 py-4 px-1">
              {store.chatMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Bienvenue, élève conducteur !</h3>
                    <p className="text-sm text-slate-400">
                      Je suis votre instructeur IA. Démarrez une session et posez-moi vos questions sur la conduite.
                    </p>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {[
                        'Comment bien freiner en descente ?',
                        'Quand dois-je mettre le clignotant ?',
                        'Comment tourner correctement à un carrefour ?',
                        'Conseils pour la conduite en ville ?',
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setChatInput(q); }}
                          className="text-left text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {store.chatMessages.map((msg, i) => (
                  <ChatBubble key={`${msg.role}-${i}`} message={msg} />
                ))}
              </AnimatePresence>
              {store.isChatLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    <span className="text-sm text-slate-400">L&apos;instructeur réfléchit...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-800 pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`shrink-0 ${isMicOn ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez une question à votre instructeur..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-10"
                  disabled={store.isChatLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                  disabled={!chatInput.trim() || store.isChatLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 2: AI Coach
// ═══════════════════════════════════════════════════════════
function AICoachTab() {
  const store = useDrivingSessionStore();

  // Derived skill data from events
  const skills = [
    { name: 'Freinage', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'brake' && e.severity === 'harsh').length * 15), tip: 'Anticipez les freinages' },
    { name: 'Accélération', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'accelerate' && e.severity === 'harsh').length * 15), tip: 'Accélérez progressivement' },
    { name: 'Virages', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'turn' && e.severity === 'harsh').length * 15), tip: 'Ralentissez avant le virage' },
    { name: 'Voie', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'lane_change' && e.severity === 'harsh').length * 15), tip: 'Vérifiez les rétroviseurs' },
    { name: 'Signaux', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'signal' && e.severity === 'harsh').length * 10), tip: 'Utilisez vos clignotants' },
    { name: 'Vitesse', score: Math.max(10, 100 - store.events.filter((e) => e.type === 'accelerate' && e.severity === 'dangerous').length * 20), tip: 'Respectez les limitations' },
  ];

  const radarData = skills.map((s) => ({ skill: s.name, score: s.score }));
  const radarConfig: ChartConfig = {
    score: { label: 'Score', color: '#10b981' },
  };

  const strengths = skills.filter((s) => s.score >= 75).map((s) => s.name);
  const weaknesses = skills.filter((s) => s.score < 50).map((s) => s.name);

  const lessons = [
    { name: 'Manœuvres en ville', progress: 68, icon: '🏙️', status: 'en_cours' },
    { name: 'Conduite sur autoroute', progress: 45, icon: '🛣️', status: 'en_cours' },
    { name: 'Stationnement', progress: 92, icon: '🅿️', status: 'termine' },
    { name: 'Conduite de nuit', progress: 20, icon: '🌙', status: 'non_commence' },
    { name: 'Conditions difficiles', progress: 55, icon: '🌧️', status: 'en_cours' },
  ];

  const tips = [
    { title: 'Regard au loin', desc: 'Fixez un point lointain pour stabiliser votre trajectoire en ligne droite.', icon: Eye },
    { title: 'Freinage progressif', desc: 'Commencez par freiner doucement, puis augmentez la pression progressivement.', icon: TrendingDown },
    { title: 'Position sur route', desc: 'Placez-vous correctement dans votre voie pour assurer une visibilité optimale.', icon: Target },
    { title: 'Anticipation', desc: 'Observez les panneaux, la signalisation et le comportement des autres usagers.', icon: Brain },
  ];

  return (
    <motion.div {...staggerContainer} animate className="space-y-4">
      {/* Top row: Radar + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Évaluation des Compétences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={radarConfig} className="mx-auto w-full aspect-square max-w-[320px]">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(71,85,105,0.4)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Progress Bars */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Détail par Compétence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className={`font-mono ${skill.score >= 75 ? 'text-emerald-400' : skill.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {skill.score}%
                    </span>
                  </div>
                  <Progress
                    value={skill.score}
                    className={`h-2 ${skill.score >= 75 ? '[&>div]:bg-emerald-500' : skill.score >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                  />
                  <p className="text-[11px] text-slate-500">{skill.tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Middle: Strengths/Weaknesses + Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strengths & Weaknesses */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-500" />
                Forces & Faiblesses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Points Forts
                </h4>
                {strengths.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {strengths.map((s) => (
                      <Badge key={s} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Continuez à pratiquer !</p>
                )}
              </div>
              <Separator className="bg-slate-800" />
              <div>
                <h4 className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Axes d&apos;Amélioration
                </h4>
                {weaknesses.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {weaknesses.map((w) => (
                      <Badge key={w} className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">{w}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Aucune faiblesse détectée !</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lessons Progress */}
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Progression des Leçons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lessons.map((lesson) => (
                <div key={lesson.name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                  <span className="text-xl">{lesson.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white truncate">{lesson.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{lesson.progress}%</span>
                    </div>
                    <Progress
                      value={lesson.progress}
                      className={`h-1.5 mt-1 ${lesson.progress >= 80 ? '[&>div]:bg-emerald-500' : lesson.progress >= 40 ? '[&>div]:bg-amber-500' : '[&>div]:bg-slate-600'}`}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${
                      lesson.status === 'termine'
                        ? 'border-emerald-500/50 text-emerald-400'
                        : lesson.status === 'en_cours'
                          ? 'border-amber-500/50 text-amber-400'
                          : 'border-slate-600 text-slate-500'
                    }`}
                  >
                    {lesson.status === 'termine' ? '✓ Terminé' : lesson.status === 'en_cours' ? 'En cours' : 'À venir'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Coach Tips */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              Conseils du Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {tips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1">{tip.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 3: AI Examiner
// ═══════════════════════════════════════════════════════════
function AIExaminerTab() {
  const [examStarted, setExamStarted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examComplete, setExamComplete] = useState(false);

  const criteria = [
    { name: 'Démarrage moteur', category: 'Préparation', score: 85, weight: 8, feedback: 'Bon contrôle des pédales au démarrage.' },
    { name: 'Observation avant départ', category: 'Préparation', score: 70, weight: 10, feedback: 'Vérifiez plus soigneusement les rétroviseurs.' },
    { name: 'Insertion dans la circulation', category: 'Circulation', score: 90, weight: 12, feedback: 'Excellente insertion en toute sécurité.' },
    { name: 'Respect des priorités', category: 'Circulation', score: 95, weight: 15, feedback: 'Maîtrise parfaite des priorités.' },
    { name: 'Positionnement sur voie', category: 'Circulation', score: 78, weight: 12, feedback: 'Légère dérive vers la droite en virage.' },
    { name: 'Franchissement intersections', category: 'Circulation', score: 82, weight: 10, feedback: 'Bon regard, mais ralentissez un peu plus.' },
    { name: 'Changement de direction', category: 'Manœuvres', score: 75, weight: 10, feedback: 'Clignotant mis trop tardivement.' },
    { name: 'Stationnement', category: 'Manœuvres', score: 88, weight: 8, feedback: 'Bon créneau, assurez-vous du positionnement final.' },
    { name: 'Conduite économique', category: 'Conduite', score: 65, weight: 5, feedback: 'Accélérations trop brusques, consommez moins.' },
    { name: 'Maîtrise du véhicule', category: 'Conduite', score: 92, weight: 10, feedback: 'Contrôle global excellent.' },
  ];

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
  const weightedScore = criteria.reduce((s, c) => s + c.score * c.weight, 0) / totalWeight;
  const passed = weightedScore >= 70;

  const examHistory = [
    { date: '2025-01-15', score: 72, status: 'Réussi', type: 'Examen blanc' },
    { date: '2025-01-10', score: 65, status: 'Non réussi', type: 'Examen blanc' },
    { date: '2025-01-05', score: 78, status: 'Réussi', type: 'Évaluation' },
    { date: '2024-12-28', score: 60, status: 'Non réussi', type: 'Examen blanc' },
    { date: '2024-12-20', score: 85, status: 'Réussi', type: 'Évaluation' },
  ];

  const examConfig: ChartConfig = {
    score: { label: 'Score', color: '#10b981' },
  };

  return (
    <motion.div {...staggerContainer} animate className="space-y-4">
      {/* Header + Start */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              Mode Examen Pratique
            </CardTitle>
            <CardDescription className="text-slate-400">
              Simulez un examen du permis de conduire avec un évaluation détaillée par l&apos;IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!examStarted ? (
              <Button
                onClick={() => { setExamStarted(true); setExamScore(0); setExamComplete(false); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Commencer l&apos;Examen
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => { setExamComplete(true); setExamScore(Math.round(weightedScore)); }}
                  disabled={examComplete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Terminer l&apos;Examen
                </Button>
                {examComplete && (
                  <Badge className={passed ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'}>
                    {passed ? '✓ Admis' : '✗ Ajourné'}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Exam Results */}
      {examStarted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Score Card */}
          <motion.div {...fadeUp}>
            <Card className="bg-slate-900 border-slate-800 rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Résultat Global</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ScoreGauge score={examComplete ? examScore : weightedScore} />
                <div className={`text-lg font-bold mt-3 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passed ? 'ADMIS' : 'AJOURNÉ'}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Seuil de réussite : 70/100
                </p>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Points forts</span>
                    <span className="text-emerald-400">{criteria.filter((c) => c.score >= 80).length}/{criteria.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">À améliorer</span>
                    <span className="text-amber-400">{criteria.filter((c) => c.score >= 60 && c.score < 80).length}/{criteria.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Critiques</span>
                    <span className="text-red-400">{criteria.filter((c) => c.score < 60).length}/{criteria.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Criteria Detail */}
          <motion.div {...fadeUp} className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800 rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Critères d&apos;Évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {criteria.map((c) => (
                    <div key={c.name} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{c.name}</span>
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{c.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">×{c.weight}</span>
                          <span className={`font-mono text-sm ${c.score >= 80 ? 'text-emerald-400' : c.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {c.score}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={c.score}
                        className={`h-1.5 ${c.score >= 80 ? '[&>div]:bg-emerald-500' : c.score >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                      />
                      <p className="text-[11px] text-slate-400 mt-1">{c.feedback}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Exam History Chart */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-500" />
              Historique des Examens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={examConfig} className="h-[200px] w-full">
              <LineChart data={examHistory.map((h) => ({ ...h, score: h.score }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 4: AI Tutor
// ═══════════════════════════════════════════════════════════
function AITutorTab() {
  const [selectedTopic, setSelectedTopic] = useState<string>('priorites');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const topics = [
    { id: 'priorites', name: 'Priorités', icon: '🚦', questions: 12, mastered: 8 },
    { id: 'signalisation', name: 'Signalisation', icon: '🪧', questions: 15, mastered: 10 },
    { id: 'vitesse', name: 'Vitesse', icon: '⚡', questions: 8, mastered: 5 },
    { id: 'intersections', name: 'Intersections', icon: '↔️', questions: 10, mastered: 4 },
    { id: 'stationnement', name: 'Stationnement', icon: '🅿️', questions: 6, mastered: 6 },
    { id: 'panneaux', name: 'Panneaux', icon: '🚸', questions: 14, mastered: 9 },
    { id: 'depassement', name: 'Dépassement', icon: '➡️', questions: 7, mastered: 3 },
    { id: 'secours', name: 'Secours & Urgence', icon: '🚑', questions: 5, mastered: 2 },
  ];

  const questions = [
    {
      question: 'En agglomération, vous approchez d\'un passage à niveau non gardé. Vitesse maximale autorisée ?',
      options: ['30 km/h', '50 km/h', '70 km/h', '80 km/h'],
      correct: 0,
      explanation: 'La vitesse maximale en agglomération est de 50 km/h, même près d\'un passage à niveau.',
    },
    {
      question: 'Un véhicule prioritaire (gyrophare bleu) approche. Que devez-vous faire ?',
      options: ['Accélérer pour dégager', 'Ralentir et vous ranger à droite', 'Continuer normalement', 'Freiner brusquement'],
      correct: 1,
      explanation: 'Vous devez faciliter le passage des véhicules d\'urgence en vous rangeant à droite et en ralentissant.',
    },
    {
      question: 'À une intersection sans signalisation, qui est prioritaire ?',
      options: ['Le véhicule venant de droite', 'Le véhicule venant de gauche', 'Le véhicule le plus gros', 'Le véhicule qui arrive en premier'],
      correct: 0,
      explanation: 'La règle générale de priorité à droite s\'applique en l\'absence de signalisation.',
    },
    {
      question: 'La distance de sécurité minimum sur autoroute à 130 km/h est de :',
      options: ['50 mètres', '73 mètres', '100 mètres', '130 mètres'],
      correct: 1,
      explanation: 'La distance de sécurité correspond à 2 secondes, soit environ 73 mètres à 130 km/h.',
    },
    {
      question: 'Un panneau STOP implique :',
      options: ['Un simple ralentissement', 'Un arrêt obligatoire', 'Une cèdez-le-passage', 'Un coup de klaxon'],
      correct: 1,
      explanation: 'Le panneau STOP impose un arrêt complet avant de s\'engager dans l\'intersection.',
    },
  ];

  const q = questions[currentQuestion];
  const topic = topics.find((t) => t.id === selectedTopic);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === q.correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
  };

  return (
    <motion.div {...staggerContainer} animate className="space-y-4">
      {/* Topic Selection */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Thèmes d&apos;Étude
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sélectionnez un thème pour pratiquer les questions du code de la route.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTopic(t.id); handleReset(); }}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                    selectedTopic === t.id
                      ? 'bg-emerald-600/15 border-emerald-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${selectedTopic === t.id ? 'text-emerald-400' : 'text-white'}`}>
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {t.mastered}/{t.questions} maîtrisées
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  {topic?.name || 'Question'}
                </CardTitle>
                <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                  {currentQuestion + 1}/{questions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white text-sm leading-relaxed">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let borderColor = 'border-slate-700';
                  let bg = 'bg-slate-800/50';
                  let textColor = 'text-slate-300';
                  if (showResult) {
                    if (idx === q.correct) {
                      borderColor = 'border-emerald-500';
                      bg = 'bg-emerald-500/10';
                      textColor = 'text-emerald-400';
                    } else if (idx === selectedAnswer && idx !== q.correct) {
                      borderColor = 'border-red-500';
                      bg = 'bg-red-500/10';
                      textColor = 'text-red-400';
                    }
                  } else if (selectedAnswer === idx) {
                    borderColor = 'border-emerald-500';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${bg} transition-all text-left`}
                      disabled={showResult}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${showResult && idx === q.correct ? 'bg-emerald-500 text-white' : showResult && idx === selectedAnswer ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-sm ${textColor}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`p-3 rounded-lg border ${selectedAnswer === q.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {selectedAnswer === q.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-400" />
                      )}
                      <span className={`text-sm font-medium ${selectedAnswer === q.correct ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedAnswer === q.correct ? 'Correct !' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{q.explanation}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {currentQuestion < questions.length - 1 ? (
                      <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                        Question suivante
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={handleReset} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Recommencer
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Knowledge Gaps + Stats */}
        <motion.div {...fadeUp} className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Score actuel</span>
                <span className="text-lg font-bold text-emerald-400">
                  {questions.length > 0 ? Math.round((correctCount / Math.max(1, currentQuestion + (showResult ? 1 : 0))) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Correctes</span>
                <span className="text-emerald-400 font-mono">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Incorrectes</span>
                <span className="text-red-400 font-mono">{currentQuestion + (showResult ? 1 : 0) - correctCount}</span>
              </div>
              <Separator className="bg-slate-800" />
              <div className="text-xs text-slate-400">
                <span className="text-emerald-400 font-medium">Conseil :</span> Concentrez-vous sur les priorités et la signalisation pour améliorer votre score.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Lacunes Identifiées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Intersections', 'Dépassement', 'Secours'].map((gap) => (
                <div key={gap} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <span className="text-sm text-amber-400">{gap}</span>
                  <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">
                    À revoir
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-slate-500 mt-2">
                Pratiquez ces thèmes pour combler vos lacunes avant l&apos;examen.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 5: Behavior Analysis
// ═══════════════════════════════════════════════════════════
function BehaviorAnalysisTab() {
  const store = useDrivingSessionStore();

  const fatigueLevel = store.events.filter((e) => e.severity === 'dangerous').length > 3 ? 'high' : store.events.filter((e) => e.severity === 'harsh').length > 5 ? 'medium' : 'low';
  const stressLevel = store.events.filter((e) => e.type === 'brake' && e.severity === 'harsh').length > 2 ? 'high' : store.events.filter((e) => e.type === 'brake').length > 5 ? 'medium' : 'low';

  const fatigueConfig: Record<string, { label: string; color: string; bg: string; percent: number }> = {
    low: { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500', percent: 20 },
    medium: { label: 'Modéré', color: 'text-amber-400', bg: 'bg-amber-500', percent: 55 },
    high: { label: 'Élevé', color: 'text-red-400', bg: 'bg-red-500', percent: 85 },
  };
  const stressConfig: Record<string, { label: string; color: string; bg: string; percent: number }> = {
    low: { label: 'Détendu', color: 'text-emerald-400', bg: 'bg-emerald-500', percent: 25 },
    medium: { label: 'Tendu', color: 'text-amber-400', bg: 'bg-amber-500', percent: 60 },
    high: { label: 'Stressé', color: 'text-red-400', bg: 'bg-red-500', percent: 90 },
  };

  const fatigue = fatigueConfig[fatigueLevel];
  const stress = stressConfig[stressLevel];

  const checklist = [
    { name: 'Rétroviseur intérieur', icon: Eye, checked: true, essential: true },
    { name: 'Rétroviseur gauche', icon: Eye, checked: true, essential: true },
    { name: 'Rétroviseur droit', icon: Eye, checked: false, essential: true },
    { name: 'Angle mort gauche', icon: Shield, checked: false, essential: true },
    { name: 'Angle mort droit', icon: Shield, checked: false, essential: true },
    { name: 'Position du siège', icon: Car, checked: true, essential: true },
    { name: 'Ceinture de sécurité', icon: Shield, checked: true, essential: true },
    { name: 'Rétroviseurs extérieurs', icon: Eye, checked: false, essential: false },
    { name: 'Appuie-tête', icon: Car, checked: true, essential: false },
    { name: 'Éclairage', icon: Zap, checked: true, essential: false },
  ];

  const distractions = [
    { type: 'Téléphone portable', level: 0, icon: '📱', desc: 'Aucune détection' },
    { type: 'Distraction visuelle', level: 1, icon: '👁️', desc: 'Regard prolongé hors route' },
    { type: 'Fatigue', level: fatigueLevel === 'high' ? 3 : fatigueLevel === 'medium' ? 2 : 0, icon: '😴', desc: fatigue.label },
    { type: 'Bavardage', level: 0, icon: '🗣️', desc: 'Aucune détection' },
  ];

  const distractionLevels: Record<number, { label: string; color: string }> = {
    0: { label: 'Aucun', color: 'text-emerald-400' },
    1: { label: 'Léger', color: 'text-amber-400' },
    2: { label: 'Modéré', color: 'text-orange-400' },
    3: { label: 'Élevé', color: 'text-red-400' },
  };

  return (
    <motion.div {...staggerContainer} animate className="space-y-4">
      {/* Fatigue & Stress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-emerald-500" />
                Détection de Fatigue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">Niveau de fatigue</span>
                    <span className={`text-sm font-medium ${fatigue.color}`}>{fatigue.label}</span>
                  </div>
                  <Progress value={fatigue.percent} className={`h-3 [&>div]:${fatigue.bg}`} />
                </div>
                <div className={`text-2xl font-bold ${fatigue.color}`}>{fatigue.percent}%</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Bâillements</div>
                  <div className="text-sm font-bold text-white mt-1">2</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Yawns/min</div>
                  <div className="text-sm font-bold text-white mt-1">0.3</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Paupières</div>
                  <div className="text-sm font-bold text-white mt-1">OK</div>
                </div>
              </div>
              {fatigueLevel === 'high' && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">Alerte fatigue élevée ! Prenez une pause de 15 minutes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Surveillance du Stress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">Niveau de stress</span>
                    <span className={`text-sm font-medium ${stress.color}`}>{stress.label}</span>
                  </div>
                  <Progress value={stress.percent} className={`h-3 [&>div]:${stress.bg}`} />
                </div>
                <div className={`text-2xl font-bold ${stress.color}`}>{stress.percent}%</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Pouls estimé</div>
                  <div className="text-sm font-bold text-white mt-1">75 bpm</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Freinages brusques</div>
                  <div className="text-sm font-bold text-white mt-1">{store.events.filter((e) => e.type === 'brake' && e.severity === 'harsh').length}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Variation</div>
                  <div className="text-sm font-bold text-white mt-1">Normal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Distractions */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              Alertes de Distraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {distractions.map((d) => (
                <div key={d.type} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                  <span className="text-2xl">{d.icon}</span>
                  <h4 className="text-sm text-white mt-2">{d.type}</h4>
                  <p className={`text-xs mt-1 ${distractionLevels[d.level].color}`}>
                    {distractionLevels[d.level].label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{d.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Checklist: Mirrors, Blind Spot, Seat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                Vérification Rétroviseurs & Angles Morts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.filter((c) => c.essential).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.checked ? 'bg-emerald-500/15' : 'bg-slate-700'}`}>
                        {item.checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <Icon className={`w-4 h-4 ${item.checked ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className={`text-sm ${item.checked ? 'text-white' : 'text-slate-400'}`}>{item.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Revérifier
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Circle className="w-4 h-4 text-emerald-500" />
                Vérification Poste de Conduite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.filter((c) => !c.essential || c.name === 'Position du siège' || c.name === 'Ceinture de sécurité').map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.checked ? 'bg-emerald-500/15' : 'bg-slate-700'}`}>
                        {item.checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <Icon className={`w-4 h-4 ${item.checked ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className={`text-sm ${item.checked ? 'text-white' : 'text-slate-400'}`}>{item.name}</span>
                    </div>
                  );
                })}
              </div>
              <Separator className="bg-slate-800 my-3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Suivi oculaire</div>
                  <div className="text-xs text-emerald-400 mt-1">● Actif</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Mouvement tête</div>
                  <div className="text-xs text-emerald-400 mt-1">● Normal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 6: Session History
// ═══════════════════════════════════════════════════════════
function SessionHistoryTab() {
  const store = useDrivingSessionStore();
  const [loading, setLoading] = useState(false);
  const [sessionsData, setSessionsData] = useState<Array<{
    id: string; type: string; status: string; startTime: string; duration: number;
    distance: number; score: number | null; harshBrakes: number; harshAccel: number;
    harshTurns: number; speedViolations: number; weather: string | null;
  }>>([]);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (store.filterType) params.set('type', store.filterType);
      if (store.filterStatus) params.set('status', store.filterStatus);
      if (store.filterDateFrom) params.set('dateFrom', store.filterDateFrom);
      if (store.filterDateTo) params.set('dateTo', store.filterDateTo);

      const res = await fetch(`/api/driving?${params.toString()}`);
      const data = await res.json();
      setSessionsData(data.sessions || []);
    } catch {
      console.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [store.filterType, store.filterStatus, store.filterDateFrom, store.filterDateTo]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const formatDurationSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { label: string; cls: string }> = {
      active: { label: 'En cours', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
      paused: { label: 'Pause', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
      completed: { label: 'Terminé', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
      cancelled: { label: 'Annulé', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
    };
    const c = config[status] || config.completed;
    return <Badge className={`${c.cls} text-[10px]`}>{c.label}</Badge>;
  };

  const typeLabels: Record<string, string> = {
    lesson: 'Leçon',
    practice: 'Pratique',
    exam: 'Examen',
    evaluation: 'Évaluation',
    free_drive: 'Balade libre',
  };

  const chartConfig: ChartConfig = {
    score: { label: 'Score', color: '#10b981' },
  };

  return (
    <motion.div {...staggerContainer} animate className="space-y-4">
      {/* Filters */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-500" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <Select value={store.filterType} onValueChange={store.setFilterType}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-sm h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="lesson">Leçon</SelectItem>
                  <SelectItem value="practice">Pratique</SelectItem>
                  <SelectItem value="exam">Examen</SelectItem>
                  <SelectItem value="evaluation">Évaluation</SelectItem>
                  <SelectItem value="free_drive">Balade libre</SelectItem>
                </SelectContent>
              </Select>
              <Select value={store.filterStatus} onValueChange={store.setFilterStatus}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-sm h-9">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="paused">Pause</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={store.filterDateFrom}
                onChange={(e) => store.setFilterDateFrom(e.target.value)}
                className="bg-slate-800 border-slate-700 text-sm h-9"
                placeholder="De"
              />
              <Input
                type="date"
                value={store.filterDateTo}
                onChange={(e) => store.setFilterDateTo(e.target.value)}
                className="bg-slate-800 border-slate-700 text-sm h-9"
                placeholder="À"
              />
              <Button
                onClick={loadSessions}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Chart */}
      {!loading && sessionsData.length > 0 && (
        <motion.div {...fadeUp}>
          <Card className="bg-slate-900 border-slate-800 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">Évolution des Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <BarChart data={sessionsData.filter((s) => s.score !== null).slice(0, 15).map((s) => ({ date: new Date(s.startTime).toLocaleDateString('fr-FR'), score: s.score ?? 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sessions Table */}
      <motion.div {...fadeUp}>
        <Card className="bg-slate-900 border-slate-800 rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" />
                Historique des Sessions
              </CardTitle>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                {sessionsData.length} sessions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-slate-800 rounded-lg" />
                ))}
              </div>
            ) : sessionsData.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">Aucune session trouvée</h3>
                <p className="text-sm text-slate-500">Commencez une session pour voir votre historique.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 text-xs">Date</TableHead>
                      <TableHead className="text-slate-400 text-xs">Type</TableHead>
                      <TableHead className="text-slate-400 text-xs">Statut</TableHead>
                      <TableHead className="text-slate-400 text-xs">Durée</TableHead>
                      <TableHead className="text-slate-400 text-xs">Distance</TableHead>
                      <TableHead className="text-slate-400 text-xs">Score</TableHead>
                      <TableHead className="text-slate-400 text-xs">Événements</TableHead>
                      <TableHead className="text-slate-400 text-xs">Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionsData.map((s) => (
                      <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="text-slate-300 text-xs">
                          {new Date(s.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                            {typeLabels[s.type] || s.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{statusBadge(s.status)}</TableCell>
                        <TableCell className="text-slate-300 text-xs font-mono">{formatDurationSec(s.duration)}</TableCell>
                        <TableCell className="text-slate-300 text-xs">{s.distance.toFixed(1)} km</TableCell>
                        <TableCell>
                          {s.score !== null ? (
                            <span className={`text-xs font-mono font-bold ${s.score >= 80 ? 'text-emerald-400' : s.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                              {s.score}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">
                          {s.harshBrakes + s.harshAccel + s.harshTurns + s.speedViolations}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDetail(selectedDetail === s.id ? null : s.id)}
                            className="text-emerald-400 hover:text-emerald-300 text-xs h-7 px-2"
                          >
                            <Info className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-500" />
                  Détails de la Session
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              {(() => {
                const s = sessionsData.find((x) => x.id === selectedDetail);
                if (!s) return null;
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">Date</div>
                        <div className="text-sm text-white">{new Date(s.startTime).toLocaleString('fr-FR')}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">Type</div>
                        <div className="text-sm text-white">{typeLabels[s.type] || s.type}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">Durée</div>
                        <div className="text-sm text-white font-mono">{formatDurationSec(s.duration)}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">Distance</div>
                        <div className="text-sm text-white">{s.distance.toFixed(1)} km</div>
                      </div>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-slate-400">Freinages brusques</span>
                        <span className="text-sm text-white ml-auto">{s.harshBrakes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-slate-400">Accélérations brusques</span>
                        <span className="text-sm text-white ml-auto">{s.harshAccel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Circle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-slate-400">Virages brusques</span>
                        <span className="text-sm text-white ml-auto">{s.harshTurns}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs text-slate-400">Excès de vitesse</span>
                        <span className="text-sm text-white ml-auto">{s.speedViolations}</span>
                      </div>
                    </div>
                    {s.weather && (
                      <Separator className="bg-slate-800" />
                    )}
                    {s.weather && (
                      <div className="flex items-center gap-2">
                        <Wind className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-slate-400">Météo</span>
                        <span className="text-sm text-white ml-auto">{weatherLabels[s.weather as WeatherCondition] || s.weather}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN: AIDrivingModule
// ═══════════════════════════════════════════════════════════
export default function AIDrivingModule() {
  const [activeTab, setActiveTab] = useState('instructor');
  const store = useDrivingSessionStore();

  // Load sessions on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/driving');
        const data = await res.json();
        store.setSessions(data.sessions || []);
      } catch {
        // Silent fail on initial load
      }
    }
    load();
  }, []);

  return (
    <div className="pt-20 pb-8 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-emerald-500" />
                </div>
                Instructeur IA de Conduite
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                ADSO V4.1 — Module Instructeur de Conduite Intelligent
              </p>
            </div>
            <div className="flex items-center gap-3">
              {store.sessionStatus !== 'idle' && (
                <Badge className={`animate-pulse ${store.sessionStatus === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${store.sessionStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {store.sessionStatus === 'active' ? 'Session active' : 'En pause'}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-slate-900 border border-slate-800 rounded-xl p-1 h-auto flex flex-wrap gap-1">
              <TabsTrigger
                value="instructor"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <Brain className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Instructeur IA</span>
                <span className="sm:hidden">IA</span>
              </TabsTrigger>
              <TabsTrigger
                value="coach"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Coach IA
              </TabsTrigger>
              <TabsTrigger
                value="examiner"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <ClipboardCheck className="w-4 h-4 mr-1.5" />
                Examinateur IA
              </TabsTrigger>
              <TabsTrigger
                value="tutor"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                Tuteur IA
              </TabsTrigger>
              <TabsTrigger
                value="behavior"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <Activity className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Comportement</span>
                <span className="sm:hidden">Comp.</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400"
              >
                <History className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Historique</span>
                <span className="sm:hidden">Hist.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instructor">
              <AIInstructorTab />
            </TabsContent>
            <TabsContent value="coach">
              <AICoachTab />
            </TabsContent>
            <TabsContent value="examiner">
              <AIExaminerTab />
            </TabsContent>
            <TabsContent value="tutor">
              <AITutorTab />
            </TabsContent>
            <TabsContent value="behavior">
              <BehaviorAnalysisTab />
            </TabsContent>
            <TabsContent value="history">
              <SessionHistoryTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}


