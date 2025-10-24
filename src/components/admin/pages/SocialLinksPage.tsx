import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import type { SocialLink } from "../../../types";

interface SocialLinksPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function SocialLinksPage({ onBack, onSuccess, onError }: SocialLinksPageProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ platform: "", url: "", icon: "" });
  const [saving, setSaving] = useState(false);

  const platformIcons: Record<string, string> = {
    facebook: "facebook",
    twitter: "twitter",
    instagram: "instagram",
    linkedin: "linkedin",
    youtube: "youtube",
    github: "github",
    whatsapp: "whatsapp",
    telegram: "telegram",
  };

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social-links");
      const data = await res.json();
      setSocialLinks(data.data || []);
    } catch (error) {
      onError("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ platform: "", url: "", icon: "" });
  };

  const startEdit = (link: SocialLink) => {
    setEditing(link);
    setAdding(false);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ platform: "", url: "", icon: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/social-links/${editing.id}` : "/api/admin/social-links";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Social link updated successfully!" : "Social link added successfully!");
        await loadSocialLinks();
        handleCancel();
      } else {
        onError(result.error || "Failed to save social link");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    try {
      const res = await fetch(`/api/admin/social-links/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Social link deleted successfully!");
        await loadSocialLinks();
      } else {
        onError(result.error || "Failed to delete social link");
      }
    } catch (error) {
      onError("Network error. Failed to delete social link.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading social links...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Social Links</h1>
              <p className="mt-2 text-gray-600">Add or update your social media profiles</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Social Link
              </Button>
            )}
          </div>
        </div>

        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Social Link" : "Add New Social Link"}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.platform}
                  onChange={(e) => {
                    const platform = e.target.value;
                    setFormData({
                      ...formData,
                      platform,
                      icon: platformIcons[platform.toLowerCase()] || platform.toLowerCase(),
                    });
                  }}
                  required
                >
                  <option value="">Select a platform</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="GitHub">GitHub</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Profile URL"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/yourprofile"
                required
              />

              <Input
                label="Icon Name (optional)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., facebook, twitter, linkedin"
              />

              <p className="text-sm text-gray-500">
                The icon name will be auto-filled based on the platform selection. You can customize it if needed.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Social Links</h2>
            {socialLinks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No social links</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your social media profiles.</p>
                <div className="mt-6"><Button onClick={startAdd}>Add Social Link</Button></div>
              </div>
            ) : (
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <div key={link.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {link.platform.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{link.platform}</h3>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            {link.url}
                          </a>
                          {link.icon && <p className="text-sm text-gray-500 mt-1">Icon: {link.icon}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => startEdit(link)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(link.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
