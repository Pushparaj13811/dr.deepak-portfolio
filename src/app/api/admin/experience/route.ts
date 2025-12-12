import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ExperienceFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as ExperienceFormData;

    const result = await sql`
      INSERT INTO experience (position, organization, start_date, end_date, description)
      VALUES (${body.position}, ${body.organization}, ${body.start_date || null}, ${body.end_date || null}, ${body.description || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Experience created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create experience' } as ApiResponse, { status: 500 });
  }
}
