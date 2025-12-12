import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { SkillFormData, ApiResponse } from '@/types';

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
    const body = (await request.json()) as Partial<SkillFormData>;

    await sql`
      UPDATE skills
      SET name = ${body.name}, proficiency = ${body.proficiency}, category = ${body.category || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Skill updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update skill error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update skill' } as ApiResponse, { status: 500 });
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
    await sql`DELETE FROM skills WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete skill' } as ApiResponse, { status: 500 });
  }
}
