'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Globe2, GraduationCap, Bike, CarFront, Wrench, Search, Languages, Target } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { Input } from '@/components/ui/input';
import { africaCountryDirectory } from '@/data/africa-country-directory';

interface Country { id: string; code: string; name: string; flag: string; continent: string; }
type LearnerProfile = 'primaire' | 'secondaire' | 'lycee' | 'apprenti' | 'universitaire' | 'taxi-moto' | 'taxi-voiture';
type Objective = 'decouvrir' | 'comprendre' | 'mobilite' | 'conduire' | 'permis' | 'code-pro' | 'revision';

const PROFILES: { id: LearnerProfile; label: string; icon: typeof GraduationCap; accent: string; objective: Objective }[] = [
  { id: 'primaire', label: 'Élève du primaire', icon: GraduationCap, accent: 'Découvrir la route', objective: 'decouvrir' },
  { id: 'secondaire', label: 'Élève du secondaire', icon: GraduationCap, accent: 'Comprendre la circulation', objective: 'comprendre' },
  { id: 'lycee', label: 'Lycéen', icon: GraduationCap, accent: 'Préparer ma mobilité', objective: 'mobilite' },
  { id: 'apprenti', label: 'Apprenti', icon: Wrench, accent: 'Me préparer à conduire', objective: 'conduire' },
  { id: 'universitaire', label: 'Étudiant universitaire', icon: GraduationCap, accent: 'Je prépare mon permis', objective: 'permis' },
  { id: 'taxi-moto', label: 'Conducteur taxi-moto', icon: Bike, accent: 'Je maîtrise le code routier', objective: 'code-pro' },
  { id: 'taxi-voiture', label: 'Taxi / conducteur voiture', icon: CarFront, accent: 'Je révise mon code routier au quotidien', objective: 'revision' },
];

const OBJECTIVES: Record<Objective, { title: string; description: string }> = {
  decouvrir: { title: 'Je découvre la route', description: 'Comprendre les premiers réflexes de sécurité.' },
  comprendre: { title: 'Je comprends la circulation', description: 'Lire la route, les panneaux et les comportements.' },
  mobilite: { title: 'Je prépare ma mobilité', description: 'Développer les compétences avant le permis.' },
  conduire: { title: 'Je me prépare à conduire', description: 'Construire une conduite sûre et responsable.' },
  permis: { title: 'Je prépare mon permis', description: 'Réviser le code et progresser vers l’examen.' },
  'code-pro': { title: 'Je maîtrise le code routier', description: 'Renforcer les réflexes et les règles professionnelles.' },
  revision: { title: 'Je révise mon code routier au quotidien', description: 'Entretenir mes connaissances et réduire les risques.' },
};

// The picker must never depend on a network request. The local directory is the
// guaranteed first-render source; the API is allowed to enrich it, never empty it.
const STATIC_AFRICA_COUNTRIES: Country[] = africaCountryDirectory.map((item) => ({ ...item, id: item.code, continent: 'Afrique' }));
const STORAGE_KEY = 'adso-learner-onboarding-v2';

export default function LearnerOnboarding({ onComplete }: { onComplete: () => void }) {
  const country = useLocaleStore((s) => s.country);
  const locale = useLocaleStore((s) => s.locale);
  const locales = useLocaleStore((s) => s.locales);
  const setLanguageAndCountry = useLocaleStore((s) => s.setLanguageAndCountry);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const setCountry = useLocaleStore((s) => s.setCountry);
  const [countries, setCountries] = useState<Country[]>(STATIC_AFRICA_COUNTRIES);
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [objective, setObjective] = useState<Objective | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem('adso-learner-onboarding-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { profile?: LearnerProfile; objective?: Objective; locale?: string; country?: { code: string; name: string } };
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.objective) setObjective(parsed.objective);
        if (parsed.locale) setLocale(parsed.locale);
        if (parsed.country?.code && parsed.country.code !== 'ZZ') setCountry(parsed.country);
      } catch { /* ignore malformed local state */ }
    }

    // Never replace the guaranteed local catalogue with an untrusted/partial API
    // payload. The API may only enrich entries that already have valid identity data.
    const controller = new AbortController();
    fetch('/api/learning/countries?continent=Afrique', { signal: controller.signal, cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('countries')))
      .then((data) => {
        const remote = Array.isArray(data.countries) ? data.countries : [];
        const validRemote = remote
          .filter((item: Partial<Country>) => typeof item?.code === 'string' && typeof item?.name === 'string' && item.code.length === 2)
          .map((item: Partial<Country>) => ({
            id: item.id || item.code!,
            code: item.code!,
            name: item.name!,
            flag: item.flag || STATIC_AFRICA_COUNTRIES.find((country) => country.code === item.code)?.flag || '🌍',
            continent: 'Afrique',
          }));
        if (validRemote.length > 0) {
          const byCode = new Map(STATIC_AFRICA_COUNTRIES.map((item) => [item.code, item]));
          for (const item of validRemote) byCode.set(item.code, { ...byCode.get(item.code), ...item });
          setCountries(Array.from(byCode.values()));
        }
      })
      .catch(() => {
        // Keep the guaranteed static African directory visible.
      });
    return () => controller.abort();
  }, [setCountry, setLocale]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return countries
      .filter((item) => !normalized || item.name.toLocaleLowerCase().includes(normalized) || item.code.toLocaleLowerCase().includes(normalized))
      .slice(0, 18);
  }, [countries, query]);

  const selectedProfile = PROFILES.find((item) => item.id === profile);
  const ready = country.code !== 'ZZ' && Boolean(profile && objective && locale);

  const chooseProfile = (id: LearnerProfile) => {
    setProfile(id);
    setObjective(PROFILES.find((item) => item.id === id)?.objective ?? null);
  };

  const finish = () => {
    if (!ready || !objective || !profile) return;
    const snapshot = { country, profile, objective, locale, completedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    window.localStorage.removeItem('adso-learner-onboarding-v1');
    onComplete();
  };

  return <section aria-labelledby="adso-start-title" className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(20,35,28,0.08)] dark:border-slate-800 dark:bg-slate-950">
    <div className="border-b border-slate-200 bg-[#f7f4ec] px-5 py-6 dark:border-slate-800 dark:bg-slate-900/70 sm:px-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c89b3c]"><Globe2 className="h-4 w-4" /> Mon parcours ADSO</p>
          <h2 id="adso-start-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">Construisons ton parcours, à partir de ta réalité.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Ton pays définit le contexte routier. Ta langue, ton profil et ton objectif déterminent ensuite le cursus ADSO.</p>
        </div>
        {ready && <div className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">Parcours prêt</div>}
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500"><span className="rounded-full bg-white px-2 py-1.5 shadow-sm dark:bg-slate-950">1 · Pays</span><span className="rounded-full bg-white px-2 py-1.5 shadow-sm dark:bg-slate-950">2 · Langue</span><span className="rounded-full bg-white px-2 py-1.5 shadow-sm dark:bg-slate-950">3 · Profil</span><span className="rounded-full bg-white px-2 py-1.5 shadow-sm dark:bg-slate-950">4 · Objectif</span></div>
    </div>
    <div className="p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="adso-country-search" className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">1. Dans quel pays vas-tu apprendre ?</label>
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input id="adso-country-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un pays africain..." className="h-11 rounded-xl border-slate-300 bg-white pl-9 dark:border-slate-700 dark:bg-slate-900" /></div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Pays africains disponibles">
            {filtered.map((item) => { const selected = country.code === item.code; return <button type="button" key={item.id} aria-pressed={selected} onClick={() => setCountry({ code: item.code, name: item.name })} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left transition ${selected ? 'border-emerald-600 bg-emerald-50 text-slate-950 ring-1 ring-emerald-600/20 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'}`}><span className="text-xl" aria-hidden="true">{item.flag}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.name}</span>{selected && <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}</button>; })}
          </div>
          {filtered.length === 0 && <p className="mt-3 text-xs text-slate-500">Aucun pays ne correspond à ta recherche. Efface la recherche pour afficher le catalogue africain.</p>}
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Languages className="h-4 w-4 text-emerald-600" /> 2. Dans quelle langue veux-tu apprendre ?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {locales.map((item) => <button type="button" key={item.code} aria-pressed={locale === item.code} onClick={() => setLanguageAndCountry(item.code, country)} className={`rounded-xl border px-3 py-2.5 text-left transition ${locale === item.code ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10' : 'border-slate-200 bg-white hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/60'}`}><span className="text-base">{item.flag}</span><span className="ml-2 text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</span></button>)}
          </div>
        </div>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">3. Quel est ton profil ?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PROFILES.map(({ id, label, icon: Icon, accent }) => { const selected = profile === id; return <button type="button" key={id} aria-pressed={selected} onClick={() => chooseProfile(id)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10' : 'border-slate-200 bg-white hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/60'}`}><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p><p className="truncate text-xs text-slate-500">{accent}</p></div>{selected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}</button>; })}
          </div>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Target className="h-4 w-4 text-[#c89b3c]" /> 4. Ton objectif</p>
          <div className="rounded-2xl border border-[#c89b3c]/25 bg-[#f7f4ec] p-4 dark:bg-amber-950/10">
            {selectedProfile && objective ? <><p className="text-base font-extrabold text-slate-950 dark:text-white">{OBJECTIVES[objective].title}</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{OBJECTIVES[objective].description}</p><p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#8f6d22] dark:text-amber-300">Objectif recommandé pour ton profil</p></> : <p className="text-sm leading-6 text-slate-500">Choisis ton profil pour qu'ADSO te propose l'objectif le plus pertinent.</p>}
          </div>
        </div>
      </div>
      <motion.button type="button" disabled={!ready} onClick={finish} whileTap={{ scale: 0.98 }} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">Commencer mon cursus ADSO <ArrowRight className="h-4 w-4" /></motion.button>
      <p className="mt-2 text-center text-[11px] text-slate-500">Ton pays, ta langue, ton profil et ton objectif pourront être modifiés plus tard.</p>
    </div>
  </section>;
}