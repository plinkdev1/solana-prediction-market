'use client';

import { useState, useEffect } from 'react';
import { SewerModal } from '../sewer/sewer-modal';
import { SludgeButton } from '../sewer/sludge-button';
import { DrippingText } from '../sewer/dripping-text';
import Link from 'next/link';

export function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasAccepted = localStorage.getItem('dxmarkets-age-gate');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  if (!isMounted) return null;

  const handleAccept = async () => {
    localStorage.setItem('dxmarkets-age-gate', 'true');
    
    // Log consent to API
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'age_gate', accepted: true }),
      });
    } catch (error) {
      console.error('[v0] Age gate consent API error:', error);
    }
    
    setIsOpen(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <SewerModal
      isOpen={isOpen}
      onClose={() => {}}
      showCloseButton={false}
      className="max-w-md"
    >
      <div className="text-center space-y-6">
        <DrippingText as="h2" className="text-3xl" glowColor="pink">
          ENTER THE SEWER
        </DrippingText>
        
        <div className="space-y-3 text-[#f0f0f0] leading-relaxed">
          <p>You must be <strong className="text-[#ff00aa]">18+</strong> to enter.</p>
          <p>This is <strong>satirical entertainment only</strong>. No financial advice.</p>
          <p className="text-[#a0a0ff] text-sm">Everything is shit.</p>
        </div>

        <div className="space-y-3">
          <SludgeButton
            onClick={handleAccept}
            className="w-full"
            variant="primary"
          >
            I'm 18+ - Let Me In
          </SludgeButton>
          
          <SludgeButton
            onClick={handleDecline}
            className="w-full"
            variant="ghost"
          >
            Exit
          </SludgeButton>
        </div>

        <p className="text-xs text-[#a0a0ff] pt-4 border-t border-[#ff00aa]/20">
          By entering you agree to our{' '}
          <Link href="/disclaimers" className="text-[#00ffcc] hover:underline">
            Terms & Disclaimers
          </Link>
        </p>
      </div>
    </SewerModal>
  );
}
