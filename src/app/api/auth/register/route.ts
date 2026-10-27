import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const password = String(body.password || '');
    // Respect the country/language selected in the learner onboarding cookies.
    // If the learner registers directly from a scene, keep the country explicitly
    // unknown instead of silently assigning France as the default context.
    const cookieHeader = request.headers.get('cookie') || '';
    const readCookie = (key: string) => {
      const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${key}=`));
      return entry ? decodeURIComponent(entry.slice(key.length + 1)) : '';
    };
    let country = 'ZZ';
    try {
      const selectedCountry = JSON.parse(readCookie('adso-country')) as { code?: unknown };
      if (typeof selectedCountry.code === 'string' && /^[A-Z]{2}$/.test(selectedCountry.code)) {
        country = selectedCountry.code;
      }
    } catch {
      // A missing or invalid cookie means the learner still needs to choose a country.
    }
    const requestedCountry = String(body.country || '').trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(requestedCountry)) country = requestedCountry;
    const requestedLanguage = String(body.language || '').trim().toLowerCase();
    const selectedLanguage = requestedLanguage || readCookie('adso-locale').toLowerCase();
    const language = ['fr', 'en'].includes(selectedLanguage) ? selectedLanguage : 'fr';

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

    const passwordHash = await hashPassword(password);

    const user = await db.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          name,
          role: 'student',
          country,
          language,
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
