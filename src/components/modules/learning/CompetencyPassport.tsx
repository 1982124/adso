'use client';

import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Clock3, ShieldCheck, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Competency {
  competency: string;
  level: number;
  attempts: number;
  lastScore: number;
  status: 'en_developpement' | 'acquise' | 'consolidee' | 'reconnue';
  strengths: string | null;
  weaknesses: string | null;
  updatedAt: string;
}

interface Payload {
  competencies: Competency[];
  summary: { total: number; acquired: number; recognized: number; averageLevel: number };
  recognitionPolicy: { acquired: string; consolidated: string; recognized: string; legalScope: string };
}

const labels = {
  en_developpement: 'En développement',
  acquise: 'Acquise',
  consolidee: 'Consolidée',
  reconnue: 'Reconnaissance ADSO',
};

const badgeClass = {
  en_developpement: 'border-slate-200 bg-slate-50 text-slate-600',
  acquise: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  consolidee: 'border-sky-200 bg-sky-50 text-sky-700',
  reconnue: 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function CompetencyPassport() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/me/competencies', { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('competencies');
        return response.json() as Promise<Payload>;
      })
      .then(setData)
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(true);
      });
    return () => controller.abort();
  }, []);

  if (error) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8" aria-label="Dossier de compétences ADSO">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <Award className="h-4 w-4" /> Dossier de compétences
              </div>
              <CardTitle className="mt-2 text-2xl text-slate-950">Passeport de compétences ADSO</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Une trace lisible des compétences démontrées dans les expériences d'apprentissage ADSO.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xl font-bold text-slate-900">{data?.summary.total ?? '—'}</p><p className="text-[11px] text-slate-500">Compétences</p></div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center"><p className="text-xl font-bold text-emerald-800">{data?.summary.acquired ?? '—'}</p><p className="text-[11px] text-emerald-700">Acquises</p></div>
              <div className="rounded-xl bg-amber-50 p-3 text-center"><p className="text-xl font-bold text-amber-800">{data?.summary.recognized ?? '—'}</p><p className="text-[11px] text-amber-700">Reconnues</p></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-7">
          {!data ? <div className="h-28 animate-pulse rounded-xl bg-slate-100" aria-busy="true" /> : data.competencies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <Target className="mx-auto h-7 w-7 text-emerald-600" />
              <p className="mt-2 font-semibold text-slate-900">Votre dossier va se construire avec vos évaluations.</p>
              <p className="mt-1 text-sm text-slate-500">Chaque scène immersive réussie alimente progressivement les preuves de compétences.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.competencies.map((item) => (
                <div key={item.competency} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{item.competency}</h3>
                      <p className="mt-1 text-xs text-slate-500">{item.attempts} évaluation{item.attempts > 1 ? 's' : ''} · dernier score {item.lastScore}%</p>
                    </div>
                    <Badge variant="outline" className={badgeClass[item.status]}>{labels[item.status]}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500"><span>Niveau démontré</span><span>{item.level}%</span></div>
                    <Progress value={item.level} className="h-2" />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                    {item.status === 'reconnue' ? <><CheckCircle2 className="h-4 w-4 text-amber-600" /> Critères de reconnaissance ADSO atteints</> : <><Clock3 className="h-4 w-4" /> À consolider par de nouvelles situations</>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data && <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs leading-5 text-sky-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Cadre de reconnaissance</p><p className="mt-1">{data.recognitionPolicy.legalScope}</p></div></div>}
        </CardContent>
      </Card>
    </section>
  );
}
