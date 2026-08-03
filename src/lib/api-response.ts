/**
 * Standardised API response helpers for ADSO.
 *
 * Every API route should return responses via these functions to ensure
 * a consistent JSON envelope: `{ success, data?, error? }`.
 */

import { NextResponse } from 'next/server';

// ─── Envelope types ─────────────────────────────────────────────────────────

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

interface ApiErrorEnvelope {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Return a successful JSON response.
 *
 * @param data   - The payload to include in `data`.
 * @param status - HTTP status code (defaults to 200).
 * @returns A `NextResponse` with `{ success: true, data }`.
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiEnvelope<T>> {
  return NextResponse.json({ success: true as const, data } satisfies ApiSuccessEnvelope<T>, { status });
}

/**
 * Return an error JSON response.
 *
 * @param message - Human-readable error message (French preferred).
 * @param status  - HTTP status code (defaults to 500).
 * @param details - Optional extra context (e.g. Zod errors) for debugging.
 * @returns A `NextResponse` with `{ success: false, error: { message, details? } }`.
 */
export function apiError(
  message: string,
  status: number = 500,
  details?: unknown,
): NextResponse<ApiEnvelope<never>> {
  return NextResponse.json(
    { success: false as const, error: { message, details } } satisfies ApiErrorEnvelope,
    { status },
  );
}

/**
 * Return a 400 Bad Request response.
 *
 * @param message - Error description.
 * @param details - Optional validation / debug details.
 */
export function apiBadRequest(
  message: string = 'Requête invalide',
  details?: unknown,
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 400, details);
}

/**
 * Return a 401 Unauthorized response.
 *
 * @param message - Error description (defaults to French message).
 */
export function apiUnauthorized(
  message: string = 'Authentification requise',
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 401);
}

/**
 * Return a 403 Forbidden response.
 *
 * @param message - Error description (defaults to French message).
 */
export function apiForbidden(
  message: string = 'Accès interdit',
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 403);
}

/**
 * Return a 404 Not Found response.
 *
 * @param message - Error description (defaults to French message).
 */
export function apiNotFound(
  message: string = 'Ressource introuvable',
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 404);
}

/**
 * Return a 429 Too Many Requests response.
 *
 * @param message - Error description (defaults to French message).
 */
export function apiRateLimited(
  message: string = 'Trop de requêtes. Veuillez réessayer plus tard.',
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 429);
}

/**
 * Return a 500 Internal Server Error response.
 *
 * @param message - Error description (defaults to French message).
 */
export function apiInternalError(
  message: string = 'Erreur interne du serveur',
): NextResponse<ApiEnvelope<never>> {
  return apiError(message, 500);
}
