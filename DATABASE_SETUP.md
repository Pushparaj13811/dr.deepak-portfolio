# Database Setup Guide

This project uses **PostgreSQL** via **Neon** serverless database.

## Prerequisites

- Neon database account (https://neon.tech)
- Database connection string

## Setup Instructions

### 1. Configure Database Connection

Create a `.env` file in the project root:

```bash
DATABASE_URL='your-neon-database-connection-string'
```

**Example:**
```
DATABASE_URL='postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require'
```

### 2. Initialize Database

Run the setup command to create tables and seed initial data:

```bash
bun run setup
```

This will:
- Create all necessary database tables
- Prompt you to create an admin user (username and password)
- Seed sample data (profile, services, education, etc.)

**Important:** The setup will ask you to enter:
- Admin username
- Admin password

**Security Note:** Choose a strong password for the admin account!

### 3. Start the Application

```bash
bun run dev
```

The database will be automatically initialized if tables don't exist.

## Database Schema

The database includes the following tables:
- `admin_users` - Admin authentication
- `profile` - Doctor profile information
- `services` - Medical services
- `education` - Education history
- `experience` - Work experience
- `skills` - Professional skills
- `awards` - Awards and achievements
- `portfolio_items` - Portfolio gallery
- `appointments` - Patient appointment requests
- `contact_info` - Contact information
- `social_links` - Social media links
- `blog_posts` - Blog articles
- `sessions` - User sessions for authentication

## Re-seeding

The setup script will NOT re-seed if data already exists. To re-seed:

1. Drop all tables in your Neon database
2. Run `bun run setup` again

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

**Error: DATABASE_URL environment variable is required**
- Make sure `.env` file exists with valid DATABASE_URL

**Error: Connection failed**
- Check your Neon database connection string
- Ensure your IP is allowed in Neon settings
- Verify the connection string includes `?sslmode=require`

**Tables already exist**
- The setup script will skip table creation if they already exist
- Admin user creation is skipped if an admin already exists
