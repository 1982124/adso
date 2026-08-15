'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, ChevronDown, ChevronUp, Circle, Octagon, Triangle, RectangleHorizontal, Diamond, Pentagon, ExternalLink } from 'lucide-react';

interface RoadSign { id: string; countryCode: string; category: string; subcategory: string; name: string; description: string; meaning: string; useCase: string; shape: string; colors: string[]; }

const CATEGORY_TRANSLATIONS: Record<string, string> = { danger: 'Danger', prohibition: 'Interdiction', obligation: 'Obligation', priority: 'Priorité', direction: 'Direction', information: 'Information', service: 'Services', temporary: 'Temporaire', marking: 'Marquage', traffic_light: 'Feux', agent_gesture: 'Gestes' };
const CATEGORIES = Object.keys(CATEGORY_TRANSLATIONS);
const CATEGORY_COLORS: Record<string, string> = { danger: 'text-red-400 bg-red-950/40', prohibition: 'text-orange-400 bg-orange-950/40', obligation: 'text-blue-400 bg-blue-950/40', priority: 'text-amber-400 bg-amber-950/40', direction: 'text-green-400 bg-green-950/40', information: 'text-sky-400 bg-sky-950/40', service: 'text-cyan-400 bg-cyan-950/40', temporary: 'text-yellow-400 bg-yellow-950/40', marking: 'text-slate-400 bg-slate-800/40', traffic_light: 'text-purple-400 bg-purple-950/40', agent_gesture: 'text-pink-400 bg-pink-950/40' };
const SHAPE_ICONS: Record<string, React.ElementType> = { triangle: Triangle, circle: Circle, octagon: Octagon, rectangle: RectangleHorizontal, diamond: Diamond, pentagon: Pentagon, square: RectangleHorizontal };
const SHAPE_LABELS: Record<string, string> = { triangle: 'Triangle', circle: 'Cercle', octagon: 'Octogone', rectangle: 'Rectangle', diamond: 'Losange', pentagon: 'Pentagone', square: 'Carré' };

const VERIFIED_IMAGES: Array<{ match: string[]; image: string; source: string; alt: string }> = [
  { match: ['virage dangereux', 'virage dangereux à droite', 'virage dangereux à gauche'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/A71_-_NS_Virage_%C3%A0_droite.jpg', source: 'Wikimedia Commons — A71, France', alt: 'Panneau de virage dangereux photographié sur une autoroute française' },
  { match: ['stop'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Panneaux_Circulation_Stop.jpg', source: 'Wikimedia Commons — France', alt: 'Panneau STOP photographié dans une rue française' },
  { match: ['passage pour piétons', 'passage piéton'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Passage_pi%C3%A9ton_France.JPG', source: 'Wikimedia Commons — France', alt: 'Passage piéton photographié en France' },
  { match: ['rond-point', 'giratoire', 'carrefour à sens giratoire'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Panneau_giratoire_%28D_906%2C_Saint-Yorre%29_2015-12-05.JPG', source: 'Wikimedia Commons — Saint-Yorre, France', alt: 'Panneau annonçant un giratoire photographié en France' },
  { match: ['travaux'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Viaduc_Grands_Pr%C3%A9s_-_Chartres_%28FR28%29_-_2021-03-14_-_3.jpg', source: 'Wikimedia Commons — Chartres, France', alt: 'Signalisation de travaux photographiée en France' },
  { match: ['animaux sauvages'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_A1a.svg', source: 'Wikimedia Commons — référence française', alt: 'Panneau français signalant un danger lié aux animaux' },
  { match: ['cédez le passage'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_AB3a.svg', source: 'Wikimedia Commons — référence française', alt: 'Panneau français de cédez-le-passage' },
  { match: ['tourner à droite'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B21c1.svg', source: 'Wikimedia Commons — référence française B21c1', alt: 'Panneau français de direction obligatoire à droite' },
  { match: ['tourner à gauche'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B21c2.svg', source: 'Wikimedia Commons — référence française B21c2', alt: 'Panneau français de direction obligatoire à gauche' },
  { match: ['tout droit'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B21b.svg', source: 'Wikimedia Commons — référence française B21b', alt: 'Panneau français de direction obligatoire tout droit' },
  { match: ['contournement obligatoire par la droite'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B21a1.svg', source: 'Wikimedia Commons — référence française B21a1', alt: 'Panneau français de contournement obligatoire par la droite' },
  { match: ['contournement obligatoire par la gauche'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B21a2.svg', source: 'Wikimedia Commons — référence française B21a2', alt: 'Panneau français de contournement obligatoire par la gauche' },
  { match: ['piste cyclable obligatoire', 'bande cyclable obligatoire'], image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/France_road_sign_B22a.svg', source: 'Wikimedia Commons — référence française B22a', alt: 'Panneau français de piste ou bande cyclable obligatoire' },
];

function getVerifiedImage(name: string) { const n = name.toLowerCase(); return VERIFIED_IMAGES.find((x) => x.match.some((m) => n.includes(m))); }

export default function RoadSignsLibrary() {
  const [signs, setSigns] = useState<RoadSign[]>([]); const [total, setTotal] = useState(0); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [activeCategory, setActiveCategory] = useState<string | null>(null); const [expandedId, setExpandedId] = useState<string | null>(null);
  const fetchSigns = useCallback(async () => { setLoading(true); try { const params = new URLSearchParams({ countryCode: 'FR' }); if (activeCategory) params.set('category', activeCategory); if (search.trim()) params.set('search', search.trim()); const res = await fetch(`/api/learning/signs?${params.toString()}`); if (!res.ok) throw new Error('signs request failed'); const data = await res.json(); setSigns(Array.isArray(data.signs) ? data.signs : []); setTotal(Number(data.total ?? 0)); } catch { setSigns([]); setTotal(0); } finally { setLoading(false); } }, [activeCategory, search]);
  useEffect(() => { const t = setTimeout(fetchSigns, 250); return () => clearTimeout(t); }, [fetchSigns]);
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input placeholder="Rechercher un panneau..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-slate-900/80 border-slate-800/60 text-white placeholder:text-slate-500 rounded-xl h-10" /></div>
    <div className="flex flex-wrap gap-2"><button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeCategory === null ? 'bg-emerald-600 text-white' : 'bg-slate-900/80 border border-slate-800/60 text-slate-400'}`}>Toutes</button>{CATEGORIES.map((cat) => <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-900/80 border border-slate-800/60 text-slate-400'}`}>{CATEGORY_TRANSLATIONS[cat]}</button>)}</div>
    {!loading && <p className="text-xs text-slate-500">{total} panneau{total !== 1 ? 'x' : ''} — France</p>}
    {loading && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 space-y-3"><Skeleton className="h-40 bg-slate-800" /><Skeleton className="h-5 w-24 bg-slate-800" /><Skeleton className="h-3 w-full bg-slate-800" /></div>)}</div>}
    {!loading && signs.length === 0 && <div className="text-center py-16"><Circle className="w-10 h-10 text-slate-700 mx-auto" /><p className="text-slate-400 text-sm mt-2">Aucun panneau ne correspond à votre recherche.</p></div>}
    {!loading && signs.length > 0 && <ScrollArea className="max-h-[760px] overflow-y-auto"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-3">{signs.map((sign) => <SignCard key={sign.id} sign={sign} expanded={expandedId === sign.id} onToggle={() => setExpandedId((p) => p === sign.id ? null : sign.id)} />)}</div></ScrollArea>}
  </motion.div>;
}

function SignCard({ sign, expanded, onToggle }: { sign: RoadSign; expanded: boolean; onToggle: () => void }) {
  const visual = getVerifiedImage(sign.name); const ShapeIcon = SHAPE_ICONS[sign.shape] || Circle; const catColor = CATEGORY_COLORS[sign.category] || 'text-slate-400 bg-slate-800/40';
  return <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><Card className="bg-slate-900/80 border-slate-800/60 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-colors">
    {visual ? <div className="relative h-48 bg-white overflow-hidden"><img src={visual.image} alt={visual.alt} loading="lazy" className="h-full w-full object-contain" /><div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1.5 flex items-center justify-between gap-2"><span className="text-[9px] text-white truncate">Visuel vérifié · {visual.source}</span><a href={visual.image} target="_blank" rel="noreferrer" aria-label={`Voir la source de ${sign.name}`} className="text-emerald-300"><ExternalLink className="w-3 h-3" /></a></div></div> : <div className="h-48 bg-slate-800/30 flex flex-col items-center justify-center gap-2"><ShapeIcon className="w-20 h-20 text-slate-600" aria-hidden="true" /><span className="text-[10px] text-slate-500">Schéma de forme — photo/référence dédiée non encore vérifiée</span></div>}
    <button onClick={onToggle} className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-expanded={expanded}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="text-white font-semibold text-sm">{sign.name}</h3><p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{sign.description}</p></div>{expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}</div><div className="flex flex-wrap items-center gap-2 mt-3"><Badge variant="outline" className={`${catColor} text-[10px] px-2 py-0`}>{CATEGORY_TRANSLATIONS[sign.category] || sign.category}</Badge><span className="flex items-center gap-1 text-[10px] text-slate-500"><ShapeIcon className="w-3 h-3" />{SHAPE_LABELS[sign.shape] || sign.shape}</span></div></button>
    <AnimatePresence>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><Separator className="bg-slate-800/60" /><div className="p-4 space-y-3 text-sm"><Detail title="Signification" text={sign.meaning} /><Detail title="Cas d'utilisation" text={sign.useCase} />{sign.colors?.length > 0 && <Detail title="Couleurs" text={sign.colors.join(', ')} />}{sign.subcategory && <Detail title="Sous-catégorie" text={sign.subcategory} />}</div></motion.div>}</AnimatePresence>
  </Card></motion.div>;
}
function Detail({ title, text }: { title: string; text: string }) { return <div><p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{title}</p><p className="text-slate-200 text-xs mt-1 leading-relaxed">{text}</p></div>; }
