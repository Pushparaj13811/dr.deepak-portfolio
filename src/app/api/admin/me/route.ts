import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' } as ApiResponse,
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: user.id, username: user.username },
    } as ApiResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get current user' } as ApiResponse,
      { status: 500 }
    );
  }
}
