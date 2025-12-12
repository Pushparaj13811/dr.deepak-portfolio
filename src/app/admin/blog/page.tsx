'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button, Input, Toast, ImageUpload, MarkdownEditor } from '@/components/ui';
import type { BlogPost, BlogPostFormData } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [adding, setAdding] = useState(false);
  const defaultTheme = {
    mode: 'light' as const,
    primaryColor: '#2563eb',
    fontFamily: 'system-ui',
    fontSize: 'medium' as const,
    layout: 'standard' as const,
    showCoverImage: true,
    showReadingTime: true,
    showAuthor: true,
    showDate: true,
    enableComments: false,
  };

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_base64: '',
    published: false,
    theme: defaultTheme,
    category: '',
    author: '',
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data.data || []);
    } catch {
      setToast({ type: 'error', message: 'Failed to load blog posts' });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_base64: '',
      published: false,
      theme: defaultTheme,
      category: '',
      author: '',
      tags: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setAdding(false);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      image_base64: post.image_base64 || '',
      published: post.published,
      theme: post.theme || defaultTheme,
      category: post.category || '',
      author: post.author || '',
      tags: post.tags || [],
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
    });
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: editing ? 'Blog post updated!' : 'Blog post created!' });
        await loadPosts();
        handleCancel();
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to save blog post' });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: 'Blog post deleted!' });
        await loadPosts();
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to delete blog post' });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error.' });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setToast({ type: 'success', message: post.published ? 'Post unpublished!' : 'Post published!' });
        await loadPosts();
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to update post' });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title="Blog" description="Create and manage blog posts">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="flex justify-end mb-6">
        {!adding && !editing && (
          <Button onClick={startAdd}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Button>
        )}
      </div>

      {/* Form */}
      {(adding || editing) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editing ? 'Edit Post' : 'Create New Post'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: formData.slug || generateSlug(title),
                  });
                }}
                required
              />
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Health, Wellness"
              />
              <Input
                label="Author"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
              />
            </div>

            <ImageUpload
              label="Cover Image"
              value={formData.image_base64 || ''}
              onChange={(base64) => setFormData({ ...formData, image_base64: base64 })}
              onRemove={() => setFormData({ ...formData, image_base64: '' })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish this post
              </label>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Posts</h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
              <div className="mt-6">
                <Button onClick={startAdd}>Create Post</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      {post.excerpt && <p className="text-gray-600">{post.excerpt}</p>}
                      <p className="mt-2 text-sm text-gray-500">
                        {post.category && <span className="mr-3">{post.category}</span>}
                        {post.reading_time && <span>{post.reading_time} min read</span>}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => startEdit(post)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
