import React from "react";
import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next"; // Thêm i18n
import { Pair } from "../types";

interface PairResultProps {
  pairs: Pair[];
}

export const PairResult: React.FC<PairResultProps> = ({ pairs }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto mb-6 sm:mb-12 animate-fade-in">
      {/* Tiêu đề kết quả đã i18n */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3">
        <Gift className="animate-bounce text-yellow-300" />
        {t("christmas.resultTitle")}
        <Gift
          className="animate-bounce text-yellow-300"
          style={{ animationDelay: "0.2s" }}
        />
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {pairs.map((pair, idx) => (
          <div
            key={`pair-${idx}`}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-3 sm:px-8 sm:py-5 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-yellow-300/50"
            style={{ animationDelay: `${idx * 0.15}s` }}
          >
            {/* Sử dụng Flex-wrap để hỗ trợ tốt cả nhóm 2 và nhóm 3 người */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-base sm:text-xl font-bold">
              {pair.names.map((name, i) => (
                <React.Fragment key={`${name}-${i}`}>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-xl sm:text-2xl">
                      {i % 2 === 0 ? "🎅" : "🎀"}
                    </span>
                    <span className="tracking-wide">{name}</span>
                  </div>

                  {/* Hiển thị trái tim giữa các thành viên */}
                  {i < pair.names.length - 1 && (
                    <span className="text-2xl sm:text-3xl animate-pulse text-red-300 drop-shadow-md">
                      💝
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
