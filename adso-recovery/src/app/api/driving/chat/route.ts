import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!_zai) _zai = await ZAI.create();
  return _zai;
}

const SYSTEM_PROMPT = `Tu es l'Instructeur IA d'ADSO V4.1, un instructeur de conduite intelligent et bienveillant. Tu aides les élèves conducteurs en temps réel pendant leurs sessions de conduite.

Ton rôle :
- Donner des instructions claires et rassurantes en temps réel
- Corriger les erreurs de conduite avec bienveillance
- Donner des conseils de sécurité immédiats
- Adapter ton ton au niveau de l'élève (débutant, intermédiaire, avancé)
- Analyser les événements de conduite signalés (freinage brutal, accélération forte, virage serré, etc.)
- Proposer des exercices adaptés aux faiblesses de l'élève
- Encourager et motiver l'élève

Réponds toujours en français, de manière concise et directe (2-4 phrases max).
Si un événement de conduite est signalé, réagis immédiatement avec un conseil approprié.
Utilise un ton professionnel mais chaleureux.`;

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { message, sessionId, score, events } = body as {
      message?: string;
      sessionId?: string;
      score?: number;
      events?: Array<{ type: string; severity: string }>;
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Build context from session data
    let contextMsg = '';
    if (score !== undefined) {
      contextMsg += `Score de conduite actuel: ${score}/100. `;
    }
    if (events && events.length > 0) {
      contextMsg += `Événements récents: ${events.slice(-5).map((e) => `${e.type} (${e.severity})`).join(', ')}. `;
    }

    const userMessage = contextMsg
      ? `${contextMsg}\nMessage de l'élève: ${message}`
      : message;

    // Call LLM
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      model: 'deepseek-v3',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = typeof response === 'string'
      ? response
      : (response as Record<string, unknown>)?.content
        ? String((response as Record<string, unknown>).content)
        : (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content
          ?? 'Désolé, je n\'ai pas pu générer une réponse.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[POST /api/driving/chat] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la communication avec l\'instructeur IA' },
      { status: 500 }
    );
  }
}
