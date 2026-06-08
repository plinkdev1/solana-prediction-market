import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Position } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const marketId = searchParams.get('market_id');
    const status = searchParams.get('status');

    console.log('[v0] Fetching positions:', { userId, marketId, status });

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('positions')
      .select(`
        *,
        markets:market_id (
          id,
          title,
          status,
          yes_probability,
          no_probability,
          resolved_outcome
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (marketId) {
      query = query.eq('market_id', marketId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[v0] Positions fetch error:', error);
      throw error;
    }

    console.log('[v0] Positions fetched:', data?.length || 0);

    return NextResponse.json({ positions: data as Position[] });
  } catch (error) {
    console.error('[v0] Positions API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch positions',
      },
      { status: 500 }
    );
  }
}
