'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function SkillsPage() {
  return (
    <CrudPage
      title="Skill"
      description="Manage your skills"
      apiPath="skills"
      displayField="name"
      fields={[
        { name: 'name', label: 'Skill Name', type: 'text', required: true },
        { name: 'proficiency', label: 'Proficiency (%)', type: 'number', required: true },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
