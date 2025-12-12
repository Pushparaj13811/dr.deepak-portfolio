import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createSession, verifyPassword, getSessionCookieOptions } from '@/lib/session';
import type { LoginRequest, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;

    const users = await sql`
      SELECT * FROM admin_users WHERE username = ${body.username}
    `;
    const user = users[0] as { id: number; username: string; password_hash: string } | undefined;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse,
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(body.password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse,
        { status: 401 }
      );
    }

    const sessionId = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: { id: user.id, username: user.username },
    } as ApiResponse);

    response.cookies.set('session', sessionId, getSessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' } as ApiResponse,
      { status: 500 }
    );
  }
}
