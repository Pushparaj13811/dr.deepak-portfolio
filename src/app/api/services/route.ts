import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Service, ApiResponse } from '@/types';

export async function GET() {
  try {
    const services = await sql`
      SELECT * FROM services ORDER BY display_order ASC
    `;

    return NextResponse.json({
      success: true,
      data: services,
    } as ApiResponse<Service[]>);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' } as ApiResponse,
      { status: 500 }
    );
  }
}
