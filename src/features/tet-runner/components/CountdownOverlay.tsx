import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  countdown: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 pointer-events-none select-none backdrop-blur-xs">
      <AnimatePresence mode="wait">
        <motion.span
          key={countdown}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-[120px] md:text-[180px] font-black text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-300 text-glow-blue"
        >
          {countdown}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
export default CountdownOverlay;
