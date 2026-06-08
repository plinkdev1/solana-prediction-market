# DXMarket — An On-Chain Prediction Market for Contrarian, Satirical Outcomes

A Solana-based prediction market where users stake a native token ($DATX) on dark, contrarian propositions about real-world events. Markets resolve through community governance, losing positions feed a deflationary burn, and a public API lets bots trade programmatically.

> **Status:** MVP / mock-mode. Market browsing, market detail, and leaderboard flows are implemented; on-chain settlement and the Supabase-backed data APIs are in progress.

## Overview

DXMarket is the prediction-market arm of the $DATX ecosystem. Where mainstream prediction markets price serious financial and political events, DXMarket prices satire — contrarian, tongue-in-cheek propositions — as simple binary (Yes/No) share markets. Users browse open markets, take a position with the native token, and track standings on a global leaderboard.

It is built as a typed Next.js 16 (App Router) application. Markets, positions, and resolution are designed to settle on Solana, with the on-chain layer kept behind dedicated API routes and a Supabase data layer so the trading UI stays independent of the settlement mechanism. A public API exposes markets so external bots can read and trade programmatically.

## Core Features

- **Markets engine** — binary Yes/No share markets with a browsable grid (`/bets`) and per-market detail pages (`/markets/[id]`) showing the proposition, current pricing, and open positions.
- **Micro-bets in $DATX** — positions are taken with a native SPL token; no fiat and no house edge beyond a small rake.
- **Community resolution** — outcomes settle through a multisig + DAO vote rather than a single trusted oracle.
- **Deflationary burn** — a share of losing positions is burned, contracting token supply over time.
- **Public API** — open endpoints so external bots can read markets and place positions programmatically.
- **Leaderboard** — global ranking of top predictors (`/leaderboard`).
- **Cross-chain (roadmap)** — planned cross-chain liquidity via Nitrolite state channels.

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router, Turbopack), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Chain | Solana — SPL token, on-chain escrow & burn (in progress) |
| Wallet | Phantom via Alchemy RPC |
| Data / API | Next.js API routes backed by Supabase (Postgres) |
| Cross-chain | Nitrolite (roadmap) |

**Project layout.** App-Router routes for the market grid (`/bets`), market detail (`/markets/[id]`), and leaderboard (`/leaderboard`), with server-side routes under `app/api/*` (e.g. `leaderboard`, `consent`) wrapping the Supabase data layer. Token, escrow, and burn logic sit behind those routes so the front end never talks to the chain directly.

## Screenshots

<p align="center">
  <img src="screenshots/01.png" width="800" /><br/><br/>
  <img src="screenshots/02.png" width="800" /><br/><br/>
  <img src="screenshots/03.png" width="800" /><br/><br/>
  <img src="screenshots/04.png" width="800" /><br/><br/>
</p>

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # add your own keys
pnpm dev
```

Required environment variables (names only — never commit real values):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SOLANA_RPC_URL=

## Roadmap

- On-chain settlement and burn on Solana mainnet
- DAO-based market creation and resolution
- Public bot/API documentation
- Cross-chain liquidity via Nitrolite

## Notes

This repository is shared as a portfolio artifact demonstrating product and system design. It is an early prototype, not a finished product. All markets are satirical and for entertainment only — nothing here is financial advice, and the project involves no real-money gambling.
