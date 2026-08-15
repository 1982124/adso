import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeLeadText, scoreLead } from '@/lib/leads';

const MAX_BODY_BYTES = 12_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function approxBodySize(body: unknown) {
  try { return Buffer.byteLength(JSON.stringify(body), 'utf8'); } catch { return MAX_BODY_BYTES + 1; }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (approxBodySize(body) > MAX_BODY_BYTES) return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });

    const name = sanitizeLeadText(body.name, 120);
    const email = sanitizeLeadText(body.email, 160).toLowerCase();
    const phone = sanitizeLeadText(body.phone, 40);
    const company = sanitizeLeadText(body.company, 160);
    const country = sanitizeLeadText(body.country, 80);
    const source = sanitizeLeadText(body.source || 'website', 80) || 'website';
    const offer = sanitizeLeadText(body.offer, 100);
    const consent = body.consent === true;

    if (!name || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Nom et e-mail valides requis.' }, { status: 400 });
    if (!consent) return NextResponse.json({ error: 'Le consentement au suivi commercial est requis.' }, { status: 400 });

    const lead = scoreLead({ name, email, phone, company, country, source, offer });
    const leadId = crypto.randomUUID();
    const consentAt = new Date().toISOString();

    await db.analyticsEvent.create({
      data: {
        eventType: 'lead_created',
        metadata: JSON.stringify({
          leadId,
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          country: country || undefined,
          source,
          offer: offer || undefined,
          status: 'new',
          stage: 'new',
          score: lead.score,
          priority: lead.priority,
          scoreReasons: lead.reasons,
          consent: true,
          consentAt,
        }),
      },
    });

    return NextResponse.json({ ok: true, leadId, score: lead.score, priority: lead.priority });
  } catch (error) {
    console.error('[POST /api/leads]', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Impossible d’enregistrer le prospect.' }, { status: 500 });
  }
}
