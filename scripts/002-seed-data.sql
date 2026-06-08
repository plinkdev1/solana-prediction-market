-- Seed DXMarkets with mock data

-- Insert test users
INSERT INTO users (id, wallet_address, username, total_volume, total_profit, markets_won, markets_lost)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin', 'SewerRat420', 125000, 12500, 5, 2),
  ('22222222-2222-2222-2222-222222222222', 'DatXitWhale69hQP2nMxsVx7rN8fN8mVHYTJcWzHpump', 'CryptoDegenLord', 89000, -3200, 3, 4),
  ('33333333-3333-3333-3333-333333333333', 'SoLana4LiFeEzRt1x6yYwMn3kH9vBnW8eXpump', 'MoonBoyGG', 45000, 8900, 2, 1)
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert markets
INSERT INTO markets (
  id, title, description, category, status,
  yes_probability, no_probability,
  yes_pool_datx, no_pool_datx, yes_pool_sol, no_pool_sol, yes_pool_usdc, no_pool_usdc,
  total_volume, total_positions, primary_token,
  resolution_date, image_url, lore_description, satirical_tags
)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Will $DATX hit $1 by March 2026?',
    'The ultimate moonshot bet. Will the shittiest memecoin in the sewer actually pump to a dollar? Probably not, but degens gonna degen.',
    'crypto',
    'active',
    68, 32,
    450000, 210000, 0, 0, 0, 0,
    660000, 234,
    'DATX',
    '2026-03-31T23:59:59Z',
    '/markets/datx-moon.jpg',
    'In the deepest trenches of the blockchain sewer, a token emerges. Not because it is good. Not because it has utility. But because chaos is a ladder and degeneracy is the fuel.',
    ARRAY['moonshot', 'memecoin', 'delusion', 'hopium']
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Trump wins 2024 election (again)?',
    'Political betting for degens who think democracy is just another casino. Will the orange man return or nah?',
    'politics',
    'active',
    52, 48,
    0, 0, 23.5, 21.8, 0, 0,
    45.3, 89,
    'SOL',
    '2026-11-05T23:59:59Z',
    '/markets/trump-2024.jpg',
    'In a world where politics is theater and theater is a dumpster fire, only one question matters: will the memes manifest reality?',
    ARRAY['politics', 'chaos', 'democracy-lol', 'divided-we-meme']
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Bitcoin crashes below $20k in 2026?',
    'Bear market bet for the pessimists. Will BTC finally return to reasonable prices or keep mooning forever?',
    'crypto',
    'active',
    28, 72,
    89000, 228000, 0, 0, 0, 0,
    317000, 156,
    'DATX',
    '2026-12-31T23:59:59Z',
    '/markets/btc-crash.jpg',
    'The king of coins teeters on its throne. Bears sharpen their claws. Bulls polish their horns. The sewer watches with popcorn.',
    ARRAY['bitcoin', 'bear-market', 'fud', 'cope-or-rope']
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'AI takes over crypto trading by EOY?',
    'Will the bots finally enslave us all? Bet on whether AI agents will dominate 50%+ of crypto volume.',
    'tech',
    'active',
    73, 27,
    0, 0, 0, 0, 18500, 6850,
    25350, 67,
    'USDC',
    '2026-12-31T23:59:59Z',
    '/markets/ai-takeover.jpg',
    'Skynet but for your portfolio. The machines are coming. They trade faster, sleep never, and feel nothing. Humanity had a good run.',
    ARRAY['ai', 'automation', 'dystopia', 'skynet-lite']
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Messi retires from soccer in 2026?',
    'Sports betting meets crypto degeneracy. Will the GOAT hang up his boots or keep farming?',
    'sports',
    'active',
    61, 39,
    123000, 78900, 0, 0, 0, 0,
    201900, 112,
    'DATX',
    '2026-10-15T23:59:59Z',
    '/markets/messi-retire.jpg',
    'Legends never die, they just fade into memes. Will the greatest of all time call it quits or continue the legacy?',
    ARRAY['soccer', 'goat', 'retirement', 'sports-cope']
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Solana network down 10+ times in 2026?',
    'The classic Solana reliability bet. Will the blockchain stay up or continue its tradition of naps?',
    'crypto',
    'active',
    82, 18,
    567000, 124200, 0, 0, 0, 0,
    691200, 289,
    'DATX',
    '2026-12-31T23:59:59Z',
    '/markets/solana-down.jpg',
    'They say Solana is fast. Fast to crash, that is. A love letter to decentralization, or just another hot garbage fire?',
    ARRAY['solana', 'downtime', 'network-issues', 'cope']
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample positions
INSERT INTO positions (
  market_id, user_id, outcome, token_type, amount, shares, 
  entry_probability, status, transaction_signature
)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'yes', 'DATX', 5000, 5200, 65, 'active', '5x1signature1111111111111111111111111111111111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'no', 'DATX', 3000, 3100, 35, 'active', '5x2signature2222222222222222222222222222222222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'yes', 'SOL', 2.5, 2.6, 50, 'active', '5x3signature3333333333333333333333333333333333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'no', 'DATX', 8000, 8500, 70, 'active', '5x4signature4444444444444444444444444444444444444444444'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'yes', 'USDC', 1500, 1550, 72, 'active', '5x5signature5555555555555555555555555555555555555555555')
ON CONFLICT DO NOTHING;

-- Insert sample trades
INSERT INTO trades (
  market_id, user_id, outcome, token_type, amount, shares, price,
  yes_probability_after, no_probability_after, transaction_signature
)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'yes', 'DATX', 5000, 5200, 0.961538, 68, 32, 'tx1signature111111111111111111111111111111111111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'no', 'DATX', 3000, 3100, 0.967742, 68, 32, 'tx2signature222222222222222222222222222222222222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'yes', 'SOL', 2.5, 2.6, 0.961538, 52, 48, 'tx3signature333333333333333333333333333333333333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'no', 'DATX', 8000, 8500, 0.941176, 28, 72, 'tx4signature444444444444444444444444444444444444444444444'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'yes', 'USDC', 1500, 1550, 0.967742, 73, 27, 'tx5signature555555555555555555555555555555555555555555555')
ON CONFLICT DO NOTHING;

-- Update treasury stats
UPDATE treasury 
SET 
  total_volume = 2000000,
  total_rake_datx = 45000,
  total_burned_datx = 22500,
  total_protocol_fees = 125.50,
  markets_created = 6,
  markets_resolved = 0,
  markets_cancelled = 0
WHERE id = '00000000-0000-0000-0000-000000000001';
