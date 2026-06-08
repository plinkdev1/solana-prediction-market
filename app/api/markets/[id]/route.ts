import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Market } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('[v0] Fetching market:', id);

    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[v0] Market fetch error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      );
    }

    console.log('[v0] Market fetched:', data.title);

    return NextResponse.json({ market: data as Market });
  } catch (error) {
    console.error('[v0] Market detail API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch market',
      },
      { status: 500 }
    );
  }
}

// Update market (for odds updates, volume changes)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('[v0] Updating market:', id, body);

    const { data, error } = await supabase
      .from('markets')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[v0] Market update error:', error);
      throw error;
    }

    console.log('[v0] Market updated:', data.id);

    return NextResponse.json({ market: data as Market });
  } catch (error) {
    console.error('[v0] Market update API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update market',
      },
      { status: 500 }
    );
  }
}
