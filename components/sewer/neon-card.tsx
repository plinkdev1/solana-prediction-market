'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface NeonCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: 'pink' | 'cyan' | 'orange';
  withDrip?: boolean;
}

export function NeonCard({ 
  children, 
  className,
  glowColor = 'pink',
  withDrip = false,
  ...props 
}: NeonCardProps) {
  const glowStyles = {
    pink: 'shadow-[0_0_20px_rgba(255,0,170,0.5)] border-[#ff00aa] hover:shadow-[0_0_30px_rgba(255,0,170,0.8)]',
    cyan: 'shadow-[0_0_20px_rgba(0,255,204,0.5)] border-[#00ffcc] hover:shadow-[0_0_30px_rgba(0,255,204,0.8)]',
    orange: 'shadow-[0_0_20px_rgba(255,102,0,0.5)] border-[#ff6600] hover:shadow-[0_0_30px_rgba(255,102,0,0.8)]',
  };

  return (
    <div
      className={cn(
        'relative bg-[#0a0012] border-2 rounded-lg p-6 transition-all duration-300',
        glowStyles[glowColor],
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
      {withDrip && (
        <div className="absolute top-0 right-4 w-1 h-0 bg-gradient-to-b from-[#ff00aa] to-transparent animate-sludge-drip" />
      )}
    </div>
  );
}
