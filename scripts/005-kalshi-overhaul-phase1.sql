-- ============================================================
-- Migration 005: Kalshi Overhaul Phase 1 (idempotent)
-- ============================================================

-- ── Extend users table ──────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS bio                TEXT,
  ADD COLUMN IF NOT EXISTS twitter_handle     TEXT,
  ADD COLUMN IF NOT EXISTS reputation         INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier               TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_bets         INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS win_rate           DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS is_banned          BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Extend markets table ─────────────────────────────────────
ALTER TABLE markets
  ADD COLUMN IF NOT EXISTS is_live          BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS live_started_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subcategory      TEXT,
  ADD COLUMN IF NOT EXISTS multiplier       DECIMAL(10,4),
  ADD COLUMN IF NOT EXISTS view_count       INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count    INTEGER NOT NULL DEFAULT 0;

-- ── consent_log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_log (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  age_gate       BOOLEAN NOT NULL DEFAULT FALSE,
  cookie_consent BOOLEAN NOT NULL DEFAULT FALSE,
  tos_accepted   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── leaderboard_cache ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank         INTEGER NOT NULL,
  score        DECIMAL(20,2) NOT NULL DEFAULT 0,
  total_volume DECIMAL(20,2) NOT NULL DEFAULT 0,
  total_profit DECIMAL(20,2) NOT NULL DEFAULT 0,
  win_rate     DECIMAL(5,2),
  tier         TEXT NOT NULL DEFAULT 'free',
  period       TEXT NOT NULL DEFAULT 'all_time',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── fees_log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fees_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id     UUID REFERENCES trades(id) ON DELETE SET NULL,
  market_id    UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_type   TEXT NOT NULL,
  gross_amount DECIMAL(20,6) NOT NULL,
  fee_rate     DECIMAL(8,6)  NOT NULL,
  fee_amount   DECIMAL(20,6) NOT NULL,
  net_amount   DECIMAL(20,6) NOT NULL,
  fee_type     TEXT NOT NULL DEFAULT 'taker',
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── revenue_distribution ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS revenue_distribution (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_start     TIMESTAMPTZ NOT NULL,
  period_end       TIMESTAMPTZ NOT NULL,
  total_fees_datx  DECIMAL(20,6) NOT NULL DEFAULT 0,
  total_fees_sol   DECIMAL(20,6) NOT NULL DEFAULT 0,
  total_fees_usdc  DECIMAL(20,6) NOT NULL DEFAULT 0,
  burn_amount_datx DECIMAL(20,6) NOT NULL DEFAULT 0,
  treasury_amount  DECIMAL(20,6) NOT NULL DEFAULT 0,
  creator_amount   DECIMAL(20,6) NOT NULL DEFAULT 0,
  distributed_at   TIMESTAMPTZ,
  distribution_tx  TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── burn_events ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS burn_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount_datx     DECIMAL(20,6) NOT NULL,
  trigger_type    TEXT NOT NULL DEFAULT 'fee',
  transaction_sig TEXT UNIQUE,
  triggered_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  market_id       UUID REFERENCES markets(id) ON DELETE SET NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── content_pages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_pages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT UNIQUE NOT NULL,
  page_type        TEXT NOT NULL DEFAULT 'legal',
  title            TEXT NOT NULL,
  subtitle         TEXT,
  content          TEXT NOT NULL,
  excerpt          TEXT,
  author           TEXT,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title       TEXT,
  meta_description TEXT,
  cover_image_url  TEXT,
  tags             TEXT[],
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── api_keys ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash           TEXT UNIQUE NOT NULL,
  key_prefix         TEXT NOT NULL,
  name               TEXT NOT NULL,
  tier               TEXT NOT NULL DEFAULT 'free',
  rate_limit_per_min INTEGER NOT NULL DEFAULT 60,
  last_used_at       TIMESTAMPTZ,
  expires_at         TIMESTAMPTZ,
  revoked_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── social_posts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_posts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  market_id           UUID REFERENCES markets(id) ON DELETE SET NULL,
  content             TEXT NOT NULL,
  media_url           TEXT,
  media_type          TEXT,
  position_outcome    TEXT,
  probability_at_post INTEGER,
  like_count          INTEGER NOT NULL DEFAULT 0,
  comment_count       INTEGER NOT NULL DEFAULT 0,
  bookmark_count      INTEGER NOT NULL DEFAULT 0,
  is_pinned           BOOLEAN NOT NULL DEFAULT FALSE,
  is_removed          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── social_interactions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_interactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  comment_content TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id, type)
);

-- ── reputation_scores ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reputation_scores (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_score        INTEGER NOT NULL DEFAULT 0,
  bets_placed        INTEGER NOT NULL DEFAULT 0,
  bets_won           INTEGER NOT NULL DEFAULT 0,
  volume_traded      DECIMAL(20,2) NOT NULL DEFAULT 0,
  markets_created    INTEGER NOT NULL DEFAULT 0,
  markets_resolved   INTEGER NOT NULL DEFAULT 0,
  social_posts_count INTEGER NOT NULL DEFAULT 0,
  days_active        INTEGER NOT NULL DEFAULT 0,
  can_create_market  BOOLEAN NOT NULL DEFAULT FALSE,
  can_create_fast    BOOLEAN NOT NULL DEFAULT FALSE,
  stake_required     DECIMAL(20,6) NOT NULL DEFAULT 100,
  stake_locked       DECIMAL(20,6) NOT NULL DEFAULT 0,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Triggers (safe: drop first) ───────────────────────────────
DROP TRIGGER IF EXISTS update_content_pages_updated_at    ON content_pages;
DROP TRIGGER IF EXISTS update_social_posts_updated_at     ON social_posts;
DROP TRIGGER IF EXISTS update_reputation_scores_updated_at ON reputation_scores;

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reputation_scores_updated_at
  BEFORE UPDATE ON reputation_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
