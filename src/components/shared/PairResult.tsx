import React from "react";
import { Gift } from "lucide-react";
import { Pair } from "../../types/christmas.types";

interface PairResultProps {
  pairs: Pair[];
}

export const PairResult: React.FC<PairResultProps> = ({ pairs }) => (
  <div className="max-w-3xl mx-auto mb-6 sm:mb-12">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3">
      <Gift className="animate-bounce" />
      Kết Quả Ghép Đôi
      <Gift className="animate-bounce" style={{ animationDelay: "0.2s" }} />
    </h2>
    <div className="space-y-3 sm:space-y-4">
      {pairs.map((pair, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-3 sm:px-8 sm:py-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in border-4 border-yellow-300"
          style={{ animationDelay: `${idx * 0.15}s` }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-base sm:text-xl font-bold">
            {pair.names.map((name, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-1 sm:gap-2">
                  {i % 2 === 0 && "🎅"} {name} {i % 2 === 1 && "🎀"}
                </span>
                {i < pair.names.length - 1 && (
                  <span className="text-2xl sm:text-3xl animate-pulse">💝</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
