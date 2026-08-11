import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 } as const;

/** Hash a password with a salted, memory-hard KDF. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS)) as Buffer;

  return [
    'scrypt',
    SCRYPT_OPTIONS.N,
    SCRYPT_OPTIONS.r,
    SCRYPT_OPTIONS.p,
    salt.toString('base64'),
    derivedKey.toString('base64'),
  ].join(':');
}

/** Verify a password against a stored password hash. */
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, n, r, p, saltBase64, keyBase64] = encodedHash.split(':');
  if (algorithm !== 'scrypt' || !n || !r || !p || !saltBase64 || !keyBase64) return false;

  const salt = Buffer.from(saltBase64, 'base64');
  const expectedKey = Buffer.from(keyBase64, 'base64');
  if (salt.length !== SALT_LENGTH || expectedKey.length !== KEY_LENGTH) return false;

  const derivedKey = (await scrypt(password, salt, expectedKey.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })) as Buffer;

  return timingSafeEqual(derivedKey, expectedKey);
}

export function validatePassword(password: string): string | null {
  if (password.length < 10) return 'Le mot de passe doit contenir au moins 10 caractères.';
  if (!/[a-z]/.test(password)) return 'Le mot de passe doit contenir une minuscule.';
  if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir une majuscule.';
  if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir un chiffre.';
  return null;
}
