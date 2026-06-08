-- ============================================================
-- Migration 007: Seed content_pages with legal, help, blog stubs
-- ============================================================

INSERT INTO content_pages (slug, page_type, title, subtitle, content, excerpt, published, featured, meta_title, meta_description, published_at)
VALUES

-- ── Legal Pages ─────────────────────────────────────────────
(
  'privacy',
  'legal',
  'Privacy Policy',
  'How we collect, use, and protect your data',
  E'# Privacy Policy\n\n**Last updated: February 2026**\n\n## 1. Information We Collect\n\nDXMarkets collects wallet addresses, trading activity, and usage analytics. We do not collect personal identification information unless you voluntarily provide it.\n\n## 2. How We Use Your Information\n\nWe use collected information to:\n- Operate and improve the platform\n- Calculate fees and distribute revenue\n- Detect and prevent fraud\n- Provide customer support\n- Send platform updates (opt-in only)\n\n## 3. Data Sharing\n\nWe do not sell your data. We share data with:\n- Supabase (database hosting)\n- Vercel (platform hosting)\n- Segment + Mixpanel (analytics, anonymized)\n\n## 4. On-Chain Data\n\nAll trades and positions on Solana are public by design. This is the nature of blockchain technology.\n\n## 5. Your Rights\n\nYou can request deletion of off-chain data at any time via support@dxmarkets.xyz.\n\n## 6. Contact\n\nFor privacy concerns: privacy@dxmarkets.xyz',
  'How DXMarkets collects, uses, and protects your data.',
  true,
  false,
  'Privacy Policy | DXMarkets',
  'DXMarkets privacy policy — how we handle your data.',
  NOW()
),

(
  'terms',
  'legal',
  'Terms of Service',
  'Rules for using DXMarkets',
  E'# Terms of Service\n\n**Last updated: February 2026**\n\n## 1. Acceptance\n\nBy using DXMarkets you agree to these terms. If you disagree, do not use the platform.\n\n## 2. Eligibility\n\nYou must be 18 or older. You must not be in a jurisdiction where prediction markets are prohibited.\n\n## 3. Prediction Markets\n\nDXMarkets is a satirical, community-driven prediction market platform. Markets are resolved based on publicly verifiable real-world outcomes.\n\n## 4. Fees\n\nTaker fees are calculated as `fee = 0.035 × p × (1-p)` per contract. Fee schedules are available at /fees.\n\n## 5. Risk Disclosure\n\nTrading involves substantial risk of loss. Never trade more than you can afford to lose. $DATX is a utility token with no guaranteed value.\n\n## 6. Prohibited Activity\n\nManipulation, wash trading, and Sybil attacks are prohibited and will result in permanent bans.\n\n## 7. Contact\n\nlegal@dxmarkets.xyz',
  'Rules and conditions for using the DXMarkets prediction markets platform.',
  true,
  false,
  'Terms of Service | DXMarkets',
  'DXMarkets terms of service — rules for using our prediction markets platform.',
  NOW()
),

(
  'data-terms',
  'legal',
  'Data Terms of Service',
  'Terms governing use of DXMarkets data and APIs',
  E'# Data Terms of Service\n\n**Last updated: February 2026**\n\n## 1. Data Access\n\nFree-tier API access provides read access to public market data with rate limits of 60 req/min.\n\nPremium-tier ($50/month) provides 1000 req/min and access to historical data exports.\n\n## 2. Permitted Use\n\n- Personal research and analysis\n- Building non-competing applications\n- Academic research\n\n## 3. Prohibited Use\n\n- Reselling raw data feeds\n- Building competing prediction market platforms without a commercial license\n- Automated trading bots without written consent\n\n## 4. Attribution\n\nIf you display DXMarkets data publicly, you must attribute "Data provided by DXMarkets".\n\n## 5. Contact\n\napi@dxmarkets.xyz',
  'Terms governing use of DXMarkets market data and developer APIs.',
  true,
  false,
  'Data Terms | DXMarkets',
  'Data terms of service for DXMarkets APIs and market data.',
  NOW()
),

(
  'responsible-trading',
  'legal',
  'Responsible Trading',
  'Trade safely, stay in control',
  E'# Responsible Trading\n\n## Know Your Limits\n\nPrediction markets can be addictive. Set daily limits and stick to them.\n\n## Risk Management\n\n- Never bet more than 5% of your portfolio on a single market\n- Diversify across categories and timeframes\n- Fast markets carry higher risk due to rapid resolution\n\n## Signs of Problem Gambling\n\n- Chasing losses\n- Hiding activity from others\n- Betting money needed for essentials\n\n## Resources\n\n- National Problem Gambling Helpline: 1-800-522-4700\n- Gamblers Anonymous: www.gamblersanonymous.org\n\n## Self-Exclusion\n\nContact support@dxmarkets.xyz to request a self-exclusion period.',
  'Guidelines for safe and responsible prediction market trading.',
  true,
  false,
  'Responsible Trading | DXMarkets',
  'Guidelines for responsible prediction market trading on DXMarkets.',
  NOW()
),

-- ── Help Pages ───────────────────────────────────────────────
(
  'faq',
  'help',
  'Frequently Asked Questions',
  'Everything you need to know about DXMarkets',
  E'# Frequently Asked Questions\n\n## What is DXMarkets?\n\nDXMarkets is a satirical prediction markets platform on Solana. Bet on real-world events using $DATX, SOL, or USDC.\n\n## What are Sewer Lore markets?\n\nLore markets are long-form, narrative-driven prediction markets tied to the DatXit ecosystem. They resolve over days, weeks, or months.\n\n## What are Flash Bets?\n\nFlash Bets resolve in hours or days — quick-fire predictions on crypto prices, sports scores, breaking news.\n\n## How are fees calculated?\n\nTaker fees use the formula: `fee = 0.035 × p × (1-p)` where p is the probability at trade time. This means fees are highest near 50/50 markets.\n\n## How do I create a market?\n\nYou need a reputation score of 100+ and 100 DATX staked. Go to /create-market.\n\n## What tokens are supported?\n\n$DATX, SOL, and USDC. Each market has a primary token.\n\n## How does market resolution work?\n\nMarkets resolve based on publicly verifiable outcomes. Resolvers are assigned at creation.\n\n## Where can I get $DATX?\n\nOn Raydium, Jupiter, or any Solana DEX. Contract address on /token page.',
  'Answers to the most common questions about DXMarkets.',
  true,
  true,
  'FAQ | DXMarkets',
  'Frequently asked questions about DXMarkets prediction markets on Solana.',
  NOW()
),

(
  'fees',
  'help',
  'Fee Schedule',
  'Transparent breakdown of all platform fees',
  E'# Fee Schedule\n\n## Taker Fee Formula\n\n```\nfee = 0.035 × p × (1 - p)\n```\n\nWhere `p` is the probability (0 to 1) at time of trade.\n\n### Example calculations:\n\n| Probability | Fee Rate | $100 trade cost |\n|-------------|----------|------------------|\n| 10% / 90%  | 0.315%   | $0.32            |\n| 25% / 75%  | 0.656%   | $0.66            |\n| 50% / 50%  | 0.875%   | $0.88            |\n| 75% / 25%  | 0.656%   | $0.66            |\n\n## Revenue Distribution\n\n| Destination    | Share |\n|----------------|-------|\n| $DATX Burn     | 30%   |\n| Protocol Treasury | 40% |\n| Market Creator | 20%  |\n| Resolver       | 10%  |\n\n## Premium API Tier\n\n$50/month for 1000 req/min and historical data exports.\n\n## No fees on:\n- Viewing markets\n- Withdrawing winnings\n- Creating a wallet',
  'Complete breakdown of trading fees and revenue distribution on DXMarkets.',
  true,
  false,
  'Fee Schedule | DXMarkets',
  'DXMarkets fee schedule — taker fees, revenue distribution, and API pricing.',
  NOW()
),

(
  'help',
  'help',
  'Help Center',
  'Guides and support for DXMarkets',
  E'# Help Center\n\n## Getting Started\n\n1. Connect your Solana wallet (Phantom, Backpack, Solflare)\n2. Browse markets at /bets\n3. Choose YES or NO on any market\n4. Select your token (DATX, SOL, USDC) and amount\n5. Confirm the transaction\n\n## Understanding Odds\n\nOdds are displayed as probabilities (0-100%). 65% means 65 cents to win $1 if YES resolves.\n\n## Claiming Winnings\n\nWinnings are automatically claimable after market resolution. Go to /portfolio > Resolved.\n\n## Wallet Issues\n\nIf your wallet does not connect, try:\n- Refreshing the page\n- Clearing browser cache\n- Using a different browser\n\n## Contact Support\n\nsupport@dxmarkets.xyz or join our Discord.',
  'Getting started guide and support documentation for DXMarkets.',
  true,
  true,
  'Help Center | DXMarkets',
  'DXMarkets help center — guides for getting started, trading, and support.',
  NOW()
),

-- ── Blog Posts ───────────────────────────────────────────────
(
  'blog/introducing-flash-bets',
  'blog',
  'Introducing Flash Bets: Polymarket Speed, Sewer Soul',
  'Quick-fire prediction markets are now live on DXMarkets',
  E'# Introducing Flash Bets\n\nToday we are launching **Flash Bets** — a new class of prediction markets that resolve in hours, not months.\n\n## What makes Flash Bets different?\n\n- Resolution windows from 12 hours to 30 days\n- Real-world events: crypto prices, sports scores, breaking politics\n- Live countdown timers on every card\n- Cyan badge system to distinguish from Lore markets\n\n## How to find Flash Bets\n\nClick the **Flash Bets** toggle at the top of /bets, or look for the Zap icon on any market card.\n\n## The first 20 Flash Markets\n\nWe launched with 20 markets across crypto, sports, politics, tech, and elections. BTC price targets, UEFA upsets, SEC announcements, and more.\n\nMore coming every week. Stay sewer, stay degenerate.',
  'Flash Bets bring Polymarket-style speed to the DXMarkets sewer ecosystem.',
  true,
  true,
  'Introducing Flash Bets | DXMarkets Blog',
  'Flash Bets are now live — quick-fire prediction markets on DXMarkets with countdown timers.',
  NOW()
),

(
  'blog/how-fees-work',
  'blog',
  'How Fees Work on DXMarkets',
  'A transparent breakdown of our taker fee model',
  E'# How Fees Work on DXMarkets\n\nTransparency is core to how we operate. Here is exactly how fees work.\n\n## The Formula\n\n```\nfee = 0.035 × p × (1 - p)\n```\n\nThis ensures fees are proportional to market uncertainty. At 50/50 the fee is highest (0.875%). At 90/10 it drops to 0.315%.\n\n## Where fees go\n\n- **30% burned** — $DATX tokens are permanently destroyed, reducing supply\n- **40% treasury** — funds platform development and operations\n- **20% market creator** — rewards community members who create good markets\n- **10% resolver** — rewards the resolution oracle\n\n## Why this model?\n\nWe believe in aligning incentives. Creators get paid. Degens burn supply. Everyone wins (except the ones who bet wrong).',
  'Transparent breakdown of DXMarkets taker fee formula and revenue distribution.',
  true,
  false,
  'How Fees Work | DXMarkets Blog',
  'Learn how DXMarkets taker fees are calculated and how revenue is distributed.',
  NOW()
)

ON CONFLICT (slug) DO UPDATE SET
  title       = EXCLUDED.title,
  content     = EXCLUDED.content,
  updated_at  = NOW();
