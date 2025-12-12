import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Skill, ApiResponse } from '@/types';

export async function GET() {
  try {
    const skills = await sql`
      SELECT * FROM skills ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: skills,
    } as ApiResponse<Skill[]>);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' } as ApiResponse,
      { status: 500 }
    );
  }
}
