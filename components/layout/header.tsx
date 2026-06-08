'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DrippingText } from '../sewer/dripping-text';
import { SludgeButton } from '../sewer/sludge-button';
import { useWalletStore } from '@/lib/wallet-store';
import { MOCK_MARKETS } from '@/lib/mock-data';
import { Wallet, Menu, X, Search, Zap } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { label: 'Markets', href: '/bets' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Social', href: '/social' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export function Header() {
  const { connected, publicKey, connect } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsMounted(true); }, []);

  const handleConnect = () => { connect('7xKXt...3vZw'); };

  const liveCount = useMemo(
    () => MOCK_MARKETS.filter(m => m.status === 'active' && m.market_type === 'fast').length,
    []
  );

  return (
    <header
      className="sticky top-0 z-30 bg-[#0a0012]/95 backdrop-blur-md border-b border-[rgba(255,0,170,0.25)]"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/bets" className="flex items-center gap-2 shrink-0">
          <DrippingText as="span" className="text-xl md:text-2xl font-display" glowColor="pink">
            DXMarkets
          </DrippingText>
          <span className="hidden lg:inline text-xs text-[#a0a0ff] italic">
            $DATX on Solana
          </span>
        </Link>

        {/* Primary Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'px-4 py-1.5 text-sm font-bold rounded transition-colors',
                  active
                    ? 'text-[#ff00aa]'
                    : 'text-[#f0f0f0] hover:text-[#ff00aa]'
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {/* LIVE badge */}
          <Link
            href="/bets?type=fast"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold text-[#ff3333] hover:bg-[#ff3333]/10 transition-colors"
          >
            <span className="live-dot" />
            LIVE
            <span className="text-xs font-mono bg-[#ff3333]/20 px-1.5 py-0.5 rounded">
              {isMounted ? liveCount : '—'}
            </span>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[#a0a0ff] hover:text-[#ff00aa] transition-colors"
            aria-label="Search markets"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wallet / Connect */}
          {isMounted && connected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#12001a] rounded border border-[#00ffcc] text-[#00ffcc] text-xs font-mono">
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{publicKey}</span>
            </div>
          ) : isMounted ? (
            <SludgeButton onClick={handleConnect} variant="primary" className="px-4 py-1.5 text-sm">
              <Wallet className="w-3.5 h-3.5 inline mr-1.5" />
              Connect
            </SludgeButton>
          ) : (
            <div className="px-4 py-1.5 text-sm opacity-40">
              <Wallet className="w-3.5 h-3.5 inline" />
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#ff00aa]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0012]/98 border-t border-[rgba(255,0,170,0.2)] px-4 py-4 space-y-3">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-[#f0f0f0] hover:text-[#ff00aa] font-bold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bets?type=fast"
            className="flex items-center gap-2 text-[#ff3333] font-bold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="live-dot" />
            LIVE ({isMounted ? liveCount : '—'})
          </Link>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0012]/98 border-b border-[rgba(255,0,170,0.25)] px-4 py-3 z-40">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a0ff]" />
            <input
              autoFocus
              type="text"
              placeholder="Search markets, categories, tokens..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#12001a] border border-[rgba(255,0,170,0.25)] rounded text-sm text-[#f0f0f0] placeholder:text-[#5a5a8a] focus:outline-none focus:border-[#ff00aa]"
              onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
