import { useState, useEffect } from "react";
import type { Profile } from "../../types";

interface NavigationProps {
  logo?: string;
  profile?: Profile | null;
  isBlogRoute?: boolean;
  onNavigateHome?: () => void;
  onNavigateToBlog?: () => void;
}

export function Navigation({ logo, profile, isBlogRoute, onNavigateHome, onNavigateToBlog }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get initials from doctor's name
  const getInitials = (name?: string) => {
    if (!name) return "D";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
    }
    return name[0] || "D";
  };

  const scrollToSection = (id: string) => {
    if (isBlogRoute && onNavigateHome) {
      // If we're on blog route, navigate home first, then scroll
      onNavigateHome();
      // Use timeout to allow page to load before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // We're on home page, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleBlogNavigation = () => {
    if (onNavigateToBlog) {
      onNavigateToBlog();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-[#b8d4e8]/30 backdrop-blur-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            if (isBlogRoute && onNavigateHome) {
              onNavigateHome();
            } else {
              scrollToSection("home");
            }
          }}>
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-10" />
            ) : (
              <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                isScrolled ? "bg-[#0ea5e9]" : "bg-white"
              }`}>
                <span className={`font-bold text-sm transition-colors ${
                  isScrolled ? "text-white" : "text-[#0ea5e9]"
                }`}>{getInitials(profile?.full_name)}</span>
              </div>
            )}
            <span className={`text-base lg:text-xl font-semibold transition-colors ${
              isScrolled ? "text-gray-900" : "text-gray-900"
            }`}>{profile?.full_name || "Doctor"}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("home")} className={`cursor-pointer transition text-sm lg:text-base font-medium ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-900 hover:text-gray-700"
            }`}>
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className={`cursor-pointer transition text-sm lg:text-base font-medium ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-900 hover:text-gray-700"
            }`}>
              About Me
            </button>
            <button onClick={() => scrollToSection("services")} className={`cursor-pointer transition text-sm lg:text-base font-medium ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-900 hover:text-gray-700"
            }`}>
              Services
            </button>
            <button onClick={() => scrollToSection("portfolio")} className={`cursor-pointer transition text-sm lg:text-base font-medium ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-900 hover:text-gray-700"
            }`}>
              Portfolio
            </button>
            <button onClick={handleBlogNavigation} className={`cursor-pointer transition text-sm lg:text-base font-medium ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-900 hover:text-gray-700"
            }`}>
              Blog
            </button>
            <button onClick={() => scrollToSection("contact")} className="cursor-pointer px-6 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition text-sm lg:text-base">
              Contact Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 cursor-pointer transition-colors ${
              isScrolled ? "text-gray-900" : "text-gray-900"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-lg rounded-lg mt-2 shadow-lg">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection("home")} className="cursor-pointer text-gray-900 hover:text-gray-700 transition text-left px-4 font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="cursor-pointer text-gray-900 hover:text-gray-700 transition text-left px-4 font-medium">
                About Me
              </button>
              <button onClick={() => scrollToSection("services")} className="cursor-pointer text-gray-900 hover:text-gray-700 transition text-left px-4 font-medium">
                Services
              </button>
              <button onClick={() => scrollToSection("portfolio")} className="cursor-pointer text-gray-900 hover:text-gray-700 transition text-left px-4 font-medium">
                Portfolio
              </button>
              <button onClick={handleBlogNavigation} className="cursor-pointer text-gray-900 hover:text-gray-700 transition text-left px-4 font-medium">
                Blog
              </button>
              <button onClick={() => scrollToSection("contact")} className="cursor-pointer mx-4 px-6 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition text-center">
                Contact Me
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
