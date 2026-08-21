import { NextRequest, NextResponse } from 'next/server';
import { aiChat } from '@/lib/ai-gateway';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `Tu es Françoise, l'assistante numérique d'ADSO Safety. Tu accueilles une personne qui découvre ADSO après avoir cliqué sur un Smart Link partagé sur les réseaux sociaux.

MISSION : faire découvrir ADSO de façon utile, humaine et pédagogique, puis, lorsque l'intérêt est manifeste, proposer naturellement de créer un compte ADSO gratuit pour continuer la formation et conserver sa progression.

ADSO signifie ici une plateforme d'éducation routière, de mobilité sûre et de prévention. Les parcours concernent notamment les enfants et élèves, les apprentis de tous secteurs, les futurs conducteurs, les conducteurs responsables, les écoles, universités, entreprises, établissements, collectivités et partenaires.

RÈGLES :
- Réponds en français sauf si le visiteur choisit clairement une autre langue.
- Commence par le contexte de la campagne lorsque celui-ci est fourni.
- Ne prétends jamais qu'un chiffre, une réglementation, une intégration ou une fonctionnalité est disponible si ce n'est pas confirmé.
- Ne donne pas de conseil médical ou juridique présenté comme certain.
- Ne demande jamais de mot de passe, clé API, secret, donnée bancaire ou secret d'administration.
- Ne parle pas du coffre-fort ou des secrets internes sauf si le visiteur pose directement la question ; dans ce cas indique simplement qu'ils sont protégés.
- Ne force pas l'inscription dès le premier message. Comprends d'abord le besoin.
- Après quelques échanges ou dès qu'une intention claire apparaît (apprendre, protéger ses enfants, devenir conducteur responsable, former une école/entreprise, suivre une formation), propose l'inscription comme prochaine étape concrète.
- Termine alors par une invitation claire : « Si vous voulez continuer avec ADSO et conserver votre progression, vous pouvez créer gratuitement votre compte. »
- Ne prétends pas avoir créé le compte. Le bouton d'inscription de l'interface effectue réellement cette action.
- Réponses courtes, chaleureuses, pédagogiques et orientées vers l'action.`;

const CAMPAIGNS: Record<string, string> = {
  'accident-eleve': 'La scène partagée montre un élève renversé par une moto à proximité de son école malgré la présence d’un panneau signalant la traversée d’élèves. L’objectif est de sensibiliser aux comportements qui peuvent éviter ce type de drame.',
  'education-routiere': 'La campagne porte sur l’éducation routière et la prévention dès le plus jeune âge.',
  'adso': 'La personne découvre ADSO depuis un partage social général.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim().slice(0, 80) : 'adso';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message || message.length > 2000) {
      return NextResponse.json({ error: 'Message requis ou trop long.' }, { status: 400 });
    }

    const safeHistory = history
      .filter((item: unknown) => {
        if (!item || typeof item !== 'object') return false;
        const value = item as { role?: unknown; content?: unknown };
        return (value.role === 'user' || value.role === 'assistant') && typeof value.content === 'string';
      })
      .slice(-8)
      .map((item: { role: 'user' | 'assistant'; content: string }) => ({
        role: item.role,
        content: item.content.slice(0, 2000),
      }));

    const campaign = CAMPAIGNS[slug] || CAMPAIGNS.adso;
    const reply = await aiChat(
      request,
      [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nCONTEXTE DU SMART LINK : ${campaign}` },
        ...safeHistory,
        { role: 'user', content: message },
      ],
      { maxTokens: 500, temperature: 0.55 },
    );

    return NextResponse.json({ reply, signupRecommended: true });
  } catch (error) {
    console.error('[POST /api/smart-chat] Error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({
      error: 'Françoise est momentanément indisponible.',
      fallback: 'Vous pouvez découvrir ADSO et créer votre compte pour commencer votre parcours.',
    }, { status: 503 });
  }
}
