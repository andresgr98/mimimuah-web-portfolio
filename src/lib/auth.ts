import type { AstroCookies } from 'astro';

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'admin123';
const SESSION_COOKIE = 'admin_session';

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createSession(cookies: AstroCookies) {
  cookies.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  return cookies.get(SESSION_COOKIE)?.value === 'authenticated';
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
