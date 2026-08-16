import { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const PASSWORD_ENV = "ADSO_VAULT_PASSWORD_HASH";
const SESSION_ENV = "ADSO_VAULT_SESSION_SECRET";
const ITERATIONS = 210_000;
const KEYLEN = 32;
const DIGEST = "sha256";
const MAX_AGE_SECONDS = 15 * 60;

export function isVaultConfigured() {
  return Boolean(process.env[PASSWORD_ENV] && process.env[SESSION_ENV]);
}

function derive(password: string, salt: Buffer, iterations: number) {
  const first = createHash("sha256").update(Buffer.from(password, "utf8")).update(salt).digest();
  return pbkdf2Sync(first, salt, iterations, KEYLEN, DIGEST);
}

export function verifyVaultPassword(password: string) {
  const stored = process.env[PASSWORD_ENV];
  if (!stored || !password) return false;
  const [version, iterationsRaw, salt, expected] = stored.split("$");
  if (version !== "pbkdf2" || !iterationsRaw || !salt || !expected) return false;
  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) return false;
  const actual = derive(password, Buffer.from(salt, "hex"), iterations);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export function createVaultPasswordHash(password: string) {
  if (!password || password.length < 12) throw new Error("Le mot de passe du coffre-fort doit contenir au moins 12 caractères.");
  const salt = randomBytes(16);
  const derived = derive(password, salt, ITERATIONS).toString("hex");
  return `pbkdf2$${ITERATIONS}$${salt.toString("hex")}$${derived}`;
}

export function createVaultSession() {
  const secret = process.env[SESSION_ENV];
  if (!secret) throw new Error("ADSO_VAULT_SESSION_SECRET manquant.");
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const nonce = randomBytes(24).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyVaultSession(token: string | undefined) {
  const secret = process.env[SESSION_ENV];
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresRaw, nonce, signature] = parts;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || !nonce || !signature || expiresAt < Math.floor(Date.now() / 1000)) return false;
  const payload = `${expiresAt}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export const VAULT_COOKIE = "adso_vault_session";
export const VAULT_MAX_AGE = MAX_AGE_SECONDS;
