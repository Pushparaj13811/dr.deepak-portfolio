import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { AwardFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as AwardFormData;

    const result = await sql`
      INSERT INTO awards (title, issuer, year, description, image_base64)
      VALUES (${body.title}, ${body.issuer || null}, ${body.year || null}, ${body.description || null}, ${body.image_base64 || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Award created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create award error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create award' } as ApiResponse, { status: 500 });
  }
}
