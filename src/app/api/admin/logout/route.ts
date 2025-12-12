import { NextResponse } from 'next/server';
import { deleteSession, getSessionFromCookies } from '@/lib/session';
import type { ApiResponse } from '@/types';

export async function POST() {
  try {
    const sessionId = await getSessionFromCookies();

    if (sessionId) {
      await deleteSession(sessionId);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    } as ApiResponse);

    response.cookies.set('session', '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' } as ApiResponse,
      { status: 500 }
    );
  }
}
