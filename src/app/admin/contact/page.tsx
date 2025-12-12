'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button, Input, Toast } from '@/components/ui';
import type { ContactInfo } from '@/types';

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContact(data.data || {
        phone: '',
        email: '',
        address: '',
        permanent_address: '',
        working_hours: '',
        description: '',
      });
    } catch {
      setToast({ type: 'error', message: 'Failed to load contact info' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: 'Contact info updated successfully!' });
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to update contact info' });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact info...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load contact info</p>
          <Button onClick={() => router.push('/admin')} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title="Contact Information" description="Update your contact details">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          <Input
            label="Phone Number"
            type="text"
            value={contact.phone || ''}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />

          <Input
            label="Email Address"
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="doctor@example.com"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={contact.address || ''}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="Enter office address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permanent Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={contact.permanent_address || ''}
              onChange={(e) => setContact({ ...contact, permanent_address: e.target.value })}
              placeholder="Enter permanent address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Working Hours
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={contact.working_hours || ''}
              onChange={(e) => setContact({ ...contact, working_hours: e.target.value })}
              placeholder="Monday - Friday: 9AM - 5PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={contact.description || ''}
              onChange={(e) => setContact({ ...contact, description: e.target.value })}
              placeholder="Brief description about contact section"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/admin')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </AdminPageLayout>
  );
}
