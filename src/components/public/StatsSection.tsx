import type { Profile } from "../../types";

interface StatsSectionProps {
  profile: Profile | null;
}

export function StatsSection({ profile }: StatsSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Experience Stats */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {profile?.years_experience || 24} Years of Experience with {profile?.surgeries_count || 120}+<br />
              Surgeries Successfully Done !
            </h2>
            <button className="px-8 py-3 bg-[#0ea5e9] text-white rounded-md font-medium hover:bg-[#0284c7] transition shadow-lg">
              Hire Now
            </button>
          </div>

          {/* Right Side - Schedule Card */}
          <div className="bg-[#0ea5e9] text-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold">Time for Meet</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p className="text-sm text-white/80">10:00AM - 07:00PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Sunday - Monday</p>
                  <p className="text-sm text-white/80">12:00AM - 04:00PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
