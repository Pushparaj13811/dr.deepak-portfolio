import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { PortfolioItem, ApiResponse } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let portfolio;

    if (category && category !== 'All Work') {
      portfolio = await sql`
        SELECT * FROM portfolio_items
        WHERE category = ${category}
        ORDER BY display_order ASC
      `;
    } else {
      portfolio = await sql`
        SELECT * FROM portfolio_items ORDER BY display_order ASC
      `;
    }

    return NextResponse.json({
      success: true,
      data: portfolio,
    } as ApiResponse<PortfolioItem[]>);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' } as ApiResponse,
      { status: 500 }
    );
  }
}
