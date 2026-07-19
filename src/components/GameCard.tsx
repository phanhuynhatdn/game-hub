import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GameMetadata } from "../core/config/gameRegistry";
import { AppRoute } from "../types/common.types";

interface GameCardProps {
  game: GameMetadata;
  onSelect: (gameId: AppRoute) => void;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, index }) => {
  const { t } = useTranslation();

  // Animation variants for smooth stagger load
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.button
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(game.id)}
      className="group relative flex flex-col w-full h-[280px] text-left p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-glass overflow-hidden cursor-pointer"
    >
      {/* Aurora Glow backdrop effect that tracks cursor hover */}
      <div className={`absolute -right-20 -bottom-20 w-52 h-52 rounded-full bg-gradient-to-br ${game.thumbnailColor} opacity-20 blur-3xl group-hover:scale-150 group-hover:opacity-40 transition-all duration-500 pointer-events-none`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-100 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header section with floating icon */}
        <div className="flex justify-between items-start">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300">
            <span className="text-3xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
              {game.icon}
            </span>
          </div>
          
          <div className="px-3 py-1 text-xs font-semibold text-slate-400 bg-white/5 rounded-full border border-white/5 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
            {t("common.play") || "PLAY"}
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
            {t(game.titleKey)}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
            {t(game.descriptionKey)}
          </p>
        </div>
      </div>

      {/* Decorative border bottom glow */}
      <div className="absolute bottom-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.button>
  );
};
export default GameCard;
