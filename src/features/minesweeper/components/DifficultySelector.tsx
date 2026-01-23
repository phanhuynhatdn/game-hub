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
  // HOOK phải nằm ở đây (bên trong component)
  const { t } = useTranslation();

  // Dùng useMemo để tối ưu performance, tránh khởi tạo lại mảng khi re-render không cần thiết
  // nhưng vẫn đảm bảo cập nhật khi ngôn ngữ (t) thay đổi
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
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 justify-center flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value as Difficulty)}
          className={`px-2 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold transition-all duration-300 ${
            difficulty === opt.value
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
