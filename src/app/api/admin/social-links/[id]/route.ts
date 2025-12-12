import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { SocialLinkFormData, ApiResponse } from '@/types';

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
    const body = (await request.json()) as Partial<SocialLinkFormData>;

    await sql`
      UPDATE social_links
      SET platform = ${body.platform}, url = ${body.url}, icon = ${body.icon || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Social link updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update social link error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update social link' } as ApiResponse, { status: 500 });
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
    await sql`DELETE FROM social_links WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Social link deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete social link error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete social link' } as ApiResponse, { status: 500 });
  }
}
