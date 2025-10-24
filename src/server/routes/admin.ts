import { db } from "../../database/db";
import { createSession, deleteSession, getSessionFromRequest, setSessionCookie, clearSessionCookie, verifyPassword } from "../auth/session";
import type { LoginRequest, ApiResponse, ProfileFormData, ServiceFormData, EducationFormData, ExperienceFormData, SkillFormData, AwardFormData, PortfolioFormData, ContactFormData, SocialLinkFormData, BlogPostFormData } from "../../types";

// POST /api/admin/login
export async function login(req: Request): Promise<Response> {
  try {
    const body = await req.json() as LoginRequest;

    const user = db.prepare(
      "SELECT * FROM admin_users WHERE username = ?"
    ).get(body.username) as any;

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

    const sessionId = createSession(user.id);

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
    deleteSession(sessionId);
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

    const updates: string[] = [];
    const params: any[] = [];

    if (body.full_name !== undefined) {
      updates.push("full_name = ?");
      params.push(body.full_name);
    }
    if (body.title !== undefined) {
      updates.push("title = ?");
      params.push(body.title);
    }
    if (body.tagline !== undefined) {
      updates.push("tagline = ?");
      params.push(body.tagline);
    }
    if (body.about_text !== undefined) {
      updates.push("about_text = ?");
      params.push(body.about_text);
    }
    if (body.photo_url !== undefined) {
      updates.push("photo_url = ?");
      params.push(body.photo_url);
    }
    if (body.years_experience !== undefined) {
      updates.push("years_experience = ?");
      params.push(body.years_experience);
    }
    if (body.surgeries_count !== undefined) {
      updates.push("surgeries_count = ?");
      params.push(body.surgeries_count);
    }

    updates.push("updated_at = datetime('now')");
    params.push(1); // WHERE id = 1

    db.prepare(`UPDATE profile SET ${updates.join(", ")} WHERE id = ?`).run(...params);

    return Response.json({
      success: true,
      message: "Profile updated successfully",
    } as ApiResponse);
  } catch (error) {
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

    const result = db.prepare(`
      INSERT INTO services (title, description, icon) VALUES (?, ?, ?)
    `).run(body.title, body.description || null, body.icon || null);

    return Response.json({
      success: true,
      message: "Service created successfully",
      data: { id: result.lastInsertRowid },
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

    db.prepare(`
      UPDATE services
      SET title = ?, description = ?, icon = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(body.title, body.description || null, body.icon || null, id);

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
    db.prepare("DELETE FROM services WHERE id = ?").run(id);

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

    const result = db.prepare(`
      INSERT INTO education (degree, institution, year, description)
      VALUES (?, ?, ?, ?)
    `).run(body.degree, body.institution, body.year || null, body.description || null);

    return Response.json({
      success: true,
      message: "Education created successfully",
      data: { id: result.lastInsertRowid },
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

    db.prepare(`
      UPDATE education
      SET degree = ?, institution = ?, year = ?, description = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(body.degree, body.institution, body.year || null, body.description || null, id);

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
    db.prepare("DELETE FROM education WHERE id = ?").run(id);

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

    const result = db.prepare(`
      INSERT INTO experience (position, organization, start_date, end_date, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(body.position, body.organization, body.start_date || null, body.end_date || null, body.description || null);

    return Response.json({
      success: true,
      message: "Experience created successfully",
      data: { id: result.lastInsertRowid },
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

    db.prepare(`
      UPDATE experience
      SET position = ?, organization = ?, start_date = ?, end_date = ?, description = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(body.position, body.organization, body.start_date || null, body.end_date || null, body.description || null, id);

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
    db.prepare("DELETE FROM experience WHERE id = ?").run(id);

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
    const result = db.prepare(`
      INSERT INTO skills (name, proficiency, category) VALUES (?, ?, ?)
    `).run(body.name, body.proficiency, body.category || null);

    return Response.json({ success: true, message: "Skill created", data: { id: result.lastInsertRowid } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create skill" } as ApiResponse, { status: 500 });
  }
}

export async function updateSkill(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<SkillFormData>;
    db.prepare(`UPDATE skills SET name = ?, proficiency = ?, category = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(body.name, body.proficiency, body.category || null, id);
    return Response.json({ success: true, message: "Skill updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update skill" } as ApiResponse, { status: 500 });
  }
}

export async function deleteSkill(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    db.prepare("DELETE FROM skills WHERE id = ?").run(id);
    return Response.json({ success: true, message: "Skill deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete skill" } as ApiResponse, { status: 500 });
  }
}

// Awards, Portfolio, Contact, Social Links, Blog - Similar CRUD patterns
export async function createAward(req: Request): Promise<Response> {
  try {
    const body = await req.json() as AwardFormData;
    const result = db.prepare(`INSERT INTO awards (title, issuer, year, description) VALUES (?, ?, ?, ?)`)
      .run(body.title, body.issuer || null, body.year || null, body.description || null);
    return Response.json({ success: true, message: "Award created", data: { id: result.lastInsertRowid } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create award" } as ApiResponse, { status: 500 });
  }
}

export async function updateAward(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<AwardFormData>;
    db.prepare(`UPDATE awards SET title = ?, issuer = ?, year = ?, description = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(body.title, body.issuer || null, body.year || null, body.description || null, id);
    return Response.json({ success: true, message: "Award updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update award" } as ApiResponse, { status: 500 });
  }
}

export async function deleteAward(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    db.prepare("DELETE FROM awards WHERE id = ?").run(id);
    return Response.json({ success: true, message: "Award deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete award" } as ApiResponse, { status: 500 });
  }
}

export async function createPortfolioItem(req: Request): Promise<Response> {
  try {
    const body = await req.json() as PortfolioFormData;
    const result = db.prepare(`INSERT INTO portfolio_items (title, description, image_url, category) VALUES (?, ?, ?, ?)`)
      .run(body.title, body.description || null, body.image_url, body.category);
    return Response.json({ success: true, message: "Portfolio item created", data: { id: result.lastInsertRowid } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function updatePortfolioItem(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<PortfolioFormData>;
    db.prepare(`UPDATE portfolio_items SET title = ?, description = ?, image_url = ?, category = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(body.title, body.description || null, body.image_url, body.category, id);
    return Response.json({ success: true, message: "Portfolio item updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function deletePortfolioItem(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    db.prepare("DELETE FROM portfolio_items WHERE id = ?").run(id);
    return Response.json({ success: true, message: "Portfolio item deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete portfolio item" } as ApiResponse, { status: 500 });
  }
}

export async function updateContact(req: Request): Promise<Response> {
  try {
    const body = await req.json() as Partial<ContactFormData>;
    db.prepare(`UPDATE contact_info SET email = ?, phone = ?, address = ?, working_hours = ?, updated_at = datetime('now') WHERE id = 1`)
      .run(body.email, body.phone || null, body.address || null, body.working_hours || null);
    return Response.json({ success: true, message: "Contact info updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update contact info" } as ApiResponse, { status: 500 });
  }
}

export async function createSocialLink(req: Request): Promise<Response> {
  try {
    const body = await req.json() as SocialLinkFormData;
    const result = db.prepare(`INSERT INTO social_links (platform, url, icon) VALUES (?, ?, ?)`)
      .run(body.platform, body.url, body.icon || null);
    return Response.json({ success: true, message: "Social link created", data: { id: result.lastInsertRowid } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create social link" } as ApiResponse, { status: 500 });
  }
}

export async function updateSocialLink(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<SocialLinkFormData>;
    db.prepare(`UPDATE social_links SET platform = ?, url = ?, icon = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(body.platform, body.url, body.icon || null, id);
    return Response.json({ success: true, message: "Social link updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update social link" } as ApiResponse, { status: 500 });
  }
}

export async function deleteSocialLink(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    db.prepare("DELETE FROM social_links WHERE id = ?").run(id);
    return Response.json({ success: true, message: "Social link deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete social link" } as ApiResponse, { status: 500 });
  }
}

// Blog CRUD
export async function createBlogPost(req: Request): Promise<Response> {
  try {
    const body = await req.json() as BlogPostFormData;
    const result = db.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, image_url, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(body.title, body.slug, body.excerpt || null, body.content, body.image_url || null, body.published ? 1 : 0);
    return Response.json({ success: true, message: "Blog post created", data: { id: result.lastInsertRowid } } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create blog post" } as ApiResponse, { status: 500 });
  }
}

export async function updateBlogPost(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as Partial<BlogPostFormData>;
    db.prepare(`
      UPDATE blog_posts
      SET title = ?, slug = ?, excerpt = ?, content = ?, image_url = ?, published = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(body.title, body.slug, body.excerpt || null, body.content, body.image_url || null, body.published ? 1 : 0, id);
    return Response.json({ success: true, message: "Blog post updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update blog post" } as ApiResponse, { status: 500 });
  }
}

export async function deleteBlogPost(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
    return Response.json({ success: true, message: "Blog post deleted" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete blog post" } as ApiResponse, { status: 500 });
  }
}

// Get all appointments (admin only)
export async function getAppointments(req: Request): Promise<Response> {
  try {
    const appointments = db.prepare("SELECT * FROM appointments ORDER BY created_at DESC").all();
    return Response.json({ success: true, data: appointments } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch appointments" } as ApiResponse, { status: 500 });
  }
}

export async function updateAppointmentStatus(req: Request): Promise<Response> {
  try {
    const id = req.params?.id;
    const body = await req.json() as { status: string };
    db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(body.status, id);
    return Response.json({ success: true, message: "Appointment status updated" } as ApiResponse);
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update appointment" } as ApiResponse, { status: 500 });
  }
}
