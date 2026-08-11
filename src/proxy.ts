import { NextRequest, NextResponse } from 'next/server';

/**
 * ADSO request hardening.
 *
 * Responsibilities:
 * 1. Add security headers to every application response.
 * 2. Rate-limit public and authentication API traffic.
 * 3. Prevent caching of authentication/API responses.
 * 4. Keep the seed endpoint disabled in production.
 *
 * Note: the in-memory limiter is a local safety net. Production abuse
 * protection should also be enforced at the deployment/edge layer so limits
 * remain effective across multiple instances.
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const PUBLIC_API_LIMIT = 100;
const AUTH_API_LIMIT = 10;
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanupRateLimits() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now >= entry.resetAt) rateLimitMap.delete(key);
  }
}

function checkRateLimit(key: string, max: number): { allowed: boolean; remaining: number } {
  cleanupRateLimits();
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now >= existing.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: max - 1 };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  existing.count++;
  return { allowed: true, remaining: max - existing.count };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function securityHeaders() {
  return [
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss:; frame-ancestors 'none';",
    },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
  ];
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  for (const header of securityHeaders()) {
    response.headers.set(header.key, header.value);
  }

  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request);
    const isAuthRoute = pathname.startsWith('/api/auth/');
    const limit = isAuthRoute ? AUTH_API_LIMIT : PUBLIC_API_LIMIT;
    const bucket = isAuthRoute ? `auth:${ip}` : `api:${ip}`;
    const { allowed, remaining } = checkRateLimit(bucket, limit);

    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remaining));

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans une minute.' },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '60',
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }
  }

  if (pathname === '/api/seed' && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint désactivé en production' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
