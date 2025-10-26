import { sql } from "../../database/db";

interface RequestWithParams extends Request {
  params?: Record<string, string>;
}

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
    const result = await sql`SELECT * FROM profile WHERE id = 1`;
    const profile = result[0] || null;

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
    const services = await sql`
      SELECT * FROM services ORDER BY display_order ASC
    `;

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
    const education = await sql`
      SELECT * FROM education ORDER BY display_order ASC
    `;

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
    const experience = await sql`
      SELECT * FROM experience ORDER BY display_order ASC
    `;

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
    const skills = await sql`
      SELECT * FROM skills ORDER BY display_order ASC
    `;

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
    const awards = await sql`
      SELECT * FROM awards ORDER BY display_order ASC
    `;

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

    let portfolio: any[];

    if (category && category !== "All Work") {
      portfolio = await sql`
        SELECT * FROM portfolio_items
        WHERE category = ${category}
        ORDER BY display_order ASC
      `;
    } else {
      portfolio = await sql`
        SELECT * FROM portfolio_items ORDER BY display_order ASC
      `;
    }

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
    const result = await sql`SELECT * FROM contact_info WHERE id = 1`;
    const contact = result[0] || null;

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
    const links = await sql`
      SELECT * FROM social_links ORDER BY display_order ASC
    `;

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
    const posts = await sql`
      SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC
    `;

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
export async function getBlogPost(req: RequestWithParams): Promise<Response> {
  try {
    const slug = req.params?.slug;
    if (!slug) {
      return Response.json({
        success: false,
        error: "Slug is required",
      } as ApiResponse, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true
    `;
    const post = result[0] || null;

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
    const result = await sql`
      INSERT INTO appointments (full_name, email, phone, message, status)
      VALUES (${body.full_name}, ${body.email}, ${body.phone || null}, ${body.message || null}, 'pending')
      RETURNING id
    `;

    return Response.json({
      success: true,
      message: "Appointment request submitted successfully",
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to create appointment",
    } as ApiResponse, { status: 500 });
  }
}
