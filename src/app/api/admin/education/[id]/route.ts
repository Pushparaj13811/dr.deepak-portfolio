import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { EducationFormData, ApiResponse } from '@/types';

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
    const body = (await request.json()) as Partial<EducationFormData>;

    await sql`
      UPDATE education
      SET degree = ${body.degree}, institution = ${body.institution}, year = ${body.year || null}, description = ${body.description || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Education updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update education error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update education' } as ApiResponse, { status: 500 });
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
    await sql`DELETE FROM education WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Education deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete education error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete education' } as ApiResponse, { status: 500 });
  }
}
