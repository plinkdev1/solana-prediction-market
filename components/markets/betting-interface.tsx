'use client';

import { useState } from 'react';
import { NeonCard } from '../sewer/neon-card';
import { SludgeButton } from '../sewer/sludge-button';
import { TokenSelector } from '../sewer/token-selector';
import { formatNumber } from '@/lib/format-utils';
import type { TokenType } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useWalletStore } from '@/lib/wallet-store';

interface BettingInterfaceProps {
  marketId: string;
  yesPool: number;
  noPool: number;
}

export function BettingInterface({ marketId, yesPool, noPool }: BettingInterfaceProps) {
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [tokenType, setTokenType] = useState<TokenType>('DATX');
  const { connected } = useWalletStore();

  const handlePlaceBet = () => {
    if (!connected) {
      alert('Connect wallet = enter sewer');
      return;
    }
    
    if (!selectedSide || !amount || parseFloat(amount) <= 0) {
      alert('Too much shit detected. Try again.');
      return;
    }

    // Mock bet placement (blockchain integration comes later)
    console.log('[v0] Mock bet placed:', {
      marketId,
      side: selectedSide,
      amount: parseFloat(amount),
      tokenType,
    });
    
    alert(`Flushed successfully. ${amount} ${tokenType} on ${selectedSide.toUpperCase()}`);
    setAmount('');
    setSelectedSide(null);
  };

  const potentialShares = amount ? (parseFloat(amount) / (selectedSide === 'yes' ? yesPool : noPool) * 100).toFixed(2) : '0';

  return (
    <NeonCard glowColor="pink" withDrip className="sticky top-24">
      <h3 className="text-xl font-[family-name:var(--font-display)] text-[#ff00aa] uppercase mb-6">
        Place Your Bet
      </h3>

      {/* Token Selector */}
      <div className="mb-6">
        <label className="block text-sm text-[#a0a0ff] mb-2 font-bold">Pay With</label>
        <TokenSelector value={tokenType} onChange={setTokenType} />
      </div>

      {/* Side Selector */}
      <div className="mb-6">
        <label className="block text-sm text-[#a0a0ff] mb-2 font-bold">Pick Side</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedSide('yes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedSide === 'yes'
                ? 'bg-[#00ffcc]/20 border-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.6)]'
                : 'bg-[#12001a] border-[#00ffcc]/30 hover:border-[#00ffcc]/60'
            }`}
          >
            <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
              selectedSide === 'yes' ? 'text-[#00ffcc]' : 'text-[#a0a0ff]'
            }`} />
            <div className={`font-bold ${
              selectedSide === 'yes' ? 'text-[#00ffcc]' : 'text-[#a0a0ff]'
            }`}>
              YES
            </div>
            <div className="text-xs text-[#a0a0ff] mt-1">
              Pool: {formatNumber(yesPool)}
            </div>
          </button>

          <button
            onClick={() => setSelectedSide('no')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedSide === 'no'
                ? 'bg-[#ff00aa]/20 border-[#ff00aa] shadow-[0_0_15px_rgba(255,0,170,0.6)]'
                : 'bg-[#12001a] border-[#ff00aa]/30 hover:border-[#ff00aa]/60'
            }`}
          >
            <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
              selectedSide === 'no' ? 'text-[#ff00aa]' : 'text-[#a0a0ff]'
            }`} />
            <div className={`font-bold ${
              selectedSide === 'no' ? 'text-[#ff00aa]' : 'text-[#a0a0ff]'
            }`}>
              NO
            </div>
            <div className="text-xs text-[#a0a0ff] mt-1">
              Pool: {formatNumber(noPool)}
            </div>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm text-[#a0a0ff] mb-2 font-bold">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 bg-[#12001a] border-2 border-[#ff00aa]/30 rounded-lg text-[#f0f0f0] placeholder:text-[#a0a0ff] focus:outline-none focus:border-[#ff00aa] transition-colors"
          min="0"
          step="0.01"
        />
        {amount && selectedSide && (
          <div className="text-xs text-[#00ffcc] mt-2">
            ≈ {potentialShares} shares
          </div>
        )}
      </div>

      {/* Place Bet Button */}
      <SludgeButton
        onClick={handlePlaceBet}
        variant="primary"
        className="w-full"
        disabled={!selectedSide || !amount || !connected}
      >
        {connected ? 'Flush the Bet' : 'Connect Wallet First'}
      </SludgeButton>

      {/* Fee Info */}
      <div className="mt-4 p-3 bg-[#12001a] rounded border border-[#ff00aa]/20 text-xs text-[#a0a0ff] space-y-1">
        <div className="flex justify-between">
          <span>Platform Fee:</span>
          <span className="text-[#ff00aa] font-bold">30%</span>
        </div>
        <div className="flex justify-between">
          <span>• Burned:</span>
          <span>20%</span>
        </div>
        <div className="flex justify-between">
          <span>• Treasury:</span>
          <span>7%</span>
        </div>
        <div className="flex justify-between">
          <span>• Team:</span>
          <span>3%</span>
        </div>
      </div>
    </NeonCard>
  );
}
