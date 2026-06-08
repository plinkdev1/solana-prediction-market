// DXMarkets - Type Definitions

import { MARKET_CATEGORIES, TOKEN_OPTIONS } from './constants';

export type TokenType = typeof TOKEN_OPTIONS[number]['value'];
export type MarketStatus = 'active' | 'closed' | 'resolved' | 'cancelled';
export type MarketCategory = typeof MARKET_CATEGORIES[number];
export type MarketType = 'lore' | 'fast';
// Expanded: 'satirical'|'crypto'|'political'|'el-shito'|'datxit'|'xitmas'|'tech'|'sports'|'elections'|'market-trends'|'custom'

// Market
export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  market_type: MarketType; // NEW: 'lore' or 'fast'
  yes_probability: number; // 0-100
  no_probability: number; // 0-100
  total_volume: number;
  yes_pool: number;
  no_pool: number;
  token_type: TokenType;
  resolution_date: string; // ISO 8601
  resolution_window_hours?: number; // NEW: for fast markets countdown
  created_at: string;
  resolved_at?: string;
  resolved_outcome?: 'yes' | 'no' | 'invalid';
  creator_wallet?: string;
  image_url?: string;
}

// Position (user bet)
export interface Position {
  id: string;
  market_id: string;
  market_title: string;
  user_wallet: string;
  side: 'yes' | 'no';
  amount: number;
  token_type: TokenType;
  shares: number;
  entry_price: number; // probability when bought
  current_value: number;
  pnl: number; // profit/loss
  status: 'open' | 'closed' | 'settled';
  created_at: string;
}

// User
export interface User {
  wallet: string;
  total_volume: number;
  total_profit: number;
  win_rate: number; // 0-100
  markets_traded: number;
  created_at: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  win_rate: number;
  profit: number;
  markets_traded: number;
}

// Treasury Stats
export interface TreasuryStats {
  total_burned: number;
  total_rake: number;
  total_volume: number;
  markets_resolved: number;
}

// Consent Log (GDPR)
export interface ConsentLog {
  id: string;
  user_wallet?: string;
  type: 'age_gate' | 'cookie' | 'tos';
  accepted: boolean;
  timestamp: string;
  ip_hash?: string;
}

// API Response Shapes

export interface MarketsResponse {
  markets: Market[];
  total: number;
  page: number;
  limit: number;
}

export interface PlaceOrderRequest {
  market_id: string;
  side: 'yes' | 'no';
  amount: number;
  token_type: TokenType;
  user_wallet: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  tx_signature?: string;
  shares?: number;
  error?: string;
}

export interface GenerateMarketRequest {
  prompt: string;
  category?: MarketCategory;
  token_type?: TokenType;
  resolution_date?: string;
}

export interface GenerateMarketResponse {
  success: boolean;
  market?: Market;
  error?: string;
}

// Comment (for market discussions)
export interface Comment {
  id: string;
  market_id: string;
  user_wallet: string;
  text: string;
  created_at: string;
}
