import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET: Verify a certificate by public ID ──
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json(
        { error: 'certificateId requis' },
        { status: 400 }
      );
    }

    const certificate = await db.certification.findUnique({
      where: { certificateId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({
        valid: false,
        error: 'Certificat non trouvé',
      });
    }

    const { user, ...certificateData } = certificate;

    return NextResponse.json({
      valid: true,
      certificate: {
        ...certificateData,
        userName: user.name,
      },
    });
  } catch (error) {
    console.error('[GET /api/certifications/:certificateId] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du certificat' },
      { status: 500 }
    );
  }
}
