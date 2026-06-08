'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface SludgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  withDrip?: boolean;
}

export const SludgeButton = forwardRef<HTMLButtonElement, SludgeButtonProps>(
  ({ children, className, variant = 'primary', withDrip = true, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-[#ff00aa] text-[#0a0012] hover:bg-[#ff33bb] hover:shadow-[0_0_20px_rgba(255,0,170,0.8)] disabled:bg-[#660044] disabled:text-[#330022]',
      secondary: 'bg-[#00ffcc] text-[#0a0012] hover:bg-[#33ffdd] hover:shadow-[0_0_20px_rgba(0,255,204,0.8)] disabled:bg-[#006655] disabled:text-[#003322]',
      ghost: 'bg-transparent text-[#ff00aa] border-2 border-[#ff00aa] hover:bg-[#ff00aa]/10 hover:shadow-[0_0_15px_rgba(255,0,170,0.5)]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 font-bold rounded-md transition-all duration-300 overflow-hidden',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantStyles[variant],
          withDrip && !disabled && 'group',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
        {withDrip && !disabled && (
          <span className="absolute top-0 right-2 w-1 h-0 bg-gradient-to-b from-current to-transparent opacity-0 group-hover:animate-sludge-drip group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    );
  }
);

SludgeButton.displayName = 'SludgeButton';
