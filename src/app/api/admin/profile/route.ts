import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ProfileFormData, ApiResponse } from '@/types';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = (await request.json()) as Partial<ProfileFormData>;

    await sql`
      UPDATE profile
      SET
        full_name = ${body.full_name ?? null},
        title = ${body.title ?? null},
        tagline = ${body.tagline ?? null},
        about_text_short = ${body.about_text_short ?? null},
        about_text = ${body.about_text ?? null},
        specialization = ${body.specialization ?? null},
        photo_base64 = ${body.photo_base64 ?? null},
        years_experience = ${body.years_experience ?? 0},
        surgeries_count = ${body.surgeries_count ?? 0},
        updated_at = NOW()
      WHERE id = 1
    `;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' } as ApiResponse,
      { status: 500 }
    );
  }
}
