import React from "react";
import { Home, Users, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChristmasMatching } from "./hooks/useChristmasMatching";
import { PairResult } from "./components/PairResult";
import { parseNames } from "./utils";
import { NameList } from "./components/NameList";

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
    showFireworks,
    snowflakes,
    showInput,
    handleMatch,
    handleReset,
  } = useChristmasMatching("An;Bình;Chi;Dũng;Hoa;Khoa");

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 relative overflow-hidden p-4">
      {/* Snowflakes Effect */}
      {snowflakes.map((id) => (
        <div
          key={id}
          className="absolute text-white animate-fall pointer-events-none opacity-50"
        >
          ❄
        </div>
      ))}

      <div className="relative z-10 container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all"
          >
            <Home />
          </button>
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
            {t("christmas.title")}
          </h1>
          <div className="w-10"></div>
        </div>

        {showInput && (
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border-4 border-white/30 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 justify-center text-white">
              <Users size={32} />
              <h2 className="text-2xl font-bold">
                {t("christmas.inputLabel")}
              </h2>
            </div>
            <textarea
              value={inputNames}
              onChange={(e) => setInputNames(e.target.value)}
              className="w-full p-4 rounded-xl border-4 border-yellow-300 text-lg outline-none focus:ring-4 focus:ring-yellow-300/50"
              rows={4}
            />
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-4 rounded-full text-2xl font-bold border-4 border-white shadow-xl transition-all active:scale-95"
            >
              {isMatching
                ? t("christmas.btnMatching")
                : t("christmas.btnMatch")}
            </button>
          </div>
        )}

        {!showInput && pairs.length > 0 && <PairResult pairs={pairs} />}

        {!showInput && (
          <div className="text-center mt-8">
            <button
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-full font-bold border-2 border-white/50 transition-all"
            >
              {t("christmas.btnReset")}
            </button>
          </div>
        )}

        {showInput && <NameList names={parseNames(inputNames)} />}
      </div>

      {showFireworks && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <Sparkles className="text-yellow-300 animate-firework" size={200} />
        </div>
      )}
    </div>
  );
};

export default ChristmasMatch;
