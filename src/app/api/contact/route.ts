import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { ContactInfo, ApiResponse } from '@/types';

export async function GET() {
  try {
    const result = await sql`SELECT * FROM contact_info WHERE id = 1`;
    const contact = result[0] || null;

    return NextResponse.json({
      success: true,
      data: contact,
    } as ApiResponse<ContactInfo>);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' } as ApiResponse,
      { status: 500 }
    );
  }
}
