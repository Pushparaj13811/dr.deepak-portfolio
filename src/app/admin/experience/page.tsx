'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function ExperiencePage() {
  return (
    <CrudPage
      title="Experience"
      description="Manage your work experience"
      apiPath="experience"
      displayField="position"
      secondaryField="organization"
      fields={[
        { name: 'position', label: 'Position', type: 'text', required: true },
        { name: 'organization', label: 'Organization', type: 'text', required: true },
        { name: 'start_date', label: 'Start Date', type: 'text', placeholder: 'e.g., 2020' },
        { name: 'end_date', label: 'End Date', type: 'text', placeholder: 'Leave empty for Present' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
