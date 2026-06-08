import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Market } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[v0] Fetching markets with filters:', { category, status, search, limit, offset });

    let query = supabase
      .from('markets')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[v0] Markets fetch error:', error);
      throw error;
    }

    console.log('[v0] Markets fetched:', data?.length || 0);

    return NextResponse.json({
      markets: data as Market[],
      total: count || data?.length || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[v0] Markets API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch markets',
      },
      { status: 500 }
    );
  }
}

// Create new market (admin only in production)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('[v0] Creating new market:', body.title);

    const { data, error } = await supabase
      .from('markets')
      .insert({
        title: body.title,
        description: body.description,
        category: body.category,
        status: 'active',
        yes_probability: 50,
        no_probability: 50,
        total_volume: 0,
        yes_pool: 0,
        no_pool: 0,
        token_type: body.token_type || 'DATX',
        resolution_date: body.resolution_date,
        image_url: body.image_url,
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Market creation error:', error);
      throw error;
    }

    console.log('[v0] Market created:', data.id);

    return NextResponse.json({ market: data as Market });
  } catch (error) {
    console.error('[v0] Market creation API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create market',
      },
      { status: 500 }
    );
  }
}
