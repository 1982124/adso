'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Globe2, GraduationCap, Bike, CarFront, Wrench, Search } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { Input } from '@/components/ui/input';

interface Country { id: string; code: string; name: string; flag: string; continent: string; }

type LearnerProfile = 'primaire' | 'secondaire' | 'lycee' | 'apprenti' | 'universitaire' | 'taxi-moto' | 'taxi-voiture';

const PROFILES: { id: LearnerProfile; label: string; icon: typeof GraduationCap; accent: string }[] = [
  { id: 'primaire', label: 'Élève du primaire', icon: GraduationCap, accent: 'Découvrir la route' },
  { id: 'secondaire', label: 'Élève du secondaire', icon: GraduationCap, accent: 'Comprendre la circulation' },
  { id: 'lycee', label: 'Lycéen', icon: GraduationCap, accent: 'Préparer ma mobilité' },
  { id: 'apprenti', label: 'Apprenti', icon: Wrench, accent: 'Me préparer à conduire' },
  { id: 'universitaire', label: 'Étudiant universitaire', icon: GraduationCap, accent: 'Préparer mon permis' },
  { id: 'taxi-moto', label: 'Conducteur taxi-moto', icon: Bike, accent: 'Maîtriser ma conduite professionnelle' },
  { id: 'taxi-voiture', label: 'Taxi / conducteur voiture', icon: CarFront, accent: 'Perfectionner ma conduite professionnelle' },
];

const STORAGE_KEY = 'adso-learner-onboarding-v1';

export default function LearnerOnboarding({ onComplete }: { onComplete: () => void }) {
  const country = useLocaleStore((s) => s.country);
  const setCountry = useLocaleStore((s) => s.setCountry);
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { const parsed = JSON.parse(saved) as { profile?: LearnerProfile; country?: { code: string; name: string } }; if (parsed.profile) setProfile(parsed.profile); if (parsed.country?.code && parsed.country.code !== 'ZZ') setCountry(parsed.country); } catch { /* ignore malformed local state */ }
    }
    const controller = new AbortController();
    fetch('/api/learning/countries?continent=Afrique', { signal: controller.signal, cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('countries')))
      .then((data) => setCountries(Array.isArray(data.countries) ? data.countries : []))
      .catch(() => setCountries([]));
    return () => controller.abort();
  }, [setCountry]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return countries.filter((item) => !normalized || item.name.toLocaleLowerCase().includes(normalized) || item.code.toLocaleLowerCase().includes(normalized)).slice(0, 18);
  }, [countries, query]);

  const ready = country.code !== 'ZZ' && Boolean(profile);

  const finish = () => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ country, profile, completedAt: new Date().toISOString() }));
    onComplete();
  };

  return <section aria-labelledby="adso-start-title" className="mb-6 overflow-hidden rounded-3xl border border-emerald-900/30 bg-gradient-to-br from-emerald-950 via-slate-950 to-amber-950/20 shadow-xl">
    <div className="p-5 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-400"><Globe2 className="h-4 w-4" /> Mon parcours ADSO</p>
          <h2 id="adso-start-title" className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Commence par choisir ton pays.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">ADSO adapte ton apprentissage à ton environnement. Les compétences de sécurité restent communes, tandis que les règles, panneaux et parcours liés au permis suivent ton pays.</p>
        </div>
        {ready && <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">Parcours prêt</div>}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <label htmlFor="adso-country-search" className="mb-2 block text-sm font-semibold text-white">1. Dans quel pays vas-tu apprendre ?</label>
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input id="adso-country-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un pays africain..." className="h-11 rounded-xl border-slate-700 bg-slate-900/80 pl-9 text-white placeholder:text-slate-500" /></div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filtered.map((item) => { const selected = country.code === item.code; return <button type="button" key={item.id} onClick={() => setCountry({ code: item.code, name: item.name })} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left transition ${selected ? 'border-emerald-400 bg-emerald-500/15 text-white ring-1 ring-emerald-400/30' : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-emerald-700/60 hover:bg-slate-900'}`}><span className="text-xl">{item.flag}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.name}</span>{selected && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}</button>; })}
          </div>
          {countries.length === 0 && <p className="mt-3 text-xs text-slate-500">Le catalogue des pays est momentanément indisponible. ADSO conserve ton choix s'il a déjà été enregistré.</p>}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-white">2. Quel est ton profil ?</p>
          <div className="grid gap-2">
            {PROFILES.map(({ id, label, icon: Icon, accent }) => { const selected = profile === id; return <button type="button" key={id} onClick={() => setProfile(id)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? 'border-amber-400/70 bg-amber-400/10' : 'border-slate-800 bg-slate-900/60 hover:border-amber-700/50'}`}><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">{label}</p><p className="truncate text-xs text-slate-500">{accent}</p></div>{selected && <Check className="h-4 w-4 text-amber-300" />}</button>; })}
          </div>
        </div>
      </div>

      <motion.button type="button" disabled={!ready} onClick={finish} whileTap={{ scale: 0.98 }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-extrabold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">Commencer mon cursus ADSO <ArrowRight className="h-4 w-4" /></motion.button>
      <p className="mt-2 text-center text-[11px] text-slate-500">Tu pourras modifier ton pays ou ton profil plus tard dans ton espace.</p>
    </div>
  </section>;
}
