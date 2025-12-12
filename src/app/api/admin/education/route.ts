import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { EducationFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as EducationFormData;

    const result = await sql`
      INSERT INTO education (degree, institution, year, description)
      VALUES (${body.degree}, ${body.institution}, ${body.year || null}, ${body.description || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Education created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create education error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create education' } as ApiResponse, { status: 500 });
  }
}
