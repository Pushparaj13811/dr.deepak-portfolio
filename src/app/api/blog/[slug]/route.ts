import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { BlogPost, ApiResponse } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await sql`
      SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true
    `;
    const post = result[0] || null;

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    } as ApiResponse<BlogPost>);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' } as ApiResponse,
      { status: 500 }
    );
  }
}
