import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiChat } from '@/lib/ai-gateway';

function meta(value: string) {
  try { return JSON.parse(value) as Record<string, unknown>; } catch { return {}; }
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const cronSecret = process.env.ADSO_CRON_SECRET ?? process.env.CRON_SECRET;
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const updates = await db.analyticsEvent.findMany({
    where: { eventType: 'official_road_update' },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  if (!updates.length) return NextResponse.json({ ok: true, generated: false, reason: 'Aucune information officielle nouvelle.' });

  const evidence = updates.map((item) => {
    const m = meta(item.metadata);
    return { source: m.source, country: m.country, title: m.title, summary: m.summary, publishedAt: m.publishedAt };
  });

  const messages = [
    { role: 'system' as const, content: 'Tu es l’éditeur institutionnel d’ADSO Africa. Tu transformes uniquement des informations officielles fournies en contenu pédagogique et institutionnel sobre. N’invente aucun fait, chiffre, partenaire ou réglementation. Ne prétends jamais qu’ADSO est partenaire ou approuvé. Cite les sources par leur nom/URL fournis. Produit un objet JSON avec title, intro, highlights (tableau de 3 éléments max), opportunities (tableau de 3 éléments max), disclaimer. Ton ton est africain, diplomatique, utile et non commercial.' },
    { role: 'user' as const, content: `Voici les seules preuves autorisées pour cette édition :\n${JSON.stringify(evidence)}\n\nCrée une édition "ADSO Africa Intelligence" qui explique ce qui mérite l’attention des professionnels de la mobilité, de l’éducation et de la prévention, puis indique sobrement quelles questions ces informations peuvent ouvrir pour le dialogue institutionnel. Ne transforme aucune opportunité en sollicitation commerciale.` },
  ];

  const generated = await aiChat(request, messages, { agent: 'institutional-editor', maxTokens: 900, temperature: 0.2 });
  let content: unknown = generated;
  try { content = JSON.parse(generated); } catch { content = { title: 'ADSO Africa Intelligence', intro: generated, highlights: [], opportunities: [], disclaimer: 'Contenu généré à partir de sources officielles synchronisées et soumis à vérification humaine avant usage institutionnel.' }; }

  await db.analyticsEvent.create({
    data: { eventType: 'institutional_intelligence_edition', metadata: JSON.stringify({ generatedAt: new Date().toISOString(), evidenceCount: evidence.length, evidence, content }) },
  });

  return NextResponse.json({ ok: true, generated: true, content, evidenceCount: evidence.length });
}
