import { db } from "../../database/db";
import type { AdminUser, Session } from "../../types";

const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function createSession(userId: number): string {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(sessionId, userId, expiresAt);

  return sessionId;
}

export function getSession(sessionId: string): Session | null {
  const session = db.prepare(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')"
  ).get(sessionId) as Session | null;

  return session;
}

export function deleteSession(sessionId: string): void {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

export function cleanupExpiredSessions(): void {
  db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export function getUserFromSession(sessionId: string): AdminUser | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const user = db.prepare(
    "SELECT id, username, created_at FROM admin_users WHERE id = ?"
  ).get(session.user_id) as AdminUser | null;

  return user;
}

export function getSessionFromRequest(req: Request): string | null {
  const cookies = req.headers.get("Cookie");
  if (!cookies) return null;

  const sessionCookie = cookies
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith("session="));

  if (!sessionCookie) return null;

  return sessionCookie.split("=")[1] || null;
}

export function setSessionCookie(sessionId: string): string {
  const maxAge = SESSION_DURATION / 1000; // Convert to seconds
  return `session=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return "session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0";
}
