// DXMarkets Sewer Microcopy Arsenal
// Randomly scatter these as tooltips, loading texts, empty states, etc.

export const MICROCOPY = {
  loaders: [
    "Flushing the cache...",
    "Brewing fresh sludge...",
    "Loading more shit...",
    "Sewer pipes clogged, wait...",
    "Stirring the swamp...",
    "El Shito is tagging the backend...",
  ],
  buttonHovers: [
    "Click if you dare",
    "This might rug... your expectations",
    "Stake here, sink forever",
    "Burn it before it burns you",
    "Harvest sludge or starve",
    "Connect wallet = enter sewer",
    "Vote or be flushed",
  ],
  emptyStates: [
    "Nothing here yet. Everything is shit anyway.",
    "No memes? Make some, degen.",
    "Swamp's dry today. Burn more.",
    "No sightings of El Shito... yet.",
    "Council chamber empty. Only the shittiest enter.",
  ],
  errors: [
    "Sewer Overflow 404 – Page not found, like hope in 2025",
    "Connection lost. Blame the government.",
    "Site melting... refresh or cope",
    "Too much shit detected. Try again.",
    "Human made, AI edited, server hated",
  ],
  success: [
    "Flushed successfully.",
    "Sludge harvested. Enjoy the stink.",
    "Burn complete. Supply tighter.",
    "Tagged. El Shito approves.",
    "Staked. Welcome to the muck.",
  ],
  sidebarHints: [
    "The swamp never sleeps.",
    "Everything is shit. Prove us wrong.",
    "Hold or fold – both smell bad.",
    "RaidX incoming. Prepare your memes.",
    "Reserve Hole hungrier than ever.",
  ],
  footerExtras: [
    "Built on Solana. Runs on cope.",
    "Human made. AI edited. Degen approved.",
    "Proudly the shittiest since Dec 21, 2025",
    "No moon. Just sewer.",
    "Democracy is shit. SHIT DAO is shittier.",
  ],
  walletPrompts: [
    "No wallet? Get Phantom. It's free and already full of shit.",
    "Connect or lurk. Your choice, ngmi.",
    "Wallet detected. Smells like potential.",
  ],
  liquiditySwamp: [
    "Yields bubbling... or rotting",
    "Stake deep. Regret deeper.",
    "Sludge APY: Whatever the swamp farts today",
  ],
  generalChaos: [
    "Dec 21, 2025 – The day the world turned to shit.",
    "DatXit: Exiting the matrix, entering the bowl.",
    "Free speech zone. Flush hate elsewhere.",
    "2B supply. Getting tighter one burn at a time.",
    "The shitty world ends where DatXit begins.",
  ],
} as const;

export type MicrocopyCategory = keyof typeof MICROCOPY;

export function getRandomMicrocopy(category: MicrocopyCategory): string {
  const options = MICROCOPY[category];
  return options[Math.floor(Math.random() * options.length)];
}

export function getAllMicrocopy(): typeof MICROCOPY {
  return MICROCOPY;
}
