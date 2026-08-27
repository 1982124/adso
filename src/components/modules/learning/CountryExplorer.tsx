'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeftRight, Phone, Gauge, Building2, FileText, Wrench, Star, AlertTriangle, Gavel, ChevronDown, ChevronUp, MapPin, Check, Car, HeartPulse, ExternalLink, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocaleStore } from '@/stores/locale-store';

interface Currency { code: string; symbol: string; name: string; }
interface RoadSafetyStats { year: number; estimatedDeaths: number; accidents: number | null; injuries: number | null; deathsType: 'estimated'; source: string; sourceUrl: string; availabilityNote?: string; }
interface Country {
  id: string; code: string; name: string; flag: string; continent: string; capital: string;
  languages: string[] | null; currency: Currency | null; drivingSide: string; authority: string;
  emergencyPhone: string; minAge: number | null; speedUrban: number | null; speedRural: number | null; speedHighway: number | null;
  bloodAlcohol: string | null; requiredDocuments: string[] | null; requiredEquipment: string[] | null;
  specialFeatures: string[] | null; licenseCategories: string[] | null; commonInfractions: string[] | null; sanctions: string[] | null;
  roadSafety?: RoadSafetyStats | null;
}

const CONTINENTS = ['Afrique', 'Europe', 'Asie', 'Moyen-Orient', 'Amériques', 'Océanie', 'Caraïbes'];
const arr = (value: unknown): string[] => Array.isArray(value) ? value : [];
const fmt = (value: number | null | undefined) => value == null ? 'Non disponible' : new Intl.NumberFormat('fr-FR').format(value);

function regulatoryStatus(code: string) {
  if (code === 'ML') return { label: 'Mali · vérification nationale requise', tone: 'border-amber-500/30 bg-amber-950/20 text-amber-200' };
  if (code === 'BJ') return { label: 'Bénin · vérification nationale requise', tone: 'border-amber-500/30 bg-amber-950/20 text-amber-200' };
  return { label: 'Référentiel indicatif · vérification nationale requise', tone: 'border-slate-700 bg-slate-900 text-slate-300' };
}

export default function CountryExplorer() {
  const selectedCountry = useLocaleStore((s) => s.country);
  const setCountry = useLocaleStore((s) => s.setCountry);
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
      const res = await fetch(`/api/learning/countries${params.toString() ? `?${params}` : ''}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('countries');
      const data = await res.json();
      setCountries(Array.isArray(data.countries) ? data.countries : []);
    } catch { setCountries([]); }
    finally { setLoading(false); }
  }, [continent, search]);

  useEffect(() => { const timer = setTimeout(() => void fetchCountries(), 250); return () => clearTimeout(timer); }, [fetchCountries]);

  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
    <div className="rounded-2xl border border-emerald-700/30 bg-emerald-950/20 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Votre contexte d'apprentissage</p>
      <div className="mt-2 flex flex-wrap items-center gap-3"><span className="text-3xl">{selectedCountry.code === 'ZZ' ? '🌍' : countries.find(c => c.code === selectedCountry.code)?.flag ?? '🌍'}</span><div className="min-w-0 flex-1"><p className="font-semibold text-white">{selectedCountry.name}</p><p className="text-xs text-slate-400">Le pays sélectionné détermine la couche réglementaire et le parcours permis. La langue reste indépendante.</p></div>{selectedCountry.code !== 'ZZ' && <Badge className="bg-emerald-600 text-white"><Check className="mr-1 h-3 w-3"/>Pays sélectionné</Badge>}</div>
    </div>
    <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-4 text-xs leading-5 text-amber-100"><div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"/><p><strong>Rigueur réglementaire :</strong> les informations nationales affichées constituent un référentiel pédagogique. Elles ne doivent pas être utilisées comme source juridique officielle tant qu'une source nationale compétente et une date de vérification ne sont pas attachées à la donnée.</p></div></div>
    <div className="space-y-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><Input placeholder="Rechercher un pays..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-slate-900/80 border-slate-800/60 text-white placeholder:text-slate-500 rounded-xl h-11"/></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setContinent(null)} className={`min-h-10 px-3 rounded-lg text-xs font-medium ${continent === null ? 'bg-emerald-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}>Tous</button>{CONTINENTS.map(c => <button type="button" key={c} onClick={() => setContinent(continent === c ? null : c)} className={`min-h-10 px-3 rounded-lg text-xs font-medium ${continent === c ? 'bg-emerald-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}>{c}</button>)}</div></div>
    {!loading && <p className="text-xs text-slate-500">{countries.length} pays trouvé{countries.length !== 1 ? 's' : ''}</p>}
    {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3"><Skeleton className="h-8 w-8 bg-slate-800"/><Skeleton className="h-5 w-32 bg-slate-800"/><Skeleton className="h-4 w-24 bg-slate-800"/></div>)}</div>}
    {!loading && countries.length === 0 && <div className="text-center py-16"><MapPin className="w-10 h-10 text-slate-700 mx-auto"/><p className="mt-2 text-slate-400 text-sm">Aucun pays trouvé pour cette recherche.</p><p className="mt-1 text-xs text-slate-600">Vous pouvez rechercher par nom ou code pays.</p></div>}
    {!loading && countries.length > 0 && <ScrollArea className="max-h-[700px] overflow-y-auto"><div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-3"><AnimatePresence mode="popLayout">{countries.map(country => <CountryCard key={country.id} country={country} selected={selectedCountry.code === country.code} expanded={expandedId === country.id} onToggle={() => setExpandedId(v => v === country.id ? null : country.id)} onSelect={() => setCountry({ code: country.code, name: country.name })}/>)}</AnimatePresence></div></ScrollArea>}
  </motion.div>;
}

function CountryCard({ country, selected, expanded, onToggle, onSelect }: { country: Country; selected: boolean; expanded: boolean; onToggle: () => void; onSelect: () => void }) {
  const rs = country.roadSafety;
  const status = regulatoryStatus(country.code);
  return <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}><Card className={`bg-slate-900/80 border rounded-xl overflow-hidden ${selected ? 'border-emerald-500/70' : 'border-slate-800/60'}`}><button type="button" onClick={onToggle} className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-expanded={expanded}><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-3 min-w-0"><span className="text-3xl shrink-0">{country.flag}</span><div className="min-w-0"><h3 className="text-white font-semibold text-sm sm:text-base truncate">{country.name}</h3><p className="text-slate-400 text-xs mt-0.5 truncate">{country.code} · {country.capital || 'Capitale à enrichir'} · {country.continent}</p></div></div>{expanded ? <ChevronUp className="w-4 h-4 text-slate-500"/> : <ChevronDown className="w-4 h-4 text-slate-500"/>}</div><div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400"><span className="flex items-center gap-1"><ArrowLeftRight className="w-3.5 h-3.5 text-emerald-500"/>{country.drivingSide === 'gauche' || country.drivingSide === 'left' ? 'Conduite à gauche' : 'Conduite à droite'}</span>{country.speedUrban != null && <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-emerald-500"/>{country.speedUrban}/{country.speedRural ?? '—'}/{country.speedHighway ?? '—'} km/h</span>}{country.emergencyPhone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-500"/>{country.emergencyPhone}</span>}{rs && <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-amber-400"/>{fmt(rs.estimatedDeaths)} décès estimés · {rs.year}</span>}</div></button>{expanded && <div className="border-t border-slate-800/60 p-4 sm:p-5 space-y-4"><div className={`rounded-xl border p-3 text-xs ${status.tone}`}><strong>{status.label}</strong><p className="mt-1 opacity-80">Les règles affichées doivent être confrontées aux textes et autorités compétentes avant tout usage administratif ou juridique.</p></div><button type="button" onClick={onSelect} className={`w-full min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold ${selected ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>{selected ? 'Pays actuellement sélectionné' : `Choisir ${country.name} comme pays d'apprentissage`}</button>{rs && <RoadSafetyBlock stats={rs}/>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><InfoBlock icon={Building2} label="Autorité" value={country.authority || 'À enrichir'}/><InfoBlock icon={Gauge} label="Âge minimum" value={country.minAge == null ? 'À enrichir' : `${country.minAge} ans`}/></div>{arr(country.languages).length > 0 && <SectionList icon={FileText} title="Langues disponibles" items={arr(country.languages)}/>} {arr(country.licenseCategories).length > 0 && <div><p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Catégories de permis</p><div className="flex flex-wrap gap-1.5">{arr(country.licenseCategories).map(cat => <Badge key={cat} variant="outline" className="border-emerald-600/30 text-emerald-400 text-xs">{cat}</Badge>)}</div></div>}{arr(country.requiredDocuments).length > 0 && <SectionList icon={FileText} title="Documents obligatoires" items={arr(country.requiredDocuments)}/>} {arr(country.requiredEquipment).length > 0 && <SectionList icon={Wrench} title="Équipement obligatoire" items={arr(country.requiredEquipment)}/>} {arr(country.specialFeatures).length > 0 && <SectionList icon={Star} title="Particularités" items={arr(country.specialFeatures)}/>} {arr(country.commonInfractions).length > 0 && <SectionList icon={AlertTriangle} title="Infractions courantes" items={arr(country.commonInfractions)} color="text-amber-400"/>} {arr(country.sanctions).length > 0 && <SectionList icon={Gavel} title="Sanctions · référentiel indicatif" items={arr(country.sanctions)} color="text-red-400"/>}</div>}</Card></motion.div>;
}

function RoadSafetyBlock({ stats }: { stats: RoadSafetyStats }) { return <section className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-3" aria-label="Bilan de sécurité routière"><div className="flex items-start justify-between gap-3"><div><p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Bilan de sécurité routière</p><p className="text-slate-500 text-[11px] mt-1">Année des données : {stats.year} · estimation internationale</p></div><HeartPulse className="h-5 w-5 text-amber-400 shrink-0"/></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-2"><Metric icon={Car} label="Accidents" value={fmt(stats.accidents)}/><Metric icon={HeartPulse} label="Blessures" value={fmt(stats.injuries)}/><Metric icon={AlertTriangle} label="Décès" value={fmt(stats.estimatedDeaths)}/></div><p className="text-[11px] leading-relaxed text-slate-500">Les accidents et blessures ne sont pas disponibles sous une forme internationale comparable pour ce pays dans cette source. ADSO n'invente aucune donnée ; ces champs restent prêts à être enrichis avec des sources nationales fiables.</p><a href={stats.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300">Source : {stats.source}<ExternalLink className="h-3 w-3"/></a></section>; }
function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3"><div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Icon className="h-3.5 w-3.5"/>{label}</div><p className="mt-1 text-sm font-semibold text-slate-100">{value}</p></div>; }
function InfoBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="flex items-start gap-2"><Icon className="w-4 h-4 text-emerald-500 mt-0.5"/><div><p className="text-slate-500 text-xs">{label}</p><p className="text-slate-200 text-sm">{value}</p></div></div>; }
function SectionList({ icon: Icon, title, items, color = 'text-slate-300' }: { icon: React.ElementType; title: string; items: string[]; color?: string }) { return <div className="space-y-2"><p className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-emerald-500"/>{title}</p><ul className="space-y-1.5">{items.map((item, i) => <li key={`${item}-${i}`} className={`text-xs ${color} leading-relaxed`}>• {item}</li>)}</ul></div>; }