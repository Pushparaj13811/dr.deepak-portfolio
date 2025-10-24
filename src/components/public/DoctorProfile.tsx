import type { Profile } from "../../types";

interface DoctorProfileProps {
  profile: Profile | null;
}

export function DoctorProfile({ profile }: DoctorProfileProps) {
  return (
    <section className="py-20 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Doctor Image - LEFT SIDE */}
          <div className="relative">
            <img
              src={profile?.photo_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=600&fit=crop"}
              alt={profile?.full_name || "Doctor"}
              className="w-full h-auto object-cover rounded-lg"
            />
            {/* Play button overlay (decorative) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition">
                <svg className="w-6 h-6 text-[#0ea5e9] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Doctor Bio - RIGHT SIDE */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {profile?.full_name || "Dr. Skyler White"}
            </h2>
            <h3 className="text-[#0ea5e9] font-semibold text-lg uppercase">
              {profile?.title || "DENTIST & ORAL SURGEON"}
            </h3>
            <p className="text-sm text-gray-600 uppercase">
              MBBS (DGN) FCPS (DGN)
            </p>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                {profile?.about_text || "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dignissim ut tempor sagittis. Lorem ipsum dolor sit amet consectetur adipiscing elit."}
              </p>
              <p>
                Habitant sit tristique lorem lectus sollicitudin magna gravida nec. Mauris lobortis gravida sapien dignissim erat. Habitant aliquet duis praesent vestibulum magna.
              </p>
            </div>

            <div className="pt-4">
              <button className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-md font-medium hover:bg-[#0284c7] transition inline-flex items-center gap-2">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
