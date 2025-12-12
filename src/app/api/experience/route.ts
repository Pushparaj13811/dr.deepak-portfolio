import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Experience, ApiResponse } from '@/types';

export async function GET() {
  try {
    const experience = await sql`
      SELECT * FROM experience ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: experience,
    } as ApiResponse<Experience[]>);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' } as ApiResponse,
      { status: 500 }
    );
  }
}
