import React from "react";
import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Pair } from "../types";

interface PairResultProps {
  pairs: Pair[];
}

export const PairResult: React.FC<PairResultProps> = ({ pairs }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-xl mx-auto mb-10">
      {/* Result Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 mb-10 py-3 px-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-neon-blue max-w-sm mx-auto select-none"
      >
        <Gift className="text-indigo-400 animate-bounce" size={24} />
        <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight uppercase text-glow-blue">
          {t("christmas.resultTitle")}
        </h2>
        <Gift
          className="text-indigo-400 animate-bounce"
          size={24}
          style={{ animationDelay: "0.2s" }}
        />
      </motion.div>

      {/* Matched Pairs List */}
      <div className="space-y-4">
        {pairs.map((pair, idx) => (
          <motion.div
            key={`pair-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12, type: "spring", stiffness: 90 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center justify-center gap-4 w-full">
              {pair.names.map((name, i) => (
                <React.Fragment key={`${name}-${i}`}>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl min-w-[100px] justify-center shadow-inner hover:bg-white/10 transition-colors duration-200">
                    <span className="text-lg">
                      {i % 2 === 0 ? "🎅" : "🎀"}
                    </span>
                    <span className="font-extrabold text-sm tracking-wider text-slate-100 uppercase">{name}</span>
                  </div>

                  {i < pair.names.length - 1 && (
                    <span className="text-xl animate-pulse">
                      💝
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default PairResult;
