/**
 * Auth helpers for API routes.
 *
 * Provides getSession, requireAuth, and requireRole utilities
 * for use in Next.js API route handlers.
 */

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { hasMinRole, type ADSORole } from './rbac';

export { getServerSession };

export async function getSession() {
  // Keep public routes available when authentication configuration is absent.
  // Protected routes still fail closed through requireAuth/requireRole.
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret || secret.length < 32) return null;
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('[auth] session resolution failed', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Authentification requise' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

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

export function getUserRole(session: { user: Record<string, unknown> } | null): string {
  return (session?.user?.role as string) || 'student';
}

export function getUserId(session: { user: Record<string, unknown> } | null): string | null {
  return (session?.user?.id as string) || null;
}
