import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ImageUpload } from "../../shared/ImageUpload";
import type { Award } from "../../../types";

interface AwardsPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function AwardsPage({ onBack, onSuccess, onError }: AwardsPageProps) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Award | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", issuer: "", year: "", description: "", image_base64: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/awards");
      const data = await res.json();
      setAwards(data.data || []);
    } catch (error) {
      onError("Failed to load awards");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ title: "", issuer: "", year: "", description: "", image_base64: "" });
  };

  const startEdit = (award: Award) => {
    setEditing(award);
    setAdding(false);
    setFormData({
      title: award.title,
      issuer: award.issuer || "",
      year: award.year || "",
      description: award.description || "",
      image_base64: award.image_base64 || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ title: "", issuer: "", year: "", description: "", image_base64: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/awards/${editing.id}` : "/api/admin/awards";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Award updated successfully!" : "Award added successfully!");
        await loadAwards();
        handleCancel();
      } else {
        onError(result.error || "Failed to save award");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this award?")) return;

    try {
      const res = await fetch(`/api/admin/awards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Award deleted successfully!");
        await loadAwards();
      } else {
        onError(result.error || "Failed to delete award");
      }
    } catch (error) {
      onError("Network error. Failed to delete award.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading awards...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Awards</h1>
              <p className="mt-2 text-gray-600">Add, edit, or remove awards and achievements</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Award
              </Button>
            )}
          </div>
        </div>

        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Award" : "Add New Award"}
              </h2>
              <Input
                label="Award Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Issuing Organization"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                required
              />
              <Input
                label="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2023"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <ImageUpload
                label="Award Image (Optional)"
                value={formData.image_base64}
                onChange={(base64) => setFormData({ ...formData, image_base64: base64 })}
                onRemove={() => setFormData({ ...formData, image_base64: "" })}
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Awards</h2>
            {awards.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No awards</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your awards and achievements.</p>
                <div className="mt-6"><Button onClick={startAdd}>Add Award</Button></div>
              </div>
            ) : (
              <div className="space-y-4">
                {awards.map((award) => (
                  <div key={award.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                    <div className="flex justify-between items-start gap-4">
                      {award.image_base64 && (
                        <div className="flex-shrink-0">
                          <img
                            src={award.image_base64}
                            alt={award.title}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                        <p className="mt-1 text-gray-600">{award.issuer}</p>
                        {award.year && <p className="mt-1 text-sm text-gray-500">{award.year}</p>}
                        {award.description && <p className="mt-2 text-gray-600">{award.description}</p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => startEdit(award)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(award.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
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
