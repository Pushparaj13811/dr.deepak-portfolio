import { useState } from "react";
import { Input, Textarea } from "../shared/Input";
import { Button } from "../shared/Button";
import type { AppointmentRequest, ContactInfo } from "../../types";

interface AppointmentProps {
  contactInfo: ContactInfo | null;
}

interface AppointmentFormData extends AppointmentRequest {
  date?: string;
}

export function Appointment({ contactInfo }: AppointmentProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    full_name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({ type: "success", text: "Appointment request submitted successfully! We'll contact you soon." });
        setFormData({ full_name: "", email: "", phone: "", date: "", message: "" });
      } else {
        setSubmitMessage({ type: "error", text: data.error || "Failed to submit appointment request." });
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="appointment" className="py-20 bg-blue-300/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Appointment Form */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Appointment</h2>
            <div className="w-20 h-1 bg-blue-600 mb-8"></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your medical concerns..."
                  className="w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Book Now
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div id="contact">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Contact Info</h2>
            <div className="w-20 h-1 bg-blue-600 mb-8"></div>

            <div className="space-y-6">
              {contactInfo?.description && (
                <p className="text-gray-600 leading-relaxed text-base">{contactInfo.description}</p>
              )}

              <div className="space-y-0 pt-2">
                {contactInfo?.phone && (
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.email && (
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                      <p className="text-gray-600 break-all">{contactInfo.email}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.address && (
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{contactInfo.address}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.permanent_address && (
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Permanent Address</h4>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{contactInfo.permanent_address}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.working_hours && (
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{contactInfo.working_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
