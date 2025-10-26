import { useState } from "react";
import { Button } from "../shared/Button";
import type { BlogPostFormData, BlogImage } from "../../types";

interface BlogPreviewProps {
  formData: BlogPostFormData;
  onClose: () => void;
}

export function BlogPreview({ formData, onClose }: BlogPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const formatDate = (date?: string) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const renderMarkdownWithImages = (content: string, images: BlogImage[] = []) => {
    let html = content;

    // Replace image placeholders with actual images
    images.forEach(image => {
      const placeholder = `{{image:${image.id}}}`;
      const imageHtml = `
        <div class="my-6">
          <img src="${image.base64}" alt="${image.alt || image.name}" class="w-full rounded-lg shadow-lg" />
          ${image.caption ? `<p class="text-sm text-gray-600 text-center mt-2 italic">${image.caption}</p>` : ''}
        </div>
      `;
      html = html.replace(new RegExp(placeholder, 'g'), imageHtml);
    });

    // Enhanced markdown to HTML conversion
    html = html
      // Headers
      .replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold mt-4 mb-2 text-gray-900">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener">$1</a>')
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 border"><code class="text-sm">$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-blue-50 py-2">$1</blockquote>')
      // Lists
      .replace(/^\* (.+)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.+)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      // Paragraphs and line breaks
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = '<p class="mb-4 text-gray-700 leading-relaxed">' + html + '</p>';

    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li class="ml-4 mb-1">• .*<\/li>(\s*<br>)*)+/g, (match) => {
      return '<ul class="list-none my-4 space-y-1">' + match.replace(/<br>/g, '') + '</ul>';
    });
    
    html = html.replace(/(<li class="ml-4 mb-1 list-decimal">.*<\/li>(\s*<br>)*)+/g, (match) => {
      return '<ol class="list-decimal list-inside my-4 space-y-1">' + match.replace(/<br>/g, '').replace(/list-decimal/g, '') + '</ol>';
    });

    return { __html: html };
  };

  const getViewportClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const theme = formData.theme;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Preview Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Blog Preview</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-white rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-3 py-1 text-xs rounded-l-md ${
                    viewMode === 'desktop' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`px-3 py-1 text-xs border-x border-gray-300 ${
                    viewMode === 'tablet' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tablet
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-3 py-1 text-xs rounded-r-md ${
                    viewMode === 'mobile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>
          </div>
          <Button onClick={onClose} variant="outline">
            Close Preview
          </Button>
        </div>

        {/* Preview Content */}
        <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="bg-gray-100 p-8">
            <div className={getViewportClasses()}>
              <article className="bg-white min-h-screen shadow-lg">
                {/* Cover Image */}
                {formData.image_base64 && theme.showCoverImage && (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={formData.image_base64}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {formData.title}
                      </h1>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        {theme.showAuthor && formData.author && (
                          <span>{formData.author}</span>
                        )}
                        {theme.showDate && (
                          <span>{formatDate()}</span>
                        )}
                        {theme.showReadingTime && (
                          <span>{calculateReadingTime(formData.content)} min read</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Header (if no cover image) */}
                  {(!formData.image_base64 || !theme.showCoverImage) && (
                    <header className="mb-8">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {formData.title}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        {theme.showAuthor && formData.author && (
                          <span>{formData.author}</span>
                        )}
                        {theme.showDate && (
                          <span>{formatDate()}</span>
                        )}
                        {theme.showReadingTime && (
                          <span>{calculateReadingTime(formData.content)} min read</span>
                        )}
                      </div>
                    </header>
                  )}

                  {/* Category and Tags */}
                  {(formData.category || (formData.tags && formData.tags.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      {formData.category && (
                        <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {formData.category}
                        </span>
                      )}
                      {formData.tags && formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Excerpt */}
                  {formData.excerpt && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-lg text-gray-700 italic">{formData.excerpt}</p>
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={renderMarkdownWithImages(formData.content, formData.inline_images)}
                  />

                  {/* Comments Section Placeholder */}
                  {theme.enableComments && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-600">
                          Comments will appear here when the blog post is published.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}