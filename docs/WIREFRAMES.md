
# WIREFRAMES — DXMarkets on Solana (Kalshi-Inspired Overhaul)
# ASCII wireframes for all 15 pages + components
# Design direction: Sewer Neon chaos on market pages, toned-down on Legal/Help
# Generated: 2026-02-25

---

## GLOBAL LAYOUT SHELL

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  HEADER (sticky, z-50, bg-[#0a0012]/95 backdrop-blur)                              │
│  ┌────────────┬──────────────────────────────────────┬─────────────────────────┐  │
│  │ DXMarkets  │ MARKETS | LIVE •31 | SOCIAL           │ [Search...] [wallet][≡]│  │
│  │ $DATX logo │  ↑ tab nav                            │                        │  │
│  └────────────┴──────────────────────────────────────┴─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ Trending | Satirical | Crypto | Political | El Shito | DatXit | Xitmas |    │  │
│  │ Tech | Sports | Elections | Market Trends | Custom                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT AREA (3-column max-w-[1440px] mx-auto)                               │
│  ┌──────────────────┬──────────────────────────────────┬───────────────────────┐  │
│  │  LEFT SIDEBAR    │  CENTER CONTENT                   │  RIGHT PANEL          │  │
│  │  (w-64)          │  (flex-1)                         │  (w-80)               │  │
│  │  Category tree   │  Market grid / feed               │  Quick trade / stats  │  │
│  │  with counts     │                                   │                       │  │
│  └──────────────────┴──────────────────────────────────┴───────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  FOOTER (4-column)                                                                 │
│  Company | Social | Product | Legal & Compliance                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 1: HOMEPAGE / MARKETS (/bets — existing, overhauled)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│                    [ SEWER BETS ]   ← DrippingText hero title                       │
│            $DATX prediction markets. Burn to bet. Rise from the sludge.             │
│                                                                                      │
│     ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│     │ 24,500,000    │ │      64       │ │  4,250,000    │ │      4        │        │
│     │ TOTAL VOLUME  │ │ ACTIVE MARKETS│ │  $DATX BURNED │ │   RESOLVED    │        │
│     └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘        │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────────────────────────────────────────────────┐│
│  │  LEFT SIDEBAR    │                                                              ││
│  │                  │  ┌──────────────────────────────────────────────────────┐   ││
│  │  All (64)        │  │  [ ♟ SEWER LORE  44 ] [ ⚡ FLASH BETS  20 ]          │   ││
│  │  > Satirical (4) │  └──────────────────────────────────────────────────────┘   ││
│  │  > Crypto (5)    │                                                              ││
│  │  > Political (5) │  ┌──────────────────────────────────────────────────────┐   ││
│  │  > El Shito (4)  │  │ [🔍 Search all 64 sewer bets...]                     │   ││
│  │  > DatXit (6)    │  └──────────────────────────────────────────────────────┘   ││
│  │  > Xitmas (3)    │                                                              ││
│  │  > Tech (4)      │  [All] [Satirical 4] [Crypto 5] [Political 5] [El Shito]... ││
│  │  > Sports (4)    │                                                              ││
│  │  > Elections (3) │  ── LORE BETS ─────────────────────────────────── 44 total ─││
│  │  > Market Trends │                                                              ││
│  │  > Custom        │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ ││
│  │                  │  │ LORE CARD  │ │ LORE CARD  │ │ FAST CARD  │ │FAST CARD │ ││
│  │  ── LIVE NOW ─── │  │ 🔥 LORE    │ │ 🔥 LORE    │ │ ⚡ FAST    │ │⚡ FAST   │ ││
│  │  ⚡ flash-btc-1  │  │ [category] │ │ [category] │ │ [category] │ │[category]│ ││
│  │  ⚡ fast-sol-1   │  │ Title...   │ │ Title...   │ │ Title...   │ │Title...  │ ││
│  │  ⚡ fast-lakers  │  │ ▓░░░░░ 63% │ │ ▓▓░░░░ 71% │ │ ▓░░░░ 43%  │ │▓▓▓░ 68% │ ││
│  │                  │  │ vol: 62k   │ │ vol: 44k   │ │ 02:14:33 ↓ │ │11:42:09↓│ ││
│  │                  │  └────────────┘ └────────────┘ └────────────┘ └──────────┘ ││
│  └──────────────────┴──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Left sidebar collapses to hamburger on mobile
- MarketTypeToggle (Sewer Lore / Flash Bets) sits above search
- Grid: 4 cols on 1440px, 3 on 1024px, 2 on 768px, 1 on mobile
- Live markets section in sidebar shows Fast markets with countdown
- Right panel appears only on market detail (not list view)

---

## PAGE 2: MARKET DETAIL (/markets/[id] — existing, expanded)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ← Back to Markets                                                                   │
│                                                                                      │
│  ┌──────────────────────────────────────────────┬──────────────────────────────────┐│
│  │  MARKET INFO                                  │  TRADING PANEL                  ││
│  │  ┌─────────────────────────────────────────┐ │  ┌──────────────────────────┐   ││
│  │  │ [⚡ FAST] [crypto] [SOL]                │ │  │  ▓▓▓░░░░░░░░ 43% YES     │   ││
│  │  │                                         │ │  │  Buy YES    │    Buy NO   │   ││
│  │  │ Will BTC close above $150k today?       │ │  │  [ 53¢ ]    │   [ 47¢ ]  │   ││
│  │  │                                         │ │  │  Amount: [$0    ]         │   ││
│  │  │ Quick 24h bet on Bitcoin price.         │ │  │  Token: [SOL ▼]           │   ││
│  │  │                                         │ │  │                           │   ││
│  │  │ ▓▓▓▓▓▓▓▓░░░░░░  YES 64% — NO 36%       │ │  │  [ PLACE BET ]            │   ││
│  │  │                                         │ │  └──────────────────────────┘   ││
│  │  │ ┌──────┬──────┬──────┬──────────────┐   │ │                                 ││
│  │  │ │245k  │245k  │64%   │  02:14:33    │   │ │  STATS                          ││
│  │  │ │VOL   │Y-POOL│ODDS  │  COUNTDOWN   │   │ │  ┌──────────────────────────┐   ││
│  │  │ └──────┴──────┴──────┴──────────────┘   │ │  │ Resolves: Feb 24, 2026   │   ││
│  │  └─────────────────────────────────────────┘ │  │ Created: Feb 23           │   ││
│  │                                               │  │ Token: SOL                │   ││
│  │  COMMENTS                                     │  └──────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────┐ │                                 ││
│  │  │ [avatar] Write a comment...  [Post]     │ │  RELATED MARKETS                ││
│  │  │ ─────────────────────────────────────── │ │  ┌──────────────────────────┐   ││
│  │  │ wallet123: This is def going YES...     │ │  │ [mini card 1]            │   ││
│  │  │ wallet456: Nah, BTC gonna dump lol      │ │  │ [mini card 2]            │   ││
│  │  └─────────────────────────────────────────┘ │  └──────────────────────────┘   ││
│  └──────────────────────────────────────────────┴──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 3: LIVE MARKETS (/live — NEW)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                    [LIVE • 8 active now]     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────────────────────────────────────────────────┐│
│  │  LEFT SIDEBAR    │  LIVE • 8                                                    ││
│  │                  │  ┌───────────────────────────────────────────────────────┐  ││
│  │  Sports (4)      │  │ ⚡ Crypto                                              │  ││
│  │  Crypto (2)      │  │ BTC above $150k today?                   [2 markets]  │  ││
│  │  Politics (2)    │  │ Feb 24 @ resolves in 02:14:33 EST                     │  ││
│  │                  │  └───────────────────────────────────────────────────────┘  ││
│  │  ── RESOLVED ──  │                                                              ││
│  │  Today: 2        │  ┌───────────────────────────────────────────────────────┐  ││
│  │  This week: 4    │  │ ⚡ Sports                                              │  ││
│  │                  │  │ Lakers win tonight?                       [1 market]   │  ││
│  │                  │  │ Feb 24 @ 4:00PM EST   ● LIVE              48 min left  │  ││
│  │                  │  │  Lakers ─────────────────────────── 68%               │  ││
│  │                  │  │  Clippers ─────────────────────── 32%                 │  ││
│  │                  │  └───────────────────────────────────────────────────────┘  ││
│  │                  │                                                              ││
│  │                  │  ┌───────────────────────────────────────────────────────┐  ││
│  │                  │  │ ⚡ Politics                                            │  ││
│  │                  │  │ SEC announces rules this week?            [1 market]   │  ││
│  │                  │  │ Feb 24 @ resolves in 3d 14h                           │  ││
│  │                  │  └───────────────────────────────────────────────────────┘  ││
│  └──────────────────┴──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 4: SOCIAL / SEWER FEED (/social — NEW)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────────────────────────────┬─────────────────────────────┐ │
│  │  LEFT NAV        │  [Ideas] [Live Trades] [Feed] │  TRENDING PREDICTIONS       │ │
│  │  ─────────────── │  ──────────────────────────── │  ──────────────────────── │ │
│  │  Home            │  [avatar] What's your call?   │  #1 BTC $150k — 64% Yes   │ │
│  │  Replies         │                  [GIF] [Post] │  #2 Lakers Win — 68% Yes   │ │
│  │  Bookmarks       │  [Now] [Today] [This Week] .. │  #3 SEC Rules — 42% Yes    │ │
│  │  Profile         │  ─────────────────────────── │                            │ │
│  │  ─────────────── │  ┌──────────────────────────┐ │  WHO TO FOLLOW              │ │
│  │  Community Rules │  │ [🚽avatar] sewer.pant Now │ │  ─────────────────────── │ │
│  │  Support         │  │ Anyone else think BTC is  │ │  wallet123xz... [Follow]  │ │
│  │  FAQs            │  │ about to dump in the 🚽?  │ │  wallet456ab... [Follow]  │ │
│  │  ─────────────── │  │                           │ │                            │ │
│  │  [ + Post ]      │  │ > Will BTC close $150k?   │ │                            │ │
│  │                  │  │   No Position             │ │                            │ │
│  │                  │  │ ♡ 14  💬 3  🔖  ↑  [Buy] │ │                            │ │
│  │                  │  └──────────────────────────┘ │                            │ │
│  │                  │  ┌──────────────────────────┐ │                            │ │
│  │                  │  │ [🚽avatar] datxit.lore 2m │ │                            │ │
│  │                  │  │ [video thumbnail embed]   │ │                            │ │
│  │                  │  │ Lakers game about to be   │ │                            │ │
│  │                  │  │ wild tonight frens        │ │                            │ │
│  │                  │  │ > Lakers Win Tonight?     │ │                            │ │
│  │                  │  │   YES — 68%               │ │                            │ │
│  │                  │  │ ♡ 31  💬 7  🔖  ↑  [Buy] │ │                            │ │
│  │                  │  └──────────────────────────┘ │                            │ │
│  └──────────────────┴──────────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 5: PORTFOLIO / MY BETS (/portfolio — expanded from /my-bets)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  PORTFOLIO — wallet123xz...                                                          │
│                                                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ $12,450    │ │  +$1,230   │ │   68.4%    │ │    23      │ │  rep: 847  │        │
│  │ TOTAL VALUE│ │ TOTAL P&L  │ │  WIN RATE  │ │  TRADES    │ │ REPUTATION │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                                      │
│  [Open Positions] [Closed] [Settled] [History]                                      │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │ MARKET                     SIDE    SIZE    ENTRY   NOW     P&L     STATUS  │    │
│  │ BTC above $150k today?     YES     50 SOL  0.64    0.67   +$4.50  Open    │    │
│  │ Lakers win tonight?        YES     20 SOL  0.68    0.71   +$1.80  Open    │    │
│  │ Will rug founder TED talk? NO      100 DAT 0.29    0.25   +$4.00  Open    │    │
│  │ El Shito tags politician?  YES     50 DAT  0.45    0.48   +$1.50  Closed  │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
│  STAKE STATUS                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │ Staked: 350 DATX / 500 required    ████████░░ 70%                          │    │
│  │ Stake 150 more DATX to unlock market creation  [Stake DATX →]              │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 6: MARKET BUILDER (/market-builder — NEW, stake-gated)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  CREATE A MARKET                                                                     │
│  Reputation required: 500+ DATX staked                                              │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │ STEP 1: MARKET DETAILS                                                       │    │
│  │                                                                              │    │
│  │  Title: [Will _______ happen before _______?                              ] │    │
│  │                                                                              │    │
│  │  Description: [Add context, resolution criteria, lore flavor...           ] │    │
│  │                                                                              │    │
│  │  Category: [Satirical ▼]  Type: [Sewer Lore ▼]  Token: [DATX ▼]           │    │
│  │                                                                              │    │
│  │  Resolution Date: [📅 Pick date]    Window (for Flash Bets): [24h ▼]       │    │
│  │                                                                              │    │
│  │ STEP 2: INITIAL LIQUIDITY                                                    │    │
│  │                                                                              │    │
│  │  Seed amount: [100 DATX    ]  Starting odds: YES [50%] — NO [50%]          │    │
│  │                                                                              │    │
│  │  Fee note: 3.5% taker fee applies. 20% burn, 7% treasury, 3% team.         │    │
│  │                                                                              │    │
│  │ STEP 3: PREVIEW                                                              │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐        │    │
│  │  │ [preview of market card renders here, live-updating]            │        │    │
│  │  └─────────────────────────────────────────────────────────────────┘        │    │
│  │                                                                              │    │
│  │                                      [Cancel]  [Submit Market →]            │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘

GATE STATE (when not eligible):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  🔒 MARKET CREATION LOCKED                                                           │
│  You need 500 DATX staked to unlock market creation.                                │
│  Current stake: 350 DATX  ████████░░ 70%                                            │
│  [Stake DATX to Unlock]                                                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 7: LEADERBOARD (/leaderboard — existing, expanded)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  SEWER LEADERBOARD                                                                   │
│  [Daily] [Weekly] [Monthly] [All Time]                                               │
│                                                                                      │
│  ┌─────┬──────────────────┬──────────┬──────────┬──────────┬──────────────────┐    │
│  │ RNK │ WALLET           │ WIN RATE │ P&L      │ TRADES   │ REPUTATION       │    │
│  ├─────┼──────────────────┼──────────┼──────────┼──────────┼──────────────────┤    │
│  │  1  │ sewer.king...    │  84.2%   │ +$12,450 │   134    │ ████████████ 998 │    │
│  │  2  │ datxit.lord...   │  79.1%   │ +$8,320  │    89    │ ██████████   847 │    │
│  │  3  │ shito.prophet... │  74.5%   │ +$6,100  │    67    │ █████████    712 │    │
│  └─────┴──────────────────┴──────────┴──────────┴──────────┴──────────────────┘    │
│                                                                                      │
│  BURN STATS                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │ Total $DATX Burned: 4,250,000     Last burn: 5 min ago   [View all burns]   │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 8: DEVELOPER / API DOCS (/api-docs — NEW)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┬───────────────────────────────────────────────────────────┐   │
│  │  DOCS NAV        │  DXMarkets Developer API                                 │   │
│  │  ─────────────── │  ─────────────────────────────────────────────────────── │   │
│  │  Getting Started │  [ free tier ]  [ premium $50/mo ]                       │   │
│  │  Authentication  │                                                           │   │
│  │  Markets API     │  QUICKSTART                                               │   │
│  │  Trades API      │  ┌───────────────────────────────────────────────────┐   │   │
│  │  Social API      │  │ npm install @dxmarkets/sdk                        │   │   │
│  │  WebSocket       │  │                                                   │   │   │
│  │  SDK Reference   │  │ import { DXMarkets } from '@dxmarkets/sdk'        │   │   │
│  │  Rate Limits     │  │ const dx = new DXMarkets({ apiKey: 'dx_...' })    │   │   │
│  │  Changelog       │  │ const markets = await dx.markets.list()           │   │   │
│  │                  │  └───────────────────────────────────────────────────┘   │   │
│  │  [ Get API Key ] │  ENDPOINTS                                                │   │
│  │                  │  GET /api/v1/markets         — list markets               │   │
│  │                  │  GET /api/v1/markets/:id     — single market              │   │
│  │                  │  POST /api/v1/trades         — place trade (premium)      │   │
│  │                  │  GET /api/v1/leaderboard     — rankings                   │   │
│  │                  │  GET /api/v1/treasury        — burn + revenue stats       │   │
│  └─────────────────┴───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 9: FEE SCHEDULE (/fee-schedule — NEW)

```
Design: Toned-down neon. Keep #0a0012 bg, softer pink accents, clean table layout.

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  Fee Schedule                                                                        │
│  Last updated: February 2026                                                         │
│                                                                                      │
│  HOW FEES WORK                                                                       │
│  DXMarkets charges a taker fee on all prediction market trades.                     │
│  The fee formula is: Fee = 0.035 × P × (1 - P) where P is the YES probability.     │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────┐     │
│  │  P (odds)   │  Fee Rate  │  Example: 100 DATX bet  │  Net received        │     │
│  │  10% / 90%  │   0.32%    │  0.32 DATX              │  99.68 DATX          │     │
│  │  25% / 75%  │   0.66%    │  0.66 DATX              │  99.34 DATX          │     │
│  │  50% / 50%  │   0.88%    │  0.88 DATX              │  99.12 DATX          │     │
│  │  63% / 37%  │   0.82%    │  0.82 DATX              │  99.18 DATX          │     │
│  └────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                      │
│  FEE DISTRIBUTION                                                                    │
│  ┌──────────────┬─────────────┬────────────────────────────────────────────┐        │
│  │ Burn          │    20%      │ $DATX burned on-chain, reducing supply     │        │
│  │ Treasury      │     7%      │ Community DAO treasury                     │        │
│  │ Team          │     3%      │ Protocol development fund                  │        │
│  └──────────────┴─────────────┴────────────────────────────────────────────┘        │
│                                                                                      │
│  API PRICING                                                                         │
│  ┌──────────────┬─────────────┬───────────────┬──────────────────────────┐          │
│  │ Free         │ $0/month    │ 30 req/min     │ Read-only access          │          │
│  │ Premium      │ $50/month   │ 300 req/min    │ Full read + write SDK     │          │
│  └──────────────┴─────────────┴───────────────┴──────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 10: HELP CENTER (/help — NEW)

```
Design: Toned-down neon. Clean search-first layout.

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER (subtle, muted version)                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│           Help Center                                                                │
│           [🔍 Search for answers...                                               ]  │
│                                                                                      │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐      │
│  │  Getting Started      │ │  Trading Guide        │ │  Account & Wallet     │      │
│  │  ───────────────────  │ │  ──────────────────── │ │  ─────────────────── │      │
│  │  Connect wallet       │ │  How to place a bet   │ │  Wallet connection    │      │
│  │  First trade          │ │  Understanding odds   │ │  Stake $DATX          │      │
│  │  Token types          │ │  Lore vs Flash Bets   │ │  API Keys             │      │
│  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘      │
│                                                                                      │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐      │
│  │  Fees & Revenue       │ │  Market Creation      │ │  Community & Social   │      │
│  │  ───────────────────  │ │  ──────────────────── │ │  ─────────────────── │      │
│  │  Fee schedule         │ │  Eligibility          │ │  Ideas feed           │      │
│  │  Burn mechanism       │ │  Market rules         │ │  Community guidelines │      │
│  │  Rake distribution    │ │  Resolution process   │ │  Responsible trading  │      │
│  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 11: BLOG (/blog — NEW)

```
Design: Toned-down neon. Editorial layout.

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  THE SEWER DIGEST                                                                    │
│  Market intelligence. Lore updates. Protocol news.                                  │
│                                                                                      │
│  ┌──────────────────────────────────────────────────┐ ┌──────────────────────────┐ │
│  │ FEATURED                                          │ │ RECENT POSTS             │ │
│  │ ┌──────────────────────────────────────────────┐ │ │ ─────────────────────── │ │
│  │ │ [hero image]                                  │ │ │ Flash Bets: A Guide     │ │
│  │ │ DXMarkets February 2026 Volume Report         │ │ │ Feb 24, 2026            │ │
│  │ │ $24.5M in total bets, 4.25M DATX burned...   │ │ │                         │ │
│  │ │ Read more →                                   │ │ │ El Shito Lore Explained │ │
│  │ └──────────────────────────────────────────────┘ │ │ Feb 20, 2026            │ │
│  └──────────────────────────────────────────────────┘ └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT: FOOTER (4-column, redesigned)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┬──────────────────┬──────────────────┬───────────────────────┐│
│  │  COMPANY          │  SOCIAL          │  PRODUCT         │  LEGAL & COMPLIANCE   ││
│  │  ───────────────  │  ─────────────── │  ────────────── │  ─────────────────── ││
│  │  Blog             │  X (Twitter)     │  Help Center     │  Privacy Policy       ││
│  │  Careers          │  Discord         │  API Docs        │  Terms of Service     ││
│  │  Brand Kit        │  Telegram        │  Fee Schedule    │  Responsible Trading  ││
│  │  About DXMarkets  │  Reddit          │  Trading Hours   │  Market Integrity     ││
│  │  Contact          │  Instagram       │  FAQ             │  Data Terms           ││
│  │                   │  TikTok          │  Research        │  Cookie Policy        ││
│  │                   │                  │  Institutional   │                       ││
│  │                   │                  │  SDK / NPM       │                       ││
│  └──────────────────┴──────────────────┴──────────────────┴───────────────────────┘│
│                                                                                      │
│  © 2026 DXMarkets. $DATX on Solana. Not financial advice.                           │
│  Trading involves risk. Please review our Responsible Trading guidelines.           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT: HEADER (redesigned — 2-row)

```
ROW 1 (main nav):
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [🚽 DXMarkets $DATX]   MARKETS | LIVE ●8 | SOCIAL    [🔍 Search sewer bets...]    │
│                                                         [Connect Wallet] [Sign Up]  │
└──────────────────────────────────────────────────────────────────────────────────────┘

ROW 2 (category strip):
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  Trending  |  Satirical  |  Crypto  |  Political  |  El Shito  |  DatXit  |  Tech  │
│  Sports  |  Elections  |  Market Trends  |  Custom                                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT: MARKET GROUP CARD (Kalshi-style, multi-outcome)

```
For markets with sub-outcomes (e.g. "Who will Trump mention?"):
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Will El Shito visit which city first?                           [lore icon]        │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  New York          ─────────────────────────────────  1.90x  [ 51% ]               │
│  Los Angeles       ────────────────────────────────   1.83x  [ 48% ]               │
│  ─────────────────────────────────────────────────────────────────────────────────  │
│  $62,000 vol                                                       3 markets        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## MOBILE LAYOUT (breakpoint: < 768px)

```
┌────────────────────────┐
│ [🚽DXMkt] [≡] [wallet] │  ← header collapses, hamburger menu
├────────────────────────┤
│ [All] [Lore] [Fast]    │  ← type toggle stays
│ [🔍 Search...]         │
│ [Satirical][Crypto]... │  ← horizontal scroll tabs
├────────────────────────┤
│  ┌──────────────────┐  │
│  │  MARKET CARD     │  │  ← single column cards
│  │  🔥 LORE | crypto│  │
│  │  Title...        │  │
│  │  ▓▓░░ 63%        │  │
│  │  62k vol  14d↓   │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  MARKET CARD     │  │
│  └──────────────────┘  │
├────────────────────────┤
│ FOOTER (stacked)       │
└────────────────────────┘
```

---

## DESIGN TOKENS (updated for overhaul)

```css
/* Sewer Neon — Market Pages */
--color-primary:        #ff00aa;  /* neon pink — Lore markets */
--color-secondary:      #00ffcc;  /* neon cyan — Flash Bets */
--color-accent:         #8b4513;  /* sewer brown — El Shito/DatXit lore */
--color-action:         #1dd1a1;  /* mint green — CTAs, buy buttons, gains */
--color-alert:          #ff4444;  /* urgent red — countdown urgent, losses */
--color-background:     #0a0012;  /* deep sewer dark */
--color-surface:        #12001f;  /* card backgrounds */
--color-border:         #ff00aa33;/* subtle neon borders */

/* Toned Down — Legal/Help Pages */
--color-toned-bg:       #0f0f0f;  /* near-black, not purple */
--color-toned-surface:  #1a1a1a;  /* slightly lighter for cards */
--color-toned-border:   #333333;  /* muted borders */
--color-toned-text:     #e0e0e0;  /* readable white */
--color-toned-muted:    #888888;  /* secondary text */
--color-toned-accent:   #ff00aa66;/* muted pink, still branded */
```
