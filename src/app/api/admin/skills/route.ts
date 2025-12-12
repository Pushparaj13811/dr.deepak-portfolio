import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { SkillFormData, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as SkillFormData;

    const result = await sql`
      INSERT INTO skills (name, proficiency, category)
      VALUES (${body.name}, ${body.proficiency}, ${body.category || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Skill created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create skill' } as ApiResponse, { status: 500 });
  }
}
