import type { Profile } from "../../types";
import { Button } from "../shared/Button";
import heroImage from "../../assets/Hero-image.png";
import heroBackground from "../../assets/Hero-background.jpg";

interface HeroProps {
  profile: Profile | null;
}

export function Hero({ profile }: HeroProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen md:h-[85vh] lg:h-screen relative bg-cover bg-center pt-20 md:pt-0"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-[#b8d4e8]/80"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 w-full h-full items-center md:items-end">
          {/* Text Content - LEFT SIDE */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1 py-6 md:py-0 md:pb-12 lg:pb-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {profile?.tagline || "Dreams of life remains till the heart beats"}
            </h1>
            <p className="text-sm md:text-base text-white/90">
              Lorem ipsum dolor sit amet, consectetur adipiscing<br className="hidden md:block"/>
              elit. Dignissim ut tempor sagittis.
            </p>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-[#0ea5e9] text-white rounded-md font-medium hover:bg-[#0284c7] transition shadow-lg text-sm md:text-base"
              >
                Make Appointment
              </button>
            </div>

            {/* Social Icon */}
            <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-md hover:bg-white transition border-2 border-white">
                <svg className="w-5 h-5 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Doctor Image - RIGHT SIDE */}
          <div className="relative order-1 md:order-2 h-[60vh] md:h-auto" style={{ lineHeight: 0 }}>
            <img
              src={heroImage}
              alt={profile?.full_name || "Doctor"}
              className="w-full h-full md:h-auto object-cover object-bottom rounded-lg"
              style={{ display: 'block', margin: 0, padding: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
