# DXMarkets - Lore Markets + Fast Markets Development Plan

## Context

The Sui version (DXMarkets on Sui / $DUST) has implemented a dual-market system:
- **Lore Markets**: Narrative-driven, long-term prediction markets tied to the ecosystem lore
- **Fast Markets**: Quick-resolution, Polymarket-style markets on real-world events

This plan scopes the same dual-market system for DXMarkets on Solana ($DATX), adapted to fit
the sewer aesthetic, DatXit lore, and the existing codebase.

---

## What the Sui Version Did (Reference)

1. Added a `market_type` field to the Market type: `'lore' | 'fast'`
2. Added a primary toggle at the top of the bets dashboard: **Sewer Lore** / **Flash Bets**
3. Each market type has its own subtitle description
4. Category tabs filter within the selected market type
5. Fast Markets have:
   - Shorter resolution windows (hours/days vs weeks/months)
   - Real-world anchored events (elections, earnings, sports scores)
   - Higher velocity / more volume
   - Countdown timers instead of "Xd left"
   - A lightning bolt icon to differentiate
6. Lore Markets have:
   - Narrative descriptions tied to ecosystem mythology
   - Longer resolution windows
   - Deeper satirical lore integration
   - A flame/scroll icon to differentiate
7. Market cards display a badge showing "LORE" or "FAST"
8. Stats bar at the top splits counts: "61 Lore Markets" / "20 Fast Markets"

---

## What Needs to Change in Solana Version

### Phase 1: Type System + Data Model

**Files to change:** `lib/types.ts`, `lib/constants.ts`, `lib/mock-data.ts`

#### 1.1 Add `market_type` to Market interface
```ts
// lib/types.ts - add to Market interface
export type MarketType = 'lore' | 'fast';

export interface Market {
  // ... existing fields ...
  market_type: MarketType;  // NEW
}
```

#### 1.2 Add market type metadata to constants
```ts
// lib/constants.ts - add new config
export const MARKET_TYPE_CONFIG = {
  lore: {
    label: 'Sewer Lore',
    icon: 'Flame',        // lucide icon name
    description: 'Narrative-driven, long-term prediction markets tied to the DatXit sewer ecosystem. Slower resolution, deeper lore integration.',
    color: '#ff00aa',      // neon pink
    badgeText: 'LORE',
  },
  fast: {
    label: 'Flash Bets',
    icon: 'Zap',          // lucide icon name
    description: 'Quick-fire prediction markets on real-world events. Fast resolution, high velocity. Polymarket meets the sewer.',
    color: '#00ffcc',      // neon cyan
    badgeText: 'FAST',
  },
} as const;
```

#### 1.3 Tag all 44 existing markets as `market_type: 'lore'`
All current mock markets are narrative/lore-driven, so they all get `market_type: 'lore'`.

#### 1.4 Generate 20 new Fast Markets
New mock data for quick-resolution real-world events:

**Crypto Fast (5):**
- "Will BTC close above $150k today?" (24h resolution)
- "SOL flips BNB in next 7 days?" (7d)
- "ETH gas fees above 100 gwei this week?" (7d)
- "Memecoin market cap drops 20% this month?" (30d)
- "Next Solana TPS record broken by March 2026?" (14d)

**Politics Fast (3):**
- "Will Biden mention crypto in next press conference?" (48h)
- "SEC announces new crypto rules this week?" (7d)
- "Congress passes stablecoin bill by April 2026?" (60d)

**Sports Fast (4):**
- "Lakers win tonight?" (12h resolution)
- "Champions League upset this week?" (7d)
- "UFC 310 main event goes to decision?" (24h)
- "F1 2026 opening race won by Red Bull?" (48h)

**Tech Fast (3):**
- "Apple announces AI device this quarter?" (90d)
- "OpenAI releases GPT-6 before June 2026?" (120d)
- "Tesla stock hits $400 this week?" (7d)

**Elections Fast (3):**
- "2026 midterm turnout exceeds 2022?" (24h on election day)
- "GOP wins Senate majority in midterms?" (48h)
- "Any third-party candidate wins a House seat?" (48h)

**Market Trends Fast (2):**
- "S&P 500 closes red today?" (12h)
- "Gold hits new ATH this month?" (30d)

---

### Phase 2: Database Schema Update

**Files to change:** New migration script

#### 2.1 Add `market_type` column to markets table
```sql
ALTER TABLE markets ADD COLUMN IF NOT EXISTS market_type TEXT
  NOT NULL DEFAULT 'lore'
  CHECK (market_type IN ('lore', 'fast'));

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_markets_market_type ON markets(market_type);

-- Update existing markets to lore
UPDATE markets SET market_type = 'lore' WHERE market_type IS NULL;
```

#### 2.2 Add `resolution_window` column for Fast Markets
```sql
-- Resolution window in hours (for countdown display)
ALTER TABLE markets ADD COLUMN IF NOT EXISTS resolution_window_hours INTEGER;
```

---

### Phase 3: UI Components

**Files to change:** `app/bets/page.tsx`, `components/markets/market-card.tsx`, new components

#### 3.1 Market Type Toggle (New Component)
`components/markets/market-type-toggle.tsx`

A primary toggle at the top of the bets page, above the category tabs:
- Two large buttons: **Sewer Lore [count]** / **Flash Bets [count]**
- Active state: filled neon glow background
- Inactive state: ghost outline
- Icons: Flame for Lore, Zap for Fast
- Below toggle: description text for active type
- Sewer-themed: neon pink for Lore, neon cyan for Fast

```
+--------------------------------------------------+
| [Flame] Sewer Lore [44]  |  [Zap] Flash Bets [20] |
+--------------------------------------------------+
  Sewer Lore: Narrative-driven, long-term prediction
  markets tied to the DatXit sewer ecosystem...
```

#### 3.2 Updated Market Card
- Add a market type badge: `LORE` (pink) or `FAST` (cyan lightning)
- For Fast Markets: show countdown timer instead of "Xd left"
- For Fast Markets: show resolution window ("Resolves in 24h")
- Different glow color: pink for lore, cyan for fast

#### 3.3 Updated Bets Page Flow
Current flow:
```
Stats -> Category Tabs -> Search -> Grid
```

New flow:
```
Stats -> Market Type Toggle -> Description -> Category Tabs -> Search -> Grid
```

The category tabs filter within the selected market type. The stats bar updates
to show type-specific numbers.

#### 3.4 Fast Market Countdown Component
`components/markets/countdown-timer.tsx`

For Fast Markets, display a live countdown: `23h 14m 32s` or `6d 3h`.
Uses `useEffect` with `setInterval` for live updates.
Red pulsing glow when < 1 hour remaining.

---

### Phase 4: Market Detail Page Updates

**Files to change:** `app/markets/[id]/page.tsx`, `components/markets/betting-interface.tsx`

#### 4.1 Market Detail Header
- Show market type badge prominently
- Fast Markets: show countdown timer large
- Fast Markets: show "Quick Resolution" warning banner
- Lore Markets: show lore narrative section with italic story text

#### 4.2 Betting Interface
- Fast Markets: add urgency UI (pulsing border when close to resolution)
- Fast Markets: show "Bet closes in X" warning
- Both types: same multi-token selector ($DATX/SOL/USDC)

---

### Phase 5: API Route Updates

**Files to change:** `app/api/markets/route.ts`

#### 5.1 Add `market_type` filter to markets API
```ts
// GET /api/markets?type=fast&category=crypto&status=active
const marketType = url.searchParams.get('type') || 'all';
```

#### 5.2 Add resolution countdown to market detail API response
Include computed `time_remaining_seconds` field.

---

### Phase 6: Leaderboard Split

**Files to change:** `app/leaderboard/page.tsx`

Optional enhancement: show separate leaderboard rankings for Lore vs Fast bettors.
Tab within leaderboard: "All" / "Sewer Lore" / "Flash Bets"

---

## Implementation Sequence (Execution Order)

| Step | What | Files | Depends On |
|------|------|-------|------------|
| 1 | Add `MarketType` to types.ts | `lib/types.ts` | Nothing |
| 2 | Add `MARKET_TYPE_CONFIG` to constants | `lib/constants.ts` | Step 1 |
| 3 | Tag existing 44 markets as `lore` + generate 20 fast markets | `lib/mock-data.ts` | Step 1 |
| 4 | Run Supabase migration (add columns) | `scripts/003-add-market-type.sql` | Nothing |
| 5 | Create `MarketTypeToggle` component | `components/markets/market-type-toggle.tsx` | Step 2 |
| 6 | Create `CountdownTimer` component | `components/markets/countdown-timer.tsx` | Nothing |
| 7 | Update `MarketCard` with type badge + countdown | `components/markets/market-card.tsx` | Steps 5, 6 |
| 8 | Rebuild `/bets` page with toggle + filtered tabs | `app/bets/page.tsx` | Steps 3, 5, 7 |
| 9 | Update market detail page | `app/markets/[id]/page.tsx` | Steps 6, 7 |
| 10 | Update markets API route | `app/api/markets/route.ts` | Step 4 |

---

## Solana-Specific Adaptations (vs Sui Version)

| Aspect | Sui Version | Solana Version |
|--------|-------------|----------------|
| Lore toggle label | "Lore Markets" | "Sewer Lore" |
| Fast toggle label | "Fast Markets" | "Flash Bets" |
| Lore description | "Narrative-driven... tied to $DUST" | "Narrative-driven, long-term prediction markets tied to the DatXit sewer ecosystem. Slower resolution, deeper lore integration." |
| Fast description | "Quick-resolution... real-world" | "Quick-fire prediction markets on real-world events. Fast resolution, high velocity. Polymarket meets the sewer." |
| Lore color | Orange/flame | Neon pink (#ff00aa) |
| Fast color | Cyan/electric | Neon cyan (#00ffcc) |
| Token references | $DUST | $DATX / SOL / USDC |
| Lore icon | Flame | Flame (same) |
| Fast icon | Zap/Lightning | Zap (same) |
| Theme labels | "Crypto Wars", "Dust Chronicles" etc. | "Satirical", "El Shito", "DatXit" etc. |
| Aesthetic | Dark navy + orange glow | Dark sewer purple + neon pink/cyan glow |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Tab overload (type toggle + category tabs + search) | Keep type toggle visually distinct (large buttons), categories as smaller chips below |
| Fast market countdown performance | Use `requestAnimationFrame` or 1s intervals, cleanup on unmount |
| Hydration mismatch from countdown | Use `isMounted` guard, render placeholder on server |
| Mock data getting unwieldy (64+ markets) | Keep arrays separate by type, combine at export |
| Category overlap (lore market about crypto vs fast market about crypto) | Categories filter within selected type, no confusion |

---

## Estimated Scope

- **Types/Constants**: ~30 lines changed
- **Mock Data**: ~350 lines added (20 fast markets)
- **New Components**: 2 (MarketTypeToggle, CountdownTimer) ~150 lines
- **Modified Components**: 2 (MarketCard, BettingInterface) ~40 lines changed
- **Page Updates**: 2 (bets page, market detail) ~80 lines changed
- **API Updates**: 1 route ~15 lines changed
- **DB Migration**: 1 script ~10 lines
- **Total**: ~675 lines of new/changed code

This is a focused, additive change. No refactoring of existing functionality required.
