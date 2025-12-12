import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Profile, ApiResponse } from '@/types';

export async function GET() {
  try {
    const result = await sql`SELECT * FROM profile WHERE id = 1`;
    const profile = result[0] || null;

    return NextResponse.json({
      success: true,
      data: profile,
    } as ApiResponse<Profile>);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' } as ApiResponse,
      { status: 500 }
    );
  }
}
