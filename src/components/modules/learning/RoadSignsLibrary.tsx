'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, ChevronDown, ChevronUp, Circle, Octagon, Triangle, RectangleHorizontal, Diamond, Pentagon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface RoadSign {
  id: string;
  countryCode: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  meaning: string;
  useCase: string;
  shape: string;
  colors: string[];
}

// ── Constants ──────────────────────────────────────────────────────────
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  danger: 'Danger',
  prohibition: 'Interdiction',
  obligation: 'Obligation',
  priority: 'Priorité',
  direction: 'Direction',
  information: 'Information',
  service: 'Services',
  temporary: 'Temporaire',
  marking: 'Marquage',
  traffic_light: 'Feux',
  agent_gesture: 'Gestes',
};

const CATEGORY_COLORS: Record<string, string> = {
  danger: 'text-red-400 bg-red-950/40',
  prohibition: 'text-orange-400 bg-orange-950/40',
  obligation: 'text-blue-400 bg-blue-950/40',
  priority: 'text-amber-400 bg-amber-950/40',
  direction: 'text-green-400 bg-green-950/40',
  information: 'text-sky-400 bg-sky-950/40',
  service: 'text-cyan-400 bg-cyan-950/40',
  temporary: 'text-yellow-400 bg-yellow-950/40',
  marking: 'text-slate-400 bg-slate-800/40',
  traffic_light: 'text-purple-400 bg-purple-950/40',
  agent_gesture: 'text-pink-400 bg-pink-950/40',
};

const CATEGORIES = Object.keys(CATEGORY_TRANSLATIONS);

const SHAPE_ICONS: Record<string, React.ElementType> = {
  triangle: Triangle,
  circle: Circle,
  octagon: Octagon,
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  pentagon: Pentagon,
  square: RectangleHorizontal,
};

const SHAPE_LABELS: Record<string, string> = {
  triangle: 'Triangle',
  circle: 'Cercle',
  octagon: 'Octogone',
  rectangle: 'Rectangle',
  diamond: 'Losange',
  pentagon: 'Pentagone',
  square: 'Carré',
};

// ── Component ──────────────────────────────────────────────────────────
export default function RoadSignsLibrary() {
  const [signs, setSigns] = useState<RoadSign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('countryCode', 'FR');
      if (activeCategory) params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/learning/signs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSigns(data.signs ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const timer = setTimeout(fetchSigns, 250);
    return () => clearTimeout(timer);
  }, [fetchSigns]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Rechercher un panneau..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-slate-900/80 border-slate-800/60 text-white placeholder:text-slate-500 rounded-xl h-10"
        />
      </div>

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
          Toutes
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            {CATEGORY_TRANSLATIONS[cat]}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          {total} panneau{total !== 1 ? 'x' : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 space-y-3">
              <Skeleton className="h-5 w-24 bg-slate-800" />
              <Skeleton className="h-3 w-full bg-slate-800" />
              <Skeleton className="h-3 w-16 bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && signs.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <Circle className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">
            Aucun panneau ne correspond à votre recherche.
          </p>
        </div>
      )}

      {/* Signs Grid */}
      {!loading && signs.length > 0 && (
        <ScrollArea className="max-h-[700px] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-3">
            <AnimatePresence mode="popLayout">
              {signs.map((sign) => (
                <SignCard
                  key={sign.id}
                  sign={sign}
                  expanded={expandedId === sign.id}
                  onToggle={() => toggleExpand(sign.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}

// ── Sign Card ──────────────────────────────────────────────────────────
function SignCard({
  sign,
  expanded,
  onToggle,
}: {
  sign: RoadSign;
  expanded: boolean;
  onToggle: () => void;
}) {
  const catColor = CATEGORY_COLORS[sign.category] || 'text-slate-400 bg-slate-800/40';
  const catLabel = CATEGORY_TRANSLATIONS[sign.category] || sign.category;
  const ShapeIcon = SHAPE_ICONS[sign.shape] || Circle;
  const shapeLabel = SHAPE_LABELS[sign.shape] || sign.shape;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-slate-900/80 border border-slate-800/60 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-colors">
        <button
          onClick={onToggle}
          className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={expanded}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold text-sm truncate">{sign.name}</h3>
              <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                {sign.description}
              </p>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={`${catColor} text-[10px] px-2 py-0 border`}>
              {catLabel}
            </Badge>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <ShapeIcon className="w-3 h-3" />
              {shapeLabel}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="bg-slate-800/60" />
              <div className="p-4 space-y-3 text-sm">
                {/* Meaning */}
                <div>
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Signification</p>
                  <p className="text-slate-200 text-xs mt-1 leading-relaxed">{sign.meaning}</p>
                </div>

                {/* Use Case */}
                <div>
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Cas d\'utilisation</p>
                  <p className="text-slate-200 text-xs mt-1 leading-relaxed">{sign.useCase}</p>
                </div>

                {/* Colors */}
                {sign.colors && sign.colors.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Couleurs</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {sign.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory */}
                {sign.subcategory && (
                  <div>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Sous-catégorie</p>
                    <p className="text-slate-300 text-xs mt-1">{sign.subcategory}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
