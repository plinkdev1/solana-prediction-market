# DXMarkets - Sewer Bets on Solana
# TO-DO: Concept/Teaser -> Beta Live Implementation Document

> **Project:** DXMarkets / Sewer Bets (DatXit Ecosystem)
> **Target Domain:** bets.datxit.space
> **Status:** Transitioning from Mock/Teaser to Production Beta
> **Last Updated:** 2026-02-17

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Phase 1: User Account System & Proposal Pipeline (Polymarket Model)](#phase-1)
3. [Phase 2: Frontend Production Upgrade](#phase-2)
4. [Phase 3: Backend, API & Realtime](#phase-3)
5. [Phase 4: Anchor Smart Contracts (Devnet -> Mainnet)](#phase-4)
6. [Phase 5: RAG AI & Governance (SHIT DAO)](#phase-5)
7. [Phase 6: Compliance, Security & Anti-Fraud](#phase-6)
8. [Phase 7: Testing, Audit & Launch](#phase-7)
9. [Lore & Guidelines Page Specification](#lore-guidelines-page)
10. [Risks & Mitigations](#risks)
11. [Testing Plan](#testing-plan)
12. [Launch Checklist](#launch-checklist)

---

## 1. Current State Audit <a id="1-current-state-audit"></a>

### Already Implemented (Mock/Teaser)

| Component | Status | File(s) | Gap to Production |
|---|---|---|---|
| Home Dashboard | Mock data | `app/bets/page.tsx` | Needs live Supabase + real wallet |
| Market Detail | Mock data | `app/markets/[id]/page.tsx` | Needs real bet placement via Anchor |
| My Bets | Mock data | `app/my-bets/page.tsx` | Needs real positions from chain |
| Leaderboard | Mock data | `app/leaderboard/page.tsx` | Needs real user ranking queries |
| Token Selector | Mock UI | `components/sewer/token-selector.tsx` | Needs SPL token balance reads |
| Wallet Connect | Mock button | `components/layout/header.tsx` | Needs `@solana/wallet-adapter` |
| Sewer Theme | Complete | `app/globals.css`, `components/sewer/*` | Production-ready |
| Age Gate / Cookies | Working | `components/compliance/*` | Needs server-side verification |
| Supabase Tables | Seeded | `users, markets, positions, trades, treasury, embeddings` | Needs RLS policies, new tables |
| Anchor Program | Skeleton | `anchor/programs/sewer-bets/src/lib.rs` | Needs full build, test, deploy |
| RAG AI Routes | Skeleton | `app/api/rag/*` | Needs embeddings generated, tested |
| REST API | Basic | `app/api/markets/*`, `trades/*`, `positions/*` | Needs auth, validation, rate limits |
| SSE/WebSocket | Skeleton | `app/api/ws/trades/route.ts` | Needs Supabase Realtime integration |

### NOT Yet Implemented (Critical Gaps)

- User account system (Polymarket-style registration, profiles, settings)
- Market proposal pipeline (users propose, team reviews/approves)
- Real wallet integration with transaction signing
- Anchor deployment to devnet/mainnet
- SHIT DAO governance (Snapshot/Realms)
- Oracle/multisig resolution dashboard
- GDPR data export / CCPA opt-out endpoints
- Anti-fraud layer (CAPTCHA, velocity checks, Sybil detection)
- Public API documentation (OpenAPI spec)
- Market comments/discussion threads
- Notification system (in-app, email optional)
- Lore & guidelines page

---

## Phase 1: User Account System & Proposal Pipeline <a id="phase-1"></a>

> **Goal:** Build a Polymarket-equivalent user system where users connect wallets, have profiles, propose markets, and the DXMarkets team reviews/approves/rejects proposals.

### 1.1 New Supabase Tables

```sql
-- Market proposals (user-submitted, team-reviewed)
CREATE TABLE IF NOT EXISTS market_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 150),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  category TEXT NOT NULL CHECK (category IN ('crypto','politics','sports','entertainment','tech','world','satirical','el-shito','datxit','custom')),
  resolution_source TEXT NOT NULL,
  resolution_date TIMESTAMPTZ NOT NULL,
  suggested_token TEXT DEFAULT 'DATX' CHECK (suggested_token IN ('DATX','SOL','USDC')),
  
  -- Review workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','revision_requested')),
  reviewer_id UUID REFERENCES users(id),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- If approved, links to created market
  market_id UUID REFERENCES markets(id),
  
  -- Metadata
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal votes (community signal)
CREATE TABLE IF NOT EXISTS proposal_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES market_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up','down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- User profiles (extended)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT CHECK (char_length(display_name) <= 32),
  bio TEXT CHECK (char_length(bio) <= 280),
  avatar_url TEXT,
  twitter_handle TEXT,
  discord_handle TEXT,
  notification_preferences JSONB DEFAULT '{"in_app": true, "email": false}',
  privacy_settings JSONB DEFAULT '{"show_bets": true, "show_pnl": false}',
  is_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user','proposer','reviewer','admin','council')),
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market comments (discussion threads)
CREATE TABLE IF NOT EXISTS market_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES market_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  upvotes INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bet_result','market_resolved','proposal_update','system','mention')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status ON market_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_proposer ON market_proposals(proposer_id);
CREATE INDEX IF NOT EXISTS idx_comments_market ON market_comments(market_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- RLS Policies
ALTER TABLE market_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read for proposals, comments
CREATE POLICY "Public read proposals" ON market_proposals FOR SELECT USING (true);
CREATE POLICY "Users create own proposals" ON market_proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read comments" ON market_comments FOR SELECT USING (true);
CREATE POLICY "Users create own comments" ON market_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users read own profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profiles" ON user_profiles FOR UPDATE USING (true);
```

### 1.2 User Registration & Auth Flow (Wallet-First)

**Architecture:** No email/password. Wallet signature is the identity.

```
User clicks "Connect Wallet"
  -> Phantom/Solflare adapter popup
  -> User signs nonce message: "DXMarkets Login: {nonce}"
  -> POST /api/auth/verify-wallet { publicKey, signature, nonce }
  -> Server verifies ed25519 signature
  -> Upsert user row in Supabase
  -> Return JWT session token (httpOnly cookie)
  -> Frontend stores wallet state in Zustand
```

**Files to create:**

| File | Purpose |
|---|---|
| `app/api/auth/nonce/route.ts` | Generate + store one-time nonce |
| `app/api/auth/verify-wallet/route.ts` | Verify sig, upsert user, issue JWT |
| `app/api/auth/logout/route.ts` | Clear session cookie |
| `app/api/auth/me/route.ts` | Return current user from JWT |
| `lib/auth.ts` | JWT helpers (sign, verify, middleware) |
| `hooks/use-auth.ts` | Client auth state (wraps wallet + JWT) |
| `components/wallet/wallet-connect-button.tsx` | Real Solana wallet adapter button |
| `components/wallet/wallet-provider.tsx` | `@solana/wallet-adapter` context |

**Auth verify endpoint example:**

```typescript
// app/api/auth/verify-wallet/route.ts
import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { getSupabaseServerClient } from '@/lib/supabase';
import { signJWT } from '@/lib/auth';

export async function POST(req: Request) {
  const { publicKey, signature, nonce } = await req.json();
  
  // Verify ed25519 signature
  const message = new TextEncoder().encode(`DXMarkets Login: ${nonce}`);
  const pubKeyBytes = new PublicKey(publicKey).toBytes();
  const sigBytes = Buffer.from(signature, 'base64');
  
  const isValid = nacl.sign.detached.verify(message, sigBytes, pubKeyBytes);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Upsert user
  const supabase = getSupabaseServerClient();
  const { data: user } = await supabase
    .from('users')
    .upsert({ wallet_address: publicKey }, { onConflict: 'wallet_address' })
    .select()
    .single();
  
  // Ensure profile exists
  await supabase
    .from('user_profiles')
    .upsert({ user_id: user.id }, { onConflict: 'user_id' });
  
  // Issue JWT
  const token = await signJWT({ sub: user.id, wallet: publicKey });
  
  const response = NextResponse.json({ user });
  response.cookies.set('dxm-session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  return response;
}
```

### 1.3 Market Proposal Pipeline

**Flow (Polymarket Model Adapted for DXMarkets):**

```
[1] User submits proposal via /propose page
    -> Stored in market_proposals (status: pending)
    
[2] Community votes on proposals (upvote/downvote)
    -> Proposals with >10 upvotes get auto-flagged for review
    
[3] Council/Admin reviews proposals via /admin/proposals dashboard
    -> Approve: Creates real market in markets table, links proposal
    -> Reject: Sets status=rejected with reviewer_notes
    -> Revision: Sets status=revision_requested with feedback
    
[4] Approved market goes live on /bets
    -> Proposer gets notification + reputation score boost
```

**Roles:**

| Role | Permissions |
|---|---|
| `user` | Browse markets, place bets, comment, submit proposals |
| `proposer` | All user perms + priority proposal queue (earned via reputation) |
| `reviewer` | All proposer perms + review/approve/reject proposals |
| `council` | All reviewer perms + resolve markets, govern parameters |
| `admin` | All council perms + system config, user management |

**Files to create:**

| File | Purpose |
|---|---|
| `app/propose/page.tsx` | Proposal submission form |
| `app/proposals/page.tsx` | Browse all proposals, vote |
| `app/admin/proposals/page.tsx` | Review dashboard (council+) |
| `app/api/proposals/route.ts` | CRUD for proposals |
| `app/api/proposals/[id]/vote/route.ts` | Upvote/downvote |
| `app/api/proposals/[id]/review/route.ts` | Approve/reject/revise |
| `components/proposals/proposal-card.tsx` | Proposal card component |
| `components/proposals/proposal-form.tsx` | Submit form with AI assist |

### 1.4 User Profile Pages

**Files to create:**

| File | Purpose |
|---|---|
| `app/profile/page.tsx` | Own profile (edit mode) |
| `app/profile/[wallet]/page.tsx` | Public profile view |
| `app/settings/page.tsx` | Notification prefs, privacy, data export |
| `components/profile/profile-card.tsx` | Profile display component |
| `components/profile/bet-history.tsx` | User bet history table |
| `components/profile/stats-grid.tsx` | Win rate, volume, PnL stats |

**Dependencies:** `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@solana/web3.js`, `tweetnacl`, `jose` (JWT)

---

## Phase 2: Frontend Production Upgrade <a id="phase-2"></a>

> **Goal:** Replace all mock data with live Supabase queries, add real wallet integration, build proposal/profile/admin pages.

### 2.1 Real Wallet Integration

**Install dependencies:**
```bash
pnpm add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui @solana/spl-token tweetnacl jose bs58
```

**Wallet Provider wrapper:**

```tsx
// components/wallet/wallet-provider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, type ReactNode } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet; // Switch to Mainnet for prod
  const endpoint = useMemo(() => 
    process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(network), 
    [network]
  );

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### 2.2 Replace Mock Data in All Pages

| Page | Current Source | Target Source |
|---|---|---|
| `/bets` | `MOCK_MARKETS` array | `GET /api/markets` -> Supabase |
| `/markets/[id]` | `MOCK_MARKETS.find()` | `GET /api/markets/[id]` -> Supabase |
| `/my-bets` | `MOCK_POSITIONS` array | `GET /api/positions?wallet=` -> Supabase |
| `/leaderboard` | `MOCK_LEADERBOARD` array | `GET /api/leaderboard` -> Supabase |

**Pattern for all pages (use SWR):**

```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function BetsPage() {
  const { data, error, isLoading } = useSWR('/api/markets?status=active', fetcher);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  
  return <MarketGrid markets={data.markets} />;
}
```

### 2.3 New Pages to Build

| Page | Route | Description |
|---|---|---|
| Propose Market | `/propose` | Form with AI-assist for title/description generation |
| Browse Proposals | `/proposals` | All community proposals with vote buttons |
| Admin: Review | `/admin/proposals` | Council dashboard to approve/reject |
| Admin: Resolution | `/admin/resolve` | Multisig market resolution interface |
| Profile (own) | `/profile` | Edit display name, bio, settings |
| Profile (public) | `/profile/[wallet]` | Public view of any user |
| Settings | `/settings` | Notifications, privacy, GDPR export |
| Lore & Guidelines | `/lore` | Rules, lore, how markets work |
| Create Market (admin) | `/admin/create-market` | Direct market creation (bypasses proposals) |

### 2.4 Real Betting Interface

Replace mock bet placement with real Anchor transaction:

```tsx
// components/markets/real-betting-interface.tsx
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { TOKEN_MINTS, PROGRAM_ID } from '@/lib/constants';

async function placeBet(
  program: Program,
  marketId: string,
  side: 'yes' | 'no',
  amount: number,
  tokenType: 'DATX' | 'SOL' | 'USDC'
) {
  const mint = new web3.PublicKey(TOKEN_MINTS[tokenType === 'SOL' ? 'wSOL' : tokenType]);
  const userAta = await getAssociatedTokenAddress(mint, wallet.publicKey!);
  
  const [marketPda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('market'), Buffer.from(marketId)],
    new web3.PublicKey(PROGRAM_ID)
  );
  const [positionPda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('position'), wallet.publicKey!.toBuffer(), marketPda.toBuffer()],
    new web3.PublicKey(PROGRAM_ID)
  );
  
  const tx = await program.methods
    .placeBet({ [side]: {} }, new BN(amount * 10 ** decimals), { [tokenType.toLowerCase()]: {} })
    .accounts({
      market: marketPda,
      position: positionPda,
      user: wallet.publicKey,
      userTokenAccount: userAta,
      marketPool: marketPoolAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
  
  // Record trade in Supabase
  await fetch('/api/trades', {
    method: 'POST',
    body: JSON.stringify({ market_id: marketId, side, amount, token_type: tokenType, tx_signature: tx }),
  });
  
  return tx;
}
```

---

## Phase 3: Backend, API & Realtime <a id="phase-3"></a>

> **Goal:** Production-grade API with auth middleware, rate limiting, validation, full REST + realtime via Supabase.

### 3.1 Auth Middleware

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from './supabase';

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!);

export async function signJWT(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as { sub: string; wallet: string };
}

export async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get('dxm-session')?.value;
  if (!token) return null;
  try {
    const payload = await verifyJWT(token);
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', payload.sub)
      .single();
    return data;
  } catch {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const user = await getAuthUser(req);
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    return handler(req, user, ...args);
  };
}

export function requireRole(role: string, handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const user = await getAuthUser(req);
    if (!user) return Response.json({ error: 'Auth required' }, { status: 401 });
    const roleHierarchy = ['user', 'proposer', 'reviewer', 'council', 'admin'];
    const userLevel = roleHierarchy.indexOf(user.user_profiles?.role || 'user');
    const requiredLevel = roleHierarchy.indexOf(role);
    if (userLevel < requiredLevel) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    return handler(req, user, ...args);
  };
}
```

### 3.2 Full REST API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/markets` | Public | List markets (filter, paginate, search) |
| `GET` | `/api/markets/[id]` | Public | Market detail + recent trades + comments |
| `POST` | `/api/markets` | Council+ | Create market directly |
| `PATCH` | `/api/markets/[id]` | Council+ | Update market (odds recalc, status) |
| `GET` | `/api/trades` | Public | Trade history (global or per-market) |
| `POST` | `/api/trades` | Auth | Record a new trade (after on-chain tx) |
| `GET` | `/api/positions` | Auth | User positions (filter by status) |
| `GET` | `/api/treasury` | Public | Treasury stats (burns, rake, volume) |
| `GET` | `/api/leaderboard` | Public | Top users by PnL, volume, win rate |
| `POST` | `/api/proposals` | Auth | Submit market proposal |
| `GET` | `/api/proposals` | Public | Browse proposals |
| `POST` | `/api/proposals/[id]/vote` | Auth | Upvote/downvote a proposal |
| `POST` | `/api/proposals/[id]/review` | Reviewer+ | Approve/reject/revise |
| `GET` | `/api/auth/nonce` | Public | Get login nonce |
| `POST` | `/api/auth/verify-wallet` | Public | Verify wallet signature |
| `GET` | `/api/auth/me` | Auth | Current user + profile |
| `POST` | `/api/auth/logout` | Auth | Clear session |
| `GET` | `/api/profile/[wallet]` | Public | Public profile |
| `PATCH` | `/api/profile` | Auth | Update own profile |
| `GET` | `/api/notifications` | Auth | User notifications |
| `PATCH` | `/api/notifications/read` | Auth | Mark notifications read |
| `GET` | `/api/comments/[marketId]` | Public | Market comments |
| `POST` | `/api/comments` | Auth | Post comment |
| `POST` | `/api/rag/generate-market` | Auth | AI market generation |
| `POST` | `/api/rag/query` | Public | AI lore query |
| `GET` | `/api/ws/trades` | Public | SSE stream for live trades |
| `GET` | `/api/gdpr/export` | Auth | GDPR data export |
| `POST` | `/api/gdpr/delete` | Auth | CCPA deletion request |

### 3.3 Rate Limiting

```typescript
// lib/rate-limit.ts
const rateMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Usage in API route:
// if (!rateLimit(walletAddress, 30, 60_000)) return Response.json({ error: 'Slow down, sewer rat' }, { status: 429 });
```

### 3.4 Supabase Realtime for Live Trades

```typescript
// hooks/use-realtime-trades.ts
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeTrades(marketId?: string) {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    let channel = supabase
      .channel(`trades-${marketId || 'global'}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'trades',
        ...(marketId ? { filter: `market_id=eq.${marketId}` } : {}),
      }, (payload) => {
        setTrades(prev => [payload.new, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [marketId]);

  return trades;
}
```

---

## Phase 4: Anchor Smart Contracts (Devnet -> Mainnet) <a id="phase-4"></a>

> **Goal:** Deploy fully tested Anchor program with multi-token escrow, rake/burn, and resolution.

### 4.1 Contract Architecture

```
sewer_bets (Anchor Program)
  |
  |-- create_market(market_id, title, desc, resolution_ts, primary_token)
  |     -> PDA: seeds = [b"market", market_id.as_bytes()]
  |     -> Creates Market account + token vault PDAs
  |
  |-- place_bet(side, amount, token_type)
  |     -> SPL Transfer: user ATA -> market vault ATA
  |     -> Creates/updates Position PDA
  |     -> seeds = [b"position", user.key, market.key]
  |
  |-- resolve_market(outcome)
  |     -> Requires authority (multisig later)
  |     -> Calculates rake split:
  |         20% losing pool -> burn (token::burn to Reserve Hole)
  |          7% total pool  -> treasury vault
  |          3% total pool  -> team vault
  |
  |-- claim_payout()
  |     -> Pro-rata share of (total - rake) for winners
  |     -> SPL Transfer: market vault -> user ATA
  |
  |-- cancel_market()
  |     -> Refund all positions from vault -> user ATAs
  |     -> Only if market has no bets OR admin override
```

### 4.2 Deployment Steps

```bash
# 1. Install Anchor CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.30.1 && avm use 0.30.1

# 2. Build
cd anchor
anchor build

# 3. Get program ID
solana address -k target/deploy/sewer_bets-keypair.json
# Update declare_id!() in lib.rs and Anchor.toml

# 4. Deploy to devnet
solana config set --url devnet
anchor deploy --provider.cluster devnet

# 5. Run tests
anchor test

# 6. After audit -> deploy to mainnet
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet
```

### 4.3 Anchor Test Suite

```typescript
// anchor/tests/sewer-bets.ts
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { SewerBets } from '../target/types/sewer_bets';
import { expect } from 'chai';

describe('sewer-bets', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SewerBets as Program<SewerBets>;

  it('Creates a market', async () => {
    const [marketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('market'), Buffer.from('test-market-1')],
      program.programId
    );
    
    await program.methods
      .createMarket('test-market-1', 'Will DATX moon?', 'Test description', 
        new anchor.BN(Date.now() / 1000 + 86400), { datx: {} })
      .accounts({ market: marketPda, authority: provider.wallet.publicKey })
      .rpc();
    
    const market = await program.account.market.fetch(marketPda);
    expect(market.title).to.equal('Will DATX moon?');
    expect(market.status).to.deep.equal({ active: {} });
  });

  it('Places a bet', async () => { /* ... */ });
  it('Resolves a market', async () => { /* ... */ });
  it('Claims payout (winner)', async () => { /* ... */ });
  it('Rejects claim (loser)', async () => { /* ... */ });
  it('Burns losing pool to Reserve Hole', async () => { /* ... */ });
  it('Cancels market with refunds', async () => { /* ... */ });
});
```

### 4.4 Multisig Resolution (Phase 2)

Replace single authority with Squads multisig:

```rust
// Future: Replace authority check with Squads SDK verification
// Requires 2-of-3 council signatures to resolve
// Integration via @sqds/multisig npm package on frontend
```

---

## Phase 5: RAG AI & Governance (SHIT DAO) <a id="phase-5"></a>

### 5.1 RAG System (pgvector + Vercel AI SDK)

**Already in place:** `embeddings` table with pgvector, 10 lore entries seeded.

**Remaining work:**

1. Create `match_lore` RPC function in Supabase:

```sql
-- Similarity search function for RAG
CREATE OR REPLACE FUNCTION match_lore(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

2. Generate actual vector embeddings for all lore entries (via API call or script)
3. Expand lore corpus to 50+ entries covering all DatXit topics
4. Wire AI market generation into the `/propose` page as "AI Assist" button
5. Create `/api/rag/embed` endpoint for admin to add new lore on-the-fly

### 5.2 SHIT DAO Governance

**Architecture:** Use Realms (Solana-native) or Snapshot (off-chain) for governance.

**Governance actions:**
- Propose new market categories
- Vote on fee structure changes (rake percentages)
- Elect/remove council members
- Veto market resolutions (dispute mechanism)
- Treasury spending proposals

**Implementation plan:**

| Component | Tool | Details |
|---|---|---|
| Token-gated voting | Realms SDK | $DATX holders vote, 1 token = 1 vote |
| Proposal creation | Custom UI + Realms | Council submits, holders vote |
| Execution | Anchor + Realms | Approved proposals auto-execute via program |
| Dashboard | `/dao` page | Show active proposals, results, treasury |

**Files to create:**

| File | Purpose |
|---|---|
| `app/dao/page.tsx` | Governance dashboard |
| `app/dao/proposals/page.tsx` | All DAO proposals |
| `app/dao/proposals/[id]/page.tsx` | Single proposal + vote |
| `app/api/dao/proposals/route.ts` | CRUD for DAO proposals |
| `lib/realms.ts` | Realms SDK integration helpers |

---

## Phase 6: Compliance, Security & Anti-Fraud <a id="phase-6"></a>

### 6.1 GDPR / CCPA

```typescript
// app/api/gdpr/export/route.ts
// Returns ZIP of all user data: profile, positions, trades, comments
// Must respond within 30 days per GDPR Article 15

// app/api/gdpr/delete/route.ts
// Anonymizes user data: replaces wallet with hash, deletes profile
// Keeps trade records (anonymized) for audit trail
// Must respond within 30 days per GDPR Article 17
```

### 6.2 Anti-Fraud

| Measure | Implementation |
|---|---|
| CAPTCHA | Turnstile on bet placement, proposal submit |
| Rate Limiting | 30 req/min per wallet, 5 bets/min per market |
| Velocity Checks | Flag accounts betting >$10k/day |
| Sybil Detection | Flag wallets with same funding source |
| IP Geofencing | Block OFAC-sanctioned jurisdictions |
| Transaction Monitoring | Log all on-chain tx hashes, cross-reference |

### 6.3 Security Hardening

| Item | Action |
|---|---|
| RLS Policies | Enforce on ALL tables (users can only read own data) |
| API Validation | Zod schemas on every POST/PATCH body |
| CORS | Restrict to `bets.datxit.space` in production |
| CSP Headers | Strict Content-Security-Policy |
| Secrets | All keys in Vercel env vars, never in code |
| Audit Log | Log all admin actions (resolve, cancel, role changes) |
| Anchor Audit | Professional audit before mainnet (cost: $5k-$15k) |

---

## Phase 7: Testing, Audit & Launch <a id="phase-7"></a>

### 7.1 Testing Matrix

| Test Type | Tool | Coverage |
|---|---|---|
| Unit (frontend) | Vitest + React Testing Library | Components, hooks, utils |
| Unit (Anchor) | Anchor test framework (Mocha) | All program instructions |
| Integration | Playwright | Full user flows (connect, bet, claim) |
| Load | k6 or Artillery | 10k concurrent users, 1k bets/sec |
| Security | Manual + OWASP ZAP | API fuzzing, auth bypass attempts |
| Contract Audit | External firm (OtterSec, Neodyme) | Anchor program |

### 7.2 E2E Test Scenarios

```
Scenario 1: Full Market Lifecycle
  1. Admin creates market via /admin/create-market
  2. User A connects wallet, places YES bet (100 DATX)
  3. User B connects wallet, places NO bet (50 SOL)
  4. Market expires, council resolves as YES
  5. User A claims payout (pro-rata of total pool minus rake)
  6. User B sees loss, 20% of NO pool burned
  7. Treasury updated with rake amounts
  8. Leaderboard reflects new stats

Scenario 2: Proposal Pipeline
  1. User submits proposal via /propose
  2. Community votes (5 upvotes)
  3. Council reviews, requests revision
  4. User resubmits with changes
  5. Council approves -> market created
  6. Proposer gets notification + reputation

Scenario 3: Dispute Resolution
  1. Market resolved as YES by council
  2. 3+ users flag as disputed within 24h
  3. DAO vote triggered (SHIT DAO)
  4. If >60% vote to overturn: market re-resolved
  5. If <60%: original resolution stands

Scenario 4: Multi-Token Bet
  1. Market accepts DATX/SOL/USDC
  2. User bets 500 DATX on YES
  3. Another user bets 2 SOL on NO
  4. Pools tracked separately per token
  5. Payout calculated per-token pool
  6. Burns apply only to DATX pool (deflationary)
```

---

## Lore & Guidelines Page Specification <a id="lore-guidelines-page"></a>

> **Route:** `/lore`
> **Purpose:** Single source of truth for how DXMarkets works, the DatXit lore, and community guidelines.

### Page Sections

**1. "Welcome to the Sewers" (Hero)**
- Full-width sewer aesthetic banner
- El Shito mascot illustration
- Tagline: "Where degens bet and bad takes get flushed"

**2. "How Sewer Bets Work"**
- Step-by-step: Connect Wallet -> Browse Markets -> Place Bet -> Win/Lose -> Claim/Burn
- Visual diagram with neon pipe metaphor
- Token explainer: DATX (true believers), SOL (speed demons), USDC (stability cowards)
- Rake breakdown: 20% burn, 7% treasury, 3% team

**3. "Market Rules & Resolution"**
- How markets are created (user proposals + team approval)
- Resolution process (oracle data + council vote + dispute window)
- What makes a valid market (clear outcome, verifiable source, time-bound)
- Invalid market handling (full refunds, no rake)

**4. "The DatXit Lore"**
- Origin story of DatXit ecosystem
- El Shito character bio and sewer mythology
- The Reserve Hole (where burned tokens go)
- Xitmas (annual community event)
- Timeline of key ecosystem events

**5. "Community Guidelines"**
- Acceptable market topics (satirical, provocative, but not hateful)
- Prohibited content (targeted harassment, illegal activity, doxxing)
- Dispute process and how to flag markets
- Reputation system and how to earn roles (user -> proposer -> reviewer)
- SHIT DAO participation rules

**6. "For Builders & Bots"**
- Public API documentation link
- Bot-friendly endpoints for market data
- SDK/integration examples
- Terms for automated trading

**7. "Legal & Compliance"**
- 18+ requirement
- Jurisdictional restrictions
- "Not financial advice" disclaimer
- GDPR/CCPA rights and how to exercise them
- Links to `/privacy` and `/disclaimers`

---

## Risks & Mitigations <a id="risks"></a>

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Regulatory action** (unlicensed gambling) | Critical | Medium | Satirical framing, 18+ gate, geo-blocking OFAC jurisdictions, legal counsel review, prominent disclaimers |
| **Smart contract exploit** | Critical | Low-Medium | Professional audit ($5k-15k), bug bounty program, start with low bet limits, timelock on admin functions |
| **Oracle manipulation** | High | Low | Multi-source oracle (UMA + manual), council multisig (2-of-3), 24h dispute window, DAO override |
| **DATX price crash** | Medium | Medium | Multi-token support (SOL/USDC fallback), pools separated by token, burns reduce supply |
| **Low liquidity** | Medium | High | Seed initial markets with team funds, LP incentives via DATX rewards, bot-friendly API |
| **Sybil attacks** (fake accounts) | Medium | Medium | Wallet-based auth (no email spam), rate limits, funding source analysis, CAPTCHA on bets |
| **GDPR complaint** | Medium | Low | Data export endpoint, deletion endpoint, cookie consent, privacy policy, DPO contact |
| **Hosting costs spike** | Low | Medium | Vercel free tier for frontend, Supabase free tier to start, upgrade only on traction |
| **Team disputes** | Low | Low | Multisig on treasury, DAO governance for major decisions, clear role definitions |

### Cost Estimates

| Item | Free Tier | Paid Tier (at scale) |
|---|---|---|
| Vercel Hosting | $0 (hobby) | $20/mo (Pro) |
| Supabase | $0 (free, 500MB) | $25/mo (Pro, 8GB) |
| Solana RPC | $0 (public) | $50-200/mo (Helius/QuickNode) |
| AI (OpenAI) | $0 (Vercel AI Gateway) | $20-100/mo based on usage |
| Domain (bets.datxit.space) | $0 (subdomain) | $0 |
| Anchor Audit | N/A | $5,000-$15,000 (one-time) |
| Legal Review | N/A | $2,000-$5,000 (one-time) |

---

## Testing Plan <a id="testing-plan"></a>

### Pre-Launch Testing Phases

**Phase A: Unit Tests (Week 1-2)**
- All Anchor instructions (create, bet, resolve, claim, cancel)
- All API routes (auth, markets, trades, proposals, GDPR)
- All frontend components (rendering, interactions, edge cases)

**Phase B: Integration Tests (Week 2-3)**
- Wallet connect -> sign nonce -> get JWT -> place bet flow
- Proposal submit -> vote -> approve -> market creation flow
- Bet -> resolve -> claim -> treasury update flow
- RAG query -> AI generate market -> propose flow

**Phase C: Devnet Beta (Week 3-4)**
- Deploy Anchor to devnet
- Invite 20-50 beta testers from DatXit community
- Monitor: error rates, tx failures, UI bugs
- Collect feedback via Discord channel

**Phase D: Mainnet Soft Launch (Week 5-6)**
- Deploy Anchor to mainnet with bet limits ($100 max)
- Public launch at bets.datxit.space
- 24/7 monitoring first 72 hours
- Gradual limit increases based on stability

---

## Launch Checklist <a id="launch-checklist"></a>

### Infrastructure
- [ ] Vercel project connected to `bets.datxit.space` domain
- [ ] Supabase upgraded to Pro (if needed for traffic)
- [ ] All env vars set in Vercel (Supabase, Solana RPC, JWT secret)
- [ ] CORS configured for production domain only
- [ ] CSP headers configured
- [ ] Error monitoring (Sentry or Vercel Analytics)

### Smart Contracts
- [ ] Anchor program builds without warnings
- [ ] All 7+ test cases pass on devnet
- [ ] Program ID updated in `constants.ts` and `Anchor.toml`
- [ ] Professional audit complete (or in-progress with timeline)
- [ ] Deployed to mainnet-beta
- [ ] Multisig configured for resolution authority

### Database
- [ ] All tables created with indexes
- [ ] RLS policies enabled on all tables
- [ ] `match_lore` function created for RAG
- [ ] Embeddings generated for all lore entries
- [ ] Initial markets seeded (5-10 launch markets)
- [ ] Treasury record initialized

### Frontend
- [ ] All pages load without errors
- [ ] Wallet connect works (Phantom, Solflare)
- [ ] Real bets can be placed and confirmed on-chain
- [ ] Age gate shows on first visit
- [ ] Cookie banner functional
- [ ] Mobile responsive on all pages
- [ ] Loading states and error boundaries on all pages
- [ ] SEO meta tags on all pages

### Backend / API
- [ ] All API routes return correct data
- [ ] Auth middleware protects private routes
- [ ] Rate limiting active on all endpoints
- [ ] GDPR export endpoint functional
- [ ] Proposal pipeline working end-to-end
- [ ] SSE/Realtime trades working
- [ ] RAG market generation working

### Compliance
- [ ] Privacy policy page complete and accurate
- [ ] Disclaimers page with betting warnings
- [ ] Terms of service finalized
- [ ] 18+ age gate with localStorage persistence
- [ ] Cookie consent with manage options
- [ ] OFAC jurisdiction blocking (if applicable)
- [ ] "Not financial advice" visible on all market pages

### Launch Day
- [ ] Announce on DatXit socials (Twitter, Discord, Telegram)
- [ ] Seed 5-10 launch markets with engaging topics
- [ ] Monitor Vercel dashboard for errors
- [ ] Monitor Supabase dashboard for DB load
- [ ] Have council online for first 24h to resolve issues
- [ ] Bug report channel open in Discord
