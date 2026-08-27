'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Evidence = { sceneId: string; sceneTitle: string; score: number; maxScore: number; accuracy: number; completedAt: string | null };
type Competency = { competency: string; level: number; attempts: number; lastScore: number; status: string; recognitionReason: string; evidenceCount: number; recentEvidenceAverageAccuracy: number; strengths: string | null; weaknesses: string | null; updatedAt: string; evidence: Evidence[] };
type Payload = { framework: string; competencies: Competency[]; summary: { total: number; acquired: number; recognized: number; averageLevel: number }; recognitionPolicy: { acquired: string; consolidated: string; recognized: string; legalScope: string } };

const statusStyle: Record<string, string> = {
  'Reconnaissance ADSO': 'border-amber-300 bg-amber-50 text-amber-800',
  Consolidée: 'border-blue-200 bg-blue-50 text-blue-800',
  Acquise: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'En développement': 'border-slate-200 bg-slate-50 text-slate-700',
};

export default function CompetencyPassportPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/me/competencies', { credentials: 'include', cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || 'Impossible de charger le passeport.');
        setData(body);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Impossible de charger le passeport.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-5xl animate-pulse rounded-3xl bg-white p-8 shadow-sm"><div className="h-8 w-72 rounded bg-slate-200"/><div className="mt-6 h-24 rounded-2xl bg-slate-100"/><div className="mt-6 h-48 rounded-2xl bg-slate-100"/></div></main>;
  if (error) return <main className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Passeport de compétences</h1><p className="mt-3 text-slate-600">{error}</p><Link href="/formation/immersive" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white">Retour à l'immersion</Link></div></main>;

  const payload = data!;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">ADSO · Dossier de compétences</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Passeport de compétences</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Un historique des compétences démontrées dans les situations évaluées par ADSO, avec leur niveau actuel et les preuves pédagogiques associées.</p>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-4" aria-label="Résumé des compétences">
          {[['Compétences', payload.summary.total], ['Acquises', payload.summary.acquired], ['Reconnaissances ADSO', payload.summary.recognized], ['Niveau moyen', `${payload.summary.averageLevel}%`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}
        </section>

        <section className="mt-6 space-y-4">
          {payload.competencies.length === 0 ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-xl font-bold">Votre dossier commence ici</h2><p className="mt-2 text-sm text-slate-500">Terminez une scène immersive évaluée pour commencer à constituer vos premières preuves de compétence.</p><Link href="/formation/immersive" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white">Vivre une scène</Link></div> : payload.competencies.map((item) => <article key={item.competency} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-xl font-bold">{item.competency}</h2><p className="mt-1 text-sm text-slate-500">{item.attempts} évaluation{item.attempts > 1 ? 's' : ''} · dernier score {item.lastScore}%</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusStyle[item.status] || statusStyle['En développement']}`}>{item.status}</span></div><div className="mt-5"><div className="mb-2 flex justify-between text-xs font-semibold"><span>Niveau démontré</span><span>{item.level}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${item.level}%` }}/></div></div><div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><h3 className="text-sm font-bold">Pourquoi ce niveau ?</h3><p className="mt-1 text-sm text-slate-600">{item.recognitionReason}</p><p className="mt-2 text-xs text-slate-500">{item.evidenceCount} preuve{item.evidenceCount > 1 ? 's' : ''} récente{item.evidenceCount > 1 ? 's' : ''} · précision moyenne des preuves affichées : {item.recentEvidenceAverageAccuracy}%</p></div>{item.evidence.length > 0 && <div className="mt-5"><h3 className="text-sm font-bold">Preuves pédagogiques récentes</h3><div className="mt-2 space-y-2">{item.evidence.map((proof, index) => <div key={`${proof.sceneId}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm"><div className="font-semibold">{proof.sceneTitle}</div><div className="mt-1 text-xs text-slate-500">Score {Math.round(proof.score)}/{Math.round(proof.maxScore)} · précision {Math.round(proof.accuracy * 100)}%{proof.completedAt ? ` · ${new Date(proof.completedAt).toLocaleDateString('fr-FR')}` : ''}</div></div>)}</div></div>}</article>)}
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 sm:p-6"><h2 className="font-bold">Cadre de reconnaissance · V1</h2><ul className="mt-3 space-y-1.5"><li>• {payload.recognitionPolicy.acquired}</li><li>• {payload.recognitionPolicy.consolidated}</li><li>• {payload.recognitionPolicy.recognized}</li></ul><p className="mt-4 border-t border-amber-200 pt-4 text-xs leading-5 text-amber-900">{payload.recognitionPolicy.legalScope}</p></section>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/formation/immersive" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Continuer à apprendre</Link><Link href="/education" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold">Voir les parcours</Link></div>
      </div>
    </main>
  );
}