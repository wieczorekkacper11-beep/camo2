import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/index.js';
import { users } from '@/lib/db/schema.js';
import { eq } from 'drizzle-orm';

const COOKIE_NAME = 'camo_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'camo-sklep-secret-key-busko-zdroj-2026';

/**
 * Haszowanie hasła za pomocą pbkdf2
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Weryfikacja hasła
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
}

/**
 * Podpisanie tokenu sesji
 */
function signToken(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

/**
 * Weryfikacja tokenu sesji
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    // Sprawdź ważność (np. 7 dni)
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Zapewnia istnienie konta administratora
 */
export async function ensureAdminUser() {
  try {
    const existing = await db.select().from(users).limit(1);
    if (existing.length === 0) {
      const defaultHash = hashPassword('admin123');
      await db.insert(users).values({
        username: 'admin',
        passwordHash: defaultHash,
      });
      console.log('✓ Utworzono domyślne konto administratora (admin / admin123)');
    }
  } catch (err) {
    console.error('Błąd tworzenia konta admina:', err);
  }
}

/**
 * Pobiera bieżącą sesję administratora
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Logowanie administratora
 */
export async function loginAdmin(username, password) {
  await ensureAdminUser();

  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.username, username.trim()))
    .limit(1);

  if (userRows.length === 0) {
    return { success: false, error: 'Nieprawidłowy login lub hasło.' };
  }

  const user = userRows[0];
  const isValid = verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Nieprawidłowy login lub hasło.' };
  }

  // Token ważny przez 7 dni
  const sessionData = {
    userId: user.id,
    username: user.username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const token = signToken(sessionData);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true, username: user.username };
}

/**
 * Wylogowanie administratora
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}
