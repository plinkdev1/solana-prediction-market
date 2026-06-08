import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/leaderboard?period=monthly
export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get('period') || 'all_time';
    const validPeriods = ['daily', 'weekly', 'monthly', 'all_time'];

    if (!validPeriods.includes(period)) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    // Try cached data first
    const { data: cached, error: cacheErr } = await supabase
      .from('leaderboard_cache')
      .select('rank_data, updated_at')
      .eq('period', period)
      .single();

    if (!cacheErr && cached && Array.isArray(cached.rank_data) && cached.rank_data.length > 0) {
      const age = Date.now() - new Date(cached.updated_at).getTime();
      const staleMs = 60 * 60 * 1000; // 1 hour

      if (age < staleMs) {
        return NextResponse.json({
          leaderboard: cached.rank_data,
          period,
          cached: true,
          updated_at: cached.updated_at,
        });
      }
    }

    // Fallback: live query from users table
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('wallet_address, username, total_volume, total_profit, markets_won, markets_lost')
      .order('total_profit', { ascending: false })
      .limit(50);

    if (usersErr) {
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    const rankings = (users || []).map((u, i) => ({
      rank: i + 1,
      wallet: u.wallet_address,
      username: u.username,
      profit: u.total_profit,
      volume: u.total_volume,
      win_rate:
        u.markets_won + u.markets_lost > 0
          ? Math.round((u.markets_won / (u.markets_won + u.markets_lost)) * 1000) / 10
          : 0,
      markets_traded: u.markets_won + u.markets_lost,
    }));

    // Update cache
    await supabase
      .from('leaderboard_cache')
      .update({ rank_data: rankings, updated_at: new Date().toISOString() })
      .eq('period', period);

    return NextResponse.json({
      leaderboard: rankings,
      period,
      cached: false,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
