import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 } as const;

/** Hash a password using Node's built-in scrypt KDF. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS)) as Buffer;
  return `scrypt:${SCRYPT_OPTIONS.N}:${SCRYPT_OPTIONS.r}:${SCRYPT_OPTIONS.p}:${salt.toString('base64')}:${derivedKey.toString('base64')}`;
}

/** Verify a password against a scrypt password hash. */
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, n, r, p, saltBase64, keyBase64] = encodedHash.split(':');
  if (algorithm !== 'scrypt' || !n || !r || !p || !saltBase64 || !keyBase64) return false;

  const salt = Buffer.from(saltBase64, 'base64');
  const expectedKey = Buffer.from(keyBase64, 'base64');
  const derivedKey = (await scrypt(password, salt, expectedKey.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })) as Buffer;

  return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey);
}
