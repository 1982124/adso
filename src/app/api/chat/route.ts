import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';
import { aiChat } from '@/lib/ai-gateway';

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
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

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
        { role: 'system', content: SYSTEM_PROMPT },
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
