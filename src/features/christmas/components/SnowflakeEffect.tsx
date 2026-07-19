import React from "react";

interface SnowflakeEffectProps {
  snowflakes: number[];
}

export const SnowflakeEffect: React.FC<SnowflakeEffectProps> = ({ snowflakes }) => {
  return (
    <>
      {snowflakes.map((id) => (
        <div
          key={id}
          className="absolute text-white animate-fall pointer-events-none opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `-${Math.random() * 2}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};
