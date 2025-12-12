import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { SocialLinkFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as SocialLinkFormData;

    const result = await sql`
      INSERT INTO social_links (platform, url, icon)
      VALUES (${body.platform}, ${body.url}, ${body.icon || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Social link created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create social link error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create social link' } as ApiResponse, { status: 500 });
  }
}
