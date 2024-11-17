use anchor_lang::prelude::*;

declare_id!("CcavjFofgadiL2GH4pPHpXzXQMHbMMcdivofwuZGypoR");

#[program]
pub mod uno_game {
    use super::*;

    pub fn initialize_game(
        ctx: Context<InitializeGame>,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.host = ctx.accounts.host.key();
        game.current_players = 1;
        game.game_state = GameStateOptions::Lobby;
        game.current_turn = 0;
        game.direction = true; // true = clockwise
        game.current_card = None;
        
        // Initialize first player
        game.players[0] = Some(PlayerState {
            player_pubkey: ctx.accounts.host.key(),
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
        
        require!(
            game.current_players < 4,
            GameError::GameFull
        );
        
        // Verify player hasn't already joined
        require!(
            !game.players.iter().any(|p| {
                p.as_ref().map_or(false, |p| p.player_pubkey == ctx.accounts.player.key())
            }),
            GameError::PlayerAlreadyJoined
        );
        
        // Store the current_players value before modifying the array
        let current_player_index = game.current_players as usize;
        
        // Add new player
        game.players[current_player_index] = Some(PlayerState {
            player_pubkey: ctx.accounts.player.key(),
            cards_count: 0,
            has_uno: false,
        });
        
        game.current_players += 1;
    
        Ok(())
    }

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        require!(
            game.current_players == 4,
            GameError::NeedFourPlayers
        );
        
        require!(
            game.game_state == GameStateOptions::Lobby,
            GameError::GameNotInLobby
        );
        
        require!(
            game.host == ctx.accounts.host.key(),
            GameError::NotGameHost
        );

        // Deal 7 cards to each player
        for player in game.players.iter_mut().flatten() {
            player.cards_count = 7;
        }
        
        game.game_state = GameStateOptions::Active;
        
        Ok(())
    }

    pub fn play_card(
        ctx: Context<PlayCard>,
        card_code: String,    // e.g., "4G", "RS", "W", "D4"
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        require!(
            game.game_state == GameStateOptions::Active,
            GameError::GameNotActive
        );
        
        // Verify it's the player's turn
        let current_player = game.players[game.current_turn as usize]
            .as_ref()
            .unwrap();
                
        require!(
            current_player.player_pubkey == ctx.accounts.player.key(),
            GameError::NotPlayerTurn
        );
    
        // Parse and validate card code
        let card = Card::from_code(&card_code)?;
        
        // Verify the card can be played
        if let Some(current_card) = &game.current_card {
            require!(
                card.can_be_played_on(current_card),
                GameError::InvalidCard
            );
        }
        
        // Update game state
        game.current_card = Some(card);
        
        // Store the current turn index before modifying the array
        let current_turn_index = game.current_turn as usize;
        
        // Update player's card count
        let player = game.players[current_turn_index].as_mut().unwrap();
        player.cards_count = player.cards_count.checked_sub(1)
            .ok_or(GameError::InvalidCardCount)?;
        
        // Handle special cards
        match card.card_type {
            CardType::Reverse => {
                game.direction = !game.direction;
                advance_turn(game);
            },
            CardType::Skip => advance_turn_by(game, 2),
            CardType::DrawTwo => {
                let next_player_idx = get_next_player_idx(game);
                game.players[next_player_idx].as_mut().unwrap().cards_count += 2;
                advance_turn_by(game, 2);
            },
            CardType::WildDrawFour => {
                let next_player_idx = get_next_player_idx(game);
                game.players[next_player_idx].as_mut().unwrap().cards_count += 4;
                advance_turn_by(game, 2);
            },
            _ => advance_turn(game),
        }
        
        Ok(())
    }
    pub fn declare_uno(ctx: Context<DeclareUno>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        // Find player index
        let player_index = game.players.iter().position(|p| {
            p.as_ref().map_or(false, |p| p.player_pubkey == ctx.accounts.player.key())
        }).unwrap();
        
        let player = game.players[player_index].as_mut().unwrap();
        require!(player.cards_count == 1, GameError::TooManyCards);
        
        player.has_uno = true;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = host,
        space = GameState::SPACE
    )]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub host: Signer<'info>,
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
pub struct StartGame<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    pub host: Signer<'info>,
}

#[derive(Accounts)]
pub struct PlayCard<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeclareUno<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct GameState {
    pub host: Pubkey,
    pub current_players: u8,
    pub game_state: GameStateOptions,
    pub current_turn: u8,
    pub direction: bool,
    pub current_card: Option<Card>,
    pub players: [Option<PlayerState>; 4],  // Fixed 4 players
}

impl GameState {
    const SPACE: usize = 8 + // discriminator
        32 + // host
        1 + // current_players
        1 + // game_state
        1 + // current_turn
        1 + // direction
        3 + // current_card (2 for enum + 1 for color)
        (4 * (32 + 1 + 1)); // players array (4 players)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameStateOptions {
    Lobby,
    Active,
    Finished,
}

impl Default for GameStateOptions {
    fn default() -> Self {
        Self::Lobby
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub struct PlayerState {
    pub player_pubkey: Pubkey,
    pub cards_count: u8,
    pub has_uno: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum CardColor {
    Red,    // R
    Blue,   // B
    Green,  // G
    Yellow, // Y
    Wild,   // W
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum CardType {
    Number(u8),  // 0-9
    Skip,        // S
    Reverse,     // R
    DrawTwo,     // D2
    Wild,        // W
    WildDrawFour, // D4
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub struct Card {
    pub color: CardColor,
    pub card_type: CardType,
}

impl Card {
    pub fn from_code(code: &str) -> Result<Self> {
        let code = code.to_uppercase();
        
        // Handle special cards first
        match code.as_str() {
            "W" => return Ok(Card { color: CardColor::Wild, card_type: CardType::Wild }),
            "D4" => return Ok(Card { color: CardColor::Wild, card_type: CardType::WildDrawFour }),
            _ => {}
        }
        
        // Handle other cards
        if code.len() != 2 {
            return Err(GameError::InvalidCardCode.into());
        }
        
        let color = match code.chars().nth(1).unwrap() {
            'R' => CardColor::Red,
            'B' => CardColor::Blue,
            'G' => CardColor::Green,
            'Y' => CardColor::Yellow,
            _ => return Err(GameError::InvalidCardCode.into()),
        };
        
        let card_type = match code.chars().next().unwrap() {
            'S' => CardType::Skip,
            'R' => CardType::Reverse,
            'D' => CardType::DrawTwo,
            n if n.is_digit(10) => CardType::Number(n.to_digit(10).unwrap() as u8),
            _ => return Err(GameError::InvalidCardCode.into()),
        };
        
        Ok(Card { color, card_type })
    }
    
    pub fn can_be_played_on(&self, other: &Card) -> bool {
        // Wild cards can always be played
        if matches!(self.card_type, CardType::Wild | CardType::WildDrawFour) {
            return true;
        }
        
        // Match color or card type
        self.color == other.color || match (self.card_type, other.card_type) {
            (CardType::Number(n1), CardType::Number(n2)) => n1 == n2,
            (t1, t2) => std::mem::discriminant(&t1) == std::mem::discriminant(&t2),
        }
    }
}

#[error_code]
pub enum GameError {
    #[msg("Game is full")]
    GameFull,
    #[msg("Game is not in lobby state")]
    GameNotInLobby,
    #[msg("Need exactly 4 players to start")]
    NeedFourPlayers,
    #[msg("Only the host can perform this action")]
    NotGameHost,
    #[msg("Game is not active")]
    GameNotActive,
    #[msg("Not player's turn")]
    NotPlayerTurn,
    #[msg("Invalid card played")]
    InvalidCard,
    #[msg("Invalid card code format")]
    InvalidCardCode,
    #[msg("Too many cards to declare UNO")]
    TooManyCards,
    #[msg("Invalid card count")]
    InvalidCardCount,
    #[msg("Player has already joined")]
    PlayerAlreadyJoined,
}

fn advance_turn(game: &mut GameState) {
    advance_turn_by(game, 1);
}

fn advance_turn_by(game: &mut GameState, steps: u8) {
    if game.direction {
        game.current_turn = (game.current_turn + steps) % 4;
    } else {
        game.current_turn = (4 + game.current_turn - steps) % 4;
    }
}

fn get_next_player_idx(game: &GameState) -> usize {
    if game.direction {
        ((game.current_turn + 1) % 4) as usize
    } else {
        ((4 + game.current_turn - 1) % 4) as usize
    }
}