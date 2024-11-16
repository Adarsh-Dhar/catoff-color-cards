import { generateRandomCardsAndDistribute } from "./split";

export const Try = () => {
    const { players, deck } = generateRandomCardsAndDistribute();

    return (
        <div>
            <h1>Deck of Cards</h1>
            <ul>
                {deck.map((card, index) => (
                    <li key={index}>
                        {`Color: ${card.color}, Character: ${card.character}, Serial Number: ${card.serialNumber}`}
                    </li>
                ))}
            </ul>
            <h2>Players' Cards</h2>
            {Object.entries(players).map(([player, cards]) => (
                <div key={player}>
                    <h3>{player}</h3>
                    <ul>
                        {cards.map((card, index) => (
                            <li key={index}>
                                {`Color: ${card.color}, Character: ${card.character}, Serial Number: ${card.serialNumber}`}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
