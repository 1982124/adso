/**
 * Security utilities for the ADSO platform.
 *
 * Provides HTML sanitisation, IP-based in-memory rate limiting,
 * client-IP extraction, request-ID generation, and entity sanitisation.
 */

import { randomUUID } from 'crypto';

// ─── HTML Sanitisation ─────────────────────────────────────────────────────

/** Tags that are safe to keep in user-generated HTML. */
const SAFE_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'span', 'div',
]);

/** All `on*` event-handler attribute names. */
const EVENT_HANDLER_RE = /^on/i;

/** Dangerous URL schemes. */
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript)\s*:/i;

/** Matches any HTML tag. */
const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;

/** Matches an attribute name=value pair (or a boolean attribute). */
const ATTR_RE = /([a-zA-Z][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

/** Matches all HTML tags (for full strip). */
const ALL_TAGS_RE = /<[^>]*>/g;

/**
 * Remove dangerous HTML tags and attributes while preserving safe content.
 *
 * Keeps only tags listed in `SAFE_TAGS`. Strips all event-handler attributes
 * (`onclick`, `onerror`, …) and `javascript:` / `data:` URL values.
 *
 * @param input - Raw HTML string from user input.
 * @returns Sanitised HTML string with dangerous elements removed.
 */
export function sanitizeHtml(input: string): string {
  let result = input;

  // Replace <script> contents with empty string first
  result = result.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Process remaining tags
  result = result.replace(TAG_RE, (_match, tagName: string, attrsStr: string) => {
    const tag = tagName.toLowerCase();

    // Strip unsafe tags entirely (including their content is handled above for script)
    if (!SAFE_TAGS.has(tag)) {
      return '';
    }

    // Sanitise attributes
    const safeAttrs = sanitizeAttributes(attrsStr);
    const selfClosing = tag === 'br' ? ' /' : '';
    const closing = _match.startsWith('</') ? '/' : '';

    if (closing) {
      return `</${tag}>`;
    }

    return safeAttrs
      ? `<${tag} ${safeAttrs}${selfClosing}>`
      : `<${tag}${selfClosing}>`;
  });

  return result;
}

/**
 * Filter a string of HTML attributes, keeping only safe ones.
 */
function sanitizeAttributes(attrsStr: string): string {
  const safe: string[] = [];
  let attrMatch: RegExpExecArray | null;

  ATTR_RE.lastIndex = 0;
  while ((attrMatch = ATTR_RE.exec(attrsStr)) !== null) {
    const name = attrMatch[1];
    const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

    // Skip event handlers
    if (EVENT_HANDLER_RE.test(name)) continue;

    // Skip style attributes (potential CSS injection)
    if (name === 'style') continue;

    // For href / src attributes, validate the protocol
    if (name === 'href' || name === 'src') {
      if (DANGEROUS_PROTOCOLS.test(value.trim())) continue;
    }

    safe.push(`${name}="${escapeAttrValue(value)}"`);
  }

  return safe.join(' ');
}

/**
 * Escape special characters inside an HTML attribute value.
 */
function escapeAttrValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Create an in-memory, IP-based rate limiter with automatic cleanup.
 *
 * @param options.windowMs    - Time window in milliseconds.
 * @param options.maxRequests - Maximum number of requests allowed per window.
 * @returns An object with `check(ip)` and `getRemaining(ip)` methods.
 *
 * @example
 * ```ts
 * const limiter = rateLimit({ windowMs: 60_000, maxRequests: 30 });
 * if (!limiter.check(clientIp)) return apiRateLimited();
 * ```
 */
export function rateLimit(options: { windowMs: number; maxRequests: number }): {
  check: (ip: string) => boolean;
  getRemaining: (ip: string) => number;
} {
  const { windowMs, maxRequests } = options;
  const store = new Map<string, RateLimitEntry>();
  let cleanupTimer: ReturnType<typeof setInterval> | undefined;

  /** Remove expired entries so the map doesn't grow unbounded. */
  function cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
  }

  // Periodic cleanup every window — avoids stale entries accumulating.
  cleanupTimer = setInterval(cleanup, windowMs);
  if (cleanupTimer.unref) cleanupTimer.unref();

  /**
 * Check whether the given IP is still within its rate limit.
 * Returns `true` if the request is allowed, `false` if rate-limited.
 */
  function check(ip: string): boolean {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now >= entry.resetAt) {
      // First request or window expired — reset counter
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }

    entry.count += 1;
    return entry.count <= maxRequests;
  }

  /**
 * Get the number of remaining requests for the given IP in the current window.
 */
  function getRemaining(ip: string): number {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now >= entry.resetAt) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - entry.count);
  }

  return { check, getRemaining };
}

// ─── Client IP Extraction ───────────────────────────────────────────────────

/**
 * Extract the client's IP address from the request headers.
 *
 * Checks `x-forwarded-for` first (takes the leftmost entry),
 * then falls back to `x-real-ip`. Returns `'127.0.0.1'` if neither is present.
 *
 * @param request - The incoming `Request` object.
 * @returns The client IP as a string.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain multiple IPs; take the first (client) one
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return '127.0.0.1';
}

// ─── Request ID ─────────────────────────────────────────────────────────────

/**
 * Generate a unique request identifier for tracing and logging.
 *
 * Uses `crypto.randomUUID()` under the hood.
 *
 * @returns A UUID v4 string (e.g. `'550e8400-e29b-41d4-a716-446655440000'`).
 */
export function generateRequestId(): string {
  return randomUUID();
}

// ─── Entity Sanitisation ────────────────────────────────────────────────────

/**
 * Strip ALL HTML tags from user-generated content.
 * Used for entity types where even safe HTML should not be preserved
 * (names, emails, messages, subjects, etc.).
 *
 * @param input - Raw string potentially containing HTML.
 * @returns Plain-text string with all HTML removed.
 */
export function sanitizeEntities(input: string): string {
  // Decode common HTML entities first, then strip tags
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(ALL_TAGS_RE, '')
    .trim();
}
