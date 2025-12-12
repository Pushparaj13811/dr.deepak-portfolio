'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function SocialLinksPage() {
  return (
    <CrudPage
      title="Social Link"
      description="Manage your social media links"
      apiPath="social-links"
      displayField="platform"
      secondaryField="url"
      fields={[
        { name: 'platform', label: 'Platform', type: 'text', required: true, placeholder: 'e.g., Facebook, Twitter' },
        { name: 'url', label: 'URL', type: 'text', required: true },
        { name: 'icon', label: 'Icon', type: 'text', placeholder: 'e.g., facebook, twitter' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
