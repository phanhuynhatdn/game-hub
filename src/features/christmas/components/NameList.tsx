import React from 'react';

interface NameListProps {
  names: string[];
}

export const NameList: React.FC<NameListProps> = ({ names }) => {
  const midPoint = Math.ceil(names.length / 2);
  const leftNames = names.slice(0, midPoint);
  const rightNames = names.slice(midPoint);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 mb-8 lg:mb-12 px-2">
      {/* Left Column */}
      <div className="flex-1 w-full max-w-xs">
        <div className="relative">
          <div className="absolute -left-2 lg:-left-4 top-0 bottom-0 w-1 lg:w-2 bg-gradient-to-b from-red-500 via-red-400 to-red-500 rounded-full animate-pulse" />
          <div className="space-y-2 lg:space-y-4">
            {leftNames.map((name, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-slide-in-left border-2 border-red-400"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between text-sm lg:text-lg">
                  <span className="font-semibold">{name}</span>
                  <span className="text-xl lg:text-2xl">🎅</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Tree */}
      <div className="flex flex-col items-center justify-center px-4 lg:px-8">
        <div className="text-5xl lg:text-9xl animate-swing mb-2 lg:mb-4">🎄</div>
        <div className="flex gap-2 lg:gap-4 animate-bounce-slow">
          <span className="text-2xl lg:text-4xl">🔔</span>
          <span className="text-2xl lg:text-4xl">🎁</span>
          <span className="text-2xl lg:text-4xl">⭐</span>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 w-full max-w-xs">
        <div className="relative">
          <div className="absolute -right-2 lg:-right-4 top-0 bottom-0 w-1 lg:w-2 bg-gradient-to-b from-green-500 via-green-400 to-green-500 rounded-full animate-pulse" />
          <div className="space-y-2 lg:space-y-4">
            {rightNames.map((name, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-l from-green-600 to-green-700 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-slide-in-right border-2 border-green-400"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between text-sm lg:text-lg">
                  <span className="text-xl lg:text-2xl">🎀</span>
                  <span className="font-semibold">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};