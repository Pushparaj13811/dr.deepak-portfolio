import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const appointments = await sql`SELECT * FROM appointments ORDER BY created_at DESC`;

    return NextResponse.json({ success: true, data: appointments } as ApiResponse);
  } catch (error) {
    console.error('Fetch appointments error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch appointments' } as ApiResponse, { status: 500 });
  }
}
