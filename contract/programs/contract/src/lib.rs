use anchor_lang::prelude::*;
declare_id!("CcavjFofgadiL2GH4pPHpXzXQMHbMMcdivofwuZGypoR");

#[program]
pub mod uno_game {
    use super::*;
    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        player2: Pubkey,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        // Existing initialization code...
        game.current_game_id = game.current_game_id.checked_add(1).unwrap_or(1);
        game.player1 = ctx.accounts.player1.key();
        game.player2 = player2;
        game.game_state = GameStateOptions::Lobby;
        game.current_turn = "player1".to_string();
        game.current_card = "".to_string();
        game.draw_deck = vec![
            "0Red", "1Red", "2Red", "3Red", "4Red", "5Red", "6Red", "7Red", "8Red", "9Red",
            "0Green", "1Green", "2Green", "3Green", "4Green", "5Green", "6Green", "7Green", "8Green", "9Green",
            "0Blue", "1Blue", "2Blue", "3Blue", "4Blue", "5Blue", "6Blue", "7Blue", "8Blue", "9Blue",
            "0Yellow", "1Yellow", "2Yellow", "3Yellow", "4Yellow", "5Yellow", "6Yellow", "7Yellow", "8Yellow", "9Yellow",
            "SkipRed", "SkipGreen", "SkipBlue", "SkipYellow",
            "TakeTwoRed", "TakeTwoGreen", "TakeTwoBlue", "TakeTwoYellow",
            "Wild", "Wild", "Wild", "Wild",
            "WildDrawFour", "WildDrawFour", "WildDrawFour", "WildDrawFour"
        ]
        .iter()
        .map(|&s| s.to_string())
        .collect();
        
        game.player1_deck = Vec::new();
        game.player2_deck = Vec::new();
        game.played_deck = Vec::new();
        
        // Call split to distribute cards
          // Create a mutable copy of indices that we can shuffle
          let mut indices: Vec<usize> = (0..game.draw_deck.len()).collect();
        
          // Shuffle the indices using Fisher-Yates algorithm
          let mut rng = XorShift64 { state: Clock::get().unwrap().unix_timestamp as u64 };
          for i in (1..indices.len()).rev() {
              let j = (rng.next() % (i + 1) as u64) as usize;
              indices.swap(i, j);
          }
      
          // Take the first 8 * 2 = 16 cards for players
          let (player_cards, remaining) = indices.split_at(16);
          
          // Distribute cards to players
          for (i, &idx) in player_cards.iter().enumerate() {
              let card = game.draw_deck[idx].clone();
              match i / 8 {
                  0 => game.player1_deck.push(card),
                  1 => game.player2_deck.push(card),
                  _ => unreachable!(),
              }
          }
      
          // Move remaining cards to draw deck
          let mut new_draw_deck = Vec::new();
          for &idx in remaining {
              new_draw_deck.push(game.draw_deck[idx].clone());
          }
          game.draw_deck = new_draw_deck;
      
          // Update first card in played deck
          if let Some(first_card) = game.draw_deck.pop() {
              game.played_deck.push(first_card);
          }
      
          
        
        Ok(())
    }

    pub fn get_player_cards(ctx: Context<GetPlayerCards>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let player = ctx.accounts.player.key();

        // Verify the player is part of the game
        require!(
            player == game.player1 || 
            player == game.player2,
            GameError::PlayerNotInGame
        );

        

        // Get and store the correct deck based on player's public key
        let player_cards = match player {
            p if p == game.player1 => game.player1_deck.clone(),
            p if p == game.player2 => game.player2_deck.clone(),
            _ => return Err(GameError::InvalidPlayer.into()),
        };


        Ok(())
    }

    pub fn get_player_card_count(ctx: Context<GetPlayerCards>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let player = ctx.accounts.player.key();

        // Verify the player is part of the game
        require!(
            player == game.player1 || 
            player == game.player2,
            GameError::PlayerNotInGame
        );

        // Get and store the card count based on player's public key
        let current_player = match player {
            p if p == game.player1 => game.player1_deck.len() as u8,
            p if p == game.player2 => game.player2_deck.len() as u8,
            _ => return Err(GameError::InvalidPlayer.into()),
        };

        Ok(())
    }


    // pub fn draw_card(ctx: Context<DrawCard>) -> Result<()> {
    //     let game = &mut ctx.accounts.game;
    //     let player = ctx.accounts.player.key();

    //     // Check if it's player's turn
    //     require!(
    //         match game.current_turn {
    //             player1 => game.player1 == player,
    //             player2 => game.player2 == player,
    //             _ => return Err(GameError::InvalidPlayer.into()),
    //         },
    //         GameError::InvalidPlayer
    //     );

    //     // Check if game is in progress
    //     require!(
    //         game.game_state == GameStateOptions::InProgress,
    //         GameError::GameNotInProgress
    //     );

    //     // If draw deck is empty, shuffle played deck into draw deck
    //     if game.draw_deck.is_empty() {
    //         if game.played_deck.is_empty() {
    //             return Err(GameError::NoCardsAvailable.into());
    //         }

    //         // Keep the top card of played deck
    //         let top_card = game.played_deck.pop().unwrap();

    //         // Move all cards from played deck to draw deck
    //         game.clone().draw_deck.append(&mut game.played_deck);

    //         // Shuffle the draw deck
    //         let mut rng = XorShift64 { state: Clock::get().unwrap().unix_timestamp as u64 };
    //         for i in (1..game.draw_deck.len()).rev() {
    //             let j = (rng.next() % (i + 1) as u64) as usize;
    //             game.draw_deck.swap(i, j);
    //         }

    //         // Put back the top card in played deck
    //         game.played_deck.push(top_card);
    //     }
    //    Ok(())
       
    // }


pub fn play_card(ctx: Context<PlayCard>, card_to_play: String) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let player = ctx.accounts.player.key();
    let mut player_to_play = "";

    if player == game.player2 {
        player_to_play = "player2"
    } else {
        player_to_play = "player1"
    }

    if game.current_turn != player_to_play {
        return Err(GameError::NotYourTurn.into());
    }

    let card_color = get_card_color(&card_to_play);
    let card_value = get_card_value(&card_to_play);

    // Helper function to extract color from card string
    fn get_card_color(card: &str) -> &str {
        if card == "Wild" || card == "WildDrawFour" {
            "Wild"
        } else if card.contains("Red") {
            "Red"
        } else if card.contains("Blue") {
            "Blue"
        } else if card.contains("Green") {
            "Green"
        } else if card.contains("Yellow") {
            "Yellow"
        } else {
            ""
        }
    }

    // Helper function to extract value from card string
    fn get_card_value(card: &str) -> &str {
        if card == "Wild" || card == "WildDrawFour" {
            return card;
        }
        
        // For other cards, get everything before the color
        if let Some(pos) = card.find(|c: char| c.is_uppercase()) {
            &card[..pos]
        } else {
            card
        }
    }

    if (game.current_turn == "player1"){
        game.current_turn = "player2".to_string();
    } else {
        game.current_turn = "player1".to_string();
    }

    Ok(())
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
pub struct GetPlayerCards<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct DrawCard<'info> {
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
    pub game_state: GameStateOptions,
    pub total_play : u8,
    pub current_turn: String,
    pub direction: Direction,
    pub current_card: String,
    pub draw_deck : Vec<String>,
    pub player1_deck : Vec<String>,
    pub player2_deck : Vec<String>,
    pub played_deck : Vec<String>

}

#[derive(Accounts)]
pub struct PlayCard<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
}

pub struct XorShift64 {
    state: u64,
}

impl XorShift64 {
    fn next(&mut self) -> u64 {
        self.state ^= self.state << 13;
        self.state ^= self.state >> 7;
        self.state ^= self.state << 17;
        self.state
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum Direction {
   Clockwise,
   AntiClockwise
}

impl Default for Direction {
    fn default() -> Self {
        Self::Clockwise
    }
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
        1 + // game_state
        1 + // current_turn
        1 + // direction
        3 + // current_card (2 for enum + 1 for color)
        1 + // current_players
        (2 * (32 + 1 + 1)); // players array (2 players)
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
    #[msg("Invalid player")]
    InvalidPlayer,
    #[msg("Invalid card play")]
    InvalidCardPlay,
    #[msg("No cards are available")]
    NoCardsAvailable,
    #[msg("Game is not in progress")]
    GameNotInProgress,
    #[msg("Please wait for the other player to play")]
    NotYourTurn,
}
}