import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Database types
export type Market = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'resolved' | 'cancelled';
  yes_probability: number;
  no_probability: number;
  total_volume: number;
  yes_pool: number;
  no_pool: number;
  token_type: 'DATX' | 'SOL' | 'USDC';
  resolution_date: string;
  resolved_outcome?: 'yes' | 'no' | null;
  created_at: string;
  updated_at: string;
  image_url?: string;
};

export type Position = {
  id: string;
  user_id: string;
  market_id: string;
  outcome: 'yes' | 'no';
  amount: number;
  token_type: 'DATX' | 'SOL' | 'USDC';
  shares: number;
  avg_price: number;
  status: 'active' | 'closed' | 'claimed';
  pnl?: number;
  created_at: string;
  updated_at: string;
};

export type Trade = {
  id: string;
  user_id: string;
  market_id: string;
  outcome: 'yes' | 'no';
  amount: number;
  token_type: 'DATX' | 'SOL' | 'USDC';
  shares: number;
  price: number;
  trade_type: 'buy' | 'sell';
  created_at: string;
};

export type User = {
  id: string;
  wallet_address: string;
  username?: string;
  total_volume: number;
  total_pnl: number;
  markets_traded: number;
  created_at: string;
  updated_at: string;
};

export type Treasury = {
  id: string;
  total_volume: number;
  datx_collected: number;
  datx_burned: number;
  sol_collected: number;
  usdc_collected: number;
  markets_resolved: number;
  active_positions: number;
  updated_at: string;
};
