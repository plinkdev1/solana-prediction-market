'use client';

import { use } from 'react';
import { MOCK_MARKETS, MOCK_COMMENTS } from '@/lib/mock-data';
import { formatNumber } from '@/lib/format-utils';
import { MARKET_TYPE_CONFIG } from '@/lib/constants';
import { CountdownTimer } from '@/components/markets/countdown-timer';
import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { OddsBar } from '@/components/sewer/odds-bar';
import { BettingInterface } from '@/components/markets/betting-interface';
import Link from 'next/link';
import { ArrowLeft, Clock, TrendingUp, Calendar, MessageSquare, Flame, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const market = MOCK_MARKETS.find((m) => m.id === id);
  
  if (!market) {
    notFound();
  }

  const comments = MOCK_COMMENTS.filter((c) => c.market_id === id);
  const resolutionDate = new Date(market.resolution_date);
  const daysUntil = Math.ceil((resolutionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const typeConfig = MARKET_TYPE_CONFIG[market.market_type];
  const TypeIcon = market.market_type === 'fast' ? Zap : Flame;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/bets"
          className="inline-flex items-center gap-2 text-[#00ffcc] hover:text-[#ff00aa] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <NeonCard glowColor={market.market_type === 'fast' ? 'cyan' : 'cyan'} withDrip>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Market Type Badge */}
                  <span 
                    className="text-xs px-3 py-1 rounded flex items-center gap-1 border uppercase font-bold"
                    style={{
                      backgroundColor: `${typeConfig.color}20`,
                      color: typeConfig.color,
                      borderColor: `${typeConfig.color}30`,
                    }}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {typeConfig.badgeText}
                  </span>
                  
                  <span className="text-xs px-3 py-1 rounded bg-[#ff00aa]/20 text-[#ff00aa] border border-[#ff00aa]/30 uppercase font-bold">
                    {market.category}
                  </span>
                  <span className="text-xs px-3 py-1 rounded bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30 uppercase font-bold">
                    {market.token_type}
                  </span>
                  <span className="text-xs px-3 py-1 rounded bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/30 uppercase font-bold">
                    {market.status}
                  </span>
                </div>

                <DrippingText as="h1" className="text-2xl md:text-3xl" glowColor="cyan">
                  {market.title}
                </DrippingText>

                <p className="text-[#f0f0f0] leading-relaxed">
                  {market.description}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#00ffcc]/30">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#a0a0ff] text-xs mb-1">
                      <TrendingUp className="w-4 h-4" />
                      Volume
                    </div>
                    <div className="text-lg font-bold text-[#ff00aa]">
                      {formatNumber(market.total_volume)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#a0a0ff] text-xs mb-1">
                      <Clock className="w-4 h-4" />
                      Time Left
                    </div>
                    <div className="text-lg font-bold text-[#00ffcc]">
                      {market.market_type === 'fast' && market.resolution_window_hours ? (
                        <CountdownTimer 
                          resolutionDate={market.resolution_date}
                          windowHours={market.resolution_window_hours}
                        />
                      ) : (
                        daysUntil > 0 ? `${daysUntil}d` : 'Soon'
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#a0a0ff] text-xs mb-1">
                      YES Pool
                    </div>
                    <div className="text-lg font-bold text-[#00ffcc]">
                      {formatNumber(market.yes_pool)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#a0a0ff] text-xs mb-1">
                      NO Pool
                    </div>
                    <div className="text-lg font-bold text-[#ff00aa]">
                      {formatNumber(market.no_pool)}
                    </div>
                  </div>
                </div>
              </div>
            </NeonCard>

            {/* Current Odds */}
            <NeonCard glowColor="pink">
              <h3 className="text-xl font-[family-name:var(--font-display)] text-[#ff00aa] uppercase mb-4">
                Current Odds
              </h3>
              <OddsBar
                yesPercentage={market.yes_probability}
                noPercentage={market.no_probability}
              />
              <div className="mt-4 flex items-center gap-2 text-xs text-[#a0a0ff]">
                <Calendar className="w-4 h-4" />
                <span>Resolves: {resolutionDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
            </NeonCard>

            {/* Comments Section */}
            <NeonCard glowColor="orange">
              <h3 className="text-xl font-[family-name:var(--font-display)] text-[#ff6600] uppercase mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Sewer Commentary ({comments.length})
              </h3>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-[#a0a0ff] italic text-center py-8">
                    No sightings of El Shito... yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-[#12001a] rounded-lg border border-[#ff6600]/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#00ffcc]">
                          {comment.user_wallet}
                        </span>
                        <span className="text-xs text-[#a0a0ff]">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#f0f0f0]">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </NeonCard>
          </div>

          {/* Betting Interface Sidebar */}
          <div className="lg:col-span-1">
            <BettingInterface
              marketId={market.id}
              yesPool={market.yes_pool}
              noPool={market.no_pool}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
