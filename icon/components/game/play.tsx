import { PLAYERS } from "./split";
import CardFront from "../cards/card_front";
import CardBack from "../cards/card_back";

export const Play = (player : string) => {
  
  
  return (
    <div className="relative h-screen w-screen flex items-center bg-green-400 justify-center">
      {/* Center container */}
      <div className="relative w-full h-full p-24">
        {/* Player 3 (Top) */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-4">
          {Array(6).fill(null).map((_, index) => (
            <div key={index} className="transform -rotate-180 -mx-2">
              {player === 'player3' ? <CardFront /> : <CardBack />}
            </div>
          ))}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-black">player3</span>
        </div>

        {/* Player 2 (Left) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-96 flex flex-col gap-4">
          {Array(6).fill(null).map((_, index) => (
            <div key={index} className="transform -rotate-90 -mt-14">
              {player === 'player2' ? <CardFront /> : <CardBack />}
            </div>
          ))}
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-black">player2</span>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-96 flex flex-col gap-4">
        {   Array(6).fill(null).map((_, index) => (
            <div key={index} className="transform rotate-90 -mt-14">
            {player === 'player4' ? <CardFront /> : <CardBack />}
            </div>
        ))}
        <span className="absolute text-black -right-6 top-1/2 -translate-y-1/2">player4</span>
        </div>

        {/* Player 1 (Bottom) */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4">
          {Array(6).fill(null).map((_, index) => (
            <div key={index} className="-mx-2">
              {player === 'player1' ? <CardFront /> : <CardBack />}
            </div>
          ))}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-black">player1</span>
        </div>
      </div>
    </div>
  );
};

export default Play;