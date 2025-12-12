'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function EducationPage() {
  return (
    <CrudPage
      title="Education"
      description="Manage your education history"
      apiPath="education"
      displayField="degree"
      secondaryField="institution"
      fields={[
        { name: 'degree', label: 'Degree', type: 'text', required: true },
        { name: 'institution', label: 'Institution', type: 'text', required: true },
        { name: 'year', label: 'Year', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
