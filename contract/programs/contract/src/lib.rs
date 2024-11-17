use anchor_lang::prelude::*;
declare_id!("CcavjFofgadiL2GH4pPHpXzXQMHbMMcdivofwuZGypoR");

#[program]
pub mod uno_game {
    use super::*;
    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        player2: Pubkey,
        player3: Pubkey,
        player4: Pubkey,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        // Increment the game ID for new game
        game.current_game_id = game.current_game_id.checked_add(1).unwrap_or(1);
        
        game.player1 = ctx.accounts.player1.key(); // Host is player1
        game.player2 = player2;
        game.player3 = player3;
        game.player4 = player4;
        game.game_state = GameStateOptions::Lobby;
        game.current_turn = 0;
        game.direction = true; // true = clockwise
        game.current_card = None;
        game.current_players = 1; // Host is already counted

        // Initialize host as first player
        game.players[0] = Some(PlayerState {
            player_pubkey: ctx.accounts.player1.key(),
            cards_count: 0,
            has_uno: false,
        });
        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.game_state == GameStateOptions::Lobby,
            GameError::GameNotInLobby
        );

        // Check if the joining player's public key matches any of the initialized players
        require!(
            ctx.accounts.player.key() == game.player2 ||
            ctx.accounts.player.key() == game.player3 ||
            ctx.accounts.player.key() == game.player4,
            GameError::PlayerNotInGame
        );

        // Verify player hasn't already joined
        require!(
            !game.players.iter().any(|p| {
                p.as_ref().map_or(false, |p| p.player_pubkey == ctx.accounts.player.key())
            }),
            GameError::PlayerAlreadyJoined
        );

        // Find the correct position for the player
        let player_position = if ctx.accounts.player.key() == game.player2 {
            1
        } else if ctx.accounts.player.key() == game.player3 {
            2
        } else {
            3
        };

        // Add new player at the correct position
        game.players[player_position] = Some(PlayerState {
            player_pubkey: ctx.accounts.player.key(),
            cards_count: 0,
            has_uno: false,
        });
        
        game.current_players += 1;
        Ok(())
    }

    // Add a new function to end game and decrease game_id
    pub fn end_game(ctx: Context<EndGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        // Verify only the host (player1) can end the game
        require!(
            ctx.accounts.player.key() == game.player1,
            GameError::UnauthorizedGameEnd
        );

        // Decrease game ID when game ends
        game.current_game_id = game.current_game_id.checked_sub(1).unwrap_or(0);
        
        game.game_state = GameStateOptions::Ended;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = player1,
        space = GameState::SPACE
    )]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player1: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndGame<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct GameState {
    pub current_game_id: u64,
    pub player1: Pubkey, //host
    pub player2: Pubkey,
    pub player3: Pubkey,
    pub player4: Pubkey,
    pub game_state: GameStateOptions,
    pub current_turn: u8,
    pub direction: bool,
    pub current_card: Option<Card>,
    pub current_players: u8,
    pub players: [Option<PlayerState>; 4], // Fixed 4 players
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameStateOptions {
    Lobby,
    InProgress,
    Ended,
}


impl Default for GameStateOptions {
    fn default() -> Self {
        Self::Lobby
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct PlayerState {
    pub player_pubkey: Pubkey,
    pub cards_count: u8,
    pub has_uno: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Card {
    pub color: CardColor,
    pub value: CardValue,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CardColor {
    Red,
    Blue,
    Green,
    Yellow,
    Wild,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CardValue {
    Number(u8),
    Skip,
    Reverse,
    DrawTwo,
    Wild,
    WildDrawFour,
}

impl GameState {
    const SPACE: usize = 8 + // discriminator
        8 + // current_game_id (u64)
        32 + // player1
        32 + // player2
        32 + // player3
        32 + // player4
        1 + // game_state
        1 + // current_turn
        1 + // direction
        3 + // current_card (2 for enum + 1 for color)
        1 + // current_players
        (4 * (32 + 1 + 1)); // players array (4 players)
}

#[error_code]
pub enum GameError {
    #[msg("Player is not part of this game")]
    PlayerNotInGame,
    #[msg("Game is not in lobby state")]
    GameNotInLobby,
    #[msg("Player has already joined")]
    PlayerAlreadyJoined,
    #[msg("Only the host can end the game")]
    UnauthorizedGameEnd,
}