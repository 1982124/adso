import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!_zai) _zai = await ZAI.create();
  return _zai;
}

const CATEGORY_LABELS: Record<string, string> = {
  moteur: 'Moteur (Engine)',
  freinage: 'Freinage (Brakes)',
  transmission: 'Transmission',
  electricite: 'Electricite (Electrical)',
  direction: 'Direction (Steering)',
  suspension: 'Suspension',
  climatisation: 'Climatisation (AC)',
  echappement: "Systeme d'echappement (Exhaust)",
  pneumatiques: 'Pneumatiques (Tires)',
  batterie: 'Batterie',
};

const SEVERITY_LABELS: Record<string, string> = {
  leger: 'Leger (Minor)',
  modere: 'Modere (Moderate)',
  grave: 'Grave (Critical)',
};

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { category, subCategory, severity, description } = body;

    if (!category || !subCategory || !severity) {
      return NextResponse.json(
        { error: 'Champs requis manquants: categorie, sous-categorie, severite' },
        { status: 400 }
      );
    }

    const categoryLabel = CATEGORY_LABELS[category] || category;
    const severityLabel = SEVERITY_LABELS[severity] || severity;

    const prompt = `Tu es un mecanicien automobile expert avec 30 ans d'experience. Tu dois diagnostiquer un probleme de vehicule.

INFORMATIONS DU SYMPTOME:
- Categorie: ${categoryLabel}
- Sous-categorie: ${subCategory}
- Severite: ${severityLabel}
${description ? `- Description du patient: ${description}` : ''}

Reponds EXACTEMENT au format JSON suivant, sans aucun texte supplementaire, sans backticks, sans markdown:
{
  "problem": "Description claire du probleme identifie en 1-2 phrases",
  "causes": [
    {"cause": "Description de la cause", "probability": 75},
    {"cause": "Autre cause possible", "probability": 15},
    {"cause": "Troisieme cause", "probability": 10}
  ],
  "severity": "${severity}",
  "costRange": {"min": 100, "max": 500},
  "repairTime": "1-2 heures",
  "parts": ["Piece 1", "Piece 2"],
  "recommendations": ["Action recommandee 1", "Action recommandee 2", "Action recommandee 3"]
}

Règles:
- Les probabilites des causes doivent sommer a 100
- Le cout est en euros, realiste pour le marche francais/europeen
- Le temps de reparation doit etre realiste
- Les pieces doivent etre specifiques au probleme
- Les recommandations doivent etre des actions concretes et utiles
- Utilise le meme niveau de severite que celui fourni (${severity})
- Reponds en francais
- Assure-toi que le JSON est valide
- Les causes doivent etre entre 3 et 5, ordonnees par probabilite decroissante`;

    const zai = await getZAI();
    const result = await zai.chat.completions.create({
      model: 'deepseek-v3',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = typeof result === 'string' ? result : (result as Record<string, unknown>).content as string || JSON.stringify(result);

    // Clean response - remove markdown code blocks if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let diagnosis;
    try {
      diagnosis = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Impossible de parser la reponse de l\'IA');
      }
    }

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Mechanic diagnosis error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du diagnostic. Veuillez reessayer.' },
      { status: 500 }
    );
  }
}
