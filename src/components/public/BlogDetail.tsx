import { useState, useEffect } from "react";
import type { BlogPost } from "../../types";

interface BlogDetailProps {
  slug: string;
  onBack: () => void;
}

export function BlogDetail({ slug, onBack }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
        // Update document title for SEO
        if (data.data.meta_title) {
          document.title = data.data.meta_title;
        }
      }
    } catch (error) {
      console.error("Failed to load blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderMarkdown = (content: string) => {
    let html = content;

    // Replace image placeholders with actual images
    if (post?.inline_images) {
      post.inline_images.forEach(image => {
        const placeholder = `{{image:${image.id}}}`;
        const imageHtml = `
          <div class="my-6">
            <img src="${image.base64}" alt="${image.alt || image.name}" class="w-full rounded-lg shadow-lg" />
            ${image.caption ? `<p class="text-sm text-gray-600 text-center mt-2 italic">${image.caption}</p>` : ''}
          </div>
        `;
        html = html.replace(new RegExp(placeholder, 'g'), imageHtml);
      });
    }

    // Enhanced markdown to HTML conversion
    html = html
      // Headers
      .replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold mt-4 mb-2">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener">$1</a>')
      // Regular images (not inline)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-lg shadow-lg max-w-full" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-blue-50 py-2">$1</blockquote>')
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 border"><code class="text-sm">$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
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

  if (loading) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading article...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Article not found</p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Apply theme styles
  const theme = post.theme || {};
  const themeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
  };

  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const fontFamilyStyles = {
    "sans-serif": "font-sans",
    serif: "font-serif",
    monospace: "font-mono",
  };

  // Ensure we use a typed key when indexing fontFamilyStyles to avoid implicit any errors
  const fontFamilyKey = (theme.fontFamily as keyof typeof fontFamilyStyles) || "sans-serif";

  const layoutClasses = {
    standard: "max-w-4xl",
    magazine: "max-w-6xl",
    minimal: "max-w-2xl",
  };

  return (
    <section className="bg-white min-h-screen">
      {/* Hero Section with Cover Image */}
      {post.image_base64 && theme.showCoverImage !== false && (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={post.image_base64}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                {theme.showAuthor !== false && post.author && (
                  <span>{post.author}</span>
                )}
                {theme.showDate !== false && (
                  <span>{formatDate(post.created_at)}</span>
                )}
                {theme.showReadingTime !== false && post.reading_time && (
                  <span>{post.reading_time} min read</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header (if no cover image) */}
          {(!post.image_base64 || theme.showCoverImage === false) && (
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                {theme.showAuthor !== false && post.author && (
                  <span>{post.author}</span>
                )}
                {theme.showDate !== false && (
                  <span>{formatDate(post.created_at)}</span>
                )}
                {theme.showReadingTime !== false && post.reading_time && (
                  <span>{post.reading_time} min read</span>
                )}
              </div>
            </header>
          )}

          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {post.category && (
              <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
            )}
            {post.tags && post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <article 
            className={`prose prose-lg max-w-none ${fontSizeClasses[theme.fontSize || "medium"]} ${fontFamilyStyles[fontFamilyKey]}`}
            dangerouslySetInnerHTML={renderMarkdown(post.content)}
          />

          {/* Comments Section */}
          {theme.enableComments && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">
                  Comments feature coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Meta Tags */}
      {post.meta_description && (
        <meta name="description" content={post.meta_description} />
      )}
      {post.meta_keywords && (
        <meta name="keywords" content={post.meta_keywords} />
      )}
    </section>
  );
}