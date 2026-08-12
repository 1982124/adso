import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

let zaiClient: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!zaiClient) zaiClient = await ZAI.create();
  return zaiClient;
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireRole('admin');
    if (authError) return authError;
    const body = await request.json();
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question) return NextResponse.json({ error: 'Question requise' }, { status: 400 });
    if (question.length > 2000) return NextResponse.json({ error: 'Question trop longue' }, { status: 400 });

    const [users, courses, countries, enrollments, certifications, auditLogs, claims, policies, trips, hazards] = await Promise.all([
      db.user.count(), db.course.count(), db.country.count(), db.enrollment.count(),
      db.certification.count(), db.auditLogEntry.count(), db.insuranceClaim.count(),
      db.insurancePolicy.count(), db.telematicsTrip.count(),
      db.analyticsEvent.count({ where: { eventType: 'road_hazard' } }),
    ]);

    const context = { users, courses, countries, enrollments, certifications, auditLogs, claims, policies, trips, hazards };
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      model: 'deepseek-v3',
      messages: [
        {
          role: 'system',
          content: `Tu es ADSO Admin AI, assistant de pilotage sécurisé. Réponds en français. Tu ne dois jamais inventer une donnée: utilise uniquement le contexte chiffré fourni et explique lorsqu'une information manque. Donne une réponse courte, opérationnelle, puis une recommandation si elle est justifiée. Contexte temps réel ADSO: ${JSON.stringify(context)}`,
        },
        { role: 'user', content: question },
      ],
      temperature: 0.2,
      max_tokens: 700,
    });

    const reply = typeof response === 'string'
      ? response
      : (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content ?? 'Réponse indisponible.';

    await db.auditLogEntry.create({
      data: {
        userId: session!.user.id,
        action: 'read',
        resource: 'admin_ai',
        details: JSON.stringify({ question, contextKeys: Object.keys(context) }),
        status: 'success',
      },
    });

    return NextResponse.json({ reply, context, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[POST /api/admin/assistant] Error:', error);
    return NextResponse.json({ error: 'Erreur de l’assistant administratif' }, { status: 500 });
  }
}
