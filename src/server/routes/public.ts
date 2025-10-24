import { db } from "../../database/db";
import type {
  Profile,
  Service,
  Education,
  Experience,
  Skill,
  Award,
  PortfolioItem,
  ContactInfo,
  SocialLink,
  BlogPost,
  AppointmentRequest,
  ApiResponse,
} from "../../types";

// GET /api/profile
export async function getProfile(req: Request): Promise<Response> {
  try {
    const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Profile | null;

    return Response.json({
      success: true,
      data: profile,
    } as ApiResponse<Profile>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch profile",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/services
export async function getServices(req: Request): Promise<Response> {
  try {
    const services = db.prepare(
      "SELECT * FROM services ORDER BY display_order ASC"
    ).all() as Service[];

    return Response.json({
      success: true,
      data: services,
    } as ApiResponse<Service[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch services",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/education
export async function getEducation(req: Request): Promise<Response> {
  try {
    const education = db.prepare(
      "SELECT * FROM education ORDER BY display_order ASC"
    ).all() as Education[];

    return Response.json({
      success: true,
      data: education,
    } as ApiResponse<Education[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch education",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/experience
export async function getExperience(req: Request): Promise<Response> {
  try {
    const experience = db.prepare(
      "SELECT * FROM experience ORDER BY display_order ASC"
    ).all() as Experience[];

    return Response.json({
      success: true,
      data: experience,
    } as ApiResponse<Experience[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch experience",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/skills
export async function getSkills(req: Request): Promise<Response> {
  try {
    const skills = db.prepare(
      "SELECT * FROM skills ORDER BY display_order ASC"
    ).all() as Skill[];

    return Response.json({
      success: true,
      data: skills,
    } as ApiResponse<Skill[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch skills",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/awards
export async function getAwards(req: Request): Promise<Response> {
  try {
    const awards = db.prepare(
      "SELECT * FROM awards ORDER BY display_order ASC"
    ).all() as Award[];

    return Response.json({
      success: true,
      data: awards,
    } as ApiResponse<Award[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch awards",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/portfolio
export async function getPortfolio(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    let query = "SELECT * FROM portfolio_items";
    const params: any[] = [];

    if (category && category !== "All Work") {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " ORDER BY display_order ASC";

    const portfolio = db.prepare(query).all(...params) as PortfolioItem[];

    return Response.json({
      success: true,
      data: portfolio,
    } as ApiResponse<PortfolioItem[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch portfolio",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/contact
export async function getContact(req: Request): Promise<Response> {
  try {
    const contact = db.prepare("SELECT * FROM contact_info WHERE id = 1").get() as ContactInfo | null;

    return Response.json({
      success: true,
      data: contact,
    } as ApiResponse<ContactInfo>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch contact info",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/social-links
export async function getSocialLinks(req: Request): Promise<Response> {
  try {
    const links = db.prepare(
      "SELECT * FROM social_links ORDER BY display_order ASC"
    ).all() as SocialLink[];

    return Response.json({
      success: true,
      data: links,
    } as ApiResponse<SocialLink[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch social links",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/blog
export async function getBlogPosts(req: Request): Promise<Response> {
  try {
    const posts = db.prepare(
      "SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC"
    ).all() as BlogPost[];

    return Response.json({
      success: true,
      data: posts,
    } as ApiResponse<BlogPost[]>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch blog posts",
    } as ApiResponse, { status: 500 });
  }
}

// GET /api/blog/:slug
export async function getBlogPost(req: Request): Promise<Response> {
  try {
    const slug = req.params?.slug;
    if (!slug) {
      return Response.json({
        success: false,
        error: "Slug is required",
      } as ApiResponse, { status: 400 });
    }

    const post = db.prepare(
      "SELECT * FROM blog_posts WHERE slug = ? AND published = 1"
    ).get(slug) as BlogPost | null;

    if (!post) {
      return Response.json({
        success: false,
        error: "Blog post not found",
      } as ApiResponse, { status: 404 });
    }

    return Response.json({
      success: true,
      data: post,
    } as ApiResponse<BlogPost>);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to fetch blog post",
    } as ApiResponse, { status: 500 });
  }
}

// POST /api/appointments
export async function createAppointment(req: Request): Promise<Response> {
  try {
    const body = await req.json() as AppointmentRequest;

    // Validate required fields
    if (!body.full_name || !body.email) {
      return Response.json({
        success: false,
        error: "Full name and email are required",
      } as ApiResponse, { status: 400 });
    }

    // Insert appointment
    const result = db.prepare(`
      INSERT INTO appointments (full_name, email, phone, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(body.full_name, body.email, body.phone || null, body.message || null);

    return Response.json({
      success: true,
      message: "Appointment request submitted successfully",
      data: { id: result.lastInsertRowid },
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to create appointment",
    } as ApiResponse, { status: 500 });
  }
}
