'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries, type Country } from '@/data/countries';
import { licenseTypes, type LicenseType } from '@/data/licenses';
import { quizQuestions, type QuizQuestion } from '@/data/quiz-questions';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import ExamPlatform from '@/components/modules/learning/ExamPlatform';
import ProgressDashboard from '@/components/modules/learning/ProgressDashboard';
import {
  Globe, Car, Bike, Truck, Bus, Search, Clock, Star, Trophy,
  ShieldAlert, TriangleAlert, CircleDot, Info, TrafficCone, ArrowRightLeft,
  ChevronRight, PlayCircle, CheckCircle2, XCircle, Timer,
  Award, BookOpen, Target, Flame, TrendingUp, GraduationCap,
  MapPin, CreditCard, Languages, ArrowLeft, Eye, Ban,
  CircleAlert, OctagonAlert, SquareParking, Cross, Route,
  AlertTriangle, Circle, ArrowDown, ArrowUp, MoveHorizontal,
  PersonStanding, Minus, ParkingCircle, Hospital, Waypoints,
  CircleOff, BanIcon, Hand, Pause, Sparkles, Lock, TrainFront
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────

type CourseFromAPI = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  order: number;
  icon: string | null;
  isPremium: boolean;
  modules: CourseModuleFromAPI[];
  studentProgress?: {
    id: string;
    progress: number;
    status: string;
    lastAccess: string | null;
  } | null;
};

type CourseModuleFromAPI = {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: string;
  order: number;
  duration: number;
};

type RoadSignCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  signs: RoadSign[];
};

type RoadSign = {
  name: string;
  description: string;
  whenToObey: string;
  shape: 'circle' | 'triangle' | 'square' | 'octagon' | 'rectangle' | 'diamond';
  icon: React.ReactNode;
  signColor: string;
};

type ExamState = 'idle' | 'running' | 'finished';

// ─── Road Signs Data ─────────────────────────────────────────────────────

const roadSignCategories: RoadSignCategory[] = [
  {
    id: 'interdiction',
    name: 'Panneaux d\'interdiction',
    description: 'Signes rouges ronds indiquant ce qui est interdit',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-800/50',
    signs: [
      {
        name: 'STOP',
        description: 'Arrêt obligatoire. Le conducteur doit marquer un temps d\'arrêt avant de s\'engager.',
        whenToObey: 'À chaque intersection où ce panneau est présent, même en l\'absence de trafic.',
        shape: 'octagon',
        signColor: 'bg-red-600',
        icon: <OctagonAlert className="h-8 w-8 text-white" />,
      },
      {
        name: 'Sens interdit',
        description: 'Interdiction de circuler dans le sens indiqué par le panneau.',
        whenToObey: 'Dès que le panneau est visible, ne pas s\'engager dans cette direction.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <BanIcon className="h-8 w-8 text-white" />,
      },
      {
        name: 'Interdiction de tourner à droite',
        description: 'Il est interdit de tourner à droite à l\'intersection suivante.',
        whenToObey: 'À l\'approche de l\'intersection concernée.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ArrowRightLeft className="h-6 w-6 text-white rotate-[-45deg]" /></div>,
      },
      {
        name: 'Interdiction de tourner à gauche',
        description: 'Il est interdit de tourner à gauche à l\'intersection suivante.',
        whenToObey: 'À l\'approche de l\'intersection concernée.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ArrowRightLeft className="h-6 w-6 text-white rotate-45" /></div>,
      },
      {
        name: 'Limite de vitesse 30 km/h',
        description: 'La vitesse maximale autorisée est de 30 km/h dans cette zone.',
        whenToObey: 'Dès l\'entrée de la zone et jusqu\'au panneau de fin de limitation.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center text-white font-bold text-xs">30</div>,
      },
      {
        name: 'Limite de vitesse 50 km/h',
        description: 'La vitesse maximale autorisée est de 50 km/h (vitesse par défaut en agglomération).',
        whenToObey: 'En agglomération ou dès que le panneau est en place.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center text-white font-bold text-xs">50</div>,
      },
      {
        name: 'Limite de vitesse 90 km/h',
        description: 'La vitesse maximale autorisée est de 90 km/h sur route.',
        whenToObey: 'Sur routes à deux voies en dehors des agglomérations.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center text-white font-bold text-xs">90</div>,
      },
      {
        name: 'Limite de vitesse 130 km/h',
        description: 'La vitesse maximale autorisée est de 130 km/h sur autoroute par temps sec.',
        whenToObey: 'Sur autoroute, réduite à 110 km/h par temps de pluie.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center text-white font-bold text-[10px]">130</div>,
      },
      {
        name: 'Interdiction de dépasser',
        description: 'Il est interdit de dépasser les véhicules circulant dans le même sens.',
        whenToObey: 'Sur toute la section de route concernée par le panneau.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <div className="flex h-8 w-8 items-center justify-center"><MoveHorizontal className="h-6 w-6 text-white" /></div>,
      },
      {
        name: 'Circulation interdite aux piétons',
        description: 'Les piétons ne sont pas autorisés à circuler sur cette voie.',
        whenToObey: 'Piétons doivent utiliser les trottoirs ou passages prévus.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <PersonStanding className="h-8 w-8 text-white" />,
      },
    ],
  },
  {
    id: 'obligation',
    name: 'Panneaux d\'obligation',
    description: 'Signes bleus ronds imposant une direction ou une action',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-800/50',
    signs: [
      {
        name: 'Sens obligatoire (tout droit)',
        description: 'Le conducteur doit poursuivre tout droit. Tout autre direction est interdite.',
        whenToObey: 'À l\'approche de l\'intersection, suivre uniquement la direction indiquée.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <ArrowUp className="h-8 w-8 text-white" />,
      },
      {
        name: 'Tourner à droite obligatoire',
        description: 'Le conducteur est obligé de tourner à droite à la prochaine intersection.',
        whenToObey: 'À l\'intersection, prendre uniquement la direction droite.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ChevronRight className="h-7 w-7 text-white" /></div>,
      },
      {
        name: 'Tourner à gauche obligatoire',
        description: 'Le conducteur est obligé de tourner à gauche à la prochaine intersection.',
        whenToObey: 'À l\'intersection, prendre uniquement la direction gauche.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ChevronRight className="h-7 w-7 text-white rotate-180" /></div>,
      },
      {
        name: 'Contournement obligatoire par la droite',
        description: 'Le conducteur doit contourner l\'obstacle en passant par la droite.',
        whenToObey: 'En présence d\'un obstacle sur la chaussée.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <ArrowRightLeft className="h-7 w-7 text-white" />,
      },
      {
        name: 'Contournement obligatoire par la gauche',
        description: 'Le conducteur doit contourner l\'obstacle en passant par la gauche.',
        whenToObey: 'En présence d\'un obstacle sur la chaussée.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <ArrowRightLeft className="h-7 w-7 text-white rotate-180" />,
      },
      {
        name: 'Piste cyclable obligatoire',
        description: 'Les cyclistes doivent utiliser la piste cyclable.',
        whenToObey: 'Dès que la piste est disponible, les cyclistes doivent l\'emprunter.',
        shape: 'circle',
        signColor: 'bg-blue-600',
        icon: <Bike className="h-7 w-7 text-white" />,
      },
    ],
  },
  {
    id: 'danger',
    name: 'Panneaux de danger',
    description: 'Signes triangulaires avertissant d\'un danger potentiel',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-800/50',
    signs: [
      {
        name: 'Virage dangereux à droite',
        description: 'Avertissement d\'un virage serré à droite. Réduisez votre vitesse.',
        whenToObey: 'Avant le virage, ralentir et adapter sa trajectoire.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ChevronRight className="h-7 w-7 text-white rotate-[-30deg]" /></div>,
      },
      {
        name: 'Virage dangereux à gauche',
        description: 'Avertissement d\'un virage serré à gauche. Réduisez votre vitesse.',
        whenToObey: 'Avant le virage, ralentir et adapter sa trajectoire.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ChevronRight className="h-7 w-7 text-white rotate-210" /></div>,
      },
      {
        name: 'Cédez le passage',
        description: 'Le conducteur doit céder le passage aux véhicules sur la route prioritaire.',
        whenToObey: 'Ralentir et s\'arrêter si nécessaire avant l\'intersection.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <TriangleAlert className="h-8 w-8 text-white" />,
      },
      {
        name: 'Rétrécissement de la chaussée',
        description: 'La chaussée se rétrécit. Les véhicules doivent se serrer.',
        whenToObey: 'Ralentir et laisser passer les véhicules en sens inverse.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <MoveHorizontal className="h-7 w-7 text-white" />,
      },
      {
        name: 'Passage à niveau sans barrière',
        description: 'Un passage à niveau sans barrières se trouve à proximité.',
        whenToObey: 'Ralentir, regarder des deux côtés et s\'arrêter si un train approche.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <TrainFront className="h-7 w-7 text-white" />,
      },
      {
        name: 'Danger (générique)',
        description: 'Panonceau de danger générique indiquant un risque non spécifié.',
        whenToObey: 'Redoubler de vigilance dans la zone signalée.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <AlertTriangle className="h-8 w-8 text-white" />,
      },
      {
        name: 'Glissement de terrain',
        description: 'Risque de chutes de pierres ou glissement de terrain.',
        whenToObey: 'Ne pas s\'arrêter et circuler à vitesse réduite.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <TrendingUp className="h-7 w-7 text-white rotate-90" />,
      },
      {
        name: 'Travaux',
        description: 'Travaux en cours sur la chaussée. Circulation perturbée.',
        whenToObey: 'Ralentir, respecter les signalisations temporaires.',
        shape: 'triangle',
        signColor: 'bg-amber-500',
        icon: <TrafficCone className="h-7 w-7 text-white" />,
      },
    ],
  },
  {
    id: 'indication',
    name: 'Panneaux d\'indication',
    description: 'Signes rectangulaires fournissant des informations utiles',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-800/50',
    signs: [
      {
        name: 'Parking',
        description: 'Indique un parking disponible à proximité.',
        whenToObey: 'Respecter les règles de stationnement du parking.',
        shape: 'square',
        signColor: 'bg-blue-600',
        icon: <SquareParking className="h-8 w-8 text-white" />,
      },
      {
        name: 'Hôpital',
        description: 'Indique la proximité d\'un hôpital ou d\'un service d\'urgence.',
        whenToObey: 'Pas de klaxon, circuler lentement à proximité.',
        shape: 'square',
        signColor: 'bg-blue-600',
        icon: <Hospital className="h-8 w-8 text-white" />,
      },
      {
        name: 'Route prioritaire',
        description: 'Indique que la route sur laquelle on circule est prioritaire.',
        whenToObey: 'Bénéficiez de la priorité aux intersections suivantes.',
        shape: 'square',
        signColor: 'bg-emerald-600',
        icon: <Route className="h-8 w-8 text-white" />,
      },
      {
        name: 'Fin de route prioritaire',
        description: 'La route prioritaire se termine. La règle de priorité à droite s\'applique.',
        whenToObey: 'Céder le passage aux véhicules venant de la droite.',
        shape: 'square',
        signColor: 'bg-slate-500',
        icon: <Route className="h-8 w-8 text-white" />,
      },
      {
        name: 'Passage piéton',
        description: 'Indique un passage pour piétons.',
        whenToObey: 'Céder le passage aux piétons qui s\'engagent ou sont sur le passage.',
        shape: 'square',
        signColor: 'bg-blue-600',
        icon: <PersonStanding className="h-8 w-8 text-white" />,
      },
      {
        name: 'Zone de rencontre',
        description: 'Zone où piétons et véhicules partagent l\'espace. Vitesse limitée à 20 km/h.',
        whenToObey: 'Circuler à 20 km/h max et céder le passage aux piétons.',
        shape: 'rectangle',
        signColor: 'bg-blue-600',
        icon: <PersonStanding className="h-8 w-8 text-white" />,
      },
      {
        name: 'Autoroute',
        description: 'Indique l\'accès à une autoroute.',
        whenToObey: 'Respecter les règles spécifiques de l\'autoroute.',
        shape: 'rectangle',
        signColor: 'bg-emerald-600',
        icon: <Waypoints className="h-8 w-8 text-white" />,
      },
      {
        name: 'Fin d\'autoroute',
        description: 'Indique la sortie d\'autoroute.',
        whenToObey: 'Adapter sa vitesse aux règles de la route ordinaire.',
        shape: 'rectangle',
        signColor: 'bg-slate-500',
        icon: <Waypoints className="h-8 w-8 text-white" />,
      },
    ],
  },
  {
    id: 'feux',
    name: 'Feux tricolores',
    description: 'Signalisation lumineuse régulant le trafic aux intersections',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-800/50',
    signs: [
      {
        name: 'Feu rouge — Stop',
        description: 'L\'arrêt est obligatoire. Aucun véhicule ne peut franchir la ligne d\'arrêt.',
        whenToObey: 'Toujours. L\'arrêt doit être complet devant la ligne d\'arrêt.',
        shape: 'circle',
        signColor: 'bg-red-600',
        icon: <Circle className="h-8 w-8 text-white fill-white" />,
      },
      {
        name: 'Feu orange — Alerte',
        description: 'Le conducteur doit s\'arrêter sauf si son véhicule est trop proche pour s\'arrêter en sécurité.',
        whenToObey: 'Ralentir et se préparer à s\'arrêter. Ne pas accélérer.',
        shape: 'circle',
        signColor: 'bg-amber-500',
        icon: <Circle className="h-8 w-8 text-amber-200 fill-amber-200" />,
      },
      {
        name: 'Feu vert — Passage',
        description: 'Le passage est autorisé. Le conducteur peut s\'engager dans l\'intersection.',
        whenToObey: 'Vérifier que l\'intersection est dégagée avant de s\'engager.',
        shape: 'circle',
        signColor: 'bg-emerald-500',
        icon: <Circle className="h-8 w-8 text-white fill-white" />,
      },
    ],
  },
  {
    id: 'marquages',
    name: 'Marquages au sol',
    description: 'Lignes et marquages peints sur la chaussée',
    color: 'text-slate-300',
    bgColor: 'bg-slate-800/40',
    borderColor: 'border-slate-600/50',
    signs: [
      {
        name: 'Ligne continue',
        description: 'Ligne blanche continue interdisant le dépassement et le franchissement.',
        whenToObey: 'Ne pas franchir la ligne. Ne pas dépasser.',
        shape: 'rectangle',
        signColor: 'bg-white',
        icon: <Minus className="h-8 w-8 text-slate-900" />,
      },
      {
        name: 'Ligne discontinue',
        description: 'Ligne blanche discontinue autorisant le dépassement.',
        whenToObey: 'Le dépassement est autorisé si la visibilité est suffisante.',
        shape: 'rectangle',
        signColor: 'bg-white',
        icon: <div className="flex flex-col gap-0.5"><Minus className="h-3 w-8 text-slate-900" /><Minus className="h-3 w-8 text-slate-900" /></div>,
      },
      {
        name: 'Passage piéton',
        description: 'Bande blanche sur la chaussée indiquant un passage protégé pour piétons.',
        whenToObey: 'Céder le passage aux piétons engagés sur le passage.',
        shape: 'rectangle',
        signColor: 'bg-white',
        icon: <PersonStanding className="h-8 w-8 text-slate-900" />,
      },
      {
        name: 'Ligne d\'arrêt (feu/STOP)',
        description: 'Ligne blanche continue indiquant où le véhicule doit s\'arrêter.',
        whenToObey: 'S\'arrêter avant cette ligne à un feu rouge ou STOP.',
        shape: 'rectangle',
        signColor: 'bg-white',
        icon: <div className="flex h-8 w-8 items-center justify-center"><ArrowDown className="h-6 w-6 text-slate-900" /></div>,
      },
      {
        name: 'Zebrage diagonal (voie d\'arrêt d\'urgence)',
        description: 'Zebrage indiquant une voie réservée aux véhicules d\'urgence.',
        whenToObey: 'Ne jamais circuler ni stationner sur un zèbre d\'urgence.',
        shape: 'rectangle',
        signColor: 'bg-white',
        icon: <div className="flex h-8 w-8 items-center justify-center text-slate-900 font-bold text-lg">E</div>,
      },
    ],
  },
];

// ─── Mock Exam History ────────────────────────────────────────────────────

const mockExamHistory = [
  { id: '1', date: '2025-01-15', score: 18, total: 20, passed: true, duration: '14:32' },
  { id: '2', date: '2025-01-12', score: 15, total: 20, passed: true, duration: '17:05' },
  { id: '3', date: '2025-01-10', score: 12, total: 20, passed: false, duration: '19:50' },
  { id: '4', date: '2025-01-08', score: 16, total: 20, passed: true, duration: '16:20' },
  { id: '5', date: '2025-01-05', score: 10, total: 20, passed: false, duration: '20:00' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getLicenseIcon(iconName: string) {
  switch (iconName) {
    case 'Car': return <Car className="h-6 w-6" />;
    case 'Bike': return <Bike className="h-6 w-6" />;
    case 'Truck': return <Truck className="h-6 w-6" />;
    case 'Bus': return <Bus className="h-6 w-6" />;
    default: return <Car className="h-6 w-6" />;
  }
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    theory: 'Théorie',
    practice: 'Pratique',
    safety: 'Sécurité',
    regulations: 'Réglementation',
    'eco-driving': 'Éco-conduite',
    highway: 'Autoroute',
  };
  return map[category] || category;
}

function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };
  return map[level] || level;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

// ─── Sign Shape Component ─────────────────────────────────────────────────

function SignShape({ shape, signColor, children }: { shape: string; signColor: string; children: React.ReactNode }) {
  const baseClasses = 'flex items-center justify-center shrink-0';
  switch (shape) {
    case 'octagon':
      return (
        <div className={`${baseClasses} h-16 w-16 ${signColor} clip-octagon rounded-sm`}
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
          {children}
        </div>
      );
    case 'triangle':
      return (
        <div className={`${baseClasses} h-16 w-16 ${signColor} bg-transparent relative`}
          style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
          <div className="absolute inset-0 bg-white/10" style={{ clipPath: 'polygon(50% 8%, 92% 92%, 8% 92%)' }} />
          <div className="relative z-10 pt-5">{children}</div>
        </div>
      );
    case 'circle':
      return (
        <div className={`${baseClasses} h-16 w-16 ${signColor} rounded-full`}>{children}</div>
      );
    case 'square':
      return (
        <div className={`${baseClasses} h-14 w-14 ${signColor} rounded-sm`}>{children}</div>
      );
    case 'rectangle':
      return (
        <div className={`${baseClasses} h-12 w-16 ${signColor} rounded-sm`}>{children}</div>
      );
    default:
      return (
        <div className={`${baseClasses} h-14 w-14 ${signColor} rounded-sm`}>{children}</div>
      );
  }
}

// ─── Tab Animation Wrapper ────────────────────────────────────────────────

function TabAnimation({ children, keyProp }: { children: React.ReactNode; keyProp: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function LearningPlatform() {
  const [activeTab, setActiveTab] = useState('explorer');

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Plateforme d&rsquo;apprentissage
            </h1>
          </div>
          <p className="text-slate-400 ml-[52px]">
            Explorez les pays, formations, signalisation et passez vos examens
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 rounded-xl bg-slate-900/80 p-1.5">
            {[
              { value: 'explorer', label: 'Explorer', icon: <Globe className="h-4 w-4" /> },
              { value: 'cours', label: 'Cours', icon: <BookOpen className="h-4 w-4" /> },
              { value: 'signalisation', label: 'Signalisation', icon: <ShieldAlert className="h-4 w-4" /> },
              { value: 'examens', label: 'Examens', icon: <Target className="h-4 w-4" /> },
              { value: 'progression', label: 'Progression', icon: <TrendingUp className="h-4 w-4" /> },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-600/20 text-slate-400 transition-all"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="explorer" className="mt-0">
            <TabAnimation keyProp="explorer">
              <ExplorerTab />
            </TabAnimation>
          </TabsContent>

          <TabsContent value="cours" className="mt-0">
            <TabAnimation keyProp="cours">
              <CoursesTab />
            </TabAnimation>
          </TabsContent>

          <TabsContent value="signalisation" className="mt-0">
            <TabAnimation keyProp="signalisation">
              <SignalisationTab />
            </TabAnimation>
          </TabsContent>

          <TabsContent value="examens" className="mt-0">
            <TabAnimation keyProp="examens">
              <ExamPlatform />
            </TabAnimation>
          </TabsContent>

          <TabsContent value="progression" className="mt-0">
            <TabAnimation keyProp="progression">
              <ProgressDashboard />
            </TabAnimation>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Tab 1: Explorer ──────────────────────────────────────────────────────

function ExplorerTab() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tous');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const regions = useMemo(() => {
    const r = [...new Set(countries.map((c) => c.region))];
    return ['Tous', ...r];
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchRegion = selectedRegion === 'Tous' || c.region === selectedRegion;
      const matchSearch = searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [selectedRegion, searchQuery]);

  const countryLicenses = useMemo(() => {
    if (!selectedCountry) return [];
    return licenseTypes.filter((lt) => selectedCountry.licenseTypes.includes(lt.id));
  }, [selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Rechercher un pays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-slate-700 bg-slate-900 pl-9 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className={selectedRegion === region
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
              }
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {/* Country Grid */}
      {!selectedCountry ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredCountries.map((country) => (
            <motion.button
              key={country.code}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCountry(country)}
              className="group rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition-colors hover:border-emerald-600/50 hover:bg-slate-800/80"
            >
              <div className="text-3xl mb-2">{country.flag}</div>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                {country.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{country.region}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedCountry(null)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux pays
          </Button>

          {/* Country Details Card */}
          <Card className="border-slate-800 bg-slate-900 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedCountry.flag}</span>
                <div>
                  <CardTitle className="text-xl text-white">{selectedCountry.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {selectedCountry.region} · {selectedCountry.code}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={<ArrowRightLeft className="h-4 w-4" />}
                  label="Côté de conduite"
                  value={selectedCountry.drivingSide === 'right' ? 'Droite' : 'Gauche'}
                />
                <InfoItem
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Monnaie"
                  value={`${selectedCountry.currency.name} (${selectedCountry.currency.symbol})`}
                />
                <InfoItem
                  icon={<Languages className="h-4 w-4" />}
                  label="Langues"
                  value={selectedCountry.languages.join(', ')}
                />
                <InfoItem
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Paiements"
                  value={selectedCountry.paymentProviders.join(', ')}
                />
              </div>

              <Separator className="bg-slate-800" />

              {/* License Types */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                  Types de permis disponibles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {countryLicenses.map((license) => (
                    <LicenseCard key={license.id} license={license} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-600/20 text-emerald-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-200 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function LicenseCard({ license }: { license: LicenseType }) {
  const [expanded, setExpanded] = useState(false);
  const categoryColors = {
    automobile: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    motorcycle: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    heavy: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  const categoryLabels = {
    automobile: 'Automobile',
    motorcycle: 'Moto',
    heavy: 'Poids lourd',
  };

  return (
    <Card className="border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              {getLicenseIcon(license.icon)}
            </div>
            <div>
              <CardTitle className="text-base text-white">{license.shortName}</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Âge minimum : {license.minimumAge} ans
              </p>
            </div>
          </div>
          <Badge variant="outline" className={categoryColors[license.category]}>
            {categoryLabels[license.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-slate-400 line-clamp-2">{license.description}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/10 w-full justify-between"
        >
          {expanded ? 'Masquer les exigences' : 'Voir les exigences'}
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg bg-slate-800/50 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Exigences :</p>
                {license.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-400">{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ─── Tab 2: Cours ─────────────────────────────────────────────────────────

function CoursesTab() {
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses?userId=demo@adso.com');
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(courses.map((c) => c.category))];
    return ['all', ...cats];
  }, [courses]);

  const categoryLabels: Record<string, string> = {
    all: 'Tous',
    theory: 'Théorie',
    practice: 'Pratique',
    safety: 'Sécurité',
    regulations: 'Réglementation',
    'eco-driving': 'Éco-conduite',
    highway: 'Autoroute',
  };

  const filteredCourses = useMemo(() => {
    if (filterCategory === 'all') return courses;
    return courses.filter((c) => c.category === filterCategory);
  }, [courses, filterCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-3/4 bg-slate-800" />
              <Skeleton className="h-3 w-full bg-slate-800 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 bg-slate-800 mb-3" />
              <Skeleton className="h-2 w-full bg-slate-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-800/50 bg-red-950/20">
        <CardContent className="py-8 text-center">
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-300">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
            className={filterCategory === cat
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }
          >
            {categoryLabels[cat] || cat}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
          const isExpanded = expandedCourse === course.id;
          const progress = course.studentProgress?.progress ?? 0;
          const status = course.studentProgress?.status ?? 'not_started';

          return (
            <motion.div
              key={course.id}
              layout
              className={isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}
            >
              <Card className="border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-base text-white truncate">{course.title}</CardTitle>
                        {course.isPremium && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm text-slate-400 line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {getCategoryLabel(course.category)}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                      {getLevelLabel(course.level)}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.modules.length} modules
                    </Badge>
                    <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Progress */}
                  {status !== 'not_started' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {status === 'completed' ? 'Terminé' : 'En cours'}
                        </span>
                        <span className="text-emerald-400 font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-500" />
                    </div>
                  )}

                  {status === 'not_started' && !course.isPremium && (
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Commencer
                    </Button>
                  )}

                  {course.isPremium && status === 'not_started' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Débloquer (Premium)
                    </Button>
                  )}

                  {/* Expand/Collapse Modules */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 w-full justify-between"
                  >
                    {isExpanded ? 'Masquer les modules' : 'Voir les modules'}
                    <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Accordion type="single" collapsible className="w-full">
                          {course.modules.map((mod, idx) => (
                            <AccordionItem
                              key={mod.id}
                              value={mod.id}
                              className="border-slate-800"
                            >
                              <AccordionTrigger className="text-sm text-slate-300 hover:text-white hover:no-underline py-3">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-400">
                                    {idx + 1}
                                  </div>
                                  <span className="flex-1 truncate">{mod.title}</span>
                                  <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 text-[10px] ml-2">
                                    {mod.type === 'video' ? '🎬' : mod.type === 'quiz' ? '❓' : mod.type === 'interactive' ? '🎮' : '📖'}
                                    {' '}{mod.duration} min
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-slate-400 pl-10 pb-3">
                                <p className="line-clamp-4">{mod.content}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="py-12 text-center">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">Aucun cours trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Signalisation ─────────────────────────────────────────────────

function SignalisationTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadSignCategories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-left rounded-xl border p-5 transition-colors ${cat.bgColor} ${cat.borderColor} hover:border-opacity-80`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bgColor} border ${cat.borderColor}`}>
                  <ShieldAlert className={`h-5 w-5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${cat.color}`}>{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.signs.length} signes</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{cat.description}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux catégories
          </Button>

          {/* Category Header */}
          {(() => {
            const cat = roadSignCategories.find((c) => c.id === selectedCategory);
            if (!cat) return null;
            return (
              <>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bgColor} border ${cat.borderColor}`}>
                    <ShieldAlert className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${cat.color}`}>{cat.name}</h2>
                    <p className="text-sm text-slate-400">{cat.description}</p>
                  </div>
                </div>

                {/* Signs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.signs.map((sign, idx) => (
                    <motion.div
                      key={`${cat.id}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <SignShape shape={sign.shape} signColor={sign.signColor}>
                              {sign.icon}
                            </SignShape>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white mb-1">{sign.name}</h3>
                              <p className="text-xs text-slate-400 mb-2">{sign.description}</p>
                              <div className="flex items-start gap-1.5">
                                <Eye className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-emerald-400/80 italic">{sign.whenToObey}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Examens ───────────────────────────────────────────────────────

function ExamensTab() {
  const [examState, setExamState] = useState<ExamState>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  const startExam = useCallback(() => {
    const shuffled = shuffleArray(quizQuestions).slice(0, 20);
    setQuestions(shuffled);
    setAnswers(new Array(20).fill(null));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(20 * 60);
    setExamState('running');
  }, []);

  // Timer
  useEffect(() => {
    if (examState !== 'running' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExamState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examState, timeLeft]);

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setExamState('finished');
    }
  };

  const score = useMemo(() => {
    return answers.reduce((acc, ans, idx) => {
      if (ans !== null && questions[idx]?.correctIndex === ans) return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  const passed = score >= 16; // 16/20 needed to pass
  const timePercentage = (timeLeft / (20 * 60)) * 100;

  // Idle State
  if (examState === 'idle') {
    return (
      <div className="space-y-6">
        {/* Start Exam Card */}
        <Card className="border-slate-800 bg-slate-900 overflow-hidden">
          <CardContent className="py-10">
            <div className="text-center max-w-md mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/20 mx-auto mb-4">
                <Target className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Examen blanc</h2>
              <p className="text-slate-400 mb-6">
                Testez vos connaissances avec 20 questions aléatoires.
                Vous disposez de 20 minutes. Score minimum requis : 16/20.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CircleDot className="h-4 w-4 text-emerald-400" />
                  20 questions
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Timer className="h-4 w-4 text-emerald-400" />
                  20 minutes
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  Seuil : 16/20
                </div>
              </div>
              <Button
                size="lg"
                onClick={startExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Commencer l\'examen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exam History */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Historique des examens
          </h3>
          <div className="space-y-3">
            {mockExamHistory.map((exam) => (
              <Card key={exam.id} className="border-slate-800 bg-slate-900">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${exam.passed ? 'bg-emerald-600/20' : 'bg-red-600/20'}`}>
                        {exam.passed
                          ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          : <XCircle className="h-5 w-5 text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {exam.score}/{exam.total}
                          <span className={`ml-2 text-xs ${exam.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {exam.passed ? 'Réussi' : 'Échoué'}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">{exam.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Timer className="h-3.5 w-3.5" />
                      {exam.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Finished State
  if (examState === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <Card className={`border-2 overflow-hidden ${passed ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-red-500/50 bg-red-950/20'}`}>
          <CardContent className="py-10">
            <div className="text-center max-w-md mx-auto">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-4 ${passed ? 'bg-emerald-600/20' : 'bg-red-600/20'}`}>
                {passed
                  ? <Trophy className="h-10 w-10 text-emerald-400" />
                  : <XCircle className="h-10 w-10 text-red-400" />
                }
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                {passed ? 'Félicitations !' : 'Pas encore...'}
              </h2>
              <p className="text-slate-400 mb-6">
                {passed
                  ? 'Vous avez réussi l\'examen avec succès !'
                  : 'Le score minimum requis est de 16/20. Révisez et réessayez.'
                }
              </p>

              <div className={`text-5xl font-bold mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                {score}/{questions.length}
              </div>
              <p className="text-slate-500 mb-6">{percentage}% de bonnes réponses</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-500">Correctes</p>
                  <p className="text-lg font-bold text-emerald-400">{score}</p>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-500">Incorrectes</p>
                  <p className="text-lg font-bold text-red-400">{questions.length - score}</p>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-500">Temps utilisé</p>
                  <p className="text-lg font-bold text-white">{formatTime(20 * 60 - timeLeft)}</p>
                </div>
                <div className="rounded-lg bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-500">Résultat</p>
                  <p className={`text-lg font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {passed ? 'Réussi' : 'Échoué'}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={startExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Refaire un examen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Running State
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="space-y-4">
      {/* Timer & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
              Question {currentIndex + 1}/{questions.length}
            </Badge>
            <Badge variant="outline" className={getDifficultyColor(currentQ.difficulty)}>
              {currentQ.difficulty === 'easy' ? 'Facile' : currentQ.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </Badge>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timeLeft < 120 ? 'text-red-400' : 'text-slate-300'}`}>
            <Timer className={`h-4 w-4 ${timeLeft < 120 ? 'text-red-400' : 'text-slate-500'}`} />
            {formatTime(timeLeft)}
          </div>
        </div>
        <Progress
          value={timePercentage}
          className={`h-1.5 bg-slate-800 [&>div]:${timeLeft < 120 ? 'bg-red-500' : 'bg-emerald-500'}`}
        />
        <Progress
          value={((currentIndex + 1) / questions.length) * 100}
          className="h-1 bg-slate-800 [&>div]:bg-slate-500"
        />
      </div>

      {/* Question */}
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isCorrect = idx === currentQ.correctIndex;
              const isSelected = selectedAnswer === idx;
              const showResult = selectedAnswer !== null;

              let optionBtnClass = 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50';
              if (showResult) {
                if (isCorrect) optionBtnClass = 'border-emerald-500 bg-emerald-600/10';
                else if (isSelected && !isCorrect) optionBtnClass = 'border-red-500 bg-red-600/10';
                else optionBtnClass = 'border-slate-800 opacity-60';
              }

              let circleClass = 'border-slate-600 text-slate-400';
              if (showResult) {
                if (isCorrect) circleClass = 'border-emerald-500 bg-emerald-500 text-white';
                else if (isSelected && !isCorrect) circleClass = 'border-red-500 bg-red-500 text-white';
                else circleClass = 'border-slate-700 text-slate-500';
              }

              const letterOrIcon = showResult && isCorrect
                ? <CheckCircle2 className="h-4 w-4" />
                : showResult && isSelected && !isCorrect
                  ? <XCircle className="h-4 w-4" />
                  : String.fromCharCode(65 + idx);

              const textColor = showResult
                ? (isCorrect ? 'text-emerald-300' : 'text-slate-400')
                : 'text-slate-200';

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${optionBtnClass}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium ${circleClass}`}>
                    {letterOrIcon}
                  </div>
                  <span className={`text-sm ${textColor}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 rounded-lg border p-4 ${selectedAnswer === currentQ.correctIndex ? 'border-emerald-800/50 bg-emerald-950/30' : 'border-amber-800/50 bg-amber-950/30'}`}
              >
                <p className={`text-sm ${selectedAnswer === currentQ.correctIndex ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Next Button */}
      {selectedAnswer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={nextQuestion}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            {currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir le résultat'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tab 5: Progression ───────────────────────────────────────────────────

function ProgressionTab() {
  // Mock progress data (in production, this would come from API)
  const overallProgress = 42;
  const coursesStarted = 8;
  const coursesCompleted = 3;
  const totalCourses = 14;
  const quizAverage = 78;
  const quizBest = 95;
  const studyStreak = 7;
  const certificates = [
    { id: '1', name: 'Théorie du code', date: '2025-01-10', icon: '📋' },
    { id: '2', name: 'Signalisation routière', date: '2025-01-08', icon: '🚦' },
  ];

  const weeklyData = [
    { day: 'Lun', hours: 1.5 },
    { day: 'Mar', hours: 2.0 },
    { day: 'Mer', hours: 0.5 },
    { day: 'Jeu', hours: 1.0 },
    { day: 'Ven', hours: 2.5 },
    { day: 'Sam', hours: 3.0 },
    { day: 'Dim', hours: 1.0 },
  ];
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

  const statCards = [
    {
      label: 'Cours commencés',
      value: `${coursesStarted}/${totalCourses}`,
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Cours terminés',
      value: coursesCompleted.toString(),
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Score moyen quiz',
      value: `${quizAverage}%`,
      icon: <Star className="h-5 w-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Meilleur score',
      value: `${quizBest}%`,
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress Hero */}
      <Card className="border-slate-800 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-emerald-600/5" />
        <CardContent className="py-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500/30">
                <span className="text-3xl font-bold text-emerald-400">{overallProgress}%</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-1">Progression globale</h2>
              <p className="text-slate-400 text-sm mb-3">
                Vous avez complété {overallProgress}% de votre parcours d&rsquo;apprentissage
              </p>
              <Progress value={overallProgress} className="h-2.5 bg-slate-800 w-64 [&>div]:bg-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-slate-800 bg-slate-900">
            <CardContent className="py-4 px-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Study Streak & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Streak */}
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Série d&rsquo;étude</h3>
                <p className="text-xs text-slate-500">Jours consécutifs d&rsquo;apprentissage</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-400">{studyStreak}</span>
              <span className="text-slate-400">jours</span>
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-medium ${
                    i < studyStreak ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Chart */}
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Activité hebdomadaire</h3>
                <p className="text-xs text-slate-500">Heures d&rsquo;étude cette semaine</p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32 mt-2">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{d.hours}h</span>
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80 transition-all"
                    style={{ height: `${(d.hours / maxHours) * 80}px` }}
                  />
                  <span className="text-[10px] text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-400" />
          Certificats obtenus
        </h3>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <Card key={cert.id} className="border-slate-800 bg-slate-900">
                <CardContent className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-2xl">
                      {cert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{cert.name}</h4>
                      <p className="text-xs text-slate-500">Obtenu le {cert.date}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="py-8 text-center">
              <Award className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Aucun certificat obtenu pour le moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}