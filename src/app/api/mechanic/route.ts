import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { aiChat } from '@/lib/ai-gateway';

const CATEGORY_LABELS: Record<string, string> = {
  moteur: 'Moteur (Engine)', freinage: 'Freinage (Brakes)', transmission: 'Transmission',
  electricite: 'Electricite (Electrical)', direction: 'Direction (Steering)', suspension: 'Suspension',
  climatisation: 'Climatisation (AC)', echappement: "Systeme d'echappement (Exhaust)",
  pneumatiques: 'Pneumatiques (Tires)', batterie: 'Batterie',
};

const SEVERITY_LABELS: Record<string, string> = {
  leger: 'Leger (Minor)', modere: 'Modere (Moderate)', grave: 'Grave (Critical)',
};

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { category, subCategory, severity, description } = body;
    if (!category || !subCategory || !severity) {
      return NextResponse.json({ error: 'Champs requis manquants: categorie, sous-categorie, severite' }, { status: 400 });
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
  "causes": [{"cause": "Description de la cause", "probability": 75}, {"cause": "Autre cause possible", "probability": 15}, {"cause": "Troisieme cause", "probability": 10}],
  "severity": "${severity}",
  "costRange": {"min": 100, "max": 500},
  "repairTime": "1-2 heures",
  "parts": ["Piece 1", "Piece 2"],
  "recommendations": ["Action recommandee 1", "Action recommandee 2", "Action recommandee 3"]
}

Regles: probabilites des causes sommees a 100; cout en euros realiste pour le marche francais/europeen; temps realiste; pieces specifiques; recommandations concretes; meme severite (${severity}); francais; JSON valide; 3 a 5 causes ordonnees par probabilite decroissante.`;

    const content = await aiChat(request, [{ role: 'user', content: prompt }], { maxTokens: 700, temperature: 0.2 });
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

    let diagnosis: unknown;
    try {
      diagnosis = JSON.parse(jsonStr);
    } catch {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Impossible de parser la reponse de l'IA");
      diagnosis = JSON.parse(jsonMatch[0]);
    }
    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Mechanic diagnosis error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Erreur lors du diagnostic. Veuillez reessayer.' }, { status: 503 });
  }
}
