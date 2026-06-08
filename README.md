# DXMarket

![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-MVP-orange)

> **A satirical, community-resolved prediction market on Solana.** Bet a native token ($DATX) on contrarian, real-world propositions. Markets settle via a multisig + DAO process, losing positions feed a deflationary burn pool, and a public API lets bots trade programmatically.

DXMarket is the prediction-market arm of the **$DATX ecosystem** (Treezures Labs). Where mainstream markets price serious finance, DXMarket prices satire — political hypocrisy, rug-pull timelines, cultural events — as binary (Yes/No) share markets.

## Features

| Module | Description |
|---|---|
| **Markets engine** | Binary Yes/No share markets with live pricing and a per-market detail view (description, chart, positions). |
| **Micro-bets** | Stake small amounts of $DATX; no fiat, no house edge beyond rake. |
| **Community resolution** | Outcomes resolved through a multisig + DAO governance vote rather than a single oracle. |
| **Deflationary burn** | A share of losing positions is burned, shrinking $DATX supply over time. |
| **Public API** | Open REST API so external bots can read markets and place positions. |
| **Cross-chain roadmap** | Planned cross-chain liquidity via Nitrolite state channels. |
| **Leaderboard** | Ranks top predictors by realized performance. |

## Engineering highlights

- **On-chain settlement** — Solana program handles position escrow, payout, and burn on resolution.
- **$DATX SPL integration** — native SPL token used as the sole betting asset.
- **Governance-based oracle** — multisig + DAO resolution flow instead of a trusted single source.
- **Bot-friendly API** — public endpoints designed for programmatic market-making.
- **Neon Next.js frontend** — themed market grid, market detail, create-market, my-bets, and leaderboard pages.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| Chain | Solana (SPL token, on-chain escrow/burn program) |
| Wallet | Phantom, Alchemy RPC |
| Backend | Serverless (resolution/oracle + public API) |
| Cross-chain | Nitrolite (roadmap) |

## Architecture
Next.js client ──▶ Serverless API (markets, resolution, public bot API)
│                     │
▼                     ▼
Phantom wallet      Solana programs (escrow · payout · burn)
│
▼
$DATX SPL token + DAO governance

## Status

Early MVP / mock-mode. Part of the $DATX ecosystem under Treezures Labs.
