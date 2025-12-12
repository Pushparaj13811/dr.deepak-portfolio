import { sql } from '@/lib/db';
import {
  Navigation,
  Hero,
  Services,
  DoctorProfile,
  Portfolio,
  StatsSection,
  Resume,
  Appointment,
  Footer,
} from '@/components/public';
import type {
  Profile,
  Service,
  Education,
  Experience,
  Skill,
  Award,
  PortfolioItem,
  SocialLink,
  ContactInfo,
} from '@/types';

async function getHomeData() {
  try {
    const [
      profileResult,
      servicesResult,
      educationResult,
      experienceResult,
      skillsResult,
      awardsResult,
      portfolioResult,
      socialLinksResult,
      contactResult,
    ] = await Promise.all([
      sql`SELECT * FROM profile LIMIT 1`,
      sql`SELECT * FROM services ORDER BY display_order ASC`,
      sql`SELECT * FROM education ORDER BY display_order ASC`,
      sql`SELECT * FROM experience ORDER BY display_order ASC`,
      sql`SELECT * FROM skills ORDER BY display_order ASC`,
      sql`SELECT * FROM awards ORDER BY display_order ASC`,
      sql`SELECT * FROM portfolio_items ORDER BY display_order ASC`,
      sql`SELECT * FROM social_links ORDER BY display_order ASC`,
      sql`SELECT * FROM contact_info LIMIT 1`,
    ]);

    return {
      profile: (profileResult[0] as Profile) || null,
      services: servicesResult as Service[],
      education: educationResult as Education[],
      experience: experienceResult as Experience[],
      skills: skillsResult as Skill[],
      awards: awardsResult as Award[],
      portfolio: portfolioResult as PortfolioItem[],
      socialLinks: socialLinksResult as SocialLink[],
      contactInfo: (contactResult[0] as ContactInfo) || null,
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return {
      profile: null,
      services: [],
      education: [],
      experience: [],
      skills: [],
      awards: [],
      portfolio: [],
      socialLinks: [],
      contactInfo: null,
    };
  }
}

export default async function Home() {
  const {
    profile,
    services,
    education,
    experience,
    skills,
    awards,
    portfolio,
    socialLinks,
    contactInfo,
  } = await getHomeData();

  return (
    <main className="min-h-screen">
      <Navigation profile={profile} />
      <Hero profile={profile} socialLinks={socialLinks} />
      <Services services={services} />
      <DoctorProfile profile={profile} />
      <StatsSection profile={profile} />
      <Portfolio items={portfolio} />
      <Resume
        education={education}
        experience={experience}
        skills={skills}
        awards={awards}
      />
      <Appointment contactInfo={contactInfo} />
      <Footer socialLinks={socialLinks} profile={profile} />
    </main>
  );
}
