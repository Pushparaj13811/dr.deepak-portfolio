import { neon } from "@neondatabase/serverless";
import { seedBlogs } from "./seed-blogs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sql = neon(process.env.DATABASE_URL!);

// Initialize tables
export async function initDatabase() {
  try {
    // Create tables using individual SQL commands
    // Note: Neon requires using tagged templates, not passing raw SQL strings

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

    // Add specialization column if it doesn't exist
    try {
      await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS specialization TEXT`;
    } catch (error) {
      // Column might already exist, ignore error
    }

    // Migrate image columns to base64 format
    // Profile: add photo_base64 if it doesn't exist, then drop photo_url
    try {
      await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS photo_base64 TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE profile DROP COLUMN IF EXISTS photo_url`;
    } catch (error) {
      // Column might not exist
    }

    // Portfolio: add image_base64 if it doesn't exist, then drop image_url
    try {
      await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS image_base64 TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE portfolio_items DROP COLUMN IF EXISTS image_url`;
    } catch (error) {
      // Column might not exist
    }

    // Blog: add image_base64 if it doesn't exist, then drop image_url
    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_base64 TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts DROP COLUMN IF EXISTS image_url`;
    } catch (error) {
      // Column might not exist
    }

    // Add new blog customization fields
    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"mode":"light","primaryColor":"#3b82f6","fontFamily":"sans-serif","fontSize":"medium","layout":"standard","showCoverImage":true,"showReadingTime":true,"showAuthor":true,"showDate":true,"enableComments":false}'::jsonb`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255)`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[]`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category VARCHAR(100)`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(255)`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS inline_images JSONB DEFAULT '[]'::jsonb`;
    } catch (error) {
      // Column might already exist
    }

    // Add new columns to existing tables
    try {
      await sql`ALTER TABLE awards ADD COLUMN IF NOT EXISTS image_base64 TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS permanent_address TEXT`;
    } catch (error) {
      // Column might already exist
    }

    try {
      await sql`ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS description TEXT`;
    } catch (error) {
      // Column might already exist
    }

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

    // Seed blog posts if none exist
    const blogCount = await sql`SELECT COUNT(*) as count FROM blog_posts`;
    const count = typeof blogCount[0]?.count === 'string' ? 
      parseInt(blogCount[0].count, 10) : 
      Number(blogCount[0]?.count || 0);
    
    if (count === 0) {
      console.log("📝 Seeding blog posts...");
      await seedBlogs();
      console.log("✅ Blog posts seeded");
    }

    console.log("✅ Database initialized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Check if database is seeded (has admin user)
export async function isDatabaseSeeded(): Promise<boolean> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM admin_users`;
    if (!result || result.length === 0) return false;

    const rawCount = (result[0] as any)?.count ?? 0;
    const count =
      typeof rawCount === "string" ? parseInt(rawCount, 10) : Number(rawCount);

    if (Number.isNaN(count)) return false;
    return count > 0;
  } catch (error) {
    return false;
  }
}

// Drop all tables (CASCADE to handle foreign keys)
export async function dropAllTables(): Promise<void> {
  try {
    console.log("🗑️  Dropping all tables...");

    await sql`DROP TABLE IF EXISTS sessions CASCADE`;
    await sql`DROP TABLE IF EXISTS blog_posts CASCADE`;
    await sql`DROP TABLE IF EXISTS social_links CASCADE`;
    await sql`DROP TABLE IF EXISTS contact_info CASCADE`;
    await sql`DROP TABLE IF EXISTS appointments CASCADE`;
    await sql`DROP TABLE IF EXISTS portfolio_items CASCADE`;
    await sql`DROP TABLE IF EXISTS awards CASCADE`;
    await sql`DROP TABLE IF EXISTS skills CASCADE`;
    await sql`DROP TABLE IF EXISTS experience CASCADE`;
    await sql`DROP TABLE IF EXISTS education CASCADE`;
    await sql`DROP TABLE IF EXISTS services CASCADE`;
    await sql`DROP TABLE IF EXISTS profile CASCADE`;
    await sql`DROP TABLE IF EXISTS admin_users CASCADE`;

    console.log("✅ All tables dropped successfully");
  } catch (error) {
    console.error("Failed to drop tables:", error);
    throw error;
  }
}

export default sql;
