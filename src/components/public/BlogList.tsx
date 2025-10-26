import { useState, useEffect } from "react";
import type { BlogPost } from "../../types";

interface BlogListProps {
  onSelectPost: (slug: string) => void;
}

export function BlogList({ onSelectPost }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error);
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

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Health Insights & Updates</h2>
          <div className="w-24 h-1 bg-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">
            Expert insights on health, wellness, and medical innovations
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600"
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as string)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {selectedCategory
                ? `No posts found in "${selectedCategory}" category.`
                : "No blog posts available yet."}
            </p>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer"
              onClick={() => onSelectPost(post.slug)}
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Cover Image */}
                {post.image_base64 && post.theme?.showCoverImage !== false && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={post.image_base64}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Category Badge */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {post.theme?.showAuthor !== false && post.author && (
                        <span>{post.author}</span>
                      )}
                      {post.theme?.showDate !== false && (
                        <span>{formatDate(post.created_at)}</span>
                      )}
                    </div>
                    {post.theme?.showReadingTime !== false && post.reading_time && (
                      <span>{post.reading_time} min read</span>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}