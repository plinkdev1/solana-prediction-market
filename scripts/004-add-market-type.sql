-- Migration: Add market_type and resolution_window_hours columns
-- Supports dual-market system: Sewer Lore (44 markets) + Flash Bets (20 markets)

ALTER TABLE markets ADD COLUMN IF NOT EXISTS market_type TEXT 
  NOT NULL DEFAULT 'lore'
  CHECK (market_type IN ('lore', 'fast'));

-- Resolution window in hours (for fast market countdown displays)
ALTER TABLE markets ADD COLUMN IF NOT EXISTS resolution_window_hours INTEGER;

-- Index for filtering by market type (used extensively in queries)
CREATE INDEX IF NOT EXISTS idx_markets_market_type ON markets(market_type);

-- Index for finding fast markets by resolution window (for countdown queries)
CREATE INDEX IF NOT EXISTS idx_markets_resolution_window ON markets(resolution_window_hours) 
  WHERE market_type = 'fast';

-- Update all existing markets to 'lore' type (backward compatibility)
UPDATE markets SET market_type = 'lore' 
  WHERE market_type IS NULL OR market_type = '';
