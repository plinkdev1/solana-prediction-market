'use client';

import { Market } from '@/lib/types';
import { NeonCard } from '../sewer/neon-card';
import { OddsBar } from '../sewer/odds-bar';
import { CountdownTimer } from './countdown-timer';
import { formatNumber } from '@/lib/format-utils';
import { MARKET_TYPE_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { Clock, TrendingUp, Flame, Zap } from 'lucide-react';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const resolutionDate = new Date(market.resolution_date);
  const daysUntil = Math.ceil((resolutionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  // Determine glow color based on market type
  const glowColor = market.market_type === 'fast' ? 'cyan' : 'pink';
  const typeConfig = MARKET_TYPE_CONFIG[market.market_type];
  const TypeIcon = market.market_type === 'fast' ? Zap : Flame;
  
  return (
    <Link href={`/markets/${market.id}`}>
      <NeonCard 
        glowColor={glowColor}
        withDrip 
        className="hover:scale-[1.02] transition-transform cursor-pointer h-full"
      >
        <div className="space-y-4">
          {/* Header with Market Type Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {/* Market Type Badge */}
                <span 
                  className="text-xs px-2 py-1 rounded flex items-center gap-1 border uppercase font-bold"
                  style={{
                    backgroundColor: `${typeConfig.color}20`,
                    color: typeConfig.color,
                    borderColor: `${typeConfig.color}30`,
                  }}
                >
                  <TypeIcon className="w-3 h-3" />
                  {typeConfig.badgeText}
                </span>
                
                {/* Category Badge */}
                <span className="text-xs px-2 py-1 rounded bg-[#ff00aa]/20 text-[#ff00aa] border border-[#ff00aa]/30 uppercase font-bold">
                  {market.category}
                </span>
                
                {/* Token Badge */}
                <span className="text-xs px-2 py-1 rounded bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30 uppercase font-bold">
                  {market.token_type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#f0f0f0] leading-tight line-clamp-2">
                {market.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#a0a0ff] line-clamp-2 leading-relaxed">
            {market.description}
          </p>

          {/* Odds Bar */}
          <OddsBar
            yesPercentage={market.yes_probability}
            noPercentage={market.no_probability}
          />

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-[#ff00aa]/20 text-xs">
            <div className="flex items-center gap-1 text-[#a0a0ff]">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold">{formatNumber(market.total_volume)}</span>
              <span>{market.token_type} vol</span>
            </div>
            
            {/* Countdown for Fast Markets, Static Time for Lore */}
            {market.market_type === 'fast' && market.resolution_window_hours ? (
              <CountdownTimer 
                resolutionDate={market.resolution_date}
                windowHours={market.resolution_window_hours}
              />
            ) : (
              <div className="flex items-center gap-1 text-[#a0a0ff]">
                <Clock className="w-4 h-4" />
                <span>
                  {daysUntil > 0 ? `${daysUntil}d left` : 'Closing soon'}
                </span>
              </div>
            )}
          </div>
        </div>
      </NeonCard>
    </Link>
  );
}
