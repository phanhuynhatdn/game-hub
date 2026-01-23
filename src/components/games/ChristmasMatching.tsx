import React from "react";
import { Home, Users, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChristmasMatching } from "../../hooks/useChristmasMatching";
import { parseNames } from "../../utils/christmasUtils";
import { PairResult } from "../shared/PairResult";
import { NameList } from "../shared/NameList";

export const ChristmasMatching: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
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
      {/* Hiệu ứng Tuyết rơi */}
      {snowflakes.map((id) => (
        <div
          key={id}
          className="absolute text-white animate-fall pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          ❄
        </div>
      ))}

      {/* Hiệu ứng Pháo hoa khi thắng */}
      {showFireworks && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Sparkles className="text-yellow-300 animate-firework" size={100} />
        </div>
      )}

      <div className="relative z-10 container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            title={t("common.back")}
            className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all"
          >
            <Home />
          </button>
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center animate-pulse-slow">
            🎄 {t("christmas.title")}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Input Section */}
        {showInput && (
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border-4 border-white/30 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 justify-center text-white">
              <Users />
              <h2 className="text-2xl font-bold">
                {t("christmas.inputLabel")}
              </h2>
            </div>

            <textarea
              value={inputNames}
              onChange={(e) => setInputNames(e.target.value)}
              placeholder={t("christmas.inputPlaceholder")}
              className="w-full p-4 rounded-xl border-4 border-yellow-300 text-lg outline-none focus:ring-4 focus:ring-yellow-300/50 transition-all"
              rows={4}
            />

            <p className="text-white/80 text-center mt-3 text-sm">
              {t("christmas.inputHint")}
            </p>

            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-4 rounded-full text-2xl font-bold border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isMatching
                ? t("christmas.btnMatching")
                : t("christmas.btnMatch")}
            </button>
          </div>
        )}

        {/* Results Section */}
        {!showInput && pairs.length > 0 && (
          <div className="animate-fade-in">
            <PairResult pairs={pairs} />
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-full font-bold border-2 border-white/50 backdrop-blur-sm transition-all hover:scale-110"
              >
                {t("christmas.btnReset")}
              </button>
            </div>
          </div>
        )}

        {/* Live Preview List */}
        {showInput && <NameList names={parseNames(inputNames)} />}
      </div>
    </div>
  );
};
