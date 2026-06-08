-- DXMarkets Database Schema
-- Multi-token prediction markets on Solana

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  total_volume DECIMAL(20, 2) DEFAULT 0,
  total_profit DECIMAL(20, 2) DEFAULT 0,
  markets_won INTEGER DEFAULT 0,
  markets_lost INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('crypto', 'politics', 'sports', 'entertainment', 'tech', 'world')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved', 'cancelled')),
  
  -- Probabilities (0-100)
  yes_probability INTEGER DEFAULT 50 CHECK (yes_probability >= 0 AND yes_probability <= 100),
  no_probability INTEGER DEFAULT 50 CHECK (no_probability >= 0 AND no_probability <= 100),
  
  -- Pools by token type
  yes_pool_datx DECIMAL(20, 2) DEFAULT 0,
  no_pool_datx DECIMAL(20, 2) DEFAULT 0,
  yes_pool_sol DECIMAL(20, 6) DEFAULT 0,
  no_pool_sol DECIMAL(20, 6) DEFAULT 0,
  yes_pool_usdc DECIMAL(20, 2) DEFAULT 0,
  no_pool_usdc DECIMAL(20, 2) DEFAULT 0,
  
  -- Totals
  total_volume DECIMAL(20, 2) DEFAULT 0,
  total_positions INTEGER DEFAULT 0,
  
  -- Token type for primary pool
  primary_token TEXT NOT NULL DEFAULT 'DATX' CHECK (primary_token IN ('DATX', 'SOL', 'USDC')),
  
  -- Resolution
  resolution_date TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolution_outcome TEXT CHECK (resolution_outcome IN ('yes', 'no', 'invalid')),
  resolver_address TEXT,
  
  -- Metadata
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Solana program account
  program_account TEXT UNIQUE,
  
  -- AI-generated lore
  lore_description TEXT,
  satirical_tags TEXT[]
);

-- Positions table (user bets)
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Position details
  outcome TEXT NOT NULL CHECK (outcome IN ('yes', 'no')),
  token_type TEXT NOT NULL CHECK (token_type IN ('DATX', 'SOL', 'USDC')),
  amount DECIMAL(20, 6) NOT NULL,
  shares DECIMAL(20, 6) NOT NULL,
  
  -- Entry price (probability at time of bet)
  entry_probability INTEGER NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'claimed', 'cancelled')),
  
  -- Payout
  payout_amount DECIMAL(20, 6),
  claimed_at TIMESTAMPTZ,
  
  -- Metadata
  transaction_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(market_id, user_id, transaction_signature)
);

-- Trades table (for real-time feed)
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Trade details
  outcome TEXT NOT NULL CHECK (outcome IN ('yes', 'no')),
  token_type TEXT NOT NULL CHECK (token_type IN ('DATX', 'SOL', 'USDC')),
  amount DECIMAL(20, 6) NOT NULL,
  shares DECIMAL(20, 6) NOT NULL,
  price DECIMAL(10, 6) NOT NULL,
  
  -- Probabilities after trade
  yes_probability_after INTEGER NOT NULL,
  no_probability_after INTEGER NOT NULL,
  
  -- Transaction
  transaction_signature TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treasury table (rake, burns, fees)
CREATE TABLE IF NOT EXISTS treasury (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Totals
  total_volume DECIMAL(20, 2) DEFAULT 0,
  total_rake_datx DECIMAL(20, 2) DEFAULT 0,
  total_burned_datx DECIMAL(20, 2) DEFAULT 0,
  total_protocol_fees DECIMAL(20, 6) DEFAULT 0,
  
  -- Markets stats
  markets_created INTEGER DEFAULT 0,
  markets_resolved INTEGER DEFAULT 0,
  markets_cancelled INTEGER DEFAULT 0,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial treasury record
INSERT INTO treasury (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_markets_status ON markets(status);
CREATE INDEX IF NOT EXISTS idx_markets_category ON markets(category);
CREATE INDEX IF NOT EXISTS idx_markets_resolution_date ON markets(resolution_date);
CREATE INDEX IF NOT EXISTS idx_positions_market_id ON positions(market_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_trades_market_id ON trades(market_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treasury_updated_at BEFORE UPDATE ON treasury
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury ENABLE ROW LEVEL SECURITY;

-- Public read access for markets and trades
CREATE POLICY "Markets are viewable by everyone" ON markets
  FOR SELECT USING (true);

CREATE POLICY "Trades are viewable by everyone" ON trades
  FOR SELECT USING (true);

CREATE POLICY "Treasury is viewable by everyone" ON treasury
  FOR SELECT USING (true);

-- Users can view their own data
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own positions" ON positions
  FOR SELECT USING (auth.uid()::text = user_id::text OR true);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role has full access to users" ON users
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to markets" ON markets
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to positions" ON positions
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to trades" ON trades
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to treasury" ON treasury
  USING (auth.jwt()->>'role' = 'service_role');
