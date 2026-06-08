'use client';

import { cn } from '@/lib/utils';

interface OddsBarProps {
  yesPercentage: number;
  noPercentage: number;
  className?: string;
  showLabels?: boolean;
}

export function OddsBar({ 
  yesPercentage, 
  noPercentage, 
  className,
  showLabels = true,
}: OddsBarProps) {
  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex justify-between text-xs mb-1 font-bold">
          <span className="text-[#00ffcc]">YES {yesPercentage}%</span>
          <span className="text-[#ff00aa]">NO {noPercentage}%</span>
        </div>
      )}
      <div className="relative h-6 bg-[#12001a] rounded-full overflow-hidden border border-[#ff00aa]/30">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#00ffcc]/80 transition-all duration-500 ease-out"
          style={{ width: `${yesPercentage}%` }}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,255,204,0.8)]" />
        </div>
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#ff00aa] to-[#ff00aa]/80 transition-all duration-500 ease-out"
          style={{ width: `${noPercentage}%` }}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(255,0,170,0.8)]" />
        </div>
      </div>
    </div>
  );
}
