import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { MOCK_MARKETS } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    
    console.log('[v0] Starting database setup...');

    // Create tables using Supabase client
    // Note: In production, you'd run these via Supabase SQL editor or migrations
    
    // 1. Create markets from mock data
    console.log('[v0] Inserting markets...');
    const { data: marketsData, error: marketsError } = await supabase
      .from('markets')
      .upsert(
        MOCK_MARKETS.map(market => ({
          id: market.id,
          title: market.title,
          description: market.description,
          category: market.category,
          status: market.status,
          yes_probability: market.yes_probability,
          no_probability: market.no_probability,
          total_volume: market.total_volume,
          yes_pool: market.yes_pool,
          no_pool: market.no_pool,
          token_type: market.token_type,
          resolution_date: market.resolution_date,
          created_at: market.created_at,
          image_url: market.image_url,
        })),
        { onConflict: 'id' }
      );

    if (marketsError) {
      console.error('[v0] Markets insert error:', marketsError);
      throw marketsError;
    }
    
    console.log('[v0] Markets inserted:', marketsData);

    // 2. Initialize treasury
    console.log('[v0] Initializing treasury...');
    const { error: treasuryError } = await supabase
      .from('treasury')
      .upsert({
        id: 'main',
        total_volume: 3200000,
        datx_collected: 48000,
        datx_burned: 125000,
        sol_collected: 18500,
        usdc_collected: 85000,
        markets_resolved: 142,
        active_positions: 2847,
      }, { onConflict: 'id' });

    if (treasuryError) {
      console.error('[v0] Treasury insert error:', treasuryError);
      throw treasuryError;
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      markets: MOCK_MARKETS.length,
    });
  } catch (error) {
    console.error('[v0] Database setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
