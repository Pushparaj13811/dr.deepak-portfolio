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

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Check URL path for admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      checkAuth();
    } else {
      setView("public");
      loadPublicData();
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
        socialRes,
      ] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/services"),
        fetch("/api/education"),
        fetch("/api/experience"),
        fetch("/api/skills"),
        fetch("/api/awards"),
        fetch("/api/portfolio"),
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
        socialData,
      ] = await Promise.all([
        profileRes.json(),
        servicesRes.json(),
        educationRes.json(),
        experienceRes.json(),
        skillsRes.json(),
        awardsRes.json(),
        portfolioRes.json(),
        socialRes.json(),
      ]);

      setProfile(profileData.data);
      setServices(servicesData.data || []);
      setEducation(educationData.data || []);
      setExperience(experienceData.data || []);
      setSkills(skillsData.data || []);
      setAwards(awardsData.data || []);
      setPortfolio(portfolioData.data || []);
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

  // Public website
  return (
    <div className="min-h-screen bg-white">
      <Navigation profile={profile} />
      <Hero profile={profile} />
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
      <Appointment />
      <Footer socialLinks={socialLinks} />
    </div>
  );
}
