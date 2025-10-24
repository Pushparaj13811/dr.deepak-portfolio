import { serve } from "bun";
import index from "./index.html";
import { initDatabase, isDatabaseSeeded } from "./database/db";
import { cleanupExpiredSessions } from "./server/auth/session";

// Public API routes
import {
  getProfile,
  getServices,
  getEducation,
  getExperience,
  getSkills,
  getAwards,
  getPortfolio,
  getContact,
  getSocialLinks,
  getBlogPosts,
  getBlogPost,
  createAppointment,
} from "./server/routes/public";

// Admin API routes
import {
  login,
  logout,
  getCurrentUser,
  updateProfile,
  createService,
  updateService,
  deleteService,
  createEducation,
  updateEducation,
  deleteEducation,
  createExperience,
  updateExperience,
  deleteExperience,
  createSkill,
  updateSkill,
  deleteSkill,
  createAward,
  updateAward,
  deleteAward,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updateContact,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAppointments,
  updateAppointmentStatus,
} from "./server/routes/admin";

// Upload routes
import { uploadImage, deleteImage } from "./server/routes/upload";

import { requireAuth } from "./server/middleware/auth";

// Initialize database (create tables if they don't exist)
await initDatabase();

// Check if database is seeded
const isSeeded = await isDatabaseSeeded();
if (!isSeeded) {
  console.log("\n⚠️  WARNING: Database is not seeded!");
  console.log("   Run 'bun run setup' to initialize the database with admin user and sample data.\n");
}

// Cleanup expired sessions every hour
setInterval(cleanupExpiredSessions, 1000 * 60 * 60);

// Handler for serving uploaded images
async function serveUploadedFile(req: Request & { params?: { filename?: string } }): Promise<Response> {
  const filename = req.params?.filename || req.url.split('/uploads/')[1];
  if (!filename) {
    return new Response("File not found", { status: 404 });
  }

  const filepath = `./uploads/${filename}`;
  const file = Bun.file(filepath);
  const exists = await file.exists();

  if (exists) {
    return new Response(file);
  }
  return new Response("File not found", { status: 404 });
}

const server = serve({
  routes: {
    // Serve uploaded images - MUST be before catch-all route
    "/uploads/:filename": { GET: serveUploadedFile },

    // Upload routes
    "/api/upload": { POST: requireAuth(uploadImage) },
    "/api/upload/:filename": { DELETE: requireAuth(deleteImage) },

    // Public API routes
    "/api/profile": { GET: getProfile },
    "/api/services": { GET: getServices },
    "/api/education": { GET: getEducation },
    "/api/experience": { GET: getExperience },
    "/api/skills": { GET: getSkills },
    "/api/awards": { GET: getAwards },
    "/api/portfolio": { GET: getPortfolio },
    "/api/contact": { GET: getContact },
    "/api/social-links": { GET: getSocialLinks },
    "/api/blog": { GET: getBlogPosts },
    "/api/blog/:slug": { GET: getBlogPost },
    "/api/appointments": { POST: createAppointment },

    // Admin Auth routes
    "/api/admin/login": { POST: login },
    "/api/admin/logout": { POST: logout },
    "/api/admin/me": { GET: requireAuth(getCurrentUser) },

    // Admin Profile routes
    "/api/admin/profile": { PUT: requireAuth(updateProfile) },

    // Admin Services routes
    "/api/admin/services": { POST: requireAuth(createService) },
    "/api/admin/services/:id": {
      PUT: requireAuth(updateService),
      DELETE: requireAuth(deleteService),
    },

    // Admin Education routes
    "/api/admin/education": { POST: requireAuth(createEducation) },
    "/api/admin/education/:id": {
      PUT: requireAuth(updateEducation),
      DELETE: requireAuth(deleteEducation),
    },

    // Admin Experience routes
    "/api/admin/experience": { POST: requireAuth(createExperience) },
    "/api/admin/experience/:id": {
      PUT: requireAuth(updateExperience),
      DELETE: requireAuth(deleteExperience),
    },

    // Admin Skills routes
    "/api/admin/skills": { POST: requireAuth(createSkill) },
    "/api/admin/skills/:id": {
      PUT: requireAuth(updateSkill),
      DELETE: requireAuth(deleteSkill),
    },

    // Admin Awards routes
    "/api/admin/awards": { POST: requireAuth(createAward) },
    "/api/admin/awards/:id": {
      PUT: requireAuth(updateAward),
      DELETE: requireAuth(deleteAward),
    },

    // Admin Portfolio routes
    "/api/admin/portfolio": { POST: requireAuth(createPortfolioItem) },
    "/api/admin/portfolio/:id": {
      PUT: requireAuth(updatePortfolioItem),
      DELETE: requireAuth(deletePortfolioItem),
    },

    // Admin Contact routes
    "/api/admin/contact": { PUT: requireAuth(updateContact) },

    // Admin Social Links routes
    "/api/admin/social-links": { POST: requireAuth(createSocialLink) },
    "/api/admin/social-links/:id": {
      PUT: requireAuth(updateSocialLink),
      DELETE: requireAuth(deleteSocialLink),
    },

    // Admin Blog routes
    "/api/admin/blog": { POST: requireAuth(createBlogPost) },
    "/api/admin/blog/:id": {
      PUT: requireAuth(updateBlogPost),
      DELETE: requireAuth(deleteBlogPost),
    },

    // Admin Appointments routes
    "/api/admin/appointments": { GET: requireAuth(getAppointments) },
    "/api/admin/appointments/:id": { PUT: requireAuth(updateAppointmentStatus) },

    // Serve index.html for all unmatched routes (SPA routing)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`✅ Database initialized`);
console.log(`🚀 Server running at ${server.url}`);
console.log(`📱 Public site: ${server.url}`);
console.log(`🔐 Admin panel: ${server.url}/admin`);
