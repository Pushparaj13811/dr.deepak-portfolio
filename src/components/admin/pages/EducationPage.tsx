import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import type { Education } from "../../../types";

interface EducationPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function EducationPage({ onBack, onSuccess, onError }: EducationPageProps) {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ degree: "", institution: "", year: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducation(data.data || []);
    } catch (error) {
      onError("Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ degree: "", institution: "", year: "", description: "" });
  };

  const startEdit = (edu: Education) => {
    setEditing(edu);
    setAdding(false);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year || "",
      description: edu.description || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ degree: "", institution: "", year: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/education/${editing.id}` : "/api/admin/education";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Education updated successfully!" : "Education added successfully!");
        await loadEducation();
        handleCancel();
      } else {
        onError(result.error || "Failed to save education");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      const res = await fetch(`/api/admin/education/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Education deleted successfully!");
        await loadEducation();
      } else {
        onError(result.error || "Failed to delete education");
      }
    } catch (error) {
      onError("Network error. Failed to delete education.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading education...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Education</h1>
              <p className="mt-2 text-gray-600">Add, edit, or remove education entries</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Education
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Education" : "Add New Education"}
              </h2>

              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
              />

              <Input
                label="Institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />

              <Input
                label="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2015-2019"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </form>
        )}

        {/* Education List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Education</h2>

            {education.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No education</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your education.</p>
                <div className="mt-6">
                  <Button onClick={startAdd}>Add Education</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="mt-1 text-gray-600">{edu.institution}</p>
                        {edu.year && (
                          <p className="mt-1 text-sm text-gray-500">{edu.year}</p>
                        )}
                        {edu.description && (
                          <p className="mt-2 text-gray-600">{edu.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(edu)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(edu.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
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
