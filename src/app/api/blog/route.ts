import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { BlogPost, ApiResponse } from '@/types';

export async function GET() {
  try {
    const posts = await sql`
      SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: posts,
    } as ApiResponse<BlogPost[]>);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' } as ApiResponse,
      { status: 500 }
    );
  }
}
