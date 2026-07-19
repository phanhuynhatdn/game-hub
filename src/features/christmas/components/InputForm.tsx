import React from "react";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface InputFormProps {
  inputNames: string;
  setInputNames: (names: string) => void;
  isMatching: boolean;
  onMatch: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputNames,
  setInputNames,
  isMatching,
  onMatch,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto glass-panel p-6 md:p-8 mb-8 relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-glass"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full"></div>

      <div className="flex items-center gap-3 mb-6 justify-center text-white">
        <Users size={28} className="text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-100">
          {t("christmas.inputLabel")}
        </h2>
      </div>

      <textarea
        value={inputNames}
        onChange={(e) => setInputNames(e.target.value)}
        className="w-full p-4 bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-base md:text-lg font-semibold rounded-2xl outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 shadow-inner resize-none transition-all duration-300"
        rows={4}
        placeholder={t("christmas.placeholder") || "Nhập danh sách tên ngăn cách bởi dấu phẩy (,)..."}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onMatch}
        disabled={isMatching}
        className="w-full mt-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-2xl font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMatching ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{t("christmas.btnMatching")}</span>
          </>
        ) : (
          <span>{t("christmas.btnMatch")}</span>
        )}
      </motion.button>
    </motion.div>
  );
};
export default InputForm;
