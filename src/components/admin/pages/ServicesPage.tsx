import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import type { Service } from "../../../types";

interface ServicesPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ServicesPage({ onBack, onSuccess, onError }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", icon: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      onError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ title: "", description: "", icon: "" });
  };

  const startEdit = (service: Service) => {
    setEditing(service);
    setAdding(false);
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "",
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData({ title: "", description: "", icon: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(editing ? "Service updated successfully!" : "Service added successfully!");
        await loadServices();
        handleCancel();
      } else {
        onError(result.error || "Failed to save service");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Service deleted successfully!");
        await loadServices();
      } else {
        onError(result.error || "Failed to delete service");
      }
    } catch (error) {
      onError("Network error. Failed to delete service.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
              <p className="mt-2 text-gray-600">Add, edit, or remove services</p>
            </div>
            {!adding && !editing && (
              <Button onClick={startAdd}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        {(adding || editing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Service" : "Add New Service"}
              </h2>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
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

              <Input
                label="Icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., fas fa-heart"
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Service" : "Add Service"}
              </Button>
            </div>
          </form>
        )}

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Services</h2>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new service.</p>
                <div className="mt-6">
                  <Button onClick={startAdd}>Add Service</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        {service.description && (
                          <p className="mt-1 text-gray-600">{service.description}</p>
                        )}
                        {service.icon && (
                          <p className="mt-2 text-sm text-gray-500">Icon: {service.icon}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(service)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
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
