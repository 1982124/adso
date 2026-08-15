import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getUserId } from '@/lib/auth';
import crypto from 'crypto';

function randomChars(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) result += chars[bytes[i] % chars.length];
  return result;
}

function getExpirationDate(type: string): Date {
  const now = new Date();
  const years = type === 'course_completion' ? 1 : type === 'exam_passed' ? 2 : type === 'full_license' ? 5 : type === 'safety_award' ? 3 : 1;
  now.setFullYear(now.getFullYear() + years);
  return now;
}

function normalizeCountry(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== 'ZZ' ? code : null;
}

export async function GET() {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    const certifications = await db.certification.findMany({ where: { userId }, orderBy: { issuedAt: 'desc' } });
    return NextResponse.json({ certifications, total: certifications.length });
  } catch (error) {
    console.error('[GET /api/certifications] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des certifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth();
    if (authError) return authError;
    const userId = getUserId(session)!;
    const body = await request.json();
    const { type, title, description, countryCode, licenseCode, score } = body as {
      type?: string; title?: string; description?: string; countryCode?: string; licenseCode?: string; score?: number;
    };

    if (!type || !title || !description) {
      return NextResponse.json({ error: 'type, titre et description sont requis' }, { status: 400 });
    }
    const normalizedCountry = normalizeCountry(countryCode);
    if (!normalizedCountry) {
      return NextResponse.json({ error: 'countryCode ISO-3166-1 alpha-2 valide requis' }, { status: 400 });
    }
    if (score !== undefined && (!Number.isFinite(score) || score < 0 || score > 100)) {
      return NextResponse.json({ error: 'score invalide' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    // Never infer a jurisdiction for a certificate. The selected country is an
    // explicit business fact and must be supplied by the authenticated flow.
    const certificateId = `ADSO-${randomChars(4)}-${randomChars(4)}`;
    const qrCode = crypto.randomUUID();
    const certification = await db.certification.create({
      data: {
        userId,
        type,
        title,
        description,
        countryCode: normalizedCountry,
        licenseCode: licenseCode?.trim() || null,
        score: score ?? null,
        qrCode,
        certificateId,
        expiresAt: getExpirationDate(type),
      },
    });
    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/certifications] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la certification' }, { status: 500 });
  }
}
