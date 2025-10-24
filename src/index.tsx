import { serve } from "bun";
import index from "./index.html";
import { initDatabase } from "./database/db";
import { seedDatabase } from "./database/seed";
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

import { requireAuth } from "./server/middleware/auth";

// Initialize database
initDatabase();

// Seed database with default data
await seedDatabase();

// Cleanup expired sessions every hour
setInterval(cleanupExpiredSessions, 1000 * 60 * 60);

const server = serve({
  routes: {
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

console.log(`✅ Database initialized and seeded`);
console.log(`🚀 Server running at ${server.url}`);
console.log(`📱 Public site: ${server.url}`);
console.log(`🔐 Admin panel: ${server.url}/admin`);
