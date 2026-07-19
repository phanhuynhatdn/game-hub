import React from 'react';
import { motion } from 'framer-motion';

interface NameListProps {
  names: string[];
}

export const NameList: React.FC<NameListProps> = ({ names }) => {
  const midPoint = Math.ceil(names.length / 2);
  const leftNames = names.slice(0, midPoint);
  const rightNames = names.slice(midPoint);

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-12 mb-8 lg:mb-12 px-2 max-w-4xl mx-auto">
      {/* Left Column */}
      <div className="flex-1 w-full max-w-xs mx-auto">
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500/80 to-rose-500/20 rounded-full" />
          <div className="space-y-3 pl-4">
            {leftNames.map((name, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                className="bg-slate-900/60 border border-red-500/20 hover:border-red-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-between text-base"
              >
                <span className="font-semibold">{name}</span>
                <span className="text-xl">🎅</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Dynamic Graphic */}
      <div className="flex flex-col items-center justify-center py-6 md:py-0 select-none">
        <div className="text-6xl md:text-7xl animate-float mb-3">🎄</div>
        <div className="flex gap-3 text-xl bg-white/5 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-inner">
          <span className="animate-pulse">🔔</span>
          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>🎁</span>
          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>⭐</span>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 w-full max-w-xs mx-auto">
        <div className="relative">
          <div className="absolute -right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/80 to-teal-500/20 rounded-full" />
          <div className="space-y-3 pr-4">
            {rightNames.map((name, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                className="bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-between text-base"
              >
                <span className="text-xl">🎀</span>
                <span className="font-semibold">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NameList;