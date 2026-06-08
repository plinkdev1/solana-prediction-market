// DXMarkets - Sewer Bets on Solana - Constants

// Token Mints (Solana SPL addresses)
export const TOKEN_MINTS = {
  DATX: 'HwqrGdE2kb32PqyUQNg3vETUmmUbkmG3KnS9rVMWpump', // $DATX on pump.fun
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Official USDC
  wSOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
} as const;

// Placeholder for Anchor program
export const PROGRAM_ID = 'DXMkt1111111111111111111111111111111111111'; // TODO: Replace after deployment

// Network config
export const SOLANA_NETWORK = 'devnet' as const;
export const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

// Rake distribution (basis points = 0.01%)
export const BURN_RATE_BPS = 2000; // 20%
export const TREASURY_RATE_BPS = 700; // 7%
export const TEAM_RATE_BPS = 300; // 3%
export const TOTAL_RAKE_BPS = BURN_RATE_BPS + TREASURY_RATE_BPS + TEAM_RATE_BPS; // 30%

// Market Categories (expanded with elections + market-trends)
export const MARKET_CATEGORIES = [
  'satirical',
  'crypto',
  'political',
  'el-shito',
  'datxit',
  'xitmas',
  'tech',
  'sports',
  'elections',
  'market-trends',
  'custom',
] as const;

export type MarketCategory = typeof MARKET_CATEGORIES[number];

// Tab metadata for UI (label + neon accent)
export const CATEGORY_TABS: { value: MarketCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Bets', color: '#ff00aa' },
  { value: 'satirical', label: 'Satirical', color: '#ff00aa' },
  { value: 'crypto', label: 'Crypto', color: '#00ffcc' },
  { value: 'political', label: 'Political', color: '#ff6600' },
  { value: 'el-shito', label: 'El Shito', color: '#8b4513' },
  { value: 'datxit', label: 'DatXit', color: '#ff00aa' },
  { value: 'xitmas', label: 'Xitmas', color: '#00ff44' },
  { value: 'tech', label: 'Tech', color: '#00ffcc' },
  { value: 'sports', label: 'Sports', color: '#ff6600' },
  { value: 'elections', label: 'Elections', color: '#ff0044' },
  { value: 'market-trends', label: 'Market Trends', color: '#ffcc00' },
  { value: 'custom', label: 'Custom', color: '#a0a0ff' },
];

// Market Type Configuration (Lore vs Fast Markets)
export const MARKET_TYPE_CONFIG = {
  lore: {
    label: 'Sewer Lore',
    icon: 'Flame',
    description: 'Narrative-driven, long-term prediction markets tied to the DatXit sewer ecosystem. Slower resolution, deeper lore integration.',
    color: '#ff00aa', // neon pink
    badgeText: 'LORE',
  },
  fast: {
    label: 'Flash Bets',
    icon: 'Zap',
    description: 'Quick-fire prediction markets on real-world events. Fast resolution, high velocity. Polymarket meets the sewer.',
    color: '#00ffcc', // neon cyan
    badgeText: 'FAST',
  },
} as const;

// Token selector options
export const TOKEN_OPTIONS = [
  {
    value: 'DATX',
    label: '$DATX',
    mint: TOKEN_MINTS.DATX,
    decimals: 9,
    icon: '💩', // Placeholder
  },
  {
    value: 'SOL',
    label: 'SOL',
    mint: TOKEN_MINTS.wSOL,
    decimals: 9,
    icon: '◎',
  },
  {
    value: 'USDC',
    label: 'USDC',
    mint: TOKEN_MINTS.USDC,
    decimals: 6,
    icon: '$',
  },
] as const;

export type TokenType = typeof TOKEN_OPTIONS[number]['value'];
