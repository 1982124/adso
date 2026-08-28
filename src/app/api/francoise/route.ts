import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getSession, getUserId } from '@/lib/auth';
import { db } from '@/lib/db';
import { aiChat } from '@/lib/ai-gateway';

const COOKIE = 'adso_francoise_guest';
const WINDOW_MS = 60 * 60 * 1000;
const GUEST_LIMIT = 5;

type FrancoiseContext = {
  country?: string;
  language?: string;
  profile?: string;
  goal?: string;
  course?: string;
  competency?: string;
};

function sign(value: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function readGuestUsage(request: NextRequest) {
  const raw = request.cookies.get(COOKIE)?.value;
  if (!raw) return { count: 0, startedAt: Date.now() };
  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return { count: 0, startedAt: Date.now() };
  const expected = sign(payload);
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return { count: 0, startedAt: Date.now() };
  const [startedAtText, countText] = Buffer.from(payload, 'base64url').toString('utf8').split(':');
  const startedAt = Number(startedAtText);
  const count = Number(countText);
  if (!Number.isFinite(startedAt) || !Number.isFinite(count) || Date.now() - startedAt >= WINDOW_MS) {
    return { count: 0, startedAt: Date.now() };
  }
  return { count: Math.max(0, Math.floor(count)), startedAt };
}

function attachGuestCookie(response: NextResponse, startedAt: number, count: number) {
  const payload = Buffer.from(`${startedAt}:${count}`, 'utf8').toString('base64url');
  response.cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.ceil(WINDOW_MS / 1000),
  });
}

function sanitizeContext(value: unknown): FrancoiseContext {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  const clean: FrancoiseContext = {};
  for (const key of ['country', 'language', 'profile', 'goal', 'course', 'competency'] as const) {
    if (typeof source[key] === 'string' && source[key].trim()) clean[key] = source[key].trim().slice(0, 160);
  }
  return clean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    if (message.length > 2000) return NextResponse.json({ error: 'Message trop long' }, { status: 400 });

    const session = await getSession();
    const userId = getUserId(session);
    const guest = !userId;
    const usage = readGuestUsage(request);
    const clientContext = sanitizeContext(body.context);

    if (guest && usage.count >= GUEST_LIMIT) {
      return NextResponse.json(
        { error: 'Limite de démonstration atteinte. Connectez-vous à ADSO pour continuer avec Françoise.' },
        { status: 429 },
      );
    }

    let countryContext = '\nAucun pays utilisateur authentifié n\'est disponible. Ne présente jamais une règle nationale comme universelle. Si la question demande une règle précise, demande le pays.';
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      const countryCode = user?.country?.trim().toUpperCase();
      const country = countryCode ? await db.country.findUnique({ where: { code: countryCode } }) : null;
      if (country) {
        countryContext = `\nCONTEXTE ADSO — PAYS SÉLECTIONNÉ\nPays : ${country.name}\nAutorité : ${country.authority}\nCôté de circulation : ${country.drivingSide}\nÂge minimum : ${country.minAge}\nLangues : ${country.languages}\nVitesse urbaine enregistrée : ${country.speedUrban}\nVitesse rurale enregistrée : ${country.speedRural}\nVitesse autoroute enregistrée : ${country.speedHighway}\nDocuments : ${country.requiredDocuments}\nÉquipements : ${country.requiredEquipment}\nCatégories de permis : ${country.licenseCategories}\nN'invente aucune donnée absente.`;
      }
    }

    const learningContext = Object.entries(clientContext).length
      ? `\nCONTEXTE PÉDAGOGIQUE FOURNI PAR L'INTERFACE ADSO\n${Object.entries(clientContext).map(([key, value]) => `${key}: ${value}`).join('\n')}\nUtilise ce contexte pour personnaliser l'explication. Il ne constitue pas à lui seul une preuve réglementaire.`
      : '';

    const reply = await aiChat(
      request,
      [
        {
          role: 'system',
          content: `Tu es Françoise, l'assistante vocale et textuelle d'ADSO (Auto Drive School Online). Réponds dans la langue de l'utilisateur lorsque possible. Tu aides sur la mobilité, le code de la route, la sécurité routière, l'apprentissage et l'écosystème ADSO. Sois claire, chaleureuse, concise et factuelle. Pour toute règle réglementaire, distingue clairement une information vérifiée d'une information manquante et n'invente jamais. Les opérations sensibles, financières, contractuelles ou administratives ne sont jamais exécutées depuis cette conversation publique. ${countryContext}${learningContext}`,
        },
        { role: 'user', content: message },
      ],
      { maxTokens: 600, temperature: 0.4 },
    );

    const response = NextResponse.json({ reply, assistant: 'francoise' });
    if (guest) attachGuestCookie(response, usage.startedAt, usage.count + 1);
    return response;
  } catch (error) {
    console.error('[POST /api/francoise] Error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Françoise est momentanément indisponible.' }, { status: 503 });
  }
}
