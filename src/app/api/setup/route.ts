import { NextResponse } from 'next/server';
import { initDatabase, isDatabaseSeeded, sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Initialize database tables
    await initDatabase();

    // Check if already seeded
    const seeded = await isDatabaseSeeded();

    if (seeded) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized and seeded',
        seeded: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables created. POST to this endpoint with admin credentials to complete setup.',
      seeded: false,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Initialize database tables first
    await initDatabase();

    // Check if already seeded
    const seeded = await isDatabaseSeeded();

    if (seeded) {
      return NextResponse.json(
        { success: false, error: 'Database already has an admin user' },
        { status: 400 }
      );
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
    `;

    // Create default profile
    await sql`
      INSERT INTO profile (id, full_name, title, tagline, years_experience, surgeries_count)
      VALUES (1, 'Dr. Your Name', 'Specialist', 'Your tagline here', 0, 0)
      ON CONFLICT (id) DO NOTHING
    `;

    // Create default contact info
    await sql`
      INSERT INTO contact_info (id, email)
      VALUES (1, 'contact@example.com')
      ON CONFLICT (id) DO NOTHING
    `;

    return NextResponse.json({
      success: true,
      message: 'Database setup complete! You can now login to the admin panel.',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete setup' },
      { status: 500 }
    );
  }
}
