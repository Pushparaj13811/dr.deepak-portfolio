#!/usr/bin/env bun

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Load environment variables (Bun automatically loads .env)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('   Make sure you have a .env or .env.local file with DATABASE_URL set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initDatabase() {
  console.log('📦 Creating database tables...\n');

  // Admin Users
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Profile
  await sql`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      tagline TEXT NOT NULL,
      about_text_short TEXT,
      about_text TEXT,
      specialization TEXT,
      photo_base64 TEXT,
      years_experience INTEGER DEFAULT 0,
      surgeries_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Services
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(255),
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Education
  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id SERIAL PRIMARY KEY,
      degree VARCHAR(255) NOT NULL,
      institution VARCHAR(255) NOT NULL,
      year VARCHAR(50),
      description TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Experience
  await sql`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      position VARCHAR(255) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      start_date VARCHAR(50),
      end_date VARCHAR(50),
      description TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Skills
  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      proficiency INTEGER DEFAULT 50,
      category VARCHAR(100),
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Awards
  await sql`
    CREATE TABLE IF NOT EXISTS awards (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      issuer VARCHAR(255),
      year VARCHAR(50),
      description TEXT,
      image_base64 TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Portfolio Items
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_base64 TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Appointments
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Contact Info
  await sql`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      permanent_address TEXT,
      description TEXT,
      working_hours TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Social Links
  await sql`
    CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      url TEXT NOT NULL,
      icon VARCHAR(100),
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Blog Posts
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      image_base64 TEXT,
      published BOOLEAN DEFAULT FALSE,
      theme JSONB DEFAULT '{"mode":"light","primaryColor":"#3b82f6","fontFamily":"sans-serif","fontSize":"medium","layout":"standard","showCoverImage":true,"showReadingTime":true,"showAuthor":true,"showDate":true,"enableComments":false}'::jsonb,
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      tags TEXT[],
      category VARCHAR(100),
      author VARCHAR(255),
      reading_time INTEGER,
      inline_images JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Sessions
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    )
  `;

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_education_order ON education(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_awards_order ON awards(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio_items(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_social_order ON social_links(display_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;

  console.log('✅ Database tables created successfully!\n');
}

async function createAdminUser(username: string, password: string) {
  // Check if admin already exists
  const existing = await sql`SELECT id FROM admin_users WHERE username = ${username}`;

  if (existing.length > 0) {
    console.log(`⚠️  Admin user "${username}" already exists`);

    // Ask if they want to update the password
    const response = prompt('Do you want to update the password? (y/n): ');

    if (response?.toLowerCase() === 'y') {
      const passwordHash = await bcrypt.hash(password, 12);
      await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE username = ${username}`;
      console.log(`✅ Password updated for "${username}"`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${passwordHash})
  `;
  console.log(`✅ Admin user "${username}" created successfully!`);
}

async function createDefaultData() {
  // Check if profile exists
  const profileExists = await sql`SELECT id FROM profile WHERE id = 1`;

  if (profileExists.length === 0) {
    await sql`
      INSERT INTO profile (id, full_name, title, tagline, years_experience, surgeries_count)
      VALUES (1, 'Dr. Deepak Mehta', 'Medical Specialist', 'Providing quality healthcare services', 0, 0)
    `;
    console.log('✅ Default profile created');
  }

  // Check if contact info exists
  const contactExists = await sql`SELECT id FROM contact_info WHERE id = 1`;

  if (contactExists.length === 0) {
    await sql`
      INSERT INTO contact_info (id, email, phone)
      VALUES (1, 'contact@example.com', '+977-XXXXXXXXXX')
    `;
    console.log('✅ Default contact info created');
  }
}

async function main() {
  console.log('\n🚀 Database Setup Script\n');
  console.log('========================\n');

  // Get credentials from command line args or prompt
  let username = process.argv[2];
  let password = process.argv[3];

  if (!username) {
    username = prompt('Enter admin username (default: admin): ') || 'admin';
  }

  if (!password) {
    password = prompt('Enter admin password: ');
    if (!password) {
      console.error('❌ Password is required');
      process.exit(1);
    }
  }

  try {
    // Initialize database
    await initDatabase();

    // Create admin user
    await createAdminUser(username, password);

    // Create default data
    await createDefaultData();

    console.log('\n========================');
    console.log('✅ Setup complete!\n');
    console.log(`You can now login at: http://localhost:3000/admin/login`);
    console.log(`Username: ${username}`);
    console.log('Password: (the one you entered)\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
