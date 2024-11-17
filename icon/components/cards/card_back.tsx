import React from 'react';

const CardBack = () => {
 
  return (
    <div className={`relative w-32 h-48 rounded-xl bg-purple-500 shadow-lg`}>
      {/* Card Border */}
      <div className="absolute inset-2 bg-white rounded-lg">
        {/* Inner Colored Area */}
        <div className={`absolute inset-3 bg-purple-500 rounded-md overflow-hidden`}>
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
              <div className="relative w-16 h-16">
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