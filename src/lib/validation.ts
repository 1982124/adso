/**
 * Zod validation schemas for all ADSO API endpoints.
 *
 * Every API route should use `parseBody()` to validate incoming requests
 * before processing. This ensures consistent error shapes and type safety.
 *
 * Uses Zod v4 API.
 */

import { z } from 'zod';

// ─── Shared fields ──────────────────────────────────────────────────────────

/** Email field shared across multiple schemas. */
const emailField = z
  .string({ error: "L'email est requis" })
  .email('Adresse email invalide');

// ─── Schemas ────────────────────────────────────────────────────────────────

/**
 * Validates user registration payload.
 * Requires email, name, password, and country code.
 */
export const createUserSchema = z.object({
  email: emailField,
  name: z
    .string({ error: 'Le nom est requis' })
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  password: z
    .string({ error: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères'),
  country: z
    .string({ error: 'Le pays est requis' })
    .min(2, 'Code pays invalide')
    .max(2, 'Code pays invalide'),
});

/**
 * Validates login payload.
 * Requires email and password.
 */
export const loginSchema = z.object({
  email: emailField,
  password: z.string({ error: 'Le mot de passe est requis' }),
});

/**
 * Validates a chat message payload.
 * Requires userId (as email string) and message body (1–1000 chars).
 */
export const chatMessageSchema = z.object({
  userId: emailField,
  message: z
    .string({ error: 'Le message est requis' })
    .min(1, 'Le message ne peut pas être vide')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
});

/**
 * Validates a quiz submission payload.
 * Requires userId (as email) and an array of answers with questionId and selectedOption.
 */
export const quizAnswerSchema = z.object({
  userId: emailField,
  answers: z
    .array(
      z.object({
        questionId: z.string({ error: 'questionId est requis' }),
        selectedOption: z
          .string({ error: 'selectedOption est requis' })
          .min(1, 'Une option doit être sélectionnée'),
      }),
    )
    .min(1, 'Au moins une réponse est requise'),
});

/**
 * Validates course enrollment payload.
 * Requires userId and courseId.
 */
export const courseEnrollSchema = z.object({
  userId: z.string({ error: 'userId est requis' }),
  courseId: z.string({ error: 'courseId est requis' }),
});

/**
 * Validates contact form payload.
 * Requires name, email, subject, and message.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Le nom est requis' })
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: emailField,
  subject: z
    .string({ error: 'Le sujet est requis' })
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: z
    .string({ error: 'Le message est requis' })
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
});

/**
 * Validates profile update payload.
 * All fields are optional; only provided fields will be updated.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  avatar: z.string().url("URL d'avatar invalide").optional(),
  country: z
    .string()
    .min(2, 'Code pays invalide')
    .max(2, 'Code pays invalide')
    .optional(),
  language: z
    .string()
    .min(2, 'Code langue invalide')
    .max(10, 'Code langue invalide')
    .optional(),
});

// ─── Helper ─────────────────────────────────────────────────────────────────

/**
 * Parse and validate an unknown request body against a Zod schema.
 *
 * @typeParam T - The inferred output type of the schema.
 * @param schema - A Zod schema to validate against.
 * @param body   - The raw (unknown) body from the request.
 * @returns A discriminated union: `{ success: true; data: T }` on success,
 *          or `{ success: false; errors: ZodError }` on failure.
 *
 * @example
 * ```ts
 * const result = parseBody(createUserSchema, await request.json());
 * if (!result.success) return apiBadRequest('Validation failed', result.errors);
 * // result.data is now typed as CreateUserInput
 * ```
 */
export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const parsed = schema.safeParse(body);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }
  return { success: false, errors: parsed.error };
}

// ─── Inferred types ─────────────────────────────────────────────────────────

/** Type inferred from {@link createUserSchema}. */
export type CreateUserInput = z.infer<typeof createUserSchema>;

/** Type inferred from {@link loginSchema}. */
export type LoginInput = z.infer<typeof loginSchema>;

/** Type inferred from {@link chatMessageSchema}. */
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/** Type inferred from {@link quizAnswerSchema}. */
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>;

/** Type inferred from {@link courseEnrollSchema}. */
export type CourseEnrollInput = z.infer<typeof courseEnrollSchema>;

/** Type inferred from {@link contactSchema}. */
export type ContactInput = z.infer<typeof contactSchema>;

/** Type inferred from {@link updateProfileSchema}. */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
