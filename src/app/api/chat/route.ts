import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';
import { aiChat } from '@/lib/ai-gateway';

const BASE_SYSTEM_PROMPT = `Tu es l'ADSO AI Coach, le coach intelligent d'Auto Drive School Online.

Ton rôle est d'aider les élèves conducteurs à comprendre les règles et les bonnes pratiques de conduite applicables à leur pays sélectionné, à apprendre la sécurité routière et à se préparer à leur parcours ADSO.

Règles impératives :
- Utilise uniquement le pays et les données réglementaires fournis dans le contexte.
- Ne mélange jamais les règles de deux pays.
- Si une information réglementaire nécessaire n'est pas disponible dans le contexte, dis clairement que tu ne disposes pas de cette donnée au lieu de l'inventer.
- Ne présente jamais une hypothèse comme une règle officielle.
- Réponds dans la langue de l'utilisateur lorsque cela est possible.
- Reste clair, pédagogique, précis et encourageant.
- Si une question est hors sujet, redirige poliment vers la conduite et la mobilité.
- Limite tes réponses à quelques phrases concises et utiles.`;

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;

    const body = await request.json();
    const { message } = body as { message?: string };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const countryCode = user.country?.trim().toUpperCase();
    const country = countryCode
      ? await db.country.findUnique({ where: { code: countryCode } })
      : null;

    const countryContext = country
      ? `\nCONTEXTE RÉGLEMENTAIRE ADSO — PAYS SÉLECTIONNÉ\nCode pays : ${country.code}\nPays : ${country.name}\nAutorité : ${country.authority}\nCôté de circulation : ${country.drivingSide}\nÂge minimum : ${country.minAge}\nLangues disponibles : ${country.languages}\nLimitation urbaine enregistrée : ${country.speedUrban}\nLimitation rurale enregistrée : ${country.speedRural}\nLimitation autoroute enregistrée : ${country.speedHighway}\nDocuments requis enregistrés : ${country.requiredDocuments}\nÉquipements requis enregistrés : ${country.requiredEquipment}\nCatégories de permis enregistrées : ${country.licenseCategories}\nSi une donnée ci-dessus est absente ou incertaine, indique-le explicitement.`
      : `\nCONTEXTE RÉGLEMENTAIRE : aucune fiche pays validée n'est disponible pour le pays sélectionné (${countryCode || 'inconnu'}). N'invente aucune règle. Informe l'utilisateur qu'une donnée réglementaire validée est nécessaire.`;

    await db.chatMessage.create({
      data: { userId: user.id, role: 'user', content: message.trim() },
    });

    const recentMessages = await db.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const chatHistory = recentMessages
      .reverse()
      .slice(0, -1)
      .map((msg) => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));

    const assistantReply = await aiChat(
      request,
      [
        { role: 'system', content: `${BASE_SYSTEM_PROMPT}${countryContext}` },
        ...chatHistory,
        { role: 'user', content: message.trim() },
      ],
      { maxTokens: 500, temperature: 0.7 },
    );

    await db.chatMessage.create({
      data: { userId: user.id, role: 'assistant', content: assistantReply },
    });

    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.error('[POST /api/chat] Error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Erreur lors de la communication avec le coach IA' }, { status: 503 });
  }
}
