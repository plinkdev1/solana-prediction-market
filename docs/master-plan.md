# DXMarkets - Sewer Bets on Solana

## Master Build Plan

> "The Prediction Market That Knows Everything Is Shit"
> Satirical prediction markets in the DatXit ecosystem. Bet on the flush. Lose and feed the Hole.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Design System & Lore Rules](#3-design-system--lore-rules)
4. [Phase 0 - Foundation & Environment](#4-phase-0---foundation--environment)
5. [Phase 1 - Mock Frontend Teaser](#5-phase-1---mock-frontend-teaser)
6. [Phase 2 - Core Technical Implementation](#6-phase-2---core-technical-implementation)
7. [Phase 3 - Governance & Community](#7-phase-3---governance--community)
8. [Phase 4 - Omnichain & Expansions](#8-phase-4---omnichain--expansions)
9. [Phase 5 - Optimization & Monetization](#9-phase-5---optimization--monetization)
10. [Dependency Graph](#10-dependency-graph)
11. [Code Skeletons](#11-code-skeletons)
12. [Risks & Mitigations](#12-risks--mitigations)
13. [Microcopy & Lore Arsenal](#13-microcopy--lore-arsenal)

---

## 1. Project Overview

**Product:** DXMarkets (Sewer Bets on Solana)
**Ecosystem:** DatXit ($DATX memecoin, El Shito mascot, Reserve Hole burn sink)
**Positioning:** "Polymarket for people who hate Polymarket" - 100% satirical, meme-driven, lore-tied prediction markets.

**Core Loop:**
1. User discovers satirical market ("Will El Shito tag a bank?")
2. Bets $DATX / SOL / USDC on Yes/No outcome
3. Market resolves via multisig/community vote
4. Winners get 90% pot; 10% rake (7% treasury, 3% team)
5. 10-20% of losing pool burned to Reserve Hole (deflationary)
6. Leaderboard tracks "Shittiest Oracles"

**Multi-Token Support:** $DATX (native SPL), SOL (native), USDC (SPL) - swapped via Nitrolite for seamless liquidity.

---

## 2. Architecture Summary

```
+------------------------------------------------------+
|              USER-FACING LAYER ("Neon Lounge")        |
|  Next.js 16 + shadcn/ui + Tailwind + Zustand         |
|  Solana Wallet Adapter (Phantom/Solflare/Ledger)      |
+------------------------------------------------------+
          |                    |                    |
          v                    v                    v
+------------------+  +------------------+  +------------------+
|   LOGIC LAYER    |  |   DATA LAYER     |  |  BLOCKCHAIN LAYER|
| ("Escrow Flush") |  | ("Reserve Hole") |  | ("Sewer Pipes")  |
|                  |  |                  |  |                  |
| Vercel Edge Fns  |  | Supabase Postgres|  | Anchor (Rust)    |
| REST API /markets|  | + pgvector (RAG) |  | - Escrow program |
| WS live feed     |  | + Realtime       |  | - Market program |
| Cron (resets)    |  | Upstash Redis    |  | - Burns program  |
+------------------+  +------------------+  +------------------+
          |                    |                    |
          +--------------------+--------------------+
                               |
                    +---------------------+
                    |     AI LAYER        |
                    | ("El Shito's Brain")|
                    |                     |
                    | Vercel AI SDK 6     |
                    | RAG (pgvector)      |
                    | Market gen / lore   |
                    +---------------------+
```

**Tech Stack:**
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, shadcn/ui, Tailwind, Zustand | UI, state, responsive neon theme |
| Wallet | @solana/wallet-adapter-react + adapters | Phantom/Solflare/Ledger connect |
| Backend | Vercel Edge Functions, Serverless API | REST + WS endpoints |
| Database | Supabase (Postgres 16 + pgvector + Realtime) | Markets, bets, users, RAG vectors |
| Cache | Upstash Redis | Leaderboards, rate limiting |
| Contracts | Anchor v0.30+ (Rust on Solana) | Escrow, markets, burns, payouts |
| AI | Vercel AI SDK 6, Groq/OpenAI | RAG for lore/market gen |
| Oracles | Multisig MVP, Switchboard VRF (future) | Resolution, randomness |

---

## 3. Design System & Lore Rules

> **These rules are MANDATORY for every page, component, and modal. No deviations.**

### Color Palette (5 colors max)
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0a0012` to `#12001a` | Deep purple-black sewer depths |
| `--accent-neon` | `#ff00aa` | Hot pink neon glows, borders, CTAs |
| `--accent-cyan` | `#00ffcc` | Toxic cyan for drips, highlights |
| `--accent-sludge` | `#ff6600` | Burnt orange for sludge highlights |
| `--sludge-brown` | `#4a2c0f` to `#8b4513` | Glossy poop/sludge gradients |
| `--text-primary` | `#f0f0f0` | Main readable text |
| `--text-secondary` | `#a0a0ff` | Muted secondary text |

### Typography
- **Headings:** "Bangers" (Google Fonts) - distressed graffiti spray-paint style, drip effects on hover
- **Body:** Inter or Geist Sans - clean, readable white/gray

### UI Component Rules
- **Cards:** Black base, pink neon border glow (`box-shadow: 0 0 20px #ff00aa80`), dripping sludge CSS pseudo-element on hover
- **Buttons:** Hot pink bg, black text, dripping hover animation
- **Modals:** Dark glassmorphism (`#12001a80`), neon rim, sludge drip top edge
- **Backgrounds:** Every page has subtle dripping soft-serve sludge effects, toilet paper trails in borders, sewer pipe dividers

### Lore Integration Rules
- El Shito cameos in corners (bandana eyes peeking)
- Plunger icons for action buttons
- Double-meaning satirical text ("Flush the Bet" = resolve + lore flush)
- Losing bets trigger sludge burn animations
- Randomly scatter microcopy phrases (tooltips, loaders, empty states) - 3-8 per page max
- Adult satirical tone: dark, ironic, thug-degen energy, provocative silhouettes (tasteful) in backgrounds

### Compliance Visual Rules
- All pages include footer links to privacy/disclaimers
- +18 modal uses same neon borders but toned-down text
- Cookie banner in sewer theme

---

## 4. Phase 0 - Foundation & Environment

**Timeline:** 0-2 weeks
**Cost:** $0-$500
**Focus:** Dev environment, design system, compliance scaffolding

### Tasks

#### P0-T1: Project Scaffolding & Design System
**Type:** Frontend
**Dependencies:** None
**Deliverables:**
- Global CSS variables (palette, typography, spacing)
- Tailwind config with sewer theme tokens
- Base component library (NeonCard, SludgeButton, SewerModal, DrippingText)
- Bangers font import + font-sans/font-serif config in layout.tsx
- Responsive breakpoints confirmed

```tsx
// tailwind.config.ts - Theme Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        sewer: {
          bg: '#0a0012',
          'bg-deep': '#12001a',
          neon: '#ff00aa',
          cyan: '#00ffcc',
          orange: '#ff6600',
          sludge: '#4a2c0f',
          'sludge-light': '#8b4513',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        display: ['var(--font-bangers)'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(255, 0, 170, 0.5)',
        'neon-strong': '0 0 40px rgba(255, 0, 170, 0.7)',
        cyan: '0 0 20px rgba(0, 255, 204, 0.5)',
      },
      keyframes: {
        drip: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 170, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 170, 0.8)' },
        },
      },
      animation: {
        drip: 'drip 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
};
```

#### P0-T2: Supabase Schema Setup
**Type:** Backend / Database
**Dependencies:** Supabase integration connected
**Deliverables:**
- Core tables: `markets`, `positions`, `users`, `bets`, `leaderboards`, `consent_logs`, `age_gates`, `treasury_logs`
- RLS policies enabled
- pgvector extension for RAG
- `lore_embeddings` table for AI

```sql
-- Core schema for DXMarkets
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'satirical',
  end_timestamp TIMESTAMPTZ NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  outcome BOOLEAN,
  yes_pool BIGINT DEFAULT 0,
  no_pool BIGINT DEFAULT 0,
  total_volume BIGINT DEFAULT 0,
  burn_amount BIGINT DEFAULT 0,
  token_type TEXT DEFAULT 'DATX', -- 'DATX' | 'SOL' | 'USDC'
  status TEXT DEFAULT 'active', -- 'active' | 'closed' | 'resolved' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  market_id UUID REFERENCES markets(id),
  side BOOLEAN NOT NULL, -- true = Yes, false = No
  amount BIGINT NOT NULL,
  token_type TEXT DEFAULT 'DATX',
  tx_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  wallet TEXT PRIMARY KEY,
  display_name TEXT,
  total_bets INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  total_volume BIGINT DEFAULT 0,
  total_pnl BIGINT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leaderboards (
  wallet TEXT PRIMARY KEY REFERENCES users(wallet),
  win_rate NUMERIC DEFAULT 0,
  profit BIGINT DEFAULT 0,
  rank INT,
  period TEXT DEFAULT 'all-time' -- 'weekly' | 'monthly' | 'all-time'
);

CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT,
  consent_type TEXT NOT NULL, -- 'age_gate' | 'cookie' | 'tos'
  accepted BOOLEAN NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE treasury_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id),
  amount BIGINT NOT NULL,
  type TEXT NOT NULL, -- 'rake' | 'burn' | 'payout' | 'team'
  tx_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lore_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### P0-T3: Wallet Connection Provider
**Type:** Frontend / Integration
**Dependencies:** P0-T1
**Deliverables:**
- `providers.tsx` with ConnectionProvider, WalletProvider, WalletModalProvider
- `wallet-store.ts` Zustand store (connected, address, balances, mockMode)
- Multi-token balance fetching ($DATX SPL, SOL native, USDC SPL)
- Mock mode toggle for dev

```tsx
// lib/wallet-store.ts - Zustand Store Skeleton
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  connected: boolean;
  address: string | null;
  solBalance: number;
  datxBalance: number;
  usdcBalance: number;
  mockMode: boolean;
  network: 'devnet' | 'mainnet-beta';
  // Actions
  setConnected: (connected: boolean, address?: string) => void;
  setBalances: (sol: number, datx: number, usdc: number) => void;
  toggleMockMode: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      address: null,
      solBalance: 0,
      datxBalance: 0,
      usdcBalance: 0,
      mockMode: true,
      network: 'devnet',
      setConnected: (connected, address) =>
        set({ connected, address: address ?? null }),
      setBalances: (sol, datx, usdc) =>
        set({ solBalance: sol, datxBalance: datx, usdcBalance: usdc }),
      toggleMockMode: () =>
        set((state) => ({ mockMode: !state.mockMode })),
      disconnect: () =>
        set({ connected: false, address: null, solBalance: 0, datxBalance: 0, usdcBalance: 0 }),
    }),
    { name: 'dxmarkets-wallet' }
  )
);
```

#### P0-T4: Compliance Scaffolding
**Type:** Frontend / Legal
**Dependencies:** P0-T1
**Deliverables:**
- +18 age gate modal (logs to Supabase `consent_logs`)
- Cookie consent banner (sewer themed)
- `/privacy` page (GDPR data export/delete)
- `/disclaimers` page (entertainment only, no financial advice)
- Footer with compliance links
- Geo-blocking middleware for restricted regions

```tsx
// components/age-gate-modal.tsx - Skeleton
'use client';

import { useState, useEffect } from 'react';

export function AgeGateModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('age-gate-accepted');
    if (!accepted) setShow(true);
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('age-gate-accepted', 'true');
    // Log to Supabase consent_logs
    await fetch('/api/consent', {
      method: 'POST',
      body: JSON.stringify({ type: 'age_gate', accepted: true }),
    });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sewer-bg/90">
      <div className="border border-sewer-neon/50 bg-sewer-bg-deep p-8 rounded-lg shadow-neon max-w-md text-center">
        <h2 className="font-display text-3xl text-sewer-neon mb-4">
          ENTER THE SEWER
        </h2>
        <p className="text-foreground/70 mb-6">
          You must be 18+ to enter. This is satirical entertainment only.
          No financial advice. Everything is shit.
        </p>
        <button
          onClick={handleAccept}
          className="bg-sewer-neon text-black font-bold px-8 py-3 rounded hover:shadow-neon-strong transition-all"
        >
          I'm 18+ — Let Me In
        </button>
        <p className="text-xs text-foreground/40 mt-4">
          By entering you agree to our Terms & Disclaimers.
        </p>
      </div>
    </div>
  );
}
```

---

## 5. Phase 1 - Mock Frontend Teaser

**Timeline:** Weeks 2-6 (1 month)
**Cost:** $0 (agent/you build)
**Focus:** Build hype with visually compelling but non-functional UI
**Dependencies:** Phase 0 complete

### Tasks

#### P1-T1: Home/Dashboard Page (`/bets`)
**Type:** Frontend
**Dependencies:** P0-T1 (design system)
**Deliverables:**
- Hero section: "SEWER BETS - Bet on the Shit" with neon glow + drip effects
- Active markets grid (8-10 mock satirical markets)
- Each card: title, description, Yes/No odds bars, volume, burn counter, time left, "Bet Soon" disabled button
- Your bets sidebar summary
- Leaderboard preview
- "Create Market" CTA button
- Neon theme, provocative silhouettes in BG

**Mock Market Data:**
```typescript
// lib/mock-data.ts
export const MOCK_MARKETS = [
  {
    id: 'el-shito-bank-tag',
    title: 'Will El Shito tag a bank this month?',
    description: 'The bandana-wearing menace has been spotted near financial districts...',
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 125000,
    burnCounter: 12500,
    endDate: '2026-03-15T00:00:00Z',
    category: 'el-shito',
    status: 'active',
  },
  {
    id: 'next-rug-pull',
    title: 'Next major rug pull in < 7 days?',
    description: 'CT never learns. Another project, another exit scam incoming...',
    yesPrice: 0.71,
    noPrice: 0.29,
    volume: 340000,
    burnCounter: 34000,
    endDate: '2026-02-24T00:00:00Z',
    category: 'crypto',
    status: 'active',
  },
  {
    id: 'xitmas-argument',
    title: 'Xitmas dinner ends in a family argument?',
    description: 'Uncle Dave + politics + wine = guaranteed meltdown...',
    yesPrice: 0.89,
    noPrice: 0.11,
    volume: 89000,
    burnCounter: 8900,
    endDate: '2026-12-26T00:00:00Z',
    category: 'xitmas',
    status: 'active',
  },
  {
    id: 'politician-lie',
    title: 'A politician will be caught lying on live TV this week?',
    description: 'The bar is underground. And we are in the sewer.',
    yesPrice: 0.95,
    noPrice: 0.05,
    volume: 550000,
    burnCounter: 55000,
    endDate: '2026-02-23T00:00:00Z',
    category: 'political',
    status: 'active',
  },
  {
    id: 'sol-flippening',
    title: 'SOL flips ETH market cap in 2026?',
    description: 'The sewer pipes run faster on Solana...',
    yesPrice: 0.23,
    noPrice: 0.77,
    volume: 780000,
    burnCounter: 78000,
    endDate: '2026-12-31T00:00:00Z',
    category: 'crypto',
    status: 'active',
  },
  {
    id: 'influencer-rug',
    title: 'Next CT influencer promotes a rug?',
    description: 'Sponsored shill incoming in 3... 2...',
    yesPrice: 0.82,
    noPrice: 0.18,
    volume: 215000,
    burnCounter: 21500,
    endDate: '2026-03-01T00:00:00Z',
    category: 'crypto',
    status: 'active',
  },
  {
    id: 'reserve-hole-million',
    title: 'Reserve Hole burns 1M $DATX before March?',
    description: 'The hole hungers. Feed it or it feeds on you.',
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 430000,
    burnCounter: 43000,
    endDate: '2026-03-31T00:00:00Z',
    category: 'datxit',
    status: 'active',
  },
  {
    id: 'ai-replaces-devs',
    title: 'AI fully replaces a dev team at a public company in 2026?',
    description: 'The sewer is automated. The devs are flushed.',
    yesPrice: 0.35,
    noPrice: 0.65,
    volume: 670000,
    burnCounter: 67000,
    endDate: '2026-12-31T00:00:00Z',
    category: 'tech',
    status: 'active',
  },
];
```

#### P1-T2: Market Detail Page (`/bets/market/[id]`)
**Type:** Frontend
**Dependencies:** P1-T1
**Deliverables:**
- Dynamic route with mock data lookup
- Full description (satirical lore text)
- Neon price chart (static mock line chart using Recharts)
- Yes/No odds bars with animated fills
- Volume counter + burn counter
- Comments section (3 mock comments)
- "Place Bet" button disabled with "Coming Soon - Flush Bets"
- Multi-token selector (mock dropdown: $DATX / SOL / USDC)
- Bet form with amount input

#### P1-T3: Create Market Page (`/bets/create`)
**Type:** Frontend
**Dependencies:** P0-T1
**Deliverables:**
- Form: title, description, category, end date, token type
- Satirical placeholders ("Propose a shitty event", "Describe the inevitable...")
- Submit disabled → toast "Proposal Submitted - Under Review by the Sewer Council"
- AI suggestion button (mock): "Generate a Shitty Market" - returns random lore text

#### P1-T4: My Bets Portfolio (`/bets/my-bets`)
**Type:** Frontend
**Dependencies:** P1-T1
**Deliverables:**
- Mock portfolio: 3-5 fake positions with PNL
- Token breakdown ($DATX / SOL / USDC positions)
- Unrealized PNL with neon green/red indicators
- History table with past resolved bets
- Sludge burn animation on losses

#### P1-T5: Leaderboard Page (`/bets/leaderboard`)
**Type:** Frontend
**Dependencies:** P0-T1
**Deliverables:**
- Mock top 10 "Shittiest Oracles" with profits/win rate
- Neon trophy icons (gold/silver/bronze sludge)
- Filter: weekly / monthly / all-time
- Wallet addresses truncated with copy
- Highlight: "Top Flusher" badge

#### P1-T6: Lore & Rules Page (`/bets/lore`)
**Type:** Frontend
**Dependencies:** P0-T1
**Deliverables:**
- Satirical explainer: "Why Sewer Bets? Because everything is shit - bet on the flush"
- How it works (bet → resolve → burn → payout)
- Token info ($DATX / SOL / USDC accepted)
- Reserve Hole burn stats (mock)
- El Shito cameo sections
- RAG chat input (mock): "Ask El Shito anything..."

#### P1-T7: Navigation & Layout Integration
**Type:** Frontend
**Dependencies:** P1-T1 through P1-T6
**Deliverables:**
- Sewer Bets nav: Home, Markets, Create, My Bets, Leaderboard, Lore
- Integration into Private Club `/private` page with "Sewer Bets (Soon)" card
- Mystery teaser: "The shittiest market awaits... but the hole is deep."
- Mobile hamburger menu
- Consistent neon theme across all pages

---

## 6. Phase 2 - Core Technical Implementation

**Timeline:** Weeks 6-16 (2-3 months)
**Cost:** $5k-$15k (Rust dev for Anchor)
**Focus:** Full on-chain mechanics, real bets, API
**Dependencies:** Phase 1 complete, Supabase connected

### Tasks

#### P2-T1: Anchor Escrow Program (Solana Smart Contract)
**Type:** Smart Contract (Rust)
**Dependencies:** Solana devnet access, Anchor CLI
**Deliverables:**
- `create_market` instruction (mint Yes/No shares, create pool PDA)
- `place_bet` instruction (transfer tokens to pool, update shares)
- `resolve_market` instruction (admin/multisig, burn losing shares, distribute)
- `claim_payout` instruction (redeem winning shares)
- Multi-token support ($DATX SPL, SOL wrapped, USDC SPL)
- Rake split: 10% total (7% treasury, 3% team)
- Burn mechanism: 10-20% of losing pool to Reserve Hole dead address
- PDA seeds: `[market_id, "market"]`
- Events emitted for off-chain indexing

```rust
// programs/sewer_bets/src/lib.rs - Full Skeleton
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, Burn};

declare_id!("SewerBets111111111111111111111111111111111");

const BURN_RATE_BPS: u64 = 2000;    // 20% of losing pool
const TREASURY_RATE_BPS: u64 = 700;  // 7% rake to treasury
const TEAM_RATE_BPS: u64 = 300;      // 3% rake to team

#[program]
pub mod sewer_bets {
    use super::*;

    pub fn create_market(
        ctx: Context<CreateMarket>,
        title: String,
        description: String,
        end_timestamp: i64,
        token_type: TokenType,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.creator = *ctx.accounts.creator.key;
        market.title = title;
        market.description = description;
        market.end_timestamp = end_timestamp;
        market.token_type = token_type;
        market.resolved = false;
        market.outcome = None;
        market.yes_pool = 0;
        market.no_pool = 0;
        market.total_volume = 0;
        market.bump = ctx.bumps.market;

        emit!(MarketCreated {
            market: market.key(),
            creator: market.creator,
            title: market.title.clone(),
            end_timestamp,
        });

        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        side: bool,
        amount: u64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(!market.resolved, SewerError::AlreadyResolved);
        require!(
            Clock::get()?.unix_timestamp < market.end_timestamp,
            SewerError::MarketEnded
        );
        require!(amount > 0, SewerError::ZeroAmount);

        // Transfer tokens from bettor to market pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.bettor_token.to_account_info(),
                    to: ctx.accounts.market_pool.to_account_info(),
                    authority: ctx.accounts.bettor.to_account_info(),
                },
            ),
            amount,
        )?;

        if side {
            market.yes_pool += amount;
        } else {
            market.no_pool += amount;
        }
        market.total_volume += amount;

        // Update or create position
        let position = &mut ctx.accounts.position;
        position.user = *ctx.accounts.bettor.key;
        position.market = market.key();
        if side {
            position.yes_amount += amount;
        } else {
            position.no_amount += amount;
        }

        emit!(BetPlaced {
            market: market.key(),
            bettor: *ctx.accounts.bettor.key,
            side,
            amount,
        });

        Ok(())
    }

    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(!market.resolved, SewerError::AlreadyResolved);
        require!(
            Clock::get()?.unix_timestamp >= market.end_timestamp,
            SewerError::MarketNotEnded
        );

        market.resolved = true;
        market.outcome = Some(outcome);

        let losing_pool = if outcome { market.no_pool } else { market.yes_pool };

        // Calculate burns and rake
        let burn_amount = (losing_pool * BURN_RATE_BPS) / 10000;
        let treasury_amount = (market.total_volume * TREASURY_RATE_BPS) / 10000;
        let team_amount = (market.total_volume * TEAM_RATE_BPS) / 10000;

        // Burn losing tokens to Reserve Hole
        token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.mint.to_account_info(),
                    from: ctx.accounts.market_pool.to_account_info(),
                    authority: ctx.accounts.market_authority.to_account_info(),
                },
                &[&[b"market", market.key().as_ref(), &[market.bump]]],
            ),
            burn_amount,
        )?;

        // Transfer rake to treasury
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.market_pool.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                    authority: ctx.accounts.market_authority.to_account_info(),
                },
                &[&[b"market", market.key().as_ref(), &[market.bump]]],
            ),
            treasury_amount + team_amount,
        )?;

        emit!(MarketResolved {
            market: market.key(),
            outcome,
            burn_amount,
            treasury_amount,
        });

        Ok(())
    }

    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        let market = &ctx.accounts.market;
        require!(market.resolved, SewerError::NotResolved);

        let position = &ctx.accounts.position;
        let outcome = market.outcome.unwrap();

        let winning_amount = if outcome {
            position.yes_amount
        } else {
            position.no_amount
        };
        require!(winning_amount > 0, SewerError::NoPayout);

        let winning_pool = if outcome { market.yes_pool } else { market.no_pool };
        let total_after_rake = market.total_volume
            - ((market.total_volume * (TREASURY_RATE_BPS + TEAM_RATE_BPS)) / 10000)
            - ((if outcome { market.no_pool } else { market.yes_pool } * BURN_RATE_BPS) / 10000);

        let payout = (winning_amount * total_after_rake) / winning_pool;

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.market_pool.to_account_info(),
                    to: ctx.accounts.claimer_token.to_account_info(),
                    authority: ctx.accounts.market_authority.to_account_info(),
                },
                &[&[b"market", market.key().as_ref(), &[market.bump]]],
            ),
            payout,
        )?;

        emit!(PayoutClaimed {
            market: market.key(),
            claimer: *ctx.accounts.claimer.key,
            amount: payout,
        });

        Ok(())
    }
}

// --- Account Structs ---

#[account]
pub struct Market {
    pub creator: Pubkey,
    pub title: String,         // max 200 chars
    pub description: String,   // max 500 chars
    pub end_timestamp: i64,
    pub token_type: TokenType,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub yes_pool: u64,
    pub no_pool: u64,
    pub total_volume: u64,
    pub bump: u8,
}

#[account]
pub struct Position {
    pub user: Pubkey,
    pub market: Pubkey,
    pub yes_amount: u64,
    pub no_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TokenType {
    DATX,
    SOL,
    USDC,
}

// --- Events ---

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub title: String,
    pub end_timestamp: i64,
}

#[event]
pub struct BetPlaced {
    pub market: Pubkey,
    pub bettor: Pubkey,
    pub side: bool,
    pub amount: u64,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub outcome: bool,
    pub burn_amount: u64,
    pub treasury_amount: u64,
}

#[event]
pub struct PayoutClaimed {
    pub market: Pubkey,
    pub claimer: Pubkey,
    pub amount: u64,
}

// --- Errors ---

#[error_code]
pub enum SewerError {
    #[msg("Market already resolved")]
    AlreadyResolved,
    #[msg("Market has not ended yet")]
    MarketNotEnded,
    #[msg("Market has ended - no more bets")]
    MarketEnded,
    #[msg("Bet amount must be greater than zero")]
    ZeroAmount,
    #[msg("Market not yet resolved")]
    NotResolved,
    #[msg("No payout available")]
    NoPayout,
}
```

#### P2-T2: REST API Endpoints
**Type:** Backend (Vercel Edge Functions)
**Dependencies:** P0-T2 (Supabase schema)
**Deliverables:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/markets` | GET | List active markets (filter by category, status) |
| `/api/markets/[id]` | GET | Market detail with positions, volume |
| `/api/markets/[id]/orderbook` | GET | Simple yes/no order book |
| `/api/orders` | POST | Place bet (signed tx verification) |
| `/api/positions/[wallet]` | GET | User positions and PNL |
| `/api/leaderboard` | GET | Top predictors (cached in Redis) |
| `/api/treasury` | GET | Burn stats, rake totals |
| `/api/consent` | POST | Log GDPR consent |
| `/api/rag/query` | POST | RAG query for lore/market gen |

```typescript
// app/api/markets/route.ts - Skeleton
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'active';

  let query = supabase
    .from('markets')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json(
      { error: 'Sewer overflow - try again' },
      { status: 500 }
    );
  }

  return Response.json({ markets: data });
}
```

#### P2-T3: Frontend ↔ Anchor Integration
**Type:** Frontend / Integration
**Dependencies:** P2-T1, P2-T2
**Deliverables:**
- Anchor client setup (`@coral-xyz/anchor` + IDL)
- `usePlaceBet` hook (token transfer + position mint)
- `useClaimPayout` hook
- Bet confirmation modal with payout calculation + burn warning
- Multi-token selector (real balance checks)
- Transaction status toasts (pending → confirmed → failed)
- Sludge burn animation on loss resolution

```typescript
// hooks/use-place-bet.ts - Skeleton
import { useCallback, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const PROGRAM_ID = new PublicKey('SewerBets111111111111111111111111111111111');

export function usePlaceBet() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeBet = useCallback(
    async (marketId: string, side: boolean, amount: number, tokenType: 'DATX' | 'SOL' | 'USDC') => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        setError('Connect wallet = enter sewer');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const provider = new AnchorProvider(connection, wallet as any, {});
        // Load IDL and create program instance
        // const program = new Program(IDL, PROGRAM_ID, provider);

        const mintAddress = getMintForToken(tokenType);
        const bettorToken = await getAssociatedTokenAddress(
          mintAddress,
          wallet.publicKey
        );

        // Build and send transaction
        // const tx = await program.methods
        //   .placeBet(side, new BN(amount))
        //   .accounts({ ... })
        //   .rpc();

        // return tx signature
      } catch (err: any) {
        setError(err.message || 'Sewer overflow - bet failed');
      } finally {
        setLoading(false);
      }
    },
    [connection, wallet]
  );

  return { placeBet, loading, error };
}

function getMintForToken(tokenType: 'DATX' | 'SOL' | 'USDC'): PublicKey {
  const mints: Record<string, string> = {
    DATX: process.env.NEXT_PUBLIC_DATX_MINT!,
    USDC: process.env.NEXT_PUBLIC_USDC_MINT!,
    SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
  };
  return new PublicKey(mints[tokenType]);
}
```

#### P2-T4: RAG AI System for Market Generation
**Type:** Backend / AI
**Dependencies:** P0-T2 (pgvector), AI SDK
**Deliverables:**
- Supabase pgvector extension enabled
- Lore doc embeddings pipeline (chunk → embed → store)
- `/api/rag/query` endpoint (embed query → cosine similarity → top-5 → LLM prompt → answer)
- `/api/rag/generate-market` endpoint (AI generates satirical market title + description)
- Frontend chat input in lore page
- AI-suggested markets in create page

```typescript
// app/api/rag/query/route.ts - Skeleton
import { createClient } from '@supabase/supabase-js';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { query } = await request.json();

  // 1. Embed the query
  const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query,
    }),
  });
  const { data } = await embeddingResponse.json();
  const embedding = data[0].embedding;

  // 2. Retrieve top-5 from pgvector
  const { data: chunks } = await supabase.rpc('match_lore', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 5,
  });

  // 3. Augment prompt with context
  const context = chunks?.map((c: any) => c.content).join('\n\n') || '';

  // 4. Generate answer with LLM
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `You are El Shito's Brain - the AI oracle of Sewer Bets.
      You answer in satirical, dark humor style consistent with DatXit lore.
      Everything is shit. Use double meanings. Be irreverent but helpful.
      Context from the sewer archives:\n${context}`,
    prompt: query,
  });

  return Response.json({ answer: text, sources: chunks });
}
```

#### P2-T5: WebSocket Live Feed
**Type:** Backend
**Dependencies:** P2-T2
**Deliverables:**
- Supabase Realtime channels for market updates
- Live price feeds (yes/no odds recalculated on each bet)
- Live volume counters
- New bet notifications
- Resolution event broadcasts

#### P2-T6: Admin Dashboard (`/admin`)
**Type:** Frontend / Backend
**Dependencies:** P2-T2
**Deliverables:**
- Wallet + password gated access
- Market moderation (approve/reject proposals)
- Resolution tools (multisig vote UI)
- User bans/audits (from logs)
- Rake/treasury monitoring charts
- Analytics: bets volume, burns, active users
- shadcn tables + charts

---

## 7. Phase 3 - Governance & Community

**Timeline:** Weeks 16-24 (2 months)
**Cost:** $5k-$10k (dev + audits)
**Focus:** Decentralize with SHIT DAO
**Dependencies:** Phase 2 complete

### Tasks

#### P3-T1: SHIT DAO Setup
**Type:** Smart Contract / Frontend
**Dependencies:** P2-T1
**Deliverables:**
- Snapshot or Realms integration for voting
- veDATX locking mechanism (lock $DATX → governance power)
- Proposal submission form → on-chain vote
- Quadratic or token-weighted voting
- AI-generated proposal summaries via RAG

#### P3-T2: Community Market Proposals
**Type:** Frontend / Backend
**Dependencies:** P3-T1
**Deliverables:**
- Public proposal form (submit market ideas)
- Moderation queue in admin dashboard
- Community vote on proposals
- Auto-create approved markets on-chain
- "Sewer Council" badge for top proposers

#### P3-T3: Multisig Resolution UI
**Type:** Frontend / Smart Contract
**Dependencies:** P2-T1
**Deliverables:**
- Multisig wallet setup (Squads Protocol on Solana)
- Resolution vote interface for admins/mods
- Transparency dashboard (publish votes)
- Dispute mechanism (community appeal)
- AI-assisted resolution suggestions

#### P3-T4: Bot SDK & API Docs
**Type:** Backend / Docs
**Dependencies:** P2-T2
**Deliverables:**
- TypeScript SDK (`@dxmarkets/sdk` npm package)
- Python SDK example (arbitrage bot)
- Public API documentation (OpenAPI/Swagger)
- Bot examples: copy-trade, arbitrage, market maker
- Rate limiting (Upstash Redis)
- Dev dashboard (`/dev`) with mock tools, logs, test wallets

```typescript
// SDK example - @dxmarkets/sdk
import { DXMarketsClient } from '@dxmarkets/sdk';

const client = new DXMarketsClient({
  apiUrl: 'https://api.dxmarkets.sewer',
  wallet: connectedWallet,
});

// List markets
const markets = await client.getMarkets({ status: 'active' });

// Place a bet
const tx = await client.placeBet({
  marketId: 'el-shito-bank-tag',
  side: 'yes',
  amount: 100, // in $DATX
  token: 'DATX',
});

// Get order book
const book = await client.getOrderBook('el-shito-bank-tag');
```

#### P3-T5: Nitrolite Multi-Token Swap Integration
**Type:** Integration
**Dependencies:** P2-T1
**Deliverables:**
- Nitrolite SDK integration for auto-swaps
- Bet with SOL → auto-swap to $DATX pool
- Bet with USDC → auto-swap to $DATX pool
- Slippage protection + gas optimization
- Swap confirmation in bet modal

---

## 8. Phase 4 - Omnichain & Expansions

**Timeline:** Weeks 24-48 (6 months)
**Cost:** $10k-$20k (audits + dev)
**Focus:** Cross-chain scalability
**Dependencies:** Phase 3 complete

### Tasks

| Task | Description | Tech |
|------|-------------|------|
| P4-T1 | LayerZero V2 bridge for $DATX/NFTs to EVM | LayerZero SDK |
| P4-T2 | Hyperlane v3 backup messaging | Hyperlane SDK |
| P4-T3 | Portal Gaming SDK for NFT portability | Portal SDK |
| P4-T4 | Cross-chain bet settlement | Bridge + escrow |
| P4-T5 | AI ethics/bias audit tooling | RLM + RAG audits |
| P4-T6 | Full security audit | External auditor |

---

## 9. Phase 5 - Optimization & Monetization

**Timeline:** Ongoing
**Cost:** $5k+
**Focus:** Growth, bots, revenue

### Tasks

| Task | Description |
|------|-------------|
| P5-T1 | Public Polymarket-style API (full CLOB order book) |
| P5-T2 | Bot incentive program (treasury-funded bounties) |
| P5-T3 | AI compliance monitoring (RLMs for ethical resolutions) |
| P5-T4 | High-roller rooms with NFT-gated access |
| P5-T5 | Mobile PWA optimization |
| P5-T6 | Analytics dashboard for traders |

---

## 10. Dependency Graph

```
Phase 0 (Foundation)
├── P0-T1: Design System ──────────────────────────┐
├── P0-T2: Supabase Schema ───────────────────────┐ │
├── P0-T3: Wallet Provider ─── depends on P0-T1   │ │
└── P0-T4: Compliance ──────── depends on P0-T1   │ │
                                                   │ │
Phase 1 (Mock UI) ─── depends on Phase 0          │ │
├── P1-T1: Home/Dashboard ─── depends on P0-T1  ◄─┘ │
├── P1-T2: Market Detail ──── depends on P1-T1     │
├── P1-T3: Create Market ──── depends on P0-T1     │
├── P1-T4: My Bets ────────── depends on P1-T1     │
├── P1-T5: Leaderboard ────── depends on P0-T1     │
├── P1-T6: Lore Page ─────── depends on P0-T1      │
└── P1-T7: Nav Integration ── depends on all P1-T*  │
                                                     │
Phase 2 (Core Tech) ─── depends on Phase 1           │
├── P2-T1: Anchor Program ──── independent (Rust) ◄──┘
├── P2-T2: REST API ────────── depends on P0-T2
├── P2-T3: FE ↔ Anchor ────── depends on P2-T1, P2-T2
├── P2-T4: RAG AI ──────────── depends on P0-T2
├── P2-T5: WebSocket Feed ──── depends on P2-T2
└── P2-T6: Admin Dashboard ─── depends on P2-T2

Phase 3 (Governance) ─── depends on Phase 2
├── P3-T1: SHIT DAO ────────── depends on P2-T1
├── P3-T2: Community Proposals ─ depends on P3-T1
├── P3-T3: Multisig Resolution ─ depends on P2-T1
├── P3-T4: Bot SDK & Docs ──── depends on P2-T2
└── P3-T5: Nitrolite Swaps ─── depends on P2-T1

Phase 4 (Omnichain) ─── depends on Phase 3
Phase 5 (Optimization) ─── ongoing after Phase 3
```

---

## 11. Code Skeletons

### File Structure
```
/
├── app/
│   ├── layout.tsx              # Root layout with providers, Bangers font
│   ├── page.tsx                # Landing redirect
│   ├── bets/
│   │   ├── page.tsx            # Home/Dashboard (markets grid)
│   │   ├── market/[id]/
│   │   │   └── page.tsx        # Market detail
│   │   ├── create/
│   │   │   └── page.tsx        # Create market form
│   │   ├── my-bets/
│   │   │   └── page.tsx        # Portfolio
│   │   ├── leaderboard/
│   │   │   └── page.tsx        # Leaderboard
│   │   └── lore/
│   │       └── page.tsx        # Lore & rules
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   ├── privacy/
│   │   └── page.tsx            # GDPR privacy policy
│   ├── disclaimers/
│   │   └── page.tsx            # Legal disclaimers
│   └── api/
│       ├── markets/
│       │   └── route.ts        # GET /api/markets
│       ├── orders/
│       │   └── route.ts        # POST /api/orders
│       ├── leaderboard/
│       │   └── route.ts        # GET /api/leaderboard
│       ├── treasury/
│       │   └── route.ts        # GET /api/treasury
│       ├── consent/
│       │   └── route.ts        # POST /api/consent
│       └── rag/
│           ├── query/
│           │   └── route.ts    # POST /api/rag/query
│           └── generate-market/
│               └── route.ts    # POST /api/rag/generate-market
├── components/
│   ├── ui/                     # shadcn base components
│   ├── sewer/                  # DXMarkets custom components
│   │   ├── neon-card.tsx       # Neon glow card
│   │   ├── sludge-button.tsx   # Dripping hover button
│   │   ├── sewer-modal.tsx     # Glassmorphism modal
│   │   ├── dripping-text.tsx   # Animated drip text
│   │   ├── market-card.tsx     # Market grid card
│   │   ├── bet-form.tsx        # Bet placement form
│   │   ├── odds-bar.tsx        # Yes/No probability bar
│   │   ├── burn-animation.tsx  # Sludge burn effect
│   │   ├── price-chart.tsx     # Mock/real price chart
│   │   ├── token-selector.tsx  # $DATX / SOL / USDC picker
│   │   └── el-shito-cameo.tsx  # Random El Shito appearances
│   ├── layout/
│   │   ├── header.tsx          # Main nav header
│   │   ├── footer.tsx          # Compliance footer
│   │   └── sewer-bg.tsx        # Dripping background layer
│   ├── compliance/
│   │   ├── age-gate-modal.tsx  # +18 modal
│   │   └── cookie-banner.tsx   # Cookie consent
│   └── providers.tsx           # Wallet + app providers
├── hooks/
│   ├── use-place-bet.ts        # Anchor bet hook
│   ├── use-claim-payout.ts     # Anchor payout hook
│   ├── use-market-data.ts      # SWR market fetcher
│   └── use-microcopy.ts        # Random sewer microcopy
├── lib/
│   ├── wallet-store.ts         # Zustand wallet state
│   ├── mock-data.ts            # Mock markets, positions
│   ├── constants.ts            # Token mints, program IDs
│   ├── microcopy.ts            # Sewer sarcasm arsenal
│   └── utils.ts                # cn, formatters
├── anchor/
│   ├── programs/
│   │   └── sewer_bets/
│   │       └── src/
│   │           └── lib.rs      # Main Anchor program
│   ├── tests/
│   │   └── sewer_bets.ts       # Anchor tests
│   └── Anchor.toml             # Anchor config
├── docs/
│   ├── master-plan.md          # THIS FILE
│   ├── architecture.md         # Architecture details
│   ├── design-guide.md         # Design system reference
│   ├── litepaper.md            # Public litepaper
│   └── api-docs.md             # API documentation
├── scripts/
│   ├── setup-db.sql            # Supabase schema
│   ├── seed-markets.ts         # Seed mock markets
│   └── embed-lore.ts           # Embed lore docs to pgvector
└── public/
    ├── images/
    │   ├── el-shito/           # El Shito assets
    │   ├── sludge/             # Sludge textures
    │   └── neon/               # Neon effects
    └── fonts/                  # Self-hosted if needed
```

---

## 12. Risks & Mitigations

| # | Risk | Severity | Probability | Mitigation |
|---|------|----------|-------------|------------|
| R1 | **Regulatory (CFTC/SEC gambling classification)** | High | Medium | Heavy disclaimers (+18, entertainment only, no fiat ramps). No US fiat on-ramps. "Satirical entertainment" framing. Legal review before mainnet. |
| R2 | **Multisig resolution disputes** | Medium | High | Publish all votes on X/transparency page. Dispute mechanism with community appeal. Future: Chainlink/decentralized oracles. |
| R3 | **Low initial liquidity** | Medium | High | Team-seed initial markets. Start with curated satirical markets (fewer, higher quality). Treasury-funded liquidity incentives. |
| R4 | **Solana congestion on high volume** | Medium | Low | Transaction retry logic in frontend. Gas optimization in Anchor. Batch operations where possible. |
| R5 | **Bot abuse / API spam** | Medium | Medium | Upstash Redis rate limiting. CAPTCHA on create market. API key required for heavy endpoints. Pattern monitoring in admin. |
| R6 | **Smart contract vulnerabilities** | Critical | Low | Internal testing on devnet. External audit before mainnet ($5k-$15k). Bug bounty program post-launch. |
| R7 | **Oracle manipulation** | High | Low | Start with trusted multisig. Phase to hybrid (multisig + community + AI suggestion). Full decentralization in Phase 4. |
| R8 | **Adoption lag (CT degens love memes but hate complexity)** | Medium | Medium | Mock-first approach for hype. Simple UX (bet in 2 clicks). Viral market titles for CT screenshots. Bot builder bounties. |
| R9 | **RAG AI generating offensive/biased content** | Medium | Medium | Content moderation layer. Bias audits on embeddings. Human review for AI-generated markets before publish. |
| R10 | **GDPR/CCPA non-compliance** | High | Low | Data export/delete implemented from Phase 0. Consent logging. No PII in embeddings. Privacy-by-design. |

---

## 13. Microcopy & Lore Arsenal

> Randomly scatter across ALL pages. 3-8 per page max. Never repeat on same page.

### Page Loaders / Spinners
- "Flushing the cache..."
- "Brewing fresh sludge..."
- "Loading more shit..."
- "Sewer pipes clogged, wait..."
- "Stirring the swamp..."
- "El Shito is tagging the backend..."

### Button Hovers / Tooltips
- "Click if you dare"
- "This might rug... your expectations"
- "Stake here, sink forever"
- "Burn it before it burns you"
- "Harvest sludge or starve"
- "Connect wallet = enter sewer"
- "Vote or be flushed"

### Empty States
- "Nothing here yet. Everything is shit anyway."
- "No memes? Make some, degen."
- "Swamp's dry today. Burn more."
- "No sightings of El Shito... yet."

### Error Messages
- "Sewer Overflow 404 - Page not found, like hope in 2025"
- "Connection lost. Blame the government."
- "Too much shit detected. Try again."
- "Human made, AI edited, server hated"

### Success / Confirmation
- "Flushed successfully."
- "Sludge harvested. Enjoy the stink."
- "Burn complete. Supply tighter."
- "Tagged. El Shito approves."

### Footer Extras
- "Built on Solana. Runs on cope."
- "Human made. AI edited. Degen approved."
- "Proudly the shittiest since Dec 21, 2025"
- "No moon. Just sewer."
- "Democracy is shit. SHIT DAO is shittier."

---

## Timeline Summary

| Phase | Duration | Cost | Key Deliverable |
|-------|----------|------|-----------------|
| **Phase 0** | Weeks 0-2 | $0-$500 | Design system, DB schema, wallet, compliance |
| **Phase 1** | Weeks 2-6 | $0 | Full mock UI teaser (6 pages, CT hype ready) |
| **Phase 2** | Weeks 6-16 | $5k-$15k | Anchor program, real bets, API, RAG AI, admin |
| **Phase 3** | Weeks 16-24 | $5k-$10k | SHIT DAO, community governance, bot SDK |
| **Phase 4** | Weeks 24-48 | $10k-$20k | Omnichain bridges, cross-chain bets, audits |
| **Phase 5** | Ongoing | $5k+ | Full CLOB, bot incentives, scaling |

**Total estimated:** 6-12 months, $25k-$50k for full deployment (mainnet + audited)
**MVP to CT hype:** 6 weeks ($0 if self-built)

---

> *"The shitty world ends where DatXit begins."*
> *Flush planned. Build initiated.*
