import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { aiChat } from '@/lib/ai-gateway';

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
    const reply = await aiChat(
      request,
      [
        {
          role: 'system',
          content: `Tu es ADSO Admin AI, assistante de direction sécurisée. Réponds en français. N'invente jamais une donnée : utilise uniquement le contexte chiffré fourni et signale toute information absente. Distingue faits observés, limites et recommandations. Les actions sensibles nécessitent une validation humaine. Contexte temps réel ADSO : ${JSON.stringify(context)}`,
        },
        { role: 'user', content: question },
      ],
      { model: process.env.ADSO_AI_MODEL || 'gpt-5.4', temperature: 0.2, maxTokens: 700 },
    );

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
