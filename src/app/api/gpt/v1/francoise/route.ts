import { NextRequest, NextResponse } from 'next/server';
import { requireGptAction } from '@/lib/gpt-action-auth';
import { aiChat } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  const authError = requireGptAction(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    const language = typeof body.language === 'string' ? body.language.trim() : 'fr';
    const mode = typeof body.mode === 'string' ? body.mode.trim() : 'executive';

    if (!question) return NextResponse.json({ error: 'question is required' }, { status: 400 });
    if (question.length > 4000) return NextResponse.json({ error: 'question is too long' }, { status: 400 });

    const reply = await aiChat(
      request,
      [{
        role: 'system',
        content: `Tu es Françoise, l'assistante exécutive IA d'ADSO. Mode: ${mode}. Langue demandée: ${language}. Réponds dans cette langue. Sois précise, professionnelle et transparente. N'invente jamais une donnée opérationnelle. Tu peux conseiller et préparer des actions, mais les décisions juridiques, financières sensibles, signatures et changements critiques nécessitent une validation humaine explicite.`,
      }, { role: 'user', content: question }],
      { model: process.env.ADSO_AI_MODEL || 'gpt-5.4', temperature: 0.2, maxTokens: 1000 },
    );

    return NextResponse.json({
      assistant: 'Françoise',
      mode,
      language,
      reply,
      actionPolicy: 'prepare_or_recommend; sensitive_actions_require_human_approval',
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[POST /api/gpt/v1/francoise] Error:', error);
    return NextResponse.json({ error: 'Françoise is temporarily unavailable' }, { status: 500 });
  }
}
