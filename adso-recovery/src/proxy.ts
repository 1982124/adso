import { NextRequest, NextResponse } from 'next/server';

/**
 * ADSO Middleware — runs on every request.
 *
 * Responsibilities:
 * 1. Add security headers (CSP, HSTS, etc.)
 * 2. Rate limiting on public API routes
 * 3. Protect /api/seed in production
 */

// ─── Rate limiter state (per-middleware, in-memory) ───────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window per IP
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

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  cleanupRateLimits();
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (!existing || now >= existing.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  existing.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

// ─── Security headers ────────────────────────────────────
function securityHeaders() {
  return [
    // Content Security Policy
    { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss:; frame-ancestors 'none';" },
    // HTTP Strict Transport Security
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    // X-Frame-Options
    { key: 'X-Frame-Options', value: 'DENY' },
    // X-Content-Type-Options
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // Referrer-Policy
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // Permissions-Policy
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
    // X-XSS-Protection (legacy)
    { key: 'X-XSS-Protection', value: '1; mode=block' },
  ];
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── 1. Apply security headers to all responses ───────
  for (const header of securityHeaders()) {
    response.headers.set(header.key, header.value);
  }

  // ─── 2. Rate limiting on public API routes ───────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const ip = getClientIp(request);
    const { allowed, remaining } = checkRateLimit(ip);
    response.headers.set('X-RateLimit-Remaining', String(remaining));

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans une minute.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }
  }

  // ─── 3. Protect /api/seed in production ──────────────
  if (pathname === '/api/seed' && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint désactivé en production' },
      { status: 403 },
    );
  }

  return response;
}

// ─── Matcher: run on all routes except static assets and _next ──
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
