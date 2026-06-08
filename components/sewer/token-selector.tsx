'use client';

import { TOKEN_OPTIONS, type TokenType } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TokenSelectorProps {
  value: TokenType;
  onChange: (token: TokenType) => void;
  className?: string;
}

export function TokenSelector({ value, onChange, className }: TokenSelectorProps) {
  return (
    <div className={cn('flex gap-2 p-1 bg-[#12001a] rounded-lg border border-[#ff00aa]/30', className)}>
      {TOKEN_OPTIONS.map((token) => (
        <button
          key={token.value}
          onClick={() => onChange(token.value)}
          className={cn(
            'flex-1 px-4 py-2 rounded-md font-bold text-sm transition-all duration-200',
            'hover:scale-105',
            value === token.value
              ? 'bg-[#ff00aa] text-[#0a0012] shadow-[0_0_15px_rgba(255,0,170,0.8)]'
              : 'bg-transparent text-[#a0a0ff] hover:text-[#f0f0f0]'
          )}
          type="button"
        >
          <span className="mr-1">{token.icon}</span>
          {token.label}
        </button>
      ))}
    </div>
  );
}
