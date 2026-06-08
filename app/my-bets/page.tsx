'use client';

import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { OddsBar } from '@/components/sewer/odds-bar';
import { formatNumber } from '@/lib/format-utils';
import { MOCK_POSITIONS } from '@/lib/mock-data';
import { useWalletStore } from '@/lib/wallet-store';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function MyBetsPage() {
  const { connected, publicKey } = useWalletStore();

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <NeonCard glowColor="pink" className="max-w-md text-center">
          <DrippingText as="h2" className="text-2xl mb-4" glowColor="pink">
            Connect Wallet
          </DrippingText>
          <p className="text-[#a0a0ff] mb-6">
            No wallet? Get Phantom. It's free and already full of shit.
          </p>
          <p className="text-xs text-[#a0a0ff] italic">
            Connect or lurk. Your choice, ngmi.
          </p>
        </NeonCard>
      </div>
    );
  }

  // Calculate totals
  const totalValue = MOCK_POSITIONS.reduce((sum, pos) => sum + pos.current_value, 0);
  const totalPnl = MOCK_POSITIONS.reduce((sum, pos) => sum + pos.pnl, 0);
  const openPositions = MOCK_POSITIONS.filter((p) => p.status === 'open').length;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <DrippingText as="h1" className="text-3xl md:text-4xl mb-2" glowColor="pink">
            My Bets
          </DrippingText>
          <p className="text-[#a0a0ff] text-sm font-mono">
            Wallet: {publicKey}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NeonCard glowColor="cyan" className="text-center">
            <div className="text-xs text-[#a0a0ff] uppercase mb-2">Total Value</div>
            <div className="text-3xl font-bold text-[#00ffcc]">
              {formatNumber(totalValue)}
            </div>
            <div className="text-xs text-[#a0a0ff] mt-1">Mixed Tokens</div>
          </NeonCard>
          
          <NeonCard glowColor="pink" className="text-center">
            <div className="text-xs text-[#a0a0ff] uppercase mb-2">Total P&L</div>
            <div className={`text-3xl font-bold ${totalPnl >= 0 ? 'text-[#00ffcc]' : 'text-[#ff00aa]'}`}>
              {totalPnl >= 0 ? '+' : ''}{formatNumber(totalPnl)}
            </div>
            <div className="text-xs text-[#a0a0ff] mt-1">
              {totalPnl >= 0 ? 'Winning' : 'Losing'}
            </div>
          </NeonCard>
          
          <NeonCard glowColor="orange" className="text-center">
            <div className="text-xs text-[#a0a0ff] uppercase mb-2">Open Positions</div>
            <div className="text-3xl font-bold text-[#ff6600]">
              {openPositions}
            </div>
            <div className="text-xs text-[#a0a0ff] mt-1">Active Bets</div>
          </NeonCard>
        </div>

        {/* Positions List */}
        <div>
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-[#ff00aa] uppercase mb-6">
            Active Positions
          </h2>

          {MOCK_POSITIONS.length === 0 ? (
            <NeonCard glowColor="pink" className="text-center py-12">
              <p className="text-[#a0a0ff] text-lg italic mb-4">
                Swamp's dry today. Burn more.
              </p>
              <Link
                href="/bets"
                className="text-[#00ffcc] hover:text-[#ff00aa] transition-colors underline"
              >
                Browse Markets
              </Link>
            </NeonCard>
          ) : (
            <div className="space-y-4">
              {MOCK_POSITIONS.map((position) => (
                <NeonCard key={position.id} glowColor="pink" withDrip>
                  <Link href={`/markets/${position.market_id}`}>
                    <div className="space-y-4 hover:opacity-90 transition-opacity">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                              position.side === 'yes'
                                ? 'bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30'
                                : 'bg-[#ff00aa]/20 text-[#ff00aa] border border-[#ff00aa]/30'
                            }`}>
                              {position.side === 'yes' ? (
                                <TrendingUp className="inline w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="inline w-3 h-3 mr-1" />
                              )}
                              {position.side}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/30 uppercase font-bold">
                              {position.token_type}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#f0f0f0] leading-tight">
                            {position.market_title}
                          </h3>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#a0a0ff] flex-shrink-0" />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-[#a0a0ff] text-xs mb-1">Amount</div>
                          <div className="text-[#f0f0f0] font-bold">
                            {position.amount} {position.token_type}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#a0a0ff] text-xs mb-1">Shares</div>
                          <div className="text-[#f0f0f0] font-bold">
                            {position.shares.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#a0a0ff] text-xs mb-1">Current Value</div>
                          <div className="text-[#f0f0f0] font-bold">
                            {formatNumber(position.current_value)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#a0a0ff] text-xs mb-1">P&L</div>
                          <div className={`font-bold ${
                            position.pnl >= 0 ? 'text-[#00ffcc]' : 'text-[#ff00aa]'
                          }`}>
                            {position.pnl >= 0 ? '+' : ''}{formatNumber(position.pnl)}
                          </div>
                        </div>
                      </div>

                      {/* Mini Odds Bar */}
                      <OddsBar
                        yesPercentage={position.entry_price * 100}
                        noPercentage={(1 - position.entry_price) * 100}
                        showLabels={false}
                      />
                    </div>
                  </Link>
                </NeonCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
