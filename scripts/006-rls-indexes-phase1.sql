-- ============================================================
-- Migration 006: RLS Policies + Indexes for Phase 1 tables
-- ============================================================

-- ── Enable RLS on all new tables ─────────────────────────────
ALTER TABLE fees_log              ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_distribution  ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys              ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_interactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_scores     ENABLE ROW LEVEL SECURITY;

-- ── fees_log policies ────────────────────────────────────────
-- Users can see their own fees; service role sees all
CREATE POLICY "Users see own fees" ON fees_log
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role full access to fees_log" ON fees_log
  USING (auth.jwt()->>'role' = 'service_role');

-- ── revenue_distribution policies ───────────────────────────
-- Public read (transparency); service role writes
CREATE POLICY "Revenue distribution is public" ON revenue_distribution
  FOR SELECT USING (true);

CREATE POLICY "Service role full access to revenue_distribution" ON revenue_distribution
  USING (auth.jwt()->>'role' = 'service_role');

-- ── burn_events policies ─────────────────────────────────────
CREATE POLICY "Burn events are public" ON burn_events
  FOR SELECT USING (true);

CREATE POLICY "Service role full access to burn_events" ON burn_events
  USING (auth.jwt()->>'role' = 'service_role');

-- ── content_pages policies ───────────────────────────────────
-- Only published pages are publicly visible
CREATE POLICY "Published content is public" ON content_pages
  FOR SELECT USING (published = true);

CREATE POLICY "Service role full access to content_pages" ON content_pages
  USING (auth.jwt()->>'role' = 'service_role');

-- ── api_keys policies ────────────────────────────────────────
-- Users can only see their own keys (never the hash)
CREATE POLICY "Users see own api_keys" ON api_keys
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role full access to api_keys" ON api_keys
  USING (auth.jwt()->>'role' = 'service_role');

-- ── social_posts policies ────────────────────────────────────
-- All visible except removed posts
CREATE POLICY "Social posts are public" ON social_posts
  FOR SELECT USING (is_removed = false);

CREATE POLICY "Users can insert own posts" ON social_posts
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Users can update own posts" ON social_posts
  FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Service role full access to social_posts" ON social_posts
  USING (auth.jwt()->>'role' = 'service_role');

-- ── social_interactions policies ────────────────────────────
CREATE POLICY "Interactions are public" ON social_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own interactions" ON social_interactions
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role full access to social_interactions" ON social_interactions
  USING (auth.jwt()->>'role' = 'service_role');

-- ── reputation_scores policies ───────────────────────────────
CREATE POLICY "Reputation scores are public" ON reputation_scores
  FOR SELECT USING (true);

CREATE POLICY "Service role full access to reputation_scores" ON reputation_scores
  USING (auth.jwt()->>'role' = 'service_role');

-- ── Indexes ──────────────────────────────────────────────────

-- fees_log
CREATE INDEX IF NOT EXISTS idx_fees_log_user_id    ON fees_log(user_id);
CREATE INDEX IF NOT EXISTS idx_fees_log_market_id  ON fees_log(market_id);
CREATE INDEX IF NOT EXISTS idx_fees_log_created_at ON fees_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fees_log_token_type ON fees_log(token_type);

-- revenue_distribution
CREATE INDEX IF NOT EXISTS idx_revenue_period ON revenue_distribution(period_start, period_end);

-- burn_events
CREATE INDEX IF NOT EXISTS idx_burn_events_created_at ON burn_events(created_at DESC);

-- content_pages
CREATE INDEX IF NOT EXISTS idx_content_pages_slug      ON content_pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_pages_type      ON content_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_content_pages_published ON content_pages(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_pages_featured  ON content_pages(featured) WHERE featured = true;

-- api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id    ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- social_posts
CREATE INDEX IF NOT EXISTS idx_social_posts_author_id  ON social_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_market_id  ON social_posts(market_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_visible    ON social_posts(is_removed, created_at DESC);

-- social_interactions
CREATE INDEX IF NOT EXISTS idx_social_interactions_post_id ON social_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_social_interactions_user_id ON social_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_social_interactions_type    ON social_interactions(type);

-- reputation_scores
CREATE INDEX IF NOT EXISTS idx_reputation_user_id    ON reputation_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_total      ON reputation_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_can_create ON reputation_scores(can_create_market) WHERE can_create_market = true;

-- markets (additional indexes)
CREATE INDEX IF NOT EXISTS idx_markets_is_live       ON markets(is_live) WHERE is_live = true;
CREATE INDEX IF NOT EXISTS idx_markets_subcategory   ON markets(subcategory);
CREATE INDEX IF NOT EXISTS idx_markets_view_count    ON markets(view_count DESC);

-- users (additional indexes)
CREATE INDEX IF NOT EXISTS idx_users_tier         ON users(tier);
CREATE INDEX IF NOT EXISTS idx_users_reputation   ON users(reputation DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_banned    ON users(is_banned) WHERE is_banned = true;
