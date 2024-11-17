"use client"
import { useState } from "react";
import {split} from "./split"
import { getCardByCall, AllCard } from "../cards/all_cards";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import Card from "../cards/card_design";

export const Game = () => {
    const {deck, players} = split()
    const player1 = players[0]
    const player2 = players[1]
    const player3 = players[2]
    const player4 = players[3]
    
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState('')
    const [turn, setTurn] = useState('')
    const [gameNumber, setGameNumber] = useState(0)
    const [player1Deck, setPlayer1Deck] = useState(player1)
    const [player2Deck, setPlayer2Deck] = useState(player2)
    const [player3Deck, setPlayer3Deck] = useState(player3)
    const [player4Deck, setPlayer4Deck] = useState(player4)
    const [channel, setChannel] = useState(true)
    const [currentColor, setCurrentColor] = useState('')
    const [currentCharacter, setCurrentCharacter] = useState(Number)
    const [playedCardsPile, setPlayedCardsPile] = useState<AllCard[]>([])
    const [drawCardPile, setDrawCardPile] = useState<AllCard[]>(deck)
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorOptions = ['red', 'blue', 'green', 'yellow'];

    const onPlayHandler = (call : string) => {
        const card = getCardByCall(call)
        if(!card) {
            alert("card not found");
            return;
        }
        //case-1
        //current card is a normal number card 
        //then extract prev color and number and match
        if (card.character == 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9) {
           nextTurn(1);
        }

        //case-2
        //current card is a skip card
        //skip 2 turn
        if (card.character == 11) {
             nextTurn(2)
        }
        

        //case-3
        //current card is a +1 card
        //skip 2 turn and give a card from the drawCardPile to the next turn
        if (card.character == 12) {
            give1CardFromDeck()
            nextTurn(2)
        }

        //case-4
        //current card is a reverse card
        //reverse the channel
        if (card.character == 10) {
            if(channel == true) {
                setChannel(false)
            }else {
                setChannel(true)
            }
            nextTurn(1)
        }

        //case-5
        //current card is a wild card
        //give a alert box to show the button where user can chose next color
        if (card.character == 13) {
            nextTurn(1)
       }
        

        //case-6
        //current card is a +4 wild card
        //skip the next turn give 4 cards from the draw cards deck to the next turn player and chose the future color
        if (card.character == 14) {
            give4CardFromDeck()
            nextTurn(2)
       }
    }



    //function to change the turn
    const nextTurn = (step : number) => {
        setGameNumber(gameNumber + step)
        let gameFactor = gameNumber % 4;
        if (channel == true) {
            if (gameFactor == 0) {
                setTurn("player1")
            } else if (gameFactor == 1) {
                setTurn("player2")
            } else if (gameFactor == 2) {
                setTurn("player3")
            } else if (gameFactor == 3) {
                setTurn("player4")
            }
        } else {
            if (gameFactor == 0) {
                setTurn("player1")
            } else if (gameFactor == 1) {
                setTurn("player4")
            } else if (gameFactor == 2) {
                setTurn("player3")
            } else if (gameFactor == 3) {
                setTurn("player2")
            }
        }
        
    }

    const give1CardFromDeck = () => {
        let nextPlayer = "";
        switch (turn) {
            case "player1":
                nextPlayer = "player2";
                break;
            case "player2":
                nextPlayer = "player3";
                break;
            case "player3":
                nextPlayer = "player4";
                break;
            case "player4":
                nextPlayer = "player1";
                break;
        }
        giveCardFromDeck(nextPlayer, 1);
    }

    const give4CardFromDeck = () => {
        let nextPlayer = "";
        switch (turn) {
            case "player1":
                nextPlayer = "player2";
                break;
            case "player2":
                nextPlayer = "player3";
                break;
            case "player3":
                nextPlayer = "player4";
                break;
            case "player4":
                nextPlayer = "player1";
                break;
        }
        giveCardFromDeck(nextPlayer, 4);
    }


    //function to give random card from the draw deck
    const giveCardFromDeck = (player: string, number: number) => {
        if (drawCardPile.length < number) {
            alert("Not enough cards in the draw pile!");
            return;
        }
    
        // Draw random cards from the drawCardPile
        const drawnCards = [];
        for (let i = 0; i < number; i++) {
            const randomIndex = Math.floor(Math.random() * drawCardPile.length);
            const [card] = drawCardPile.splice(randomIndex, 1); // Remove the card from draw pile
            drawnCards.push(card);
        }
    
        // Add the drawn cards to the specified player's deck
        if (player === "player1") {
            setPlayer1Deck([...player1Deck, ...drawnCards]);
        } else if (player === "player2") {
            setPlayer2Deck([...player2Deck, ...drawnCards]);
        } else if (player === "player3") {
            setPlayer3Deck([...player3Deck, ...drawnCards]);
        } else if (player === "player4") {
            setPlayer4Deck([...player4Deck, ...drawnCards]);
        }
    
        // Update the drawCardPile state
        setDrawCardPile([...drawCardPile]);
    };


    //function to draw from the draw deck
    const drawRandomCard = (player: string) => {
        if (drawCardPile.length === 0) {
            alert("Draw pile is empty");
            return;
        }
    
        const drawnCardIndex = Math.floor(Math.random() * drawCardPile.length);
        const card = drawCardPile[drawnCardIndex];
    
        if (!card) {
            alert("No card found");
            return;
        }
    
        if (card.color === currentColor || card.character === currentCharacter) {
            // Add card to the played cards pile
            setPlayedCardsPile([...playedCardsPile, card]);
    
            // Remove the drawn card from the draw pile
            const updatedDrawPile = drawCardPile.filter((_, index) => index !== drawnCardIndex);
            setDrawCardPile(updatedDrawPile);
    
            // Optional: Change turn or any other logic
            alert(`${player} played ${card.color} ${card.character}`);

            
        } else {
            alert("Card does not match current color or character.");
        }

        nextTurn(1);
    };


    //function to change the currentColor
    const newColor = (color : string) => {
        setCurrentColor(color)
    }

    const play = (call : string, player : string) => {
        const card = getCardByCall(call);
       checkCardInDeck(player,call)

       if (!card) {
        alert("Card not found.");
        return;
    }

       setCurrentCharacter(card.character)
       setCurrentColor(card.color)

       setPlayedCardsPile([...playedCardsPile,card])
        
    }

    const checkCardInDeck = (player : string, call : string) => {
        const card = getCardByCall(call);

        if (!card) {
            alert("Card not found.");
            return;
        }

        let playerDeck = [];
        let setPlayerDeck = [];

        switch (player) {
            case "player1":
                const isCardInDeck1 = player1Deck.some(c => c.call === call);

        if (isCardInDeck1) {
            alert(`Card ${card.color} ${card.character} is in ${player}'s deck.`);
            // Additional logic to remove the card from the player's deck
            setPlayer1Deck(player1Deck.filter(c => c.call !== call));

            // Add the card to the played pile
            setPlayedCardsPile([...playedCardsPile, card]);
        }
                break;
            case "player2":
                const isCardInDeck2 = player2Deck.some(c => c.call === call);

        if (isCardInDeck2) {
            alert(`Card ${card.color} ${card.character} is in ${player}'s deck.`);
            // Additional logic to remove the card from the player's deck
            setPlayer2Deck(player2Deck.filter(c => c.call !== call));

            // Add the card to the played pile
            setPlayedCardsPile([...playedCardsPile, card]);
        }
                break;
            case "player3":
                const isCardInDeck3 = player3Deck.some(c => c.call === call);

                if (isCardInDeck3) {
                    alert(`Card ${card.color} ${card.character} is in ${player}'s deck.`);
                    // Additional logic to remove the card from the player's deck
                    setPlayer3Deck(player3Deck.filter(c => c.call !== call));
        
                    // Add the card to the played pile
                    setPlayedCardsPile([...playedCardsPile, card]);
                }
                break;
            case "player4":
                const isCardInDeck = player4Deck.some(c => c.call === call);

        if (isCardInDeck) {
            alert(`Card ${card.color} ${card.character} is in ${player}'s deck.`);
            // Additional logic to remove the card from the player's deck
            setPlayer4Deck(player4Deck.filter(c => c.call !== call));

            // Add the card to the played pile
            setPlayedCardsPile([...playedCardsPile, card]);
        }
                break;
            default:
                alert("Invalid player.");
                return;
        }
    
    }

    const renderPlayerHand = (playerDeck: any[], playerName: string) => {
        let deck : AllCard[] = [];
        switch(playerName) {
            case "player1":
                deck = player1Deck;
                break;
            case "player2":
                deck = player2Deck;
                break;
            case "player3":
                deck = player3Deck;
                break;
            case "player4":
                deck = player4Deck;
                break;
            default:
                deck = [];
        }

        return (
            <div className="flex flex-col items-center mb-8">
                <h3 className={`text-lg font-bold mb-2 ${turn === playerName.toLowerCase() ? 'text-blue-600' : ''}`}>
                    {playerName} ({deck.length} cards)
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                    {deck.map((card, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (turn === playerName.toLowerCase()) {
                                    if (card.color === currentColor || 
                                        card.character === currentCharacter || 
                                        card.character === 13 || 
                                        card.character === 14 ||
                                        playedCardsPile.length === 0) {
                                        play(card.call, playerName.toLowerCase());
                                        onPlayHandler(card.call);
                                    } else {
                                        alert("Invalid move! Card must match current color or character.");
                                    }
                                } else {
                                    alert("It's not your turn!");
                                }
                            }}
                            className="transform hover:scale-105 transition-transform"
                            disabled={turn !== playerName.toLowerCase()}
                        >
                            <Card color={card.color} character={card.character} />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const renderColorPicker = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Choose a color</h3>
                <div className="grid grid-cols-2 gap-4">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                newColor(color);
                                setShowColorPicker(false);
                            }}
                            className={`w-24 h-24 rounded-lg ${
                                color === 'red' ? 'bg-red-600' :
                                color === 'blue' ? 'bg-blue-600' :
                                color === 'green' ? 'bg-green-600' :
                                'bg-yellow-500'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Game Status */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">UNO Game</h1>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                        <p className="text-xl font-semibold">Current Turn: {turn}</p>
                        <p className="text-lg">Direction: {channel ? 'Clockwise' : 'Counter-clockwise'}</p>
                        <p className="text-lg">Current Color: 
                            <span className={`ml-2 px-3 py-1 rounded ${
                                currentColor === 'red' ? 'bg-red-600 text-white' :
                                currentColor === 'blue' ? 'bg-blue-600 text-white' :
                                currentColor === 'green' ? 'bg-green-600 text-white' :
                                currentColor === 'yellow' ? 'bg-yellow-500 text-white' :
                                'bg-gray-200'
                            }`}>
                                {currentColor || 'None'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Game Board */}
                <div className="bg-white rounded-lg p-8 shadow-md mb-8">
                    <div className="flex justify-center gap-8">
                        {/* Draw Pile */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-2">Draw Pile ({drawCardPile.length})</h3>
                            <button
                                onClick={() => drawRandomCard(turn)}
                                className="transform hover:scale-105 transition-transform"
                                disabled={drawCardPile.length === 0}
                            >
                                <div className="w-32 h-48 bg-red-600 rounded-xl shadow-lg flex items-center justify-center">
                                    <span className="text-white text-4xl font-bold">UNO</span>
                                </div>
                            </button>
                        </div>

                        {/* Played Cards Pile */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-2">Played Cards</h3>
                            {playedCardsPile.length > 0 && (
                                <Card
                                    color={playedCardsPile[playedCardsPile.length - 1].color}
                                    character={playedCardsPile[playedCardsPile.length - 1].character}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Players' Hands */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderPlayerHand(player1Deck, "Player1")}
                    {renderPlayerHand(player2Deck, "Player2")}
                    {renderPlayerHand(player3Deck, "Player3")}
                    {renderPlayerHand(player4Deck, "Player4")}
                </div>

                {/* Color Picker Modal */}
                {showColorPicker && renderColorPicker()}

                {/* Game Over State */}
                {gameOver && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg text-center">
                            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                            <p className="text-xl mb-4">Winner: {winner}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );



} 
