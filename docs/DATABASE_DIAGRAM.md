
# DATABASE DIAGRAM — DXMarkets on Solana
# Full ERD, Schema Definitions, Relationships, Indexes, RLS Policies
# Generated: 2026-02-25 | Answers incorporated: Segment+Mixpanel analytics, $50/mo API tier, stake-gated market creation, 16-week timeline

---

## LEGEND

  PK = Primary Key
  FK = Foreign Key
  UQ = Unique Constraint
  IDX = Index
  RLS = Row Level Security Policy

---

## ENTITY RELATIONSHIP DIAGRAM (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                          DXMarkets — Supabase Schema ERD                           │
└────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────────┐
│        users         │         │         markets           │
│──────────────────────│         │──────────────────────────│
│ PK wallet TEXT       │◄────────│ FK creator_wallet TEXT   │
│    username TEXT     │         │ PK id UUID               │
│    bio TEXT          │         │    title TEXT            │
│    avatar_url TEXT   │         │    description TEXT      │
│    reputation_score  │         │    category TEXT         │
│    stake_balance     │         │    market_type TEXT      │  ◄── 'lore' | 'fast'
│    is_creator_eligible        │    status TEXT           │
│    api_tier TEXT     │         │    yes_probability NUM   │
│    api_key TEXT UQ   │         │    no_probability NUM    │
│    created_at        │         │    total_volume NUM      │
│    updated_at        │         │    yes_pool NUM          │
└──────────────────────┘         │    no_pool NUM           │
         │                       │    token_type TEXT       │
         │                       │    resolution_date TSTZ  │
         │                       │    resolution_window_hrs │
         │                       │    resolved_outcome TEXT │
         │                       │    resolved_at TSTZ      │
         │                       │    image_url TEXT        │
         │                       │    created_at TSTZ       │
         │                       └──────────────────────────┘
         │                                    │
         │                          ┌─────────┘
         │                          │
         │               ┌──────────▼──────────┐
         │               │       trades         │
         │               │─────────────────────│
         ├──────────────►│ FK user_wallet TEXT  │
         │               │ FK market_id UUID    │
         │               │ PK id UUID           │
         │               │    side TEXT         │  ◄── 'yes' | 'no'
         │               │    amount NUM        │
         │               │    shares NUM        │
         │               │    entry_price NUM   │
         │               │    token_type TEXT   │
         │               │    tx_signature TEXT │
         │               │    fee_amount NUM    │
         │               │    fee_rate NUM      │
         │               │    created_at TSTZ   │
         │               └─────────────────────┘
         │                          │
         │                          │ FK
         │               ┌──────────▼──────────┐
         │               │      fees_log        │
         │               │─────────────────────│
         │               │ PK id UUID           │
         │               │ FK market_id TEXT    │
         │               │ FK user_wallet TEXT  │
         │               │    bet_type TEXT     │
         │               │    taker_amount NUM  │
         │               │    fee_amount NUM    │
         │               │    fee_rate NUM      │
         │               │    rake_share NUM    │
         │               │    created_at TSTZ   │
         │               └─────────────────────┘
         │
         │               ┌─────────────────────┐
         │               │  revenue_distribution│
         │               │─────────────────────│
         │               │ PK id UUID           │
         │               │    period TEXT       │
         │               │    total_fees NUM    │
         │               │    treasury_share NUM│
         │               │    team_share NUM    │
         │               │    burn_count INT    │
         │               │    total_burned NUM  │
         │               │    calculated_at TSTZ│
         │               └─────────────────────┘
         │
         │               ┌─────────────────────┐
         │               │     burn_events      │
         │               │─────────────────────│
         │               │ PK id UUID           │
         │               │    trigger TEXT      │  ◄── 'trade_fee'|'market_resolve'|'manual'
         │               │    amount_burned NUM │
         │               │    tx_signature TEXT │
         │               │    burned_at TSTZ    │
         │               └─────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         ├──────────────►│          social_posts            │
         │               │─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │ FK author_wallet TEXT            │
         │               │ FK market_id UUID (nullable)     │
         │               │    content TEXT                  │
         │               │    media_url TEXT (nullable)     │
         │               │    media_type TEXT               │  ◄── 'image'|'gif'|'video'
         │               │    likes_count INT               │
         │               │    comments_count INT            │
         │               │    created_at TSTZ               │
         │               └─────────────────────────────────┘
         │                          │
         │               ┌──────────▼──────────────────────┐
         │               │       post_comments              │
         ├──────────────►│─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │ FK post_id UUID                  │
         │               │ FK author_wallet TEXT            │
         │               │    content TEXT                  │
         │               │    created_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         │               │          post_likes              │
         ├──────────────►│─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │ FK post_id UUID                  │
         │               │ FK user_wallet TEXT              │
         │               │ UQ (post_id, user_wallet)        │
         │               │    created_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         │               │          api_keys                │
         ├──────────────►│─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │ FK user_wallet TEXT              │
         │               │    key_hash TEXT UQ              │
         │               │    tier TEXT                     │  ◄── 'free'|'premium'
         │               │    rate_limit_per_min INT        │
         │               │    monthly_cost_usd NUM          │
         │               │    is_active BOOL                │
         │               │    last_used_at TSTZ             │
         │               │    created_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         │               │        content_pages             │
         │               │─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │    slug TEXT UQ                  │  ◄── 'fee-schedule','careers'...
         │               │    title TEXT                    │
         │               │    body_mdx TEXT                 │
         │               │    section TEXT                  │  ◄── 'company'|'product'|'legal'
         │               │    published BOOL                │
         │               │    updated_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         ├──────────────►│        consent_log               │  ◄── EXISTING TABLE
         │               │─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │    user_wallet TEXT (nullable)   │
         │               │    ip_hash TEXT (nullable)       │
         │               │    consent_type TEXT             │
         │               │    accepted BOOL                 │
         │               │    accepted_at TSTZ              │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         │               │      leaderboard_cache           │  ◄── EXISTING TABLE
         │               │─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │    period TEXT                   │
         │               │    rank_data JSONB               │
         │               │    updated_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         ├──────────────►│       analytics_events           │
         │               │─────────────────────────────────│
         │               │ PK id UUID                       │
         │               │ FK user_wallet TEXT (nullable)   │
         │               │    event_name TEXT               │
         │               │    properties JSONB              │
         │               │    session_id TEXT               │
         │               │    ip_hash TEXT                  │
         │               │    created_at TSTZ               │
         │               └─────────────────────────────────┘
         │
         │               ┌─────────────────────────────────┐
         └──────────────►│       notifications              │
                         │─────────────────────────────────│
                         │ PK id UUID                       │
                         │ FK user_wallet TEXT              │
                         │    type TEXT                     │
                         │    title TEXT                    │
                         │    body TEXT                     │
                         │    is_read BOOL                  │
                         │    action_url TEXT               │
                         │    created_at TSTZ               │
                         └─────────────────────────────────┘
```

---

## FULL SQL SCHEMA DEFINITIONS

### Table: users (NEW — full user profile)
```sql
CREATE TABLE users (
  wallet              TEXT PRIMARY KEY,
  username            TEXT UNIQUE,
  bio                 TEXT,
  avatar_url          TEXT,
  reputation_score    NUMERIC DEFAULT 0,       -- accumulates from trades/correct predictions
  stake_balance       NUMERIC DEFAULT 0,       -- DATX staked to unlock market creation
  is_creator_eligible BOOLEAN DEFAULT false,   -- true when stake >= 500 DATX
  api_tier            TEXT DEFAULT 'free' CHECK (api_tier IN ('free', 'premium')),
  api_key             TEXT UNIQUE,
  total_volume        NUMERIC DEFAULT 0,
  total_profit        NUMERIC DEFAULT 0,
  win_rate            NUMERIC DEFAULT 0,
  markets_traded      INT DEFAULT 0,
  markets_created     INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_reputation ON users(reputation_score DESC);
CREATE INDEX idx_users_stake ON users(stake_balance DESC);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid()::text = wallet OR true);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid()::text = wallet);
CREATE POLICY "Anyone can insert on first connect" ON users FOR INSERT WITH CHECK (true);
```

### Table: markets (EXISTING — add market_type + resolution_window_hours)
```sql
-- Already applied via migration 004-add-market-type.sql
-- ALTER TABLE markets ADD COLUMN market_type TEXT DEFAULT 'lore' CHECK (market_type IN ('lore', 'fast'));
-- ALTER TABLE markets ADD COLUMN resolution_window_hours INT;
-- New columns added in this overhaul:
ALTER TABLE markets ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS group_id UUID;  -- for market groups (like Kalshi bundles)
ALTER TABLE markets ADD COLUMN IF NOT EXISTS live_badge BOOLEAN DEFAULT false;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS taker_fee_bps INT DEFAULT 350; -- 3.5% in bps
ALTER TABLE markets ADD COLUMN IF NOT EXISTS min_stake_required NUMERIC DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_markets_group ON markets(group_id);
CREATE INDEX IF NOT EXISTS idx_markets_live ON markets(live_badge) WHERE live_badge = true;
```

### Table: trades (EXISTING — add fee fields)
```sql
-- Assumed existing. Add fee columns if not present:
ALTER TABLE trades ADD COLUMN IF NOT EXISTS fee_amount NUMERIC DEFAULT 0;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS fee_rate NUMERIC DEFAULT 0;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS net_amount NUMERIC;  -- amount after fee deduction
```

### Table: fees_log (NEW)
```sql
CREATE TABLE fees_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id       TEXT NOT NULL,
  user_wallet     TEXT NOT NULL,
  bet_type        TEXT NOT NULL CHECK (bet_type IN ('yes', 'no')),
  taker_amount    NUMERIC NOT NULL,
  fee_amount      NUMERIC NOT NULL,
  fee_rate        NUMERIC NOT NULL,
  rake_share      NUMERIC NOT NULL,
  burn_amount     NUMERIC NOT NULL DEFAULT 0,
  treasury_amount NUMERIC NOT NULL DEFAULT 0,
  team_amount     NUMERIC NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fees_log_market ON fees_log(market_id);
CREATE INDEX idx_fees_log_user ON fees_log(user_wallet);
CREATE INDEX idx_fees_log_date ON fees_log(created_at DESC);
ALTER TABLE fees_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users view own fees" ON fees_log FOR SELECT USING (auth.uid()::text = user_wallet);
CREATE POLICY "Service role full access fees" ON fees_log FOR ALL USING (auth.role() = 'service_role');
```

### Table: revenue_distribution (NEW)
```sql
CREATE TABLE revenue_distribution (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period               TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
  period_start         TIMESTAMPTZ NOT NULL,
  period_end           TIMESTAMPTZ NOT NULL,
  total_fees_collected NUMERIC NOT NULL DEFAULT 0,
  treasury_share       NUMERIC NOT NULL DEFAULT 0,
  team_share           NUMERIC NOT NULL DEFAULT 0,
  burn_events_count    INT DEFAULT 0,
  total_burned         NUMERIC DEFAULT 0,
  api_revenue_usd      NUMERIC DEFAULT 0,
  calculated_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rev_period ON revenue_distribution(period, period_start DESC);
ALTER TABLE revenue_distribution ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read revenue stats" ON revenue_distribution FOR SELECT USING (true);
CREATE POLICY "Service role manages revenue" ON revenue_distribution FOR ALL USING (auth.role() = 'service_role');
```

### Table: burn_events (NEW)
```sql
CREATE TABLE burn_events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trigger        TEXT NOT NULL CHECK (trigger IN ('trade_fee', 'market_resolve', 'manual', 'weekly_sweep')),
  amount_burned  NUMERIC NOT NULL,
  token_type     TEXT DEFAULT 'DATX',
  tx_signature   TEXT,
  market_id      TEXT,
  initiated_by   TEXT,  -- wallet or 'system'
  burned_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_burns_trigger ON burn_events(trigger);
CREATE INDEX idx_burns_date ON burn_events(burned_at DESC);
ALTER TABLE burn_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read burn events" ON burn_events FOR SELECT USING (true);
CREATE POLICY "Service role manages burns" ON burn_events FOR ALL USING (auth.role() = 'service_role');
```

### Table: social_posts (NEW)
```sql
CREATE TABLE social_posts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_wallet  TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
  market_id      UUID,  -- nullable link to a market
  content        TEXT NOT NULL CHECK (char_length(content) <= 500),
  media_url      TEXT,
  media_type     TEXT CHECK (media_type IN ('image', 'gif', 'video', NULL)),
  likes_count    INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned      BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_posts_author ON social_posts(author_wallet);
CREATE INDEX idx_posts_market ON social_posts(market_id);
CREATE INDEX idx_posts_date ON social_posts(created_at DESC);
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON social_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users create posts" ON social_posts FOR INSERT WITH CHECK (auth.uid()::text = author_wallet);
CREATE POLICY "Authors update own posts" ON social_posts FOR UPDATE USING (auth.uid()::text = author_wallet);
CREATE POLICY "Authors delete own posts" ON social_posts FOR DELETE USING (auth.uid()::text = author_wallet);
```

### Table: post_comments (NEW)
```sql
CREATE TABLE post_comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id       UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_wallet TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) <= 280),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_post ON post_comments(post_id);
CREATE INDEX idx_comments_author ON post_comments(author_wallet);
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid()::text = author_wallet);
CREATE POLICY "Authors delete own comments" ON post_comments FOR DELETE USING (auth.uid()::text = author_wallet);
```

### Table: post_likes (NEW)
```sql
CREATE TABLE post_likes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id       UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_wallet   TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_wallet)
);
CREATE INDEX idx_likes_post ON post_likes(post_id);
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users toggle likes" ON post_likes FOR INSERT WITH CHECK (auth.uid()::text = user_wallet);
CREATE POLICY "Users remove own likes" ON post_likes FOR DELETE USING (auth.uid()::text = user_wallet);
```

### Table: api_keys (NEW)
```sql
CREATE TABLE api_keys (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet        TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
  key_hash           TEXT NOT NULL UNIQUE,  -- SHA-256 hash of actual key, never stored plain
  tier               TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  rate_limit_per_min INT NOT NULL DEFAULT 30,  -- free: 30/min, premium: 300/min
  monthly_cost_usd   NUMERIC DEFAULT 0,
  stripe_sub_id      TEXT,  -- Stripe subscription ID for premium
  is_active          BOOLEAN DEFAULT true,
  total_requests     BIGINT DEFAULT 0,
  last_used_at       TIMESTAMPTZ,
  expires_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_api_keys_wallet ON api_keys(user_wallet);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own API keys" ON api_keys FOR SELECT USING (auth.uid()::text = user_wallet);
CREATE POLICY "Users create own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid()::text = user_wallet);
CREATE POLICY "Users deactivate own API keys" ON api_keys FOR UPDATE USING (auth.uid()::text = user_wallet);
CREATE POLICY "Service role full access" ON api_keys FOR ALL USING (auth.role() = 'service_role');
```

### Table: content_pages (NEW — CMS for static pages)
```sql
CREATE TABLE content_pages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  body_mdx   TEXT NOT NULL DEFAULT '',
  section    TEXT NOT NULL CHECK (section IN ('company', 'product', 'legal', 'help')),
  published  BOOLEAN DEFAULT false,
  seo_title  TEXT,
  seo_desc   TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_content_slug ON content_pages(slug);
CREATE INDEX idx_content_section ON content_pages(section);
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published pages" ON content_pages FOR SELECT USING (published = true);
CREATE POLICY "Service role manages content" ON content_pages FOR ALL USING (auth.role() = 'service_role');

-- Seed initial pages
INSERT INTO content_pages (slug, title, section, published, body_mdx) VALUES
  ('fee-schedule', 'Fee Schedule', 'product', true, '# Fee Schedule'),
  ('trading-hours', 'Trading Hours', 'product', true, '# Trading Hours'),
  ('responsible-trading', 'Responsible Trading', 'product', true, '# Responsible Trading'),
  ('privacy-policy', 'Privacy Policy', 'legal', true, '# Privacy Policy'),
  ('terms-of-service', 'Terms of Service', 'legal', true, '# Terms of Service'),
  ('careers', 'Careers', 'company', true, '# Careers'),
  ('brand-kit', 'Brand Kit', 'company', true, '# Brand Kit'),
  ('api-docs', 'API Documentation', 'product', true, '# API Docs'),
  ('help-center', 'Help Center', 'help', true, '# Help Center'),
  ('faq', 'FAQ', 'help', true, '# FAQ')
ON CONFLICT DO NOTHING;
```

### Table: analytics_events (NEW — custom event store, feeds into Segment/Mixpanel)
```sql
CREATE TABLE analytics_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet  TEXT,  -- nullable for anonymous
  event_name   TEXT NOT NULL,  -- 'sign_up', 'trade_placed', 'market_created', etc.
  properties   JSONB DEFAULT '{}'::jsonb,
  session_id   TEXT,
  ip_hash      TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_user ON analytics_events(user_wallet);
CREATE INDEX idx_analytics_date ON analytics_events(created_at DESC);
-- Partition by month for performance at scale
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access analytics" ON analytics_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users read own events" ON analytics_events FOR SELECT USING (auth.uid()::text = user_wallet);
```

### Table: notifications (NEW)
```sql
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet  TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('trade_settled', 'market_resolved', 'mention', 'like', 'system', 'burn_alert')),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT false,
  action_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notif_user ON notifications(user_wallet);
CREATE INDEX idx_notif_unread ON notifications(user_wallet) WHERE is_read = false;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_wallet);
CREATE POLICY "Users mark own read" ON notifications FOR UPDATE USING (auth.uid()::text = user_wallet);
CREATE POLICY "Service role creates notifications" ON notifications FOR INSERT USING (auth.role() = 'service_role');
```

---

## MIGRATION EXECUTION ORDER

```
001-initial-schema.sql           ← assumed already run (markets, trades, positions)
002-consent-log.sql              ← already run
003-leaderboard-cache.sql        ← already run
004-add-market-type.sql          ← already run
005-users-full-profile.sql       ← NEW: users table with reputation/stake
006-fees-and-revenue.sql         ← NEW: fees_log, revenue_distribution, burn_events
007-social-system.sql            ← NEW: social_posts, post_comments, post_likes
008-api-keys.sql                 ← NEW: api_keys table
009-content-pages.sql            ← NEW: content_pages + seed data
010-analytics-events.sql         ← NEW: analytics_events
011-notifications.sql            ← NEW: notifications
012-markets-overhaul-columns.sql ← NEW: add subcategory, group_id, live_badge to markets
```

---

## TABLE RELATIONSHIPS SUMMARY

| Table                | Relates To           | Type         | Via Column           |
|----------------------|----------------------|--------------|----------------------|
| users                | markets              | 1:M          | creator_wallet       |
| users                | trades               | 1:M          | user_wallet          |
| users                | social_posts         | 1:M          | author_wallet        |
| users                | api_keys             | 1:M          | user_wallet          |
| users                | notifications        | 1:M          | user_wallet          |
| markets              | trades               | 1:M          | market_id            |
| markets              | fees_log             | 1:M          | market_id            |
| markets              | social_posts         | 1:M (opt)    | market_id            |
| trades               | fees_log             | 1:1          | trade_id             |
| social_posts         | post_comments        | 1:M          | post_id              |
| social_posts         | post_likes           | 1:M          | post_id              |
| consent_log          | users                | M:1 (opt)    | user_wallet          |
| leaderboard_cache    | users                | cache only   | rank_data JSONB      |
| analytics_events     | users                | M:1 (opt)    | user_wallet          |

---

## STAKE-GATED MARKET CREATION LOGIC

```
Requirement: stake_balance >= 500 DATX to enable is_creator_eligible = true

Flow:
  1. User stakes DATX via Anchor program
  2. Webhook updates users.stake_balance
  3. Trigger checks: IF stake_balance >= 500 THEN is_creator_eligible = true
  4. /market-builder page checks is_creator_eligible before rendering form

SQL Trigger:
CREATE OR REPLACE FUNCTION check_creator_eligibility()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stake_balance >= 500 THEN
    NEW.is_creator_eligible := true;
  ELSE
    NEW.is_creator_eligible := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_creator_eligibility
  BEFORE UPDATE OF stake_balance ON users
  FOR EACH ROW EXECUTE FUNCTION check_creator_eligibility();
```

---

## API KEY RATE LIMITS

| Tier    | Rate Limit   | Cost/Month | Endpoints          |
|---------|-------------|------------|---------------------|
| free    | 30 req/min  | $0         | Read-only markets   |
| premium | 300 req/min | $50 USD    | Full read+write SDK |

---

## INDEXES SUMMARY

```
markets:         category, market_type, status, created_at, group_id, live_badge
trades:          user_wallet, market_id, created_at
fees_log:        market_id, user_wallet, created_at
users:           username, reputation_score, stake_balance
social_posts:    author_wallet, market_id, created_at
api_keys:        user_wallet, key_hash
analytics_events: event_name, user_wallet, created_at
notifications:   user_wallet, (user_wallet WHERE is_read=false)
```
