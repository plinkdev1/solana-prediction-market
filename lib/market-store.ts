import { create } from 'zustand';
import type { Market, MarketCategory, MarketStatus } from './types';

interface MarketFilters {
  category?: MarketCategory;
  status?: MarketStatus;
  search?: string;
}

interface MarketState {
  markets: Market[];
  activeMarket: Market | null;
  filters: MarketFilters;
  loading: boolean;
  setMarkets: (markets: Market[]) => void;
  setActiveMarket: (market: Market | null) => void;
  setFilters: (filters: MarketFilters) => void;
  setLoading: (loading: boolean) => void;
  clearFilters: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  markets: [],
  activeMarket: null,
  filters: {},
  loading: false,
  setMarkets: (markets) => set({ markets }),
  setActiveMarket: (market) => set({ activeMarket: market }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (loading) => set({ loading }),
  clearFilters: () => set({ filters: {} }),
}));
