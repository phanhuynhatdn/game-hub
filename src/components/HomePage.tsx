import React from "react";
import { Gamepad2, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GAME_REGISTRY } from "../core/config/gameRegistry";

interface HomePageProps {
  onSelectGame: (gameId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const { t, i18n } = useTranslation();

  // Logic: Xác định ngôn ngữ hiện tại và ngôn ngữ đích
  const currentLang = i18n.resolvedLanguage || "vi";
  const targetLang = currentLang.startsWith("vi") ? "en" : "vi";

  // Label hiển thị trên nút (Hiển thị ngôn ngữ ĐÍCH để người dùng biết bấm vào sẽ ra cái gì)
  const switchLabel = targetLang === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt";

  const toggleLanguage = () => {
    i18n.changeLanguage(targetLang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Nút chuyển ngôn ngữ: Hiển thị ngôn ngữ ĐÍCH */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-2xl text-white font-bold transition-all shadow-xl active:scale-95 group"
        title={t("common.switchLabel")} // Tooltip hỗ trợ accessibility
      >
        <Languages className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
        <span>{switchLabel}</span>
      </button>

      <div className="relative z-10 text-center max-w-6xl w-full">
        <div className="mb-12 animate-bounce-slow">
          <Gamepad2 className="w-24 h-24 mx-auto text-yellow-300 mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-4 drop-shadow-sm">
            {t("home.title")}
          </h1>
          <p className="text-xl text-white/90 font-semibold italic">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Grid Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {GAME_REGISTRY.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`group relative bg-gradient-to-br ${game.thumbnailColor} rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 border-4 border-white/20 overflow-hidden active:scale-95`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />

              <div className="relative z-10">
                <div className="text-7xl mb-6 transition-transform group-hover:scale-110 duration-300">
                  {game.icon}
                </div>
                {/* Đảm bảo key trong json phải khớp với game.titleKey */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t(game.titleKey)}
                </h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-3">
                  {t(game.descriptionKey)}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-white/40 text-sm font-medium tracking-widest">
          {t("home.footer")}
        </div>
      </div>
    </div>
  );
};