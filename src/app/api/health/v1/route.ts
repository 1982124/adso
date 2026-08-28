import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const checks = [
  { id: 'chain-01', name: 'Découverte → contenu public' },
  { id: 'chain-02', name: 'Contenu → compte → parcours personnalisé' },
  { id: 'chain-03', name: 'Cours → illustration → évaluation → compétence' },
  { id: 'chain-04', name: 'Immersif → décision → conséquence → score → progression' },
  { id: 'chain-05', name: 'PDF → IA → eBook → teaser → vente → bibliothèque' },
  { id: 'chain-06', name: 'Pays → langue → profil → objectif → expérience adaptée' },
  { id: 'chain-07', name: 'Cockpit → contenu → publication → utilisateur' },
];

export async function GET() {
  const startedAt = Date.now();
  let database: 'ok' | 'error' = 'ok';
  try {
    await db.$queryRaw`SELECT 1`;
  } catch (error) {
    database = 'error';
    console.error('[health/v1] database check failed', error);
  }

  const status = database === 'ok' ? 'operational' : 'degraded';
  return NextResponse.json(
    {
      service: 'ADSO AFRICA V1',
      status,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      database,
      acceptanceChains: checks.map((check) => ({
        ...check,
        status: 'requires-live-journey-verification',
      })),
      truthPolicy: 'A chain is GO only after its complete production journey has been tested and evidenced.',
    },
    {
      status: status === 'operational' ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
