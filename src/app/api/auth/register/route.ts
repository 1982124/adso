import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

const RESERVED_ADMIN_EMAIL = 'neodigitalstartupacademy@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const password = String(body.password || '');

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe sont requis.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    if (email === RESERVED_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Cette adresse est réservée au compte administrateur ADSO.' }, { status: 403 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });

    const passwordHash = await hashPassword(password);

    const user = await db.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          name,
          role: 'student',
          country: 'FR',
          language: 'fr',
          subscription: 'free',
        },
        select: { id: true, email: true, name: true, role: true },
      });

      await tx.$executeRaw`
        INSERT INTO "UserCredential" ("id", "userId", "passwordHash")
        VALUES (${crypto.randomUUID()}, ${createdUser.id}, ${passwordHash})
      `;

      return createdUser;
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Impossible de créer le compte.' }, { status: 500 });
  }
}
