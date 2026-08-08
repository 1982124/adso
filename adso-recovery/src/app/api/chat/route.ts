import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!_zai) _zai = await ZAI.create();
  return _zai;
}

const SYSTEM_PROMPT = `Tu es l'ADSO AI Coach, le coach de conduite intelligent d'Auto Drive School Online. Tu es un expert dans l'éducation à la conduite en France.

Ton rôle est d'aider les élèves conducteurs à :
- Comprendre le code de la route français
- Apprendre les règles de sécurité routière
- Se préparer à l'examen du permis de conduire
- Répondre aux questions sur la signalisation, les priorités, les limitations de vitesse
- Donner des conseils pratiques pour la conduite

Réponds toujours en français, de manière claire, pédagogique et encourageante.
Si une question est hors sujet, redirige poliment vers le domaine de la conduite.
Limite tes réponses à quelques phrases concises et utiles.`;

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;

    const body = await request.json();
    const { message } = body as { message?: string };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        userId: user.id,
        role: 'user',
        content: message.trim(),
      },
    });

    // Fetch recent chat history (last 20 messages) for context
    const recentMessages = await db.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Build chat history in chronological order (exclude the just-saved message)
    const chatHistory = recentMessages
      .reverse()
      .slice(0, -1)
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Call LLM via z-ai-web-dev-sdk
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      model: 'deepseek-v3',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory,
        { role: 'user', content: message.trim() },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantReply = typeof response === 'string'
      ? response
      : (response as Record<string, unknown>)?.content
        ? String((response as Record<string, unknown>).content)
        : (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content
          ?? 'Désolé, je n\'ai pas pu générer une réponse.';

    // Save assistant message
    await db.chatMessage.create({
      data: {
        userId: user.id,
        role: 'assistant',
        content: assistantReply,
      },
    });

    return NextResponse.json({
      reply: assistantReply,
    });
  } catch (error) {
    console.error('[POST /api/chat] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la communication avec le coach IA' },
      { status: 500 }
    );
  }
}
