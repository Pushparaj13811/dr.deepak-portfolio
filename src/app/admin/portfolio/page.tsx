'use client';

import { CrudPage } from '@/components/admin/CrudPage';

export default function PortfolioPage() {
  return (
    <CrudPage
      title="Portfolio Item"
      description="Manage your portfolio images"
      apiPath="portfolio"
      displayField="title"
      secondaryField="category"
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'image_base64', label: 'Image', type: 'image', required: true },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ]}
    />
  );
}
