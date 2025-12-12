import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { PortfolioFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as PortfolioFormData;

    const result = await sql`
      INSERT INTO portfolio_items (title, description, image_base64, category)
      VALUES (${body.title}, ${body.description || null}, ${body.image_base64}, ${body.category})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Portfolio item created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create portfolio item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create portfolio item' } as ApiResponse, { status: 500 });
  }
}
