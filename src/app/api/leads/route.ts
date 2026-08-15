import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const clean = (value: unknown, max = 160) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    const company = clean(body.company, 160);
    const country = clean(body.country, 80);
    const source = clean(body.source || 'website', 80);
    const offer = clean(body.offer, 100);
    const consent = body.consent === true;

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Nom et e-mail valides requis.' }, { status: 400 });
    if (!consent) return NextResponse.json({ error: 'Le consentement au suivi commercial est requis.' }, { status: 400 });

    const leadId = crypto.randomUUID();
    await db.analyticsEvent.create({
      data: {
        eventType: 'lead_created',
        metadata: JSON.stringify({ leadId, name, email, phone: phone || undefined, company: company || undefined, country: country || undefined, source, offer: offer || undefined, status: 'new', consent: true, consentAt: new Date().toISOString() }),
      },
    });
    return NextResponse.json({ ok: true, leadId });
  } catch (error) {
    console.error('[POST /api/leads]', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer le prospect.' }, { status: 500 });
  }
}
