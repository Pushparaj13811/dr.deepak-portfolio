import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import type { BlogPostFormData, ApiResponse } from '@/types';

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    const result = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
    const post = result[0];

    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' } as ApiResponse, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post } as ApiResponse);
  } catch (error) {
    console.error('Fetch blog post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' } as ApiResponse, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<BlogPostFormData>;

    // Get current post to merge with updates
    const currentResult = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
    const currentPost = currentResult[0] as Record<string, unknown> | undefined;

    if (!currentPost) {
      return NextResponse.json({ success: false, error: 'Blog post not found' } as ApiResponse, { status: 404 });
    }

    // Calculate reading time if content is provided
    const content = body.content !== undefined ? body.content : (currentPost.content as string);
    const readingTime = content ? calculateReadingTime(content) : (currentPost.reading_time as number);

    // Merge theme with existing theme
    const currentTheme = (currentPost.theme as Record<string, unknown>) || {};
    const newTheme = body.theme ? { ...currentTheme, ...body.theme } : currentTheme;

    await sql`
      UPDATE blog_posts
      SET
        title = ${body.title !== undefined ? body.title : currentPost.title},
        slug = ${body.slug !== undefined ? body.slug : currentPost.slug},
        excerpt = ${body.excerpt !== undefined ? body.excerpt : currentPost.excerpt},
        content = ${body.content !== undefined ? body.content : currentPost.content},
        image_base64 = ${body.image_base64 !== undefined ? body.image_base64 : currentPost.image_base64},
        published = ${body.published !== undefined ? body.published : currentPost.published},
        theme = ${JSON.stringify(newTheme)},
        meta_title = ${body.meta_title !== undefined ? body.meta_title : currentPost.meta_title},
        meta_description = ${body.meta_description !== undefined ? body.meta_description : currentPost.meta_description},
        meta_keywords = ${body.meta_keywords !== undefined ? body.meta_keywords : currentPost.meta_keywords},
        tags = ${body.tags !== undefined ? body.tags : currentPost.tags},
        category = ${body.category !== undefined ? body.category : currentPost.category},
        author = ${body.author !== undefined ? body.author : currentPost.author},
        reading_time = ${readingTime},
        inline_images = ${JSON.stringify(body.inline_images !== undefined ? body.inline_images : currentPost.inline_images || [])},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Blog post updated successfully' } as ApiResponse);
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' } as ApiResponse, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' } as ApiResponse);
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' } as ApiResponse, { status: 500 });
  }
}
