import React from 'react';

export const AnimatedWaves: React.FC = () => {
  return (
    <div className="absolute bottom-0 w-full h-[15%] overflow-hidden z-10 pointer-events-none opacity-60 mix-blend-overlay">
      
      {/* Wave 1 (Back, slower) */}
      <svg 
        className="absolute bottom-[-10px] w-[200%] h-full animate-wave-slow"
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.3"
        />
        <path 
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.3"
          transform="translate(1200, 0)"
        />
      </svg>

      {/* Wave 2 (Middle) */}
      <svg 
        className="absolute bottom-[-5px] w-[200%] h-full animate-wave-medium"
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.5"
        />
         <path 
          d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.5"
          transform="translate(1200, 0)"
        />
      </svg>

      {/* Wave 3 (Front, faster, lighter) */}
      <svg 
        className="absolute bottom-0 w-[200%] h-full animate-wave-fast"
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,80 C250,120 350,20 600,80 C850,140 950,40 1200,80 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.7"
        />
        <path 
          d="M0,80 C250,120 350,20 600,80 C850,140 950,40 1200,80 L1200,120 L0,120 Z" 
          fill="#ffffff" 
          opacity="0.7"
          transform="translate(1200, 0)"
        />
      </svg>
      
    </div>
  );
};
