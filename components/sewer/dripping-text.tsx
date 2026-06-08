'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface DrippingTextProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  glowColor?: 'pink' | 'cyan' | 'orange';
  withDrip?: boolean;
}

export function DrippingText({
  children,
  className,
  as: Component = 'h1',
  glowColor = 'pink',
  withDrip = false,
  ...props
}: DrippingTextProps) {
  const glowStyles = {
    pink: 'text-[#ff00aa] [text-shadow:0_0_10px_rgba(255,0,170,0.8),0_0_20px_rgba(255,0,170,0.5)]',
    cyan: 'text-[#00ffcc] [text-shadow:0_0_10px_rgba(0,255,204,0.8),0_0_20px_rgba(0,255,204,0.5)]',
    orange: 'text-[#ff6600] [text-shadow:0_0_10px_rgba(255,102,0,0.8),0_0_20px_rgba(255,102,0,0.5)]',
  };

  return (
    <Component
      className={cn(
        'font-[family-name:var(--font-display)] uppercase tracking-wide relative',
        glowStyles[glowColor],
        withDrip && 'hover:animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
