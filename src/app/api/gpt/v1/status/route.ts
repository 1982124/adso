import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireGptAction } from '@/lib/gpt-action-auth';

export async function GET(request: NextRequest) {
  const authError = requireGptAction(request);
  if (authError) return authError;

  try {
    const [users, courses, countries, enrollments, certifications] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.country.count(),
      db.enrollment.count(),
      db.certification.count(),
    ]);

    return NextResponse.json({
      service: 'ADSO',
      status: 'ok',
      assistant: 'Françoise',
      capabilities: ['text-to-text', 'voice-to-voice', 'text-to-voice', 'voice-to-text'],
      metrics: { users, courses, countries, enrollments, certifications },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[GET /api/gpt/v1/status] Error:', error);
    return NextResponse.json({ error: 'Unable to read ADSO status' }, { status: 500 });
  }
}
