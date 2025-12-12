import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { AppointmentRequest, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentRequest;

    // Validate required fields
    if (!body.full_name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Full name and email are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Insert appointment
    const result = await sql`
      INSERT INTO appointments (full_name, email, phone, message, status)
      VALUES (${body.full_name}, ${body.email}, ${body.phone || null}, ${body.message || null}, 'pending')
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Appointment request submitted successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' } as ApiResponse,
      { status: 500 }
    );
  }
}
