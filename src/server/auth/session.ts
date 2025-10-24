import sql from "../../database/db";
import type { AdminUser, Session } from "../../types";

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

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export async function getUserFromSession(sessionId: string): Promise<AdminUser | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const users = await sql`
    SELECT id, username, created_at FROM admin_users WHERE id = ${session.user_id}
  `;

  return users.length > 0 ? (users[0] as AdminUser) : null;
}

export function getSessionFromRequest(req: Request): string | null {
  const cookies = req.headers.get("Cookie");
  if (!cookies) return null;

  const sessionCookie = cookies
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="));

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
