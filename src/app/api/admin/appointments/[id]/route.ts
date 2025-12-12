import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ApiResponse } from '@/types';

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
    const body = (await request.json()) as { status: string };

    await sql`UPDATE appointments SET status = ${body.status} WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Appointment status updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update appointment' } as ApiResponse, { status: 500 });
  }
}
