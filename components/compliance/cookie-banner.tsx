'use client';

import { useState, useEffect } from 'react';
import { SludgeButton } from '../sewer/sludge-button';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasAgeGate = localStorage.getItem('dxmarkets-age-gate');
    const cookieChoice = localStorage.getItem('dxmarkets-cookie-consent');
    
    // Only show after age gate is accepted and no cookie choice yet
    if (hasAgeGate && !cookieChoice) {
      // Delay to show after age gate modal closes
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleChoice = async (accepted: boolean) => {
    localStorage.setItem('dxmarkets-cookie-consent', accepted ? 'accepted' : 'declined');
    
    // Log consent to API
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cookie', accepted }),
      });
    } catch (error) {
      console.error('[v0] Cookie consent API error:', error);
    }
    
    setIsVisible(false);
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#12001a] border-t-2 border-[#ff00aa] shadow-[0_-4px_20px_rgba(255,0,170,0.5)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[#f0f0f0] text-sm flex-1 min-w-[250px]">
          This sewer uses cookies to track your degeneracy.{' '}
          <span className="text-[#a0a0ff]">Accept or decline.</span>
        </p>
        
        <div className="flex gap-3">
          <SludgeButton
            onClick={() => handleChoice(true)}
            variant="primary"
            className="px-6 py-2"
          >
            Accept Cookies
          </SludgeButton>
          
          <SludgeButton
            onClick={() => handleChoice(false)}
            variant="ghost"
            className="px-6 py-2"
          >
            Decline
          </SludgeButton>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#a0a0ff] hover:text-[#ff00aa] transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
