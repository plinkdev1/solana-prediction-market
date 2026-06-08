import type { Market, Position, Trade, User } from './types';

const API_BASE = '/api';

export class DXMarketsAPI {
  // Markets
  static async getMarkets(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Market[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    
    const url = `${API_BASE}/markets?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch markets');
    return res.json();
  }

  static async getMarket(id: string): Promise<Market> {
    const res = await fetch(`${API_BASE}/markets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch market');
    return res.json();
  }

  // Positions
  static async getPositions(userId?: string): Promise<Position[]> {
    const params = userId ? `?user_id=${userId}` : '';
    const res = await fetch(`${API_BASE}/positions${params}`);
    if (!res.ok) throw new Error('Failed to fetch positions');
    return res.json();
  }

  // Trades
  static async getTrades(marketId?: string, limit = 50): Promise<Trade[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (marketId) params.set('market_id', marketId);
    
    const res = await fetch(`${API_BASE}/trades?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch trades');
    return res.json();
  }

  static async placeTrade(data: {
    market_id: string;
    user_id: string;
    outcome: 'yes' | 'no';
    token_type: 'DATX' | 'SOL' | 'USDC';
    amount: number;
  }): Promise<{ position: Position; trade: Trade }> {
    const res = await fetch(`${API_BASE}/trades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to place trade');
    return res.json();
  }

  // Treasury stats
  static async getTreasury() {
    const res = await fetch(`${API_BASE}/treasury`);
    if (!res.ok) throw new Error('Failed to fetch treasury');
    return res.json();
  }
}
