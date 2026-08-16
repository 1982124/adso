import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export function requireGptAction(request: NextRequest): NextResponse | null {
  const configured = process.env.ADSO_GPT_ACTION_KEY?.trim();
  if (!configured) {
    return NextResponse.json({ error: 'GPT Actions integration is not configured' }, { status: 503 });
  }

  const authorization = request.headers.get('authorization') ?? '';
  const [scheme, token] = authorization.split(' ', 2);
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return NextResponse.json({ error: 'Missing Bearer authentication' }, { status: 401 });
  }

  const expected = Buffer.from(configured, 'utf8');
  const provided = Buffer.from(token, 'utf8');
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return NextResponse.json({ error: 'Invalid GPT Actions credentials' }, { status: 401 });
  }

  return null;
}
