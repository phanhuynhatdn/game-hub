import React from "react";
import { Gamepad2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GAME_REGISTRY } from "../core/config/gameRegistry";
import { GameCard } from "./GameCard";
import { AppRoute } from "../types/common.types";
import { InteractiveBackdrop } from "./InteractiveBackdrop";

interface HomePageProps {
  onSelectGame: (gameId: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* 1. Starry cursor-following background */}
      <InteractiveBackdrop />

      {/* 2. Floating Ambient Glow Spheres (Aurora) */}
      <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-indigo-700/15 blur-[100px] animate-aurora-1 pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-rose-600/10 blur-[120px] animate-aurora-2 pointer-events-none z-0"></div>


      <div className="relative z-10 text-center max-w-6xl w-full py-12 md:py-20">
        
        {/* Title Block */}
        <motion.div 
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="mb-16 flex flex-col items-center select-none"
        >
          {/* Logo Frame */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110"></div>
            <div className="relative bg-slate-900/60 border border-white/10 p-5 rounded-full shadow-glass-glow animate-float">
              <Gamepad2 className="w-14 h-14 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-100 text-glow">
            {t("home.title")}
          </h1>
          
          {/* Subtitle Badge */}
          <div className="inline-block px-5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md">
            <p className="text-sm md:text-base font-semibold text-indigo-300 tracking-wider uppercase">
              {t("home.subtitle")}
            </p>
          </div>
        </motion.div>

        {/* Staggered Game Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {GAME_REGISTRY.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onSelect={onSelectGame} 
              index={index} 
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 text-slate-500 text-xs font-semibold tracking-[0.2em] uppercase max-w-md mx-auto"
        >
          {t("home.footer")}
        </motion.div>
      </div>
    </div>
  );
};
export default HomePage;