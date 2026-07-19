import React from "react";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useChristmasMatching } from "./hooks/useChristmasMatching";
import { PairResult } from "./components/PairResult";
import { parseNames } from "./utils";
import { NameList } from "./components/NameList";
import { InputForm } from "./components/InputForm";
import { SnowflakeEffect } from "./components/SnowflakeEffect";

interface ChristmasMatchProps {
  onBack: () => void;
}

const ChristmasMatch: React.FC<ChristmasMatchProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const {
    inputNames,
    setInputNames,
    pairs,
    isMatching,
    snowflakes,
    showInput,
    handleMatch,
    handleReset,
  } = useChristmasMatching("An;Bình;Chi;Dũng;Hoa;Khoa");

  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden p-4 md:p-8">
      {/* Aurora Ambient Background Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[150px] pointer-events-none z-0"></div>
      
      <SnowflakeEffect snowflakes={snowflakes} />

      <div className="relative z-10 container mx-auto max-w-5xl">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm self-start md:self-auto"
          >
            <Home size={22} />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 px-6 py-2.5 rounded-2xl shadow-neon-pink"
          >
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase text-glow-pink">
              {t("christmas.title")}
            </h1>
          </motion.div>
          
          <div className="w-12 hidden md:block"></div>
        </div>

        {/* Input Phase */}
        {showInput && (
          <InputForm
            inputNames={inputNames}
            setInputNames={setInputNames}
            isMatching={isMatching}
            onMatch={handleMatch}
          />
        )}

        {/* Results Phase */}
        {!showInput && pairs.length > 0 && <PairResult pairs={pairs} />}

        {/* Action button when results exist */}
        {!showInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-10 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer uppercase"
            >
              {t("christmas.btnReset")}
            </motion.button>
          </motion.div>
        )}

        {/* Name preview list */}
        {showInput && <NameList names={parseNames(inputNames)} />}
      </div>
    </div>
  );
};

export default ChristmasMatch;
