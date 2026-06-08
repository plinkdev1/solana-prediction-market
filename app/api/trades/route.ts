import { NextResponse } from 'next/server';
import { supabase, getSupabaseServerClient } from '@/lib/supabase';
import type { Trade, Position } from '@/lib/supabase';

// Get trades for a market or user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get('market_id');
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log('[v0] Fetching trades:', { marketId, userId, limit });

    let query = supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (marketId) {
      query = query.eq('market_id', marketId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[v0] Trades fetch error:', error);
      throw error;
    }

    console.log('[v0] Trades fetched:', data?.length || 0);

    return NextResponse.json({ trades: data as Trade[] });
  } catch (error) {
    console.error('[v0] Trades API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch trades',
      },
      { status: 500 }
    );
  }
}

// Place a trade (buy/sell)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabaseServer = getSupabaseServerClient();
    
    console.log('[v0] Placing trade:', body);

    const {
      user_id,
      market_id,
      outcome,
      amount,
      token_type,
      trade_type,
    } = body;

    // Calculate shares based on current odds (simplified AMM)
    const { data: market } = await supabase
      .from('markets')
      .select('*')
      .eq('id', market_id)
      .single();

    if (!market) {
      throw new Error('Market not found');
    }

    const probability = outcome === 'yes' ? market.yes_probability : market.no_probability;
    const price = probability / 100;
    const shares = amount / price;

    // Insert trade
    const { data: trade, error: tradeError } = await supabaseServer
      .from('trades')
      .insert({
        user_id,
        market_id,
        outcome,
        amount,
        token_type,
        shares,
        price,
        trade_type,
      })
      .select()
      .single();

    if (tradeError) {
      console.error('[v0] Trade insert error:', tradeError);
      throw tradeError;
    }

    // Update or create position
    const { data: existingPosition } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', user_id)
      .eq('market_id', market_id)
      .eq('outcome', outcome)
      .eq('status', 'active')
      .single();

    if (existingPosition) {
      // Update existing position
      const newShares = trade_type === 'buy' 
        ? existingPosition.shares + shares 
        : existingPosition.shares - shares;
      
      const newAmount = trade_type === 'buy'
        ? existingPosition.amount + amount
        : existingPosition.amount - amount;

      const newAvgPrice = newAmount / newShares;

      await supabaseServer
        .from('positions')
        .update({
          shares: newShares,
          amount: newAmount,
          avg_price: newAvgPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPosition.id);
    } else if (trade_type === 'buy') {
      // Create new position
      await supabaseServer
        .from('positions')
        .insert({
          user_id,
          market_id,
          outcome,
          amount,
          token_type,
          shares,
          avg_price: price,
          status: 'active',
        });
    }

    // Update market pools and probabilities
    const newYesPool = outcome === 'yes' 
      ? market.yes_pool + amount 
      : market.yes_pool;
    
    const newNoPool = outcome === 'no' 
      ? market.no_pool + amount 
      : market.no_pool;

    const totalPool = newYesPool + newNoPool;
    const newYesProb = Math.round((newYesPool / totalPool) * 100);
    const newNoProb = 100 - newYesProb;

    await supabaseServer
      .from('markets')
      .update({
        yes_pool: newYesPool,
        no_pool: newNoPool,
        yes_probability: newYesProb,
        no_probability: newNoProb,
        total_volume: market.total_volume + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', market_id);

    console.log('[v0] Trade placed:', trade.id);

    return NextResponse.json({ trade: trade as Trade });
  } catch (error) {
    console.error('[v0] Trade placement error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to place trade',
      },
      { status: 500 }
    );
  }
}
