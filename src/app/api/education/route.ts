import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Education, ApiResponse } from '@/types';

export async function GET() {
  try {
    const education = await sql`
      SELECT * FROM education ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: education,
    } as ApiResponse<Education[]>);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education' } as ApiResponse,
      { status: 500 }
    );
  }
}
