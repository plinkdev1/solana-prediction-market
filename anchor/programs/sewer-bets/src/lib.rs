use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount, Transfer};

declare_id!("SewerBets111111111111111111111111111111111");

#[program]
pub mod sewer_bets {
    use super::*;

    /// Create a new prediction market with multi-token support
    pub fn create_market(
        ctx: Context<CreateMarket>,
        market_id: String,
        title: String,
        description: String,
        resolution_timestamp: i64,
        primary_token: TokenType,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.market_id = market_id;
        market.title = title;
        market.description = description;
        market.resolution_timestamp = resolution_timestamp;
        market.primary_token = primary_token;
        market.status = MarketStatus::Active;
        market.yes_pool_datx = 0;
        market.no_pool_datx = 0;
        market.yes_pool_sol = 0;
        market.no_pool_sol = 0;
        market.yes_pool_usdc = 0;
        market.no_pool_usdc = 0;
        market.total_volume = 0;
        market.bump = ctx.bumps.market;
        
        msg!("[v0] Market created: {}", market.market_id);
        Ok(())
    }

    /// Place a bet on a market (yes/no) with any supported token
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        side: BetSide,
        amount: u64,
        token_type: TokenType,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        // Validate market is active
        require!(market.status == MarketStatus::Active, ErrorCode::MarketNotActive);
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        // Transfer tokens from user to market pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.market_pool.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        // Update market pools
        match (token_type, side) {
            (TokenType::DATX, BetSide::Yes) => market.yes_pool_datx += amount,
            (TokenType::DATX, BetSide::No) => market.no_pool_datx += amount,
            (TokenType::SOL, BetSide::Yes) => market.yes_pool_sol += amount,
            (TokenType::SOL, BetSide::No) => market.no_pool_sol += amount,
            (TokenType::USDC, BetSide::Yes) => market.yes_pool_usdc += amount,
            (TokenType::USDC, BetSide::No) => market.no_pool_usdc += amount,
        }
        market.total_volume += amount;
        
        // Create or update position
        let position = &mut ctx.accounts.position;
        position.user = ctx.accounts.user.key();
        position.market = market.key();
        position.side = side;
        position.token_type = token_type;
        position.amount += amount;
        position.bump = ctx.bumps.position;
        
        msg!("[v0] Bet placed: {} {} on {:?}", amount, token_type.to_string(), side);
        Ok(())
    }

    /// Resolve a market (admin/multisig only)
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: BetSide,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        require!(market.status == MarketStatus::Active, ErrorCode::MarketAlreadyResolved);
        require!(ctx.accounts.authority.key() == market.authority, ErrorCode::Unauthorized);
        
        market.status = MarketStatus::Resolved;
        market.outcome = Some(outcome);
        
        // Calculate rake and burn amounts
        let total_pool = market.yes_pool_datx + market.no_pool_datx +
                        market.yes_pool_sol + market.no_pool_sol +
                        market.yes_pool_usdc + market.no_pool_usdc;
        
        let losing_pool = match outcome {
            BetSide::Yes => market.no_pool_datx + market.no_pool_sol + market.no_pool_usdc,
            BetSide::No => market.yes_pool_datx + market.yes_pool_sol + market.yes_pool_usdc,
        };
        
        // 20% of losing pool burns to Reserve Hole
        let burn_amount = (losing_pool * 20) / 100;
        
        // 7% treasury, 3% team from total pool
        let treasury_rake = (total_pool * 7) / 100;
        let team_rake = (total_pool * 3) / 100;
        
        // Execute burns (placeholder - actual implementation needs token::burn calls)
        msg!("[v0] Market resolved: {:?}, Burn: {}, Treasury: {}, Team: {}", 
             outcome, burn_amount, treasury_rake, team_rake);
        
        Ok(())
    }

    /// Claim payout from a resolved market
    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        let market = &ctx.accounts.market;
        let position = &mut ctx.accounts.position;
        
        require!(market.status == MarketStatus::Resolved, ErrorCode::MarketNotResolved);
        require!(position.claimed == false, ErrorCode::AlreadyClaimed);
        require!(Some(position.side) == market.outcome, ErrorCode::LosingBet);
        
        // Calculate pro-rata payout
        let winning_pool = match position.side {
            BetSide::Yes => market.yes_pool_datx + market.yes_pool_sol + market.yes_pool_usdc,
            BetSide::No => market.no_pool_datx + market.no_pool_sol + market.no_pool_usdc,
        };
        
        let total_pool = market.yes_pool_datx + market.no_pool_datx +
                        market.yes_pool_sol + market.no_pool_sol +
                        market.yes_pool_usdc + market.no_pool_usdc;
        
        // Subtract rake (10% total) from payout pool
        let payout_pool = (total_pool * 90) / 100;
        let user_share = (position.amount * payout_pool) / winning_pool;
        
        // Transfer payout from market pool to user
        let seeds = &[
            b"market",
            market.market_id.as_bytes(),
            &[market.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.market_pool.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: market.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, user_share)?;
        
        position.claimed = true;
        position.payout_amount = user_share;
        
        msg!("[v0] Payout claimed: {}", user_share);
        Ok(())
    }

    /// Cancel a market (admin only, before any bets)
    pub fn cancel_market(ctx: Context<CancelMarket>) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        require!(market.total_volume == 0, ErrorCode::MarketHasBets);
        require!(ctx.accounts.authority.key() == market.authority, ErrorCode::Unauthorized);
        
        market.status = MarketStatus::Cancelled;
        
        msg!("[v0] Market cancelled: {}", market.market_id);
        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
pub struct Market {
    pub authority: Pubkey,
    pub market_id: String,
    pub title: String,
    pub description: String,
    pub resolution_timestamp: i64,
    pub primary_token: TokenType,
    pub status: MarketStatus,
    pub outcome: Option<BetSide>,
    
    // Multi-token pools
    pub yes_pool_datx: u64,
    pub no_pool_datx: u64,
    pub yes_pool_sol: u64,
    pub no_pool_sol: u64,
    pub yes_pool_usdc: u64,
    pub no_pool_usdc: u64,
    
    pub total_volume: u64,
    pub bump: u8,
}

#[account]
pub struct Position {
    pub user: Pubkey,
    pub market: Pubkey,
    pub side: BetSide,
    pub token_type: TokenType,
    pub amount: u64,
    pub claimed: bool,
    pub payout_amount: u64,
    pub bump: u8,
}

// ============================================================================
// Context Structures
// ============================================================================

#[derive(Accounts)]
#[instruction(market_id: String)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 64 + 256 + 512 + 8 + 1 + 1 + 2 + 8*6 + 8 + 1,
        seeds = [b"market", market_id.as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 32 + 1 + 1 + 8 + 1 + 8 + 1,
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub position: Account<'info, Position>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub market_pool: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub position: Account<'info, Position>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub market_pool: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    pub authority: Signer<'info>,
}

// ============================================================================
// Enums & Types
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TokenType {
    DATX,
    SOL,
    USDC,
}

impl ToString for TokenType {
    fn to_string(&self) -> String {
        match self {
            TokenType::DATX => "DATX".to_string(),
            TokenType::SOL => "SOL".to_string(),
            TokenType::USDC => "USDC".to_string(),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BetSide {
    Yes,
    No,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MarketStatus {
    Active,
    Resolved,
    Cancelled,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Market is not active")]
    MarketNotActive,
    
    #[msg("Invalid bet amount")]
    InvalidAmount,
    
    #[msg("Market already resolved")]
    MarketAlreadyResolved,
    
    #[msg("Market not resolved yet")]
    MarketNotResolved,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Payout already claimed")]
    AlreadyClaimed,
    
    #[msg("This is a losing bet")]
    LosingBet,
    
    #[msg("Market has existing bets")]
    MarketHasBets,
}
