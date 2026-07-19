import React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.resolvedLanguage || "vi";
  const targetLang = currentLang.startsWith("vi") ? "en" : "vi";
  const switchLabel = targetLang === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt";

  const toggleLanguage = () => {
    i18n.changeLanguage(targetLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 glass-button px-5 py-2.5 rounded-2xl text-white font-bold group"
      title={t("common.switchLabel")}
    >
      <Languages className="w-5 h-5 text-yellow-300 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
      <span className="tracking-wide">{switchLabel}</span>
    </button>
  );
};
