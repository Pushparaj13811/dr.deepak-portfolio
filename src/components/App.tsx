import { useState, useEffect } from "react";
import { Navigation } from "./public/Navigation";
import { Hero } from "./public/Hero";
import { Services } from "./public/Services";
import { DoctorProfile } from "./public/DoctorProfile";
import { Portfolio } from "./public/Portfolio";
import { StatsSection } from "./public/StatsSection";
import { Resume } from "./public/Resume";
import { Appointment } from "./public/Appointment";
import { Footer } from "./public/Footer";
import { Blog } from "./public/Blog";
import { Login } from "./admin/Login";
import { Dashboard } from "./admin/Dashboard";
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
} from "../types";

type View = "public" | "admin-login" | "admin-dashboard";

export function App() {
  const [view, setView] = useState<View>("public");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string>("/");

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Check URL path for admin route
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentRoute(path);
    
    if (path.startsWith("/admin")) {
      checkAuth();
    } else {
      setView("public");
      loadPublicData();
      
      // Handle blog routes
      if (path.startsWith("/blog/") && path !== "/blog/") {
        const slug = path.replace("/blog/", "");
        setSelectedBlogSlug(slug);
      } else {
        setSelectedBlogSlug(null);
      }
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me");
      const data = await response.json();

      if (data.success) {
        setView("admin-dashboard");
      } else {
        setView("admin-login");
      }
    } catch {
      setView("admin-login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublicData = async () => {
    try {
      const [
        profileRes,
        servicesRes,
        educationRes,
        experienceRes,
        skillsRes,
        awardsRes,
        portfolioRes,
        contactRes,
        socialRes,
      ] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/services"),
        fetch("/api/education"),
        fetch("/api/experience"),
        fetch("/api/skills"),
        fetch("/api/awards"),
        fetch("/api/portfolio"),
        fetch("/api/contact"),
        fetch("/api/social-links"),
      ]);

      const [
        profileData,
        servicesData,
        educationData,
        experienceData,
        skillsData,
        awardsData,
        portfolioData,
        contactData,
        socialData,
      ] = await Promise.all([
        profileRes.json(),
        servicesRes.json(),
        educationRes.json(),
        experienceRes.json(),
        skillsRes.json(),
        awardsRes.json(),
        portfolioRes.json(),
        contactRes.json(),
        socialRes.json(),
      ]);

      setProfile(profileData.data);
      setServices(servicesData.data || []);
      setEducation(educationData.data || []);
      setExperience(experienceData.data || []);
      setSkills(skillsData.data || []);
      setAwards(awardsData.data || []);
      setPortfolio(portfolioData.data || []);
      setContactInfo(contactData.data);
      setSocialLinks(socialData.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setView("admin-dashboard");
    window.history.pushState({}, "", "/admin");
  };

  const handleLogout = () => {
    setView("admin-login");
    window.history.pushState({}, "", "/admin/login");
  };
  
  const handleBlogPostSelect = (slug: string | null) => {
    setSelectedBlogSlug(slug);
    if (slug) {
      window.history.pushState({}, "", `/blog/${slug}`);
    } else {
      window.history.pushState({}, "", "/blog");
    }
  };

  const handleNavigateHome = () => {
    setSelectedBlogSlug(null);
    setCurrentRoute("/");
    window.history.pushState({}, "", "/");
  };

  const handleNavigateToBlog = () => {
    setSelectedBlogSlug(null);
    setCurrentRoute("/blog");
    window.history.pushState({}, "", "/blog");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === "admin-login") {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === "admin-dashboard") {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Check if we're on a blog-specific route
  const isBlogRoute = currentRoute === "/blog" || currentRoute.startsWith("/blog/");

  // Public website
  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        profile={profile} 
        isBlogRoute={isBlogRoute}
        onNavigateHome={handleNavigateHome}
        onNavigateToBlog={handleNavigateToBlog}
      />
      
      {isBlogRoute ? (
        // Blog-only view
        <Blog 
          selectedSlug={selectedBlogSlug}
          onSelectPost={handleBlogPostSelect}
        />
      ) : (
        // Home page with all sections
        <>
          <Hero profile={profile} socialLinks={socialLinks} />
          <Services services={services} />
          <DoctorProfile profile={profile} />
          <Portfolio items={portfolio} />
          <StatsSection profile={profile} />
          <Resume
            education={education}
            experience={experience}
            skills={skills}
            awards={awards}
            profile={profile}
          />
          <Blog 
            selectedSlug={null}
            onSelectPost={(slug) => {
              // Navigate to dedicated blog route instead of showing inline
              window.location.href = `/blog/${slug}`;
            }}
          />
          <Appointment contactInfo={contactInfo} />
        </>
      )}
      
      <Footer socialLinks={socialLinks} profile={profile} />
    </div>
  );
}
