import React from 'react';

export const AnimatedClouds: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-60">
      {/* Cloud 1 */}
      <svg 
        className="absolute top-[10%] animate-slide-in-right" 
        style={{ animationDuration: '90s', animationIterationCount: 'infinite', width: '300px', height: '150px' }}
        viewBox="0 0 100 50"
      >
        <path d="M 20 40 Q 10 40 10 30 Q 10 20 20 20 Q 25 10 40 10 Q 55 10 60 20 Q 75 15 85 25 Q 95 35 85 45 Q 75 45 60 40 Z" fill="#ffffff" filter="blur(2px)" />
      </svg>
      
      {/* Cloud 2 */}
      <svg 
        className="absolute top-[25%] animate-slide-in-right" 
        style={{ animationDuration: '120s', animationIterationCount: 'infinite', animationDelay: '30s', width: '400px', height: '200px' }}
        viewBox="0 0 100 50"
      >
        <path d="M 30 35 Q 15 35 15 25 Q 15 15 30 15 Q 40 5 60 10 Q 75 5 85 15 Q 95 25 85 35 Z" fill="#ffffff" opacity="0.8" filter="blur(3px)" />
      </svg>

      {/* Cloud 3 */}
      <svg 
        className="absolute top-[5%] animate-slide-in-right" 
        style={{ animationDuration: '150s', animationIterationCount: 'infinite', animationDelay: '60s', width: '250px', height: '100px' }}
        viewBox="0 0 100 50"
      >
        <path d="M 20 40 Q 10 40 10 30 Q 10 20 20 20 Q 25 10 40 10 Q 55 10 60 20 Q 75 15 85 25 Q 95 35 85 45 Q 75 45 60 40 Z" fill="#ffffff" opacity="0.9" filter="blur(1px)" />
      </svg>
    </div>
  );
};
