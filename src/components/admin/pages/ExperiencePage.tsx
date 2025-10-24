import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import type { Experience } from "../../../types";

interface ExperiencePageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ExperiencePage({ onBack, onSuccess, onError }: ExperiencePageProps) {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ position: "", organization: "", start_date: "", end_date: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperience(data.data || []);
    } catch (error) {
      onError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ position: "", organization: "", start_date: "", end_date: "", description: "" });
  };

  const startEdit = (exp: Experience) => {
    setEditing(exp);
    setAdding(false);
    setFormData({
      position: exp.position,
      organization: exp.organization,
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ position: "", organization: "", start_date: "", end_date: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/experience/${editing.id}` : "/api/admin/experience";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Experience updated successfully!" : "Experience added successfully!");
        await loadExperience();
        handleCancel();
      } else {
        onError(result.error || "Failed to save experience");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Experience deleted successfully!");
        await loadExperience();
      } else {
        onError(result.error || "Failed to delete experience");
      }
    } catch (error) {
      onError("Network error. Failed to delete experience.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Experience</h1>
              <p className="mt-2 text-gray-600">Add, edit, or remove work experience</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </Button>
            )}
          </div>
        </div>

        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Experience" : "Add New Experience"}
              </h2>
              <Input label="Position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
              <Input label="Organization" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} placeholder="e.g., Jan 2020" />
                <Input label="End Date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} placeholder="Leave empty if current" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Experience</h2>
            {experience.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No experience</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your work experience.</p>
                <div className="mt-6"><Button onClick={startAdd}>Add Experience</Button></div>
              </div>
            ) : (
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="mt-1 text-gray-600">{exp.organization}</p>
                        <p className="mt-1 text-sm text-gray-500">{exp.start_date} - {exp.end_date || "Present"}</p>
                        {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => startEdit(exp)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(exp.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
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
