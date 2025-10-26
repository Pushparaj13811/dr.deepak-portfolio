import sql from "./db";

async function promptInput(question: string): Promise<string> {
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function seedDatabase() {
  console.log("\n🌱 Database Seeding Setup\n");

  // Check if admin user already exists
  const existingAdmins = await sql`SELECT COUNT(*) as count FROM admin_users`;
  if (existingAdmins[0]?.count > 0) {
    console.log("⚠️  Admin user already exists. Skipping admin creation.");
  } else {
    console.log("📝 Create admin user:");
    const username = await promptInput("  Username: ");
    const password = await promptInput("  Password: ");

    if (!username || !password) {
      console.error("❌ Username and password are required!");
      process.exit(1);
    }

    // Hash password using Bun's password hashing
    const passwordHash = await Bun.password.hash(password);

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
    `;
    console.log(`  ✓ Admin user '${username}' created successfully\n`);
  }

  // Seed profile
  const profileExists = await sql`SELECT id FROM profile WHERE id = 1`;
  if (profileExists.length === 0) {
    await sql`
      INSERT INTO profile (id, full_name, title, tagline, about_text_short, about_text, specialization, photo_base64, years_experience, surgeries_count)
      VALUES (
        1,
        'Dr. Deepak Mehta',
        'MBBS, Cairo University Egypt',
        'Dreams of life remains till the heart beats',
        'Passionate about delivering exceptional patient care',
        'Dedicated medical professional with extensive experience in patient care and surgical excellence.',
        'MBBS (DGN) FCPS (DGN)',
        null,
        24,
        120
      )
    `;
    console.log("  ✓ Profile created (upload photo via admin panel)");
  }

  // Seed services
  const servicesExist = await sql`SELECT COUNT(*) as count FROM services`;
  if (servicesExist[0]?.count === 0) {
    const services = [
      {
        title: "Our Medicine Dept",
        description: "Comprehensive medical care with state-of-the-art facilities",
        icon: "medical",
        order: 1,
      },
      {
        title: "Center Treatment",
        description: "Specialized treatment programs tailored to patient needs",
        icon: "treatment",
        order: 2,
      },
      {
        title: "Modern Equipments",
        description: "Latest medical technology for accurate diagnosis and treatment",
        icon: "equipment",
        order: 3,
      },
    ];

    for (const service of services) {
      await sql`
        INSERT INTO services (title, description, icon, display_order)
        VALUES (${service.title}, ${service.description}, ${service.icon}, ${service.order})
      `;
    }
    console.log("  ✓ Services created");
  }

  // Seed education
  const educationExists = await sql`SELECT COUNT(*) as count FROM education`;
  if (educationExists[0]?.count === 0) {
    const education = [
      {
        degree: "MBBS (DGNB)",
        description: "Bachelor of Medicine, Bachelor of Surgery",
        institution: "University of Cairo, Egypt",
        year: "2001",
        order: 1,
      },
      {
        degree: "ECPS (Part II)",
        description: "European Certificate of Postgraduate Studies",
        institution: "University of Oxford",
        year: "2003",
        order: 2,
      },
      {
        degree: "Higher Education",
        description: "Advanced medical education and specialization",
        institution: "Medical Institute",
        year: "2005",
        order: 3,
      },
      {
        degree: "Secondary Education",
        description: "Foundation in medical sciences",
        institution: "Medical College",
        year: "1997",
        order: 4,
      },
    ];

    for (const edu of education) {
      await sql`
        INSERT INTO education (degree, description, institution, year, display_order)
        VALUES (${edu.degree}, ${edu.description}, ${edu.institution}, ${edu.year}, ${edu.order})
      `;
    }
    console.log("  ✓ Education created");
  }

  // Seed experience
  const experienceExists = await sql`SELECT COUNT(*) as count FROM experience`;
  if (experienceExists[0]?.count === 0) {
    const experience = [
      {
        position: "Senior Surgeon",
        organization: "Cairo Medical Center",
        start: "2010",
        end: "Present",
        description: "Leading surgical operations and mentoring junior doctors",
        order: 1,
      },
      {
        position: "Resident Doctor",
        organization: "University Hospital",
        start: "2005",
        end: "2010",
        description: "General medical practice and surgical assistance",
        order: 2,
      },
    ];

    for (const exp of experience) {
      await sql`
        INSERT INTO experience (position, organization, start_date, end_date, description, display_order)
        VALUES (${exp.position}, ${exp.organization}, ${exp.start}, ${exp.end}, ${exp.description}, ${exp.order})
      `;
    }
    console.log("  ✓ Experience created");
  }

  // Seed skills
  const skillsExist = await sql`SELECT COUNT(*) as count FROM skills`;
  if (skillsExist[0]?.count === 0) {
    const skills = [
      { name: "Surgery", proficiency: 95, category: "Medical", order: 1 },
      { name: "Patient Care", proficiency: 98, category: "Medical", order: 2 },
      { name: "Diagnosis", proficiency: 92, category: "Medical", order: 3 },
      { name: "Emergency Medicine", proficiency: 90, category: "Medical", order: 4 },
    ];

    for (const skill of skills) {
      await sql`
        INSERT INTO skills (name, proficiency, category, display_order)
        VALUES (${skill.name}, ${skill.proficiency}, ${skill.category}, ${skill.order})
      `;
    }
    console.log("  ✓ Skills created");
  }

  // Seed awards
  const awardsExist = await sql`SELECT COUNT(*) as count FROM awards`;
  if (awardsExist[0]?.count === 0) {
    const awards = [
      {
        title: "Excellence in Surgery Award",
        issuer: "Medical Association",
        year: "2020",
        description: "Recognized for outstanding surgical achievements",
        order: 1,
      },
      {
        title: "Best Doctor of the Year",
        issuer: "Healthcare Awards",
        year: "2018",
        description: "Awarded for exceptional patient care",
        order: 2,
      },
    ];

    for (const award of awards) {
      await sql`
        INSERT INTO awards (title, issuer, year, description, display_order)
        VALUES (${award.title}, ${award.issuer}, ${award.year}, ${award.description}, ${award.order})
      `;
    }
    console.log("  ✓ Awards created");
  }

  // Portfolio items - skipped in seeding as images are now base64
  // Users should upload portfolio items via the admin panel
  console.log("  ℹ Portfolio items skipped - add via admin panel with base64 images");

  // Seed contact info
  const contactExists = await sql`SELECT id FROM contact_info WHERE id = 1`;
  if (contactExists.length === 0) {
    await sql`
      INSERT INTO contact_info (id, email, phone, address, permanent_address, description, working_hours)
      VALUES (
        1,
        'contact@drdeepakmehta.com',
        '+20 123 456 7890',
        'Cairo Medical Center, 123 Medical Street, Cairo, Egypt',
        'Permanent: 456 Residential Road, Cairo, Egypt',
        'Dedicated to providing exceptional medical care with compassion and expertise. Available for consultations and appointments.',
        'Monday - Friday: 9:00 AM - 5:00 PM
Saturday: 9:00 AM - 1:00 PM'
      )
    `;
    console.log("  ✓ Contact info created");
  }

  // Seed social links
  const socialExists = await sql`SELECT COUNT(*) as count FROM social_links`;
  if (socialExists[0]?.count === 0) {
    const socialLinks = [
      { platform: "Facebook", url: "https://facebook.com", icon: "facebook", order: 1 },
      { platform: "Twitter", url: "https://twitter.com", icon: "twitter", order: 2 },
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", order: 3 },
      { platform: "Instagram", url: "https://instagram.com", icon: "instagram", order: 4 },
      { platform: "YouTube", url: "https://youtube.com", icon: "youtube", order: 5 },
    ];

    for (const link of socialLinks) {
      await sql`
        INSERT INTO social_links (platform, url, icon, display_order)
        VALUES (${link.platform}, ${link.url}, ${link.icon}, ${link.order})
      `;
    }
    console.log("  ✓ Social links created");
  }

  console.log("\n✅ Database seeding completed\n");
}
