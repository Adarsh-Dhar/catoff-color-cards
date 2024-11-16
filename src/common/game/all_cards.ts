// cardData.ts

export interface UnoCard {
    color: 'red' | 'blue' | 'green' | 'yellow' | 'multicolor';
    character: number;
  }
  
  export const UNO_CARDS: UnoCard[] = [
    // Red Cards (12)
    { color: 'red', character: 1 },
    { color: 'red', character: 2 },
    { color: 'red', character: 3 },
    { color: 'red', character: 4 },
    { color: 'red', character: 5 },
    { color: 'red', character: 6 },
    { color: 'red', character: 7 },
    { color: 'red', character: 8 },
    { color: 'red', character: 9 },
    { color: 'red', character: 10 },
    { color: 'red', character: 11 },
    { color: 'red', character: 12 },
  
    // Blue Cards (12)
    { color: 'blue', character: 1 },
    { color: 'blue', character: 2 },
    { color: 'blue', character: 3 },
    { color: 'blue', character: 4 },
    { color: 'blue', character: 5 },
    { color: 'blue', character: 6 },
    { color: 'blue', character: 7 },
    { color: 'blue', character: 8 },
    { color: 'blue', character: 9 },
    { color: 'blue', character: 10 },
    { color: 'blue', character: 11 },
    { color: 'blue', character: 12 },
  
    // Green Cards (12)
    { color: 'green', character: 1 },
    { color: 'green', character: 2 },
    { color: 'green', character: 3 },
    { color: 'green', character: 4 },
    { color: 'green', character: 5 },
    { color: 'green', character: 6 },
    { color: 'green', character: 7 },
    { color: 'green', character: 8 },
    { color: 'green', character: 9 },
    { color: 'green', character: 10 },
    { color: 'green', character: 11 },
    { color: 'green', character: 12 },
  
    // Yellow Cards (12)
    { color: 'yellow', character: 1 },
    { color: 'yellow', character: 2 },
    { color: 'yellow', character: 3 },
    { color: 'yellow', character: 4 },
    { color: 'yellow', character: 5 },
    { color: 'yellow', character: 6 },
    { color: 'yellow', character: 7 },
    { color: 'yellow', character: 8 },
    { color: 'yellow', character: 9 },
    { color: 'yellow', character: 10 },
    { color: 'yellow', character: 11 },
    { color: 'yellow', character: 12 },
  
    // Multicolor Cards (2)
    { color: 'multicolor', character: 13 }, // Wild
    { color: 'multicolor', character: 14 }  // +4
  ];
  
  export default UNO_CARDS;