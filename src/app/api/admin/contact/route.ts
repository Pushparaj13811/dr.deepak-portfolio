import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ContactFormData, ApiResponse } from '@/types';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as Partial<ContactFormData>;

    await sql`
      UPDATE contact_info
      SET email = ${body.email}, phone = ${body.phone || null}, address = ${body.address || null}, permanent_address = ${body.permanent_address || null}, description = ${body.description || null}, working_hours = ${body.working_hours || null}, updated_at = NOW()
      WHERE id = 1
    `;

    return NextResponse.json({ success: true, message: 'Contact info updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update contact info error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update contact info' } as ApiResponse, { status: 500 });
  }
}
