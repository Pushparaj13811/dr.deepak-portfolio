import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ServiceFormData, ApiResponse } from '@/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<ServiceFormData>;

    await sql`
      UPDATE services
      SET title = ${body.title}, description = ${body.description || null}, icon = ${body.icon || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { id } = await params;

    await sql`DELETE FROM services WHERE id = ${id}`;

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' } as ApiResponse,
      { status: 500 }
    );
  }
}
