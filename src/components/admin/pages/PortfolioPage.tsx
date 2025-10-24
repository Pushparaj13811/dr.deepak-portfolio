import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ImageUpload } from "../../shared/ImageUpload";
import type { PortfolioItem } from "../../../types";

interface PortfolioPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function PortfolioPage({ onBack, onSuccess, onError }: PortfolioPageProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", image_base64: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolioItems(data.data || []);
    } catch (error) {
      onError("Failed to load portfolio items");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ title: "", category: "", image_base64: "", description: "" });
  };

  const startEdit = (item: PortfolioItem) => {
    setEditing(item);
    setAdding(false);
    setFormData({
      title: item.title,
      category: item.category || "",
      image_base64: item.image_base64,
      description: item.description || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ title: "", category: "", image_base64: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/portfolio/${editing.id}` : "/api/admin/portfolio";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Portfolio item updated successfully!" : "Portfolio item added successfully!");
        await loadPortfolio();
        handleCancel();
      } else {
        onError(result.error || "Failed to save portfolio item");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Portfolio item deleted successfully!");
        await loadPortfolio();
      } else {
        onError(result.error || "Failed to delete portfolio item");
      }
    } catch (error) {
      onError("Network error. Failed to delete portfolio item.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Portfolio</h1>
              <p className="mt-2 text-gray-600">Upload and manage portfolio images</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Portfolio Item
              </Button>
            )}
          </div>
        </div>

        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Portfolio Item" : "Add New Portfolio Item"}
              </h2>
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Before/After, Procedure, Equipment"
              />
              <ImageUpload
                label="Portfolio Image"
                value={formData.image_base64}
                onChange={(base64) => setFormData({ ...formData, image_base64: base64 })}
                onRemove={() => setFormData({ ...formData, image_base64: "" })}
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
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={saving || !formData.image_base64}>
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Portfolio Items</h2>
            {portfolioItems.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your portfolio images.</p>
                <div className="mt-6"><Button onClick={startAdd}>Add Portfolio Item</Button></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition">
                    <div className="aspect-video bg-gray-100 relative">
                      <img src={item.image_base64} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {item.category && <p className="mt-1 text-sm text-gray-500">{item.category}</p>}
                      {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => startEdit(item)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
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
