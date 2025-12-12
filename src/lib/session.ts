import { sql } from './db';
import { cookies } from 'next/headers';
import { hash, compare } from 'bcryptjs';
import type { AdminUser, Session } from '@/types';

const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt})
  `;

  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = await sql`
    SELECT * FROM sessions
    WHERE id = ${sessionId} AND expires_at > NOW()
  `;

  return sessions.length > 0 ? (sessions[0] as Session) : null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function cleanupExpiredSessions(): Promise<void> {
  await sql`DELETE FROM sessions WHERE expires_at <= NOW()`;
}

export async function getUserFromSession(sessionId: string): Promise<AdminUser | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const users = await sql`
    SELECT id, username, created_at FROM admin_users WHERE id = ${session.user_id}
  `;

  return users.length > 0 ? (users[0] as AdminUser) : null;
}

export async function getSessionFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value || null;
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const sessionId = await getSessionFromCookies();
  if (!sessionId) return null;
  return getUserFromSession(sessionId);
}

// Password utilities using bcryptjs
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function getSessionCookieOptions() {
  const maxAge = SESSION_DURATION / 1000; // Convert to seconds
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  };
}
