import sql from "../../database/db";
import { createSession, deleteSession, getSessionFromRequest, setSessionCookie, clearSessionCookie, verifyPassword, hashPassword } from "../auth/session";
import type { LoginRequest, ApiResponse, ProfileFormData, ServiceFormData, EducationFormData, ExperienceFormData, SkillFormData, AwardFormData, PortfolioFormData, ContactFormData, SocialLinkFormData, BlogPostFormData } from "../../types";

// POST /api/admin/login
export async function login(req: Request): Promise<Response> {
  try {
    const body = await req.json() as LoginRequest;

    const users = await sql`
      SELECT * FROM admin_users WHERE username = ${body.username}
    `;
    const user = users[0] as any;

    if (!user) {
      return Response.json({
        success: false,
        error: "Invalid credentials",
      } as ApiResponse, { status: 401 });
    }

    const isValid = await verifyPassword(body.password, user.password_hash);

    if (!isValid) {
      return Response.json({
        success: false,
        error: "Invalid credentials",
      } as ApiResponse, { status: 401 });
    }

    const sessionId = await createSession(user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Logged in successfully",
        user: { id: user.id, username: user.username },
      } as ApiResponse),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setSessionCookie(sessionId),
        },
      }
    );
  } catch (error) {
    return Response.json({
      success: false,
      error: "Login failed",
    } as ApiResponse, { status: 500 });
  }
}

// POST /api/admin/logout
export async function logout(req: Request): Promise<Response> {
  const sessionId = getSessionFromRequest(req);
  if (sessionId) {
    await deleteSession(sessionId);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Logged out successfully",
    } as ApiResponse),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearSessionCookie(),
      },
    }
  );
}

// GET /api/admin/me
export async function getCurrentUser(req: Request): Promise<Response> {
  const user = (req as any).user;
  return Response.json({
    success: true,
    data: { id: user.id, username: user.username },
  } as ApiResponse);
}

// Profile CRUD
export async function updateProfile(req: Request): Promise<Response> {
  try {
    const body = await req.json() as Partial<ProfileFormData>;

    await sql`
      UPDATE profile
      SET
        full_name = ${body.full_name ?? null},
        title = ${body.title ?? null},
        tagline = ${body.tagline ?? null},
        about_text_short = ${body.about_text_short ?? null},
        about_text = ${body.about_text ?? null},
        specialization = ${body.specialization ?? null},
        photo_base64 = ${body.photo_base64 ?? null},
        years_experience = ${body.years_experience ?? 0},
        surgeries_count = ${body.surgeries_count ?? 0},
        updated_at = NOW()
      WHERE id = 1
    `;

    return Response.json({
      success: true,
      message: "Profile updated successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({
      success: false,
      error: "Failed to update profile",
    } as ApiResponse, { status: 500 });
  }
}

// Services CRUD
export async function createService(req: Request): Promise<Response> {
  try {
    const body = await req.json() as ServiceFormData;

    const result = await sql`
      INSERT INTO services (title, description, icon)
      VALUES (${body.title}, ${body.description || null}, ${body.icon || null})
      RETURNING id
    `;

    return Response.json({
      success: true,
      message: "Service created successfully",
      data: { id: result[0].id },
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to create service",
    } as ApiResponse, { status: 500 });
  }
}

export async function updateService(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<ServiceFormData>;

    await sql`
      UPDATE services
      SET title = ${body.title}, description = ${body.description || null}, icon = ${body.icon || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Service updated successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to update service",
    } as ApiResponse, { status: 500 });
  }
}

export async function deleteService(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM services WHERE id = ${id}`;

    return Response.json({
      success: true,
      message: "Service deleted successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to delete service",
    } as ApiResponse, { status: 500 });
  }
}

// Education CRUD
export async function createEducation(req: Request): Promise<Response> {
  try {
    const body = await req.json() as EducationFormData;

    const result = await sql`
      INSERT INTO education (degree, institution, year, description)
      VALUES (${body.degree}, ${body.institution}, ${body.year || null}, ${body.description || null})
      RETURNING id
    `;

    return Response.json({
      success: true,
      message: "Education created successfully",
      data: { id: result[0].id },
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to create education",
    } as ApiResponse, { status: 500 });
  }
}

export async function updateEducation(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<EducationFormData>;

    await sql`
      UPDATE education
      SET degree = ${body.degree}, institution = ${body.institution}, year = ${body.year || null}, description = ${body.description || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Education updated successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to update education",
    } as ApiResponse, { status: 500 });
  }
}

export async function deleteEducation(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM education WHERE id = ${id}`;

    return Response.json({
      success: true,
      message: "Education deleted successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to delete education",
    } as ApiResponse, { status: 500 });
  }
}

// Experience CRUD
export async function createExperience(req: Request): Promise<Response> {
  try {
    const body = await req.json() as ExperienceFormData;

    const result = await sql`
      INSERT INTO experience (position, organization, start_date, end_date, description)
      VALUES (${body.position}, ${body.organization}, ${body.start_date || null}, ${body.end_date || null}, ${body.description || null})
      RETURNING id
    `;

    return Response.json({
      success: true,
      message: "Experience created successfully",
      data: { id: result[0].id },
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to create experience",
    } as ApiResponse, { status: 500 });
  }
}

export async function updateExperience(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<ExperienceFormData>;

    await sql`
      UPDATE experience
      SET position = ${body.position}, organization = ${body.organization}, start_date = ${body.start_date || null}, end_date = ${body.end_date || null}, description = ${body.description || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Experience updated successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to update experience",
    } as ApiResponse, { status: 500 });
  }
}

export async function deleteExperience(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM experience WHERE id = ${id}`;

    return Response.json({
      success: true,
      message: "Experience deleted successfully",
    } as ApiResponse);
  } catch (error) {
    return Response.json({
      success: false,
      error: "Failed to delete experience",
    } as ApiResponse, { status: 500 });
  }
}

// Skills CRUD (similar pattern)
export async function createSkill(req: Request): Promise<Response> {
  try {
    const body = await req.json() as SkillFormData;
    const result = await sql`
      INSERT INTO skills (name, proficiency, category)
      VALUES (${body.name}, ${body.proficiency}, ${body.category || null})
      RETURNING id
    `;

    return Response.json({ success: true, message: "Skill created", data: { id: result[0].id } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create skill" } as ApiResponse, { status: 500 });
  }
}

export async function updateSkill(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<SkillFormData>;
    await sql`
      UPDATE skills
      SET name = ${body.name}, proficiency = ${body.proficiency}, category = ${body.category || null}, updated_at = NOW()
      WHERE id = ${id}
    `;
    return Response.json({ success: true, message: "Skill updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update skill" } as ApiResponse, { status: 500 });
  }
}

export async function deleteSkill(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM skills WHERE id = ${id}`;
    return Response.json({ success: true, message: "Skill deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete skill" } as ApiResponse, { status: 500 });
  }
}

// Awards, Portfolio, Contact, Social Links, Blog - Similar CRUD patterns
export async function createAward(req: Request): Promise<Response> {
  try {
    const body = await req.json() as AwardFormData;
    const result = await sql`
      INSERT INTO awards (title, issuer, year, description, image_base64)
      VALUES (${body.title}, ${body.issuer || null}, ${body.year || null}, ${body.description || null}, ${body.image_base64 || null})
      RETURNING id
    `;
    return Response.json({ success: true, message: "Award created", data: { id: result[0].id } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create award" } as ApiResponse, { status: 500 });
  }
}

export async function updateAward(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<AwardFormData>;
    await sql`
      UPDATE awards
      SET title = ${body.title}, issuer = ${body.issuer || null}, year = ${body.year || null}, description = ${body.description || null}, image_base64 = ${body.image_base64 || null}, updated_at = NOW()
      WHERE id = ${id}
    `;
    return Response.json({ success: true, message: "Award updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update award" } as ApiResponse, { status: 500 });
  }
}

export async function deleteAward(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM awards WHERE id = ${id}`;
    return Response.json({ success: true, message: "Award deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete award" } as ApiResponse, { status: 500 });
  }
}

export async function createPortfolioItem(req: Request): Promise<Response> {
  try {
    const body = await req.json() as PortfolioFormData;
    const result = await sql`
      INSERT INTO portfolio_items (title, description, image_base64, category)
      VALUES (${body.title}, ${body.description || null}, ${body.image_base64}, ${body.category})
      RETURNING id
    `;
    return Response.json({ success: true, message: "Portfolio item created", data: { id: result[0].id } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function updatePortfolioItem(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<PortfolioFormData>;
    await sql`
      UPDATE portfolio_items
      SET title = ${body.title}, description = ${body.description || null}, image_base64 = ${body.image_base64}, category = ${body.category}, updated_at = NOW()
      WHERE id = ${id}
    `;
    return Response.json({ success: true, message: "Portfolio item updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function deletePortfolioItem(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    return Response.json({ success: true, message: "Portfolio item deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function updateContact(req: Request): Promise<Response> {
  try {
    const body = await req.json() as Partial<ContactFormData>;
    await sql`
      UPDATE contact_info
      SET email = ${body.email}, phone = ${body.phone || null}, address = ${body.address || null}, permanent_address = ${body.permanent_address || null}, description = ${body.description || null}, working_hours = ${body.working_hours || null}, updated_at = NOW()
      WHERE id = 1
    `;
    return Response.json({ success: true, message: "Contact info updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update contact info" } as ApiResponse, { status: 500 });
  }
}

export async function createSocialLink(req: Request): Promise<Response> {
  try {
    const body = await req.json() as SocialLinkFormData;
    const result = await sql`
      INSERT INTO social_links (platform, url, icon)
      VALUES (${body.platform}, ${body.url}, ${body.icon || null})
      RETURNING id
    `;
    return Response.json({ success: true, message: "Social link created", data: { id: result[0].id } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create social link" } as ApiResponse, { status: 500 });
  }
}

export async function updateSocialLink(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<SocialLinkFormData>;
    await sql`
      UPDATE social_links
      SET platform = ${body.platform}, url = ${body.url}, icon = ${body.icon || null}, updated_at = NOW()
      WHERE id = ${id}
    `;
    return Response.json({ success: true, message: "Social link updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update social link" } as ApiResponse, { status: 500 });
  }
}

export async function deleteSocialLink(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM social_links WHERE id = ${id}`;
    return Response.json({ success: true, message: "Social link deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete social link" } as ApiResponse, { status: 500 });
  }
}

// Blog CRUD
export async function createBlogPost(req: Request): Promise<Response> {
  try {
    const body = await req.json() as BlogPostFormData;
    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, image_base64, published)
      VALUES (${body.title}, ${body.slug}, ${body.excerpt || null}, ${body.content}, ${body.image_base64 || null}, ${body.published})
      RETURNING id
    `;
    return Response.json({ success: true, message: "Blog post created", data: { id: result[0].id } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create blog post" } as ApiResponse, { status: 500 });
  }
}

export async function updateBlogPost(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<BlogPostFormData>;
    await sql`
      UPDATE blog_posts
      SET title = ${body.title}, slug = ${body.slug}, excerpt = ${body.excerpt || null}, content = ${body.content}, image_base64 = ${body.image_base64 || null}, published = ${body.published}, updated_at = NOW()
      WHERE id = ${id}
    `;
    return Response.json({ success: true, message: "Blog post updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update blog post" } as ApiResponse, { status: 500 });
  }
}

export async function deleteBlogPost(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
    return Response.json({ success: true, message: "Blog post deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete blog post" } as ApiResponse, { status: 500 });
  }
}

// Get all appointments (admin only)
export async function getAppointments(req: Request): Promise<Response> {
  try {
    const appointments = await sql`SELECT * FROM appointments ORDER BY created_at DESC`;
    return Response.json({ success: true, data: appointments } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch appointments" } as ApiResponse, { status: 500 });
  }
}

export async function updateAppointmentStatus(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as { status: string };
    await sql`UPDATE appointments SET status = ${body.status} WHERE id = ${id}`;
    return Response.json({ success: true, message: "Appointment status updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update appointment" } as ApiResponse, { status: 500 });
  }
}

// POST /api/admin/change-password
export async function changePassword(req: Request): Promise<Response> {
  try {
    const sessionId = getSessionFromRequest(req);
    if (!sessionId) {
      return Response.json({
        success: false,
        error: "Unauthorized",
      } as ApiResponse, { status: 401 });
    }

    const body = await req.json() as { currentPassword: string; newPassword: string };

    // Get current user from session
    const session = await sql`
      SELECT * FROM sessions WHERE id = ${sessionId} AND expires_at > NOW()
    `;

    if (session.length === 0) {
      return Response.json({
        success: false,
        error: "Session expired",
      } as ApiResponse, { status: 401 });
    }

    const userId = (session[0] as any).user_id;

    // Get user's current password hash
    const users = await sql`
      SELECT * FROM admin_users WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return Response.json({
        success: false,
        error: "User not found",
      } as ApiResponse, { status: 404 });
    }

    const user = users[0] as any;

    // Verify current password
    const isValidPassword = await verifyPassword(body.currentPassword, user.password_hash);

    if (!isValidPassword) {
      return Response.json({
        success: false,
        error: "Current password is incorrect",
      } as ApiResponse, { status: 401 });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(body.newPassword);

    // Update password
    await sql`
      UPDATE admin_users
      SET password_hash = ${newPasswordHash}
      WHERE id = ${userId}
    `;

    return Response.json({
      success: true,
      message: "Password changed successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Change password error:", error);
    return Response.json({
      success: false,
      error: "Failed to change password",
    } as ApiResponse, { status: 500 });
  }
}
