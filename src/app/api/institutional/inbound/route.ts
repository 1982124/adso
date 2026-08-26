import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiChat } from '@/lib/ai-gateway';

const allowedTypes = new Set(['institution publique', 'école', 'université', 'centre de formation', 'entreprise', 'ong / association', 'collectivité', 'autre']);

function clean(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Honeypot: bots should be silently accepted without entering the institutional pipeline.
    if (clean(body.website, 120)) return NextResponse.json({ ok: true, received: true });

    const country = clean(body.country, 80);
    const institution = clean(body.institution, 180);
    const institutionType = clean(body.institutionType, 80).toLowerCase();
    const role = clean(body.role, 120);
    const interest = clean(body.interest, 180);
    const population = clean(body.population, 180);
    const language = clean(body.language, 40);
    const contact = clean(body.contact, 180);
    const message = clean(body.message, 1200);
    const consent = body.consent === true;

    if (!country || !institution || !role || !interest || !contact || !message || !consent) {
      return NextResponse.json({ error: 'Veuillez compléter les champs requis et accepter le suivi.' }, { status: 400 });
    }
    if (!allowedTypes.has(institutionType)) {
      return NextResponse.json({ error: 'Type d’institution non reconnu.' }, { status: 400 });
    }

    const submitted = { country, institution, institutionType, role, interest, population, language, contact, message };

    await db.analyticsEvent.create({
      data: {
        eventType: 'institutional_inbound_request',
        metadata: JSON.stringify({ submitted, receivedAt: new Date().toISOString(), status: 'received' }),
      },
    });

    let qualification: unknown = null;
    try {
      const generated = await aiChat(request, [
        { role: 'system', content: 'Tu es l’agent de qualification institutionnelle d’ADSO Africa. Analyse uniquement la demande fournie. N’invente aucun fait sur l’institution. Ne prétends jamais qu’elle est partenaire. Retourne un JSON avec relevance (low|medium|high), topic, context, evidence, suggestedResponse, nextAction, diplomacyCautions. Sois sobre, neutre et diplomatique.' },
        { role: 'user', content: JSON.stringify(submitted) },
      ], { agent: 'institutional-qualifier', maxTokens: 700, temperature: 0.1 });
      qualification = JSON.parse(generated);
    } catch {
      qualification = { relevance: 'medium', topic: interest, context: `${country} — ${institution}`, evidence: ['Demande entrante déclarée par le demandeur.'], suggestedResponse: 'Merci pour votre intérêt. ADSO Africa va examiner votre demande et revenir vers vous.', nextAction: 'Revue humaine', diplomacyCautions: ['Ne pas présenter la relation comme un partenariat avant accord formel.'] };
    }

    await db.analyticsEvent.create({
      data: {
        eventType: 'institutional_inbound_qualification',
        metadata: JSON.stringify({ receivedAt: new Date().toISOString(), country, institution, qualification }),
      },
    });

    return NextResponse.json({ ok: true, received: true, message: 'Votre demande a bien été reçue. Une réponse adaptée vous sera adressée.' });
  } catch {
    return NextResponse.json({ error: 'Impossible de traiter la demande pour le moment.' }, { status: 500 });
  }
}
