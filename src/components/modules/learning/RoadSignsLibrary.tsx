'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, ChevronDown, ChevronUp, Circle, ExternalLink } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';

interface RoadSign {
  id: string;
  countryCode: string;
  sourceCountryCode: string;
  applicability: 'national' | 'harmonized' | 'common' | 'supplementary';
  category: string;
  subcategory: string | null;
  name: string;
  description: string;
  meaning: string;
  useCase: string | null;
  shape: string;
  colors: string[];
}

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

const CATEGORIES = Object.keys(CATEGORY_TRANSLATIONS);

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

const VERIFIED_IMAGES: Array<{ match: string[]; image: string; source: string; alt: string }> = [
  { match: ['virage dangereux'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/A71_-_NS_Virage_%C3%A0_droite.jpg', source: 'Wikimedia Commons', alt: 'Panneau réel de virage dangereux' },
  { match: ['stop'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Panneaux_Circulation_Stop.jpg', source: 'Wikimedia Commons', alt: 'Panneau réel STOP' },
  { match: ['passage pour piétons', 'passage piéton'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Passage_pi%C3%A9ton_France.JPG', source: 'Wikimedia Commons', alt: 'Panneau réel de passage pour piétons' },
  { match: ['rond-point', 'giratoire'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Panneau_giratoire_%28D_906%2C_Saint-Yorre%29_2015-12-05.JPG', source: 'Wikimedia Commons', alt: 'Panneau réel de giratoire' },
  { match: ['travaux'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Viaduc_Grands_Pr%C3%A9s_-_Chartres_%28FR28%29_-_2021-03-14_-_3.jpg', source: 'Wikimedia Commons', alt: 'Signalisation réelle de travaux' },
  { match: ['animaux sauvages'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_A1a.svg', source: 'Wikimedia Commons', alt: 'Panneau réel de danger animaux' },
  { match: ['cédez le passage'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_AB3a.svg', source: 'Wikimedia Commons', alt: 'Panneau réel cédez le passage' },
];

function getVerifiedImage(name: string) {
  const normalized = name.toLowerCase();
  return VERIFIED_IMAGES.find((item) => item.match.some((match) => normalized.includes(match)));
}

function SignVisual({ sign }: { sign: RoadSign }) {
  const visual = getVerifiedImage(sign.name);
  const [failed, setFailed] = useState(false);

  if (!visual || failed) {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-100">
        <div className="max-w-[85%] rounded-lg border border-amber-200 bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-700">Visuel non vérifié</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">ADSO ne remplace pas ce panneau par une illustration fictive.</p>
        </div>
        <span className="absolute bottom-2 rounded bg-slate-950/75 px-2 py-1 text-[9px] font-medium text-white">À compléter dans le corpus visuel vérifié</span>
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden bg-white">
      <img src={visual.image} alt={visual.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/70 px-2 py-1.5">
        <span className="truncate text-[9px] text-white">Visuel réel · {visual.source}</span>
        <a href={visual.image} target="_blank" rel="noreferrer" aria-label={`Voir la source de ${sign.name}`} className="text-emerald-300"><ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  );
}

function Detail({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-200">{text}</p>
    </div>
  );
}

function SignCard({ sign, expanded, onToggle }: { sign: RoadSign; expanded: boolean; onToggle: () => void }) {
  const catColor = CATEGORY_COLORS[sign.category] || 'text-slate-400 bg-slate-800/40';
  const scopeLabel = sign.applicability === 'national'
    ? 'National vérifié'
    : sign.applicability === 'common'
      ? `Socle commun · source ${sign.sourceCountryCode}`
      : sign.applicability;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="overflow-hidden rounded-xl border-slate-800/60 bg-slate-900/80 transition-colors hover:border-emerald-600/40">
        <SignVisual sign={sign} />
        <button type="button" onClick={onToggle} aria-expanded={expanded} className="w-full p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white">{sign.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{sign.description}</p>
            </div>
            {expanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`${catColor} px-2 py-0 text-[10px]`}>{CATEGORY_TRANSLATIONS[sign.category] || sign.category}</Badge>
            <Badge variant="outline" className="border-slate-700 px-2 py-0 text-[10px] text-slate-300">{scopeLabel}</Badge>
            <span className="text-[10px] text-slate-500">{sign.shape}</span>
          </div>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Separator className="bg-slate-800/60" />
              <div className="space-y-3 p-4">
                <Detail title="Signification" text={sign.meaning} />
                <Detail title="Cas d'utilisation" text={sign.useCase || 'Voir la réglementation nationale lorsque la règle dépend du pays.'} />
                {sign.colors.length > 0 && <Detail title="Couleurs" text={sign.colors.join(', ')} />}
                {sign.subcategory && <Detail title="Sous-catégorie" text={sign.subcategory} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function RoadSignsLibrary() {
  const { country } = useLocaleStore();
  const [signs, setSigns] = useState<RoadSign[]>([]);
  const [total, setTotal] = useState(0);
  const [nationalCount, setNationalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ countryCode: country.code });
      if (activeCategory) params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());
      const response = await fetch(`/api/learning/signs?${params.toString()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`signs request failed: ${response.status}`);
      const data = await response.json();
      setSigns(Array.isArray(data.signs) ? data.signs : []);
      setTotal(Number(data.total || 0));
      setNationalCount(Number(data.nationalCount || 0));
    } catch (error) {
      console.error('[ADSO] road signs unavailable', error);
      setSigns([]);
      setTotal(0);
      setNationalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, country.code, search]);

  useEffect(() => {
    const timer = setTimeout(() => void fetchSigns(), 250);
    return () => clearTimeout(timer);
  }, [fetchSigns]);

  useEffect(() => setExpandedId(null), [country.code]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
      <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Signalisation · {country.name}</p>
        <p className="mt-1 text-xs text-slate-400">Les panneaux nationaux sont distingués du socle commun. Aucun visuel fictif n'est utilisé pour masquer une donnée non vérifiée.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input placeholder="Rechercher un panneau..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 rounded-xl border-slate-800/60 bg-slate-900/80 pl-9 text-white placeholder:text-slate-500" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveCategory(null)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeCategory === null ? 'bg-emerald-600 text-white' : 'border border-slate-800/60 bg-slate-900/80 text-slate-400'}`}>Toutes</button>
        {CATEGORIES.map((category) => (
          <button key={category} type="button" onClick={() => setActiveCategory(activeCategory === category ? null : category)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeCategory === category ? 'bg-emerald-600 text-white' : 'border border-slate-800/60 bg-slate-900/80 text-slate-400'}`}>
            {CATEGORY_TRANSLATIONS[category]}
          </button>
        ))}
      </div>

      {!loading && (
        <p className="text-xs text-slate-500">
          {total} panneau{total !== 1 ? 'x' : ''} · {nationalCount > 0 ? `${nationalCount} national(aux) vérifié(s) + socle commun` : 'aucun corpus national vérifié pour ce pays · socle commun uniquement'}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-slate-800/60 bg-slate-900/80 p-4">
              <Skeleton className="h-40 bg-slate-800" />
              <Skeleton className="h-5 w-24 bg-slate-800" />
              <Skeleton className="h-3 w-full bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {!loading && signs.length === 0 && (
        <div className="py-16 text-center">
          <Circle className="mx-auto h-10 w-10 text-slate-700" />
          <p className="mt-2 text-sm text-slate-400">Aucun panneau ne correspond à votre recherche.</p>
        </div>
      )}

      {!loading && signs.length > 0 && (
        <ScrollArea className="h-[760px] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 pr-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {signs.map((sign) => (
              <SignCard key={sign.id} sign={sign} expanded={expandedId === sign.id} onToggle={() => setExpandedId((previous) => previous === sign.id ? null : sign.id)} />
            ))}
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}
