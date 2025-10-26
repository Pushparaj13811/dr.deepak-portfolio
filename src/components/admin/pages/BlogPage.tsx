import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import { BlogForm } from "./BlogForm";
import type { BlogPost } from "../../../types";

interface BlogPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function BlogPage({ onBack, onSuccess, onError }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", {
        credentials: "include",
      });
      const data = await res.json();
      setPosts(data.data || []);
    } catch (error) {
      onError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setAdding(false);
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSave = async () => {
    await loadPosts();
    handleCancel();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess("Blog post deleted successfully!");
        await loadPosts();
      } else {
        onError(result.error || "Failed to delete blog post");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(`Blog post ${post.published ? "unpublished" : "published"} successfully!`);
        await loadPosts();
      } else {
        onError(result.error || "Failed to update blog post");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (adding || editing) {
    return (
      <BlogForm
        post={editing}
        onCancel={handleCancel}
        onSave={handleSave}
        onSuccess={onSuccess}
        onError={onError}
      />
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Blog</h1>
              <p className="mt-2 text-gray-600">Create and manage blog posts</p>
            </div>
            <Button onClick={startAdd}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first blog post.</p>
            <Button onClick={startAdd}>Create Your First Post</Button>
          </div>
        )}

        {/* Blog Posts List */}
        {posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Blog Posts ({posts.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                        {post.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {formatDate(post.created_at)}</span>
                        {post.reading_time && (
                          <span>{post.reading_time} min read</span>
                        )}
                        {post.author && (
                          <span>By {post.author}</span>
                        )}
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 5).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 5 && (
                            <span className="text-xs text-gray-500">+{post.tags.length - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button onClick={() => startEdit(post)} variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        onClick={() => togglePublished(post)}
                        variant="outline"
                        size="sm"
                        className={post.published ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}