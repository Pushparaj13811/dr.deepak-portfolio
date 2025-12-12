'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from './AdminPageLayout';
import { Button, Input, Toast, ImageUpload } from '@/components/ui';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface CrudPageProps {
  title: string;
  description: string;
  apiPath: string;
  fields: Field[];
  displayField: string;
  secondaryField?: string;
}

export function CrudPage({
  title,
  description,
  apiPath,
  fields,
  displayField,
  secondaryField,
}: CrudPageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const getInitialFormData = () => {
    const initial: Record<string, unknown> = {};
    fields.forEach((field) => {
      initial[field.name] = field.type === 'number' ? 0 : '';
    });
    return initial;
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${apiPath}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch {
      setToast({ type: 'error', message: `Failed to load ${title.toLowerCase()}` });
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData(getInitialFormData());
  };

  const startEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    setAdding(false);
    const editData: Record<string, unknown> = {};
    fields.forEach((field) => {
      editData[field.name] = item[field.name] || (field.type === 'number' ? 0 : '');
    });
    setFormData(editData);
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setFormData(getInitialFormData());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing
        ? `/api/admin/${apiPath}/${editing.id}`
        : `/api/admin/${apiPath}`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({
          type: 'success',
          message: editing ? `${title} updated successfully!` : `${title} added successfully!`,
        });
        await loadItems();
        handleCancel();
      } else {
        setToast({ type: 'error', message: result.error || `Failed to save ${title.toLowerCase()}` });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;

    try {
      const res = await fetch(`/api/admin/${apiPath}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: `${title} deleted successfully!` });
        await loadItems();
      } else {
        setToast({ type: 'error', message: result.error || `Failed to delete ${title.toLowerCase()}` });
      }
    } catch {
      setToast({ type: 'error', message: `Network error. Failed to delete ${title.toLowerCase()}.` });
    }
  };

  const updateField = (name: string, value: unknown) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderField = (field: Field) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={(value as string) || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );
      case 'image':
        return (
          <ImageUpload
            key={field.name}
            label={field.label}
            value={(value as string) || ''}
            onChange={(base64) => updateField(field.name, base64)}
            onRemove={() => updateField(field.name, '')}
          />
        );
      case 'select':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={(value as string) || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'number':
        return (
          <Input
            key={field.name}
            label={field.label}
            type="number"
            value={value as number}
            onChange={(e) => updateField(field.name, parseInt(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {title.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title={`Manage ${title}`} description={description}>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="flex justify-end mb-6">
        {!adding && !editing && (
          <Button onClick={startAdd}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {title}
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editing) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editing ? `Edit ${title}` : `Add New ${title}`}
            </h2>
            {fields.map(renderField)}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? `Update ${title}` : `Add ${title}`}
            </Button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All {title}s</h2>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {title.toLowerCase()}s</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new {title.toLowerCase()}.</p>
              <div className="mt-6">
                <Button onClick={startAdd}>Add {title}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id as number}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item[displayField] as string}
                      </h3>
                      {secondaryField && item[secondaryField] ? (
                        <p className="mt-1 text-gray-600">{item[secondaryField] as string}</p>
                      ) : null}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id as number)}
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
    </AdminPageLayout>
  );
}
