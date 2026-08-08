'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  ArrowLeftRight,
  Phone,
  Gauge,
  Wine,
  Building2,
  FileText,
  Wrench,
  Star,
  AlertTriangle,
  Gavel,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  continent: string;
  capital: string;
  languages: string[] | null;
  currency: Currency | null;
  drivingSide: string;
  authority: string;
  emergencyPhone: string;
  minAge: number;
  speedUrban: number;
  speedRural: number;
  speedHighway: number;
  bloodAlcohol: string;
  requiredDocuments: string[] | null;
  requiredEquipment: string[] | null;
  specialFeatures: string[] | null;
  licenseCategories: string[] | null;
  commonInfractions: string[] | null;
  sanctions: string[] | null;
}

const CONTINENTS = [
  'Afrique',
  'Europe',
  'Asie',
  'Moyen-Orient',
  'Amériques',
  'Océanie',
  'Caraïbes',
];

// ── Helpers ────────────────────────────────────────────────────────────
function arr(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [];
}

// ── Component ──────────────────────────────────────────────────────────
export default function CountryExplorer() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (continent) params.set('continent', continent);
      if (search.trim()) params.set('search', search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/learning/countries${query}`);
      if (res.ok) {
        const data = await res.json();
        setCountries(data.countries);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [continent, search]);

  useEffect(() => {
    const timer = setTimeout(fetchCountries, 250);
    return () => clearTimeout(timer);
  }, [fetchCountries]);

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
      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Rechercher un pays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900/80 border-slate-800/60 text-white placeholder:text-slate-500 rounded-xl h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setContinent(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              continent === null
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
            }`}
          >
            Tous
          </button>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setContinent(continent === c ? null : c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                continent === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-emerald-600/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          {countries.length} pays trouvé{countries.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded bg-slate-800" />
                <Skeleton className="h-5 w-32 bg-slate-800" />
              </div>
              <Skeleton className="h-4 w-24 bg-slate-800" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16 bg-slate-800" />
                <Skeleton className="h-4 w-20 bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && countries.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <MapPin className="w-10 h-10 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">
            Aucun pays trouvé pour cette recherche.
          </p>
        </div>
      )}

      {/* Country Grid */}
      {!loading && countries.length > 0 && (
        <ScrollArea className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-3">
            <AnimatePresence mode="popLayout">
              {countries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  expanded={expandedId === country.id}
                  onToggle={() => toggleExpand(country.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}

// ── Country Card ───────────────────────────────────────────────────────
function CountryCard({
  country,
  expanded,
  onToggle,
}: {
  country: Country;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-slate-900/80 border border-slate-800/60 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-colors">
        {/* Header row */}
        <button
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={expanded}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl shrink-0 leading-none">
                {country.flag}
              </span>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                  {country.name}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  {country.capital}{' '}
                  <span className="text-slate-600">•</span>{' '}
                  {country.continent}
                </p>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
            )}
          </div>

          {/* Quick info row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-500" />
              {country.drivingSide === 'gauche' ? 'Conduite à gauche' : 'Conduite à droite'}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-500" />
              {country.speedUrban}/{country.speedRural}/{country.speedHighway} km/h
            </span>
            <span className="flex items-center gap-1">
              <Wine className="w-3.5 h-3.5 text-emerald-500" />
              {country.bloodAlcohol}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              {country.emergencyPhone}
            </span>
          </div>
        </button>

        {/* Expanded Details */}
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
              <div className="p-4 sm:p-5 space-y-4 text-sm">
                {/* Authority & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoBlock
                    icon={Building2}
                    label="Autorité"
                    value={country.authority}
                  />
                  <InfoBlock
                    icon={Gauge}
                    label="Âge minimum"
                    value={`${country.minAge} ans`}
                  />
                </div>

                {/* Required Documents */}
                {arr(country.requiredDocuments).length > 0 && (
                  <SectionList
                    icon={FileText}
                    title="Documents obligatoires"
                    items={arr(country.requiredDocuments)}
                  />
                )}

                {/* Required Equipment */}
                {arr(country.requiredEquipment).length > 0 && (
                  <SectionList
                    icon={Wrench}
                    title="Équipement obligatoire"
                    items={arr(country.requiredEquipment)}
                  />
                )}

                {/* Special Features */}
                {arr(country.specialFeatures).length > 0 && (
                  <SectionList
                    icon={Star}
                    title="Particularités"
                    items={arr(country.specialFeatures)}
                  />
                )}

                {/* License Categories */}
                {arr(country.licenseCategories).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Catégories de permis
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {arr(country.licenseCategories).map((cat) => (
                        <Badge
                          key={cat}
                          variant="outline"
                          className="border-emerald-600/30 text-emerald-400 text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Infractions */}
                {arr(country.commonInfractions).length > 0 && (
                  <SectionList
                    icon={AlertTriangle}
                    title="Infractions courantes"
                    items={arr(country.commonInfractions)}
                    color="text-amber-400"
                  />
                )}

                {/* Sanctions */}
                {arr(country.sanctions).length > 0 && (
                  <SectionList
                    icon={Gavel}
                    title="Sanctions"
                    items={arr(country.sanctions)}
                    color="text-red-400"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────
function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-slate-200 text-sm">{value}</p>
      </div>
    </div>
  );
}

function SectionList({
  icon: Icon,
  title,
  items,
  color = 'text-slate-300',
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  color?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        {title}
      </p>
      <ul className="space-y-1 pl-1">
        {items.map((item, idx) => (
          <li key={idx} className={`${color} text-xs flex items-start gap-1.5`}>
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
