/**
 * Auth helpers for API routes.
 *
 * Provides getSession, requireAuth, and requireRole utilities
 * for use in Next.js API route handlers.
 */

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { hasMinRole, type ADSORole } from './rbac';

// ─── Re-export types from next-auth for convenience ───
export { getServerSession };

// ─── Helpers ──────────────────────────────────────────

/**
 * Get the current authenticated session (or null).
 */
export async function getSession() {
  return getServerSession();
}

/**
 * Require authentication — returns the session or a 401 response.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Authentification requise' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

/**
 * Require a minimum role — returns the session or an appropriate error.
 */
export async function requireRole(minRole: ADSORole) {
  const { error: authError, session } = await requireAuth();
  if (authError) return { error: authError, session: null };

  const userRole = (session!.user as Record<string, unknown>).role as string || 'student';

  if (!hasMinRole(userRole, minRole)) {
    return {
      error: NextResponse.json(
        { error: 'Permissions insuffisantes', required: minRole, current: userRole },
        { status: 403 },
      ),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Shorthand to get user role from session, with a fallback.
 */
export function getUserRole(session: { user: Record<string, unknown> } | null): string {
  return (session?.user?.role as string) || 'student';
}

/**
 * Shorthand to get user ID from session.
 */
export function getUserId(session: { user: Record<string, unknown> } | null): string | null {
  return (session?.user?.id as string) || null;
}
