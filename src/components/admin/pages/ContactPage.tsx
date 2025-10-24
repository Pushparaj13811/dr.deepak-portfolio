import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import type { ContactInfo } from "../../../types";

interface ContactPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ContactPage({ onBack, onSuccess, onError }: ContactPageProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setContactInfo(data.data);
    } catch (error) {
      onError("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Contact information updated successfully!");
      } else {
        onError(result.error || "Failed to update contact information");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load contact information</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Contact Information</h1>
          <p className="mt-2 text-gray-600">Update your contact details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={contactInfo.phone || ""}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={contactInfo.address || ""}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                placeholder="Office address including city, state, ZIP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={contactInfo.permanent_address || ""}
                onChange={(e) => setContactInfo({ ...contactInfo, permanent_address: e.target.value })}
                placeholder="Permanent residential address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={contactInfo.description || ""}
                onChange={(e) => setContactInfo({ ...contactInfo, description: e.target.value })}
                placeholder="Brief description about availability and services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={contactInfo.working_hours || ""}
                onChange={(e) => setContactInfo({ ...contactInfo, working_hours: e.target.value })}
                placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM, Sun: Closed"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onBack}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
