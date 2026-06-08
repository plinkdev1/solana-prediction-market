'use client';

import { useEffect } from 'react';
import { DrippingText } from '@/components/sewer/dripping-text';
import { SludgeButton } from '@/components/sewer/sludge-button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[v0] DXMarkets error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <DrippingText as="h1" className="text-4xl" glowColor="pink">
          SEWER OVERFLOW
        </DrippingText>
        
        <p className="text-[#a0a0ff] leading-relaxed">
          Something broke in the pipes. Everything is shit anyway.
        </p>
        
        {error.message && (
          <p className="text-sm text-[#ff6600] font-mono bg-[#12001a] p-4 rounded border border-[#ff6600]/30">
            {error.message}
          </p>
        )}
        
        <SludgeButton onClick={reset} variant="primary">
          Try Again
        </SludgeButton>
      </div>
    </div>
  );
}
