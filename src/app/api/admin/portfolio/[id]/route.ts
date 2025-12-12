import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { PortfolioFormData, ApiResponse } from '@/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<PortfolioFormData>;

    await sql`
      UPDATE portfolio_items
      SET title = ${body.title}, description = ${body.description || null}, image_base64 = ${body.image_base64}, category = ${body.category}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Portfolio item updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update portfolio item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update portfolio item' } as ApiResponse, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Portfolio item deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio item' } as ApiResponse, { status: 500 });
  }
}
