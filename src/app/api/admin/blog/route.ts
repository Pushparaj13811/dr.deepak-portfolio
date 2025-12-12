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

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const posts = await sql`
      SELECT * FROM blog_posts ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, data: posts } as ApiResponse);
  } catch (error) {
    console.error('Fetch blog posts error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' } as ApiResponse, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' } as ApiResponse, { status: 401 });
    }

    const body = (await request.json()) as BlogPostFormData;

    // Calculate reading time
    const readingTime = calculateReadingTime(body.content);

    // Ensure theme has default values
    const theme = body.theme || {
      mode: 'light',
      primaryColor: '#3b82f6',
      fontFamily: 'sans-serif',
      fontSize: 'medium',
      layout: 'standard',
      showCoverImage: true,
      showReadingTime: true,
      showAuthor: true,
      showDate: true,
      enableComments: false,
    };

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, image_base64, published,
        theme, meta_title, meta_description, meta_keywords,
        tags, category, author, reading_time, inline_images
      )
      VALUES (
        ${body.title},
        ${body.slug},
        ${body.excerpt || null},
        ${body.content},
        ${body.image_base64 || null},
        ${body.published},
        ${JSON.stringify(theme)},
        ${body.meta_title || body.title},
        ${body.meta_description || body.excerpt || null},
        ${body.meta_keywords || null},
        ${body.tags || []},
        ${body.category || null},
        ${body.author || 'Admin'},
        ${readingTime},
        ${JSON.stringify(body.inline_images || [])}
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: { id: result[0]?.id },
    } as ApiResponse);
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' } as ApiResponse, { status: 500 });
  }
}
