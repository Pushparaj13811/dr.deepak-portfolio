'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button, Input, ImageUpload, Toast } from '@/components/ui';
import type { Profile } from '@/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data.data);
    } catch {
      setToast({ type: 'error', message: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to update profile' });
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <Button onClick={() => router.push('/admin')} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title="Edit Profile" description="Update your personal information and profile details">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />
            <Input
              label="Title"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              required
            />
          </div>

          <Input
            label="Tagline"
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Text (Short Version)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={profile.about_text_short || ''}
              onChange={(e) => setProfile({ ...profile, about_text_short: e.target.value })}
              placeholder="Brief description for hero section"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Text (Long Version)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={profile.about_text || ''}
              onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
              placeholder="Detailed description for profile section"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={profile.specialization || ''}
              onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
              placeholder="e.g., MBBS (DGN) FCPS (DGN)"
            />
          </div>

          <ImageUpload
            label="Profile Photo"
            value={profile.photo_base64 || ''}
            onChange={(base64) => setProfile({ ...profile, photo_base64: base64 })}
            onRemove={() => setProfile({ ...profile, photo_base64: null })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Years of Experience"
              type="number"
              value={profile.years_experience}
              onChange={(e) =>
                setProfile({ ...profile, years_experience: parseInt(e.target.value) || 0 })
              }
            />
            <Input
              label="Surgeries Count"
              type="number"
              value={profile.surgeries_count}
              onChange={(e) =>
                setProfile({ ...profile, surgeries_count: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        {/* Footer */}
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
