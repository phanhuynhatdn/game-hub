import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Difficulty } from "../types";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (diff: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onChange,
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { value: "easy", label: t("minesweeper.easy") },
      { value: "medium", label: t("minesweeper.medium") },
      { value: "hard", label: t("minesweeper.hard") },
      { value: "expert", label: t("minesweeper.expert") },
    ],
    [t],
  );

  return (
    <div className="flex gap-2 mb-6 justify-center flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value as Difficulty)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border backdrop-blur-md cursor-pointer ${
            difficulty === opt.value
              ? "bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-neon-blue scale-105"
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
export default DifficultySelector;
