'use client';

import { useState } from 'react';
import { Flame, Zap } from 'lucide-react';
import { MARKET_TYPE_CONFIG } from '@/lib/constants';
import type { MarketType } from '@/lib/types';

interface MarketTypeToggleProps {
  activeType: MarketType;
  onTypeChange: (type: MarketType) => void;
  loreCount: number;
  fastCount: number;
}

export function MarketTypeToggle({
  activeType,
  onTypeChange,
  loreCount,
  fastCount,
}: MarketTypeToggleProps) {
  const loreConfig = MARKET_TYPE_CONFIG.lore;
  const fastConfig = MARKET_TYPE_CONFIG.fast;

  return (
    <div className="w-full space-y-4 px-4 py-6 md:px-8">
      {/* Toggle Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
        {/* Sewer Lore Button */}
        <button
          onClick={() => onTypeChange('lore')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
            activeType === 'lore'
              ? 'bg-[#ff00aa] border-[#ff00aa] text-black shadow-lg shadow-[#ff00aa]/50'
              : 'bg-transparent border-[#ff00aa] text-[#ff00aa] hover:shadow-md hover:shadow-[#ff00aa]/30'
          }`}
        >
          <Flame className="w-5 h-5" />
          Sewer Lore
          <span className="ml-1 text-xs opacity-80">({loreCount})</span>
        </button>

        {/* Flash Bets Button */}
        <button
          onClick={() => onTypeChange('fast')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
            activeType === 'fast'
              ? 'bg-[#00ffcc] border-[#00ffcc] text-black shadow-lg shadow-[#00ffcc]/50'
              : 'bg-transparent border-[#00ffcc] text-[#00ffcc] hover:shadow-md hover:shadow-[#00ffcc]/30'
          }`}
        >
          <Zap className="w-5 h-5" />
          Flash Bets
          <span className="ml-1 text-xs opacity-80">({fastCount})</span>
        </button>
      </div>

      {/* Description Text */}
      <div className="max-w-2xl mx-auto">
        <p className={`text-xs sm:text-sm text-center transition-colors duration-200 ${
          activeType === 'lore' ? 'text-[#ff00aa]' : 'text-[#00ffcc]'
        }`}>
          {activeType === 'lore'
            ? loreConfig.description
            : fastConfig.description}
        </p>
      </div>
    </div>
  );
}
