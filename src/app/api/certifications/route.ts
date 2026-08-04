import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

function randomChars(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

function getExpirationDate(type: string): Date {
  const now = new Date();
  switch (type) {
    case 'course_completion':
      now.setFullYear(now.getFullYear() + 1);
      break;
    case 'exam_passed':
      now.setFullYear(now.getFullYear() + 2);
      break;
    case 'full_license':
      now.setFullYear(now.getFullYear() + 5);
      break;
    case 'safety_award':
      now.setFullYear(now.getFullYear() + 3);
      break;
    default:
      now.setFullYear(now.getFullYear() + 1);
  }
  return now;
}

// ── GET: List user certifications ──
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    // Resolve user by email or id
    let user;
    user = await db.user.findUnique({ where: { email: userId } });
    if (!user) {
      user = await db.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const certifications = await db.certification.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({
      certifications,
      total: certifications.length,
    });
  } catch (error) {
    console.error('[GET /api/certifications] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des certifications' },
      { status: 500 }
    );
  }
}

// ── POST: Issue a new certification ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      title,
      description,
      countryCode,
      licenseCode,
      score,
    } = body as {
      userId?: string;
      type?: string;
      title?: string;
      description?: string;
      countryCode?: string;
      licenseCode?: string;
      score?: number;
    };

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: 'userId, type, titre et description sont requis' },
        { status: 400 }
      );
    }

    // Resolve user by email or id
    let user;
    user = await db.user.findUnique({ where: { email: userId } });
    if (!user) {
      user = await db.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const certificateId = `ADSO-${randomChars(4)}-${randomChars(4)}`;
    const qrCode = crypto.randomUUID();
    const expiresAt = getExpirationDate(type);

    const certification = await db.certification.create({
      data: {
        userId: user.id,
        type,
        title,
        description,
        countryCode: countryCode ?? 'FR',
        licenseCode: licenseCode ?? null,
        score: score ?? null,
        qrCode,
        certificateId,
        expiresAt,
      },
    });

    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/certifications] Error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la certification" },
      { status: 500 }
    );
  }
}
