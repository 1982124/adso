/**
 * In-memory rate limiter for API routes.
 *
 * Uses a simple sliding window counter per IP.
 * In production, replace with Redis or similar distributed store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Cleanup old entries every 60s */
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (IP, userId, etc.).
 *
 * @param key   — unique identifier (e.g. IP address)
 * @param limit — max requests in the window
 * @param windowMs — window duration in milliseconds (default: 60s)
 */
export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60_000,
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Get the client IP from a NextRequest.
 * Checks X-Forwarded-For, X-Real-IP, then falls back to a default.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
