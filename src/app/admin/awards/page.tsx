'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function AwardsPage() {
  return (
    <CrudPage
      title="Award"
      description="Manage your awards and achievements"
      apiPath="awards"
      displayField="title"
      secondaryField="issuer"
      fields={[
        { name: 'title', label: 'Award Title', type: 'text', required: true },
        { name: 'issuer', label: 'Issuing Organization', type: 'text' },
        { name: 'year', label: 'Year', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image_base64', label: 'Award Image', type: 'image' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
