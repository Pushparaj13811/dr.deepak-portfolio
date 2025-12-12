import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { AwardFormData, ApiResponse } from '@/types';

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
    const body = (await request.json()) as Partial<AwardFormData>;

    await sql`
      UPDATE awards
      SET title = ${body.title}, issuer = ${body.issuer || null}, year = ${body.year || null}, description = ${body.description || null}, image_base64 = ${body.image_base64 || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Award updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update award error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update award' } as ApiResponse, { status: 500 });
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
    await sql`DELETE FROM awards WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Award deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete award error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete award' } as ApiResponse, { status: 500 });
  }
}
