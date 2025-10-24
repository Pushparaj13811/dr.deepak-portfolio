# Dr. Deepak Mehta - Medical Portfolio Website

A modern, fully-featured portfolio website built with Bun, React 19, and PostgreSQL. This project includes a public-facing portfolio and a complete admin dashboard for content management with image upload capabilities.

## Features

### Public Website
- **Hero Section**: Dynamic profile with doctor's photo, tagline, and experience stats
- **Services**: Showcase medical services with icons and descriptions
- **Resume**: Tabbed interface displaying Education, Experience, Skills, and Awards
- **Portfolio**: Filterable image gallery with categories
- **Appointment Booking**: Form for patients to request appointments
- **Contact**: Contact information and location details
- **Blog**: Display published blog posts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database-driven**: All content loaded from PostgreSQL database

### Admin Dashboard
- **Secure Authentication**: Session-based login system with hashed passwords
- **Profile Management**: Edit doctor information with image upload
- **Image Upload**: Upload and manage images (profile photos, portfolio items)
  - Drag-and-drop file upload
  - Automatic image preview
  - Server-side storage in `/uploads` directory
  - 5MB file size limit
  - Support for JPG, PNG, GIF, WebP formats
- **Content Management**: Full CRUD operations for all sections
  - Services, Education, Experience, Skills, Awards
  - Portfolio items with image uploads
  - Blog posts, Social links, Contact information
- **Appointment Management**: View and manage appointment requests
- **No Hardcoded Values**: All content is editable through the admin panel

## Tech Stack

- **Runtime**: Bun
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (via Neon serverless)
- **Server**: Bun.serve() with built-in routing and static file serving
- **Authentication**: Session-based with HTTP-only cookies
- **File Storage**: Server-side image uploads

## Getting Started

### Prerequisites

- Bun runtime installed
- Neon PostgreSQL database (https://neon.tech)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Configure database:
```bash
# Create .env file with your Neon database URL
DATABASE_URL='postgresql://user:password@host.neon.tech/dbname?sslmode=require'
```

3. Initialize and seed the database:
```bash
bun run setup
```

This will:
- Create all database tables
- Prompt you to create an admin username and password
- Seed initial sample data

4. Start the development server:
```bash
bun run dev
```

The application will be available at:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin

### Default Admin Access

After running `bun run setup`, login with the credentials you created during the setup process.

**Security Note**: Make sure to use a strong password for your admin account!

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials after first login!

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Build for production

## Project Structure

All content is managed through the admin dashboard - no need to modify code!

```
src/
├── components/         # React components
│   ├── public/        # Public website pages
│   ├── admin/         # Admin dashboard
│   └── shared/        # Reusable UI components
├── database/          # SQLite database & schema
├── server/            # API routes & authentication
└── types/             # TypeScript definitions
```

## Customization Guide

### 1. Update Doctor Information
- Go to `/admin` and login
- Click "Manage Profile" to update name, title, photo, etc.

### 2. Add/Edit Services
- Use "Manage Services" in admin panel
- Add service title, description, and icon

### 3. Update Resume
- Manage Education, Experience, Skills, and Awards sections
- All displayed in a beautiful tabbed interface

### 4. Portfolio Gallery
- Upload images via "Manage Portfolio"
- Assign categories for filtering

### 5. Blog Posts
- Create and publish blog posts
- Manage content without touching code

## Database

The SQLite database is automatically initialized with sample data on first run. All data can be modified through the admin panel.

- Development: `./portfolio.db`
- Production: `./data/portfolio.db`

## Security Notes

1. Change default admin password immediately
2. Use HTTPS in production
3. Sessions are HTTP-only with SameSite=Strict
4. Add additional validation as needed

## Built With

Built with ❤️ using [Bun](https://bun.com), React, and Tailwind CSS
