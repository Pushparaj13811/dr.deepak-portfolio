import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/session';
import type { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    // Get user's current password hash
    const users = await sql`
      SELECT * FROM admin_users WHERE id = ${user.id}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    const dbUser = users[0] as { password_hash: string };

    // Verify current password
    const isValidPassword = await verifyPassword(
      body.currentPassword,
      dbUser.password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' } as ApiResponse,
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(body.newPassword);

    // Update password
    await sql`
      UPDATE admin_users
      SET password_hash = ${newPasswordHash}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' } as ApiResponse,
      { status: 500 }
    );
  }
}
