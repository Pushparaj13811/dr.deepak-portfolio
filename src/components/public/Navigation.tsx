import { useState, useEffect } from "react";

interface NavigationProps {
  logo?: string;
}

export function Navigation({ logo }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-10" />
            ) : (
              <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                isScrolled ? "bg-[#0ea5e9]" : "bg-white"
              }`}>
                <span className={`font-bold text-xl transition-colors ${
                  isScrolled ? "text-white" : "text-[#0ea5e9]"
                }`}>M</span>
              </div>
            )}
            <span className={`text-xl font-semibold transition-colors ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}>MTN</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("home")} className={`transition text-sm ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
            }`}>
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className={`transition text-sm ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
            }`}>
              About Me
            </button>
            <button onClick={() => scrollToSection("services")} className={`transition text-sm ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
            }`}>
              Services
            </button>
            <button onClick={() => scrollToSection("portfolio")} className={`transition text-sm ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
            }`}>
              Portfolio
            </button>
            <button onClick={() => scrollToSection("blog")} className={`transition text-sm ${
              isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white/90 hover:text-white"
            }`}>
              Blog
            </button>
            <button onClick={() => scrollToSection("contact")} className="px-6 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition text-sm">
              Contact Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-gray-900" : "text-white"
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
          <div className="md:hidden py-4 bg-white/10 backdrop-blur-md rounded-lg mt-2">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection("home")} className="text-white hover:text-white/80 transition text-left px-4">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="text-white hover:text-white/80 transition text-left px-4">
                About Me
              </button>
              <button onClick={() => scrollToSection("services")} className="text-white hover:text-white/80 transition text-left px-4">
                Services
              </button>
              <button onClick={() => scrollToSection("portfolio")} className="text-white hover:text-white/80 transition text-left px-4">
                Portfolio
              </button>
              <button onClick={() => scrollToSection("blog")} className="text-white hover:text-white/80 transition text-left px-4">
                Blog
              </button>
              <button onClick={() => scrollToSection("contact")} className="mx-4 px-6 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition text-center">
                Contact Me
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
