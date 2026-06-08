'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { MarketCard } from '@/components/markets/market-card';
import { MarketTypeToggle } from '@/components/markets/market-type-toggle';
import { formatNumber } from '@/lib/format-utils';
import { MOCK_MARKETS, MOCK_TREASURY } from '@/lib/mock-data';
import { CATEGORY_TABS } from '@/lib/constants';
import type { MarketCategory, MarketType } from '@/lib/types';
import { Flame, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BetsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MarketCategory | 'all'>('all');
  const [marketType, setMarketType] = useState<MarketType | 'all'>('all');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter markets
  const filteredMarkets = useMemo(() => {
    return MOCK_MARKETS.filter((market) => {
      const matchesSearch =
        searchQuery === '' ||
        market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || market.category === activeTab;
      const matchesType = marketType === 'all' || market.market_type === marketType;
      return matchesSearch && matchesTab && matchesType;
    });
  }, [searchQuery, activeTab, marketType]);

  // Count per category for badge
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_MARKETS.length };
    for (const m of MOCK_MARKETS) {
      if (marketType === 'all' || m.market_type === marketType) {
        counts[m.category] = (counts[m.category] || 0) + 1;
      }
    }
    return counts;
  }, [marketType]);

  // Count lore and fast markets
  const loreCount = useMemo(() => MOCK_MARKETS.filter(m => m.market_type === 'lore').length, []);
  const fastCount = useMemo(() => MOCK_MARKETS.filter(m => m.market_type === 'fast').length, []);

  const scrollTabs = (dir: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-12 px-4 border-b-2 border-[#ff00aa]/30">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <DrippingText as="h1" className="text-4xl md:text-6xl" glowColor="pink" withDrip>
            SEWER BETS ON SOLANA
          </DrippingText>
          <p className="text-xl text-[#a0a0ff] max-w-2xl mx-auto leading-relaxed">
            Satirical prediction markets. Multi-token betting. Everything is shit.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <NeonCard glowColor="cyan" className="text-center">
              <div className="text-2xl font-bold text-[#00ffcc]">
                {isMounted ? formatNumber(MOCK_TREASURY.total_volume) : '---'}
              </div>
              <div className="text-xs text-[#a0a0ff] uppercase mt-1">Total Volume</div>
            </NeonCard>
            <NeonCard glowColor="pink" className="text-center">
              <div className="text-2xl font-bold text-[#ff00aa]">{MOCK_MARKETS.length}</div>
              <div className="text-xs text-[#a0a0ff] uppercase mt-1">Active Markets</div>
            </NeonCard>
            <NeonCard glowColor="orange" className="text-center">
              <div className="text-2xl font-bold text-[#ff6600]">
                {isMounted ? formatNumber(MOCK_TREASURY.total_burned) : '---'}
              </div>
              <div className="text-xs text-[#a0a0ff] uppercase mt-1">$DATX Burned</div>
            </NeonCard>
            <NeonCard glowColor="pink" className="text-center">
              <div className="text-2xl font-bold text-[#ff00aa]">{MOCK_TREASURY.markets_resolved}</div>
              <div className="text-xs text-[#a0a0ff] uppercase mt-1">Resolved</div>
            </NeonCard>
          </div>
        </div>
      </section>

      {/* Search + Tabs */}
      <section className="py-6 px-4 border-b border-[#ff00aa]/20 sticky top-0 z-20 bg-[#0a0012]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Market Type Toggle */}
          <MarketTypeToggle 
            activeType={marketType} 
            onTypeChange={setMarketType}
            loreCount={loreCount}
            fastCount={fastCount}
          />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0ff]" />
            <input
              type="text"
              placeholder="Search all 64 sewer bets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#12001a] border-2 border-[#ff00aa]/30 rounded-lg text-[#f0f0f0] placeholder:text-[#a0a0ff]/60 focus:outline-none focus:border-[#ff00aa] transition-colors"
            />
          </div>

          {/* Scrollable Tabs */}
          <div className="relative flex items-center">
            <button
              onClick={() => scrollTabs('left')}
              className="flex-shrink-0 p-1 text-[#a0a0ff] hover:text-[#ff00aa] transition-colors md:hidden"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={tabsRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 px-1 py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                const count = countByCategory[tab.value] || 0;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
                    style={{
                      background: isActive ? tab.color : '#12001a',
                      color: isActive ? '#0a0012' : '#a0a0ff',
                      border: `1px solid ${isActive ? tab.color : 'rgba(255,0,170,0.3)'}`,
                      boxShadow: isActive ? `0 0 12px ${tab.color}60` : 'none',
                    }}
                  >
                    {tab.label}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(255,0,170,0.15)',
                        color: isActive ? '#0a0012' : tab.color,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollTabs('right')}
              className="flex-shrink-0 p-1 text-[#a0a0ff] hover:text-[#ff00aa] transition-colors md:hidden"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-[#ff00aa] uppercase">
              <Flame className="inline w-6 h-6 mr-2" />
              {activeTab === 'all'
                ? 'All Sewer Bets'
                : CATEGORY_TABS.find((t) => t.value === activeTab)?.label + ' Bets'}
            </h2>
            <div className="text-sm text-[#a0a0ff]">{filteredMarkets.length} markets</div>
          </div>

          {filteredMarkets.length === 0 ? (
            <NeonCard glowColor="pink" className="text-center py-12">
              <p className="text-[#a0a0ff] text-lg italic">
                No bets match your search. Try another tab or stop being picky.
              </p>
            </NeonCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
