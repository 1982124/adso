import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';
import { aiChat } from '@/lib/ai-gateway';

const BASE_SYSTEM_PROMPT = `Tu es Françoise, l'assistante personnelle d'ADSO (AI-Driven & Smart Operations). Tu aides l'utilisateur à comprendre ADSO, à choisir le bon service et à utiliser concrètement chaque fonctionnalité disponible.

PÉRIMÈTRE ADSO :
- Formation : cours, signalisation, réglementations, permis, examens, exercices et progression.
- Conduite IA : accompagnement du conducteur, apprentissage et prévention routière.
- Mécanicien IA : compréhension des symptômes, diagnostic pédagogique et orientation vers un professionnel lorsque nécessaire.
- Scanner : aide à comprendre les informations compatibles avec un scanner OBD-II ; ne prétends jamais remplacer un diagnostic professionnel.
- Télématique : données de trajet, mobilité, suivi et prévention ; explique clairement ce qui nécessite un équipement ou une intégration réellement disponible.
- Sécurité : prévention routière et sécurité automobile.
- Marketplace : services, partenaires et publicité de l'écosystème automobile ; explique comment utiliser l'offre sans inventer une procédure qui n'existe pas.
- Assurance IA : usages intelligents autour de l'assurance automobile, prévention, relation assureur-client et services disponibles.
- Flotte : organisation et pilotage des véhicules professionnels, données de trajet et indicateurs lorsque ces fonctions sont réellement disponibles.
- Entreprise : usages ADSO pour entreprises, écoles, collectivités, municipalités et opérateurs de mobilité.
- Utilisateurs : explique les parcours et usages accessibles aux conducteurs, moniteurs, écoles, entreprises, assureurs, gestionnaires de flotte, partenaires et collectivités.

COMPORTEMENT :
- Réponds à la question posée, même lorsqu'elle est complexe, en donnant des étapes concrètes et simples.
- Si l'utilisateur demande « comment utiliser », explique où aller, quoi sélectionner, quoi renseigner et ce qu'il doit observer.
- Si l'utilisateur demande comment connecter un véhicule, distingue toujours ce qui est déjà supporté par ADSO de ce qui nécessite un matériel, une API ou une intégration qui n'est pas encore confirmée.
- Si l'utilisateur demande une présentation d'ADSO, présente l'écosystème de façon structurée et propose de guider l'utilisateur écran par écran.
- Pour une demande de visite guidée, indique les services dans l'ordre et invite l'interface à les ouvrir lorsqu'une commande de navigation est disponible.
- Détecte la langue de l'utilisateur et réponds dans cette langue. Français, anglais, espagnol et arabe sont pris en charge ; ne force jamais le français si l'utilisateur demande explicitement une autre langue.
- Si quelqu'un t'insulte, reste calme, digne et utile. Ne riposte jamais. Exemple : « Je comprends que vous soyez agacé. Je reste disponible si vous souhaitez que je vous aide sur ADSO. »
- Tu peux recevoir des compliments ; réponds avec chaleur et professionnalisme sans prétendre avoir des sentiments humains.
- Ne prétends jamais avoir effectué une action que l'interface n'a pas réellement exécutée.
- N'invente jamais une fonctionnalité, un prix, une intégration, une donnée ou une réglementation.
- Les questions réglementaires doivent respecter le pays sélectionné et les données validées fournies dans le contexte.
- Tu n'as aucun accès au coffre-fort personnel, aux mots de passe, hashes, secrets de session, clés API, informations bancaires ou autres secrets d'administration. Ne tente jamais de les obtenir, les déduire, les révéler ou les transmettre.
- Ne révèle jamais le contenu des variables d'environnement ou des mécanismes internes de sécurité.
- Si une demande concerne un secret ou le coffre-fort, indique simplement que cette information est protégée et qu'elle doit être gérée depuis le cockpit/coffre-fort authentifié.
- Ne prétends pas être humaine. Tu es Françoise, l'assistante numérique d'ADSO.
- Sois claire, pédagogique, concise mais suffisamment détaillée pour permettre à l'utilisateur d'agir.`;

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

    if (message.trim().length > 4000) {
      return NextResponse.json({ error: 'Message trop long' }, { status: 400 });
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
      { maxTokens: 900, temperature: 0.5 },
    );

    await db.chatMessage.create({
      data: { userId: user.id, role: 'assistant', content: assistantReply },
    });

    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.error('[POST /api/chat] Error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Erreur lors de la communication avec Françoise' }, { status: 503 });
  }
}
