import type { Service } from "../../types";

interface ServicesProps {
  services: Service[];
}

const iconMap: Record<string, JSX.Element> = {
  medical: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
    </svg>
  ),
  treatment: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
    </svg>
  ),
  equipment: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  ),
};

export function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Special Services For<br />My Patients
          </h2>
          <div className="w-16 h-1 bg-[#0ea5e9] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <div key={service.id} className="text-center py-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#e0f2fe] rounded-full flex items-center justify-center text-[#0ea5e9] mb-6">
                  {iconMap[service.icon || "medical"] || iconMap.medical}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <a href="#" className="text-[#0ea5e9] text-sm font-medium hover:underline uppercase">
                  FIND SERVICE
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
