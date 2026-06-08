# DXMarkets - Sewer Bets on Solana

## Agent Prompt Sequence

> 14 standalone prompts, ordered easiest to hardest.
> Each prompt is self-contained: an agent with access to the listed reference docs can execute it without prior conversation context.
> Every prompt includes acceptance criteria and testing steps.

---

## How to Use This File

1. Feed each prompt to an agent **one at a time**, in order.
2. Before starting a prompt, ensure all listed **prerequisites** (prior prompts) are complete and passing tests.
3. Each prompt references docs from this repo. Make sure the agent can read them:
   - `/docs/master-plan.md` - Full phased build plan with code skeletons, design rules, lore microcopy
   - `/docs/ARCHITECTURE.md` - System architecture, Mermaid diagrams, DB schema, API specs, Anchor program design, token registry
4. The agent should treat the **Design System & Lore Rules** in `master-plan.md` Section 3 as mandatory for every UI component.
5. Token references: `$DATX` mint `HwqrGdE2kb32PqyUQNg3vETUmmUbkmG3KnS9rVMWpump`, USDC mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`, wSOL mint `So11111111111111111111111111111111111111112`.

---

## Prompt 1 - Design System & Global Theme

**Difficulty:** Easy
**Layer:** Frontend
**Prerequisites:** None (first task)
**Reference Docs:** `master-plan.md` Section 3 (Design System & Lore Rules), Section 4 task P0-T1

### Prompt

```
You are building the design system for "DXMarkets - Sewer Bets on Solana", a satirical prediction market app.

READ these files first:
- /docs/master-plan.md (Section 3: Design System & Lore Rules, Section 4: P0-T1)
- /docs/ARCHITECTURE.md (Section 2.1: Frontend Layer)

TASK: Implement the full design system and global theme. This includes:

1. Update `app/globals.css` with ALL sewer theme design tokens from master-plan.md Section 3:
   - Background: #0a0012 to #12001a (deep purple-black)
   - Accent neon: #ff00aa (hot pink)
   - Accent cyan: #00ffcc (toxic cyan drips)
   - Accent sludge: #ff6600 (burnt orange)
   - Sludge brown: #4a2c0f to #8b4513
   - Text primary: #f0f0f0, text secondary: #a0a0ff
   - Define --font-sans and --font-display (Bangers) in @theme inline
   - Add neon box-shadow tokens, drip keyframe animations, glow animations

2. Update `app/layout.tsx`:
   - Import Bangers from next/font/google as the display font
   - Import Geist Sans as the body font
   - Set metadata title "DXMarkets - Sewer Bets on Solana" and appropriate description
   - Apply font CSS variables to the html element

3. Create these base sewer components in `components/sewer/`:
   - `neon-card.tsx` - Card with black bg, neon pink border glow (box-shadow: 0 0 20px #ff00aa80), optional drip CSS pseudo-element on hover
   - `sludge-button.tsx` - Hot pink bg, black text, dripping hover animation, disabled state
   - `sewer-modal.tsx` - Dark glassmorphism overlay (#12001a80), neon rim glow, centered content
   - `dripping-text.tsx` - Heading text with Bangers font, optional drip animation on characters
   - `odds-bar.tsx` - Horizontal bar showing Yes (cyan) / No (pink) probability split, animated fill
   - `token-selector.tsx` - Dropdown/segmented control to pick $DATX / SOL / USDC, with token icons

4. Create `components/layout/sewer-bg.tsx`:
   - Full-page background layer with subtle animated drip effects using CSS
   - Faint sewer pipe divider patterns
   - This sits behind all page content

5. Create `lib/microcopy.ts`:
   - Export arrays of sewer microcopy strings from master-plan.md Section 13 (loaders, tooltips, empty states, errors, success messages, footer extras)
   - Export a `getRandomMicrocopy(category)` utility function

6. Create `hooks/use-microcopy.ts`:
   - React hook that returns a random microcopy string for a given category
   - Memoized so it doesn't change on every render (only on mount or explicit refresh)

DESIGN RULES (mandatory):
- Max 5 colors total (the ones listed above)
- Bangers for headings (font-display), Geist Sans for body (font-sans)
- All cards: black base, pink neon border glow, drip pseudo-elements on hover
- All buttons: hot pink bg, black text, drip animation on hover
- Modals: dark glassmorphism, neon rim
- NO purple or violet used prominently. The background is deep purple-BLACK (very dark).
- Use semantic Tailwind tokens (bg-background, text-foreground, etc.) mapped to the sewer palette

TESTING:
- Visually verify globals.css compiles with no Tailwind errors
- Import and render each component in a test page to confirm:
  - NeonCard shows pink glow border
  - SludgeButton has pink bg, black text, hover drip animation
  - SewerModal overlays with glassmorphism
  - DrippingText renders Bangers font
  - OddsBar shows colored probability split
  - TokenSelector renders 3 token options
  - SewerBg renders behind content with drip effects
- Verify `getRandomMicrocopy('loaders')` returns a random loader string
- Verify layout.tsx renders with correct fonts and metadata
```

### Acceptance Criteria
- [ ] globals.css has all sewer design tokens, animations, and font config
- [ ] layout.tsx imports Bangers + Geist Sans, sets metadata
- [ ] 6 sewer components created and rendering correctly
- [ ] sewer-bg.tsx provides full-page background layer
- [ ] microcopy.ts has all strings from master-plan.md Section 13
- [ ] use-microcopy.ts hook works and memoizes correctly
- [ ] No Tailwind compilation errors

---

## Prompt 2 - Compliance Layer (Age Gate, Cookie Banner, Privacy, Disclaimers)

**Difficulty:** Easy
**Layer:** Frontend + API
**Prerequisites:** Prompt 1 (Design System)
**Reference Docs:** `master-plan.md` Section 4 task P0-T4, `ARCHITECTURE.md` Sections 10, 4.5

### Prompt

```
You are building the compliance layer for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 4: P0-T4 Compliance Scaffolding, Section 3: Design Rules)
- /docs/ARCHITECTURE.md (Section 10: Compliance Architecture, Section 4.5: Compliance Flow diagram)

The design system from Prompt 1 is already built. Use the sewer components (NeonCard, SludgeButton, SewerModal) and theme tokens.

TASK: Implement the full compliance scaffolding:

1. `components/compliance/age-gate-modal.tsx`:
   - Full-screen SewerModal overlay that appears on first visit
   - Title: "ENTER THE SEWER" in Bangers font with neon glow
   - Body text: "You must be 18+ to enter. This is satirical entertainment only. No financial advice. Everything is shit."
   - SludgeButton: "I'm 18+ - Let Me In"
   - On accept: store in localStorage AND POST to /api/consent with type 'age_gate'
   - Small footer text: "By entering you agree to our Terms & Disclaimers" (link to /disclaimers)
   - On decline or close: redirect to external page or show "Exit" message

2. `components/compliance/cookie-banner.tsx`:
   - Bottom-of-screen sticky banner, sewer themed (dark bg, neon border top)
   - Text: "This sewer uses cookies to track your degeneracy. Accept or decline."
   - Two buttons: "Accept Cookies" (pink) and "Decline" (ghost/outline)
   - On accept/decline: store preference, POST to /api/consent with type 'cookie'
   - Dismiss after choice

3. `app/api/consent/route.ts`:
   - POST endpoint that accepts { type: string, accepted: boolean }
   - For now, log to console (Supabase integration comes later)
   - Return 200 with { success: true }
   - Validate input: type must be 'age_gate' | 'cookie' | 'tos'

4. `app/privacy/page.tsx`:
   - GDPR privacy policy page using sewer theme
   - Sections: What We Collect, How We Use It, Your Rights (Access, Delete, Rectify), Cookies, Contact
   - "Export My Data" button (disabled, shows toast "Coming Soon")
   - "Delete My Account" button (disabled, shows toast "Coming Soon")
   - All content should be clear and legally reasonable (but with sewer-themed section headers)
   - Include back link to /bets

5. `app/disclaimers/page.tsx`:
   - Legal disclaimers page
   - Key sections: "Entertainment Only" (not financial advice), "No Gambling Guarantee", "+18 Only", "Risk Warning", "Token Disclaimer"
   - Sewer-themed headers, clean readable body text
   - Footer microcopy from the lore arsenal

6. `components/layout/footer.tsx`:
   - Sticky footer with links: Privacy Policy, Disclaimers, Terms of Service
   - Sewer microcopy (random footer extra from lib/microcopy.ts)
   - Copyright: "2025-2026 DatXit Ecosystem. Proudly the shittiest."
   - Neon border top, dark background

7. Wire age-gate-modal and cookie-banner into the root layout so they appear on every page load (age gate first, then cookie banner after dismissal).

DESIGN RULES:
- Use SewerModal for the age gate
- Sewer theme throughout (dark bg, neon accents, Bangers headings)
- Cookie banner should not block the age gate (show sequentially)
- All text must be readable (f0f0f0 on dark backgrounds)
- Footer links must be clearly visible

TESTING:
- Clear localStorage, reload page: age gate modal should appear
- Accept age gate: modal disappears, cookie banner appears
- Accept cookies: banner disappears, verify /api/consent receives POST
- Navigate to /privacy: page renders with all sections
- Navigate to /disclaimers: page renders with all sections
- Footer appears on every page with correct links
- Verify no hydration errors
```

### Acceptance Criteria
- [ ] Age gate modal appears on first visit, stores acceptance, logs consent
- [ ] Cookie banner appears after age gate, stores preference, logs consent
- [ ] /api/consent endpoint receives and validates POST requests
- [ ] /privacy page renders with GDPR content and disabled export/delete buttons
- [ ] /disclaimers page renders with legal content
- [ ] Footer renders on all pages with compliance links + microcopy
- [ ] Sequential flow: age gate -> cookie banner -> content

---

## Prompt 3 - Mock Data & Constants

**Difficulty:** Easy
**Layer:** Frontend (data)
**Prerequisites:** Prompt 1 (Design System)
**Reference Docs:** `master-plan.md` Section 5 task P1-T1 (mock data), `ARCHITECTURE.md` Section 3 (Token Registry)

### Prompt

```
You are setting up the mock data layer for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 5: P1-T1 mock market data, Section 11: file structure)
- /docs/ARCHITECTURE.md (Section 3: Token Registry, Section 7: API response shapes, Section 12: State Management)

TASK: Create the data layer files:

1. `lib/constants.ts`:
   - Export TOKEN_MINTS object with $DATX, USDC, wSOL mint addresses from ARCHITECTURE.md Section 3
   - Export PROGRAM_ID placeholder
   - Export SOLANA_NETWORK ('devnet')
   - Export SOLANA_RPC URL
   - Export BURN_RATE_BPS (2000), TREASURY_RATE_BPS (700), TEAM_RATE_BPS (300)
   - Export MARKET_CATEGORIES array: ['satirical', 'crypto', 'political', 'el-shito', 'datxit', 'xitmas', 'tech', 'sports', 'custom']
   - Export TOKEN_OPTIONS array: [{ value: 'DATX', label: '$DATX', mint: '...', decimals: 9 }, { value: 'SOL', ... }, { value: 'USDC', ... }]

2. `lib/mock-data.ts`:
   - Export MOCK_MARKETS array with ALL 8 mock markets from master-plan.md Section 5 P1-T1
   - Each market must match the MarketsResponse shape from ARCHITECTURE.md Section 7
   - Export MOCK_POSITIONS array: 5 fake user positions with PNL values
   - Export MOCK_LEADERBOARD array: 10 mock "Shittiest Oracles" entries with wallet, win_rate, profit, rank
   - Export MOCK_COMMENTS array: 5 satirical comments for market detail pages
   - Export MOCK_TREASURY: { total_burned: 125000, total_rake: 45000, total_volume: 3200000, markets_resolved: 12 }

3. `lib/types.ts`:
   - Export TypeScript interfaces matching ARCHITECTURE.md Section 7 response shapes:
     - Market, Position, User, LeaderboardEntry, TreasuryStats, ConsentLog
     - MarketsResponse, PlaceOrderRequest, GenerateMarketResponse
   - Export TokenType = 'DATX' | 'SOL' | 'USDC'
   - Export MarketStatus = 'active' | 'closed' | 'resolved' | 'cancelled'
   - Export MarketCategory string union

4. `lib/wallet-store.ts`:
   - Zustand store matching ARCHITECTURE.md Section 12 walletStore schema exactly
   - Include persist middleware with key 'dxmarkets-wallet'
   - Use the code skeleton from master-plan.md Section 4 P0-T3

5. `lib/market-store.ts`:
   - Zustand store matching ARCHITECTURE.md Section 12 marketStore schema
   - markets, activeMarket, filters, loading + actions

6. `lib/bet-store.ts`:
   - Zustand store matching ARCHITECTURE.md Section 12 betStore schema
   - selectedSide, amount, tokenType, pendingTx, txStatus + actions

7. `lib/ui-store.ts`:
   - Zustand store matching ARCHITECTURE.md Section 12 uiStore schema
   - showAgeGate, showCookieBanner, sidebarOpen, activeModal + actions

TESTING:
- Import MOCK_MARKETS and verify it has 8 entries with correct shape
- Import each Zustand store, call actions, verify state changes
- Verify TypeScript types compile without errors
- Verify constants match ARCHITECTURE.md token addresses exactly
```

### Acceptance Criteria
- [ ] constants.ts has correct token mints, program ID, rates, categories
- [ ] mock-data.ts has 8 markets, 5 positions, 10 leaderboard entries, 5 comments, treasury stats
- [ ] types.ts has all interfaces matching ARCHITECTURE.md API shapes
- [ ] 4 Zustand stores created matching ARCHITECTURE.md Section 12 exactly
- [ ] All TypeScript compiles without errors
- [ ] Mock data shapes match the type interfaces

---

## Prompt 4 - Home/Dashboard Page (`/bets`)

**Difficulty:** Medium
**Layer:** Frontend
**Prerequisites:** Prompts 1 (Design System), 2 (Compliance), 3 (Mock Data)
**Reference Docs:** `master-plan.md` Section 5 tasks P1-T1, P1-T7, `ARCHITECTURE.md` Section 11

### Prompt

```
You are building the Home/Dashboard page for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 5: P1-T1 Home/Dashboard, P1-T7 Navigation)
- /docs/ARCHITECTURE.md (Section 11: Frontend Route Map, Section 2.1: Frontend Layer)
- Review the existing components in components/sewer/ and lib/ directories

The design system (Prompt 1), compliance layer (Prompt 2), and mock data (Prompt 3) are all built.

TASK: Build the main dashboard page and navigation:

1. `components/layout/header.tsx`:
   - Top navigation bar with DXMarkets logo/title ("SEWER BETS" in Bangers font with neon glow)
   - Nav links: Markets, Create, My Bets, Leaderboard, Lore
   - Right side: Wallet connect button (mock for now - show "Connect Wallet" or truncated address)
   - Mobile: hamburger menu that opens a sewer-themed side drawer
   - Neon border bottom, dark background
   - Active route indicator (neon underline)

2. `app/bets/layout.tsx`:
   - Bets section layout that wraps all /bets/* pages
   - Include Header, SewerBg background, and Footer
   - Main content area with appropriate padding

3. `app/bets/page.tsx` (Home/Dashboard):
   - Hero section at top:
     - Title: "SEWER BETS" in large Bangers font with neon glow animation
     - Subtitle: "Bet on the Shit. Feed the Hole. Win the Sludge."
     - Two CTAs: "Browse Markets" (scroll to grid) and "Create Market" (link to /bets/create)
   - Category filter bar: horizontal scrollable chips for each category (All, Satirical, Crypto, Political, etc.)
   - Markets grid:
     - Use NeonCard for each market from MOCK_MARKETS
     - Each card shows: title, truncated description, Yes/No OddsBar, volume, burn counter, time remaining, token type badge, status
     - Cards link to /bets/market/[id]
   - Sidebar section (desktop) or below grid (mobile):
     - "Your Bets" summary (mock: 3 active positions from MOCK_POSITIONS)
     - "Top Flushers" mini leaderboard (top 3 from MOCK_LEADERBOARD)
   - Sewer microcopy scattered: use getRandomMicrocopy() for empty states, tooltips on market cards

4. `components/sewer/market-card.tsx`:
   - Standalone market card component used in the grid
   - Props: market data object
   - Shows title (Bangers), description (truncated 2 lines), OddsBar, volume, burn counter
   - Token type badge ($DATX / SOL / USDC with appropriate colors)
   - Time remaining countdown (formatted as "2d 5h" or "Ended")
   - Status badge (active = green, closed = yellow, resolved = gray)
   - Hover: neon glow intensifies, subtle drip animation at bottom
   - Links to /bets/market/[id]

5. `app/page.tsx` (root landing):
   - Redirect to /bets

DESIGN RULES:
- Mobile-first responsive layout
- Markets grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- Hero uses full-width with SewerBg behind it
- Category chips: horizontal scroll on mobile, wrap on desktop
- Sidebar: right side on desktop (aside), full width below grid on mobile
- All text readable, proper contrast
- Neon accents used sparingly (borders, glows, CTAs only)

TESTING:
- Navigate to /: should redirect to /bets
- /bets page shows hero, category filter, 8 market cards in grid
- Each market card displays all required data (title, odds, volume, burn, time, token)
- Category filter chips are clickable (filter the mock data client-side)
- Sidebar shows mock positions and mini leaderboard
- Mobile view: single column grid, hamburger menu works, sidebar stacks below
- Click a market card: navigates to /bets/market/[id]
- Scattered microcopy visible in tooltips or empty states
- No layout shifts or hydration errors
```

### Acceptance Criteria
- [ ] Header with nav links, wallet connect button, mobile hamburger menu
- [ ] /bets/layout.tsx wraps all bets pages with header, bg, footer
- [ ] /bets/page.tsx has hero, category filter, 8 market cards, sidebar
- [ ] market-card.tsx shows all required data fields with correct styling
- [ ] Root / redirects to /bets
- [ ] Mobile responsive (1/2/3 column grid breakpoints)
- [ ] Category filtering works client-side on mock data
- [ ] All sewer theme rules followed (colors, fonts, neon glows)

---

## Prompt 5 - Market Detail Page (`/bets/market/[id]`)

**Difficulty:** Medium
**Layer:** Frontend
**Prerequisites:** Prompts 1-4
**Reference Docs:** `master-plan.md` Section 5 task P1-T2, `ARCHITECTURE.md` Sections 7, 11

### Prompt

```
You are building the Market Detail page for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 5: P1-T2 Market Detail)
- /docs/ARCHITECTURE.md (Section 7: API response shapes, Section 11: Route Map)
- Review existing: components/sewer/*, lib/mock-data.ts, lib/types.ts

TASK: Build the full market detail page:

1. `app/bets/market/[id]/page.tsx`:
   - Dynamic route that looks up market by ID from MOCK_MARKETS
   - If not found: show sewer-themed 404 ("Sewer Overflow 404 - This market was flushed")
   - Page sections (top to bottom):

   a. Market Header:
      - Title in Bangers font with neon glow
      - Category badge, status badge, token type badge
      - Creator address (truncated), created date
      - Time remaining countdown (large, prominent)

   b. Price/Odds Section:
      - Large OddsBar showing Yes/No split
      - Yes price and No price displayed as percentages
      - Volume counter (formatted: "$125K")
      - Burn counter with fire/sludge icon ("12,500 $DATX burned")

   c. Price Chart:
      - `components/sewer/price-chart.tsx` - Static mock line chart using Recharts
      - Shows mock price history for Yes outcome over ~30 data points
      - Neon cyan line on dark background, grid lines in muted color
      - X-axis: dates, Y-axis: price 0-1

   d. Bet Form:
      - `components/sewer/bet-form.tsx`
      - Side selector: two large buttons "YES" (cyan glow) and "NO" (pink glow)
      - Token selector dropdown (TokenSelector component): $DATX / SOL / USDC
      - Amount input with max button (shows mock balance)
      - Payout estimate: "Est. payout: X.XX [token]" calculated from current odds
      - Burn warning: "Warning: 20% of losing side feeds the Reserve Hole"
      - Submit button: SludgeButton "FLUSH THE BET" (disabled with "Coming Soon" toast)

   e. Description:
      - Full satirical description text
      - "El Shito says..." section with a random lore quip

   f. Comments Section:
      - 3-5 mock comments from MOCK_COMMENTS
      - Each with truncated wallet address, timestamp, comment text
      - "Add Comment" input (disabled, "Coming Soon")

   g. Related Markets:
      - 2-3 other markets from same category
      - Horizontal scroll of mini MarketCards

2. `components/sewer/price-chart.tsx`:
   - Recharts LineChart with mock data (generate 30 points of random walk between 0.3 and 0.7)
   - Styled with sewer theme: dark bg, cyan line, pink grid
   - Responsive container
   - Tooltip shows date + price

3. `components/sewer/bet-form.tsx`:
   - Self-contained bet form component
   - Uses betStore from Zustand for state (selectedSide, amount, tokenType)
   - Calculates estimated payout based on current odds
   - Shows balance for selected token (mock values from walletStore)
   - Validation: amount > 0, amount <= balance
   - Submit triggers toast "Coming Soon - Flush Bets" (mock mode)

DESIGN RULES:
- Mobile: single column stack
- Desktop: two-column layout (chart + info left, bet form right)
- Chart and bet form should have NeonCard wrappers
- Bet form side buttons should clearly indicate selected state (glow effect)
- All numbers formatted with commas and appropriate decimals
- Token amounts show token symbol ($DATX, SOL, USDC)

TESTING:
- Navigate to /bets/market/el-shito-bank-tag: page renders with correct market data
- Navigate to /bets/market/nonexistent: shows 404 page
- Price chart renders with 30 mock data points, cyan line visible
- Bet form: click Yes/No toggles selection with visual glow
- Token selector switches between $DATX/SOL/USDC
- Amount input validates (no negative, respects mock balance)
- Payout estimate updates when amount/side changes
- "FLUSH THE BET" button shows "Coming Soon" toast
- Comments section renders mock comments
- Related markets section shows 2-3 cards
- Responsive: stacks to single column on mobile
```

### Acceptance Criteria
- [ ] Dynamic route resolves markets by ID from mock data
- [ ] 404 page for invalid IDs
- [ ] Market header with all badges, countdown timer
- [ ] OddsBar, volume counter, burn counter displayed
- [ ] Price chart renders with Recharts (mock data, sewer theme)
- [ ] Bet form with side toggle, token selector, amount input, payout estimate
- [ ] Bet form submit shows "Coming Soon" toast
- [ ] Comments section with mock data
- [ ] Related markets horizontal scroll
- [ ] Desktop two-column, mobile single-column layout

---

## Prompt 6 - Create Market, My Bets, Leaderboard, Lore Pages

**Difficulty:** Medium
**Layer:** Frontend
**Prerequisites:** Prompts 1-5
**Reference Docs:** `master-plan.md` Section 5 tasks P1-T3, P1-T4, P1-T5, P1-T6

### Prompt

```
You are building the remaining four mock pages for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 5: P1-T3 Create Market, P1-T4 My Bets, P1-T5 Leaderboard, P1-T6 Lore)
- /docs/ARCHITECTURE.md (Section 11: Route Map, Section 7: API shapes)
- Review existing: components/sewer/*, lib/mock-data.ts, lib/types.ts

TASK: Build all four pages:

1. `app/bets/create/page.tsx` (Create Market):
   - Form with fields: title, description, category (dropdown), end date (date picker), token type (TokenSelector)
   - All inputs use sewer theme (dark inputs, neon focus borders)
   - Satirical placeholders: title = "Propose a shitty event...", description = "Describe the inevitable..."
   - Category dropdown populated from MARKET_CATEGORIES constant
   - "Generate a Shitty Market" AI button (mock): on click, fills form with random market from a pre-written list of 5 satirical suggestions (hardcoded for now)
   - Submit button: SludgeButton "SUBMIT TO SEWER COUNCIL"
   - On submit: show toast "Proposal Submitted - Under Review by the Sewer Council"
   - Form validation: title required (min 10 chars), description required (min 20 chars), end date must be future
   - Preview card: as user fills form, show a live preview MarketCard below

2. `app/bets/my-bets/page.tsx` (My Bets Portfolio):
   - Top section: wallet summary card showing mock balances ($DATX, SOL, USDC)
   - "Active Positions" section: grid of 3 NeonCards from MOCK_POSITIONS
     - Each shows: market title, side (Yes/No badge), amount, token, current PNL (green/red)
     - PNL formatted with + or - prefix and color
   - "Bet History" section: table using shadcn Table component
     - Columns: Market, Side, Amount, Token, Result (Won/Lost/Pending), PNL, Date
     - 5 rows of mock historical data
     - Lost bets show sludge icon, won bets show trophy icon
   - Token breakdown chart: simple bar or pie chart showing portfolio split by token type
   - Empty state (if no bets): "Nothing here yet. Everything is shit anyway." + link to /bets
   - "Claim All Payouts" button (disabled, "Coming Soon" toast)

3. `app/bets/leaderboard/page.tsx` (Leaderboard):
   - Title: "THE SHITTIEST ORACLES" in Bangers with neon glow
   - Period filter: 3 tabs (Weekly, Monthly, All-Time) - switches mock data display
   - Top 3 podium section: large cards for rank 1/2/3
     - Rank 1: gold sludge trophy + "Top Flusher" badge
     - Rank 2: silver, Rank 3: bronze
     - Show wallet (truncated), profit, win rate
   - Ranks 4-10: table rows with NeonCard styling
     - Columns: Rank, Wallet, Win Rate %, Profit, Total Bets
     - Wallet addresses truncated with copy-to-clipboard button
   - Data from MOCK_LEADERBOARD
   - Sewer microcopy at bottom: "Democracy is shit. SHIT DAO is shittier."

4. `app/bets/lore/page.tsx` (Lore & Rules):
   - Hero section: "WHY SEWER BETS?" in Bangers
   - How It Works section (4 steps with icons):
     1. "Pick a Shitty Market" (browse icon)
     2. "Flush Your Bet" (plunger icon)
     3. "Wait for Resolution" (hourglass icon)
     4. "Win or Feed the Hole" (fire icon)
   - Token Info section: cards for $DATX, SOL, USDC with descriptions
     - $DATX: "The native shit token. Bet, burn, govern."
     - SOL: "The sewer's fast lane. Wrapped for compatibility."
     - USDC: "Stable stench. For the risk-averse degen."
   - Reserve Hole Stats: mock burn counter, total volume, animated fire graphic
   - "Ask El Shito" chat input section:
     - Text input with neon border
     - Submit shows mock response: "El Shito is napping in the sewer. AI lore chat coming soon."
   - El Shito character section: brief lore about the mascot
   - Multiple microcopy quotes scattered throughout

DESIGN RULES:
- All pages use consistent sewer theme
- Forms use dark input backgrounds with neon focus states
- Tables use dark rows with alternating slight opacity difference
- Leaderboard podium: visually prominent top-3 section
- Lore page: educational but satirical tone throughout
- Mobile responsive for all pages

TESTING:
- /bets/create: form renders, placeholders visible, AI button fills mock data, submit shows toast, validation prevents empty submission
- /bets/my-bets: wallet summary shows mock balances, 3 position cards render, history table has 5 rows, PNL colors correct
- /bets/leaderboard: top 3 podium renders, table shows ranks 4-10, period tabs switch (UI only), copy wallet works
- /bets/lore: all 4 "How It Works" steps render, token cards render, Reserve Hole stats animate, "Ask El Shito" shows mock response
- All pages accessible from header navigation
- All pages responsive on mobile
```

### Acceptance Criteria
- [ ] Create Market page with validated form, AI mock button, live preview card, submit toast
- [ ] My Bets page with wallet summary, position cards, history table, token chart
- [ ] Leaderboard page with podium (top 3), table (4-10), period tabs, copy wallet
- [ ] Lore page with how-it-works, token info, Reserve Hole stats, mock Ask El Shito
- [ ] All 4 pages use sewer theme consistently
- [ ] All 4 pages mobile responsive
- [ ] Navigation links work from header to all pages

---

## Prompt 7 - Supabase Database Schema & API Endpoints

**Difficulty:** Medium
**Layer:** Backend (Database + API)
**Prerequisites:** Prompt 3 (Types/Constants)
**Reference Docs:** `master-plan.md` Section 4 task P0-T2, Section 6 task P2-T2, `ARCHITECTURE.md` Sections 5, 6, 7

### Prompt

```
You are building the database schema and API layer for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 4: P0-T2 Supabase Schema, Section 6: P2-T2 REST API)
- /docs/ARCHITECTURE.md (Section 5: Database Schema with ER diagram, SQL functions, RLS policies, Section 7: API Architecture)
- Review lib/types.ts for TypeScript interfaces

TASK: Build the full database schema and API routes:

1. `scripts/001-create-tables.sql`:
   - Enable pgvector extension
   - Create ALL tables from ARCHITECTURE.md Section 5 ER diagram:
     - markets, positions, users, leaderboards, consent_logs, treasury_logs, lore_embeddings, market_proposals
   - Match column types exactly as specified in the ER diagram and master-plan.md P0-T2

2. `scripts/002-create-functions.sql`:
   - Create the `match_lore` pgvector similarity search function from ARCHITECTURE.md Section 5
   - Create the `refresh_leaderboard` function from ARCHITECTURE.md Section 5

3. `scripts/003-create-rls.sql`:
   - Enable RLS on all tables
   - Create policies from ARCHITECTURE.md Section 5 (markets: public read + admin write, positions: user read/write own, consent_logs: insert only)
   - Add service role bypass for API routes

4. `scripts/004-seed-markets.sql`:
   - INSERT the 8 mock markets from MOCK_MARKETS into the markets table
   - INSERT 10 mock users for the leaderboard
   - INSERT 5 mock positions
   - INSERT mock treasury_logs entries

5. REST API routes (all in `app/api/`):

   a. `app/api/markets/route.ts`:
      - GET: List markets with optional filters (category, status, token_type)
      - Pagination support (page, limit params)
      - Returns MarketsResponse shape from lib/types.ts
      - Use Supabase client with service role key

   b. `app/api/markets/[id]/route.ts`:
      - GET: Single market detail by ID
      - Include aggregated position counts (total bettors, yes count, no count)

   c. `app/api/markets/[id]/orderbook/route.ts`:
      - GET: Simple yes/no aggregated orderbook
      - Returns: { yes_total, no_total, yes_price, no_price, positions_count }

   d. `app/api/orders/route.ts`:
      - POST: Record a bet (after on-chain TX confirmed)
      - Accepts PlaceOrderRequest from lib/types.ts
      - Validates: market exists, market is active, amount > 0, tx_signature present
      - INSERT into positions table
      - UPDATE markets table (increment yes_pool or no_pool, total_volume)
      - UPDATE users table (increment total_bets)

   e. `app/api/positions/[wallet]/route.ts`:
      - GET: All positions for a wallet address
      - Include market title, current odds, unrealized PNL

   f. `app/api/leaderboard/route.ts`:
      - GET: Top 100 leaderboard entries
      - Filter by period (weekly, monthly, all-time)
      - Cache-friendly headers (5 min cache)

   g. `app/api/treasury/route.ts`:
      - GET: Aggregated treasury stats
      - Total burned, total rake, total volume, markets resolved count

   h. Update `app/api/consent/route.ts`:
      - Now INSERT into consent_logs table in Supabase (replace console.log)
      - Hash the IP address before storing

6. All API routes should:
   - Return proper error responses with sewer-themed messages
   - Include proper TypeScript typing
   - Handle Supabase errors gracefully
   - Use the Supabase service role client (not anon key) for server-side operations

TESTING:
- Execute SQL scripts against Supabase (scripts run in order: 001, 002, 003, 004)
- GET /api/markets returns 8 seeded markets with correct shape
- GET /api/markets?category=crypto returns only crypto markets
- GET /api/markets/[valid-id] returns single market
- GET /api/markets/[invalid-id] returns 404
- GET /api/leaderboard returns 10 entries sorted by profit
- GET /api/treasury returns aggregated stats
- POST /api/consent with valid body returns 200
- POST /api/orders with valid body creates position and updates market
```

### Acceptance Criteria
- [ ] 4 SQL scripts created (tables, functions, RLS, seed data)
- [ ] 8 API routes created matching ARCHITECTURE.md Section 7 spec
- [ ] All routes return proper TypeScript-typed responses
- [ ] Markets API supports filtering and pagination
- [ ] Orders API validates input and updates both positions and markets tables
- [ ] Consent API writes to Supabase with hashed IP
- [ ] Error responses use sewer-themed messages
- [ ] All SQL executes without errors on Supabase

---

## Prompt 8 - Wire Frontend to Supabase APIs (Replace Mock Data)

**Difficulty:** Medium
**Layer:** Frontend + Backend Integration
**Prerequisites:** Prompts 4-6 (all pages), Prompt 7 (APIs)
**Reference Docs:** `ARCHITECTURE.md` Section 12 (Data Fetching Strategy)

### Prompt

```
You are wiring the frontend to real Supabase APIs for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/ARCHITECTURE.md (Section 12: State Management, Data Fetching Strategy table)
- Review all pages in app/bets/* and all API routes in app/api/*
- Review lib/types.ts for interfaces and lib/*-store.ts for Zustand stores

TASK: Replace all mock data with real API calls using SWR:

1. `hooks/use-market-data.ts`:
   - SWR hook for fetching markets list from GET /api/markets
   - Support category and status filter params
   - Cache: 30s stale-while-revalidate (per ARCHITECTURE.md Section 12)
   - Return { markets, isLoading, error, mutate }

2. `hooks/use-market-detail.ts`:
   - SWR hook for fetching single market from GET /api/markets/[id]
   - Cache: 10s
   - Return { market, isLoading, error }

3. `hooks/use-positions.ts`:
   - SWR hook for fetching user positions from GET /api/positions/[wallet]
   - Only fetch when wallet is connected (conditional SWR)
   - Cache: 60s
   - Return { positions, isLoading, error }

4. `hooks/use-leaderboard.ts`:
   - SWR hook for GET /api/leaderboard with period filter
   - Cache: 5 minutes
   - Return { entries, isLoading, error }

5. `hooks/use-treasury.ts`:
   - SWR hook for GET /api/treasury
   - Cache: 2 minutes
   - Return { stats, isLoading, error }

6. Update ALL pages to use SWR hooks instead of direct mock data imports:
   - `app/bets/page.tsx`: use useMarketData() for grid, useLeaderboard() for sidebar, usePositions() for "Your Bets"
   - `app/bets/market/[id]/page.tsx`: use useMarketDetail(id) for all data
   - `app/bets/my-bets/page.tsx`: use usePositions(wallet) for positions
   - `app/bets/leaderboard/page.tsx`: use useLeaderboard(period) for all data
   - `app/bets/lore/page.tsx`: use useTreasury() for Reserve Hole stats

7. Add loading states for all data-dependent sections:
   - Use skeleton components or sewer-themed loaders ("Flushing the cache...", "Brewing fresh sludge...")
   - Use microcopy from lib/microcopy.ts for loader text

8. Add error states:
   - Sewer-themed error messages ("Sewer overflow - try again")
   - Retry button on errors

9. Fallback behavior: If API is unreachable, fall back to MOCK_MARKETS/MOCK_POSITIONS so the UI still works in mock mode.
   - Check walletStore.mockMode - if true, skip API calls and use mock data

DESIGN RULES:
- Loading skeletons should pulse with neon glow animation
- Error states use red/orange sewer colors
- Data transitions should be smooth (no layout shifts between loading -> loaded)

TESTING:
- With Supabase connected: /bets shows real seeded markets from DB
- With Supabase disconnected: /bets falls back to mock data
- Toggle mockMode in walletStore: verify mock vs real data switching
- Loading states visible briefly on initial page load
- Filter markets by category: new API call fires, grid updates
- Leaderboard period tabs trigger new API calls
- /bets/my-bets shows empty state when no wallet connected
- All error states render correctly when API returns errors
```

### Acceptance Criteria
- [ ] 5 SWR hooks created with appropriate cache times
- [ ] All 5 bets pages updated to use SWR hooks
- [ ] Loading states with sewer-themed microcopy
- [ ] Error states with retry buttons
- [ ] Mock mode fallback works when mockMode is true
- [ ] No layout shifts between loading and loaded states
- [ ] Category/period filters trigger real API calls

---

## Prompt 9 - Solana Wallet Adapter Integration

**Difficulty:** Medium-Hard
**Layer:** Frontend (Blockchain Integration)
**Prerequisites:** Prompts 1, 3 (Design System, Stores)
**Reference Docs:** `master-plan.md` Section 4 task P0-T3, `ARCHITECTURE.md` Sections 2.4, 3, 9, 12, 13

### Prompt

```
You are integrating Solana wallet connection for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 4: P0-T3 Wallet Connection Provider)
- /docs/ARCHITECTURE.md (Section 2.4: Blockchain Layer, Section 3: Token Registry, Section 9: Multi-Token Flow, Section 12: walletStore, Section 13: Authentication Flow)
- Review lib/wallet-store.ts and lib/constants.ts

TASK: Implement full Solana wallet integration:

1. Install required packages:
   - @solana/wallet-adapter-base
   - @solana/wallet-adapter-react
   - @solana/wallet-adapter-react-ui
   - @solana/wallet-adapter-wallets (Phantom, Solflare)
   - @solana/web3.js
   - @solana/spl-token

2. `components/providers.tsx`:
   - WalletProvider wrapping ConnectionProvider and WalletModalProvider
   - Configure for devnet (using SOLANA_RPC from constants.ts)
   - Include Phantom and Solflare wallet adapters
   - Wrap the entire app in this provider (update layout.tsx)

3. Update `lib/wallet-store.ts`:
   - Add real balance fetching logic
   - When wallet connects: fetch SOL balance (native), $DATX balance (SPL token account), USDC balance (SPL token account)
   - Use mint addresses from constants.ts TOKEN_MINTS
   - Handle case where token account doesn't exist (balance = 0)
   - Re-fetch balances on an interval (every 30 seconds) while connected

4. `components/sewer/wallet-button.tsx`:
   - Custom wallet connect button styled with sewer theme
   - Disconnected state: SludgeButton "Connect Wallet" with plunger icon
   - Connected state: show truncated wallet address + SOL balance + dropdown menu
   - Dropdown: "Copy Address", "View on Explorer", "Disconnect" options
   - On connect: update walletStore with address and balances
   - On disconnect: reset walletStore

5. `components/sewer/wallet-balances.tsx`:
   - Component showing all 3 token balances in a row/stack
   - $DATX balance with DATX icon, SOL balance with SOL icon, USDC balance with USDC icon
   - Formatted with appropriate decimals (DATX: 2, SOL: 4, USDC: 2)
   - Refresh button to re-fetch balances
   - Used in header and my-bets page

6. Update `components/layout/header.tsx`:
   - Replace mock wallet button with real WalletButton component
   - Show WalletBalances when connected (desktop only, condensed)

7. `lib/solana.ts`:
   - Helper functions:
     - `getTokenBalance(connection, wallet, mint)` - fetch SPL token balance
     - `getSolBalance(connection, wallet)` - fetch native SOL balance
     - `getMintForToken(tokenType)` - return PublicKey for token type
     - `formatTokenAmount(amount, tokenType)` - format with correct decimals

8. Handle network switching:
   - walletStore.network controls devnet vs mainnet-beta
   - Switching network should reconnect and re-fetch balances
   - Default to devnet for now

TESTING:
- Load page: "Connect Wallet" button visible in header
- Click "Connect Wallet": Phantom/Solflare modal opens
- After connecting:
  - Wallet address displayed (truncated) in header
  - walletStore updated with address and balances
  - SOL balance matches Phantom display
  - $DATX and USDC balances fetched (likely 0 on devnet, show 0.00)
- Disconnect: walletStore resets, button shows "Connect Wallet" again
- Balance refresh: after 30s, balances re-fetch without page reload
- WalletBalances component shows all 3 tokens with correct formatting
- Network is devnet (check connection URL)
- If no Phantom installed: modal shows "Install Phantom" link
```

### Acceptance Criteria
- [ ] Wallet adapter packages installed and configured
- [ ] providers.tsx wraps app with Solana wallet providers
- [ ] WalletButton connects/disconnects with sewer theme styling
- [ ] Real SOL, $DATX, USDC balances fetched on connect
- [ ] Balances auto-refresh every 30 seconds
- [ ] WalletBalances component shows all 3 tokens
- [ ] Header updated with real wallet button
- [ ] walletStore updates on connect/disconnect
- [ ] Network configured for devnet

---

## Prompt 10 - RAG AI System (pgvector + Vercel AI SDK)

**Difficulty:** Medium-Hard
**Layer:** Backend (AI)
**Prerequisites:** Prompt 7 (Database with pgvector)
**Reference Docs:** `master-plan.md` Section 6 task P2-T4, `ARCHITECTURE.md` Sections 4.4, 8

### Prompt

```
You are building the RAG AI system for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 6: P2-T4 RAG AI System)
- /docs/ARCHITECTURE.md (Section 4.4: RAG AI Pipeline diagram, Section 8: RAG AI Architecture, system prompt template)

TASK: Implement the full RAG pipeline:

1. `scripts/embed-lore.ts` (Node.js script):
   - Read all .md files from /docs/ directory
   - Chunk each file into ~500 token segments with 50 token overlap
   - For each chunk: call OpenAI text-embedding-3-small to get 1536-dim embedding
   - INSERT into lore_embeddings table (content, metadata: { source, chunk_index }, embedding)
   - Log progress and total chunks embedded
   - This script runs once to populate the vector store

2. `app/api/rag/query/route.ts`:
   - POST endpoint accepting { query: string }
   - Pipeline (following ARCHITECTURE.md Section 8):
     a. Embed the query using text-embedding-3-small (via OpenAI API)
     b. Call Supabase RPC `match_lore(embedding, 0.7, 5)` for top-5 similar chunks
     c. Build augmented prompt using system prompt template from ARCHITECTURE.md Section 8
     d. Generate response using Vercel AI SDK 6: `generateText` with model 'openai/gpt-4o-mini' via AI Gateway
     e. Return { answer: string, sources: chunk[] }
   - Rate limit: 20/min (log only for now, Upstash integration later)
   - Input validation: query must be non-empty, max 500 chars
   - System prompt must include El Shito persona from ARCHITECTURE.md Section 8

3. `app/api/rag/generate-market/route.ts`:
   - POST endpoint accepting { topic?: string, category?: string }
   - Uses RAG pipeline to generate a satirical market title + description
   - System prompt extension: "Generate a prediction market that is satirical, provocative, and fits the DatXit sewer lore. Include a title (max 100 chars) and description (max 300 chars)."
   - Return GenerateMarketResponse from lib/types.ts
   - If topic provided, focus generation on that topic
   - If no topic, generate something random from lore context

4. Update `app/bets/create/page.tsx`:
   - Wire the "Generate a Shitty Market" button to POST /api/rag/generate-market
   - On click: show loading state ("El Shito is thinking..."), call API, fill form fields with response
   - Handle errors gracefully (fallback to hardcoded suggestions)

5. Update `app/bets/lore/page.tsx`:
   - Wire the "Ask El Shito" input to POST /api/rag/query
   - On submit: show loading state, call API, display response in a chat-like bubble
   - Show source citations (collapsed/expandable)
   - Handle errors: "El Shito choked on sludge. Try again."

6. Use AI SDK 6 patterns:
   - Import from 'ai' package (generateText, streamText if streaming desired)
   - Model string: 'openai/gpt-4o-mini' (uses Vercel AI Gateway, zero config)
   - No need for provider packages - AI Gateway handles it

TESTING:
- Run scripts/embed-lore.ts: verify lore_embeddings table populated (check row count)
- POST /api/rag/query with { query: "What is El Shito?" }: returns satirical answer + sources
- POST /api/rag/query with { query: "" }: returns 400 error
- POST /api/rag/generate-market with { topic: "crypto" }: returns market title + description
- POST /api/rag/generate-market with no body: returns random market
- /bets/create: "Generate a Shitty Market" button calls API and fills form
- /bets/lore: "Ask El Shito" input sends query and displays response
- Verify El Shito persona is consistent in all responses (satirical, dark humor, lore-aware)
```

### Acceptance Criteria
- [ ] embed-lore.ts script chunks and embeds all /docs/*.md files into pgvector
- [ ] /api/rag/query returns RAG-augmented satirical answers with sources
- [ ] /api/rag/generate-market returns AI-generated market titles + descriptions
- [ ] System prompt matches ARCHITECTURE.md El Shito persona
- [ ] Create Market page AI button wired to API
- [ ] Lore page Ask El Shito input wired to API
- [ ] Error handling and loading states on both pages
- [ ] Uses Vercel AI SDK 6 with AI Gateway (no provider packages)

---

## Prompt 11 - WebSocket Live Feed (Supabase Realtime)

**Difficulty:** Medium-Hard
**Layer:** Backend + Frontend
**Prerequisites:** Prompts 7-8 (Database + API wiring)
**Reference Docs:** `master-plan.md` Section 6 task P2-T5, `ARCHITECTURE.md` Section 7 (WebSocket Channels)

### Prompt

```
You are building real-time live feeds for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 6: P2-T5 WebSocket Live Feed)
- /docs/ARCHITECTURE.md (Section 7: WebSocket Channels table with events and payloads)

TASK: Implement Supabase Realtime subscriptions:

1. `hooks/use-realtime-market.ts`:
   - Subscribe to Supabase Realtime channel `market:{id}` for a specific market
   - Listen for Postgres changes on the `markets` table (UPDATE where id matches)
   - Listen for Postgres changes on the `positions` table (INSERT where market_id matches)
   - On position insert: recalculate yes_price/no_price and update local state
   - On market update: update market data (status change, resolution, etc.)
   - Clean up subscription on unmount
   - Return { liveMarket, liveBets, isConnected }

2. `hooks/use-realtime-leaderboard.ts`:
   - Subscribe to Realtime channel `leaderboards`
   - Listen for changes on leaderboards table
   - Auto-update leaderboard display when rankings change
   - Return { liveLeaderboard, isConnected }

3. `hooks/use-realtime-treasury.ts`:
   - Subscribe to Realtime channel `treasury`
   - Listen for INSERT on treasury_logs table
   - On burn event: show burn animation notification
   - Return { liveStats, lastBurnEvent, isConnected }

4. `components/sewer/live-indicator.tsx`:
   - Small pulsing dot (green = connected, red = disconnected) shown next to real-time data
   - "LIVE" label with sewer styling

5. `components/sewer/bet-feed.tsx`:
   - Real-time scrolling feed of recent bets across all markets
   - Each entry: "[wallet] bet [amount] [token] [YES/NO] on [market]"
   - Auto-scrolls, max 20 entries visible
   - Neon styling, new entries flash cyan briefly
   - Used on the dashboard sidebar

6. `components/sewer/burn-notification.tsx`:
   - Toast/popup notification when a burn event occurs
   - Animated sludge fire effect
   - Shows: "[amount] $DATX burned to Reserve Hole from [market]"
   - Auto-dismisses after 5 seconds

7. Update pages to use realtime hooks:
   - /bets/page.tsx: add BetFeed to sidebar, LiveIndicator next to "Active Markets"
   - /bets/market/[id]/page.tsx: use useRealtimeMarket(id) for live odds/volume updates
   - /bets/leaderboard/page.tsx: use useRealtimeLeaderboard()
   - Show BurnNotification globally in layout

8. Enable Supabase Realtime on required tables:
   - Write `scripts/005-enable-realtime.sql` to enable Realtime publication on: markets, positions, treasury_logs, leaderboards

TESTING:
- Open /bets/market/[id] in two browser tabs
- In tab 1, simulate a bet insert (via Supabase dashboard SQL editor or API call)
- Tab 2 should update odds/volume in real-time without page reload
- LiveIndicator shows green dot when connected
- BetFeed on dashboard shows new entries as they arrive
- When treasury_log with type='burn' is inserted, BurnNotification appears
- Disconnect network briefly: LiveIndicator turns red, reconnects when network returns
```

### Acceptance Criteria
- [ ] 3 realtime hooks created for markets, leaderboard, treasury
- [ ] LiveIndicator component shows connection status
- [ ] BetFeed shows scrolling real-time bet activity
- [ ] BurnNotification fires on burn events with animation
- [ ] Market detail page updates live when positions change
- [ ] Leaderboard updates live when rankings change
- [ ] SQL script enables Realtime on required tables
- [ ] Subscriptions clean up properly on unmount

---

## Prompt 12 - Admin Dashboard (`/admin`)

**Difficulty:** Hard
**Layer:** Frontend + Backend
**Prerequisites:** Prompts 7-8 (APIs), Prompt 11 (Realtime)
**Reference Docs:** `master-plan.md` Section 6 task P2-T6, `ARCHITECTURE.md` Sections 7, 13

### Prompt

```
You are building the admin dashboard for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 6: P2-T6 Admin Dashboard)
- /docs/ARCHITECTURE.md (Section 7: API endpoints, Section 13: Security Architecture - Authentication Flow)

TASK: Build the protected admin area:

1. Admin authentication middleware:
   - `app/admin/layout.tsx`: check if connected wallet is in ADMIN_WALLETS env var
   - If not admin: show "Access Denied - This sewer pipe is restricted" page
   - Server-side: create `app/api/admin/verify/route.ts` that checks wallet against env var
   - For extra security: require a password in addition to wallet (stored in ADMIN_PASSWORD env var)
   - Admin login flow: connect wallet -> if wallet in whitelist -> prompt for password -> verify -> grant access

2. `app/admin/page.tsx` (Admin Dashboard):
   - Overview cards at top:
     - Total Active Markets (count)
     - Total Volume (sum across all markets)
     - Total Burned (sum of burn treasury_logs)
     - Active Users (count of users with bets in last 30 days)
   - Charts section (using Recharts via shadcn charts):
     - Volume over time (bar chart, last 30 days)
     - Burns over time (area chart, last 30 days)
     - Market categories distribution (pie chart)
   - Recent Activity table: last 20 bets/positions with market, wallet, side, amount, timestamp
   - Pending Proposals section: market_proposals with status='pending'

3. `app/admin/markets/page.tsx` (Market Management):
   - Table of all markets with sortable columns (title, status, volume, created)
   - Actions per market: View, Edit Status, Resolve, Cancel
   - Status filters: All, Active, Closed, Resolved, Cancelled
   - "Create Market" button (admin can create without proposal queue)
   - Bulk actions: close expired markets

4. `app/admin/resolve/[id]/page.tsx` (Market Resolution):
   - Market detail summary (title, description, pools, volume)
   - Resolution form:
     - Outcome selector: "YES" or "NO" with clear visual
     - Burn preview: "This will burn [X] $DATX to Reserve Hole"
     - Rake preview: "Treasury: [X], Team: [X]"
     - Payout preview: "Winners split: [X]"
   - Confirmation step: "Are you sure? This action is irreversible. The sewer decides."
   - On confirm: POST to /api/admin/resolve with market_id and outcome
   - Show transaction summary after resolution

5. `app/api/admin/resolve/route.ts`:
   - POST endpoint: { market_id, outcome, admin_wallet }
   - Verify admin wallet against ADMIN_WALLETS
   - UPDATE markets table: resolved=true, outcome, status='resolved'
   - Calculate and INSERT treasury_logs: burn, rake, payout entries
   - UPDATE users: increment total_wins for winners
   - Return resolution summary

6. `app/admin/users/page.tsx` (User Management):
   - Table of users: wallet, total_bets, total_wins, win_rate, total_volume, joined_at
   - Sortable, searchable by wallet
   - Click user: show detail modal with all their positions

7. API routes for admin:
   - `app/api/admin/verify/route.ts`: POST { wallet, password } -> { authorized: boolean }
   - `app/api/admin/stats/route.ts`: GET aggregated dashboard stats
   - `app/api/admin/resolve/route.ts`: POST market resolution

DESIGN RULES:
- Admin uses the same sewer theme but slightly more professional/muted
- shadcn Table components for all data tables
- Charts use sewer colors (pink for primary, cyan for secondary, orange for accents)
- Confirmation dialogs use SewerModal with warning styling

TESTING:
- Visit /admin with non-admin wallet: "Access Denied" page shown
- Visit /admin with admin wallet + correct password: dashboard loads
- Dashboard cards show correct aggregated numbers from DB
- Charts render with correct data
- Markets table shows all markets, sorting and filtering works
- Navigate to /admin/resolve/[id]: resolution form shows correct preview calculations
- Submit resolution: markets table updates, treasury_logs created
- Users page shows all users, search by wallet works
```

### Acceptance Criteria
- [ ] Admin auth: wallet whitelist + password verification
- [ ] Dashboard with 4 stat cards and 3 charts
- [ ] Markets management table with sort/filter/actions
- [ ] Resolution page with outcome selector, burn/rake preview, confirmation
- [ ] Resolution API updates markets, treasury_logs, users tables
- [ ] Users management table with search
- [ ] Admin API routes created and protected
- [ ] Sewer theme applied to all admin pages

---

## Prompt 13 - Anchor Escrow Program (Solana Smart Contract)

**Difficulty:** Hard
**Layer:** Smart Contract (Rust)
**Prerequisites:** Understanding of ARCHITECTURE.md Section 6 (Anchor Program Architecture)
**Reference Docs:** `master-plan.md` Section 6 task P2-T1, `ARCHITECTURE.md` Sections 4.6, 6, 9

### Prompt

```
You are building the Anchor smart contract for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 6: P2-T1 Anchor Escrow Program with full Rust skeleton)
- /docs/ARCHITECTURE.md (Section 4.6: Account Graph, Section 6: Program Architecture with PDA seeds, instruction matrix, rake/burn math, Section 9: Multi-Token Flow)

TASK: Implement the complete Anchor program:

1. Project setup:
   - `anchor/Anchor.toml`: Configure for Solana devnet, program ID
   - `anchor/programs/sewer_bets/Cargo.toml`: Dependencies (anchor-lang v0.30+, anchor-spl)
   - `anchor/programs/sewer_bets/src/lib.rs`: Main program file

2. Implement ALL instructions from ARCHITECTURE.md Section 6 instruction matrix:

   a. `create_market(title, description, end_timestamp, token_type)`:
      - Init Market PDA with seeds: ["market", market_id_bytes]
      - Init Market Pool token account with seeds: ["pool", market_pubkey]
      - Set all initial fields (creator, title, desc, end_ts, token_type, pools=0, resolved=false)
      - Emit MarketCreated event
      - Constraints: title max 200 chars, description max 500 chars, end_timestamp in future

   b. `place_bet(side, amount)`:
      - Transfer tokens from bettor to Market Pool via SPL token::transfer
      - Init or update Position PDA (seeds: ["position", market_pubkey, user_pubkey])
      - Update market.yes_pool or market.no_pool
      - Update market.total_volume
      - Emit BetPlaced event
      - Constraints: market not resolved, market not ended, amount > 0

   c. `resolve_market(outcome)`:
      - Admin/multisig only (require admin signer)
      - Calculate burn, treasury, team amounts using exact math from ARCHITECTURE.md Section 6 "Rake & Burn Math"
      - Execute token::burn for $DATX (burn_amount from losing pool)
      - For USDC: transfer to dead address instead of burn (no mint authority)
      - Execute token::transfer for treasury + team rake
      - Set market.resolved = true, market.outcome
      - Emit MarketResolved + TokensBurned events
      - Constraints: market not already resolved, market end_timestamp passed

   d. `claim_payout(position)`:
      - Calculate user's pro-rata share of payout pool
      - Math: payout = (user_winning_amount / winning_pool) * payout_pool
      - Execute token::transfer from pool to claimer
      - Emit PayoutClaimed event
      - Constraints: market resolved, user has winning position, amount > 0

   e. `cancel_market()`:
      - Admin only
      - Refund all positions (transfer tokens back from pool to each position holder)
      - Set market.status = cancelled
      - Emit MarketCancelled event

3. Account structs exactly as specified in master-plan.md P2-T1:
   - Market (creator, title, description, end_timestamp, token_type, resolved, outcome, yes_pool, no_pool, total_volume, bump)
   - Position (user, market, yes_amount, no_amount)
   - TokenType enum (DATX, SOL, USDC)

4. All events: MarketCreated, BetPlaced, MarketResolved, PayoutClaimed, TokensBurned, MarketCancelled

5. Error codes: AlreadyResolved, MarketNotEnded, MarketEnded, ZeroAmount, NotResolved, NoPayout, Unauthorized, TitleTooLong, DescriptionTooLong

6. Context structs with proper account constraints:
   - CreateMarket: init market PDA, init pool ATA, check creator signer
   - PlaceBet: mutable market, init_if_needed position, bettor token account, pool, bettor signer
   - ResolveMarket: mutable market, pool, mint, treasury, team wallet, admin signer
   - ClaimPayout: market (read), position (read), pool (mutable), claimer token, claimer signer
   - CancelMarket: mutable market, pool, admin signer

7. `anchor/tests/sewer_bets.ts`:
   - Anchor test file using @coral-xyz/anchor and mocha
   - Test: create market -> place bets (both sides) -> resolve -> claim payout
   - Verify: pool balances, position amounts, burn execution, rake distribution, payout amounts
   - Test: cannot bet after market ends
   - Test: cannot resolve before end timestamp
   - Test: cannot claim if on losing side
   - Test: cancel market refunds all positions

IMPORTANT MATH (from ARCHITECTURE.md Section 6):
- burn_amount = losing_pool * 2000 / 10000 (20% of losing pool)
- treasury_cut = total_volume * 700 / 10000 (7%)
- team_cut = total_volume * 300 / 10000 (3%)
- payout_pool = total_volume - burn_amount - treasury_cut - team_cut
- user_payout = (user_winning_amount / winning_pool) * payout_pool

TESTING:
- `anchor test` passes all test cases
- Create market: Market PDA created with correct seeds and data
- Place bet: tokens transferred to pool, position updated, market pools updated
- Resolve market: burn executed, rake distributed, market marked resolved
- Claim payout: correct pro-rata amount transferred to winner
- Cancel market: all tokens refunded
- Error cases: all constraints properly enforced
```

### Acceptance Criteria
- [ ] Full Anchor program with 5 instructions (create, bet, resolve, claim, cancel)
- [ ] Market, Position, TokenType account structs
- [ ] Proper PDA derivation with seeds from ARCHITECTURE.md
- [ ] Burn mechanic: 20% of losing pool burned for $DATX, dead-address for USDC
- [ ] Rake split: 7% treasury, 3% team from total volume
- [ ] Pro-rata payout calculation for winners
- [ ] 6 events emitted
- [ ] 8+ error codes with descriptive messages
- [ ] Test suite covering: full lifecycle, edge cases, error cases
- [ ] All tests pass on devnet

---

## Prompt 14 - Frontend-to-Anchor Integration (Live Bets)

**Difficulty:** Hard
**Layer:** Frontend + Blockchain
**Prerequisites:** Prompt 9 (Wallet), Prompt 13 (Anchor Program)
**Reference Docs:** `master-plan.md` Section 6 task P2-T3, `ARCHITECTURE.md` Sections 4.2 (Bet Lifecycle), 9 (Multi-Token Flow)

### Prompt

```
You are wiring the frontend to the Anchor smart contract for "DXMarkets - Sewer Bets on Solana".

READ these files first:
- /docs/master-plan.md (Section 6: P2-T3 Frontend-Anchor Integration with usePlaceBet hook skeleton)
- /docs/ARCHITECTURE.md (Section 4.2: Bet Lifecycle sequence diagram, Section 9: Multi-Token Flow per instruction)
- Review: hooks/use-place-bet.ts skeleton, components/sewer/bet-form.tsx

The Anchor program (Prompt 13) is deployed to devnet. The wallet adapter (Prompt 9) is integrated.

TASK: Make real bets work end-to-end:

1. `lib/anchor-client.ts`:
   - Initialize Anchor Program from IDL (import or fetch IDL JSON)
   - Export function to get program instance: getProgram(connection, wallet)
   - Export PDA derivation helpers:
     - getMarketPDA(marketId)
     - getPositionPDA(marketPubkey, userPubkey)
     - getPoolPDA(marketPubkey)
   - Export mint address lookup: getMintForToken(tokenType)

2. `hooks/use-place-bet.ts` (full implementation):
   - Following the skeleton from master-plan.md P2-T3
   - Build and send place_bet transaction:
     a. Get user's token account (ATA) for selected token
     b. Get market PDA and pool PDA
     c. Build instruction via program.methods.placeBet(side, new BN(amount))
     d. Sign with wallet adapter
     e. Send and confirm transaction
   - After on-chain confirmation: POST to /api/orders to record in Supabase
   - Handle SOL: auto-wrap to wSOL before betting, unwrap on payout
   - Return { placeBet, loading, error, txSignature }
   - Status tracking: idle -> signing -> confirming -> confirmed -> synced

3. `hooks/use-claim-payout.ts`:
   - Build and send claim_payout transaction
   - After confirmation: update positions in Supabase
   - Handle wSOL unwrap for SOL payouts
   - Return { claimPayout, loading, error, txSignature }

4. Update `components/sewer/bet-form.tsx`:
   - Remove "Coming Soon" behavior
   - Wire to usePlaceBet hook
   - Before submit: show confirmation modal with:
     - "You're betting [amount] [token] that [market title] is [YES/NO]"
     - "If you lose, 20% feeds the Reserve Hole."
     - "Estimated payout: [calculated amount]"
     - "FLUSH THE BET" confirmation button
   - During TX: show signing -> confirming progress states
   - After TX confirmed: success toast with TX link to Solana explorer
   - On error: error toast with sewer message + retry option

5. `components/sewer/bet-confirmation-modal.tsx`:
   - SewerModal with bet summary
   - Shows: market title, selected side, amount, token, estimated payout, burn warning
   - "FLUSH THE BET" SludgeButton to confirm
   - "Cancel" button to dismiss
   - Loading state during TX signing/confirmation

6. `components/sewer/tx-status-toast.tsx`:
   - Transaction status toast component
   - States: Signing (wallet icon spinning), Confirming (sewer pipe animation), Confirmed (green check), Failed (red X)
   - Include link to Solana Explorer for confirmed/failed TXs
   - Auto-dismiss after 10 seconds for confirmed, persist for failed

7. Update `app/bets/my-bets/page.tsx`:
   - Add "Claim Payout" button on winning resolved positions
   - Wire to useClaimPayout hook
   - Show claim confirmation and TX status
   - After claim: position updates to "Claimed" status

8. Multi-token handling per ARCHITECTURE.md Section 9:
   - $DATX: direct SPL transfer (standard flow)
   - SOL: wrap to wSOL first, then SPL transfer, unwrap on claim
   - USDC: direct SPL transfer (standard flow)
   - Token selector in bet form shows real balances from walletStore

TESTING:
- Connect Phantom wallet on devnet
- Navigate to /bets/market/[id], select YES, enter amount, click "FLUSH THE BET"
- Confirmation modal appears with correct summary
- Approve in Phantom: TX signing -> confirming -> confirmed flow
- Toast shows TX link to Solana Explorer
- Market odds update after bet is confirmed
- POST /api/orders is called to sync to Supabase
- Navigate to /bets/my-bets: new position appears
- If market resolved as winner: "Claim Payout" button appears
- Click claim: TX flow, tokens returned to wallet
- Balance updates after claim
- Test with each token type ($DATX, SOL, USDC)
- Test error case: insufficient balance shows error
- Test error case: market ended shows "Market has ended" error
```

### Acceptance Criteria
- [ ] anchor-client.ts initializes program and derives PDAs
- [ ] usePlaceBet hook sends real on-chain transactions
- [ ] useClaimPayout hook claims real payouts
- [ ] Bet form wired to real transactions (no more "Coming Soon")
- [ ] Confirmation modal shows bet summary before signing
- [ ] TX status toast tracks signing -> confirming -> confirmed/failed
- [ ] My Bets page has working "Claim Payout" for winners
- [ ] Multi-token handling: $DATX direct, SOL wrapped, USDC direct
- [ ] Supabase synced after each on-chain action
- [ ] Error handling for insufficient balance, ended market, failed TX

---

## Dependency Map

```
Prompt 1: Design System ─────────────────────────────┐
    |                                                 |
    v                                                 |
Prompt 2: Compliance ────────────────────┐            |
    |                                    |            |
    v                                    |            |
Prompt 3: Mock Data & Constants ─────────┤            |
    |                                    |            |
    v                                    |            |
Prompt 4: Home/Dashboard ───────────────┐|            |
    |                                   ||            |
    v                                   ||            |
Prompt 5: Market Detail ────────────────┤|            |
    |                                   ||            |
    v                                   ||            |
Prompt 6: Remaining Pages ─────────────┐||            |
                                       |||            |
Prompt 7: Database & APIs ─────────────┤||            |
    |                                  |||            |
    v                                  |||            |
Prompt 8: Wire Frontend to APIs ───────┘||            |
    |                                    ||           |
    v                                    ||           |
Prompt 9: Wallet Adapter ───────────────┘|            |
    |                                     |           |
    v                                     |           |
Prompt 10: RAG AI ────────────────────────┘           |
    |                                                 |
    v                                                 |
Prompt 11: Realtime WebSocket ────────────────────────┘
    |
    v
Prompt 12: Admin Dashboard
    |
    v
Prompt 13: Anchor Smart Contract (can start in parallel from Prompt 1)
    |
    v
Prompt 14: Frontend-to-Anchor Integration
```

---

## Parallel Execution Notes

- **Prompts 1-6** must be sequential (each builds on the previous)
- **Prompt 7** can start after Prompt 3 (needs types/constants only)
- **Prompt 9** can start after Prompt 3 (needs stores/constants only)
- **Prompt 13** can start independently (Rust/Anchor, no frontend dependency) - assign to a Rust-specialized agent
- **Prompt 10** requires Prompt 7 (database with pgvector)
- **Prompt 11** requires Prompts 7-8 (database + API wiring)
- **Prompt 12** requires Prompts 7-8, 11
- **Prompt 14** requires Prompts 9, 13 (wallet + anchor program)

**Optimal parallel tracks:**
- Track A (Frontend): 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 8 -> 14
- Track B (Backend): 3 -> 7 -> 10 -> 11 -> 12
- Track C (Blockchain): 13 (independent, merge at 14)
- Track D (Wallet): 9 (merge at 14)

---

> *"14 prompts. 14 flushes. One shitty market to rule them all."*
> *Built on Solana. Orchestrated by agents. Approved by El Shito.*
