import React from 'react';

export const SpecialFlag: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-flag-deploy">
      <svg 
        viewBox="0 0 24 24" 
        className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)] animate-flag-steady"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cán cờ kim loại */}
        <rect x="5" y="2" width="1.5" height="20" rx="0.75" fill="url(#pole-grad)" />
        
        {/* Lá cờ Gradient đỏ - Cấu trúc 3D nhẹ */}
        <path 
          d="M6.5 4L20 10L6.5 16V4Z" 
          fill="url(#flag-grad)" 
          filter="url(#inner-shadow)"
        />
        
        {/* Viền lá cờ */}
        <path d="M6.5 4L20 10L6.5 16V4Z" stroke="#991b1b" strokeWidth="0.5" strokeLinejoin="round" />

        <defs>
          <linearGradient id="pole-grad" x1="5" y1="2" x2="6.5" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64748b" />
            <stop offset="0.5" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#334155" />
          </linearGradient>
          
          <linearGradient id="flag-grad" x1="6.5" y1="4" x2="20" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>

          <filter id="inner-shadow">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="0.5" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.3" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      
      {/* Hiệu ứng bóng đổ dưới sàn */}
      <div className="absolute bottom-1 w-2 h-1 bg-black/40 rounded-full blur-[1px]" />
    </div>
  );
};