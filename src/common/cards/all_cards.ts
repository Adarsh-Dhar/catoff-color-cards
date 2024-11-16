// cardData.ts

export interface AllCard {
    color: 'red' | 'blue' | 'green' | 'yellow' | 'multicolor';
    character: number;
    serialNumber: number;
  }
  
  export const ALL_CARDS: AllCard[] = [
    // Red Cards (12)
    { color: 'red', character: 1, serialNumber: 1 },
    { color: 'red', character: 2, serialNumber: 2 },
    { color: 'red', character: 3, serialNumber: 3 },
    { color: 'red', character: 4, serialNumber: 4 },
    { color: 'red', character: 5, serialNumber: 5 },
    { color: 'red', character: 6, serialNumber: 6 },
    { color: 'red', character: 7, serialNumber: 7 },
    { color: 'red', character: 8, serialNumber: 8 },
    { color: 'red', character: 9, serialNumber: 9 },
    { color: 'red', character: 10, serialNumber: 10 },
    { color: 'red', character: 11, serialNumber: 11 },
    { color: 'red', character: 12, serialNumber: 12 },
  
    // Blue Cards (12)
    { color: 'blue', character: 1, serialNumber: 13 },
    { color: 'blue', character: 2, serialNumber: 14 },
    { color: 'blue', character: 3, serialNumber: 15 },
    { color: 'blue', character: 4, serialNumber: 16 },
    { color: 'blue', character: 5, serialNumber: 17 },
    { color: 'blue', character: 6, serialNumber: 18 },
    { color: 'blue', character: 7, serialNumber: 19 },
    { color: 'blue', character: 8, serialNumber: 20 },
    { color: 'blue', character: 9, serialNumber: 21 },
    { color: 'blue', character: 10, serialNumber: 22 },
    { color: 'blue', character: 11, serialNumber: 23 },
    { color: 'blue', character: 12, serialNumber: 24 },
  
    // Green Cards (12)
    { color: 'green', character: 1, serialNumber: 25 },
    { color: 'green', character: 2, serialNumber: 26 },
    { color: 'green', character: 3, serialNumber: 27 },
    { color: 'green', character: 4, serialNumber: 28 },
    { color: 'green', character: 5, serialNumber: 29 },
    { color: 'green', character: 6, serialNumber: 30 },
    { color: 'green', character: 7, serialNumber: 31 },
    { color: 'green', character: 8, serialNumber: 32 },
    { color: 'green', character: 9, serialNumber: 33 },
    { color: 'green', character: 10, serialNumber: 34 },
    { color: 'green', character: 11, serialNumber: 35 },
    { color: 'green', character: 12, serialNumber: 36 },
  
    // Yellow Cards (12)
    { color: 'yellow', character: 1, serialNumber: 37 },
    { color: 'yellow', character: 2, serialNumber: 38 },
    { color: 'yellow', character: 3, serialNumber: 39 },
    { color: 'yellow', character: 4, serialNumber: 40 },
    { color: 'yellow', character: 5, serialNumber: 41 },
    { color: 'yellow', character: 6, serialNumber: 42 },
    { color: 'yellow', character: 7, serialNumber: 43 },
    { color: 'yellow', character: 8, serialNumber: 44 },
    { color: 'yellow', character: 9, serialNumber: 45 },
    { color: 'yellow', character: 10, serialNumber: 46 },
    { color: 'yellow', character: 11, serialNumber: 47 },
    { color: 'yellow', character: 12, serialNumber: 48 },
  
    // Multicolor Cards (8)
    { color: 'multicolor', character: 13, serialNumber: 49 }, // Wild
    { color: 'multicolor', character: 13, serialNumber: 50 }, // Wild

    { color: 'multicolor', character: 13, serialNumber: 51 }, // Wild

    { color: 'multicolor', character: 13, serialNumber: 52 }, // Wild

    { color: 'multicolor', character: 14, serialNumber: 53 } , // +4
    { color: 'multicolor', character: 14, serialNumber: 54 },  // +4

    { color: 'multicolor', character: 14, serialNumber: 55 } , // +4

    { color: 'multicolor', character: 14, serialNumber: 56 }  // +4


  ];  
