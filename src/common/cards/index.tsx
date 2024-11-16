import React from 'react';
import { VscArrowSwap } from "react-icons/vsc";
import { MdNotInterested } from "react-icons/md";

interface UnoCardProps {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'multicolor';
  character?: string | number;
}

const Card: React.FC<UnoCardProps> = ({
  color = 'red',
  character = '0'
}) => {
  // Force multicolor for characters 13 and 14
  const effectiveColor = (character === 13 || character === 14) ? 'multicolor' : color;

  const colorClasses = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    multicolor: ''
  };

  const characterClasses: any = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    0: '0',
    10: <VscArrowSwap />,
    11: <MdNotInterested />,
    12: '+1',
    13: '',
    14: '+4'
  };

  const multicolorStyle = {
    background: `linear-gradient(
      45deg,
      rgb(220, 38, 38) 0%,
      rgb(220, 38, 38) 25%,
      rgb(37, 99, 235) 25%,
      rgb(37, 99, 235) 50%,
      rgb(22, 163, 74) 50%,
      rgb(22, 163, 74) 75%,
      rgb(234, 179, 8) 75%,
      rgb(234, 179, 8) 100%
    )`
  };

  const isMulticolor = effectiveColor === 'multicolor';
  const backgroundStyle = isMulticolor ? multicolorStyle : {};

  // Validation for character restrictions
  const isValidCombination = () => {
    if (isMulticolor) {
      return character === 13 || character === 14;
    } else {
      return character !== 13 && character !== 14;
    }
  };

  if (!isValidCombination()) {
    return null;
  }

  return (
    <div
      className={`relative w-32 h-48 rounded-xl ${colorClasses[effectiveColor]} shadow-lg`}
      style={backgroundStyle}
    >
      {/* Card Border */}
      <div className="absolute inset-2 bg-white rounded-lg">
        {/* Inner Colored Area */}
        <div
          className={`absolute inset-3 ${colorClasses[effectiveColor]} rounded-md`}
          style={backgroundStyle}
        >
          {/* Top Left Number */}
          <span className="absolute top-2 left-2 text-white font-bold text-xl">
            {characterClasses[character]}
          </span>
          
          {/* Bottom Right Number (inverted) */}
          <span className="absolute bottom-2 right-2 text-white font-bold text-xl rotate-180">
            {characterClasses[character]}
          </span>
          
          {/* Center Oval with Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-24 h-24 ${colorClasses[effectiveColor]} transform rotate-45 border-4 border-white`}
              style={backgroundStyle}
            >
              <div className="w-full h-full -rotate-45 flex items-center justify-center">
                <span className="text-white font-bold text-4xl">
                  {characterClasses[character]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;