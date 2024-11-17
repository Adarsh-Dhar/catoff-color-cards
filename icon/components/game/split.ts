import { ALL_CARDS, AllCard } from '../cards/all_cards';

export function split(): { 
    players: Record<string, AllCard[]>; 
    deck: AllCard[]; 
} {
    // Step 1: Create a copy of the cards array to avoid modifying the original data
    const cardsCopy = [...ALL_CARDS];

    // Step 2: Shuffle the cardsCopy array
    const shuffledCards = cardsCopy.sort(() => Math.random() - 0.5);

    // Step 3: Select the first 24 cards and separate the remaining as the deck
    const selectedCards = shuffledCards.slice(0, 32);
    const remainingDeck = shuffledCards.slice(32);

    // Step 4: Distribute the selected cards among 4 players
    const players: Record<string, AllCard[]> = {
        player1: [],
        player2: [],
        player3: [],
        player4: [],
    };

    selectedCards.forEach((card, index) => {
        const playerKey = `player${(index % 4) + 1}`;
        players[playerKey].push(card);
    });

    // Return players and remaining deck
    return { players, deck: remainingDeck };
}

// Example usage:
const { players, deck } = split();
console.log(players);
console.log(deck);

// Export the deck for external use
export const DECK = deck;
