import React from 'react';
import { VscArrowSwap } from "react-icons/vsc";
import { MdNotInterested } from "react-icons/md";

interface UnoCardProps {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'multicolor';
  character?: string | number;
}

const CardBack: React.FC<UnoCardProps> = ({
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
      className={`relative w-16 h-24 rounded-xl ${colorClasses[effectiveColor]} shadow-lg`}
      style={backgroundStyle}
    >
      {/* Card Border */}
      <div className="absolute inset-2 bg-white rounded-lg">
        {/* Inner Colored Area */}
        <div
          className={`absolute inset-3 ${colorClasses[effectiveColor]} rounded-md`}
          style={backgroundStyle}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0">
            {/* Diagonal lines */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/10 h-px w-full"
                style={{
                  transform: `rotate(45deg) translateY(${i * 12}px)`,
                  left: '-50%',
                  right: '-50%'
                }}
              />
            ))}
            
            {/* Central Logo/Pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-8 h-8">
                {/* Diamond shape */}
                <div className={`absolute inset-0 bg-purple-500 border-4 border-white transform rotate-45`} />
                
                {/* Inner diamond */}
                <div className="absolute inset-2 border-2 border-white/50 transform rotate-45" />
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Corner Patterns */}
            {[0, 90, 180, 270].map((rotation) => (
              <div
                key={rotation}
                className="absolute w-8 h-8"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  [rotation <= 90 ? 'top' : 'bottom']: '4px',
                  [rotation <= 180 ? 'left' : 'right']: '4px'
                }}
              >
                <div className="w-4 h-4 border-2 border-white/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBack;