'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bike,
  Car,
  Truck,
  Shield,
  User,
  Clock,
  BookOpen,
  CheckCircle2,
  ListChecks,
  GraduationCap,
  XCircle,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface License {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  minAge: number;
  minAgeHeld: number | null;
  vehicles: string[] | null;
  prerequisites: string[] | null;
  duration: string;
  theoryExam: boolean;
  practicalExam: boolean;
  evaluationCriteria: string[] | null;
  icon: string;
}

// ── Category Config ─────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'moto', label: 'Moto', icon: Bike, color: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  { key: 'auto', label: 'Automobile', icon: Car, color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  { key: 'poids lourds', label: 'Poids Lourds', icon: Truck, color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  { key: 'spécial', label: 'Spécial', icon: Shield, color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
] as const;

type CatColor = 'orange' | 'emerald' | 'purple' | 'blue';

function getCategoryConfig(category: string) {
  const lc = category.toLowerCase();
  if (lc.includes('moto') || lc.includes('cyclomoteur') || lc.includes('motocycle'))
    return CATEGORIES[0];
  if (lc.includes('auto') || lc.includes('voiture') || lc.includes('b') && !lc.includes('b1') || lc.includes('permis b'))
    return CATEGORIES[1];
  if (lc.includes('poids') || lc.includes('lourd') || lc.includes('c1') || lc.includes('ce') || lc.includes('d1') || lc.includes('de') || lc.includes('bus'))
    return CATEGORIES[2];
  return CATEGORIES[3];
}

function getColorClasses(color: CatColor) {
  const map = {
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/15 text-orange-400 border-orange-500/20', icon: 'text-orange-500' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: 'text-emerald-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/20', icon: 'text-purple-500' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: 'text-blue-500' },
  };
  return map[color];
}

function arr(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [];
}

// ── Component ──────────────────────────────────────────────────────────
export default function LicenseBrowser() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set('category', activeCategory);
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/learning/licenses${query}`);
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.licenses);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeCategory === null
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
          }`}
        >
          Tous les permis
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === cat.key
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          {licenses.length} catégorie{licenses.length !== 1 ? 's' : ''} de permis
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-slate-800" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20 bg-slate-800" />
                  <Skeleton className="h-3 w-36 bg-slate-800" />
                </div>
              </div>
              <Skeleton className="h-3 w-full bg-slate-800" />
              <Skeleton className="h-3 w-3/4 bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && licenses.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">
            Aucune catégorie de permis trouvée.
          </p>
        </div>
      )}

      {/* License Cards */}
      {!loading && licenses.length > 0 && (
        <ScrollArea className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-3">
            <AnimatePresence mode="popLayout">
              {licenses.map((license) => (
                <LicenseCard key={license.id} license={license} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}

// ── License Card ───────────────────────────────────────────────────────
function LicenseCard({ license }: { license: License }) {
  const catConfig = getCategoryConfig(license.category);
  const colors = getColorClasses(catConfig.color as CatColor);
  const Icon = catConfig.icon;

  const vehicles = arr(license.vehicles);
  const prerequisites = arr(license.prerequisites);
  const criteria = arr(license.evaluationCriteria);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={`bg-slate-900/80 border ${colors.border} rounded-xl overflow-hidden hover:border-opacity-60 transition-colors`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b ${colors.border} ${colors.bg}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {license.code}
                </h3>
                <Badge
                  variant="outline"
                  className={`${colors.badge} text-[10px] px-2 py-0`}
                >
                  {catConfig.label}
                </Badge>
              </div>
              <p className={`${colors.text} text-sm font-medium mt-0.5`}>
                {license.name}
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-xs mt-3 leading-relaxed">
            {license.description}
          </p>
        </div>

        {/* Body */}
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Key info row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <User className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
              <p className="text-white text-sm font-semibold">{license.minAge} ans</p>
              <p className="text-slate-500 text-[10px]">Âge min.</p>
            </div>
            {license.minAgeHeld && (
              <div className="text-center">
                <Clock className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
                <p className="text-white text-sm font-semibold">{license.minAgeHeld} ans</p>
                <p className="text-slate-500 text-[10px]">Permis détenu</p>
              </div>
            )}
            <div className="text-center">
              <Clock className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
              <p className="text-white text-sm font-semibold">{license.duration || '—'}</p>
              <p className="text-slate-500 text-[10px]">Durée</p>
            </div>
          </div>

          <Separator className="bg-slate-800/60" />

          {/* Vehicles */}
          {vehicles.length > 0 && (
            <DetailSection title="Véhicules autorisés" items={vehicles} />
          )}

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <DetailSection title="Prérequis" items={prerequisites} />
          )}

          {/* Exam types */}
          <div className="space-y-1.5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Examens
            </p>
            <div className="flex gap-2">
              {license.theoryExam ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Théorique
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-600">
                  <XCircle className="w-3.5 h-3.5" /> Théorique
                </span>
              )}
              {license.practicalExam ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pratique
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-600">
                  <XCircle className="w-3.5 h-3.5" /> Pratique
                </span>
              )}
            </div>
          </div>

          {/* Evaluation Criteria */}
          {criteria.length > 0 && (
            <DetailSection title="Critères d'évaluation" items={criteria} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Detail Section ─────────────────────────────────────────────────────
function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="text-slate-300 text-xs flex items-start gap-1.5"
          >
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
