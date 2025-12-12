import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ExperienceFormData, ApiResponse } from '@/types';

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
    const body = (await request.json()) as Partial<ExperienceFormData>;

    await sql`
      UPDATE experience
      SET position = ${body.position}, organization = ${body.organization}, start_date = ${body.start_date || null}, end_date = ${body.end_date || null}, description = ${body.description || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Experience updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update experience' } as ApiResponse, { status: 500 });
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
    await sql`DELETE FROM experience WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Experience deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete experience' } as ApiResponse, { status: 500 });
  }
}
