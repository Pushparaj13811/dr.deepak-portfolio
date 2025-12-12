import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ServiceFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = (await request.json()) as ServiceFormData;

    const result = await sql`
      INSERT INTO services (title, description, icon)
      VALUES (${body.title}, ${body.description || null}, ${body.icon || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' } as ApiResponse,
      { status: 500 }
    );
  }
}
