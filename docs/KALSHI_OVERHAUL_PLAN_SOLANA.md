# KALSHI_OVERHAUL_PLAN_SOLANA.md – Complete Development Plan for DXMarkets on Solana

## Executive Summary

This document outlines a comprehensive overhaul of DXMarkets (Solana) to match Kalshi's market structure, design patterns, and revenue model. The plan includes 15 new pages, redesigned UI/UX, integrated revenue mechanics (taker fees, rake split, burn events), new database tables, 25+ API endpoints, JavaScript SDK, and a 14-week phased implementation roadmap. This mirrors the Sui version's scope but adapted for Solana's architecture and the sewer lore aesthetic.

---

## PHASE 0: Strategic Alignment & Design System

### 0.1 Design Overhaul

**Current DXMarkets Aesthetic:** Sewer neon (pink/cyan glows, dripping text, chaotic lore)
**Target:** Merge Kalshi's clean professional layout with DXMarkets' sewer chaos aesthetic
**New Color Palette:**
- Primary: Neon Pink (#ff00aa) – existing, keep for Sewer Lore
- Secondary: Neon Cyan (#00ffcc) – existing, keep for Flash Bets  
- Accent: Sewer Brown (#8b4513) – El Shito, DatXit lore
- Neutral: Dark (#0a0012) – background
- Success/Action: Mint Green (#1dd1a1) – Kalshi-inspired for CTAs, portfolio gains
- Alert/Attention: Sewer Sludge (#6b4c3a) – for warnings, fee highlights

**Typography Changes:**
- Keep existing (Geist Sans/Mono)
- Add font-weight hierarchy: 400 (body), 600 (labels), 700 (headers), 900 (dripping text for lore)

**Layout Patterns:**
- Header: Sticky top nav with logo, tab navigation, search bar, wallet connect, auth buttons
- Sidebar Navigation: Collapsible left sidebar (collapsed on mobile) with category tree (like Kalshi)
- Main Content Grid: 3-column on desktop (sidebar + markets grid + right trading panel), 1-column mobile
- Footer: 4-column footer (Company, Social, Product, Legal/Compliance)

### 0.2 Kalshi Structure Analysis (from screenshots)

**Key UI Patterns to Adopt:**
1. **Header Navigation:** MARKETS | LIVE (badge count) | SOCIAL (tab structure)
2. **Sidebar Navigation:** Hierarchical category trees with count badges (e.g., Baseball (448), Hockey (127))
3. **Market Card Grid:** Large cards (4 columns on 1920px) with:
   - Market title + icon/image
   - Outcome buttons with odds/probability bars (yes/no, buy/sell)
   - Volume display at bottom
   - Timestamp (if live/active)
4. **Right Trading Panel:** Quick trade interface (currently exists in DXMarkets, keep)
5. **Filters/Sorters:** Trending, Frequency, Category dropdowns above market grid
6. **Social/Ideas Feed:** Vertical feed with user avatars, timestamps, video embeds, engagement buttons

---

## PHASE 1: Database Schema Updates

### 1.1 New Tables (4 total – matches Sui version)

**Table 1: fees_log**
```sql
CREATE TABLE fees_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id TEXT NOT NULL,
  user_wallet TEXT NOT NULL,
  bet_type TEXT NOT NULL, -- 'yes' | 'no'
  taker_amount NUMERIC NOT NULL, -- in DATX equivalent
  fee_amount NUMERIC NOT NULL,
  fee_rate NUMERIC NOT NULL, -- 0.035 * P * (1-P) calculated value
  rake_share NUMERIC NOT NULL, -- 70% to winner, 30% to treasury/burns
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fees_log_market ON fees_log(market_id);
CREATE INDEX idx_fees_log_user ON fees_log(user_wallet);
```

**Table 2: revenue_distribution**
```sql
CREATE TABLE revenue_distribution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period TEXT NOT NULL, -- 'daily' | 'weekly' | 'monthly'
  total_fees_collected NUMERIC NOT NULL,
  treasury_share NUMERIC NOT NULL, -- 70% of rake
  team_share NUMERIC NOT NULL, -- 30% of rake
  burn_events_count INT DEFAULT 0,
  total_burned NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_revenue_distribution_period ON revenue_distribution(period);
```

**Table 3: burn_events**
```sql
CREATE TABLE burn_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id TEXT NOT NULL,
  losing_side TEXT NOT NULL, -- 'yes' | 'no'
  losing_pool_amount NUMERIC NOT NULL,
  burn_percentage NUMERIC NOT NULL, -- 10-20% based on lore
  amount_burned NUMERIC NOT NULL,
  datx_burned_equiv NUMERIC NOT NULL, -- in DATX for lore mechanic
  burn_reason TEXT, -- e.g., "El Shito sighting failed", "DatXit conspiracy abandoned"
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_burn_events_market ON burn_events(market_id);
```

**Table 4: content_pages**
```sql
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- e.g., 'help-center', 'api-docs', 'blog'
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- markdown or HTML
  page_type TEXT, -- 'static' | 'blog' | 'help' | 'legal'
  author_id TEXT, -- user wallet (for blog)
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_content_pages_slug ON content_pages(slug);
CREATE INDEX idx_content_pages_type ON content_pages(page_type);
```

### 1.2 Database Migration Scripts
- Create `scripts/005-add-fees-revenue-tables.sql` (fees_log, revenue_distribution, burn_events)
- Create `scripts/006-add-content-pages-table.sql` (content_pages, seed blog/help content)
- Update `scripts/004-add-market-type.sql` to include fee tier column (standard/premium)

---

## PHASE 2: Frontend Architecture & New Pages (15 pages total)

### 2.1 New Routes Structure

```
/
├── /markets (existing bets page, enhance with sidebar)
├── /markets/[id] (existing, enhance with social comments)
├── /explore
│   ├── / (category browser)
│   ├── /trending
│   ├── /politics
│   ├── /sports
│   ├── /crypto
│   ├── /tech-science
│   ├── /culture
│   ├── /climate
│   └── /[category] (dynamic category page)
├── /live (NEW – live markets feed, LIVE 31 badge)
├── /social (NEW – ideas/predictions feed, Kalshi-style)
│   ├── / (home feed)
│   ├── /[ideaId] (idea detail)
├── /portfolio (NEW – user positions, performance)
├── /settings (NEW – user preferences, account)
├── /help (NEW – help center)
├── /api-docs (NEW – API documentation)
├── /blog (NEW – news/updates)
├── /market-builder (NEW – create custom market, requires auth)
├── /fee-schedule (NEW – transparency page)
├── /careers (NEW – hiring page)
└── /legal
    ├── /privacy-policy (NEW)
    ├── /terms-of-service (NEW)
    └── /responsible-trading (NEW)
```

### 2.2 Detailed Page Specifications

**NEW: /live** – Live Markets Feed (Badge: LIVE 31)
- Real-time market updates, countdown timers for fast markets
- Market cards with live volume updates
- Similar layout to /markets but filtered to market_type='fast' and status='active'
- Left sidebar: Live markets count, filtering by category
- Component: `<LiveMarketsFeed />`

**NEW: /social** – Ideas/Predictions Feed (Kalshi "Social" tab)
- User-generated ideas/predictions (requires CMS integration)
- Vertical feed with user avatar, prediction text, video embed option, timestamps
- Time filters: Now, Today, This Week, This Month
- Comments/replies on each idea
- Components: `<IdeaFeed />`, `<IdeaCard />`, `<IdeaPostForm />`
- Table: ideas (id, user_wallet, title, description, video_url, created_at, likes_count, replies_count)

**NEW: /explore** – Category Browser
- Left sidebar: Hierarchical category tree with count badges (like Kalshi Sports page)
- Main grid: Market cards for selected category
- Filters: Trending, Frequency, Subcategory dropdowns
- Dynamic routing for each category (e.g., /explore/politics shows Congress subcategories)

**NEW: /portfolio** – User Positions & Performance
- Show user's open positions, closed positions, P&L
- Portfolio stats: total invested, total returned, win rate, ROI%
- Charts: P&L over time, position breakdown
- Components: `<PortfolioSummary />`, `<PositionsTable />`, `<PerformanceChart />`
- API integration: Fetch user positions from Supabase

**NEW: /settings** – User Preferences
- Wallet management, notification settings, theme (dark/light)
- Privacy settings, consent preferences (reuse from compliance)
- Components: `<WalletSettings />`, `<NotificationPreferences />`

**NEW: /help** – Help Center
- FAQ, contact form, live chat widget integration (later phase)
- Fetch content from content_pages table (page_type='help')
- Search functionality across help articles
- Component: `<HelpCenter />`

**NEW: /api-docs** – API Documentation
- SDK installation, endpoint reference, code examples
- OpenAPI spec rendering
- Components: `<APIDocumentation />`, `<CodeSamples />`

**NEW: /blog** – Blog/News
- Fetch from content_pages table (page_type='blog')
- Author, publish date, read time
- Components: `<BlogFeed />`, `<BlogPost />`

**NEW: /market-builder** – Create Custom Market (Auth Required)
- Form: Market title, description, outcomes (yes/no or custom pairs), resolution date, category
- Advanced: Choose market_type (lore/fast), fee tier (standard/premium)
- Integration: Post to `/api/markets/create` endpoint, mint market NFT
- Components: `<MarketBuilderForm />`

**NEW: /fee-schedule** – Fee Transparency
- Static page showing fee formula, examples, rake split breakdown
- Visualization: Fee % at different odds (50/50 peaks ~0.88%)
- Educational content about revenue model
- Component: `<FeeScheduleVisualization />`

**NEW: /careers** – Hiring/Team
- Team bios, open positions (if applicable)
- Static content from content_pages
- Component: `<CareersPage />`

**NEW: /legal/privacy-policy** – Privacy Policy
- Fetch from content_pages or static markdown
- Compliance-focused

**NEW: /legal/terms-of-service** – Terms of Service
- Fetch from content_pages or static markdown
- Compliance-focused

**NEW: /legal/responsible-trading** – Responsible Trading
- Risk disclosure, gambling addiction resources, warnings
- Fetch from content_pages
- Component: `<ResponsibleTradingGuide />`

### 2.3 New Components (15+ new components)

```
components/
├── explore/
│   ├── CategorySidebar.tsx (hierarchical category tree)
│   ├── CategoryBrowser.tsx (main grid + filters)
│   └── SubcategoryDropdown.tsx
├── live/
│   └── LiveMarketsFeed.tsx (live market cards, real-time updates)
├── social/
│   ├── IdeaFeed.tsx (vertical feed)
│   ├── IdeaCard.tsx (idea with video, comments)
│   ├── IdeaPostForm.tsx (create idea)
│   └── IdeaDetail.tsx (full idea page)
├── portfolio/
│   ├── PortfolioSummary.tsx (stats cards)
│   ├── PositionsTable.tsx (open/closed)
│   ├── PerformanceChart.tsx (P&L chart)
│   └── PortfolioPage.tsx
├── settings/
│   ├── WalletSettings.tsx
│   ├── NotificationPreferences.tsx
│   └── SettingsPage.tsx
├── help/
│   ├── HelpCenter.tsx
│   ├── FAQItem.tsx
│   └── HelpSearch.tsx
├── api/
│   ├── APIDocumentation.tsx
│   ├── CodeSamples.tsx
│   └── EndpointReference.tsx
├── blog/
│   ├── BlogFeed.tsx
│   ├── BlogCard.tsx
│   └── BlogPost.tsx
├── market-builder/
│   ├── MarketBuilderForm.tsx
│   ├── OutcomeBuilder.tsx
│   └── ResolutionCalendar.tsx
├── layout/
│   ├── HeaderNav.tsx (enhanced with LIVE/SOCIAL badges)
│   ├── SidebarNav.tsx (new collapsible sidebar)
│   ├── Footer.tsx (new 4-column footer)
│   └── MainLayout.tsx (3-column layout container)
└── common/
    ├── CategoryTree.tsx (reusable hierarchy)
    ├── MarketCardLarge.tsx (Kalshi-style card, large variant)
    └── FilterDropdowns.tsx (Trending, Frequency, etc.)
```

---

## PHASE 3: Backend Architecture & APIs

### 3.1 New API Routes (25+ endpoints)

**Fees & Revenue APIs**
- `POST /api/fees/calculate` – Calculate fee for given taker_amount, odds (P, 1-P)
- `GET /api/fees/schedule` – Return fee formula, examples, breakdown
- `GET /api/revenue/stats` – Daily/weekly/monthly revenue, burn summary
- `GET /api/revenue/distribution` – Breakdown of rake split, treasury/team/burns
- `POST /api/burn-events/log` – Log a burn event (internal, on market resolution)

**Market APIs (Enhanced)**
- `GET /api/markets/trending` – Top 10 by 24h volume
- `GET /api/markets/by-category/[category]` – Markets in category with hierarchy
- `GET /api/markets/live` – Only market_type='fast' & status='active'
- `GET /api/markets/filter` – (existing, enhance to support market_type, frequency filters)
- `POST /api/markets/create` – Market builder endpoint, requires auth + content_pages record
- `GET /api/markets/[id]/performance` – Market stats (volume over time, participant count)
- `GET /api/markets/search` – Full-text search by title/description

**Portfolio/User APIs**
- `GET /api/user/positions` – User's open/closed positions, P&L
- `GET /api/user/portfolio/summary` – Portfolio stats (win%, ROI%, total invested)
- `GET /api/user/portfolio/performance` – Historical P&L, charts data
- `GET /api/user/leaderboard-rank` – User's rank on global leaderboard

**Content APIs**
- `GET /api/content/pages/[slug]` – Fetch page content (blog, help, legal)
- `GET /api/content/blog` – Paginated blog posts
- `GET /api/content/help` – FAQ/help articles with search
- `POST /api/content/ideas` – Create idea post (user-generated)
- `GET /api/content/ideas/feed` – Idea feed with pagination
- `POST /api/content/ideas/[id]/comments` – Comment on idea

**Social/Community APIs**
- `GET /api/social/leaderboard` – Global rankings (24h/7d/all-time)
- `GET /api/social/user/[wallet]` – User profile, stats, ideas posted
- `POST /api/social/follow` – Follow user (optional phase)

**Analytics APIs**
- `GET /api/analytics/market-volume` – Aggregate volume by category/time
- `GET /api/analytics/user-retention` – Retention metrics (internal)
- `GET /api/analytics/revenue-breakdown` – Revenue sources (fees, burns, etc.)

### 3.2 API Response Schemas

Each endpoint returns standardized response:
```typescript
interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}
```

Example: `GET /api/fees/calculate?amount=1000&yes_probability=0.65`
```json
{
  "success": true,
  "data": {
    "taker_amount": 1000,
    "odds": { "yes": 0.65, "no": 0.35 },
    "fee_rate": 0.00653,
    "fee_amount": 6.53,
    "total_cost": 1006.53,
    "rake_breakdown": {
      "winner_pool": 1000,
      "rake_total": 10,
      "treasury": 7,
      "team": 3
    }
  },
  "timestamp": "2026-02-24T20:30:00Z"
}
```

---

## PHASE 4: Revenue Model Integration

### 4.1 Fee Formula Implementation

**Taker Fee Calculation:**
```
fee_rate = 0.035 * P * (1 - P)
where P = probability (0 to 1)

Examples:
- 50/50 odds: 0.035 * 0.5 * 0.5 = 0.00875 (0.875%)
- 65/35 odds: 0.035 * 0.65 * 0.35 = 0.00797 (0.797%)
- 90/10 odds: 0.035 * 0.9 * 0.1 = 0.00315 (0.315%)
- 99/1 odds: 0.035 * 0.99 * 0.01 = 0.00034 (0.034%)

Rake Split (from fees collected):
- Winner pool: 90% (no fees)
- Rake split: 10% total
  - Treasury (DAO): 70% of rake = 7% of fees
  - Team: 30% of rake = 3% of fees

Burn Mechanic (separate):
- Losing side pool: 10-20% burned (per lore, varies by market theme)
- Burn reason logged to burn_events table
- DATX equivalent calculated from SOL/USDC swap
```

### 4.2 Burn Events Mechanics

**Burn Triggers:**
- Market resolved to "Yes": Burn 15% of "No" pool (lore: "El Shito prophecy wrong", "DatXit conspiracy busted")
- Market resolved to "No": Burn 15% of "Yes" pool (lore: "Sewer council verdict: you're wrong")
- Market cancelled: Burn 5% of total pool (lore: "Market never manifested, sludge consumed")

**Example:**
- Market: "Will Bitcoin hit $200k by March?"
- Final state: Resolved to "No", Yes pool = $50k, No pool = $150k
- Burn: 15% of $50k = $7,500 burned
- Burn reason: "Bitcoin prophecy wrong. Sludge reclaims false visions. 🚽"
- Log to burn_events table with amount_burned, burn_reason, created_at

### 4.3 Smart Contract Integration (Anchor/Move)

**New Contract Module: `revenue.move` (Sui) / `revenue.ts` (Solana)**
- Function: `calculate_taker_fee(amount: u64, yes_prob: u64) -> u64`
- Function: `apply_rake_split(pot: u64) -> (treasury: u64, team: u64)`
- Function: `burn_losing_pool(pool: u64, burn_rate: u16) -> u64`
- Function: `log_fee_event(market_id, user, amount, fee_rate)`

**Settlement Flow:**
1. Market resolves (admin/oracle call)
2. Winner pool calculated: total_volume * (1 - avg_fee_rate)
3. Rake extracted: total_fees * 0.70 (treasury), * 0.30 (team)
4. Losers' pool: 10-20% burned, rest distributed per rules
5. Events logged: fees_log, burn_events, revenue_distribution

---

## PHASE 5: SDK & Developer Tools

### 5.1 JavaScript SDK Package

**Package: `@dxmarkets/sdk`**
```typescript
// Installation: npm install @dxmarkets/sdk

import { DXMarketsSDK } from '@dxmarkets/sdk';

const sdk = new DXMarketsSDK({
  baseURL: 'https://api.dxmarkets.com',
  apiKey: 'your-api-key', // required for premium tier
  network: 'solana-mainnet',
});

// Fetch markets
const markets = await sdk.markets.getByCategory('crypto');
const liveBets = await sdk.markets.getLive({ limit: 10 });

// Calculate fees
const feeInfo = await sdk.fees.calculate({
  amount: 1000,
  yesOdds: 0.65,
});
console.log(`Fee: ${feeInfo.feeAmount} (${feeInfo.feeRate * 100}%)`);

// User portfolio
const portfolio = await sdk.user.getPortfolio(userWallet);
console.log(`P&L: ${portfolio.pnl}`, `Win rate: ${portfolio.winRate}%`);

// Create market (requires auth)
const market = await sdk.markets.create({
  title: 'Will El Shito appear on CNN by March?',
  outcomes: ['Yes', 'No'],
  resolutionDate: '2026-03-31T23:59:59Z',
  category: 'el-shito',
  marketType: 'fast',
});
```

**SDK Features:**
- Markets API (list, get, filter, search)
- Fees API (calculate, schedule)
- Portfolio API (positions, performance, leaderboard)
- Content API (blog, help, ideas)
- Auth (wallet sign-in, token refresh)
- WebSocket support (real-time market updates, streaming odds)

**SDK Documentation:**
- Installation & setup
- Authentication (wallet integration)
- API reference (30+ methods)
- Code examples (React, Vue, vanilla JS)
- Error handling
- Rate limits (free: 100 req/min, premium: unlimited)

### 5.2 NPM Package Structure
```
@dxmarkets/sdk/
├── dist/
│   ├── index.js
│   ├── types.d.ts
│   └── esm/ (ES modules)
├── src/
│   ├── index.ts
│   ├── client.ts (HTTP client, auth, retry logic)
│   ├── apis/
│   │   ├── markets.ts
│   │   ├── fees.ts
│   │   ├── portfolio.ts
│   │   ├── content.ts
│   │   └── social.ts
│   ├── websocket.ts (real-time updates)
│   ├── types.ts (TypeScript interfaces)
│   └── utils/ (validation, formatters)
├── package.json
├── README.md
└── examples/ (React, Vue, vanilla JS examples)
```

---

## PHASE 6: UI/UX Implementation

### 6.1 Header Redesign

```tsx
// Header structure (new)
export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-[#0a0012] border-b border-[#ff00aa]/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#ff00aa]">
          🚽 DXMarkets
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex gap-8 ml-auto">
          <Link href="/markets" className="text-[#f0f0f0] hover:text-[#ff00aa]">
            MARKETS
          </Link>
          <Link href="/live" className="flex items-center gap-2 text-[#ff00aa]">
            LIVE <span className="bg-red-600 px-2 py-1 rounded text-xs">31</span>
          </Link>
          <Link href="/social" className="text-[#f0f0f0] hover:text-[#ff00aa]">
            SOCIAL
          </Link>
        </nav>

        {/* Search */}
        <SearchBar placeholder="Trade on anything..." />

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <button className="px-4 py-2 text-[#00ffcc]">Log in</button>
          <button className="px-4 py-2 bg-[#00ffcc] text-[#0a0012] rounded font-bold">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
```

### 6.2 Sidebar Navigation (New)

```tsx
// Sidebar: Collapsible category tree (desktop, hidden on mobile <768px)
export function SidebarNav() {
  return (
    <aside className="hidden md:block w-64 bg-[#0a0012]/80 border-r border-[#ff00aa]/20 p-4 max-h-screen overflow-y-auto">
      <h3 className="text-sm uppercase font-bold text-[#a0a0ff] mb-4">Categories</h3>
      <CategoryTree categories={MARKET_CATEGORIES} />
    </aside>
  );
}

// CategoryTree: Recursive hierarchical rendering
export function CategoryTree({ categories }) {
  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li key={cat.id}>
          <button className="flex items-center justify-between w-full text-left px-2 py-1">
            <span className="text-[#f0f0f0]">{cat.label}</span>
            <span className="text-xs bg-[#ff00aa]/20 text-[#ff00aa] px-2 py-1 rounded">
              {cat.count}
            </span>
          </button>
          {cat.children && <CategoryTree categories={cat.children} />}
        </li>
      ))}
    </ul>
  );
}
```

### 6.3 Footer Redesign

```tsx
// Footer: 4 columns (Company, Social, Product, Legal)
export function Footer() {
  return (
    <footer className="bg-[#0a0012] border-t border-[#ff00aa]/20 py-12 px-6 mt-20">
      <div className="grid grid-cols-4 gap-12 max-w-7xl mx-auto text-sm text-[#a0a0ff]">
        
        {/* Company Column */}
        <div>
          <h4 className="font-bold text-[#ff00aa] mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/legal/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="#">Brand Kit</Link></li>
          </ul>
        </div>

        {/* Social Column */}
        <div>
          <h4 className="font-bold text-[#ff00aa] mb-4">Social</h4>
          <ul className="space-y-2">
            <li><a href="https://x.com" target="_blank">X (Twitter)</a></li>
            <li><a href="https://discord.com" target="_blank">Discord</a></li>
            <li><a href="https://reddit.com" target="_blank">Reddit</a></li>
            <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
          </ul>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="font-bold text-[#ff00aa] mb-4">Product</h4>
          <ul className="space-y-2">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/api-docs">API Docs</Link></li>
            <li><Link href="/fee-schedule">Fee Schedule</Link></li>
            <li><Link href="/legal/responsible-trading">Responsible Trading</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold text-[#ff00aa] mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/legal/terms-of-service">Terms of Service</Link></li>
            <li><Link href="#">Compliance</Link></li>
            <li><Link href="#">Market Integrity</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-[#a0a0ff] mt-12 pt-6 border-t border-[#ff00aa]/20">
        © 2026 DXMarkets. Sewer predictions powered by $DATX. Trading involves risk. 🚽
      </div>
    </footer>
  );
}
```

### 6.4 Layout: 3-Column Main Page

```tsx
// Main layout for /markets, /explore, etc.
export function ThreeColumnLayout({ children }) {
  return (
    <div className="flex gap-6 pt-20 px-6">
      <SidebarNav />
      <main className="flex-1">{children}</main>
      <aside className="w-96">
        <RightTradingPanel /> {/* existing betting interface */}
      </aside>
    </div>
  );
}
```

---

## PHASE 7: Implementation Roadmap (14 Weeks)

### Week 1-2: Design System & Database
- [ ] Finalize color palette, typography
- [ ] Create Figma design system
- [ ] Execute migration scripts (fees_log, revenue_distribution, burn_events, content_pages)
- [ ] Seed initial content (help articles, privacy policy, ToS)
- **Deliverable:** Design tokens, database ready, content CMS seeded

### Week 3-4: Backend Infrastructure
- [ ] Implement 25+ API endpoints
- [ ] Fee calculation logic (smart contract or SDK)
- [ ] Revenue tracking (emit events on settle)
- [ ] Deploy APIs to production
- **Deliverable:** All APIs tested, documented in Swagger/OpenAPI

### Week 5-6: SDK Development
- [ ] Build JavaScript SDK package
- [ ] Create SDK documentation, examples
- [ ] Publish to NPM
- **Deliverable:** @dxmarkets/sdk v1.0.0 on NPM

### Week 7-8: Core Frontend Pages
- [ ] Rebuild Header, Footer, SidebarNav
- [ ] Implement /explore (category browser)
- [ ] Implement /live (live markets feed)
- [ ] Implement /portfolio (positions + performance)
- **Deliverable:** 3 new core pages live

### Week 9-10: Secondary Pages
- [ ] Implement /social (ideas feed, user-generated)
- [ ] Implement /market-builder (create custom market)
- [ ] Implement /fee-schedule (transparency)
- [ ] Implement /help, /api-docs, /blog (static + CMS)
- **Deliverable:** 7 new pages live

### Week 11-12: Legal/Compliance & Integrations
- [ ] Implement /legal pages (privacy, ToS, responsible trading)
- [ ] Implement /careers (static)
- [ ] Integrate analytics (segment/Mixpanel for revenue tracking)
- [ ] Add wallet analytics (track revenue by user)
- **Deliverable:** Legal pages live, analytics instrumented

### Week 13-14: Testing, Launch Prep, Monitoring
- [ ] End-to-end testing (all 15 pages, all 25+ APIs)
- [ ] Performance testing (market grid rendering, large datasets)
- [ ] Security audit (API auth, XSS, CSRF)
- [ ] Load testing (expect 5k concurrent users at launch)
- [ ] Setup monitoring (Sentry, New Relic, custom dashboards)
- [ ] Deploy to production
- [ ] Launch marketing (CT campaign, feature announcements)
- **Deliverable:** Production launch, monitoring dashboards live

---

## PHASE 8: Technical Specifications

### 8.1 Smart Contract Updates (Solana/Anchor)

**New Revenue Module: `programs/dxmarkets/src/revenue.rs`**
```rust
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct LogFeeEvent<'info> {
    #[account(mut)]
    pub fee_log: Account<'info, FeeLog>,
    pub signer: Signer<'info>,
}

#[account]
pub struct FeeLog {
    pub market_id: String,
    pub user_wallet: Pubkey,
    pub fee_amount: u64,
    pub fee_rate: u64, // stored as basis points (0.035 = 35)
    pub timestamp: i64,
}

pub fn calculate_taker_fee(
    amount: u64,
    yes_probability: u64, // stored as basis points (0.65 = 6500)
) -> u64 {
    let no_prob = 10000 - yes_probability;
    let fee_bp = 350; // 0.035 = 350 basis points
    let fee_rate = (fee_bp * yes_probability * no_prob) / 1000000000;
    (amount * fee_rate) / 10000
}

pub fn apply_rake_split(total_fees: u64) -> (u64, u64) {
    let treasury = (total_fees * 7) / 10;
    let team = total_fees - treasury;
    (treasury, team)
}

pub fn burn_losing_pool(pool: u64, burn_rate: u16) -> u64 {
    (pool * (burn_rate as u64)) / 10000
}
```

### 8.2 Database Indexes & Performance

**Key Indexes:**
- fees_log: (market_id, created_at), (user_wallet, created_at)
- revenue_distribution: (period)
- burn_events: (market_id, created_at)
- content_pages: (slug, page_type)
- markets: (market_type, status, category) – existing, add market_type index

**Query Optimization:**
- Materialized view: `market_stats_24h` (volume, participant count, avg odds) – refreshed every 5 min
- Cache: Redis cache for /api/fees/schedule, /api/revenue/stats (TTL: 1 hour)
- Pagination: Default 20 per page, max 100 (prevent abuse)

### 8.3 Monitoring & Alerts

**Metrics to Track:**
- API latency (p50, p95, p99)
- Error rate by endpoint
- Revenue collected (daily/weekly/monthly)
- Burn events count & amount
- User retention (30-day DAU)
- Market resolution success rate

**Alerting:**
- Alert if revenue drops 50% week-over-week
- Alert if burn events exceed 25% of pool (fraud check)
- Alert if API error rate > 1%
- Alert if p95 latency > 2s

---

## PHASE 9: Security & Compliance

### 9.1 Security Measures

- **API Auth:** Require wallet signature for portfolio/settings endpoints
- **Rate Limiting:** 100 req/min per IP (free tier), unlimited for premium API key
- **Input Validation:** Sanitize market title/description (no XSS), validate odds (0-1 range)
- **SQL Injection Prevention:** Use parameterized queries (Supabase ORM)
- **HTTPS Only:** All APIs HTTPS, CSP headers, X-Frame-Options
- **Wallet Verification:** Sign transactions with user's wallet, verify signature on backend

### 9.2 Compliance

- **Age Verification:** Consent modal on first visit (already exists)
- **Responsible Gambling:** Warning banners on betting interface, link to /legal/responsible-trading
- **Transparency:** /fee-schedule public, /legal/terms-of-service explicit
- **Data Privacy:** Privacy policy at /legal/privacy-policy, no data sold to third parties
- **Market Integrity:** No insider trading checks (sports), oracle selection for resolution

---

## PHASE 10: Success Metrics & KPIs

### 10.1 Launch Targets

- **User Acquisition:** 5k signups in first 30 days
- **Daily Active Users (DAU):** 1k by week 4
- **Monthly Active Users (MAU):** 3k by month 3
- **Volume:** $100k in first week, $1M+ by month 2
- **Revenue:** $5k-$10k in fees by month 2 (at $1M volume, avg 0.5% rake)

### 10.2 Feature Adoption

- **Portfolio Page:** 60% of active users view portfolio
- **Social/Ideas:** 200+ ideas posted by month 1
- **API SDK:** 50+ developers using @dxmarkets/sdk by month 2
- **Market Builder:** 20+ custom markets created in first month
- **Fee Transparency:** >70% users understand fee model after visiting /fee-schedule

---

## PHASE 11: Risk Mitigation & Contingency

### 11.1 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low initial volume | Revenue fails to materialize | Start with free markets on lore markets, premium fees only on high-volume fast markets |
| API abuse/DoS | System goes down | Rate limiting, DDoS protection, auto-scaling |
| Poor UX adoption | Users don't use new pages | A/B testing, user feedback surveys, iterative design |
| Regulatory pressure | Platform forced to shut down | Maintain /legal/responsible-trading, no fiat, use "entertainment" framing |
| Smart contract exploit | Revenue module hacked | Audit by third-party firm, gradual rollout (week 13-14), monitor burn logic closely |
| High churn | Users stop returning | Gamification (leaderboard, achievement badges), daily challenges, referral incentives |

---

## PHASE 12: Appendix

### A. Kalshi UI/UX Observations (from screenshots)

1. **Clean Minimalism:** Kalshi uses subtle grays/whites, DXMarkets uses neon chaos – blend by using neon as accents only
2. **Hierarchical Sidebars:** Left sidebar with category tree + count badges is key to discoverability
3. **Large Market Cards:** 4-column grid at 1920px, each card shows title, multiple outcomes with odds, volume footer
4. **Real-Time Updates:** Live markets badge (LIVE 31) updates dynamically
5. **Social Integration:** Ideas/predictions feed is major feature (Kalshi "Social" tab)
6. **Trading Panel:** Right sidebar with quick bet interface (already in DXMarkets, keep it)
7. **Footer Clarity:** 4-column footer with clear CTA links (Help, API, Legal, Company)

### B. Revenue Math Examples

**Example 1: User bets $1,000 at 65/35 odds (Yes/No)**
- Fee rate = 0.035 * 0.65 * 0.35 = 0.00797 (0.797%)
- Fee = $1,000 * 0.00797 = $7.97
- User pays: $1,007.97 total
- Rake split: $7.97 * 0.70 = $5.58 (treasury), $7.97 * 0.30 = $2.39 (team)

**Example 2: Market resolves Yes, 1,000 participants, $100k total volume**
- Fees collected: ~$700 (avg 0.7%)
- Rake split: $490 treasury, $210 team
- Losers (No) pool: $30k
- Burn losers: 15% of $30k = $4,500 burned
- Revenue: $490 + $210 = $700 in fees

**Example 3: Monthly revenue at 50k volume**
- Total fees: 50k * 0.005 (avg) = $250
- Rake split: $175 treasury, $75 team
- Burn events: ~$2,000 (if 20% of markets resolve with 15% burn)
- Monthly revenue: $250 in rake (sustainability for ops)

### C. Frontend Dependencies (New)

- **recharts** (already in use) – Portfolio charts
- **react-markdown** – Render blog/help markdown
- **zustand** – State management for sidebar collapse, filter state
- **swr** – Real-time data fetching (market prices, portfolio updates)
- **framer-motion** – Animations for transitions
- **date-fns** – Date formatting for ideas feed

---

## Summary of Changes

**Total New Pages:** 15
**Total New API Endpoints:** 25+
**Total New Components:** 15+
**New Database Tables:** 4
**Implementation Timeline:** 14 weeks
**Core Deliverables:**
1. Design system (colors, typography, layout patterns)
2. Backend infrastructure (APIs, smart contracts, database)
3. SDK (@dxmarkets/sdk on NPM)
4. 15 new pages with full functionality
5. Revenue tracking & analytics
6. Monitoring & compliance setup

**Estimated Team Size:** 2 FE, 2 BE, 1 DevOps, 1 Designer, 1 Product Manager = 7 people

---

## Next Steps

✅ **This plan is complete and ready for review.**

**Questions for Stakeholder Review:**

1. **Design Direction:** Should we fully embrace neon chaos for all pages, or tone it down for legal/help pages?
2. **Social Feature Scope:** Should ideas feed support comments, likes, video embeds in phase 1, or defer to phase 2?
3. **Market Builder Access:** Should all users create custom markets, or require reputation/stake?
4. **Premium API Tier:** Start with free tier only, add premium ($50/month) in phase 2?
5. **Analytics Integration:** Use Mixpanel, Segment, or custom event logger?
6. **Launch Marketing:** CT push, influencer partnerships, or organic only?
7. **Timeline Flexibility:** Can compress to 10 weeks with more resources, or extend to 16 weeks for more polish?

**Awaiting approval to proceed with Phase 0-1 (Database setup & design system).**
