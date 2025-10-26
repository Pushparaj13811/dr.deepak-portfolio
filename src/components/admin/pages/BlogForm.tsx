import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ImageUpload } from "../../shared/ImageUpload";
import { MarkdownEditor } from "../../shared/MarkdownEditor";
import { ImageManager } from "../../shared/ImageManager";
import { BlogPreview } from "../BlogPreview";
import type { BlogPost, BlogPostFormData, BlogTheme, BlogImage } from "../../../types";

interface BlogFormProps {
  post?: BlogPost | null;
  onCancel: () => void;
  onSave: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const defaultTheme: BlogTheme = {
  mode: "light",
  primaryColor: "#3b82f6",
  fontFamily: "sans-serif",
  fontSize: "medium",
  layout: "standard",
  showCoverImage: true,
  showReadingTime: true,
  showAuthor: true,
  showDate: true,
  enableComments: false,
};

const CATEGORIES = [
  "Health Tips",
  "Medical News",
  "Patient Stories",
  "Technology",
  "Research",
  "Lifestyle",
  "Education",
];

export function BlogForm({ post, onCancel, onSave, onSuccess, onError }: BlogFormProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_base64: "",
    published: false,
    theme: defaultTheme,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    tags: [],
    category: "",
    author: "Dr. Deepak Mehta",
    inline_images: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "theme" | "images">("content");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        image_base64: post.image_base64 || "",
        published: post.published,
        theme: post.theme || defaultTheme,
        meta_title: post.meta_title || "",
        meta_description: post.meta_description || "",
        meta_keywords: post.meta_keywords || "",
        tags: post.tags || [],
        category: post.category || "",
        author: post.author || "Dr. Deepak Sharma",
        inline_images: post.inline_images || [],
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: post ? formData.slug : generateSlug(title),
      meta_title: formData.meta_title || title,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleImagesChange = (images: BlogImage[]) => {
    setFormData({
      ...formData,
      inline_images: images,
    });
  };

  const handleInsertImage = (imageId: string) => {
    const image = formData.inline_images?.find(img => img.id === imageId);
    if (image) {
      const imageMarkdown = `![${image.alt || image.name}]({{image:${imageId}}})`;
      setFormData({
        ...formData,
        content: formData.content + '\n\n' + imageMarkdown + '\n\n',
      });
      // Switch to content tab after inserting
      setActiveTab('content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(post ? "Blog post updated successfully!" : "Blog post created successfully!");
        onSave();
      } else {
        onError(result.error || "Failed to save blog post");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog Posts
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {post ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="mt-2 text-gray-600">
                {post ? "Update your blog post content and settings" : "Write and publish a new blog post"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={() => setShowPreview(true)}
                variant="outline"
                disabled={!formData.title || !formData.content}
              >
                Preview
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.title || !formData.content}
                form="blog-form"
              >
                {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </div>

        <form id="blog-form" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200 px-6 pt-6">
              <nav className="-mb-px flex gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "content"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "seo"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                  SEO & Meta
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("theme")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "theme"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Appearance
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("images")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "images"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Images
                </button>
              </nav>
            </div>

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700  mb-2">
                      Title *
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700  mb-2">
                      Slug *
                    </label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700  mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="A brief summary of the post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Content *
                  </label>
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    minHeight="400px"
                    images={formData.inline_images || []}
                    onInsertImage={handleInsertImage}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Cover Image
                  </label>
                  <ImageUpload
                    label="Cover Image"
                    value={formData.image_base64}
                    onChange={(image_base64) => setFormData({ ...formData, image_base64 })}
                    className="max-w-md"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700  mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 "
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700  mb-2">
                      Author
                    </label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add a tag..."
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 dark:bg-gray-800 "
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
                    Publish immediately
                  </label>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>

                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder={formData.title || "Page title for search engines"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.meta_title?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={formData.excerpt || "Page description for search engines"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.meta_description?.length || 0}/160 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="theme_mode" className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Mode
                    </label>
                    <select
                      id="theme_mode"
                      value={formData.theme.mode}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, mode: e.target.value as "light" | "dark" }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={formData.theme.primaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          theme: { ...formData.theme, primaryColor: e.target.value }
                        })}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={formData.theme.primaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          theme: { ...formData.theme, primaryColor: e.target.value }
                        })}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="font_family" className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      id="font_family"
                      value={formData.theme.fontFamily}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, fontFamily: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="font_size" className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      id="font_size"
                      value={formData.theme.fontSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, fontSize: e.target.value as "small" | "medium" | "large" }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="layout" className="block text-sm font-medium text-gray-700 mb-2">
                      Layout Style
                    </label>
                    <select
                      id="layout"
                      value={formData.theme.layout}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, layout: e.target.value as "standard" | "magazine" | "minimal" }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="magazine">Magazine</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Display Options</h4>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.theme.showCoverImage}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, showCoverImage: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show cover image</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.theme.showReadingTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, showReadingTime: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show reading time</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.theme.showAuthor}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, showAuthor: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show author name</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.theme.showDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, showDate: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show publish date</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.theme.enableComments}
                      onChange={(e) => setFormData({
                        ...formData,
                        theme: { ...formData.theme, enableComments: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable comments</span>
                  </label>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === "images" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Image Management</h3>
                <p className="text-sm text-gray-600">
                  Upload and manage images for your blog post. You can insert images anywhere in your content.
                </p>
                
                <ImageManager
                  images={formData.inline_images || []}
                  onImagesChange={handleImagesChange}
                  onInsertImage={handleInsertImage}
                />
              </div>
            )}
          </div>
        </form>

        {/* Preview Modal */}
        {showPreview && (
          <BlogPreview
            formData={formData}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
}