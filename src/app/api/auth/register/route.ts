import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

async function ensureCredentialStore() {
  await db.$executeRaw`
    CREATE TABLE IF NOT EXISTS UserCredential (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `;
}

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

    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });

    await ensureCredentialStore();
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
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

    await db.$executeRaw`
      INSERT INTO UserCredential (id, userId, passwordHash)
      VALUES (${crypto.randomUUID()}, ${user.id}, ${passwordHash})
    `;

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Impossible de créer le compte.' }, { status: 500 });
  }
}
