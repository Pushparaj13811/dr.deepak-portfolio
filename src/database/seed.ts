import { db, transaction } from "./db";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  transaction(() => {
    // Seed admin user (username: admin, password: admin123 - CHANGE THIS IN PRODUCTION!)
    const adminExists = db.prepare("SELECT id FROM admin_users WHERE username = ?").get("admin");
    if (!adminExists) {
      // Using Bun's password hashing
      const passwordHash = Bun.password.hashSync("admin123");
      db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run("admin", passwordHash);
      console.log("  ✓ Admin user created (username: admin, password: admin123)");
    }

    // Seed profile
    const profileExists = db.prepare("SELECT id FROM profile WHERE id = 1").get();
    if (!profileExists) {
      db.prepare(`
        INSERT INTO profile (id, full_name, title, tagline, about_text, years_experience, surgeries_count)
        VALUES (1, ?, ?, ?, ?, ?, ?)
      `).run(
        "Dr. Deepak Mehta",
        "MBBS, Cairo University Egypt",
        "Dreams of life remains till the heart beats",
        "Dedicated medical professional with extensive experience in patient care and surgical excellence.",
        24,
        120
      );
      console.log("  ✓ Profile created");
    }

    // Seed services
    const servicesExist = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
    if (servicesExist.count === 0) {
      const services = [
        { title: "Our Medicine Dept", description: "Comprehensive medical care with state-of-the-art facilities", icon: "medical", order: 1 },
        { title: "Center Treatment", description: "Specialized treatment programs tailored to patient needs", icon: "treatment", order: 2 },
        { title: "Modern Equipments", description: "Latest medical technology for accurate diagnosis and treatment", icon: "equipment", order: 3 },
      ];

      const stmt = db.prepare("INSERT INTO services (title, description, icon, display_order) VALUES (?, ?, ?, ?)");
      for (const service of services) {
        stmt.run(service.title, service.description, service.icon, service.order);
      }
      console.log("  ✓ Services created");
    }

    // Seed education
    const educationExists = db.prepare("SELECT COUNT(*) as count FROM education").get() as { count: number };
    if (educationExists.count === 0) {
      const education = [
        { degree: "MBBS (DGNB)", description: "Bachelor of Medicine, Bachelor of Surgery", institution: "University of Cairo, Egypt", year: "2001", order: 1 },
        { degree: "ECPS (Part II)", description: "European Certificate of Postgraduate Studies", institution: "University of Oxford", year: "2003", order: 2 },
        { degree: "Higher Education", description: "Advanced medical education and specialization", institution: "Medical Institute", year: "2005", order: 3 },
        { degree: "Secondary Education", description: "Foundation in medical sciences", institution: "Medical College", year: "1997", order: 4 },
      ];

      const stmt = db.prepare("INSERT INTO education (degree, description, institution, year, display_order) VALUES (?, ?, ?, ?, ?)");
      for (const edu of education) {
        stmt.run(edu.degree, edu.description, edu.institution, edu.year, edu.order);
      }
      console.log("  ✓ Education created");
    }

    // Seed experience
    const experienceExists = db.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number };
    if (experienceExists.count === 0) {
      const experience = [
        { position: "Senior Surgeon", organization: "Cairo Medical Center", start: "2010", end: "Present", description: "Leading surgical operations and mentoring junior doctors", order: 1 },
        { position: "Resident Doctor", organization: "University Hospital", start: "2005", end: "2010", description: "General medical practice and surgical assistance", order: 2 },
      ];

      const stmt = db.prepare("INSERT INTO experience (position, organization, start_date, end_date, description, display_order) VALUES (?, ?, ?, ?, ?, ?)");
      for (const exp of experience) {
        stmt.run(exp.position, exp.organization, exp.start, exp.end, exp.description, exp.order);
      }
      console.log("  ✓ Experience created");
    }

    // Seed skills
    const skillsExist = db.prepare("SELECT COUNT(*) as count FROM skills").get() as { count: number };
    if (skillsExist.count === 0) {
      const skills = [
        { name: "Surgery", proficiency: 95, category: "Medical", order: 1 },
        { name: "Patient Care", proficiency: 98, category: "Medical", order: 2 },
        { name: "Diagnosis", proficiency: 92, category: "Medical", order: 3 },
        { name: "Emergency Medicine", proficiency: 90, category: "Medical", order: 4 },
      ];

      const stmt = db.prepare("INSERT INTO skills (name, proficiency, category, display_order) VALUES (?, ?, ?, ?)");
      for (const skill of skills) {
        stmt.run(skill.name, skill.proficiency, skill.category, skill.order);
      }
      console.log("  ✓ Skills created");
    }

    // Seed awards
    const awardsExist = db.prepare("SELECT COUNT(*) as count FROM awards").get() as { count: number };
    if (awardsExist.count === 0) {
      const awards = [
        { title: "Excellence in Surgery Award", issuer: "Medical Association", year: "2020", description: "Recognized for outstanding surgical achievements", order: 1 },
        { title: "Best Doctor of the Year", issuer: "Healthcare Awards", year: "2018", description: "Awarded for exceptional patient care", order: 2 },
      ];

      const stmt = db.prepare("INSERT INTO awards (title, issuer, year, description, display_order) VALUES (?, ?, ?, ?, ?)");
      for (const award of awards) {
        stmt.run(award.title, award.issuer, award.year, award.description, award.order);
      }
      console.log("  ✓ Awards created");
    }

    // Seed portfolio items
    const portfolioExists = db.prepare("SELECT COUNT(*) as count FROM portfolio_items").get() as { count: number };
    if (portfolioExists.count === 0) {
      const portfolioItems = [
        { title: "Medical Equipment", description: "State-of-the-art medical equipment", image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=800&fit=crop", category: "Surgery", order: 1 },
        { title: "Patient Care", description: "Compassionate patient care services", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=600&fit=crop", category: "Dentist", order: 2 },
        { title: "Modern Facility", description: "Modern medical facility", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=900&fit=crop", category: "Surgery", order: 3 },
        { title: "Surgical Suite", description: "Advanced surgical suite", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=700&fit=crop", category: "Surgery", order: 4 },
        { title: "Medical Consultation", description: "Professional medical consultation", image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=800&fit=crop", category: "Implant", order: 5 },
        { title: "Laboratory", description: "Advanced medical laboratory", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=600&fit=crop", category: "Kidssentist", order: 6 },
        { title: "Dental Care", description: "Comprehensive dental care", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=900&fit=crop", category: "Dentist", order: 7 },
        { title: "Medical Team", description: "Experienced medical team", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop", category: "Surgery", order: 8 },
        { title: "Patient Recovery", description: "Comfortable recovery rooms", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=800&fit=crop", category: "Implant", order: 9 },
      ];

      const stmt = db.prepare("INSERT INTO portfolio_items (title, description, image_url, category, display_order) VALUES (?, ?, ?, ?, ?)");
      for (const item of portfolioItems) {
        stmt.run(item.title, item.description, item.image, item.category, item.order);
      }
      console.log("  ✓ Portfolio items created");
    }

    // Seed contact info
    const contactExists = db.prepare("SELECT id FROM contact_info WHERE id = 1").get();
    if (!contactExists) {
      db.prepare(`
        INSERT INTO contact_info (id, email, phone, address, working_hours)
        VALUES (1, ?, ?, ?, ?)
      `).run(
        "contact@drdeepakmehta.com",
        "+20 123 456 7890",
        "Cairo Medical Center, 123 Medical Street, Cairo, Egypt",
        "Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 9:00 AM - 1:00 PM"
      );
      console.log("  ✓ Contact info created");
    }

    // Seed social links
    const socialExists = db.prepare("SELECT COUNT(*) as count FROM social_links").get() as { count: number };
    if (socialExists.count === 0) {
      const socialLinks = [
        { platform: "Facebook", url: "https://facebook.com", icon: "facebook", order: 1 },
        { platform: "Twitter", url: "https://twitter.com", icon: "twitter", order: 2 },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", order: 3 },
        { platform: "Instagram", url: "https://instagram.com", icon: "instagram", order: 4 },
        { platform: "YouTube", url: "https://youtube.com", icon: "youtube", order: 5 },
      ];

      const stmt = db.prepare("INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)");
      for (const link of socialLinks) {
        stmt.run(link.platform, link.url, link.icon, link.order);
      }
      console.log("  ✓ Social links created");
    }
  });

  console.log("✅ Database seeding completed");
}
