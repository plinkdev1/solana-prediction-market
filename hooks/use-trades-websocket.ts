import { useEffect, useState, useCallback } from 'react';
import type { Trade } from '@/lib/supabase';

type TradeUpdate = {
  type: 'trade' | 'market_update' | 'connected' | 'heartbeat';
  data?: any;
  marketId?: string;
  timestamp?: number;
};

export function useTradesWebSocket(marketId?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = marketId 
      ? `/api/ws/trades?market_id=${marketId}`
      : '/api/ws/trades';

    console.log('[v0] Connecting to trades WebSocket:', url);
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('[v0] WebSocket connected');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const update: TradeUpdate = JSON.parse(event.data);
        console.log('[v0] WebSocket message:', update.type);

        if (update.type === 'connected') {
          setIsConnected(true);
        } else if (update.type === 'trade' && update.data) {
          setTrades(prev => [update.data as Trade, ...prev].slice(0, 50));
          setLastUpdate(Date.now());
        } else if (update.type === 'heartbeat') {
          setLastUpdate(update.timestamp || Date.now());
        }
      } catch (error) {
        console.error('[v0] WebSocket message parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[v0] WebSocket error:', error);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      console.log('[v0] Closing WebSocket connection');
      eventSource.close();
      setIsConnected(false);
    };
  }, [marketId]);

  const clearTrades = useCallback(() => {
    setTrades([]);
  }, []);

  return {
    trades,
    isConnected,
    lastUpdate,
    clearTrades,
  };
}
