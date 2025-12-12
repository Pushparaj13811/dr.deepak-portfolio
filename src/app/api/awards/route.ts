import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Award, ApiResponse } from '@/types';

export async function GET() {
  try {
    const awards = await sql`
      SELECT * FROM awards ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: awards,
    } as ApiResponse<Award[]>);
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch awards' } as ApiResponse,
      { status: 500 }
    );
  }
}
