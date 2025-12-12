import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { SocialLink, ApiResponse } from '@/types';

export async function GET() {
  try {
    const links = await sql`
      SELECT * FROM social_links ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: links,
    } as ApiResponse<SocialLink[]>);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social links' } as ApiResponse,
      { status: 500 }
    );
  }
}
